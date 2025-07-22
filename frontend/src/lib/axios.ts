import axios from "axios";

const BASE_URL = 'http://localhost:3000';

const authToken = localStorage.getItem('token')

export const axiosAuth = axios.create({
    baseURL: BASE_URL,
    headers: {
        Authorization: `Bearer ${authToken}`,
    },
});

export const axiosPublic = axios.create({
    baseURL: BASE_URL,
});