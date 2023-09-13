import { IonButton, IonButtons, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonModal, IonTitle, IonToolbar } from "@ionic/react";
import { useState } from "react";
import { useSelector } from "react-redux"
import { useAppDispatch } from "../../stores";
import { RootState } from "../../stores/reducers"
import { set_show_edit_appfeature, set_show_login_box } from "../../stores/reducers/uictrlSlice";

export const EditFeatureModal: React.FC = ()=>{
    const currentEditFeature = useSelector((state: RootState)=>state.UI_CTRL.currentEditFeature);
    const showEdit = useSelector((state: RootState)=>state.UI_CTRL.show_edit_appfeature);
    const dispatch = useAppDispatch();
    const [fname,setFname] = useState<string|undefined>("");
    const [fappUrl,setFappUrl] = useState<string|undefined>("");
    const [fiosIcon,setFiosIcon] = useState<string|undefined>("");
    function doUpdateFeature(){

    }
    function featureNameChange(e: CustomEvent){
        setFname(e.detail.value);
    }
    function featureUrlChange(e:CustomEvent){
        setFappUrl(e.detail.value);
    }
    if(currentEditFeature !== null){
        setFname(currentEditFeature.name);
        setFappUrl(currentEditFeature.content.url);
        setFiosIcon(currentEditFeature.content.iosIcon);
    }
    return <div>
        <IonModal isOpen={showEdit}>
        <IonHeader>
            <IonToolbar>
              <IonButtons slot="start">
                <IonButton onClick={() => dispatch(set_show_edit_appfeature(false))}>Cancel</IonButton>
              </IonButtons>
              <IonTitle>OK</IonTitle>
              <IonButtons slot="end">
                <IonButton strong={true} onClick={()=>doUpdateFeature()}>
                  Confirm
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <IonItem>
              <IonLabel position="stacked">Chuc nang</IonLabel>
              <IonInput value={fname} onIonChange={featureNameChange} type="text" placeholder="feature name" />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Password</IonLabel>
              <IonInput value={fappUrl} onIonChange={featureUrlChange} type="text" placeholder="Application Path" />
            </IonItem>
          </IonContent>
        </IonModal>
    </div>
}