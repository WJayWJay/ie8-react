import request from './network';

// import { setToken } from './token';
import constant from '@/constant/index';

const PREFIX = constant.api + '/private';

export function login(data) {
    return request.post('/login', data).then(res => {
        
        return res;
    });
}
export function logout(data) {
    return request.post('/logout', data || {}).then(res => {
        return res;
    });
}

export function getUserList(params) {
    return request.get(PREFIX + '/users/list', {params}).then(res => {
        
        return res;
    });
}

export function addNewAccount(data) {
    return request.post(PREFIX + '/users/create', data).then(res => {
        return res;
    });
}
export function activeAccount(data) {
    return request.post(PREFIX + '/users/active', data).then(res => {
        return res;
    });
}

export function resetSelfPwd(data) {
    return request.post(PREFIX + '/users/resetSelfPwd', data).then(res => {
        return res;
    });
}

export function setAdmin(data) {
    return request.post(PREFIX + '/users/setAdmin', data || {}).then(res => {
        return res;
    });
}

export function resetOtherPwd(data) {
    return request.post(PREFIX + '/users/resetPwd', data).then(res => {
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
export function moveStep(data) {
    return request.post(PREFIX + '/category/moveStep', data).then(res => {
        return res;
    });
}
export function getCategoryFilter(params = {}) {
    return request.get(PREFIX + '/category/filter/list', {params}).then(res => {
        return res;
    });
}

export function saveBaseInfoData(data) {
    return request.post(PREFIX + '/baseinfo/save', data).then(res => {
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
export function getBasicInfo(params) {
    return request.get(PREFIX + '/basicinfo/list', {params}).then(res => {
        return res;
    });
}

export function deleteBasicInfo(data) {
    return request.post(PREFIX + '/basicinfo/delete', data).then(res => {
        return res;
    });
}

export function exportService(params) {
    return request.get(PREFIX + '/basicinfo/exportExcel', {params}).then(res => {
        return res;
    });
}


export function importExcel(data) {
    return request.post(PREFIX + '/basicinfo/importExcel', data).then(res => {
        return res;
    });
}

export function queryAccordingFilter(data, params) {
    return request.post(PREFIX + '/basicinfo/filter/list', data, {
        params: params
    }).then(res => {
        return res;
    });
}