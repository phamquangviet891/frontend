import { IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonContent, IonFabButton } from "@ionic/react";
import { useSelector } from "react-redux";
import { BroadcastButton } from "../components/buttons/BroadcastButton";
import { UserButton } from "../components/buttons/UserButton";
import { GridApp } from "../components/grids/GridApp";
import { RootState } from "../stores/reducers";


const AppManagement: React.FC = () => {
    const loginInfo = useSelector((state: RootState)=>state.Login_Info.info);
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>App Managerment</IonTitle>
            <IonButtons slot='end'>
                <BroadcastButton></BroadcastButton>
                <UserButton/>
              </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <IonHeader collapse="condense">
            <IonToolbar>
              <IonTitle size="large">App Managerment</IonTitle>
              <IonButtons slot='end'>
                <BroadcastButton></BroadcastButton>
                <UserButton/>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          {loginInfo === null?<div className="content">NO INFO DISPLAY PLEASE LOGIN</div>:<GridApp/>}
        </IonContent>
      </IonPage>
    );
  };
  
  export default AppManagement;