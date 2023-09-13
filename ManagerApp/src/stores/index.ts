import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducers";
import logger from 'redux-logger';
import { useDispatch } from "react-redux";

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(logger)
  });
  
  if (process.env.NODE_ENV === "development" && module.hot) {
    module.hot.accept("./reducers", () => {
      const newRootReducer = require("./reducers").default;
      store.replaceReducer(newRootReducer);
    });
  }
  export type AppDispatch = typeof store.dispatch
  export const useAppDispatch: () => AppDispatch = useDispatch
  export default store;