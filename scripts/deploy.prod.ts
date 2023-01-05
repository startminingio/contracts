import {run, ethers} from "hardhat";

async function ProdDeployment() {
    const baseURI = 'ipfs://bafkreiag3athc2fwzmxmv4cmd63pxy53zf4w4da7smzdqbqnleouadnzki/'
    const MainnetAggregator = "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419"
    const USDT = "0xdAC17F958D2ee523a2206206994597C13D831ec7"
    const recipient = "0x1541E4Cc67b9BF569F0Ff1e25aC524187d2d3E5a"

    // Récupération de tous les contrats
    const startMining721 = await ethers.getContractFactory("StartMining721")
    const staking = await ethers.getContractFactory("Staking")

    console.log("Deploying token...")
    const StartMining721 = await startMining721.deploy(baseURI, USDT, recipient, MainnetAggregator)
    await StartMining721.deployed()
    console.log("StartMining721 deployed to:", StartMining721.address);
    console.log("Waiting 30 seconds before verifying the token... (to avoid errors)")
    await delay(30000)
    console.log("Verify token contract...")
    try {
        await run(`verify:verify`, {
            address: StartMining721.address,
            constructorArguments: [baseURI, USDT, recipient, MainnetAggregator],
        })
        console.log("Token verified !")
    } catch (error) {
        console.log("Already verified");
    }

    console.log("Deploying staking...");
    const Staking = await staking.deploy(StartMining721.address);
    await Staking.deployed();
    console.log("Staking deployed to:", Staking.address);

    console.log("Waiting 30 seconds before verifying the staking... (to avoid errors)");
    await delay(30000);
    console.log("Verify staking contract...")

    try {
        await run(`verify:verify`, {
            address: Staking.address,
            constructorArguments: [StartMining721.address],
        })
        console.log("Staking verified !")
    } catch (error) {
        console.log("Already verified");
    }

    console.log("Activate nft contract...")
    await StartMining721.toggleSalePaused()

    console.log("Resume : ")
    console.log("StartMining721 address :", StartMining721.address);
    console.log("Staking address :", Staking.address);
}

ProdDeployment().then();

const delay = ms => new Promise(res => setTimeout(res, ms));
