import {createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppState } from "app/store";

interface ErrorSliceState {
    errors: {
        errorMessage: string
    };
    isApiError: boolean
    apiConfig : any,
    isAccessError:boolean,
    isMultipleLoginError: boolean
}

const initialState: ErrorSliceState = {
    errors: {
        errorMessage: ''
    },
    isApiError: false,
    apiConfig : null,
    isAccessError : false,
    isMultipleLoginError : false
}


export const errorSlice = createSlice({
    name: 'errorReducer',
    initialState,
    reducers: {
        setError: (state, { payload }: PayloadAction<string>) => {
            state.errors = { ...state.errors, errorMessage: payload };
        },
        clearError: (state) => {
            state.errors = { errorMessage: '' }
        },
        setApiError: (state, action: PayloadAction<boolean>) => {
            state.isApiError = action.payload
        },
        setApiConfig : (state , action : PayloadAction<any>) => {
            state.apiConfig =  action.payload
        },
        setMultipleLoginError : (state , action:PayloadAction<boolean>) => {
            state.isMultipleLoginError =  action.payload
        },
        setAccessError : (state , action:PayloadAction<boolean>) => {
            state.isAccessError =  action.payload
        }
    }
})

export default errorSlice.reducer

export const { setMultipleLoginError,setError, clearError,setApiError ,setApiConfig,setAccessError} = errorSlice.actions

export const selectErrors = (state: AppState): { errorMessage: string } => state.errorReducer.errors;
export const isApiErrorSelector = (state:AppState) => state.errorReducer.isApiError
export const apiConfigSelector = (state:AppState) => state.errorReducer.apiConfig
export const isAccessErrorSelector = (state:AppState) => state.errorReducer.isAccessError
export const isMultipleLoginErrorSelector = (state:AppState) => state.errorReducer.isMultipleLoginError
