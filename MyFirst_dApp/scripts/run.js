// const main = async () => {
//     const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
//     const waveContract = await waveContractFactory.deploy();
//     await waveContract.deployed();
//     console.log("Contract deployed to:", waveContract.address);
//   };
  
//   const runMain = async () => {
//     try {
//       await main();
//       process.exit(0); // exit Node process without error
//     } catch (error) {
//       console.log(error);
//       process.exit(1); // exit Node process while indicating 'Uncaught Fatal Exception' error
//     }
//     // Read more about Node exit ('process.exit(num)') status codes here: https://stackoverflow.com/a/47163396/7974948
//   };
  
//   runMain();
// old code 
//---------------------------------------------------------------------------

// const main = async () => {
//     const [owner, randomPerson] = await hre.ethers.getSigners();
//     const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
//     const waveContract = await waveContractFactory.deploy();
//     await waveContract.deployed();
  
//     console.log("Contract deployed to:", waveContract.address);
//     console.log("Contract deployed by:", owner.address);
  
//     await waveContract.getTotalWaves();
  
//     const waveTxn = await waveContract.wave();
//     await waveTxn.wait();
  
//     await waveContract.getTotalWaves();
//   };
  
//   const runMain = async () => {
//     try {
//       await main();
//       process.exit(0);
//     } catch (error) {
//       console.log(error);
//       process.exit(1);
//     }
//   };
  
//   runMain();



const main = async () => {
    const [owner, randomPerson] = await hre.ethers.getSigners();
    const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
    const waveContract = await waveContractFactory.deploy();
    await waveContract.deployed();
  
    console.log("Contract deployed to:", waveContract.address);
    console.log("Contract deployed by:", owner.address);
  
    await waveContract.getTotalWaves();
  
    const firstWaveTxn = await waveContract.wave();
    await firstWaveTxn.wait();
  
    await waveContract.getTotalWaves();
  
    const secondWaveTxn = await waveContract.connect(randomPerson).wave();
    await secondWaveTxn.wait();
  
    await waveContract.getTotalWaves();
  };
  
  const runMain = async () => {
    try {
      await main();
      process.exit(0);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  };
  
  runMain();