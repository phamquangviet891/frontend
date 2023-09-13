import { combineReducers } from "@reduxjs/toolkit";
import { MsgReducer } from "./msgSlice";
import { UICtrlReducer } from "./uictrlSlice";
import { UserReducer } from "./userSlice";

const rootReducer = combineReducers({
    Login_Info: UserReducer,
    MESGS: MsgReducer,
    UI_CTRL:  UICtrlReducer,
});
export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;