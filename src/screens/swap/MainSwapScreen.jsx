import React, { useState, useEffect } from 'react';
import {useSessionCxt} from '../../ChainFuncs.js';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Select from 'react-select';
import swapSideIcon from './imgs/swapSide.png';
import downArrow from './imgs/downArrow.png';
import chainLogo from './imgs/xrpLogo.png';
import ethLogo from './imgs/ethLogo.png';
import bnbLogo from './imgs/bnbLogo.png';
import './bggradient.css';
import { Vortex } from 'react-loader-spinner';

export default function MainSwapScreen(){
    const {chain} = useSessionCxt();
    const options = [
        { value: chain.ticker, label: <div><img src={chainLogo} height="30px" style={{paddingRight: '5px'}} alt=''/>{chain.ticker} </div> },
        { value: 'ETH', label: <div><img src={ethLogo} height="30px" style={{paddingRight: '5px'}} alt=''/>ETH </div> },
        { value: 'BSC', label: <div><img src={bnbLogo} height="30px" style={{paddingRight: '5px'}} alt=''/>BSC </div> }
    ];
    const [error, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState("Swap failed");
    const [swapSuccess, setSwapSuccess] = useState(false)
    const [successMsg, setSuccessMsg] = useState("Swap Successful");
    const [fromValue, setFrom] = useState(options[0]);
    const [toValue, setTo] = useState(options[1]);
    const [hoverSwap, setHoverSwap] = useState(false);
    const [inputAmount, setInputAmount] = useState(null);
    const [outputAmount, setOutputAmount] = useState(null);
    const [warningText, setWarningText] = useState(<>Inputed amount is less<br/>than the minimum amount</>)
    const [loading, setLoading] = useState(false);
    const [min, setMin] = useState(null);
    const [warning, setWarning] = useState(false);
    const [spendable, setSpendable] = useState(null);

    useEffect(() => {
        initialLoad();
    }, [])

    const initialLoad = async() =>{
        setLoading(true);
        setMin(5.501);
        setSpendable(50);
        setLoading(false);
    }

    useEffect(() => {
        updateInputs(inputAmount,fromValue.value,toValue.value);
    }, [inputAmount, fromValue, toValue])

    const setMax = () =>{
        setInputAmount(spendable);
    }

    const handleFromChange = async (selectedOption) => {
        setFrom(selectedOption);
    }

    const handleToChange = async (selectedOption) => {
        setTo(selectedOption);
    }

    const swapSide = () => {
        let newTo = fromValue;
        setFrom(toValue);
        setTo(newTo);
    }

    const handleInputValueChange = (e) =>{
        setWarning(false);
        let num = Number(e.target.value);
        if(num < 0){
            num = 0;
        }
        setInputAmount(num);
    }

    const swapToken = async () => {
        try{
        setSwapSuccess(true);
        } catch(e){
        console.log(e);
        setSwapSuccess(false);
        setError(true);
        }
    }

    const updateInputs = async (inputAmount, fromTicker, toTicker) => {
        if(inputAmount === null){
            return true;
        }
        setLoading(true);
        setLoading(false);
    }

    return(
        

        <div id='swapScreen'>
        {error? <Alert variant='danger' style={{width:'230px'}} onClose={()=>setError(false)} dismissible>{errorMsg}</Alert>:null}
        {swapSuccess? <Alert variant='success' style={{width:'230px'}} onClose={()=>setSwapSuccess(false)} dismissible>{successMsg}</Alert>:null}
        <div className='row' style={{maxWidth:'330px'}}>
            <div className='col' style={{margin:'auto'}}>
            
                
                <div className="row" style={{marginTop:'10px'}}>
                    <div>
                        <p style={{margin:'0', textAlign:'right', display:'block'}}>
                            <span style={{backgroundColor:'black', padding:'5px', paddingLeft:"10px", borderRadius: '8px 8px 0% 0%'}}>Balance: {spendable} {chain.ticker}</span>
                        </p>
                        <div style={{backgroundColor:'black', borderRadius: '8px 0px 8px 8px'}}>
                            <div style={{display: "flex", padding:'8px', }}> 
                                <input type="number" onChange={handleInputValueChange} value={inputAmount} style={{border:'#C6C6C6 1px solid', width:'100%', textAlign: 'center'}}/>
                                <Button style={{maxHeight: '35px', fontSize:'10px'}} onClick={setMax}>max</Button>
                            </div>
                            <div style={{marginRight: '8px', marginLeft: '8px', marginBottom: '5px'}}>
                             <Select width="100" value={fromValue} onChange={handleFromChange} options={options}/>
                            </div>
                            <p style={{margin:'0 2vw', textAlign:'left', display:'block', fontSize:'2.5vw'}}>min: {min} {fromValue.value}</p>
                            <div style={{height:'4px'}}></div>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
        <div className='row' style={{maxWidth:'330px'}}>
            <div className='col'>
                <img src={ hoverSwap? swapSideIcon:downArrow} alt='' onClick={swapSide} style={{margin:'5px', cursor:'pointer'}} onMouseEnter={()=>setHoverSwap(true)} onMouseLeave={()=>setHoverSwap(false)} />
            </div>
        </div>
        
        <div className='row' style={{maxWidth:'330px'}}>
            <div className='col'>
                <div style={{backgroundColor:'black' , padding:'4px', borderRadius: '8px 8px 8px 0px'}}>
                    <div style={{marginRight: '8px', marginLeft: '8px', marginTop: '5px', marginBottom:'5px'}}>
                        <Select value={toValue} onChange={handleToChange} options={options}/>
                    </div>
                </div>
                {!loading?
                <div>
                    {warning || outputAmount===null?null:
                    <div>
                        <p style={{textAlign:'left', }}><span style={{backgroundColor:'black', padding:'5px', paddingLeft:'14px', paddingRight:'10px', textAlign:'left', borderRadius: '0px 0px 8px 8px'}}>estimated {outputAmount} {toValue.value}</span></p>
                    </div>
                    }
                </div>
                :
                <Vortex
                    visible={true}
                    height="140"
                    width="140"
                    ariaLabel="vortex-loading"
                    wrapperStyle={{}}
                    wrapperClass="vortex-wrapper"
                    colors={['black', 'gray']}
                />
                }
            </div>
        </div>
        
        <br/>
        {warning?
        <div style={{"backgroundColor":"#111", "margin":'auto' }}>
            <p style={{"margin":"auto"}}>{warningText}</p>
        </div>
        :
        loading || outputAmount===null?null:<Button className="snapAlgoDefaultButton-alt" onClick={swapToken}>Swap</Button>
        }
        
        
        </div>
    );
}