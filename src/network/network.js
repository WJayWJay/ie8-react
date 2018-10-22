

import axios from 'axios';
import { getToken } from './token';

const config = {
    baseURL: '/',
    timeout: 10000,
    headers: {'X-Custom-Header': 'axio'}
};
const token = getToken();
if (token) {
    config.headers.api_token = token;
}

const instance = axios.create(config);

const network = {};

const post = (url, data = {}, option = {}) => {
    return instance.post(url, data, option).then(res => res.data).catch(err => console.log(err));
};
const get = (url, option = {}) => {
    return instance.get(url, option).then(res => res.data).catch(err => console.log(err));
};

network.get = get;
network.post = post;

export default network;