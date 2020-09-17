pragma solidity 0.6.0;

import "./IERC20.sol";

contract Redeem {

  IERC20 public token;
  address public owner;

  event Allocated(address _claimant, uint256 _time, uint256 _balance);
  event Claimed(address _claimant, uint256 _balance);

  // the outstanding balances for each user (by time)
  mapping(address => uint[]) public timesWithBenefits;
  
  // Recorded times
  uint latestTime;
  uint latestTimeTimestamp;
  bytes32 latestTimeBlockHash;
  mapping(address => mapping(address => uint)) vestedTokenBalances;
  mapping(address => mapping(address => uint)) vestedTokenBalances;
  mapping(address => uint) vestedBalances;
  mapping(address => uint) pendingBalances;
  address[] usersWithPendingBalances;

  constructor(
    address _token
  ) public {
    token = IERC20(_token);
    owner = msg.sender;
  }

  modifier onlyOwner() {
    require(msg.sender == owner, "Must be the contract owner");
    _;
  }

  modifier requireTimeInPast(uint time) {
    require(time <= latestTime, "Time cannot be in the future");
    _;
  }

  modifier requireTimeRecorded(uint _time) {
    require(latestTime != 0);
    require(latestTimeBlockHash != 0);
    _;
  }

  function disburse(address _liquidityProvider, uint _balance) private {
    if (_balance > 0) {
      token.transfer(_liquidityProvider, _balance);
      emit Claimed(_liquidityProvider, _balance);
    } else {
      revert('No balance would be transfered');
    }
  }


  function offsetRequirementMet(address user) view public returns (bool){
      uint offsetSeconds = userTimeOffset(user, latestTimeBlockHash);

      uint earliestClaimableTimestamp = latestTimeTimestamp + offsetSeconds;
      return earliestClaimableTimestamp < block.timestamp;
  }

  // attempt to claim all - if this is too much gas, fallback to claim function above
  function claim() public returns (bool)
  {
    uint balance = vestedBalances[msg.sender];
    delete vestedBalances[msg.sender];

    bool disburseCurrentTime = offsetRequirementMet(msg.sender);
    if (disburseCurrentTime) {
      balance += pendingBalances[msg.sender];
      delete pendingBalances[msg.sender];
    }

    disburse(msg.sender, balance);
  }

  function userTimeOffset(address _liquidityProvider, bytes32 _timeBlockHash) pure public returns (uint offset) {
    bytes32 hash = keccak256(abi.encodePacked(_liquidityProvider, _timeBlockHash));
    assembly {
      offset :=
        mod(
          hash,
          86400 // seconds in a time
        )
    }
    return offset;
  }


  function finishTime(uint _time, uint _timestamp, bytes32 _blockHash) public
  onlyOwner
  {
    if (_time > latestTime) { // just in case we get these out of order
      latestTimeTimestamp = _timestamp;
      latestTimeBlockHash = _blockHash;

      latestTime = _time;

      address lp;
      for(uint i = 0; i < usersWithPendingBalances.length; i += 1) {
        lp = usersWithPendingBalances[i];
        vestedBalances[lp] += pendingBalances[lp];
        delete pendingBalances[lp];
      }
      delete usersWithPendingBalances;
    }
  }

  function balanceOf(address _liquidityProvider) external view returns (uint) {
    return pendingBalances[_liquidityProvider] + vestedBalances[_liquidityProvider];
  }

  function seedAllocations(uint _time, address[] calldata _liquidityProviders, uint[] calldata _balances) external
  requireTimeRecorded(_time)
  onlyOwner
  {
    require(_liquidityProviders.length == _balances.length, "must be an equal number of liquidityProviders and balances");

    address lp;
    for(uint i = 0; i < _liquidityProviders.length; i += 1) {
      lp = _liquidityProviders[i];
      pendingBalances[lp] = _balances[i];

      emit Allocated(lp, _time, _balances[i]);
    }
    usersWithPendingBalances = _liquidityProviders;
  }

  function seedAllocation(uint _time, address _liquidityProvider, uint _bal) external
  requireTimeRecorded(_time)
  onlyOwner
  {
    pendingBalances[_liquidityProvider] = _bal;
    usersWithPendingBalances.push(_liquidityProvider);

    emit Allocated(_liquidityProvider, _time, _bal);
  }

}
