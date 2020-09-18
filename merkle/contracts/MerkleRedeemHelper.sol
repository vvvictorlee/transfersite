pragma solidity 0.6.0;
pragma experimental ABIEncoderV2;

import "./MerkleRedeem.sol";

contract MerkleRedeemHelper {
    address public merkleRedeemAddress;
    address public owner;

    constructor() public {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Must be the contract owner");
        _;
    }

    function setAddress(address redeem) external onlyOwner {
        if (merkleRedeemAddress != redeem) {
            merkleRedeemAddress = redeem;
        } else {
            revert("No amount would be minted - not gonna waste your gas");
        }
    }

    struct Claim {
        uint256 epoch;
        address token;
        uint256 balance;
        bytes32[] merkleProof;
    }

    function claimEpochs(address _liquidityProvider, Claim[] memory claims)
        public
    {
        require(
            merkleRedeemAddress != address(0),
            "merkleredeem address cannot be zero"
        );

        MerkleRedeem merkleRedeem = MerkleRedeem(merkleRedeemAddress);

        Claim memory claim;
        for (uint256 i = 0; i < claims.length; i++) {
            claim = claims[i];

            merkleRedeem.claimEpoch(
                _liquidityProvider,
                claim.epoch,
                claim.token,
                claim.balance,
                claim.merkleProof
            );
        }
    }
}
