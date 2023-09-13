import { IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonContent } from "@ionic/react";
import { BroadcastButton } from "../components/buttons/BroadcastButton";
import { UserButton } from "../components/buttons/UserButton";
import ExploreContainer from "../components/ExploreContainer";
import { UIComp } from "../components/UIComp";


export const UI: React.FC = ()=>{
    return (
        <IonPage>
          <IonHeader>
            <IonToolbar>
              <IonTitle>UI</IonTitle>
              <IonButtons slot='end'>
                  <BroadcastButton></BroadcastButton>
                  <UserButton/>
                </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent fullscreen>
            <IonHeader collapse="condense">
              <IonToolbar>
                <IonTitle size="large">UI</IonTitle>
                <IonButtons slot='end'>
                  <BroadcastButton></BroadcastButton>
                  <UserButton/>
                </IonButtons>
              </IonToolbar>
            </IonHeader>
            <UIComp />
          </IonContent>
        </IonPage>
      );
}