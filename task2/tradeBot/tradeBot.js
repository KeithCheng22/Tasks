// Import relevant discrepancies 
const { ethers } = require('ethers');
const { UniswapV2Router02Address, PrivateKey } = require('./config');

// Ethereum provider (Mainnet Fork)
const provider = new ethers.providers.JsonRpcProvider('http://localhost:8545');

// Wallet using a private key (Used INFURA)
const wallet = new ethers.Wallet(PrivateKey, provider);
const myWalletAddress = wallet.address;

// Check balance of wallet prior to swap
async function getEthBalance() {
    const balanceWei = await wallet.getBalance();
    const balanceEth = ethers.utils.formatEther(balanceWei);

    console.log(`ETH balance for address ${myWalletAddress}: ${balanceEth} ETH`);
}

getEthBalance().catch((error) => console.error(error));

// DAI Token contract address
const daiTokenAddress = '0x6B175474E89094C44Da98b954EedeAC495271d0F';

// ETH Token contract address
const ethTokenAddress = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"

// DAI Token contract interface
const daiTokenInterface = new ethers.utils.Interface([
    'function balanceOf(address account) external view returns (uint256)',
]);

// Function to get DAI balance
async function getDaiBalance() {
    try {
        // Get DAI balance
        const balance = await wallet.call({
            to: daiTokenAddress,
            data: daiTokenInterface.encodeFunctionData('balanceOf', [myWalletAddress]),
        });

        // Convert balance from hex to BigNumber
        const balanceBigNumber = ethers.BigNumber.from(balance);

        // Convert balance to human-readable format
        const balanceDai = ethers.utils.formatUnits(balanceBigNumber, 18); // Assuming 18 decimals for DAI

        console.log(`DAI balance for address ${myWalletAddress}: ${balanceDai} DAI`);
    } catch (error) {
        console.error('Error getting DAI balance:', error);
    }
}


// Uniswap router contract
const uniswapRouter = new ethers.Contract(
    UniswapV2Router02Address,
    [
        'function swapExactETHForTokens(uint256 amountOutMin, address[] calldata path, address to, uint256 deadline) external payable returns (uint256[] memory amounts)',
    ],
    wallet
);

// Swap of ETH for DAI tokens
async function main() {
    try {
        const amountOutMin = 0;
        const deadline = Math.floor(Date.now() / 1000) + 60 * 5;

        const path = [ethTokenAddress, daiTokenAddress]; // Ensure the ETH and DAI Pair** https://v2.info.uniswap.org/pair/0xa478c2975ab1ea89e8196811f51a7b7ade33eb11

        // Confirmation log between the two tokens to be swapped
        console.log('Attempting swap with path:', path);
        console.log("\n----- Wallet initial amount: ----- ")
        // Swap transaction
        const result = await uniswapRouter.swapExactETHForTokens(
            amountOutMin,
            path,
            wallet.address,
            deadline,
            { value: ethers.utils.parseEther('1'), gasLimit: 2000000}
        );

        console.log('\nSwap successful. Transaction hash:', result.hash);
        console.log("\n----- Wallet final amount: -----")
        getEthBalance().catch((error) => console.error(error));
        getDaiBalance().catch((error) => console.error(error));
    } catch (error) {
        console.error('Error during swap:', error);
    }
}

main();







