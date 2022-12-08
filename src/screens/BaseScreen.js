import { useState } from 'react';
import { useSessionCxt } from '../ChainFuncs.js';
import AssetScreen from './AssetScreen';
import LedgerScreen from './LedgerScreen';
import SwapScreen from './swap/SwapScreen';
import AccountScreen from './AccountScreen';
import accountIcon from '../imgs/account.svg';
import assetIcon from '../imgs/wallet.svg';
import ledgerIcon from '../imgs/ledger.svg';
import swapIcon from '../imgs/AlgoIconExchange.svg';

export default function BaseScreen(){
    const [screen, setScreen] = useState('base');
    const {enable, isEnabled, account, network} = useSessionCxt();

    const unlock = async () => {
        enable();
    }

    return(
            <div className='box'>
                
                {isEnabled?
                <div style={{display:'flex', flexDirection:'row', justifyContent:'right', margin:'2vh 5vw', height:'12vh'}}>
                    <h1 style={{fontSize:'3.5vw'}}>{account.name} - {network}</h1>
                </div>
                :
                <div style={{display:'flex', flexDirection:'column', justifyContent:'center', height:'100vh'}}>
                    <div style={{display:'flex', flexDirection:'row', justifyContent:'center'}}>
                    <button className='defaultButton alt' onClick={unlock}>Unlock Wallet</button>
                    </div>
                </div>}

                {isEnabled?
                <div className='cardBody' style={{display:'flex', flexDirection:'row', justifyContent:'center', overflow:'auto'}}>
                {screen==='base'?
                <AssetScreen />
                :
                null}
                {screen==='ledger'?
                <LedgerScreen />
                :
                null}
                {screen==='swap' && network==='mainnet'?
                <SwapScreen />
                :
                null}
                {screen==='account'?
                <AccountScreen />
                :
                null}
                </div>
                :
                null}

                {isEnabled?
                <div style={{display:'flex', flexDirection:'column', justifyContent:'center', width:'100vw', height:'45px', background:'black'}}>
                <div style={{display:'flex', flexDirection:'row', justifyContent:'center'}}>
                    <img onClick={()=>{setScreen('base')}} className='menuIcon' src={assetIcon} alt='' />
                    <img onClick={()=>{setScreen('ledger')}} className='menuIcon' src={ledgerIcon} alt='' />
                    {network==='mainnet'?<img onClick={()=>{setScreen('swap')}} className='menuIcon' src={swapIcon} alt='' />:null}
                    <img onClick={()=>{setScreen('account')}} className='menuIcon' src={accountIcon} alt='' />
                </div>
                </div>
                :
                null}
            </div>
    );
}