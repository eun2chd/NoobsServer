import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";

const rootReducer = combineReducers({
  // key:value
});

export const store = configureStore({
  reducer: rootReducer,
});
export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
