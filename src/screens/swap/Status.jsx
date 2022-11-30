export function Status(props){
    return(
    <div style={{display:'flex'}}>
        <div style={{
        height:'10px', 
        width:'10px', 
        borderRadius:'100%',
        transform:'translateY(75%)',
        marginRight:'5px',
        backgroundColor: ({
            'new':'orange',
            'waiting':'#FF6700',
            'confirming':'FEC601',
            'exchanging':'#FEC601',
            'sending': '#F0F757',
            'finished':"#64F58D",
            'failed':'red',
            'refunded':'#4D9DE0',
            'verifying':'purple'})[props.tileProperties[props.item.id].statis.status]
        }}></div>
        <p>{props.tileProperties[props.item.id].statis.status}</p>
    </div>
    )
}