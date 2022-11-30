import React, { useState, useEffect } from 'react';
import downArrow from './imgs/downArrow.png';
import { ProgressBar } from 'react-loader-spinner';
import moment from 'moment';
import {Status} from './Status'

export default function HistorySwapScreen(){
    useEffect( ()=>{
        console.log("useEffect called")
        window.ethereum.request({
            method: 'wallet_invokeSnap',
            params: ["npm:algorand", 
            {
                method: 'swapHistory',
            }
            ]
        })
        .then((history)=>{
            console.log("history is")
            console.log(history)
            setSwapHistory(history)
            let tiles = {}
            for(const swap of history){
                
                tiles[swap.id] = {display:'none', status:null, loading:false}
            }
            setTileProperties(tiles)
        })
    }, [])
    const [swapHistory, setSwapHistory] = useState([]);
    const [tileProperties, setTileProperties] = useState({});
    const [loading, setLoading] = useState(false)
    
    const getStatus = async (id)=>{
        let copyProperties =JSON.parse(JSON.stringify(tileProperties));
        if(copyProperties[id].display === "none"){
            copyProperties[id].display = "block"; 
        }
        else{
            copyProperties[id].display = "none";
            setTileProperties(copyProperties);
            return;
        }
        setLoading(true)
        const result = await window.ethereum.request({
            method: 'wallet_invokeSnap',
            params: ["npm:algorand", 
            {
                method: 'getSwapStatus',
                params:{
                    id: id
                }
            }
            ]
        });
        setLoading(false)
        console.log(result)
        copyProperties[id].statis = result;
        console.log(copyProperties);
        setTileProperties(copyProperties)

    }
    
    return(
        <div className='row' style={{maxWidth:'330px', marginTop:'65px'}}>
            <div style={{display:'flex', justifyContent:'space-between'}}>
                <p>swap history</p>
                <span style={{transform:'translateY(-25%)', height:'55px'}}>
                <ProgressBar
                    visible={loading}
                    height="50"
                    width="140"
                    ariaLabel="progress-bar-loading"
                    wrapperStyle={{}}
                    wrapperClass="vortex-wrapper"
                    borderColor = 'white'
                    barColor = 'white'
                />
                </span>
            </div>
            <div style={{maxHeight:'420px', overflowY:'auto'}}>
            {
                swapHistory.map((item)=>{
                    return (
                    <div key={item.id} style={{borderBottom: '0.5px solid white', marginTop:'15px'}}>
                        <span style={{display:'flex', justifyContent:'space-between'}}>
                            <span style={{display:'flex'}}>
                                <p>{item.fromCurrency}</p>
                                <img height="25" width="25" style={{filter:'invert(1)', transform:'rotate(-90deg)'}} src={downArrow}/>
                                <p>{item.toCurrency}</p>
                            </span>
                            <button 
                            style={{
                                maxHeight:'25px', 
                                fontSize:'13px', 
                                display:'block',
                                borderRadius:'5px',
                                backgroundColor:'#963beb',
                                color:'white',
                                border:'none'
                            }}
                            onClick={()=>getStatus(item.id)}
                            >
                                status
                            </button>

                        </span>
                        <div style={{display:tileProperties[item.id]?(tileProperties[item.id].display):'block'}}>
                        
                        <>
                            {tileProperties[item.id]?
                                (tileProperties[item.id].statis?
                                    (tileProperties[item.id].statis.status?
                                    <>
                                    <br/>
                                <div style={{display:'flex', justifyContent:'end'}}>
                                <p style={{marginRight:'5px', fontSize:'12px'}}>{tileProperties[item.id].statis.amountSend}</p>
                                <p style={{marginRight:"10px", fontSize:'12px'}}>{tileProperties[item.id].statis.fromCurrency}</p>
                                <img height="15" width="15" style={{filter:'invert(1)', transform:'rotate(-90deg)', marginRight:'10px'}} src={downArrow}/>
                                <p style={{marginRight:'10px', fontSize:'12px'}}>{tileProperties[item.id].statis.expectedReceiveAmount}</p>
                                <p style={{fontSize: '12px'}}>{tileProperties[item.id].statis.toCurrency}</p>
                                
                                </div>
                                <div style={{display:'flex', justifyContent:'space-between'}}>
                                    <Status tileProperties={tileProperties} item={item}/>
                                    <p>{moment(new Date(tileProperties[item.id].statis.createdAt)).fromNow()}</p>
                                    
                                 </div>
                                
                                    
                                    </>:null)
                                    :null)
                                :null}

                        </>
                        </div>
                    </div>
                    )
                })
            }
            </div>
        </div>
    )
}