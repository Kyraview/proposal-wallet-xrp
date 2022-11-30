import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Select from 'react-select';
import swapSideIcon from './imgs/swapSide.png';
import downArrow from './imgs/downArrow.png';
import algoLogo from './imgs/algoLogo.png';
import ethLogo from './imgs/ethLogo.png';
import bnbLogo from './imgs/bnbLogo.png';
import './bggradient.css';
import { Vortex } from 'react-loader-spinner'
import Utils  from './Utils.js';


const options = [
    { value: 'ALGO', label: <div><img src={algoLogo} height="30px" style={{paddingRight: '5px'}} alt=''/>ALGO </div> },
    { value: 'ETH', label: <div><img src={ethLogo} height="30px" style={{paddingRight: '5px'}} alt=''/>ETH </div> },
    { value: 'BSC', label: <div><img src={bnbLogo} height="30px" style={{paddingRight: '5px'}} alt=''/>BSC </div> }
];

export default function MainSwapScreen(){
    const [error, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState("Swap failed");
    const [swapSuccess, setSwapSuccess] = useState(false)
    const [successMsg, setSuccessMsg] = useState("Swap Successful");
    const [fromValue, setFrom] = useState(options[0]);
    const [toValue, setTo] = useState(options[1]);
    const [hoverSwap, setHoverSwap] = useState(false);
    const [outputAmount, setOutputAmount] = useState(null);
    const [inputAmount, setInputAmount] = useState(null);
    const [warningText, setWarningText] = useState(<>Inputed amount is less<br/>than the minium amount</>)
    const [loading, setLoading] = useState(false);
    const [min, setMin] = useState(null);
    const [warning, setWarning] = useState(false);
    const [spendable, setSpendable] = useState(null);

    useEffect(()=> { updateInputs(inputAmount, fromValue.value, toValue.value) }, [toValue, fromValue, inputAmount])
    useEffect(async ()=> {
        let min = await getMin(fromValue.value, toValue.value);
        console.log("min is ", min);
        console.log("input amount is ", inputAmount);
        if(min > inputAmount){
            console.log("here");
            setInputAmount(min);
        }
    }, [toValue, fromValue])
    useEffect(async ()=>{
        setSpendable(await Utils.getBalance(fromValue.value))
    }, [fromValue])

    useEffect(async () => {
        setLoading(true);
        let min = await Utils.getMin(fromValue.value, toValue.value);
        if(min.failure){
            setWarningText(min.error);
            setWarning(true);
            setLoading(false);
            return;
        }
        else{
            min = min.minAmount
        }
        console.log("min is");
        console.log(min);
        setInputAmount(min);
        setLoading(false);
        const algoBalance = await Utils.getBalance('algo');
        console.log(algoBalance);
        setSpendable(algoBalance);
    }, [])

    useEffect(()=>{
        if(loading){
            setWarning(false);
        }
    }, [loading])



    const handleFromChange = async (selectedOption) => {
        console.log(selectedOption);
        const min = await getMin(selectedOption.value, toValue.value);
        setInputAmount(min);
        setFrom(selectedOption);
        
    }

    const getMin = async (fromTicker, toTicker)=>{
        const min = await Utils.getMin(fromTicker, toTicker);
        if(min.failure){
            setWarningText(min.error);
            setWarning(true);
            setMin(0);
            return 0;
        }
        setMin(min.minAmount);
        return min.minAmount;
    }

    const handleToChange = async (selectedOption) => {
        Utils.getMin(fromValue.value, selectedOption.value);
        const min = await getMin(fromValue.value, selectedOption.value);
        setInputAmount(min);
        setTo(selectedOption);
        
    }

    const swapSide = () => {
        let hold = fromValue;
        setFrom(toValue);
        setTo(hold);
        
    }

    const handleInputValueChange = (e) =>{
        console.log(e.target.value);
        setWarning(false);
        let num = Number(e.target.value);
        if(num === 0){
            num = null;
        }
        setInputAmount(num);
    }

    const swapToken = async () => {
        try{
        const output = await window.ethereum.request({
            method: 'wallet_invokeSnap',
            params: ["npm:algorand", 
            {
                method: 'swap',
                params:{
                    from: fromValue.value,
                    to: toValue.value,
                    amount: inputAmount
                }
            }
            ]
        });
        console.log(output);
        setSwapSuccess(true);
        }
        catch(e){
        console.log(e);
        setSwapSuccess(false);
        setError(true);
        }

    }

    const setMax = () =>{
        setInputAmount(spendable);
    }

    const updateInputs = async (inputAmount, fromTicker, toTicker) => {
        if(inputAmount === null){
            return true;
        }
        setLoading(true);
        console.log(inputAmount);
        console.log(toTicker);
        console.log(fromTicker); 
        const result = await window.ethereum.request({
            method: 'wallet_invokeSnap',
            params: ["npm:algorand", 
            {
                method: 'preSwap',
                params:{
                    from: fromTicker,
                    to: toTicker,
                    amount: inputAmount
                }
            }
            ]
        });
        console.log("preswap result is");
        console.log(result);
        if(result.failure){
            console.log("here")
            setWarningText(<>{result.error}</>);
            setWarning(true);
            setLoading(false);
            return;
        }
        if(Number(result.minAmount) > Number(result.amount)){
            setMin(Number(result.minAmount));
            console.log("here");
            setWarningText(<>Inputed amount is less<br/>than the minium amount</>)
            setWarning(true);
        }
        else{
            setWarning(false);
        }
        setOutputAmount(result.estimatedAmount);
        console.log(result);
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
                            <span style={{backgroundColor:'#963beb', padding:'5px', paddingLeft:"10px", borderRadius: '8px 8px 0% 0%'}}>Balance: {spendable} {fromValue.value}</span>
                        </p>
                        <div style={{backgroundColor:'#963beb', borderRadius: '8px 0px 8px 8px'}}>
                            <div style={{display: "flex", padding:'8px', }}> 
                                <input type="number" onChange={handleInputValueChange} value={inputAmount} style={{border:'#C6C6C6 1px solid', width:'100%', textAlign: 'center'}}/>
                                <Button style={{maxHeight: '35px', fontSize:'10px'}} onClick={setMax}>max</Button>
                            </div>
                            <div style={{marginRight: '8px', marginLeft: '8px', marginBottom: '5px'}}>
                             <Select width="100" value={fromValue} onChange={handleFromChange} options={options}/>
                            </div>
                            <div style={{height:'4px'}}></div>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
        <div className='row' style={{maxWidth:'330px'}}>
            <div className='col'>
                <img src={ hoverSwap? swapSideIcon:downArrow} alt='' onClick={swapSide} style={{margin:'5px', cursor:'pointer', filter:"invert(100%)"}} onMouseEnter={()=>setHoverSwap(true)} onMouseLeave={()=>setHoverSwap(false)} />
            </div>
        </div>
        
        <div className='row' style={{maxWidth:'330px'}}>
            <div className='col'>
            <div style={{backgroundColor:'#963beb' , padding:'4px', borderRadius: '8px 8px 8px 0px'}}>
                <div style={{marginRight: '8px', marginLeft: '8px', marginTop: '5px', marginBottom:'5px'}}>
                    <Select value={toValue} onChange={handleToChange} options={options}/>
                </div>
            </div>
            {
            !loading?
            <>
            {warning?null:
            <div>
                <p style={{textAlign:'left', }}><span style={{backgroundColor:'#963beb', padding:'5px', paddingLeft:'14px', paddingRight:'10px', textAlign:'left', borderRadius: '0px 0px 8px 8px'}}>estimated {outputAmount} {toValue.value}</span></p>
            </div>
            }
            </>
            :<Vortex
                visible={true}
                height="140"
                width="140"
                ariaLabel="vortex-loading"
                wrapperStyle={{}}
                wrapperClass="vortex-wrapper"
                colors={['#963beb', '#830bba', '#c00fb4', '#e9d596','yellow', 'white']}
            />
            }
            </div>
        </div>
        
        <br/>
        {warning?
        <div style={{"backgroundColor":"#111", "margin":'auto' }}>
            <p style={{"margin":"auto"}}>{warningText}</p>
        </div>
        :loading?null:<Button className="snapAlgoDefaultButton-alt" onClick={swapToken}>Swap</Button>
        }
        
        
        </div>
    );
}