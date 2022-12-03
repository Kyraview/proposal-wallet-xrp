import QRCode from "react-qr-code";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import copyIcon from '../imgs/copy.svg';

export default function SendCard({ address }){const blink = () => {
    document.getElementById('blinkAddress').style.color='#963beb';
        setTimeout(function(){
        document.getElementById('blinkAddress').style.color='black';
        }, 100);
    }

    return(
        <div style={{display:'flex', flexDirection:'row', justifyContent:'center', width:'80vw'}}>
            <div style={{display:'flex', flexDirection:'row', border:'gray 1px solid', borderRadius:'5px', width:'80vw'}}>
                <div style={{width:'40vw', display:'flex', justifyContent:'right'}}>
                    <QRCode size={80} value={address || ''} style={{background:'white', margin:'2vh 10vh'}}/>
                </div>
                <div style={{display:'flex', flexDirection:'column', justifyContent:'center'}}>
                    <CopyToClipboard text={address || ''}>
                    <h1 id="blinkAddress" style={{fontSize:'3vw', width:'34vw', wordBreak:'break-all', padding:'2vw', margin:0, textAlign:'left'}}>
                        {address}
                        <img src={copyIcon} onClick={blink} style={{width:'5vw', marginLeft:'5px', cursor:'pointer', filter:'invert(100%)'}} alt=''/>
                    </h1>
                    </CopyToClipboard>
                </div>
            </div>
        </div>
    );
}