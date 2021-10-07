import Web3 from 'web3'
import Web4 from '@cryptonteam/web4'
import BigNumber from 'bignumber.js';
import { ERC20Abi } from './abis'

const { ethereum } = window;
let web4 = new Web4();
let web3Wallet;
let web3Guest
let userAddress;
let chainId;

const tokenAddressArray = [
    '0x4b107a23361770534bd1839171bbf4b0eb56485c',
    '0xc13da4146d381c7032ca1ed6050024b4e324f4ef',
    '0x8d0c36c8842d1dc9e49fbd31b81623c1902b7819',
    '0xa364f66f40b8117bbdb772c13ca6a3d36fe95b13',
]

export const connectWallet = async () => {
    try {
        if (!ethereum) {
            console.log('metamask is not install')
            return false;
        }
        web3Wallet = new Web3(ethereum); // init web3
        if (await web3Wallet.eth.getCoinbase() === null) { // проверяем подключен ли metamask
            await ethereum.enable(); // подключить metamask
        }
        userAddress = await web3Wallet.eth.getCoinbase(); // получить адрес пользователя
        chainId = await web3Wallet.eth.net.getId(); // запись сети
        if (+chainId !== 4) {
            console.log('current project work on rinkeby network')
            return false;
        }
        await web4.setProvider(ethereum, userAddress);
        return true;
    } catch (err) {
        return false;
    }
};

export const checkConnect = async () => {
    web3Wallet = new Web3(ethereum);
    let conntected = false
    if (await web3Wallet.eth.getCoinbase() === null) {
        conntected = false
    } else { conntected = true }
    return conntected
}

export const getUserAddress = async () => {
    web3Wallet = new Web3(ethereum);
    userAddress = await web3Wallet.eth.getCoinbase();
    return userAddress
}


export const connectNode = () => {
    try {
        let bscUrl
        if (process.env.IS_MAINNET === 'true') {
            bscUrl = 'wss://mainnet.infura.io/ws/v3/a146e88019d34a119d7487d43116551f'
        } else {
            bscUrl = 'wss://rinkeby.infura.io/ws/v3/a146e88019d34a119d7487d43116551f'
        }
        const provider = new Web3.providers.WebsocketProvider(bscUrl)
        web3Guest = new Web3(provider)
        return true
    } catch (e) {
        return false
    }
}

export const fetchContractData = async (method, abi, address, params) => {
    try {
        const contract = new web3Guest.eth.Contract(abi, address)
        return await contract.methods[method].apply(this, params).call()
    } catch (e) {
        console.log(e)
        return ''
    }
}

export const getTokens = async () => {
    let objectArray = []
    for (let i = 0; i < tokenAddressArray.length; i++) {
        const symbol = await fetchContractData('symbol', ERC20Abi, tokenAddressArray[i])
        const name = await fetchContractData('name', ERC20Abi, tokenAddressArray[i])
        const decimals = await fetchContractData('decimals', ERC20Abi, tokenAddressArray[i])
        const object = {
            symbol: symbol,
            name: name,
            decimals: decimals,
            address: tokenAddressArray[i],
        }
        objectArray = [...objectArray, object]
    }
    return objectArray
}

export const getBalance = async (tokenAddress) => {
    const userAddress = await getUserAddress()
    if (!userAddress) {
        return 0
    }
    const decimals = await fetchContractData('decimals', ERC20Abi, tokenAddress)
    let balance = await fetchContractData(
        'balanceOf',
        ERC20Abi,
        tokenAddress,
        [userAddress]
    )
    balance = new BigNumber(balance).shiftedBy(-decimals).toString()
    return balance
}

export const getAllowance = async (token, recipient) => {
    if (!token || !recipient) {
        return "-"
    }
    userAddress = await getUserAddress();
    const allowance = await fetchContractData('allowance', ERC20Abi, token.address, [userAddress, recipient])
    const result = new BigNumber(allowance).shiftedBy(-token.decimals).toString();
    return result
}

export const tokenAction = async (action, token, recipient, iAmount) => {
    if (!token || !recipient || !iAmount) {
        return
    }
    try {
        userAddress = await getUserAddress();
        await web4.setProvider(ethereum, userAddress);

        const absErc20 = web4.getContractAbstraction(ERC20Abi);
        const instExampleToken = await absErc20.getInstance(token.address);
        const amount = new BigNumber(iAmount).shiftedBy(+token.decimals).toString();
        let result = []
        switch (action) {
            case 'approve':
                result = await instExampleToken.approve(recipient, amount);
                break;
            case 'transfer':
                result = await instExampleToken.transfer(recipient, amount);
                break;
        }
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}