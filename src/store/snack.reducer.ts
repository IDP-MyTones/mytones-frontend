import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {userSlice} from "./user.reducer";
import {AlertColor} from "@mui/material/Alert/Alert";

export interface SnackState {
    message?: string;
    level?: AlertColor;
    timestamp?: number;
}

export const snackSlice = createSlice({
    name: 'snackSlice',
    initialState: {} as SnackState,
    reducers: {
        success: (state, {payload}: PayloadAction<string>) => {
            state.message = payload;
            state.level = 'success'
            state.timestamp = Date.now();
        },
        warn: (state, {payload}: PayloadAction<string>) => {
            state.message = payload;
            state.level = 'warning'
            state.timestamp = Date.now();
        },
        error: (state, {payload}: PayloadAction<string>) => {
            state.message = payload;
            state.level = 'error'
            state.timestamp = Date.now();
        },
    }
});

export const { success, error, warn } =  snackSlice.actions;

export default snackSlice.reducer;