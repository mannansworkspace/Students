import { configureStore } from '@reduxjs/toolkit'
import authReducer from './reducer/authSlice';
import errorReducer from './reducer/errorSlice'
import pageReducer from './reducer/pageSlice';
import assessmentReducer from './reducer/assessmentSlice';

export function makeStore() {
    return configureStore({
        reducer: {
            authReducer,
            errorReducer,
            pageReducer,
            assessmentReducer
        },
        devTools: true
    })
}
  
const store = makeStore()

export default store

export type AppState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
