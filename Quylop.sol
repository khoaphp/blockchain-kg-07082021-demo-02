// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Donate{
    
    address private owner;          // Account/Ví tạo ra SM
    uint public totalMoney;         // Tổng tiền đang có trong SM
    Client[] public arrayClient;    // Lưu trữ những khách đã nạp tiền
    
    struct Client{
        address _Adress;
        uint _Money;
        string _Content;
    }
    
    constructor(){
        owner = msg.sender;      
    }
    
    event SomeoneJustPayMoney(address _a, uint _m, string _c);
    
    function sendDonate(string memory _content) public payable {
        if(msg.value>0){
            totalMoney = totalMoney + msg.value;
            arrayClient.push( Client(msg.sender, msg.value, _content) );
            emit SomeoneJustPayMoney(msg.sender, msg.value, _content);
        }
    }
    
    function clientCounter() public view returns(uint){
        return arrayClient.length;
    }
    
    function get_1_Client(uint _ordering) public view returns(bool, address, uint, string memory){
        if(_ordering>=0 && _ordering<arrayClient.length && arrayClient.length>0){
            return (true, arrayClient[_ordering]._Adress, arrayClient[_ordering]._Money, arrayClient[_ordering]._Content);
        }else{
            return (false, msg.sender, 0, "");
        }
    }
    
}
