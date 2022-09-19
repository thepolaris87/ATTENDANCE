import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './index';
import type { USERINFO } from '../apis/types';

export type CURRENTSTATE = 'leave' | 'early' | 'on' | 'overtime' | 'off';

export type EXTRAINFO = Partial<{
    checkIn: string;
    standardCheckIn: string;
    standardCheckOut: string;
    checkOut: string | undefined | null;
    realtimeCompletion: number;
    completion: number;
    currentState: CURRENTSTATE;
    overTime: string;
}>;

export type STATE = { info: USERINFO[] | null; extraInfo: EXTRAINFO };

const name = 'user';

const initialState: STATE = {
    info: null,
    extraInfo: {}
};
const slice = createSlice({
    name,
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<USERINFO[]>) {
            state.info = action.payload;
        },
        setUserExtra(state, action: PayloadAction<EXTRAINFO>) {
            const { payload } = action;
            state.extraInfo = Object.assign(state.extraInfo, { ...payload });
        }
    }
});

export const { setUser, setUserExtra } = slice.actions;

export const selectUser = (state: RootState) => state[name];

export default slice.reducer;
