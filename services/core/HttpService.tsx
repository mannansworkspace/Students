import axios from "axios";
import axiosRetry from "axios-retry";
import config from "config/config";
import { ApiFailure, setErrorForStatus400 } from "index";
import cookie from "js-cookie";

// Global Axios Settings
axios.defaults.baseURL = `${config.defaults.api_url}/api/v3`;
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.timeout = 10000;
axios.defaults.headers.post['apiKey'] = config.defaults.api_key
axios.defaults.headers.get['apiKey'] = config.defaults.api_key
axios.defaults.headers.put['apiKey'] = config.defaults.api_key

axios.interceptors.request.use(async (config: any) => {
    config.headers.Authorization = `Bearer ${cookie.get("token")}`;
    return config;
});


axios.interceptors.response.use(
    (value): any => {
        ApiFailure.setApiError(false, null!)
        setErrorForStatus400(false);
        return Promise.resolve(value.data)
    },
    (error) => {
        console.log({ error })
        const { config, response } = error
        const { url } = config
        const isResetRequired = !(url.includes('student-login'))
        if (isResetRequired) {
            if (response && response.status >= 400 && response.status < 500) {
                setErrorForStatus400(true)
            }
            else
                ApiFailure.setApiError(true, null!)
        }
        return Promise.reject(error);
    }
);

axiosRetry(axios, {
    retries: 500000,
    retryDelay: (retryCount) => 5 * 1000,
    shouldResetTimeout: true,
    retryCondition: (error) => {
        if (error) {
            const { response } = error
            if (response)
                return !(response?.status >= 400 && response.status < 500)
        }
        return true
    }
})

const http = {
    request: axios.request,
    get: axios.get,
    post: axios.post,
    put: axios.put,
    patch: axios.patch,
    delete: axios.delete,
};

export default http;
