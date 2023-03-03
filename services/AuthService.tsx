import apiConstants from "./Constant/ApiConstant";
import http from "./core/HttpService";
import { LoginForm } from "./modals/loginForm";

export const requestAuth = async (data:LoginForm): Promise<any> => {
    try {
        const result = await http.post<any>(`${apiConstants.REQUEST_AUTH}`,  data );
        return Promise.resolve(result.data);
    }
    catch (error) {
        return Promise.reject(error);
    }
}

export const requestCleverAuth = (code:any): Promise<any> => {
    return http.post<any>(`${apiConstants.REQUEST_CLEVER_AUTH}/${code}`);
}