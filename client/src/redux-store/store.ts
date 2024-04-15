import uSlice  from "./userSlice.ts";
import {configureStore} from "@reduxjs/toolkit";


const store = configureStore({
    reducer: {
        uReducer:  uSlice
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch


export default store;