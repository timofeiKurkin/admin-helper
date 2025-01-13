import axios from "axios"
import { v4 as uuidv4 } from "uuid";

export const API_URL_SERVER = process.env.NEXT_PUBLIC_SERVER_HOST


const $api = axios.create({
    baseURL: API_URL_SERVER,
    withCredentials: true,
})


$api.interceptors.request.use((config) => config)


export {
    $api
}