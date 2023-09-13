import { IonAccordion, IonAccordionGroup, IonButton, IonCol, IonContent, IonGrid, IonInput, IonItem, IonLabel, IonList, IonRow, IonSelect, IonSelectOption, useIonPopover } from "@ionic/react";
import React, { useEffect, useRef, useState } from "react";
import { FaEdit, FaTrash} from 'react-icons/fa';
import * as FaIcons from "react-icons/fa";
import { IconContext, icons } from "react-icons/lib";

interface AppFeatures{
    id?:string;
    name?: string;
    content: {
        title?: string;
        url?: string;
        iosIcon?: string;
        mdIcon?:string;
    }
}

interface PropoverProp{
    item: AppFeatures|null;
    onDismis: (data:any, role: string)=>void;
}
const Popover: React.FC<PropoverProp> = ({item, onDismis}) => {
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
    const [icon,setIcon] = useState("");
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
                onDismis({name,url,icon},"confim");
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
            <IonLabel><DynamicFaIcon name={icon}/>Icon</IonLabel>
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
    name: string;
}
const DynamicFaIcon:React.FC<DynamicFaIconProp> = ({ name }) => {

    let icons = FaIcons as any;
    let icon = icons[name];
    const IconComponent = icon;
  
    if (!IconComponent) { // Return a default one
      return <FaIcons.FaInfo />;
    }
  
    return <IconComponent/>;
  };
export const UIComp: React.FC = ()=>{
    const [definedFeatures,setDefinedFeatures] = useState([
        {
            "id": "6357836c9055d31cc9c94d4d",
            "name": "F01",
            "content": {
                "title": "Inbox",
                "codeId": "F01",
                "url": "/page/Inbox",
                "iosIcon": "mailOutline",
                "mdIcon": "mailSharp"
            },
            "callableAppId": "6357836c9055d31cc9c94d4c"
        },
        {
            "id": "6357836c9055d31cc9c94d4e",
            "name": "Outbox",
            "content": {
                "title": "Outbox",
                "url": "/page/Outbox",
                "iosIcon": "paperPlaneOutline",
                "mdIcon": "paperPlaneSharp"
            },
            "callableAppId": "6357836c9055d31cc9c94d4c"
        },
        {
            "id": "6357836c9055d31cc9c94d4f",
            "name": "Favorites",
            "content": {
                "title": "Favorites",
                "url": "/page/Favorites",
                "iosIcon": "heartOutline",
                "mdIcon": "heartSharp"
            },
            "callableAppId": "6357836c9055d31cc9c94d4c"
        },
        {
            "id": "6357836c9055d31cc9c94d50",
            "name": "Archived",
            "content": {
                "title": "Archived",
                "url": "/page/Archived",
                "iosIcon": "archiveOutline",
                "mdIcon": "archiveSharp"
            },
            "callableAppId": "6357836c9055d31cc9c94d4c"
        },
        {
            "id": "6357836c9055d31cc9c94d51",
            "name": "Trash",
            "content": {
                "title": "Trash",
                "url": "/page/Trash",
                "iosIcon": "trashOutline",
                "mdIcon": "trashSharp"
            },
            "callableAppId": "6357836c9055d31cc9c94d4c"
        },
        {
            "id": "6357836c9055d31cc9c94d52",
            "name": "Spam",
            "content": {
                "title": "Spam",
                "url": "/page/Spam",
                "iosIcon": "warningOutline",
                "mdIcon": "warningSharp"
            },
            "callableAppId": "6357836c9055d31cc9c94d4c"
        }
    ]);
    const [item,setItem] = useState<AppFeatures|null>(null);
    function removeFeature(id: string){
        let idx = definedFeatures.findIndex(el=> el.id === id);
        definedFeatures.splice(idx,1);
        setDefinedFeatures([...definedFeatures]);
    }
    function editFeature(e: CustomEvent,el: any){
        setItem(el);
        present({
            event: e,
            onDidDismiss: (e: CustomEvent) => console.log(`Popover dismissed with role: ${e.detail.role}`),
        }); 
    }
    const [present, dismiss] = useIonPopover(<Popover 
        onDismis={(data:any,role: string)=>{
            console.log(data);
            console.log(role);
            dismiss(data,role);
        }} 
        item={item}/>, {
        onDismiss: (data: any, role: string) => dismiss(data, role),
    });
    return (<div>
        <IconContext.Provider value={{ color: "blue", className: "global-class-name" }}>
        <IonList>
            {definedFeatures.map(el=>(
            <IonItem key={el.id}>
                <FaTrash title="Xoa" onClick={()=>{removeFeature(el.id)}} color="red" />
                <IonLabel>{el.name} - {el.content.title} - {el.content.url} <DynamicFaIcon name={el.content.mdIcon}/></IonLabel>
                <FaEdit onClick={(e:any)=>editFeature(e,el)} title="sua" color='blue'/>
            </IonItem>))}
        </IonList>
        </IconContext.Provider>
    </div>);
}