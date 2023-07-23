// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


import "@openzeppelin/contracts/access/Ownable.sol";
contract UNIBT is ERC20, Ownable {
    constructor() ERC20("Uniblok token","UNIBT") {
        mint(msg.sender, 100000000000000000000000000);
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}

