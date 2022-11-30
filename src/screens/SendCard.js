export default function SendCard({ asset }){
    return(
        <div style={{display:'flex', flexDirection:'row', justifyContent:'center', width:'80vw'}}>
            <div style={{border:'gray 1px solid', borderRadius:'5px', flexDirection:'column', justifyContent:'center', width:'80vw'}}>
            <div style={{display:'flex', flexDirection:'row', justifyContent:'center', margin:'3vw'}}>
                <h1>Send {asset.name}</h1>
            </div>
            </div>
        </div>
    );
}