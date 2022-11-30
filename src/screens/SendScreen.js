import { useState } from 'react';
import {useSessionCxt} from '../ChainFuncs.js';
import Select from 'react-select';
import { TextField } from "@mui/material";
import CopyIcon from '../imgs/copy.svg';

export default function SendScreen(){
    const options = [
        { value: 'ALGO', label: <div><img src={"https://asa-list.tinyman.org/assets/0/icon.png"} height="30px" style={{paddingRight: '5px'}} alt=''/>ALGO </div> }
    ];

    const {accountBalanceText, accountName, enable, isEnabled} = useSessionCxt();
    const [assetValue, setAsset] = useState(options[0]);

    return(
        <div>
        <div style={{display:'flex', flexDirection:'row', justifyContent:'center', margin:'0 10px'}}>
            <TextField fullWidth label="recipiant address" size='small'/>
            <img style={{width:'25px', marginLeft:'5px'}} src={CopyIcon} alt=''/>
        </div>
        <div style={{height: '30px'}}></div>
        <div style={{display:'flex', flexDirection:'row', justifyContent:'center', margin:'0 10px'}}>
            <TextField label="amount" size='small'/>
            <Select options={options} value={assetValue} style={{marginLeft:'10px'}} />
        </div>
        <br/>
        </div>
    );
}