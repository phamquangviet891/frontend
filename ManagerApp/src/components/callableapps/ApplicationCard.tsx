import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonIcon, IonInput, IonButton, IonList, IonItem, AccordionGroupCustomEvent, IonAccordion, IonAccordionGroup, IonLabel, IonCardSubtitle, useIonPopover } from "@ionic/react";
import { apps, lockClosed, lockClosedOutline, lockOpen } from "ionicons/icons";
import { useRef, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { ContainerAppResource } from "./ContainerAppResource";
import { ContainnerAppRole } from "./ContainerAppRole";

import { ContainerAppFeature } from "./ContainerFeature";

export interface ApplicationCardProps{
    app:any;
    [prop:string]: any;
}
export const ApplicationCard:React.FC<ApplicationCardProps> = ({app})=>{
    const [nameEdit,setNameEdit] = useState<Boolean>(false);
    const listenerOut = useRef<null | HTMLParagraphElement>(null);
    const values = ['Tính năng', 'Vai trò', 'Tài nguyên'];
    const accordionGroupChange = (ev: AccordionGroupCustomEvent) => {
      const nativeEl = listenerOut.current;
      if (!nativeEl) {
        return;
      }

      const collapsedItems = values.filter((value) => value !== ev.detail.value);
      const selectedValue = ev.detail.value;
      //console.log(ev.currentTarget);
      nativeEl.innerText = `
          Đang mở: ${selectedValue === undefined ? 'None' : ev.detail.value}
          Đóng: ${collapsedItems.join(', ')}
        `;
    };
    
    return (
    <IonCard>
        <IonCardHeader>
        <IonCardTitle>
          <IonItem>
              <IonInput disabled={!nameEdit} value={app.AppName}></IonInput>
              <IonButton onClick={(e)=>{
                      console.log("Click");
                      setNameEdit(old=>!old);
              }}>
              <IonIcon  icon={nameEdit?lockOpen:lockClosed} />
              </IonButton>
          </IonItem>
          
        </IonCardTitle>
        <IonCardSubtitle>{app.AppDescription}</IonCardSubtitle>
        </IonCardHeader>
        <IonCardContent>
            <IonList>
                <IonItem>
                    <IonInput value={app.AppKey} ></IonInput><IonButton onClick={(e)=>{
                    console.log("Click");
                        setNameEdit(old=>!old);
                    }}><IonIcon icon={lockClosedOutline}/></IonButton>
                </IonItem>
                <IonAccordionGroup onIonChange={accordionGroupChange}>
                  <IonAccordion value="Tính năng">
                    <ContainerAppFeature appId={app.id}/>
                  </IonAccordion>
                  <IonAccordion value='Vai trò'>
                    <ContainnerAppRole appId={app.id} />
                  </IonAccordion>
                  <IonAccordion value="Tài nguyên">
                    <ContainerAppResource appId={app.id}/>
                  </IonAccordion>
                </IonAccordionGroup>
                <p ref={listenerOut}></p>
            </IonList>
        </IonCardContent>
    </IonCard>
    )
}