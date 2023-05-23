import {store} from "../store/store";

const BASE_URL = process.env.REACT_APP_API_URL || '/api/v1';

const buildURLQuery = (obj: Object) =>
    Object.entries(obj)
        .map(pair => pair.map(encodeURIComponent).join('='))
        .join('&');

const buildHeaders = (contentType = true) => {
    if (store.getState().user.isLogged) {
        return {
            'Authorization': 'Bearer ' + store.getState().user.accessToken,
            ...(contentType ? {'Content-Type': 'application/json'} : {})
        }
    }
    return {
        ...(contentType ? {'Content-Type': 'application/json'} : {})
    }
}

export const getHttp = <T> (path: string, params?: Object): Promise<T> => {
    const headers = buildHeaders(false);

    let url = BASE_URL + path;
    if (params) {
        url += '?' + buildURLQuery(params);
    }


    return fetch(url, {
        method: 'GET',
        headers: headers as any
    }).then(response => response.json());
}


export const postHttp = <T> (path: string, body?: any, params?: Record<string, string | number | boolean>) => {
    return simplePostHttp(path, body, params).then(response => response.json());
}

export const simplePostHttp = (path: string, body?: any, params?: Record<string, string | number | boolean>) => {
    const headers = buildHeaders();

    let url = BASE_URL + path;
    if (params) {
        url += '?' + buildURLQuery(params);
    }

    return fetch(url, {
        method: 'POST',
        headers: headers as any,
        body: (typeof body === 'string') ? body : JSON.stringify(body),
    })
}

export const deleteHttp = (path: string, params?: Object) => {
    const headers = buildHeaders(false);

    let url = BASE_URL + path;
    if (params) {
        url += '?' + buildURLQuery(params);
    }

    return fetch(url, {
        method: 'DELETE',
        headers: headers as any,
    })
}

export const putHttp = <T> (path: string, body: any, params?: Object): Promise<T> => {
    return simplePutHttp(path, body, params).then(response => response.json());
}

export const simplePutHttp = (path: string, body: any, params?: Object): Promise<any> => {
    const headers = buildHeaders();

    let url = BASE_URL + path;
    if (params) {
        url += '?' + buildURLQuery(params);
    }


    return fetch(url, {
        method: 'PUT',
        headers: headers as any,
        body: (typeof body === 'string') ? body : JSON.stringify(body),
    })
}
