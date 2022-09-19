import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './index';

export type STATE = {
    isUpdateCheckOut: boolean;
};

const name = 'main';

const initialState: STATE = {
    isUpdateCheckOut: false
};
const slice = createSlice({
    name,
    initialState,
    reducers: {
        updateCheckOut: (state, action: PayloadAction<boolean>) => {
            const { payload } = action;
            state.isUpdateCheckOut = payload;
        }
    }
});

export const { updateCheckOut } = slice.actions;

export const selectMain = (state: RootState) => state[name];

export default slice.reducer;
