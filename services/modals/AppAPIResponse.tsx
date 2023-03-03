interface AppAPIResponse<T = any> {
    code: string;
    data: T;
}


export default AppAPIResponse;