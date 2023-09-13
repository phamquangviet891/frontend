import { socket_events } from "../configs/socket.handler";
import { Socket } from "socket.io-client";
import { APP_ID, DEBUG_MODE, ERROR_MODE, INFO_MODE } from "../configs";
import { Storage ,Drivers } from "@ionic/storage";
import { apiLogin, LoginResult } from "../dataproviders/apidata";
import { loadsaved } from "../stores/reducers/userSlice";
import { set_show_login_box } from "../stores/reducers/uictrlSlice";
import store from "../stores";

export function registerAllSocketEvents(sock:Socket){
    for (const event of socket_events) {
      console.log(`Dang ky su kien: ${event.name}`);
      sock?.on(event.name, event.handler);
    }
};
interface LoginCred{
    email:string,
    password: string,
}

export async function login(cred:LoginCred):Promise<any>{
    try {
        let result:Response = await apiLogin(cred);
        if(result.status === 200){
            let userCred: LoginResult = await result.json();
            console.log(userCred);
            return userCred;
        }else{
            console.log('Lỗi dịch vụ khi đăng nhập', result);
            alert(result);
            return null;
        }
    } catch (error) {
        console.log();
    }
    
}
export function logInOutCallBackFn(detail:any){
    outlog('This is call back', detail);
    switch(detail.data.action){
      case 'logout':
        store.dispatch(loadsaved(null));
        break;
      case 'login':
        store.dispatch(set_show_login_box(true));
        break;
    }
};
export function outlog(message?:any, messageOptions?: any[]|string|null):void{
    if(DEBUG_MODE){
        console.log(message,messageOptions);
    }else{
        //
        console.log('All messages out only DEBUG_MODE is true!');
    }
}
export function outinfo(message?:any, messageOptions?: any[]|string|null):void{
    if(INFO_MODE){
        console.info(message,messageOptions);
    }else{
        //
        console.log('All messages out only INFO_MODE is true!');
    }
}
export function outerror(message?:any, messageOptions?: any[]|string|null):void{
    if(ERROR_MODE){
        console.error(message,messageOptions);
    }else{
        //
        console.log('All messages out only ERROR_MODE is true!');
    }
}
