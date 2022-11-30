import React, {useContext,useState,useEffect,useRef} from 'react';

const SessionCxt = React.createContext();

export function useSessionCxt() {
  return useContext(SessionCxt);
}

export function ChainFuncs({children}) {
  const [loading, setLoading] = useState(true);
  const [isEnabled, setIsEnabled] = useState(false);
  const [chain, setChain] = useState({npm:'npm:algorand', name:'Algorand', img:'https://asa-list.tinyman.org/assets/0/icon.png'});
  const [network, setNetwork] = useState('');
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState(0);
  const [balanceUsd, setBalanceUsd] = useState(0);
  const [testnet, setTestnet] = useState(true);
  const assetsRef = useRef();

  async function preload(){
    await enable();
    await getAssets();
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
        updateBalance();
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

  async function getAssets(){
    let assets = await window.ethereum.request({
      method: 'wallet_invokeSnap',
      params: ["npm:algorand",{
          method: 'getAssets',
          params:{
              testnet: testnet
          }
      }]
    });
    assetsRef.current=assets;
  }

  function selectChain(newChain){
    setChain(newChain)
  }

  function changeNetwork(newNetwork){
    setNetwork(newNetwork)
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
              testnet: testnet
          }
        }]
    })
    balance = balance/1000000;
    let usdBalance = balance * usdPrice;
    setBalance(balance.toFixed(3))
    setBalanceUsd(usdBalance.toFixed(2))
  }

  function handlePostMessage(message) {
    console.log(message)
    if(message.hasOwnProperty('network')){
        changeNetwork(message.network)
    }
    if(message.hasOwnProperty('account')){
        changeAccount()
    }
  }

  const value = {
    account,
    assetsRef,
    balance,
    balanceUsd,
    chain,
    enable,
    isEnabled,
    preload,
    selectChain
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