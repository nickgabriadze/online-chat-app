import { createSlice } from "@reduxjs/toolkit";

interface userSlice {
    username: string,
    inQueue: boolean,
    activeUsers: number
}



const initialState: userSlice = {
    username: "",
    inQueue: false,
    activeUsers: 0
}

export const uSlice = createSlice({
    name: "userSlice",
    initialState,

    reducers:{
        setUsername: (state, action) => {
            return {
                ...state,
                username: action.payload.u
            }
        },

        setInQueue: (state, action) => {
            return {
                ...state, 
                inQueue: action.payload.inQueue
            }
        },

        setActiveUsers: (state, action) => {
            return {
                ...state,
                activeUsers: action.payload.active
            }
        }
    },
})

export const {setUsername, setInQueue, setActiveUsers} = uSlice.actions;

export default uSlice.reducer;