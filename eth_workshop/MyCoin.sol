pragma solidity ^0.4.14;

contract MyCoin {
	mapping (address => uint) balances;

	function MyCoin() {
		balances[msg.sender] = 10000;
	}

	function sendCoin(address receiver, uint amount) returns(bool sufficient) {
		if (balances[msg.sender] < amount) return false;
		balances[msg.sender] -= amount;
		balances[receiver] += amount;
		return true;
	}

	function getBalance(address addr) constant returns(uint) {
		return balances[addr];
	}
}
