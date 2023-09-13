import { IonButton, IonIcon, useIonActionSheet } from "@ionic/react";
import { logOut, personCircle, removeCircleOutline } from "ionicons/icons";

import { createStore } from "../../stores/data/IonicStorage";
import { LOGIN_INFO_KEY } from "../../configs";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../stores/reducers";
import { load } from "../../stores/reducers/userSlice";
import { set_show_login_box } from "../../stores/reducers/uictrlSlice";

export interface UserButtonProps{
    userinfo?: any|null;
    callbackFn: ((data: any) => void)
}
export interface InputChangeEventDetail {
    value: any;
    [prop:string]:any;
}
export interface InputObject{
    value: string;
    error: string;
}

export const UserButton: React.FC = ()=>{
    const usrInfo = useSelector((state:RootState)=>state.Login_Info.info);
    const dispatch = useDispatch();
    const [presentUserAction] = useIonActionSheet();
    const userActionClick= () =>{
        presentUserAction({
        header: "Các thao tác của người dùng",
        subHeader: `Chọn các thao tác`,
        buttons: [
            {
            text: 'Hồ sơ',
            role: 'selected',
            icon: personCircle,
            data: {
                action: 'profile',
            },
            },
            {
            text: 'Đăng xuất',
            role: 'selected',
            icon: logOut,
            data: {
                action: 'logout',
            },
            },
            {
            text: 'Trở về',
            icon: removeCircleOutline,
            role: 'cancel',
            data: {
                action: 'dismiss',
            },
            }
        ],
        onDidDismiss: async({ detail }) => {
            if(detail && detail.data && detail.data.action){
                console.log(detail.data.action);
                switch(detail.data.action){
                    case 'logout':
                        let lstore = await createStore();
                        lstore.set(LOGIN_INFO_KEY,"");
                        dispatch(load(null));
                    break;

                }
            }
            
        },
        })
    }
    if(usrInfo === null){
        return (
            <>
                <IonButton title="Guest" onClick={(e: any)=>{dispatch(set_show_login_box(true))}} >
                    <IonIcon className="user-button" slot="icon-only" icon={personCircle} title="Guest"></IonIcon>
                </IonButton>
                
            </>
            );
    }else{
        return ((<div>
            <IonButton  className={"user-button"} onClick={userActionClick}>
              <IonIcon  icon={personCircle} slot={"start"} color={"success"}/>
            </IonButton>
            </div>));
    }
    
    
}