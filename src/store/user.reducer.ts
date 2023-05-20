import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {store} from "./store";

export interface UserState {
    isLogged: boolean;
    role?: 'ADMIN' | 'USER' | 'MODERATOR';
    accessToken?: string;
}

const defaultState: UserState = JSON.parse(localStorage.getItem("auth") || 'null') || {
    isLogged: false
}

setTimeout(() => {
    if (defaultState.isLogged) {
        fetch('http://localhost:8081/api/v1/users/me', {
                headers: {
                    "Authorization": `Bearer ${defaultState.accessToken}`
                }
            })
            .then(x => x.json())
            .then(({role}: any) => store.dispatch(loginAction({
                role,
                accessToken: store.getState().user.accessToken!
            })))
            .catch(e => store.dispatch(logoutAction()))
    }
}, 1000)

export const userSlice = createSlice({
    name: 'userSlice',
    initialState: defaultState,
    reducers: {
        login: (state, {payload}: PayloadAction<Required<Pick<UserState, 'role' | 'accessToken'>>>) => {
            state.isLogged = true;
            state.accessToken = payload.accessToken;
            state.role = payload.role;

            localStorage.setItem("auth", JSON.stringify({
                isLogged: true,
                accessToken: payload.accessToken,
                role: payload.role
            }))
        },
        logout: (state) => {
            state.isLogged = false;
            delete state.accessToken;
            delete state.role;

            localStorage.setItem("auth", JSON.stringify({
                isLogged: false,
            }))

        }
    }
});


export const { login: loginAction, logout: logoutAction } = userSlice.actions

export default userSlice.reducer;
