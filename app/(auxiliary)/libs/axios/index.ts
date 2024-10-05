import axios from "axios"

export const API_URL_SERVER = "http://localhost:8000/"
export const API_URL_CLIENT = process.env.CLIENT_HOST


const $api = axios.create({
    baseURL: API_URL_CLIENT,
    withCredentials: true
})

$api.interceptors.request.use((config) => config)

export {
    $api
}