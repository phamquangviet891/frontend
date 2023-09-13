import { InputChangeEventDetail, IonButton, IonCol, IonGrid, IonIcon, IonInput, IonItem, IonLabel, IonList, IonRow, IonSelect, IonSelectOption } from "@ionic/react";
import { lockClosed, lockOpen, removeCircleOutline, saveOutline } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { apiUpdateAppFeature, loadDefinedAppFeatures } from "../../dataproviders/dynamic_url.api";
import "./DefinedFeature.css";
import { useAppDispatch } from "../../stores";



export interface DefinedFeatureProp{
    appId: string;
    [prop:string]:any;
}
export interface FeatureContent{
    title: string;
    url?: string;
    iosIcon?: string;
    mdIcon?: string;
    [prop:string]: any;
} 
export interface DefinedFeatureEntity{
    id: string;
    name:string;
    content: FeatureContent;
    [prop:string]: any;
} 
export const DefinedFeatureList: React.FC<DefinedFeatureProp> = ({appId})=>{
    const [definedFeatures, setDefinedFeatures] = useState<Array<DefinedFeatureEntity>>([])
    useEffect(()=>{
        const loadDataFunction = async(appId: string)=>{
            try {
                let result: any = await (await loadDefinedAppFeatures(appId)).json();
                console.log(result)
                setDefinedFeatures(result.definedAppFeatures);
            } catch (error) {
                console.log(error)
            }
        }
        loadDataFunction(appId);
    },[]);
    return <>
    <IonList>
        {definedFeatures.map((el: DefinedFeatureEntity)=>(<FeatureItem key ={el.id} item={el} />
        ))}
    </IonList>
    </>
}
export interface FeatureItemProp{
    item: DefinedFeatureEntity;
}
export const FeatureItem: React.FC<FeatureItemProp>=({item})=>{
    const [title,setTitle] = useState<string|null|undefined>(item.content.title);
    const [name,setName] = useState<string|null|undefined>(item.name);
    const [url,setUrl] = useState<string|null|undefined>(item.content.url);
    const [editable,setEditable] = useState(false);
    function onNameChange(ev: CustomEvent<InputChangeEventDetail>){
        if(ev){
            setName(ev.detail.value);
        }
        
    }
    function onUrlChange(ev: CustomEvent<InputChangeEventDetail>){
        if(ev){
            setUrl(ev.detail.value);
        }
        
    }
    return <IonGrid>
    <IonRow>
        <IonCol className="feature_leftcol">
            <IonList>
                <IonButton title="Xóa">
                    <IonIcon  icon={removeCircleOutline} color="red"/>
                </IonButton>
                <IonButton title="Cập nhật" onClick={()=>{
                    if(editable===true){
                        //thay doi gia tri xong
                        apiUpdateAppFeature({...item, name: name!, content: {...item.content, title: title!, url: url!}})
                    }
                        setEditable(old=>!old);
                    }}>
                    <IonIcon  icon={editable===true?saveOutline:lockClosed} color="success"/>
                </IonButton>
                
            </IonList>
        </IonCol>
        <IonCol>
            <IonList>
        <IonItem>
            <IonLabel position="floating">
                Tên chức năng
            </IonLabel>
            <IonInput onIonChange={onNameChange} disabled={!editable} value={name} />
        </IonItem>
        <IonItem>
            <IonLabel position="floating">
                App Url
            </IonLabel>
            <IonInput onIonChange={onUrlChange} disabled={!editable} value={url} />
        </IonItem>
        <IonItem>
            <IonLabel>
                icon
            </IonLabel>

            <AppIconList />
        </IonItem>
        </IonList>
        </IonCol>
    </IonRow>
    
</IonGrid>
}
const AppIconList: React.FC = ()=>{
    
    const dispatch = useAppDispatch(); 
    
    
    return <IonSelect>
        
        
    </IonSelect>
}