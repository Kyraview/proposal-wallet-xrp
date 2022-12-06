import { useEffect, useRef, useState } from "react";
import { TextField } from "@mui/material";
import {useSessionCxt} from '../ChainFuncs.js';
import {useUiCxt} from '../UiFuncs.js';
import Button from 'react-bootstrap/Button';

export default function AccountScreen() {
    const {createAccount, showMnemonic} = useSessionCxt();
    const {setBubbleHeight} = useUiCxt();
    const [screen, setScreen] = useState('');
    const nameRef = useRef();

    useEffect(() => {
        setBubbleHeight(300);
    }, []);

    return(
        <div>
            {screen===''?
            <div style={{display:'flex', flexDirection:'row', justifyContent:'center'}}>
            <div style={{display:'flex', flexDirection:'column', marginTop:'3vw'}}>
                <Button className="accountButton alt" onClick={() => {setScreen('create')}}>create new account</Button>
                <Button className="accountButton alt">import account</Button>
                <Button className="accountButton alt">switch account/network</Button>
                <Button className="accountButton alt" onClick={() => showMnemonic()}>show mnemonic</Button>
            </div>
            </div>
            :
            <div style={{display:'flex', flexDirection:'row', justifyContent:'right'}}>
                <Button className="accountButton alt" style={{width:'20vw'}} onClick={() => {setScreen('')}}>back</Button>
            </div>
            }

            {screen==='create'?
            <div style={{marginTop:'3vw', width:'70vw'}}>
            <TextField fullWidth onChange={(e)=>{nameRef.current=e.target.value}} label="account name" size='small' style={{margin:'1vw 0'}} multiline/>
            <Button className="accountButton alt" onClick={async () => {await createAccount(nameRef.current); setScreen('create');}}>create account</Button>
            </div>
            :
            null}
        </div>
    );
}