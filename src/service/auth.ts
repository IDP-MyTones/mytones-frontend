import { postHttp } from "./http";
import {store} from "../store/store";
import {loginAction} from "../store/user.reducer";

export interface RegisterModel {
    firstName: string;
    lastName: string;
    username: string; // email
    password: string;
}

export interface TokenModel {
    accessToken: string;
    role: string
}

export const login = (username: string, password: string) => {
    return fetch("http://localhost:8081/api/v1/auth/login", {
            method: 'POST',
            body: JSON.stringify({username, password}),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then((x) => x.json())
        .then((token: any) => store.dispatch(loginAction(token)));
}

export const register = (model: RegisterModel): Promise<void> => {
    return fetch("http://localhost:8081/api/v1/users", {
        body: JSON.stringify(model),
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        }
    }).then(() => {});
}