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
        if(!assets){
            return;
        }
        let list = Object.keys(assets).map((assetKey) =>
            <ListGroupItem key={assets[assetKey]['asset-id']} style={{padding:'5px 0'}}>
                <div style={{display:'flex', flexDirection:'row'}}>
                    <div style={{display:'flex', flexDirection:'column', justifyContent:'center'}}>
                        <img src={'https://asa-list.tinyman.org/assets/'+assets[assetKey]['asset-id']+'/icon.png'} style={{width:'11vw', height:'11vw', margin:'2vw'}} alt=''
                            onError={({ currentTarget }) => {
                            currentTarget.onerror = null; // prevents looping
                            currentTarget.src='/imgs/defaultCoin.png';
                            }}>
                        </img>
                    </div>
                    <div style={{display:'flex', flexDirection:'column', justifyContent:'center'}}>
                        <h2 className='assetTextDefault'>{assets[assetKey]['asset'][0]['params']['name']?assets[assetKey]['asset'][0]['params']['name']:'unnamed'}</h2>
                        <h2 className='assetTextDefault'>balance: {assets[assetKey]['amount']}</h2>
                        <h2 className='assetTextDefault'>asset id: {assets[assetKey]['asset-id']}</h2>
                    </div>
                    <div style={{display:'flex', flexDirection:'row', justifyContent:'center', width:'30vw'}}>
                        <img className='iconButtonDefault' src={qrcodeIcon} alt='' onClick={() => toggleCard(assetKey+'-receive')} />
                        <img className='iconButtonDefault' src={sendIcon} alt='' onClick={() => toggleCard(assetKey+'-send')} />
                    </div>
                </div>
                <div id={assetKey+'-send'} style={{display:'none'}}>
                    <SendCard asset={assets[assetKey]}/>
                </div>
                <div id={assetKey+'-receive'} style={{display:'none'}}>
                    <ReceiveCard address={account.addr}/>
                </div>
            </ListGroupItem>
        );
        setAssetList(list);
        setLoading(false);
    }, [assets, account.addr])

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
                        <h2 className='assetTextDefault'>{balance} ~ ${balanceUsd}</h2>
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
            {assetsList}
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