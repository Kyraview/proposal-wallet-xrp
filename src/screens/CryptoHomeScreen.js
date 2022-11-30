import {useSessionCxt} from '../ChainFuncs.js';
import { Link } from "react-router-dom";
import WalletIcon from '../imgs/wallet.svg';
import SendIcon from '../imgs/send.svg';
import ReceiveIcon from '../imgs/receive.svg';
import SwapIcon from '../imgs/AlgoIconExchange.svg';
import LedgerIcon from '../imgs/ledger.svg';
import AccountIcon from '../imgs/account.svg';

export default function BaseScreen(){
    const {accountBalanceText, accountName, enable, isEnabled} = useSessionCxt();

    const unlock = () => {
        enable();
    }

    return(
        <div style={{display:'flex', flexDirection:'column', justifyContent:'center'}}>
            <div style={{display:'flex', flexDirection:'row', justifyContent:'center'}}>
                {
                isEnabled?
                <div>
                    <h1>{accountName}</h1>
                    <p>{accountBalanceText}</p>
                    <div style={{display:'flex', flexDirection:'row', justifyContent:'center'}}>
                        <div id='iconButtonDefault'><Link to ='assets'><img src={WalletIcon} alt=''/></Link></div>
                        <div id='iconButtonDefault'><Link to ='send'><img src={SendIcon} alt=''/></Link></div>
                        <div id='iconButtonDefault'><Link to ='receive'><img src={ReceiveIcon} alt=''/></Link></div>
                        <div id='iconButtonDefault'><Link to ='swap'><img src={SwapIcon} alt=''/></Link></div>
                        <div id='iconButtonDefault'><Link to ='ledger'><img src={LedgerIcon} alt=''/></Link></div>
                        <div id='iconButtonDefault'><Link to ='account'><img src={AccountIcon} alt=''/></Link></div>
                    </div>
                </div>
                :
                <button className='defaultButton alt' onClick={unlock}>Unlock Wallet</button>
                }
            </div>
        </div>
    );
}