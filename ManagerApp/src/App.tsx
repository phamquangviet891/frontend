import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, isPlatform, setupIonicReact, useIonViewWillEnter } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { SocketContext } from './context/socket';
import { useContext, useEffect, useState } from 'react';
import { socket_events } from './configs/socket.handler';
import {DeviceUUID} from 'device-uuid';

import Home from './pages/Home';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import { LoginModal } from './components/modals/LoginModal';
import AppManagement from './pages/AppManagement';
import { useAppDispatch } from './stores';
import { load, loadsaved } from './stores/reducers/userSlice';
import { LOGIN_INFO_KEY } from './configs';
import { createStore } from './stores/data/IonicStorage';
import { EditFeatureModal } from './components/modals/EditFeatureModal';
import { UI } from './pages/UI';

setupIonicReact();

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const socket = useContext(SocketContext);
  const [joined, setJoined] = useState<boolean>(false);
  function handleConnect(){
    console.log("Tab1 socket connect event", socket?.connected);
    setJoined(socket?.connected!);
    if(socket?.connected){
      let duuid: string;
      if(isPlatform('mobileweb')|| isPlatform('desktop')|| isPlatform('pwa')){
        duuid = new DeviceUUID().get();
        console.log(duuid);
        if(socket?.connected){
          socket.emit("HUMAN_DEVICE_ONLINE",{UUID: duuid,extinfo: "APP"});
        }else{
          console.log('socket not connect');
        }
      }
      socket.on("STATUS",(message:any)=>{
        console.log("DATA EVENT", message.mess);
      });
    }else{
      socket?.off('HUMAN_DEVICE_ONLINE');
    }
  }
  useEffect(()=>{
    
    //registerAllEvents();
    socket?.on("connect", handleConnect);
    return ()=>{
      for (const event of socket_events) {
        console.log(`HUY Dang ky su kien: ${event.name}`);
        socket?.off(event.name);
      }
    }
  },[joined]);
  useEffect(()=>{
    console.log(`Init Task when app start`);
    const loadPersistData = async()=>{
        let localIonStore = await createStore();
        let info = await localIonStore.get(LOGIN_INFO_KEY);
        if(info !== undefined || info !== ''){
          dispatch(load(JSON.parse(info)));
        }else{
          dispatch(load(null))
        }
    }
    loadPersistData();
    
  },[]);
  return(
  <SocketContext.Provider value={socket}>
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path="/home">
            <Home />
          </Route>
          <Route exact path="/">
            <Redirect to="/home" />
          </Route>
          <Route exact path="/page/app-manager">
            <AppManagement />
          </Route>
          <Route exact path="/page/ui">
            <UI/>
          </Route>
        </IonRouterOutlet>
      </IonReactRouter>
      {/*Khu vuc khai bao cho modal cuar he thong*/}
      <LoginModal/>
      <EditFeatureModal/>
    </IonApp>
    </SocketContext.Provider>
  );
}

export default App;
