import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { informationCircleOutline } from "ionicons/icons";
import { RootState } from ".";
interface ToastMessage{
    msg: string;
    icon?: string;
    duration?: number;
    color?:string;
}
interface UIState{
    show_loading: boolean;
    show_error: boolean;
    show_login_box: boolean;
    show_edit_appfeature: boolean;
    error_message: any;
    toast_message: ToastMessage;
    [prop:string]:any;
} 

const initialState: UIState = {
    show_error:false,
    show_loading: true,
    show_login_box: false,
    show_edit_appfeature: false,
    error_message:'',
    currentEditFeature: null,
    toast_message: {msg:"", icon: informationCircleOutline,  duration: 1500, color: "danger"},
}
const UICtrlSlice = createSlice({
    name: 'uictrl',
    initialState: initialState,
    reducers:{
        set_show_loading:(state: UIState, action: PayloadAction<boolean>) =>{
            return {...state, show_loading: action.payload };
        },
        set_show_login_box:(state: UIState, action:PayloadAction<boolean>)=>{
            console.log(state.show_login_box);
            return {...state, show_login_box: action.payload};
        },
        set_show_error:(state: UIState, action:PayloadAction<boolean>)=>{
            return {...state, show_error: action.payload};
        },
        set_error_message:(state: UIState, action:PayloadAction<any>)=>{
            return {...state, error_message: action.payload};
        },
        set_show_edit_appfeature: (state: UIState, action:PayloadAction<boolean>)=>{
            return {...state, show_edit_appfeature: action.payload};
        },
        set_toast_message:(state: UIState, action: PayloadAction<ToastMessage>)=>{
            return {...state, toast_message: action.payload}
        }
    }
});
export const UICtrlReducer = UICtrlSlice.reducer; 
export const {
    set_show_loading,
    set_show_login_box,
    set_show_error,
    set_error_message,
    set_toast_message,
    set_show_edit_appfeature,
} = UICtrlSlice.actions; 
export const UIState = (state:RootState) => state.UI_CTRL;
export default UICtrlSlice;