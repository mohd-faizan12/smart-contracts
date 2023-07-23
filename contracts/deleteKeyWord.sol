// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

contract test {
    mapping(address => uint256) public map;

    function setMap(uint256 _a) public {
        map[msg.sender] = _a;
    }

    function removeMap(address _addr) public {
        delete map[_addr];  
    }
}
