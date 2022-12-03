import { useEffect, useState } from "react";
import {useSessionCxt} from '../ChainFuncs.js';
import searchIcon from '../imgs/search.svg';


export default function LedgerScreen() {
    const {txns,chain,account,testnetUI,getTransactions} = useSessionCxt();
    const [txnsList, setTxnsList] = useState(null);

    useEffect(() => {
        async function loadTxns(){
        console.log(txns)
        if(!txns){
            return;
        }
        let list = Object.keys(txns).map((txnKey) =>
        <div>
        <div key={txnKey} style={{display:'flex', flexDirection:'row', width:'80vw'}}>
            {txns[txnKey]['tx-type']==='pay' && account.addr===txns[txnKey]['sender'] && 
            <h2 style={{fontSize:'2.75vw', width:'75vw', textAlign:'left'}}>{'sent '+txns[txnKey]['payment-transaction']['amount']/1000000+' '+chain.unit+' to '+txns[txnKey]['payment-transaction']['receiver'].substr(0,4)+'...'+txns[txnKey]['payment-transaction']['receiver'].substr(54)}</h2>}
            {txns[txnKey]['tx-type']==='pay' && account.addr!==txns[txnKey]['sender'] &&
            <h2 style={{fontSize:'2.75vw', width:'75vw', textAlign:'left'}}>{'received '+txns[txnKey]['payment-transaction']['amount']/1000000+' '+chain.unit+' from '+txns[txnKey]['sender'].substr(0,4)+'...'+txns[txnKey]['sender'].substr(54)}</h2>}
            {txns[txnKey]['tx-type']!=='pay' &&
            <h2 style={{fontSize:'2.75vw', width:'50vw', textAlign:'left'}}>{txns[txnKey]['sender'].substr(0,4)+'...'+txns[txnKey]['sender'].substr(54)}</h2>}

            {txns[txnKey]['tx-type']!=='pay'?<h2 style={{fontSize:'2.75vw',width:'25vw',textAlign:'left'}}>{txns[txnKey]['tx-type']}</h2>:null}

            <a href={`https://${testnetUI ? "testnet." : ""}algoexplorer.io/tx/${txns[txnKey].id}`} target="_blank" rel="noopener noreferrer"><img style={{width:'5vw', filter:'invert(100%)'}} src={searchIcon} alt='' /></a>
        </div>
        <br/>
        </div>
        );
        setTxnsList(list);
        }
        loadTxns();
    }, [txns, account.addr, chain.unit, testnetUI])

    return(
        <div>
            {!txns || !Object.keys(txns)?<h1 style={{fontSize:'5vw'}}>no transaction history</h1>:null}
            {txnsList}
        </div>
    );
}