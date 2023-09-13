import { OverlayEventDetail } from "@ionic/core/components";
import { IonModal, IonTitle, IonButtons, IonContent, IonInput, IonItem, IonButton, IonHeader, IonLabel, IonToolbar } from "@ionic/react";
import { error } from "console";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LOGIN_INFO_KEY } from "../../configs";
import { createStore } from "../../stores/data/IonicStorage";
import { RootState } from "../../stores/reducers";
import { set_show_login_box } from "../../stores/reducers/uictrlSlice";
import { load } from "../../stores/reducers/userSlice";

import { enterAnimation, leaveAnimation } from "../../_utils/gui.fn";
import { login, outerror } from "../../_utils/common.Fn";

export interface InputChangeEventDetail {
  value: any;
  [prop:string]:any;
}
export interface InputObject{
  value: string;
  error: string;
}

export const LoginModal: React.FC<any> = ()=>{
    const isOpen = useSelector((state:RootState)=> state.UI_CTRL.show_login_box);
    const [email,setEmail] = useState<InputObject>({value:"",error:""});
    const [password,setPassword] = useState<InputObject>({value:"",error:""});
    const dispatch = useDispatch();
    async function onWillDismiss(ev: CustomEvent<OverlayEventDetail>) {
      if (ev.detail.role === 'confirm') {
        console.log(ev.detail.data);
        let result = await login(ev.detail.data);
        if(result !== null){
          dispatch(load(result));
          //luu thong tin vao localstore
          let lstore = await createStore();
          lstore.set(LOGIN_INFO_KEY, JSON.stringify(result));
        }else{
          console.log('dang nhap that bai')
        }
      }
    }
    async function doLogin(){
      if(email.error === "" && email.value !=="" && password.error === "" && password.value !== ""){
        dispatch(set_show_login_box(false));
        let logRst = await login({email: email.value, password: password.value});
        if(logRst !== null){
          dispatch(load(logRst));
          let lstore = await createStore();
          lstore.set(LOGIN_INFO_KEY, JSON.stringify(logRst));
        }else{
          //thong bao cho nguoi dung bang toast
          outerror("thong bao dang nhap khong thanh cong");
        }
      }  else{
        outerror('thong bao du lieu nhap khong hop le');
      }
      

    }
    function emailInputChange(e:CustomEvent<InputChangeEventDetail>){
      setEmail({value: e?.detail.value!, error:""});
    }
    function passwordInputChange(e: CustomEvent<InputChangeEventDetail>){
      console.log(e?.detail.value);
      if(e.detail.value.length < 6){
          setPassword({value: e.detail.value, error:"Độ dài mật khẩu chưa hợp lệ"});
      }else{
          setPassword({value: e.detail.value, error:""});
      }
    }
    return (
        <div>
        <IonModal isOpen={isOpen}
            onWillDismiss={(ev)=> onWillDismiss(ev)}
            enterAnimation={enterAnimation}
            leaveAnimation={leaveAnimation}
        >
          <IonHeader>
            <IonToolbar>
              <IonButtons slot="start">
                <IonButton onClick={() => dispatch(set_show_login_box(false))}>Huy</IonButton>
              </IonButtons>
              <IonTitle>Dang nhap</IonTitle>
              <IonButtons slot="end">
                <IonButton strong={true} onClick={()=>doLogin()}>
                  Confirm
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <IonItem>
              <IonLabel position="stacked">Enter your email</IonLabel>
              <IonInput onIonChange={emailInputChange} type="text" placeholder="email" />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Password</IonLabel>
              <IonInput onIonChange={passwordInputChange} type="password" placeholder="Mat khau" />
            </IonItem>
          </IonContent>
        </IonModal>
        </div>
    );
}