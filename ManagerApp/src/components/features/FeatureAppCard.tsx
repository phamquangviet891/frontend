import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonIcon } from "@ionic/react";
import { DynamicFaIcon } from "../callableapps/ContainerFeature";

import './FeatureAppCard.css';

export interface AppFeature{
    title : string;
    url: string;
    iosIcon? : string;
    mdIcon? : string;
    [prop:string]: any;
}
export interface AppCardProps {
    item: {
        id: string;
        name: string;
        content: AppFeature;
    }
}
export const FeatureAppCard:React.FC<AppCardProps> = ({item})=>{
    //console.log(item);
    return (
    <IonCard 
        routerLink={item.content.url} 
        className="app-feature-box" 
        title={item.content.description?item.content.description:"Chưa có mô tả"}
    >
        <IonCardHeader><IonCardTitle>{item.content.title}</IonCardTitle></IonCardHeader>
        <IonCardContent>
            {item.content.mdIcon?.startsWith('data:image')?<img alt="" src={item.content.mdIcon}/>:<DynamicFaIcon name={item.content.mdIcon}/>}
        </IonCardContent>
    </IonCard>
    )
}