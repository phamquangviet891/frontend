import { IonButton, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonIcon, IonInput, IonItem, IonLabel, IonList, useIonPopover, useIonToast } from "@ionic/react";
import { add, information, informationCircleOutline } from "ionicons/icons";
import { useEffect, useState } from "react";
import { apiCreateAppResource, apiCreateAppRole, apiEditAppResource, apiLoadResource, apiRemoveAppResource } from "../../dataproviders/dynamic_url.api";
import * as FaIcons from 'react-icons/fa';
import { useAppDispatch } from "../../stores";
import { set_toast_message } from "../../stores/reducers/uictrlSlice";
export interface ItemResource {
    id? :string;
    code?:string;
    name?:string;
    callableAppId: string;
    [prop:string]:any;
}
interface ContainerAppResourceProp{
    appId: string;
}
export const ContainerAppResource: React.FC<ContainerAppResourceProp> =  ({appId})=>{
    const [itemList, setItemList] = useState<Array<ItemResource>>([]);
    const [action,setAction] = useState<string>('cancel');
    const [editItem, setEditItem] = useState<ItemResource|null>(null);
    const dispatch = useAppDispatch();
    const [presentPopover, dismissPopover] = useIonPopover(<AppResourcePopover 
        onDismiss={(data:any,role: string)=>{
            dismissPopover(data,role);
        }}
        action = {action} 
        item={editItem}/>, {
        onDismiss: (data: any, role: string) => dismissPopover(data, role),
    });
    
    useEffect(()=>{
        const loadResource = async(appId: string)=>{
            try{
                let result = await apiLoadResource(appId);
                if([200].indexOf(result.status) !== -1){
                    dispatch(set_toast_message({msg:"Đọc dữ liệu thành công", duration: 1500, icon: informationCircleOutline}));
                    setItemList(await result.json());
                }else{
                    dispatch(set_toast_message({msg:"Lỗi đọc dữ liệu", duration: 1500, icon: informationCircleOutline}));
                } 
            }catch(ex){
                dispatch(set_toast_message({msg:"Error loading data!", duration: 1500, icon: informationCircleOutline}));
            }
        }
        loadResource(appId);
    },[]);
    async function addAppResource(e:CustomEvent){
        setAction("create");
        setEditItem({
            name: "nhap ten",
            code: "nhapcode",
            callableAppId: appId,
        });
        presentPopover({
            event: e,
            onDidDismiss: (e: CustomEvent)=> {
                takeActionApiAppResource(e);
            }
        });
        e.preventDefault();
    }
    async function fnOnEdit(id: string, e: CustomEvent){
        setAction("edit");
        let found = itemList?.find(el=>(el.id === id));
        if(found !== undefined){
            setEditItem(found);
            presentPopover({
                event: e,
                onDidDismiss: (e: CustomEvent) => {
                  //console.log(e);
                  takeActionApiAppResource(e);
              },
            })
        }
    }
    async function fnOnRemove(id: string){
        console.log('remove', id);
        let apiRst = await apiRemoveAppResource(id); 
        if([200,204].indexOf(apiRst.status) !==-1){
            //doan xu ly giao dien
            let idx = itemList?.findIndex(el=> el.id === id);
            itemList?.splice(idx!,1);
            setItemList([...itemList!]);
        }else{
            dispatch(set_toast_message({msg:"Xóa dữ liệu không thành công!", duration: 1500, icon: informationCircleOutline}));
            //setInternalMsg("xoa resource that bai");
        }
    }
    async function takeActionApiAppResource(e:CustomEvent) {
        let data = e.detail!.data as ItemResource;
        switch(e.detail.role){
            case "edit":
                console.log("edit thong tin", data);
                try{
                    let itemChange: ItemResource = {...data, callableAppId: appId};
                    let apiResult = await apiEditAppResource(itemChange);
                    if([200,204].indexOf(apiResult.status)!== -1){
                        dispatch(set_toast_message({msg:`Edit Role ${data.id} success`, duration: 1500, icon: informationCircleOutline}));
                        //setInternalMsg(`Edit Role ${data.id} success`);
                        //console.log('cap nhat thanh cong!');
                        let idx = itemList!.findIndex(el => {return el.id === itemChange.id});
                        if(idx !== -1){
                            let news = [...itemList!];
                            news.splice(idx,1);
                            news.splice(idx,0, itemChange);
                            setItemList(news);
                            console.log(news);
                        }
                    }else{
                        dispatch(set_toast_message({msg:`Edit Role ${data.id} unsuccess ${apiResult.json()}`, duration: 1500, icon: informationCircleOutline}));
                        //setInternalMsg(`Edit Role ${data.id} unsuccess ${apiResult.json()}`);
                    }
                }catch(ex){
                    console.log(ex);
                }
                
            break;
            case "create":
                console.log(data);
                try{
                    
                    let apiResult = await apiCreateAppResource({...data, callableAppId: appId});
                    if([200,204].indexOf(apiResult.status)!==-1){
                        
                        //setInternalMsg(`Create Role ${data.name} success`);
                        let news = [...itemList!];
                        news.push(await apiResult.json());
                        setItemList(news);
                    }else{
                        dispatch(set_toast_message({msg:`Create Role ${data.name} unsuccess ${await apiResult.json()}`, duration: 1500, icon: informationCircleOutline}));
                        //setInternalMsg(`Create Role ${data.name} unsuccess ${await apiResult.json()}`);
                    }
                }catch(ex){
                    console.log(ex);
                }
            break;
            case 'cancel':
                dispatch(set_toast_message({msg:'Hủy thao tác', duration: 1500, icon: informationCircleOutline}));
                //setInternalMsg('Hủy thao tác');
            break;
            default:
                dispatch(set_toast_message({msg:'Không nhận diện được hành động', duration: 1500, icon: informationCircleOutline}));
                //setInternalMsg('Không nhận diện được hành động');
            break;
        }
    }
    return (
    <>
        <IonItem slot="header" color="light">
            <IonIcon slot="start" icon={add} color="success" onClick={(e: any)=>{
                addAppResource(e);
            }}/> 
            <IonLabel>Tài nguyên cho ứng dụng({itemList.length} tài nguyên)</IonLabel>
        </IonItem>
        <div className="ion-padding" slot="content">
            <ResourceUpdatableList 
                items={itemList}
                onEdit={fnOnEdit}
                onRemove={fnOnRemove}
            />
        </div>
    </>
  )
}
interface ResourceListProp{
    items: Array<ItemResource>|null|undefined;
    onEdit:(id:string,e:any)=> void;
    onRemove:(id:string)=> void;
}
export const ResourceUpdatableList: React.FC<ResourceListProp>=({items,onEdit, onRemove})=>{
    return <IonList>
    {items?.map(el=>(
        <IonItem key={el.id}>
            <FaIcons.FaTrash onClick={(e:any)=>{onRemove(el.id!)}} color="red" />
            <IonCard >
                <IonCardHeader>
                    <IonCardTitle>{el.code}|{el.name}</IonCardTitle>
                    <IonCardSubtitle>{el.description}</IonCardSubtitle>
                </IonCardHeader>
            </IonCard>
            <FaIcons.FaEdit onClick={(e)=>{onEdit(el.id!,e)}} color="blue"/>
        </IonItem>)
    )}
</IonList>
}
interface AppResourcePopoverProp{
    item: ItemResource|null|undefined;
    action: string;
    onDismiss: (data:any, role: string)=>void;
}
export const AppResourcePopover: React.FC<AppResourcePopoverProp> = ({item,action,onDismiss})=>{
    const [name,setName] = useState<string|undefined>(item?.name);
    const [code,setCode] = useState<string|undefined>(item?.code);
    return (
    <IonContent className="ion-padding">
    <IonItem>
        <IonButton onClick={()=>{
            onDismiss(null,"cancel");
        }} slot="start">cancel</IonButton>
        <IonButton onClick={()=>{
            onDismiss({name,code,id: item?.id, callableAppId: item?.callableAppId},action);
        }} slot="end">OK</IonButton>
    </IonItem>
    <IonItem>
        <IonLabel position={"floating"}>Tên tài nguyên</IonLabel>
        <IonInput onIonChange={(e: any)=>{
            if(e){
                setName(e!.detail?.value);
            }
        }} value={name}></IonInput>
    </IonItem>
    <IonItem>
        <IonLabel position={"floating"}>Mã tài nguyên</IonLabel>
        <IonInput onIonChange={(e:any)=>{
            setCode(e.detail.value);
        }} value={code}></IonInput>
    </IonItem>
    </IonContent>)
}

