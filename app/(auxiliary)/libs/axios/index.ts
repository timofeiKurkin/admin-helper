import axios from "axios"

export const API_URL_SERVER = process.env.NEXT_PUBLIC_SERVER_HOST
// export const API_URL_HOST = "https://it-nk-api.serveo.net/api/v1/"


const $api = axios.create({
    baseURL: API_URL_SERVER,
    withCredentials: true
})

$api.interceptors.request.use((config) => config)

export {
    $api
}