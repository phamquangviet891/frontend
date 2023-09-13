import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCheckbox, IonContent, IonIcon, IonInput, IonItem, IonLabel, IonList, IonText, IonTextarea, useIonAlert, useIonModal, useIonPopover, useIonToast } from "@ionic/react";
import { add, addCircleOutline, banOutline, chevronBackCircleOutline, chevronDownCircle, chevronDownCircleOutline, chevronUpCircle, chevronUpCircleOutline, cogOutline, createOutline, informationCircle, remove, trashBinOutline, warningOutline } from "ionicons/icons";
import { useEffect, useState } from "react";
import { apiCreateAppRole, apiCreateRight, apiEditAppRole, apiLoadResource, apiLoadRoleResources, apiRemoveAppRole, apiUpdateRight, loadAppRoles } from "../../dataproviders/dynamic_url.api";
import './ContainerAppRole.css';
import { ResourceRightModal } from "../modals/ResourceRightModal";
import { ItemResource } from "./ContainerAppResource";

export interface SimpleRoleRightRecord
{
    id?: string;
    callableAppId: string;
    resourceId: string;
    roleId: string;
    canCreate?: boolean;
    canEdit?: boolean;
    canList?: boolean;
    canDelete?: boolean;
}


interface ContainerAppRoleProp{
    appId: string;
}
export interface AppRole{
    id?: string;
    name: string;
    description?:string;
    callableAppId: string;
}
export const ContainnerAppRole:React.FC<ContainerAppRoleProp> = ({appId})=>{
    const [appRoles,setAppRoles] = useState<AppRole[]|null|undefined>([]);
    const [action,setAction] = useState<string>("cancel");
    const [editItem,setEditItem] = useState<AppRole|null>(null);
    const [presentPopover, dismissPopover] = useIonPopover(<AppRolePopover 
        onDismiss={(data:any,role: string)=>{
            dismissPopover(data,role);
        }}
        action = {action} 
        item={editItem}/>, {
        onDismiss: (data: any, role: string) => dismissPopover(data, role),
    });
    useEffect(()=>{
        const loadDataFunction = async(appId: string)=>{
            try {
                let result: any = await (await loadAppRoles(appId)).json();
                console.log(result)
                setAppRoles(result.roles);
            } catch (error) {
                console.log(error)
            }
        }
        
        loadDataFunction(appId);
    },[]);
    
   async function addAppRole(e: CustomEvent) {
        setEditItem({
            name: "nhap ten vai tro",
            description: "mo ta cho vai tro",
            callableAppId: appId,
        });
        setAction("create");
        presentPopover({
            event: e,
            onDidDismiss: (e: CustomEvent)=> {
                takeActionApiAppRole(e);
            }
        });

   }
    async function fnOnEdit(id:string, e: CustomEvent) {
        console.log('edit', id);
        setAction("edit");
        let found = appRoles?.find(el=>(el.id === id));
        if(found !== undefined){
            setEditItem(found);
            presentPopover({
                event: e,
                onDidDismiss: (e: CustomEvent) => {
                  //console.log(e);
                  takeActionApiAppRole(e);
              },
            })
        }
        
    }
    async function takeActionApiAppRole(e:CustomEvent) {
        let data = e.detail!.data as AppRole;
        switch(e.detail.role){
            case "edit":
                console.log("edit thong tin", data);
                try{
                    let itemChange = {...data, callableAppId: appId};
                    let apiResult = await apiEditAppRole(itemChange);
                    if([200,204].indexOf(apiResult.status)!== -1){
                        //setInternalMsg(`Edit Role ${data.id} success`);
                        //console.log('cap nhat thanh cong!');
                        let idx = appRoles!.findIndex(el => {return el.id === itemChange.id});
                        if(idx !== -1){
                            let news = [...appRoles!];
                            news.splice(idx,1);
                            news.splice(idx,0, itemChange);
                            setAppRoles(news);
                            console.log(news);
                        }
                    }else{
                        //setInternalMsg(`Edit Role ${data.id} unsuccess ${apiResult.json()}`);
                    }
                }catch(ex){
                    console.log(ex);
                }
                
            break;
            case "create":
                console.log(data);
                try{
                    
                    let apiResult = await apiCreateAppRole({...data, callableAppId: appId});
                    if([200,204].indexOf(apiResult.status)!== -1){
                        //setInternalMsg(`Create Role ${data.name} success`);
                        //remove appRole khoi bien state
                        let news = [...appRoles!];
                        news.push(await apiResult.json());
                        setAppRoles(news);
                    }else{
                        //setInternalMsg(`Create Role ${data.name} unsuccess ${apiResult.json()}`);
                    }
                }catch(ex){
                    console.log(ex);
                }
            break;
            case 'cancel':
                //setInternalMsg('Hủy thao tác');
            break;
            default:
            break;
        }
    }
    async function fnOnRemove(id:string) {
        console.log('remove', id);
        let apiRst = await apiRemoveAppRole(id); 
        if([200,204].indexOf(apiRst.status) !==-1){
            //doan xu ly giao dien
            let idx = appRoles?.findIndex(el=> el.id === id);
            appRoles?.splice(idx!,1);
            setAppRoles([...appRoles!]);
        }
    }
    return (
        <>
        <IonItem slot="header" color="light">
            
            <IonIcon  slot="start" icon={add} color="success" onClick={(e: any)=>{
                addAppRole(e);
            }}/> 
            
            <IonLabel>Các vai trò người dùng trong ứng dụng({appRoles?.length} vai trò)</IonLabel>
        </IonItem>
        <div className="ion-padding" slot="content">
            <RoleUpdatableList 
                onEdit={fnOnEdit}
                onRemove={fnOnRemove}
                items = {appRoles} 
            />
        </div>
        </>
    )
}
interface RoleListProp{
    items: Array<AppRole>|null|undefined;
    onEdit:(id:string,e:any)=> void;
    onRemove:(id:string)=> void;
}
export const RoleUpdatableList: React.FC<RoleListProp>=({items,onEdit, onRemove})=>{
    return <IonList>
    {items?.map(el=>(
    <RoleItem 
        key={el.id}
        item = {el}
        onEdit = {onEdit}
        onRemove = {onRemove}
    />
    ))}
</IonList>
}
interface RoleItemProp{
    item: AppRole;
    onEdit:(id:string,e:any)=> void;
    onRemove:(id:string)=> void;
}
export const RoleItem: React.FC<RoleItemProp>=({item,onEdit,onRemove})=>{
    const [expand,setExpand] = useState<boolean>(false);
    const [presentAlert] = useIonAlert();

    return (
        <>
            <IonItem lines={"inset"}>
            <IonButtons
                slot="start"  
            >
            <IonButton
                onClick={(e)=>{
                    presentAlert({
                        header: 'Cannh bao! cac phan quyen cho vai to nay cun ung dung se bi xoa',
                        buttons: [
                        {
                            text: 'Cancel',
                            role: 'cancel',
                            handler: () => {
                                
                            },
                        },
                        {
                            text: 'OK',
                            role: 'confirm',
                            handler: () => {
                                
                            },
                        },
                        ],
                        onDidDismiss: (e: CustomEvent) => {
                            if(e.detail.role === 'confirm'){
                                onRemove(item.id!)
                            }else{
                                console.log('alert cancel do nothig');
                            }
                        },
                    })
                }} 
            >
            <IonIcon 
                icon={trashBinOutline} 
                color="danger"        
            />
            </IonButton>
            </IonButtons>
            <IonLabel>
                <h2>{item.name}</h2>
                <p>{item.description}</p>
            </IonLabel>
            <IonButtons slot="end">
                <IonButton 
                    
                    onClick={(e)=>{onEdit(item.id!,e)}} 
                    color="success"
                    //slot="end"
                >
                <IonIcon icon={createOutline} />
                </IonButton>
                <IonButton 
                    onClick={(e)=>{setExpand(old=>!old)}} 
                >
                <IonIcon 
                    color="tertiary"
                    icon={!expand?chevronDownCircleOutline:chevronUpCircleOutline} 
                />
                </IonButton>
            </IonButtons>
        </IonItem>
        {expand?(<RoleRightList key={item.id} appId={item.callableAppId} roleId={item.id!}/>):""}
    </>
    );
}
interface RoleRightListProp{
    appId: string;
    roleId: string;
}
export interface RoleRightItem{
    id?:string;
    canCreate?: boolean;
    canEdit?: boolean;
    canDelete?: boolean;
    canList?:boolean;
    resource: any;
    role: any;
    [prop:string]: any;
}
const RoleRightList: React.FC<RoleRightListProp> = ({appId,roleId})=>{
    const [rightList,setRightList] = useState<RoleRightItem[]>([]);
    const [reload,setReload] = useState<boolean>(true);
    const [resourceList, setResourceList] = useState<any>([]);
    const [presentResouceRight, dissmisResourceRight] = useIonModal(ResourceRightModal,{
        onModalClose: handleModalClose,
        resourceList: resourceList.filter((rsc:ItemResource)=>(rightList.map(el=>el.resource.id).indexOf(rsc.id)===-1)),
    });
    const [presentToast] = useIonToast();
    async function handleModalClose(event: CustomEvent){
        console.log(event.detail);
        let {data,role} = event.detail;
        data.callableAppId = appId;
        data.roleId = roleId;
        if(role === 'confirm'){
            //tien hanh cap nhat server
            if(data.resourceId == ""){
                presentToast({
                    message:"Chưa chọn tài nguyên để cấp phát cho vai trò",
                    icon: warningOutline,
                    color: 'warning',
                    position:'middle',
                    duration: 1500
                });
            }else{
                presentToast({
                    message:"Đủ điều kiện phân quyền",
                    icon: cogOutline,
                    color: 'success',
                    position:'middle',
                    duration: 1500
                });
                console.log(data);
                let result = await apiCreateRight({
                    callableAppId: data.appId, 
                    resourceId: data.resourceId,
                    roleId: data.roleId,
                    canCreate: data.rights.canCreate,
                    canEdit: data.rights.canEdit,
                    canList: data.rights.canList,
                    canDelete: data.rights.canDelete
                } as SimpleRoleRightRecord);
                if([200].indexOf(result.status) !==-1){
                    setReload(true);
                    dissmisResourceRight();
                }
                
            }
        }else{
            dissmisResourceRight();
        }
        
    };
    useEffect(()=>{
        const loadApiRoleRightData = async(roleId: string)=>{
            try {
                let result = await apiLoadRoleResources(roleId);
                let data = await result.json();
                console.log(data);
                setRightList(data);
            } catch (error) {
                console.log(error);
            }
        }
        const loadResourceListData = async(appId:string)=>{
            try {
                let result = await apiLoadResource(appId);
                let data = await result.json();
                setResourceList(data);
                //setRscSeletectable();
            } catch (error) {
                console.log(error);
            }
        }
        if(reload === true){
            loadApiRoleRightData(roleId);
            loadResourceListData(appId);
            setReload(false);
        }
        
    },[reload]);
    return (<>
        <IonItem key={`rolerightlist${roleId}`}>
            <IonButton slot="start" title="Bổ sung quyen"
                onClick={e=>{
                    presentResouceRight();
                }}
            >
                <IonIcon 
                color="success" 
                icon={addCircleOutline}
                />
            </IonButton><p>Các quyền</p>
        </IonItem>
        
        <IonList>
        {rightList.map(it=>(
            <RightItem key = {it.id} item={it}/>
        ))}
        </IonList>
    </>)
}
interface RightItemProp{
    item: RoleRightItem;
}
const RightItem: React.FC<RightItemProp>=({item})=>{
    const [create,setCreate] = useState<boolean|false>(Boolean(item.canCreate));
    const [edit,setEdit] = useState<boolean|false>(Boolean(item.canEdit));
    const [list,setList] = useState<boolean|false>(Boolean(item.canList));
    const [remove,setRemove] = useState<boolean|false>(Boolean(item.canDelete));
    const [presentToast] = useIonToast();
    const patchRemote = async(id:string, name: string, value: boolean)=>{
        console.log('upddate right');
        let upObj:{id:string;[prop:string]:any} = {id: id};
        upObj[name] = value;
        let result = await apiUpdateRight(upObj);
        if([200,204].indexOf(result.status) !== -1){
            presentToast({
                message: "Cập nhật quyền thành công", 
                icon: informationCircle, 
                duration:1500, 
                position: "middle"
            });
        }else{
            alert('update that bai');
        }
    }
    return (
        <IonItem>
            <IonLabel slot="start"><IonText color={"danger"}>{item.resource.name}</IonText></IonLabel>
            <IonCheckbox
                checked={create}
                onIonChange={(e=>{patchRemote(item.id!,"canCreate",e.detail.checked)})}
             />
             <IonLabel title="create">C</IonLabel>

            <IonCheckbox 
                checked={remove}
                onIonChange={(e=>{patchRemote(item.id!,"canDelete",e.detail.checked)})}
            />
            <IonLabel title="delete">R</IonLabel>

            <IonCheckbox 
                checked={edit}
                onIonChange={(e=>{patchRemote(item.id!,"canEdit",e.detail.checked)})}
            />
            <IonLabel title="edit">U</IonLabel>

            <IonCheckbox 
                checked={list}
                onIonChange={(e=>{patchRemote(item.id!,"canList",e.detail.checked)})}
            />
            <IonLabel title="List">L</IonLabel>
        </IonItem>
    );
}
interface AppRolePopoverProp{
    item: AppRole|null|undefined;
    action: string;
    onDismiss: (data:any, role: string)=>void;
  }
export const AppRolePopover: React.FC<AppRolePopoverProp> = ({item,action,onDismiss})=>{
    const [name,setName] = useState<string|undefined>(item?.name);
    const [description,setDescription] = useState<string|undefined>(item?.description);
    return (
    <IonContent className="ion-padding">
    <IonItem>
        <IonButton onClick={()=>{
            onDismiss(null,"cancel");
        }} slot="start">cancel</IonButton>
        <IonButton onClick={()=>{
            onDismiss({name,description,id: item?.id},action);
        }} slot="end">OK</IonButton>
    </IonItem>
    <IonItem>
        <IonLabel position={"floating"}>Tên vai trò</IonLabel>
        <IonInput onIonChange={(e: any)=>{
            if(e){
                setName(e!.detail?.value);
            }
            
        }} value={name}></IonInput>
    </IonItem>
    <IonItem>
        <IonLabel position={"floating"}>Mô tả</IonLabel>
        <IonTextarea rows={3} onIonChange={(e:any)=>{
            setDescription(e.detail.value);
        }} value={description}></IonTextarea>
    </IonItem>
    </IonContent>)
}

