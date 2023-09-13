import {DeviceUUID} from "device-uuid";
import { createContext } from "react";
import socketIOClient, { Socket } from 'socket.io-client';
import { APP_ID, BASE_URL } from "../configs";
import { fire_message_event } from "../configs/socket.events";
import { registerAllSocketEvents } from "../_utils/common.Fn";
export const socket = socketIOClient(
    `${BASE_URL}/${APP_ID}`,{
        autoConnect: true, 
    } //option of socket manager
);

socket.on('connect', ()=>{
    console.log('socket client connect');
    registerAllSocketEvents(socket);
    let duuid: string = new DeviceUUID().get();
    let sockMsg = {
        UUID: duuid,
        AppScope: APP_ID,
        extInfo:"socket.init",
    }; 
    fire_message_event(socket,"HUMAN_DEVICE_ONLINE",[],sockMsg);
});
socket.on("connect_error", (err: any) => {
    console.log(`connect_error due to ${err.message}`);
});

export const SocketContext = createContext<Socket|null>(null);