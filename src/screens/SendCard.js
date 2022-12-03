import { TextField } from "@mui/material";
import sendIcon from '../imgs/send.svg';

export default function SendCard({ asset }){
    const transfer = () => {
        console.log('send')
    }

    return(
        <div style={{display:'flex', flexDirection:'row', justifyContent:'center', width:'80vw'}}>
            <div style={{border:'gray 1px solid', borderRadius:'5px', flexDirection:'column', justifyContent:'center', width:'80vw'}}>
            <h1 style={{fontSize:'4vw', textAlign:'left', margin:'3vw 0 0 6vw'}}>Send {asset.name || asset['asset'][0]['params']['name'] || 'unnamed'}</h1>
            <div style={{display:'flex', flexDirection:'row', justifyContent:'center', margin:'0 3vw 3vw 3vw'}}>
                <div style={{display:'flex', flexDirection:'column', justifyContent:'left', width:'60vw'}}>
                    <TextField fullWidth label="recipiant address" size='small' style={{margin:'1vw 0'}} multiline/>
                    <TextField fullWidth label="note" multiline/>
                </div>
                <img style={{margin:'auto'}} className='iconButtonDefault' src={sendIcon} alt='' onClick={() => transfer()} />
            </div>
            </div>
        </div>
    );
}