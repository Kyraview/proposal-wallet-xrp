import { useState } from 'react';
import { useSessionCxt } from '../ChainFuncs.js';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import AssetScreen from './AssetScreen';
import SendCard from './SendCard';
import qrcodeIcon from '../imgs/qrcode.svg';
import sendIcon from '../imgs/send.svg';

export default function BaseScreen(){
    const [assetsList, setAssetList] = useState(null);
    const [screen, setScreen] = useState('base');
    const {chain, preload, assetsRef, isEnabled, account, balance} = useSessionCxt();

    const unlock = async () => {
        await preload();
        let assets = assetsRef.current;
        let list = Object.keys(assets).map((assetKey) =>
            <ListGroupItem key={assets[assetKey]['asset-id']} style={{padding:'5px 0'}}>
                <div style={{display:'flex', flexDirection:'row'}}>
                    <div style={{display:'flex', flexDirection:'column', justifyContent:'center'}}>
                        <img src={'https://asa-list.tinyman.org/assets/'+assets[assetKey]['asset-id']+'/icon.png'} style={{width:'15vw', height:'15vw'}} alt=''
                            onError={({ currentTarget }) => {
                            currentTarget.onerror = null; // prevents looping
                            currentTarget.src='https://img.icons8.com/ios-filled/344/cheap-2.png';
                            }}>
                        </img>
                    </div>
                    <div style={{display:'flex', flexDirection:'column', justifyContent:'center'}}>
                        <h2 className='assetTextDefault'>{assets[assetKey]['asset'][0]['params']['name']?assets[assetKey]['asset'][0]['params']['name']:'unnamed'}</h2>
                        <h2 className='assetTextDefault'>balance: {assets[assetKey]['amount']}</h2>
                        <h2 className='assetTextDefault'>asset id: {assets[assetKey]['asset-id']}</h2>
                    </div>
                    <div style={{display:'flex', flexDirection:'row', justifyContent:'center', width:'30vw'}}>
                        <img className='iconButtonDefault' src={qrcodeIcon} alt='' onClick={() => toggleCard('asset-'+assetKey+'-send')} />
                        <img className='iconButtonDefault' src={sendIcon} alt='' />
                    </div>
                </div>
            </ListGroupItem>
        );
        setAssetList(list);
    }

    function toggleCard(asset) {
        document.getElementById(asset).style.display = 'flex';
    }

    return(
            <div>
                
                {isEnabled?
                <div style={{display:'flex', flexDirection:'row', justifyContent:'right', margin:'2vh 5vw'}}>
                    <h1>{account.name}</h1>
                </div>
                :
                <div style={{display:'flex', flexDirection:'column', justifyContent:'center', height:'100vh'}}>
                    <div style={{display:'flex', flexDirection:'row', justifyContent:'center'}}>
                    <button className='defaultButton alt' onClick={unlock}>Unlock Wallet</button>
                    </div>
                </div>}

                {screen==='base' && isEnabled?
                <div style={{display:'flex', flexDirection:'row', justifyContent:'center', height:'80vh', overflow:'auto'}}>
                <ListGroup style={{width:'80vw'}}>
                    <ListGroupItem  style={{padding:'5px 0'}}>
                        <div style={{display:'flex', flexDirection:'row'}}>
                            <div style={{display:'flex', flexDirection:'column', justifyContent:'center'}}>
                                <img src={'https://asa-list.tinyman.org/assets/0/icon.png'} style={{width:'11vw', height:'11vw', margin:'2vw'}} alt='' />
                            </div>
                            <div style={{display:'flex', flexDirection:'column', justifyContent:'center'}}>
                                <h2 className='assetTextDefault'>{chain.name}</h2>
                                <h2 className='assetTextDefault'>balance: {balance}</h2>
                            </div>
                            <div style={{display:'flex', flexDirection:'row', justifyContent:'center', width:'30vw'}}>
                                <img className='iconButtonDefault' src={qrcodeIcon} alt=''/>
                                <img className='iconButtonDefault' src={sendIcon} alt='' onClick={() => toggleCard('main-send')} />
                            </div>
                        </div>
                        <div id={'main-send'} style={{display:'none'}}>
                            <SendCard asset={chain}/>
                        </div>
                    </ListGroupItem>
                    {assetsList}
                </ListGroup>
                </div>
                :
                null}
            </div>
    );
}