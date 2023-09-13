
import store from "../stores";
import { recivedMessage } from "../stores/reducers/msgSlice";


export const socket_events = [
    {
        name: "BROADCAST",
        handler: (msg:any)=>{
            console.log(msg);
            store.dispatch(recivedMessage(msg));
        },  
    },
    {
        name: "STATUS",
        handler: (msg:any)=>{
            console.log(msg);
        },  
    },
]