import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonModal, IonTitle, IonToolbar } from "@ionic/react"
import { create } from "ionicons/icons";
import {v4 as uuidv4} from "uuid";
import { useState } from "react";

import { set_show_login_box } from "../../stores/reducers/uictrlSlice";

interface NewAppModalProp{
    onModalClose: (ev:CustomEvent) =>void;
}
export const NewAppModal: React.FC<NewAppModalProp> = ({onModalClose})=>{
    const [appName,setAppName] = useState<string>("");
    const [appKey,setAppKey] = useState<string>("");
    return (
    <>
        
        <IonHeader>
            <IonToolbar>
              <IonButtons slot="start">
                <IonButton onClick={(ev:any) => {
                    ev.detail = {data:{appName,appKey},role:"cancel"};
                    onModalClose(ev);
                }}>CANCEL</IonButton>
              </IonButtons>
              <IonTitle style={{textAlign: "center"}}>New Application</IonTitle>
              <IonButtons slot="end">
                <IonButton strong={true} onClick={(ev: any)=>{
                    ev.detail = {data:{appName,appKey},role:"confirm"};
                    onModalClose(ev);
                }}>
                  OK
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonItem>
              <IonLabel position="stacked">App Name</IonLabel>
              <IonInput value={appName} onIonChange={(e: CustomEvent)=>{setAppName(e.detail.value)}} type="text" placeholder="appname" />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">App Key</IonLabel>
              <IonInput value={appKey} onIonChange={(e:CustomEvent)=>{setAppKey(e.detail.value)}} type="text" placeholder="appKey" />
              <IonIcon slot="end" icon={create} onClick={(e)=>{
                let uuid = uuidv4();
                console.log("create key",uuid);
                setAppKey(uuid.toUpperCase());
              }}/>
            </IonItem>
          </IonContent>
    </>)
}