
import { APP_KEY, BASE_API_PATH, BASE_URL, DEBUG_API_PATH, DEBUG_MODE, DEBUG_URL, MapValue, MAP_RESOURCE } from "../configs";
export interface LoginResult{
    id?: string;
    backend_url?: string;
    email?: string;
    realm?: string;
    scope?: string;
    token?: string;
    userId?: string;
    [prop:string]:any;
}
export async function apiLogin(info: any): Promise<any>{
    const localresource = "login";
    let mapval = MAP_RESOURCE[localresource];
    if(mapval !== undefined){ 
        try {
            return fetch(buildSimpleURL(mapval),{
                headers: buildRequestHeader(),
                method: mapval.method,
                body: JSON.stringify(info)
            });
        } catch (error) {
            console.log(error);
            throw error;
        }
    }else{
        throw new Error("invalid resource map")
    }
}
export function buildRequestHeader() : any{
    return {
        accept:'application/json',
        'content-type': 'application/json',
        'apikey': APP_KEY
    }
}
export function buildSimpleURL(mapval: MapValue):string{
    let url: string = DEBUG_MODE ===true? DEBUG_URL:BASE_URL;
    let path:string = DEBUG_MODE ===true? DEBUG_API_PATH:BASE_API_PATH;
    if(BASE_API_PATH === ""){
        if(url.endsWith(`/`)){
             url = url.substring(0,url.length-1);
        }
    }else{
        if(path.startsWith('/')){
            path = path.substring(1);
        }
        if(path.endsWith('/')){
            path = path.substring(0,path.length-1);
        }
    }
    return `${url}/${path}/${mapval.path}`;
}
