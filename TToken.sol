// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

pragma solidity ^0.5.12;

// Test Token

contract TToken is ISwapXToken {

    string private _name;
    string private _symbol;
    uint8   private _decimals;

    address private _owner;

    uint internal _totalSupply;

    mapping(address => uint)                   private _balance;
    mapping(address => mapping(address=>uint)) private _allowance;

    modifier _onlyOwner_() {
        require(msg.sender == _owner, "ERR_NOT_OWNER");
        _;
    }

    event Approval(address indexed src, address indexed dst, uint amt);
    event Transfer(address indexed src, address indexed dst, uint amt);

    // Math
    function add(uint a, uint b) internal pure returns (uint c) {
        require((c = a + b) >= a);
    }
    function sub(uint a, uint b) internal pure returns (uint c) {
        require((c = a - b) <= a);
    }

    constructor(
        string memory name,
        string memory symbol,
        uint8 decimals
    ) public {
        _name = name;
        _symbol = symbol;
        _decimals = decimals;
        _owner = msg.sender;
    }

    function name() public view returns (string memory) {
        return _name;
    }

    function symbol() public view returns (string memory) {
        return _symbol;
    }

    function decimals() public view returns(uint8) {
        return _decimals;
    }

    function _move(address src, address dst, uint amt) internal {
        require(_balance[src] >= amt, "ERR_INSUFFICIENT_BAL");
        _balance[src] = sub(_balance[src], amt);
        _balance[dst] = add(_balance[dst], amt);
        emit Transfer(src, dst, amt);
    }

    function _push(address to, uint amt) internal {
        _move(address(this), to, amt);
    }

    function _pull(address from, uint amt) internal {
        _move(from, address(this), amt);
    }

    function _mint(address dst, uint amt) internal {
        _balance[dst] = add(_balance[dst], amt);
        _totalSupply = add(_totalSupply, amt);
        emit Transfer(address(0), dst, amt);
    }

    function allowance(address src, address dst) external view returns (uint) {
        return _allowance[src][dst];
    }

    function balanceOf(address whom) external view returns (uint) {
        return _balance[whom];
    }

    function totalSupply() public view returns (uint) {
        return _totalSupply;
    }

    function approve(address dst, uint amt) external returns (bool) {
        _allowance[msg.sender][dst] = amt;
        emit Approval(msg.sender, dst, amt);
        return true;
    }

    function mint(address dst, uint256 amt) public _onlyOwner_ returns (bool) {
        _mint(dst, amt);
        return true;
    }

    function burn(uint amt) public returns (bool) {
        require(_balance[address(this)] >= amt, "ERR_INSUFFICIENT_BAL");
        _balance[address(this)] = sub(_balance[address(this)], amt);
        _totalSupply = sub(_totalSupply, amt);
        emit Transfer(address(this), address(0), amt);
        return true;
    }

    function transfer(address dst, uint amt) external returns (bool) {
        _move(msg.sender, dst, amt);
        return true;
    }

    function transferFrom(address src, address dst, uint amt) external returns (bool) {
        require(msg.sender == src || amt <= _allowance[src][msg.sender], "ERR_BTOKEN_BAD_CALLER");
        _move(src, dst, amt);
        if (msg.sender != src && _allowance[src][msg.sender] != uint256(-1)) {
            _allowance[src][msg.sender] = sub(_allowance[src][msg.sender], amt);
            emit Approval(msg.sender, dst, _allowance[src][msg.sender]);
        }
        return true;
    }


//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////

    modifier onlyIssuer() {
        require(issuer[msg.sender], "The caller does not have issuer role privileges");
        _;
    }

    /**
      * @dev We don't set any data apart from the proxy address here, as we are in the
      * wrong context if deployed through the proxy.
      */
    constructor () public {
        _decimals = 18;
        verified = false;
        owner = msg.sender;
        issuer[msg.sender] = true;
    }

    // called once by the factory at time of deployment
    function initialize(string memory name, string memory sym, uint maxSupply) _onlyOwner_ public {
        _symbol = sym;
        _name = name;
        //        _name = 'Pair Token';
        if (maxSupply != 0) {
            _maxSupply = maxSupply;
        }

    }


    /**
     * Allows the current contract owner to transfer ownership to a new address.
     * @param newOwner The new contract owner
     */
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

 
    /**
     * Allows an authorized issuer to isue new tokens
     * @param account The account to be credited
     * @param amount The balance to issue.
     */
    function issue(address account, uint256 amount) external onlyIssuer returns (bool) {
        _mint(account, amount);
        return true;
    }
    /**
    * @dev Adds a complianceRole address with specific regulatory compliance privileges.
    * @param _addr The address to be added
    */
    function addIssuer(address _addr) external onlyOwner returns (bool){
        require(_addr != address(0), "address cannot be 0");
        if (issuer[_addr] == false) {
            issuer[_addr] = true;
            return true;
        }
        return false;
    }

    /**
     * @dev Removes complianceRole address with specific regulatory compliance privileges.
     * @param _addr The address to be removed
     */
    function removeIssuer(address _addr) external onlyOwner returns (bool) {
        require(_addr != address(0), "address cannot be 0");
        if (issuer[_addr] == true) {
            issuer[_addr] = false;
            return true;
        }
        return false;
    }

    /*
     *Internal functions
     */



    function verify(bool _verified) onlyOwner external{
        verified = _verified;
    }

}
