
const chains = {
    'eth':{
        type:'native',
        chainCode:"0x1",
        name: 'etherium',
        ticker: 'ETH'
    },
    'bsc': {
        type: 'imported',
        chainCode:'0x38',
        name: 'Binance Smart Chain',
        ticker: 'BSC',
        url: ['https://bsc-dataseed.binance.org/']
    },
    'algo': {
        type: 'snap',
        name: 'algorand',
        url: 'npm:algorand',
        ticker: "ALGO"
    }
}
export default class Utils{
    static async getMin(fromTicker, toTicker){
        fromTicker = fromTicker.toLowerCase();
        toTicker = toTicker.toLowerCase();
        console.log("from ticker is", fromTicker);
        console.log("to ticker is", toTicker);
        const result = await window.ethereum.request({
            method: 'wallet_invokeSnap',
            params: ["npm:algorand", 
            {
                method: 'getMin',
                params:{
                  from: fromTicker,
                  to: toTicker
                }
            }
            ]
        });
        console.log(result)
        return result;
    }
    static async switchChain(ticker){
        try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: chains[ticker].chainCode }],
            });
          } catch (switchError) {
            // This error code indicates that the chain has not been added to MetaMask.
            if (switchError.code === 4902) {
              try {
                await window.ethereum.request({
                  method: 'wallet_addEthereumChain',
                  params: [
                    {
                      chainId: chains[ticker].chainCode,
                      chainName: chains[ticker].name,
                      rpcUrls: chains[ticker].url/* ... */,
                    },
                  ],
                });
              } catch (addError) {
                // handle "add" error
              }
            }
            // handle other "switch" errors
          }
    }
    static async getBalance(ticker){
        ticker = ticker.toLowerCase();
        
        if(ticker === "algo"){
            const result = await window.ethereum.request({
                method: 'wallet_invokeSnap',
                params: ["npm:algorand", 
                {
                  method: 'getSpendable',
                }
                ]
            });
            console.log("result is ", result);
            if(result < 0){
              return 0
            }
            return result/1000000;
        }
        
        await this.switchChain(ticker)
        console.log("window.web3 is ");
        console.log(window.web3);
        const address = window.ethAddress
        console.log(address)
        const balance = await window.web3.eth.getBalance(address)
        const gasFee = (await window.web3.eth.getGasPrice()) * 25000;
        console.log("gasfee is");
        console.log(gasFee);
        console.log(balance-gasFee);
        return Number(window.web3.utils.fromWei(String((balance-gasFee)))).toFixed(5)
    }
}