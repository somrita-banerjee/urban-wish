import axios from "axios";
import { getToken } from "./storage";

const BASE_URL = 'http://localhost:3000';

const authToken = getToken()

export const axiosAuth = axios.create({
    baseURL: BASE_URL,
    headers: {
        Authorization: `Bearer ${authToken}`,
    },
});

export const axiosPublic = axios.create({
    baseURL: BASE_URL,
});