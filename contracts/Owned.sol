//////////////////////////////////////////////////////////
// For training purposes only.
// Not suitable for actual use.
// WARNING: This code includes intentional errors.
//////////////////////////////////////////////////////////

pragma solidity 0.4.15;

contract Owned {

    address public owner;

    event LogNewOwner(address sender, address oldOwner, address newOwner);

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    function Owned() public {
        owner = msg.sender;
    }

    function changeOwner(address newOwner)
        public
        onlyOwner
        returns(bool success)
    {
        LogNewOwner(msg.sender, owner, newOwner);
        owner = newOwner;
        return true;
    }

}
