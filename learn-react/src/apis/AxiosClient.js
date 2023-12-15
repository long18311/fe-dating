import axios from "axios";
import {ACCESS_TOKEN,URL} from "../constants/index.js";

// cấu hình config cho api

const axiosClient  = axios.create(
    {baseURL: `${URL}/api`}
)
// trước khi call API

axiosClient.interceptors.request.use(function (config) {
    const token = localStorage.getItem(ACCESS_TOKEN)
     config.headers.Authorization=`Bearer ${token}`
     return config;
}, function (error) {
    return Promise.reject(error);
});

//sau khi call API
axiosClient.interceptors.response.use(function (response) {
    return response.data;
}, function (error) {
    return Promise.reject(error);
});
export default axiosClient