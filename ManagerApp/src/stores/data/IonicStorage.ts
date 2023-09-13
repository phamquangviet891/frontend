import { Storage, Drivers } from "@ionic/storage";
import { APP_ID } from "../../configs";

var storage:Storage;

export const createStore = async (name = APP_ID) => {

    storage = new Storage({
        name,
        driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage]
    });

    return await storage.create();
}


export const set = (key: string, val:any) => {

    storage.set(key, val);
}

export const get = async (key:string) => {

    const val = await storage.get(key);
    return val;
}

export const remove = async (key:string) => {

    await storage.remove(key);
}

export const clear = async () => {

    await storage.clear();
}

export const setObject = async (key:string, id:string, val:any) => {

    const all = await storage.get(key);
    const objIndex = await all.findIndex((a:any) => parseInt(a.id) === parseInt(id));

    all[objIndex] = val;
    set(key, all);
}

export const removeObject = async (key:string, id: string) => {

    const all = await storage.get(key);
    const objIndex = await all.findIndex((a:any) => parseInt(a.id) === parseInt(id));

    all.splice(objIndex, 1);
    set(key, all);
}

export const getObject = async (key:string, id:string) => {

    const all = await storage.get(key);
    const obj = await all.filter((a:any) => parseInt(a.id) === parseInt(id))[0];
    return obj;
}