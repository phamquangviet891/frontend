import { APP_KEY, BASE_API_PATH, BASE_URL, DEBUG_API_PATH, DEBUG_MODE, DEBUG_URL, MapValue, MAP_RESOURCE, PUBLIC_FRONTEND_URL } from "../configs";
import store from "../stores";
import { RootState } from "../stores/reducers";
import {omit} from 'lodash';
import { AppFeatures } from "../components/callableapps/ContainerFeature";
import { AppRole, RoleRightItem, SimpleRoleRightRecord } from "../components/callableapps/ContainerAppRole";
import { ItemResource } from "../components/callableapps/ContainerAppResource";
import { SimpleAppRecord } from "../components/grids/GridApp";


export interface DataForRequest{
    data?: any,
    params?: any,
}
export function getUserInfoBaseUrl(){
    let state: RootState = store.getState();
    if(state.Login_Info.info !== null){
        if(state.Login_Info.info.userProfile.backend_url){
            if(DEBUG_MODE !== true){
                return state.Login_Info.info.userProfile.backend_url;
            }else{
                return DEBUG_URL;
            }
        }else{
            if(DEBUG_MODE !== true){
                return BASE_URL;
            }else{
                return DEBUG_URL;
            }
        }
        
    }else{
        if(DEBUG_MODE !== true){
            return BASE_URL;
        }else{
            return DEBUG_URL;
        }
    }
    
}
export function GetUserInfo(){
    let state: RootState = store.getState();
    return state.Login_Info.info;
}
export function BuildDataURL(mapval: MapValue, params: any,filter?: any):string{
    let baseurl: string = getUserInfoBaseUrl() as unknown as string;
    let path:string = DEBUG_MODE===true? DEBUG_API_PATH: BASE_API_PATH;
    if(path === ""){
        if(baseurl.endsWith(`/`)){
            baseurl = baseurl.substring(0,baseurl.length-1);
        }
    }else{
        if(path.startsWith('/')){
            path = path.substring(1);
        }
        if(path.endsWith('/')){
            path = path.substring(0,path.length-1);
        }
    }
    return `${baseurl}/${path}/${BuildDataPath(mapval,params, filter)}`;
}
export function BuildDataPath(mapval: MapValue, params: any, filter?:any):string{
    let returnVal: string = mapval.path;
    for (const key in params) {
        if (Object.prototype.hasOwnProperty.call(params, key)) {
            const el = params[key];
            if(["string", 'number'].indexOf(typeof(el)) !== -1){
                returnVal = returnVal.replaceAll(`{${key}}`,el);
            }else{
                returnVal = returnVal.replaceAll(`{${key}}`,JSON.stringify(el));
            }
        }
    }
    if(filter){
        returnVal = returnVal + '?filter='+JSON.stringify(filter);
    }
    return returnVal;
}
export function buildLoggedUserRequestHeader() : any{
    let loggedUsr = GetUserInfo();
    return {
        accept:'application/json',
        'content-type': 'application/json',
        'Access-Control-Allow-Origin':PUBLIC_FRONTEND_URL,
        'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        'apikey': APP_KEY,
        'authorization': `Bearer ${loggedUsr?.accessInfo.token}`
    }
}
export function BuildRequestInfo(mapval: MapValue, data?: DataForRequest): RequestInit{
    let rqstInit: RequestInit = {
        headers: buildLoggedUserRequestHeader(),
        method: mapval.method,
    };
    //url: buildDataURL(mapval, data.params),
    switch(mapval.method.toUpperCase()){
        case 'POST':
        case 'PUT':
        case 'PATCH':
            rqstInit.body = JSON.stringify(data?.data)        
            break;    
    }
    return rqstInit;
}
//===================================================
/**
 * Lay profile cua nguoi dung
 * @param userId id cua profile can lay
 * @returns promise
 */
export async function GetUserProfile(userId: string){
    let localResource: string = "userprofile";
    let mapval = MAP_RESOURCE[localResource];
    if(mapval !== undefined){ 
        try {
            let initRequest: RequestInit = BuildRequestInfo(mapval);
            let callUrl = BuildDataURL(mapval,{userId})
            return await fetch(callUrl,initRequest);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }else{
        throw new Error("invalid resource map")
    }
}
/**
 * Function doc danh sach cac ung dung
 * @returns danh sach cac uung dung theo vai tro
 */
export async function apiLoadCallableAppList():Promise<Response>{
    let localResource: string = "list_applications";
    let mapval = MAP_RESOURCE[localResource];
    if(mapval !== undefined){ 
        try {
            let initRequest: RequestInit = BuildRequestInfo(mapval);
            
            let callUrl = BuildDataURL(mapval,{})
            return await fetch(callUrl,initRequest);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }else{
        throw new Error("invalid resource map")
    }
}
/**Func tion taoj uung dung moi cho nguowi dung 
 * 
*/
export async function apiCreateCallableApp(app: SimpleAppRecord):Promise<Response>{
    let localResource: string = "create_applications";
    let mapval = MAP_RESOURCE[localResource];
    if(mapval !== undefined){ 
        try {
            let initRequest: RequestInit = BuildRequestInfo(mapval,{data:{...app}});
            let callUrl = BuildDataURL(mapval,{})
            return await fetch(callUrl,initRequest);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }else{
        throw new Error("invalid resource map")
    }
}
/**
 * Lay danh sach cac chuc nang cuar ung dung duoc phep goi
 */
export async function loadDefinedAppFeatures(appId: string): Promise<Response>{
    let localResource: string = "list_appfeature";
    let mapval = MAP_RESOURCE[localResource];
    if(mapval !== undefined){ 
        try {
            let initRequest: RequestInit = BuildRequestInfo(mapval);
            let callUrl = BuildDataURL(mapval,{appId}, {include:[{relation:"definedAppFeatures"}]})
        
            
            return await fetch(callUrl,initRequest);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }else{
        throw new Error("invalid resource map")
    }
}
export async function loadAppRoles(appId: string): Promise<Response>{
    let localResource: string = "list_approle";
    let mapval = MAP_RESOURCE[localResource];
    if(mapval !== undefined){ 
        try {
            let initRequest: RequestInit = BuildRequestInfo(mapval);
            let callUrl = BuildDataURL(mapval,{appId}, {include:[{relation:"roles"}]})
            return await fetch(callUrl,initRequest);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }else{
        throw new Error("invalid resource map")
    }
}
/**
 * 
 * @param upd Doi tuong tinh nawng can duoc update
 * @returns ket qua thuc hien any
 */
export async function apiUpdateAppFeature(upd:AppFeatures):Promise<Response>{
    let localResource: string = "update_app_feature";
    let mapval = MAP_RESOURCE[localResource];
    if(mapval !== undefined){ 
        try {
            let initRequest: RequestInit = BuildRequestInfo(mapval,{data:{...omit(upd,['id'])}});
            //console.log(initRequest);
            let callUrl = BuildDataURL(mapval,{id:upd.id});
            return await fetch(callUrl,initRequest);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }else{
        throw new Error("invalid resource map")
    }
}
export async function apiRemoveAppFeature(id:string):Promise<Response>{
    let localResource: string = "remove_app_feature";
    let mapval = MAP_RESOURCE[localResource];
    if(mapval !== undefined){ 
        try {
            let initRequest: RequestInit = BuildRequestInfo(mapval,{});
            let callUrl = BuildDataURL(mapval,{id:id});
            return await fetch(callUrl,initRequest);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }else{
        throw new Error("invalid resource map")
    }
}
export async function apiCreateAppFeature(upd:AppFeatures):Promise<Response>{
    let localResource: string = "create_app_feature";
    let mapval = MAP_RESOURCE[localResource];
    if(mapval !== undefined){ 
        try {
            let initRequest: RequestInit = BuildRequestInfo(mapval,{data:{...omit(upd,['id'])}});
            console.log(initRequest);
            let callUrl = BuildDataURL(mapval,{id:upd.id});
            return await fetch(callUrl,initRequest);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }else{
        throw new Error("invalid resource map")
    }
}
export async function apiRemoveAppRole(id:string):Promise<Response>{
    let localResource: string = "remove_approle";
    let mapval = MAP_RESOURCE[localResource];
    if(mapval !== undefined){ 
        try {
            let initRequest: RequestInit = BuildRequestInfo(mapval,{});
            let callUrl = BuildDataURL(mapval,{id:id});
            return await fetch(callUrl,initRequest);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }else{
        throw new Error("invalid resource map")
    }
}
export async function apiCreateAppRole(upd:AppRole):Promise<Response>{
    let localResource: string = "create_approle";
    let mapval = MAP_RESOURCE[localResource];
    if(mapval !== undefined){ 
        try {
            let initRequest: RequestInit = BuildRequestInfo(mapval,{data:{...omit(upd,['id'])}});
            console.log(initRequest);
            let callUrl = BuildDataURL(mapval,{id:upd.id});
            return await fetch(callUrl,initRequest);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }else{
        throw new Error("invalid resource map")
    }
}
export async function apiEditAppRole(upd:AppRole):Promise<Response>{
    let localResource: string = "edit_approle";
    let mapval = MAP_RESOURCE[localResource];
    if(mapval !== undefined){ 
        try {
            let initRequest: RequestInit = BuildRequestInfo(mapval,{data:{...omit(upd,['id'])}});
            console.log(initRequest);
            let callUrl = BuildDataURL(mapval,{id:upd.id});
            return await fetch(callUrl,initRequest);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }else{
        throw new Error("invalid resource map")
    }
}
//////////////////=========================================
export async function apiLoadResource(appId: string): Promise<Response>{
    let localResource: string = "list_resource";
    let mapval = MAP_RESOURCE[localResource];
    if(mapval !== undefined){ 
        try {
            let initRequest: RequestInit = BuildRequestInfo(mapval);
            let callUrl = BuildDataURL(mapval,{}, {where:{callableAppId: appId}})
            return await fetch(callUrl,initRequest);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }else{
        throw new Error("invalid resource map")
    }
}

export async function apiRemoveAppResource(id:string):Promise<Response>{
    let localResource: string = "remove_resource";
    let mapval = MAP_RESOURCE[localResource];
    if(mapval !== undefined){ 
        try {
            let initRequest: RequestInit = BuildRequestInfo(mapval,{});
            let callUrl = BuildDataURL(mapval,{id:id});
            return await fetch(callUrl,initRequest);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }else{
        throw new Error("invalid resource map")
    }
}
export async function apiCreateAppResource(upd:ItemResource):Promise<Response>{
    let localResource: string = "create_resource";
    let mapval = MAP_RESOURCE[localResource];
    if(mapval !== undefined){ 
        try {
            let initRequest: RequestInit = BuildRequestInfo(mapval,{data:{...omit(upd,['id'])}});
            console.log(initRequest);
            let callUrl = BuildDataURL(mapval,{id:upd.id});
            return await fetch(callUrl,initRequest);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }else{
        throw new Error("invalid resource map")
    }
}
export async function apiEditAppResource(upd:ItemResource):Promise<Response>{
    let localResource: string = "edit_resource";
    let mapval = MAP_RESOURCE[localResource];
    if(mapval !== undefined){ 
        try {
            let initRequest: RequestInit = BuildRequestInfo(mapval,{data:{...omit(upd,['id'])}});
            console.log(initRequest);
            let callUrl = BuildDataURL(mapval,{id:upd.id});
            return await fetch(callUrl,initRequest);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }else{
        throw new Error("invalid resource map")
    }
}
//=========================================
export async function apiLoadRoleResources(roleId: string): Promise<Response>{
    let localResource: string = "list_roleright";
    let mapval = MAP_RESOURCE[localResource];
    if(mapval !== undefined){ 
        try {
            let initRequest: RequestInit = BuildRequestInfo(mapval);
            let callUrl = BuildDataURL(mapval,{id: roleId}, 
            {
                where: {roleId: roleId},
                include: ['resource','role']
            }
            );
            return await fetch(callUrl,initRequest);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }else{
        throw new Error("invalid resource map")
    }
}
export async function apiUpdateRight(upd:{id:string;[prop:string]:any}):Promise<Response>{
    let localResource: string = "edit_roleright";
    let mapval = MAP_RESOURCE[localResource];
    if(mapval !== undefined){ 
        try {
            let initRequest: RequestInit = BuildRequestInfo(mapval,{data:{...omit(upd,['id'])}});
            console.log(initRequest);
            let callUrl = BuildDataURL(mapval,{id:upd.id});
            return await fetch(callUrl,initRequest);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }else{
        throw new Error("invalid resource map")
    }
}
export async function apiCreateRight(upd:SimpleRoleRightRecord):Promise<Response>{
    let localResource: string = "create_roleright";
    let mapval = MAP_RESOURCE[localResource];
    if(mapval !== undefined){ 
        try {
            let initRequest: RequestInit = BuildRequestInfo(mapval,{data:{...omit(upd,['id'])}});
            console.log(initRequest);
            let callUrl = BuildDataURL(mapval,{});
            return await fetch(callUrl,initRequest);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }else{
        throw new Error("invalid resource map")
    }
}