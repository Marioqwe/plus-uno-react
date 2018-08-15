import axios from 'axios';

const baseApi = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/v1/leaderboard/',
    timeout: 10000,
});

export default function request(config = {}) {
    return baseApi.request(config);
}
