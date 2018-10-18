

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


export default instance;