
export const PUBLIC_FRONTEND_URL = "*";
export const BASE_URL: string = "https://apicentral.infinitysolution.vn"; //url api chinh

export const BASE_API_PATH:string = "/api/";
export const APP_ID: string = "ManagerApp-10071981";
export const APP_KEY: string = "DF2A09EC-199C-4599-A74F-84D0454BA2B0";
export const LOGIN_INFO_KEY = "user_login_infomation";

export const INFO_MODE = true;
export const DEBUG_MODE = true;
export const DEBUG_URL = "http://localhost:3002";
export const DEBUG_API_PATH = "api";
export const ERROR_MODE = true;

export const APP_MESSAGE_TYPE = {
    BROADCAST:"BROADCAST",
}

export interface MapValue{
    path: string;
    method: string;
    [prop:string]:any;
}
export interface MappingObject{
    [key:string]: MapValue;
}
export const MAP_RESOURCE: MappingObject = {
    "login": {path:"users/login",method:"POST"},
    "register":{path:"users/register", method: "POST"},
    "userprofile":{path: "user-profiles/{userId}", method:"GET"},

    "list_applications": {path: "callable-apps", method:'GET'},
    "create_applications": {path: "callable-apps", method:'POST'},

    "list_appfeature": {path: "callable-apps/{appId}", method:'GET'},
    "create_app_feature": {path:"defined-app-features", method:'POST'},
    "update_app_feature": {path:"defined-app-features/{id}", method:'PATCH'},
    "remove_app_feature": {path:"defined-app-features/{id}", method:'DELETE'},

    "list_approle": {path: "callable-apps/{appId}", method:'GET'},
    "create_approle": {path: "user-realms", method:'POST'},
    "edit_approle": {path: "user-realms/{id}", method:'PATCH'},
    "remove_approle": {path:"user-realms/{id}", method:'DELETE'},

    "list_resource": {path:"core-resources", method:'GET'},
    "create_resource": {path: "core-resources", method:'POST'},
    "edit_resource": {path: "core-resources/{id}", method:'PATCH'},
    "remove_resource": {path:"core-resources/{id}", method:'DELETE'},

    "list_roleright": {path:"role-rights", method:"GET"},
    "edit_roleright": {path: "role-rights/{id}", method:'PATCH'},
    "create_roleright": {path: "role-rights", method:'POST'},
}