import { useRef, useEffect, useState } from 'react';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import { Vortex } from 'react-loader-spinner';
import { useSessionCxt } from '../ChainFuncs.js';
import {useUiCxt} from '../UiFuncs.js';
import SendCard from './SendCard';
import ReceiveCard from './ReceiveCard';
import qrcodeIcon from '../imgs/qrcode.svg';
import sendIcon from '../imgs/send.svg';

export default function AssetScreen(){
    const {chain, account, balance, balanceUsd, assets} = useSessionCxt();
    const {setBubbleHeight} = useUiCxt();
    const [assetsList, setAssetList] = useState(null);
    const [loading, setLoading] = useState(true);
    const openAsset = useRef();

    useEffect(() => {
        setBubbleHeight(350);
        setLoading(true);
        setLoading(false);
    }, [])

    function toggleCard(asset) {
        if(openAsset.current === asset){
            document.getElementById(asset).style.display = 'none';
            openAsset.current='';
        } else{
            if(openAsset.current){
                document.getElementById(openAsset.current).style.display = 'none';
            }
            document.getElementById(asset).style.display = 'flex';
            openAsset.current=asset;
        }
    }

    return(
        <div>
        <ListGroup style={{width:'80vw'}}>
            <ListGroupItem  style={{padding:'5px 0'}}>
                <div style={{display:'flex', flexDirection:'row'}}>
                    <div style={{display:'flex', flexDirection:'column', justifyContent:'center'}}>
                        <img src={chain.img} style={{width:'11vw', height:'11vw', margin:'2vw'}} alt='' />
                    </div>
                    <div style={{display:'flex', flexDirection:'column', justifyContent:'center'}}>
                        <h2 className='assetTextDefault'>{chain.name}</h2>
                        <h2 className='assetTextDefault'>{balance} ~ $XX.XX</h2>
                    </div>
                    <div style={{display:'flex', flexDirection:'row', justifyContent:'center', width:'30vw'}}>
                        <img className='iconButtonDefault' src={qrcodeIcon} alt='' onClick={() => toggleCard('main-receive')} />
                        <img className='iconButtonDefault' src={sendIcon} alt='' onClick={() => toggleCard('main-send')} />
                    </div>
                </div>
                <div id={'main-send'} style={{display:'none'}}>
                    <SendCard asset={chain}/>
                </div>
                <div id={'main-receive'} style={{display:'none'}}>
                    <ReceiveCard address={account.addr}/>
                </div>
            </ListGroupItem>
            {loading?null:<ListGroupItem  style={{padding:'5px 0'}}>
                <div style={{display:'flex', flexDirection:'row'}}>
                    <div style={{display:'flex', flexDirection:'column', justifyContent:'center'}}>
                        <img src='imgs/defaultCoin.png' style={{width:'11vw', height:'11vw', margin:'2vw'}} alt='' />
                    </div>
                    <div style={{display:'flex', flexDirection:'column', justifyContent:'center'}}>
                        <h2 className='assetTextDefault'>asset name</h2>
                        <h2 className='assetTextDefault'>45.103</h2>
                        <h2 className='assetTextDefault'>asset id: XXXXXXXXX</h2>
                    </div>
                    <div style={{display:'flex', flexDirection:'row', justifyContent:'center', width:'30vw'}}>
                        <img className='iconButtonDefault' src={qrcodeIcon} alt='' onClick={() => toggleCard('asset-receive')} />
                        <img className='iconButtonDefault' src={sendIcon} alt='' onClick={() => toggleCard('asset-send')} />
                    </div>
                </div>
                <div id={'asset-send'} style={{display:'none'}}>
                    <SendCard asset={{name:'asset name'}}/>
                </div>
                <div id={'asset-receive'} style={{display:'none'}}>
                    <ReceiveCard address={account.addr}/>
                </div>
            </ListGroupItem>}
        </ListGroup>
        
        {loading?
        <Vortex
            visible={true}
            height="140"
            width="140"
            ariaLabel="vortex-loading"
            wrapperStyle={{}}
            wrapperClass="vortex-wrapper"
            colors={['black', 'gray']}
        />
        :
        null
        }
        </div>
    );
}