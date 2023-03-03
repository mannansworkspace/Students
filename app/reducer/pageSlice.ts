import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "../store";

export interface IPageSlice {
    isLoading: boolean;
    isLoadingClever: boolean
}

const initialState: IPageSlice = {
    isLoading: false,
    isLoadingClever: false,
};

export const pageSlice = createSlice({
    name: "pageReducer",
    initialState,
    reducers: {
        setLoading: (state) => {
            state.isLoading = true;
        },
        clearLoading: (state) => {
            state.isLoading = false;
        },
        setIsLoadingClever: (state) => {
            state.isLoadingClever = true
        },
        clearLoadingClever: (state) => {
            state.isLoadingClever = false;
        },
    },
});
export default pageSlice.reducer;

export const { setLoading, clearLoading, setIsLoadingClever, clearLoadingClever } = pageSlice.actions;

export const selectIsLoading = (state: AppState): boolean => state.pageReducer.isLoading;
export const selectIsLoadingClever = (state: AppState): boolean => state.pageReducer.isLoadingClever;
