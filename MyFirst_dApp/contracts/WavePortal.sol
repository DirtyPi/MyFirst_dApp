// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

import "hardhat/console.sol";

contract WavePortal {
    uint256 totalWaves;
    uint256 private seed;

    event NewWave(address indexed from, uint256 timestamp, string message);

    struct Wave {
        address waver;
        string message;
        uint256 timestamp;
    }

    Wave[] waves;

    
    mapping(address => uint256) public lastWavedAt;

    constructor() payable {
        console.log("We have been constructed!");
        
        seed = (block.timestamp + block.difficulty) % 100;
    }

    function wave(string memory _message) public {
        // Check if the user has waited for at least 30 seconds since their last wave
       require(lastWavedAt[msg.sender] + 30 seconds < block.timestamp, "Must wait 30 seconds before waving again.");
        // Update the last waved timestamp for the user
        lastWavedAt[msg.sender] = block.timestamp;
        // Increment the total wave count
        totalWaves += 1;
        // Log a message to indicate that the user has waved
        console.log("%s has waved!", msg.sender);
        // Create a new Wave struct with the user's address, message, and the current timestamp
        waves.push(Wave(msg.sender, _message, block.timestamp));
        // Generate a new seed value based on block difficulty, timestamp, and the existing seed
        seed = (block.difficulty + block.timestamp + seed) % 100;
        // Check if the user wins a prize based on the updated seed value
        if (seed <= 50) {
            console.log("%s won!", msg.sender);
            // Define the prize amount
            uint256 prizeAmount = 0.0001 ether;
            // Check if the contract has sufficient balance to cover the prize amount
            require(
                prizeAmount <= address(this).balance,
                "Trying to withdraw more money than they contract has."
            );
             // Transfer the prize amount to the user's address
            (bool success, ) = (msg.sender).call{value: prizeAmount}("");
            require(success, "Failed to withdraw money from contract.");
        }
        // Emit a NewWave event to notify listeners about the new wave
        emit NewWave(msg.sender, block.timestamp, _message);
    }

    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }

    function getTotalWaves() public view returns (uint256) {
        return totalWaves;
    }
}