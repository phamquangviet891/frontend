import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from ".";


interface MessageItemProp{
    content: any;
    msgType: any;
    eventName: any;
    [prop:string]: any;
}
interface IMessageState{
    items: Array<MessageItemProp> 
}
const innital_state:IMessageState = {
    items:[]
}
const MsgSlice = createSlice({
    name: "message",
    initialState: innital_state,
    reducers:{
        recivedMessage: (state:IMessageState, action: PayloadAction<any>)=>{
            state.items = [...state.items,action.payload];
            return state;
        }
    }
});
export const { recivedMessage,} = MsgSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const MsgState = (state: RootState) => state.MESGS

export const MsgReducer = MsgSlice.reducer