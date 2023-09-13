import { IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonIcon, IonSelect, IonSelectOption, IonCheckbox, IonList } from "@ionic/react";
import { create } from "ionicons/icons";
import { useEffect, useState } from "react";
import { apiLoadResource } from "../../dataproviders/dynamic_url.api";
import { ItemResource } from "../callableapps/ContainerAppResource";
import { RoleRightItem } from "../callableapps/ContainerAppRole";

interface ResourceRightModalProp{
    resourceList: ItemResource[];
    onModalClose: (ev:CustomEvent) =>void;
}
export const ResourceRightModal: React.FC<ResourceRightModalProp> = ({resourceList,onModalClose})=>{
    const [resourceId,setResourceId] = useState<string>("");
    const [canCreate, setCanCreate] = useState<boolean>(false);
    const [canEdit, setCanEdit] = useState<boolean>(false);
    const [canDelete, setCanDelete] = useState<boolean>(false);
    const [canList, setCanList] = useState<boolean>(false);
    console.log("Resource Right Modal");
    function setSingleRight(act:string, val:boolean){
        switch(act){
            case 'canCreate':
                setCanCreate(val);
                break;
            case 'canEdit':
                setCanEdit(val);
                break;
            case 'canList':
                setCanList(val);
                break;
            case 'canDelete':
                setCanDelete(val);
                break;
        }
    }
    return (
    <>
        
        <IonHeader>
            <IonToolbar>
              <IonButtons slot="start">
                <IonButton onClick={(ev:any) => {
                    ev.detail = {
                        data:{
                            resourceId,
                            rights:{canCreate,canDelete,canEdit,canList}
                        },
                        role:"cancel"
                    };
                    onModalClose(ev);
                }}>CANCEL</IonButton>
              </IonButtons>
              <IonTitle style={{textAlign: "center"}}>Add Rights Resource</IonTitle>
              <IonButtons slot="end">
                <IonButton strong={true} onClick={(ev: any)=>{
                    ev.detail = {
                        data:{
                            resourceId,
                            rights:{canCreate,canDelete,canEdit,canList}
                        },
                        role:"confirm"
                    };
                    onModalClose(ev);
                }}>
                  OK
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonItem>
                <IonLabel position="stacked">Resources</IonLabel>
                <IonSelect multiple={false} value={resourceId} onIonChange={(e: CustomEvent)=>{setResourceId(e.detail.value)}} placeholder="select availabel resource">
                    {resourceList.map((rsc:ItemResource)=>(<IonSelectOption key={rsc.id} value={rsc.id}>{rsc.name}</IonSelectOption>))}
                </IonSelect>
            </IonItem>
            <IonList>
            <IonItem>
                <IonCheckbox 
                onIonChange={(e:any)=>{
                    if(e)
                    setSingleRight("canCreate", e.detail.checked!)
                }}
                checked={canCreate} />
                <IonLabel>Create</IonLabel>
            </IonItem>
            <IonItem>
                <IonCheckbox 
                    onIonChange={(e:any)=>{
                        if(e.detail){
                            setSingleRight("canDelete", e.detail.checked!)
                        }
                        else{
                            console.log('event null');
                        }
                    }}
                    checked={canDelete} />
                <IonLabel>Delete</IonLabel>
            </IonItem>
            <IonItem>
                <IonCheckbox 
                    onIonChange={(e:any)=>{
                        if(e)
                        setSingleRight("canEdit", e.detail.checked!)
                    }}
                    checked={canEdit} />
                <IonLabel>Update</IonLabel>
            </IonItem>
            <IonItem>
                <IonCheckbox 
                    onIonChange={(e:any)=>{
                        if(e)
                        setSingleRight("canList", e.detail.checked!)
                    }}
                    checked={canList} />
                <IonLabel>List</IonLabel>
            </IonItem>
            </IonList>
          </IonContent>
    </>)
}