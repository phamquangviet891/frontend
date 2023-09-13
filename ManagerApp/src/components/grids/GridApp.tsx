import { IonCol, IonFab, IonFabButton, IonGrid, IonIcon, IonRow, IonText, useIonModal, useIonToast, useIonViewDidEnter } from "@ionic/react"
import { add, closeCircle, informationCircleOutline } from "ionicons/icons";
import { useEffect, useState } from "react"
import { useSelector } from "react-redux";
import { apiCreateCallableApp, apiLoadCallableAppList } from "../../dataproviders/dynamic_url.api";
import { useAppDispatch } from "../../stores";
import { RootState } from "../../stores/reducers";
import { set_toast_message } from "../../stores/reducers/uictrlSlice";
import { ApplicationCard } from "../callableapps/ApplicationCard";
import { NewAppModal } from "../modals/NewAppModal";
import "./GridApp.css";
export interface SimpleAppRecord{
    id?:string;
    AppName: string;
    AppKey: string;
    Status: number|1;
    isManager: boolean|false;
    [prop:string]: any;
}
export const GridApp: React.FC = ()=>{
    const [appsList,setAppList] = useState<Array<any>>([]);
    const [presentModal, dismissModal] = useIonModal(NewAppModal,{onModalClose: handleDismiss});
    async function handleDismiss(ev: CustomEvent){
        dismissModal();
        switch(ev.detail.role){
            case "confirm":
                presentToast({
                    message: `Confirm to create app`,
                    icon: informationCircleOutline,
                    duration:2000,
                    position:'middle'
                });
                console.log(ev.detail.data);
                let result = await apiCreateCallableApp({
                    AppName: ev.detail.data.appName,
                    AppKey: ev.detail.data.appKey,
                    Status: 1, isManager: false} as SimpleAppRecord);
                if([200].indexOf(result.status) !== -1){
                    setLoad(true);
                }
            break;
            case "cancel":
                presentToast({
                    message: `Cancel create app`,
                    icon: closeCircle,
                    duration: 1500,
                    color: 'dark'
                });
                break
            default:
                break;
        }
    }
    const [presentToast] = useIonToast();
    
    
    const [load,setLoad] = useState(true);
    useEffect(()=>{
        const localFn = async()=>{
            try {
                let result = await apiLoadCallableAppList();
                console.log(result);
                setAppList(await result.json());
                setLoad(false);
            } catch (error) {
                console.log(error);
            }
        }
        if(load === true){
            localFn();
        }
        
    },[load]);

    return (
        <div className="content">
            <IonFab vertical={"center"} horizontal={"start"} slot="fixed">
                <IonFabButton onClick={(e)=>{
                    presentModal({
                        cssClass: ''
                    })}}>
                    <IonIcon icon={add} />
                </IonFabButton>
            </IonFab>
            <IonGrid>
                <IonRow>
                    {appsList.map(el=>(<IonCol key={el.id}>
                        <ApplicationCard app={el} />
                    </IonCol>))}
                </IonRow>
            </IonGrid>
    </div>
    )
}