import React, {useContext,useState,useEffect,useRef} from 'react';
import chainImg from './imgs/xrpLogo.png';

const SessionCxt = React.createContext();

export function useSessionCxt() {
  return useContext(SessionCxt);
}

export function ChainFuncs({children}) {
  const [loading, setLoading] = useState(true);
  const [isEnabled, setIsEnabled] = useState(false);
  const [chain, setChain] = useState({npm:'npm:snapxrpl', name:'XRP', ticker:'XRP', img:chainImg, importUrl:'https://snapalgo.com/importaccount'});
  const [account, setAccount] = useState({});
  const [balance, setBalance] = useState(0);
  const [balanceUsd, setBalanceUsd] = useState(0);
  const [assets, setAssets] = useState();
  const [txns, setTxns] = useState();
  const [network, setNetwork] = useState();

  const networkList = {
    'testnet-v1.0':'testnet',
    'mainnet-v1.0':'mainnet'
  }

  async function enable(){
    window.parent.postMessage(
      {enabled: true},"*"
    );

    try{
      const thing = await window.ethereum.request({
        method: 'wallet_enable',
        params: [{
          wallet_snap: { [chain.npm]: {} },
        }]
      })
      setIsEnabled(true);
    }
    catch(e){
      if(e.code === 4001){
        console.log("rejected");
        return;
      }
      else{
        alert("you must install metamask flask to use this libary")
        throw(e);
      }
    }
  }

  async function transferAsset(txn){
    return true;
  }

  async function createAccount(name){
    let newAccount = await window.ethereum.request({
      method: 'wallet_invokeSnap',
      params: [chain.npm, {
        method: 'createAccount',
        params:{
            name: name
        }
      }]
    })
    if(newAccount){
      window.parent.postMessage({callFunction: 'enable'},"*");
    }
  }

  async function showMnemonic(){
    return true;
  }

  async function checkAddress(address){
    return true;
  }

  async function getAssets(){
    setAssets({});
  }

  async function getTransactions(){
    setTxns(null);
  }

  function selectChain(newChain){
    setChain(newChain)
  }

  function changeNetwork(newNetwork){
    setNetwork(networkList[newNetwork.genesisId])
  }

  async function changeAccount(account){
    setAccount({name:account, addr:account})
  }

  async function updateBalance(){
    try{
    let usdPrice = 2;
    let newbalance = await window.ethereum.request({
      method: 'wallet_invokeSnap',
      params: [chain.npm, {
        method: 'getBalance',
        params:{
          network: network
        }
      }]
    })
    newbalance /= 1000000
    console.log(newbalance)
    let usdBalance = newbalance * usdPrice;
    setBalance(newbalance.toFixed(3))
    setBalanceUsd(usdBalance.toFixed(2))
    } catch {
      setBalance(0)
      setBalanceUsd(0)
    }
  }

  const updateValues = async () => {
    getAssets();
    getTransactions();
    updateBalance();
  }

  function handlePostMessage(message) {
    if(message.hasOwnProperty('network')){
      changeNetwork(message.network)
    }
    if(message.hasOwnProperty('account')){
      changeAccount(message.account)
    }
  }

  const value = {
    account,
    assets,
    balance,
    balanceUsd,
    chain,
    checkAddress,
    createAccount,
    enable,
    getAssets,
    getTransactions,
    isEnabled,
    network,
    selectChain,
    showMnemonic,
    transferAsset,
    txns,
    updateValues
  }

  useEffect(() => {
    window.addEventListener('message', (event) => { handlePostMessage(event.data) });
    setLoading(false);
  }, []);

  useEffect(() => {
    updateValues()
  }, [network, account]);

  return (
    <SessionCxt.Provider value={value}>
      {!loading && children}
    </SessionCxt.Provider>
  );
}