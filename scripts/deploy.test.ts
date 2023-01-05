import {run, ethers} from "hardhat";

async function ProdDeployment() {
    const baseURI = 'ipfs://bafkreiag3athc2fwzmxmv4cmd63pxy53zf4w4da7smzdqbqnleouadnzki/'
    const GoerliAggregator = "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e"
    const recipient = "0xF096D4e0C02E4115aec303C656BA4b33880aB0e9"

    const testTether = await ethers.getContractFactory("TestTether")
    const startMining721 = await ethers.getContractFactory("StartMining721")
    const staking = await ethers.getContractFactory("Staking")


    console.log("Deploying TestTether...")
    const TestTether = await testTether.deploy()
    await TestTether.deployed()
    console.log("TestTether deployed to:", TestTether.address)
    console.log("Waiting 30 seconds...")
    await delay(30000);
    console.log("Verify contract...")
    try {
        await run("verify:verify", {
            address: TestTether.address,
            constructorArguments: [],
        })
    } catch (e) {
        console.log(e)
    }

    console.log("Deploying token...")
    const StartMining721 = await startMining721.deploy(baseURI, TestTether.address, recipient, GoerliAggregator)
    await StartMining721.deployed()
    console.log("StartMining721 deployed to:", StartMining721.address)
    console.log("Waiting 30 seconds before verifying the token... (to avoid errors)")
    await delay(30000)
    console.log("Verify token contract...")
    try {
        await run(`verify:verify`, {
            address: StartMining721.address,
            constructorArguments: [baseURI, TestTether.address, recipient, GoerliAggregator],
        })
        console.log("Token verified !")
    } catch (error) {
        console.log("Already verified")
    }

    console.log("Deploying staking...");
    const Staking = await staking.deploy(StartMining721.address)
    await Staking.deployed()
    console.log("Staking deployed to:", Staking.address)

    console.log("Waiting 30 seconds before verifying the staking... (to avoid errors)")
    await delay(30000);
    console.log("Verify staking contract...")

    try {
        await run(`verify:verify`, {
            address: Staking.address,
            constructorArguments: [StartMining721.address],
        })
        console.log("Staking verified !")
    } catch (error) {
        console.log("Already verified")
    }

    console.log("Activate nft contract...")
    await StartMining721.toggleSalePaused()

    console.log("Resume : ")
    console.log("TestTether deployed to:", TestTether.address)
    console.log("StartMining721 address :", StartMining721.address)
    console.log("Staking address :", Staking.address)
}

ProdDeployment().then();

const delay = ms => new Promise(res => setTimeout(res, ms));
