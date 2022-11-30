import QRCode from "react-qr-code";
import copyIcon from '../imgs/copy.svg';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useEffect } from "react";
import {useSessionCxt} from '../ChainFuncs.js';


export default function ReceiveScreen() {
    const {address} = useSessionCxt();

    const blink = () => {
        document.getElementById('blinkAddress').style.color='#963beb';
        setTimeout(function(){
          document.getElementById('blinkAddress').style.color='black';
        }, 100);
    }

    useEffect(() => {
        //getAddress();
    }, []);

    return(
        <div>
        <div style={{display:'flex', flexDirection:'row', justifyContent:'center'}}>
        <div style={{borderRadius:'5px'}}>
            <div style={{display:'flex', flexDirection:'row', justifyContent:'right', width:'50vw'}}>
            <QRCode size={100} value={address} style={{background:'white'}}/>
            </div>
        </div>
        <CopyToClipboard text={address}>
        <p id="blinkAddress" onClick={blink} style={{wordBreak:'break-all', width:'80%', fontSize:'12px', textAlign:'center', color:'black'}}>
            {address}
            <img alt='' onClick={blink} style={{width:'30px', marginLeft:'5px', cursor:'pointer'}} src={copyIcon}/>
        </p>
        </CopyToClipboard>
        </div>
        <br/>
        </div>
    );
}