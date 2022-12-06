import React, {useContext,useState,useEffect,useRef} from 'react';

const SessionCxt = React.createContext();

export function useSessionCxt() {
  return useContext(SessionCxt);
}

export function ChainFuncs({children}) {
  const [loading, setLoading] = useState(true);
  const [isEnabled, setIsEnabled] = useState(false);
  const [chain, setChain] = useState({npm:'npm:algorand', name:'Algorand', ticker:'Algo', img:'https://asa-list.tinyman.org/assets/0/icon.png'});
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState(0);
  const [balanceUsd, setBalanceUsd] = useState(0);
  const [assets, setAssets] = useState();
  const [txns, setTxns] = useState();
  const [testnetUI, setTestnetUI] = useState();
  const testnet = useRef();

  const networkList = {
    'testnet-v1.0':true,
    'mainnet-v1.0':false
  }

  async function updateValues(){
    getAssets();
    getTransactions();
    updateBalance();
  }

  async function enable(){
    window.parent.postMessage(
      {enabled: true},"*"
    );

    try{
        await window.ethereum.request({
          method: 'wallet_enable',
          params: [{
            wallet_snap: { [chain.npm]: {} },
          }]
        })

        setIsEnabled(true);
        changeAccount();
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

  async function transfer(txn){
    try {
    let result = await window.ethereum.request({
      method: 'wallet_invokeSnap',
      params: [chain.npm,{
          method: 'transfer',
          params:{
              amount: txn.amount,
              testnet: testnet.current,
              to: txn.to
          }
      }]
    });
    return result
    } catch (err) {
      return{ error:true,
              msg:'transaction failed'}
    }
  }

  async function transferAsset(txn){
    try {
    let result = await window.ethereum.request({
      method: 'wallet_invokeSnap',
      params: [chain.npm,{
          method: 'transferAsset',
          params:{
              amount: txn.amount,
              assetIndex: txn.assetIndex,
              testnet: testnet.current,
              to: txn.to
          }
      }]
    });
    return result
    } catch (err) {
      return{ error:true,
              msg:'transaction failed'}
    }
  }

  async function createAccount(name){
    await window.ethereum.request({
      method: 'wallet_invokeSnap',
      params: [chain.npm,{
          method: 'createAccount',
          params:{
              name: name
          }
      }]
    });
  }

  async function showMnemonic(){
    await window.ethereum.request({
      method: 'wallet_invokeSnap',
      params: [chain.npm,{
          method: 'displayMnemonic'
      }]
    });
  }

  async function checkAddress(address){
    let result = await window.ethereum.request({
      method: 'wallet_invokeSnap',
      params: [chain.npm,{
          method: 'isValidAddress',
          params:{
              address: address
          }
      }]
    });
    return result
  }

  async function getAssets(){
    let loadedAssets = await window.ethereum.request({
      method: 'wallet_invokeSnap',
      params: [chain.npm,{
          method: 'getAssets',
          params:{
              testnet: testnet.current
          }
      }]
    });
    setAssets(loadedAssets);
  }

  async function getTransactions(){
    let loadedTxns = await window.ethereum.request({
      method: 'wallet_invokeSnap',
      params: [chain.npm, {
        method: 'getTransactions',
        params:{
            testnet: testnet.current
        }
      }]
    })
    setTxns(loadedTxns.transactions);
  }

  function selectChain(newChain){
    setChain(newChain)
  }

  function changeNetwork(newNetwork){
    testnet.current = networkList[newNetwork.genesisId]
    setTestnetUI(networkList[newNetwork.genesisId])
    updateValues();
  }

  async function changeAccount(){
    let currentAccount = await window.ethereum.request({
        method: 'wallet_invokeSnap',
        params: [chain.npm, {
          method: 'getCurrentAccount'
        }]
    })
    setAccount(currentAccount)
  }

  async function updateBalance(){
    let usdPrice = fetch("https://api.coincap.io/v2/assets/algorand" ,{
        method: 'GET',
        redirect: 'follow'
        })
    .then((res)=>res.text())
    .then((text)=>{
        usdPrice = Number(JSON.parse(text).data.priceUsd)
    })
    .catch((error)=>{
        console.log(error);
        usdPrice = 0;
    });

    let balance = await window.ethereum.request({
        method: 'wallet_invokeSnap',
        params: [chain.npm, {
          method: 'getBalance',
          params:{
              testnet: testnet.current
          }
        }]
    })
    balance = balance/1000000;
    let usdBalance = balance * usdPrice;
    setBalance(balance.toFixed(3))
    setBalanceUsd(usdBalance.toFixed(2))
  }

  function handlePostMessage(message) {
    if(message.hasOwnProperty('network')){
      changeNetwork(message.network)
    }
    if(message.hasOwnProperty('account')){
      changeAccount()
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
    selectChain,
    showMnemonic,
    testnetUI,
    transfer,
    transferAsset,
    txns,
    updateValues
  }

  useEffect(() => {
    window.addEventListener('message', (event) => { handlePostMessage(event.data) });
    setLoading(false);
  }, []);

  return (
    <SessionCxt.Provider value={value}>
      {!loading && children}
    </SessionCxt.Provider>
  );
}