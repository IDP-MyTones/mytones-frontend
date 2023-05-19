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
    return postHttp<TokenModel>("/auth/login", { username, password })
        .then(token => store.dispatch(loginAction(token)));
}

export const register = (model: RegisterModel): Promise<void> => {
    return postHttp<void>("/auth/singup", model);
}