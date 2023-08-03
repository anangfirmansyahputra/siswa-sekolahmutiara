import { createSlice } from "@reduxjs/toolkit";
import http from "@/plugin/https";

const initialState = {
    user: null,
    token: null
}

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
        },
        setToken(state, action) {
            if (action.payload !== null) {
                http.defaults.headers['Authorization'] = 'Bearer ' + action.payload
            }

            state.token = action.payload;
        },
    }
})

export const { setUser, setToken } = userSlice.actions
export const selecUser = (state) => state.user.user
export default userSlice.reducer
