import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import abi from './utils/WavePortal.json';

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [allWaves, setAllWaves] = useState([]);
  const [userMessage, setUserMessage] = useState(""); // Added this line for custom message 
  const contractAddress = "0xf7d5700da3964a6ef1f7dbbe4c0a88d6ebd7b6e7"; //important! 1 every time after re-deploying ur contract 
  // 2 every time after contract deployment make sure you copy paste the new abi file from the artifacts folder to the utils 
  const contractABI = abi.abi;
  
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have MetaMask installed!");
        return;
      } else {
        console.log("We have the Ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
      } else {
        console.log("No authorized account found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  // const wave = async () => {
  //   try {
  //     const { ethereum } = window;
      
  //     if (ethereum) {
  //       const provider = new ethers.providers.Web3Provider(ethereum);
  //       const signer = provider.getSigner();
  //       const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

  //       let count = await wavePortalContract.getTotalWaves();
  //       console.log("Retrieved total wave count...", count.toNumber());
  //       //const waveTxn = await wavePortalContract.wave();
  //       const waveTxn = await wavePortalContract.wave("this is a message"); //temp
  //       console.log("Mining...", waveTxn.hash);

  //       await waveTxn.wait();
  //       console.log("Mined -- ", waveTxn.hash);

  //       count = await wavePortalContract.getTotalWaves();
  //       console.log("Retrieved total wave count...", count.toNumber());
  //     } else {
  //       console.log("Ethereum object doesn't exist!");
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }
  
  const wave = async () => {
    try {
      const { ethereum } = window;
  
      if (ethereum) {
         // Connect to the Ethereum network using MetaMask provider
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        // Create a contract instance using the contract address and ABI
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
         // Send a wave transaction to the contract with the user's message and gas limit
        const waveTxn = await wavePortalContract.wave(userMessage, { gasLimit: 300000 })
        console.log("Mining...", waveTxn.hash);
         // Wait for the transaction to be mined and confirmed on the blockchain
        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);
        // Clear the message input field
        setUserMessage(""); // clear the message input field
        // Fetch and update all waves to reflect the new wave on the UI
        getAllWaves(); // call to update UI with the new wave
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.error(error);
    }
  };  
  

  const getAllWaves = async () => {
    const { ethereum } = window;
  
    try {
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
        const waves = await wavePortalContract.getAllWaves();
  
        const wavesCleaned = waves.map(wave => {
          return {
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message,
          };
        });
  
        setAllWaves(wavesCleaned);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  
  useEffect(() => {
    let wavePortalContract;
  
    const onNewWave = (from, timestamp, message) => {
      console.log("NewWave", from, timestamp, message);
      setAllWaves(prevState => [
        ...prevState,
        {
          address: from,
          timestamp: new Date(timestamp * 1000),
          message: message,
        },
      ]);
    };
  
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
  
      wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
      wavePortalContract.on("NewWave", onNewWave);
    }
  
    return () => {
      if (wavePortalContract) {
        wavePortalContract.off("NewWave", onNewWave);
      }
    };
  }, []);
  const handleInputChange = (event) => {
    setUserMessage(event.target.value);
  };

  useEffect(() => {
    checkIfWalletIsConnected();
    getAllWaves();
  }, []);

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">👋 Hey there!</div>
        <div className="bio">
          I am Hristo and this is my first web3 project that's pretty cool right? Connect your Ethereum wallet and wave at me!
        </div>

        <input
          type="text"
          placeholder="Enter your custom message here"
          value={userMessage}
          onChange={handleInputChange}
        />

        <button className="waveButton" onClick={wave}>
          Wave at Me
        </button>

        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}

        {allWaves.map((wave, index) => (
          <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
            <div>Address: {wave.address}</div>
            <div>Time: {wave.timestamp.toString()}</div>
            <div>Message: {wave.message}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
