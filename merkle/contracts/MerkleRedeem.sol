pragma solidity 0.6.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/cryptography/MerkleProof.sol";
import "./IERC20.sol";
import "./ISwapXToken.sol";

contract MerkleRedeem {
    address public tokenAddress;
    address public owner;

    event Claimed(address _claimant,address _token, uint256 _balance);

    // Recorded epochs
    uint256 latestEpoch;
    mapping(uint256 => bytes32) public epochMerkleRoots;
    mapping(uint256 => uint256) public epochTimestamps;
    mapping(uint256 => bytes32) public epochBlockHashes;
    mapping(uint256 => mapping(address => mapping(address => bool))) public claimed;

    address[] public tokens;

    constructor() public {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Must be the contract owner");
        _;
    }

    modifier requireEpochInPast(uint256 epoch) {
        require(epoch <= latestEpoch, "Epoch cannot be in the future");
        _;
    }

    modifier requireEpochRecorded(uint256 _epoch) {
        require(epochTimestamps[_epoch] != 0);
        require(epochBlockHashes[_epoch] != 0);
        _;
    }

    modifier requireMerkleRootUnset(uint256 _epoch) {
        require(epochMerkleRoots[_epoch] == bytes32(0));
        _;
    }

    modifier requireUnverified(address _token) {
        require(verified(_token) == false);
        _;
    }



    function verify(address _token) external onlyOwner requireUnverified(_token) {
        ISwapXToken(_token).verify(true);
        tokens.push(_token);
    }

    function verified(address _token) public returns (bool) {
        for (uint256 i = 0; i < tokens.length; i++) {
            if (_token == tokens[i]) {
                return true;
            }
        }
        return false;
    }

    function issue(address _token ,uint256 amount) external onlyOwner {
        if (amount > 0) {
            ISwapXToken(_token).issue(address(this), amount);
        } else {
            revert("No amount would be minted - not gonna waste your gas");
        }
    }

    function disburse(address _liquidityProvider, address _token,uint256 _balance) private {
        if (_balance > 0) {
            IERC20(_token).transfer(_liquidityProvider, _balance);
            emit Claimed(_liquidityProvider, _token,_balance);
        } else {
            revert("No balance would be transfered - not gonna waste your gas");
        }
    }

    function offsetRequirementMet(address user, uint256 _epoch)
        public
        view
        returns (bool)
    {
        bytes32 blockHash = epochBlockHashes[_epoch];
        uint256 timestamp = epochTimestamps[_epoch];
        uint256 offsetSeconds = userEpochOffset(user, blockHash);

        uint256 earliestClaimableTimestamp = timestamp + offsetSeconds;
        return earliestClaimableTimestamp < block.timestamp;
    }

    function claimEpoch(
        uint256 _epoch,
        address _token,
        uint256 _claimedBalance,
        bytes32[] memory _merkleProof
    ) public requireEpochInPast(_epoch) requireEpochRecorded(_epoch) {
        address _liquidityProvider = msg.sender;
        // if trying to claim for the current epoch
        if (_epoch == latestEpoch) {
            require(
                offsetRequirementMet(_liquidityProvider, latestEpoch),
                "It is too early to claim for the current epoch"
            );
        }

        require(!claimed[_epoch][_liquidityProvider][_token]);
        require(
            verifyClaim(
                _liquidityProvider,
                _epoch,
                _token,
                _claimedBalance,
                _merkleProof
            ),
            "Incorrect merkle proof"
        );

        claimed[_epoch][_liquidityProvider][_token] = true;
        disburse(_liquidityProvider, _token,_claimedBalance);
    }

    struct Claim {
        uint256 epoch;
        address token;
        uint256 balance;
        bytes32[] merkleProof;
    }

    mapping(address => uint256) tokenTotalBalances;  //temp mapping
  
    function claimEpochs(Claim[] memory claims)
        public
    {
        address _liquidityProvider = msg.sender;
        Claim memory claim;
        address[] memory _tokens;
        for (uint256 i = 0; i < claims.length; i++) {
            claim = claims[i];
            require(
                claim.epoch <= latestEpoch,
                "Epoch cannot be in the future"
            );
            require(epochTimestamps[claim.epoch] != 0);
            require(epochBlockHashes[claim.epoch] != 0);

            // if trying to claim for the current epoch
            if (claim.epoch == latestEpoch) {
                require(
                    offsetRequirementMet(_liquidityProvider, latestEpoch),
                    "It is too early to claim for the current epoch"
                );
            }

            require(!claimed[claim.epoch][_liquidityProvider][claim.token]);
            require(
                verifyClaim(
                    _liquidityProvider,
                    claim.epoch,
                    claim.token,
                    claim.balance,
                    claim.merkleProof
                ),
                "Incorrect merkle proof"
            );

            if (tokenTotalBalances[claim.token] == uint256(0)) {
                _tokens[_tokens.length]=claim.token;
            }

            tokenTotalBalances[claim.token] += claim.balance;

            claimed[claim.epoch][_liquidityProvider][claim.token] = true;
        }

        for (uint256 i = 0; i < _tokens.length; i++) {
            disburse(
                _liquidityProvider,
                _tokens[i],
                tokenTotalBalances[_tokens[i]]
            );

            delete tokenTotalBalances[_tokens[i]];
        }
        delete _tokens;
    }

    function claimStatus(
        address _liquidityProvider,
        address _token,
        uint256 _begin,
        uint256 _end
    ) public view returns (bool[] memory) {
        uint256 size = 1 + _end - _begin;
        bool[] memory arr = new bool[](size);
        for (uint256 i = 0; i < size; i++) {
            arr[i] = claimed[_begin + i][_liquidityProvider][_token];
        }
        return arr;
    }

    function merkleRoots(uint256 _begin, uint256 _end)
        public
        view
        returns (bytes32[] memory)
    {
        uint256 size = 1 + _end - _begin;
        bytes32[] memory arr = new bytes32[](size);
        for (uint256 i = 0; i < size; i++) {
            arr[i] = epochMerkleRoots[_begin + i];
        }
        return arr;
    }

    function verifyClaim(
        address _liquidityProvider,
        uint256 _epoch,
        address _token,
        uint256 _claimedBalance,
        bytes32[] memory _merkleProof
    ) public view returns (bool valid) {
        bytes32 leaf = keccak256(
            abi.encodePacked(_liquidityProvider, _token,_claimedBalance)
        );
        return MerkleProof.verify(_merkleProof, epochMerkleRoots[_epoch], leaf);
    }

    function userEpochOffset(
        address _liquidityProvider,
        bytes32 _epochBlockHash
    ) public pure returns (uint256 offset) {
        bytes32 hash = keccak256(
            abi.encodePacked(_liquidityProvider, _epochBlockHash)
        );
        assembly {
            offset := mod(
                hash,
                86400 // seconds in a epoch
            )
        }
        return offset;
    }

    function finishEpoch(
        uint256 _epoch,
        uint256 _timestamp,
        bytes32 _blockHash
    ) public onlyOwner {
        epochTimestamps[_epoch] = _timestamp;
        epochBlockHashes[_epoch] = _blockHash;
        if (_epoch > latestEpoch) {
            // just in case we get these out of order
            latestEpoch = _epoch;
        }
    }

    function seedAllocations(uint256 _epoch, bytes32 _merkleRoot)
        external
        requireEpochRecorded(_epoch)
        requireMerkleRootUnset(_epoch)
        onlyOwner
    {
        require(
            epochMerkleRoots[_epoch] == bytes32(0),
            "cannot rewrite merkle root"
        );
        epochMerkleRoots[_epoch] = _merkleRoot;
    }
}
