import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './index';

export type STATE = {
    filter: { departmentCode1?: string; departmentCode2?: string; startDate?: string; endDate?: string; team?: string; name?: string };
    filterList: { departments?: string[]; names?: string[] };
    average: {
        standardWorkDayCount?: number;
        rate?: number;
        averageTime?: { h: number; m: number; s: number };
    };
};

const name = 'manager';

const initialState: STATE = {
    filter: {
        team: '전체',
        name: '전체'
    },
    filterList: {},
    average: {}
};
const slice = createSlice({
    name,
    initialState,
    reducers: {
        setFilter: (state, action: PayloadAction<Partial<STATE['filter']>>) => {
            const { payload } = action;
            state.filter = Object.assign(state.filter, { ...payload });
        },
        setFilterList: (state, action: PayloadAction<STATE['filterList']>) => {
            const { payload } = action;
            state.filterList = Object.assign(state.filterList, { ...payload });
        },
        initFilterList: (state) => {
            state.filterList = {};
        },
        setAverage: (state, action: PayloadAction<STATE['average']>) => {
            const { payload } = action;
            state.average = Object.assign(state.average, { ...payload });
        }
    }
});

export const { setFilter, setFilterList, initFilterList, setAverage } = slice.actions;

export const selectManager = (state: RootState) => state[name];

export default slice.reducer;
