import { IonAccordion, IonAccordionGroup, IonButton, IonCol, IonContent, IonGrid, IonIcon, IonInput, IonItem, IonLabel, IonList, IonRow, useIonPopover } from "@ionic/react";
import { add } from "ionicons/icons";
import React from "react";
import { useEffect, useRef, useState } from "react";
import * as FaIcons from "react-icons/fa";
import { IconContext } from "react-icons/lib";
import { apiRemoveAppFeature, apiUpdateAppFeature, apiCreateAppFeature, loadDefinedAppFeatures } from "../../dataproviders/dynamic_url.api";
import { useAppDispatch } from "../../stores";
import { set_toast_message } from "../../stores/reducers/uictrlSlice";


export interface AppFeatures{
  id?:string;
  name?: string;
  content: {
      title?: string;
      url?: string;
      iosIcon?: string;
      mdIcon?:string;
  }
}
interface ContainerAppFeatureProp {
  appId: string;
}
export const ContainerAppFeature: React.FC<ContainerAppFeatureProp> = ({appId})=>{
    const [definedFeatures, setDefinedFeatures] = useState<Array<AppFeatures>>([]);
    const [action,setAction] = useState<string>('cancel');
    const [editItem,setEditItem] = useState<AppFeatures|null|undefined>(null);
    const dispatch = useAppDispatch();
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
    const [presentPopover, dismissPopover] = useIonPopover(<AppFeaturePopover 
        onDismis={(data:any,role: string)=>{
            dismissPopover(data,role);
        }}
        action = {action} 
        item={editItem}/>, {
        onDismiss: (data: any, role: string) => dismissPopover(data, role),
    });
    
    async function addFeature(e: CustomEvent){
      setAction('create');
      setEditItem({
        name: "input name",
        //code: "input appcode",
        content:{
          title: "nhap",
          url: "nhap",
          mdIcon: "FaInfo",
          iosIcon: "FaInfo"
        }
      });
      presentPopover({
          event: e,
          onDidDismiss: (e: CustomEvent) => {
            //console.log(e);
            takeActionApiFeature(e);
        },
      });
      
    }
    async function removeFeature(id:string) {
      //console.log(`remove id:${id}`);
      //console.log(`Delete feature ${id}`);
        let apiRst = await apiRemoveAppFeature(id); 
        if([200,204].indexOf(apiRst.status) !==-1){
            //doan xu ly giao dien
            let idx = definedFeatures.findIndex(el=> el.id === id);
            definedFeatures.splice(idx,1);
            setDefinedFeatures([...definedFeatures]);
        }
    }
    async function editFeature(id: string,e: CustomEvent){
      //console.log(`edit item`, id);
      setAction("edit");
      let edited = definedFeatures.find(el=>(el.id === id));
      if(edited !== undefined){
        setEditItem(edited!);
        
        presentPopover({
            event: e,
            onDidDismiss: (e: CustomEvent) => {
                takeActionApiFeature(e);
            },
        }); 
      }
      

    }
    async function takeActionApiFeature(e:CustomEvent){
      //console.log(e.detail.role);
      //console.log(e.detail.data);
      switch(e.detail.role){
          case 'edit': 
            try{
                  let itemChange = {
                      id: e.detail.data.id,
                      name: e.detail.data.name,
                      content: {
                          title: e.detail.data.name,
                          url: e.detail.data.url,
                          iosIcon: e.detail.data.icon,
                          mdIcon: e.detail.data.icon
                      }
                  } as AppFeatures;
                  //console.log(itemChange);
                  let apiRst = await apiUpdateAppFeature(itemChange);
                  if([200,204].indexOf(apiRst.status) !== -1){
                      dispatch(set_toast_message({msg:'cap nhat thanh cong!'}));
                      let idx = definedFeatures.findIndex(el => {return el.id === itemChange.id});
                      if(idx !== -1){
                          let news = [...definedFeatures];
                          news.splice(idx,1);
                          news.splice(idx,0, itemChange);
                          setDefinedFeatures(news);
                          console.log(news);
                      }
                      
                  }else{
                      dispatch(set_toast_message({msg:'cap nhat that bai',color:"danger"}));
                  }
              }catch(error: Error|any){
                dispatch(set_toast_message({msg:`loi cuc bo ${error.message}`, color: "danger"}));
              }
             
            break;
          case "create":
            try{
              let itemChange = {
                  id: e.detail.data.id,
                  name: e.detail.data.name,
                  content: {
                      title: e.detail.data.name,
                      url: e.detail.data.url,
                      iosIcon: e.detail.data.icon,
                      mdIcon: e.detail.data.icon
                  },
                  callableAppId: appId,
              } as AppFeatures;
              //console.log(itemChange);
              let apiRst = await apiCreateAppFeature(itemChange);
              if([200].indexOf(apiRst.status) !== -1){
                dispatch(set_toast_message({msg:'Thêm mới tính năng thành công!'}));
                let news = [...definedFeatures];
                news.push(await apiRst.json())
                setDefinedFeatures(news);
                console.log(news);
                  
              }else{
                dispatch(set_toast_message({msg:'them moi that bai',color:"danger"}));
              }
            }catch(error: Error|any){
              dispatch(set_toast_message({msg:`Lỗi ứng dụng ${error.message}`, color:'danger'}));
            }
          break;
          case 'cancel':
            dispatch(set_toast_message({msg:'Hủy thao tác'}));
          break;
      }
    }
    
    
    return (
      <>
          <IonItem slot="header" color="light">
            <IonIcon  
              slot="start" 
              icon={add} color="success" 
              onClick={(e: any)=>{
                addFeature(e);
                
              }}
            />
            <IonLabel>Chứng năng của ứng dụng({definedFeatures?definedFeatures.length:0} chức năng)</IonLabel>
          </IonItem>
          
          <div className="ion-padding" slot="content">
                <FeatureUpdatableList 
                  items = {definedFeatures}
                  onRemove = {removeFeature}
                  onEdit = {editFeature}
                />
          </div>
        </>
    );
}
interface FeatureListProp{
  items: Array<AppFeatures>;
  onRemove: (id:string)=>void;
  onEdit:(id: string,e: CustomEvent) =>void;
}
const FeatureUpdatableList: React.FC<FeatureListProp> = ({items, onRemove, onEdit})=>{
  if(Array.isArray(items)){
    return (
      <IonList>
        {items.map(el=>(
        <IonItem key={el.id}>
          <FaIcons.FaTrash color="red" onClick={()=>{onRemove(el.id!)}}/>
          <IonLabel>{el.name}-{el.content.url}-<DynamicFaIcon color="green" name={el.content.mdIcon?el.content.mdIcon:"FaInfo"}/>{}</IonLabel> 
          <FaIcons.FaEdit color="blue" onClick={(e: any)=>{onEdit(el.id!,e)}}/>
        </IonItem>))}
      </IonList>
    )
  }else{
    return <><p>No thing to display</p></>
  }
  
};
interface AppFeaturePopoverProp{
  item: AppFeatures|null|undefined;
  action: string;
  onDismis: (data:any, role: string)=>void;
}
export const AppFeaturePopover: React.FC<AppFeaturePopoverProp> = ({item,action, onDismis}) => {
  const [selectItems,setSelectItems] = useState<Array<any>>([]);
  useEffect(()=>{
      let icons = FaIcons as any;
      let iconSelect = [];
      for (const key in icons) {
          if (Object.prototype.hasOwnProperty.call(icons, key)) {
              const element = icons[key];
              iconSelect.push({value: key, label: (<DynamicFaIcon name={key}/>)})
          }
      }
      setSelectItems(iconSelect);
  },[]);
  const [icon,setIcon] = useState<string|null|undefined>('FaInfoCircle');
  const [name,setName] = useState<string|null|undefined>(item?.name);
  const [url,setUrl] = useState<string|null|undefined>(item?.content.url);
  function selectIcon(el: string){
      setIcon(el);
      toggleAccordion();
  }
  const accordionGroup = useRef<null | HTMLIonAccordionGroupElement>(null);
  const toggleAccordion = () => {
      if (!accordionGroup.current) {
      return;
      }
      const nativeEl = accordionGroup.current;

      if (nativeEl.value === 'first') {
          nativeEl.value = undefined;
      } else {
          nativeEl.value = 'first';
      }
  };
  return (
  <IonContent className="ion-padding">
      <IonItem>
          <IonButton onClick={()=>{
              onDismis(null,"cancel");
          }} slot="start">cancel</IonButton>
          <IonButton onClick={()=>{
              onDismis({name,url,icon,id: item?.id},action);
          }} slot="end">OK</IonButton>
      </IonItem>
      <IonItem>
          <IonLabel position={"floating"}>Tên chức năng</IonLabel>
          <IonInput onIonChange={(e)=>{
              if(e){
                  setName(e!.detail?.value);
              }
              
          }} value={name}></IonInput>
      </IonItem>
      <IonItem>
          <IonLabel position={"floating"}>Đường dẫn chức năng</IonLabel>
          <IonInput onIonChange={(e)=>{
              setUrl(e.detail.value);
          }} value={url}></IonInput>
      </IonItem>
      <IconContext.Provider value={{ color: "blue", className: "global-class-name" }}>
      <IonAccordionGroup ref={accordionGroup}>
      <IonAccordion value="first">
          <IonItem slot="header" color="light">
          <IonLabel><DynamicFaIcon name={icon!}/>Icon</IonLabel>
          </IonItem>
          <div className="ion-padding" slot="content">
          <IonGrid>
              <IonRow>
                  {selectItems.map(el => (<IonCol onClick={()=>{selectIcon(el.value)}} key={el.value}><DynamicFaIcon name={el.value}/></IonCol>))}
              </IonRow>
          </IonGrid>
          </div>
      </IonAccordion>
      </IonAccordionGroup>
      </IconContext.Provider>
  </IonContent>
  );
}
interface DynamicFaIconProp{
  name?: string;
  color?: string;
}
export const DynamicFaIcon:React.FC<DynamicFaIconProp> = ({ name, color }) => {

  let icons = FaIcons as any;
  let icon = icons[name?name:"FaInfo"];
  
  const IconComponent = icon;

  if (!IconComponent) { // Return a default one
    console.log(name);
    return <FaIcons.FaInfo color={color}/>;
  }

  return <IconComponent color={color}/>;
};