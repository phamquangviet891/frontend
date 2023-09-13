import { createSlice, PayloadAction } from "@reduxjs/toolkit"


interface UserInfoProfile{
    accessInfo: any;
    userProfile: any;
    [prop:string]:any;

}

interface UserState{
    info: UserInfoProfile|null,
}
const initialState: UserState = {
    info: null
}
export const UserSlice = createSlice({
    name: "userinfo",
    initialState: initialState,
    reducers:{
        load: (state: UserState,action: PayloadAction<any>) => {
            
            console.log("reducer action:",action);
            state.info =  action.payload;
            return state;
            
        },
        loadsaved: (state: UserState,action: PayloadAction<any>) => {
            console.log("reducer action:",action);
            return state;
            
        }
    }
});
export const { load,loadsaved} = UserSlice.actions;
export const UserState = (state:UserState) => state.info;

export const UserReducer =  UserSlice.reducer