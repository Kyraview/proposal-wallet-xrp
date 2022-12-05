import { useRef, useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import { TextField } from "@mui/material";
import { useSessionCxt } from '../ChainFuncs.js';
import sendIcon from '../imgs/send.svg';

export default function SendCard({ asset }){
    const {transfer,transferAsset,chain,checkAddress,updateValues} = useSessionCxt();
    const [error, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [success, setSuccess] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const amountRef = useRef('');
    const noteRef = useRef('');
    const toRef = useRef('');

    const handleSend = async () => {
        if(amountRef.current.length===0 || toRef.current.length===0){
            setError(true)
            setErrorMsg('recipiant address and amount field required')
            return;
        } else if(!await checkAddress(toRef.current)){
            setError(true)
            setErrorMsg('recipiant address not valid')
            return;
        } else if(isNaN(Number(amountRef.current))){
            setError(true)
            setErrorMsg('amount needs to be an integer')
            return;
        } 
        try{
            if(asset.ticker===chain.ticker){
                await transfer({
                    amount:Number(amountRef.current)*1000000,
                    to:toRef.current
                })
            } else{
                await transferAsset({
                    amount:Number(amountRef.current),
                    assetIndex: Number(asset['asset-id']),
                    to:toRef.current
                })
            }
            setSuccess(true)
            setSuccessMsg('transaction successful')
            updateValues();
        } catch(err) {
            console.log(err)
            setError(true)
            setErrorMsg('transaction failed')
        }
    }

    return(
        <div style={{display:'flex', flexDirection:'row', justifyContent:'center', width:'80vw'}}>
            <div style={{border:'gray 1px solid', borderRadius:'5px', width:'80vw'}}>
                <div style={{display:'flex' ,flexDirection:'row', justifyContent:'center', width:'80vw', margin:'2vw 0 0 0'}}>
                {error? <Alert variant='danger' style={{width:'70vw'}} onClose={()=>setError(false)} dismissible>{errorMsg}</Alert>:null}
                {success? <Alert variant='success' style={{width:'70vw'}} onClose={()=>setError(false)} dismissible>{successMsg}</Alert>:null}
                </div>
            <h1 style={{fontSize:'4vw', textAlign:'left', margin:'3vw 0 0 6vw'}}>Send {asset.name || asset['asset'][0]['params']['name'] || 'unnamed'}</h1>
            <div style={{display:'flex', flexDirection:'row', justifyContent:'center', margin:'0 3vw 3vw 3vw'}}>
                <div style={{display:'flex', flexDirection:'column', justifyContent:'left', width:'60vw'}}>
                    <TextField fullWidth onChange={(e)=>{toRef.current=e.target.value}} label="recipiant address" size='small' style={{margin:'1vw 0'}} multiline/>
                    <TextField fullWidth onChange={(e)=>{amountRef.current=e.target.value}} label="amount" size='small' style={{margin:'1vw 0'}} multiline/>
                    <TextField fullWidth onChange={(e)=>{noteRef.current=e.target.value}} label="note" multiline/>
                </div>
                <img style={{margin:'auto'}} className='iconButtonDefault' src={sendIcon} alt='' onClick={() => handleSend()} />
            </div>
            </div>
        </div>
    );
}