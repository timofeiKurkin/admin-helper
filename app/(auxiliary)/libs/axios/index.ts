import axios from "axios"

export const API_URL_SERVER = "http://localhost:8000/"


const $api = axios.create({
    baseURL: API_URL_SERVER,
    withCredentials: true
})

$api.interceptors.request.use((config) => config)

export {
    $api
}