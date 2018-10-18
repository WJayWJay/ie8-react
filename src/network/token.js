import cache from './cache';


const API_TOKEN = 'token_local';

export const getToken = () => {
    return cache.get(API_TOKEN);
}

export const setToken = (val) => {
    if (!val) return false;
    cache.set(API_TOKEN, val);
}