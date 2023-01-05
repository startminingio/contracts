// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TestTether is ERC20 {
    constructor() ERC20("ERC20Test", "USDT") {
        _mint(msg.sender, 1000000*10**18);
    }

    function mint(address recipient, uint256 amount) external {
        _mint(recipient, amount);
    }
}
