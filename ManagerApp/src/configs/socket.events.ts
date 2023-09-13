import {Socket} from 'socket.io-client';
export interface HUMAN_DEVICE_ONLINE{
    UUID: string;
    [prop:string]:any;
}
export function fire_message_event(socket:Socket, event_name: string,rooms: string[], msg: any){
    if(Array.isArray(rooms)){
        if(rooms.length !==0){
            rooms.forEach((room:string) =>{
                socket.emit(event_name, {...msg, room: room});
            });
        }else{
            socket.emit(event_name, {...msg});
        }
    }
}
