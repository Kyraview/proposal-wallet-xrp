import React, { useState, useEffect } from 'react';
import {useSessionCxt} from '../../ChainFuncs.js';
import MainSwapScreen from './MainSwapScreen.jsx';
import web3 from 'web3';
import openUp from './imgs/openUp.svg';
import HistorySwapScreen from './HistorySwapScreen.jsx';

export default function SwapScreen() {
    const {enable} = useSessionCxt();
    const [screen, setScreen] = useState("swap");
    const [slideAnimation, setSlideAnimation] = useState('none');
    const [rotateAnimation, setRotateAnimation] = useState('none');
    const [clickTitle, setClickTitle] = useState('View History');

    useEffect(() => {
        preload();
    });

    const preload = async () => {
        await enable();
        window.web3 = new web3(window.ethereum);
        window.ethAddress = (await window.ethereum.request({ method: 'eth_requestAccounts' }))[0];
    }

    const toggleHistory = async ()=>{
        if(screen === "swap"){
            setSlideAnimation('slideUp 0.5s forwards');
            setRotateAnimation('rotateDown 0.5s forwards');
            setScreen('history');
            setClickTitle("Close History")
        }
        if(screen === "history"){
            setSlideAnimation('slideDown 0.5s forwards');
            setRotateAnimation('rotateUp 0.5s forwards');
            setScreen('swap')
            setClickTitle('View History')
        }
    }

    return ( 
    <div align="center" style={{paddingTop:"15px"}}>
        
        
            {screen==='swap'?
                <MainSwapScreen/>
                :
                null
            }
            {/* {screen==='history'?
                <HistorySwapScreen/>
            :
                null
            } */}
       
        
        <span style={{
            position: 'absolute',
            left:'50%', 
            transform:'translateX(-50%)',
            top:'80%', 
            textAlign:'center',
            width:"330px",
            backgroundColor: 'black',
            color:'white',
            borderRadius:'5px',
            cursor: 'pointer',
            animation: slideAnimation
            
        }} onClick={toggleHistory}>
            <span style={{ display:'block', textAlign:'center', position:'relative'}}>
                
                <span>{clickTitle}</span>
                <img height='30' width='30' style={{filter:'invert(1)', position:'absolute', right:'5px', top:'-3px', animation:rotateAnimation}} src={openUp} alt=''/>
            </span>
        </span>
    </div>
    );

}