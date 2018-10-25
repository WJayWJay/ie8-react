import request from './network';

// import { setToken } from './token';

const PREFIX = '/private';

export function login(data) {
    return request.post('/login', data).then(res => {
        
        return res;
    });
}

export function getUserList(params) {
    return request.get(PREFIX + '/users/list', {params}).then(res => {
        
        return res;
    });
}

export function postCategory(data) {
    return request.post(PREFIX + '/category/create', data).then(res => {
        return res;
    });
}

export function getCategoryList(params) {
    return request.get(PREFIX + '/category/list', {params}).then(res => {
        return res;
    });
}

export function getCategoryQuery(params) {
    return request.get(PREFIX + '/category/query', {params}).then(res => {
        return res;
    });
}

export function deleteCatogry(params) {
    return request.post(PREFIX + '/category/delete', params).then(res => {
        return res;
    });
}

export function getUserInfo(params) {
    return request.get(PREFIX + '/user/info', {params}).then(res => {
        return res;
    });
}