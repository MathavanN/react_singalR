import axios, { AxiosResponse } from 'axios'
import { toast } from 'react-toastify';
import history from '../../history'
import { IUser, IUserLogin } from '../models/user';
import { IActivity, ICreateActivity, IUpdateActivityStatus } from '../models/activity';

axios.defaults.baseURL = process.env.REACT_APP_API_URL
axios.interceptors.request.use((config) => {
    const token = window.localStorage.getItem('jwt');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
}, error => {
    return Promise.reject(error)
})
axios.interceptors.response.use(undefined, error => {
    console.log(error)
    if (error.message === "Network Error" && !error.response) {
        toast.error("network error")
    }
    const { status, data, config, headers } = error.response;
    if (status === 401 && headers['www-authenticate'] === 'Bearer error="invalid_token", error_description="The token is expired"') {
        console.log(error.response)
        window.localStorage.removeItem("jwt")
        history.push('/')
        toast.info("Your session has expired, please login again")
    }
    if (status === 404) {
        history.push('/activities');
    }
    if (status === 400 && config.method === 'get' && data.errors.hasOwnProperty('id')) {
        history.push('/activities');
    }

    if (status === 500) {
        toast.error('Server error - check the terminal for more info!')
    }
    throw error.response
})

const responseBody = (response: AxiosResponse) => response.data;

const requests = {
    get: (url: string) => axios.get(url).then(responseBody),
    post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
    put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
    del: (url: string) => axios.delete(url).then(responseBody),
    postForm: (url: string, file: Blob) => {
        let formData = new FormData();
        formData.append('File', file);
        return axios.post(url, formData, { headers: { 'Content-type': 'multipart/form-data' } }).then(responseBody)
    }
}

const Users = {
    current: (): Promise<IUser> => requests.get('/user/user'),
    login: (user: IUserLogin): Promise<IUser> => requests.post(`/user/login`, user),
    //register: (user: IUserFormValues): Promise<IUser> => requests.post(`/user/register`, user)
}

const Activities = {
    list: (userName: string): Promise<IActivity[]> => requests.get(`/activity/${userName}/byuser`),
    details: (id: string): Promise<IActivity> => requests.get(`/activity/${id}/details`),
    create: (activity: ICreateActivity): Promise<IActivity> => requests.post(`/activity`, activity),
    updateStatus: (activityStatus: IUpdateActivityStatus): Promise<IActivity> => requests.put(`/activity/${activityStatus.id}/status`, activityStatus),
    delete: (id: string) => requests.del(`/activity/${id}/delete`),
}

export default { Users, Activities }