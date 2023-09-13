import { IonBadge, IonButton } from "@ionic/react";
import { useSelector } from "react-redux";
import { APP_MESSAGE_TYPE } from "../../configs";
import { RootState } from "../../stores/reducers";
import loudSpeaker from  '../../svgicons/loud-speaker.svg';
import './BroadcastButton.css';
export const BroadcastButton: React.FC<any> = ()=>{
    const messages = useSelector((state:RootState)=>state.MESGS.items).map((el)=> el.msgType === APP_MESSAGE_TYPE.BROADCAST);
    return (
        <IonButton title= "Tin quảng bá" className="ion-button-customize overflow-allow">
              <img src={loudSpeaker} alt=""/>
              <IonBadge className="ion-badge-customize" color={"danger"}>{messages.length}</IonBadge>
        </IonButton>
        
    );
}