import { createSlice} from '@reduxjs/toolkit'
import { AppDispatch, AppState } from "app/store";
import {requestAuth, requestCleverAuth} from 'services/AuthService'
import {LoginForm} from 'services/modals/loginForm'
import { setAuthCoookies } from 'util/cookies'
import { setError } from './errorSlice';
import {setLoading, clearLoading, clearLoadingClever} from './pageSlice';
import cookie from 'js-cookie';

const initialState = {
    user: null,
}

export const authSlice = createSlice({
    name: 'authReducer',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload.user
        }
    }
})

export default authSlice.reducer

export const { setUser } = authSlice.actions

export const selectUser = (state:AppState) => state.authReducer.user;

export const loginAction = ( requestData :LoginForm, navigate: any) => async (dispatch: AppDispatch) => {

    dispatch(setLoading());
    try{
        const user = await requestAuth(requestData);
        if (window.location.hostname === "localhost") {
            setAuthCoookies(user);
        } else {
            setAuthCoookies(user, true);
        }
        dispatch(setUser({
            user:{
                ...user
            }
        }));
        navigate("/select-assessment");
    }
    catch(error){
      dispatch(setError('Invalid Last Name or Student ID'));
    }
    finally{
        dispatch(clearLoading());
    }
}

export const loginCleverAction = ( params: any, navigate: any) => async (dispatch: AppDispatch) => {

    try{
        const result = await requestCleverAuth(params.code);
        if (result && result.data) {
            if (window.location.hostname === "localhost") {
                setAuthCoookies(result.data);
            } else {
                setAuthCoookies(result.data, true);
            }
            dispatch(setUser({
                user: result.data
            }));
            navigate("/select-assessment");
        }
    }
    catch (error: any){
    console.log(error, ' $$ Error ', error?.response, ' @@ response ', error?.response?.data, ' !! data');
      if (error?.response?.data) {
        console.log(error?.response?.data?.message, ' &&&&& Login Error Message');
        dispatch(setError(error?.response?.data?.message));
      } else {
        dispatch(setError('Failed to Login with Clever'));
      }
    }
    finally{
        dispatch(dispatch(clearLoadingClever()));
        dispatch(clearLoading());
    }
}

export const logout = () => async (dispatch: AppDispatch) => {

    cookie.remove("email");
    cookie.remove("token");
    cookie.remove("first_name");
    cookie.remove("last_name");

    dispatch(setUser({
        user: null!
    }));
}
