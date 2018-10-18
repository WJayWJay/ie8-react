import request from './network';

import { setToken } from './token';

export function login(data) {
    return request.post('/public/login', {data}).then(res => {
        if (res && res.code === 0) {
            setToken(res.api_token);
        }
        return res;
    }).catch();
}