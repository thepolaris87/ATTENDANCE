import { useEffect, useState } from 'react';

import { Button, Grid, Typography } from '@mui/material';
import { DesktopDatePicker, PickersDay, PickersDayProps } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import DateInput from './DateInput';

import { useDispatch, useSelector } from 'react-redux';
import { selectManager, setFilter } from '../../../slices/manager';

import { subDays } from 'date-fns';
import { convertFromDateFormat, NOW, parseDateTime } from '../../../utils/date';
import { useQueryClient } from 'react-query';

export default function DateFilter() {
    const today = NOW();
    const { filter, filterList } = useSelector(selectManager);
    const [minValue, setMinValue] = useState<Date>(today);
    const [maxValue, setMaxValue] = useState<Date>(today);
    const [open, setOpen] = useState({ min: false, max: false });
    const queryClient = useQueryClient();
    const parseYearMonth = (date: Date) => {
        const converDate = convertFromDateFormat(date);
        const { yearMonth } = parseDateTime(converDate);
        return yearMonth;
    };
    const dispatch = useDispatch();

    const onButtonClick = () => {
        const startDate = parseYearMonth(minValue);
        const endDate = parseYearMonth(maxValue);
        queryClient.refetchQueries(['modificationList'], { active: true });
        dispatch(setFilter({ startDate, endDate }));
    };

    useEffect(() => {
        const startDate = parseYearMonth(today);
        const endDate = parseYearMonth(today);
        dispatch(setFilter({ startDate, endDate }));
        // eslint-disable-next-line
    }, [dispatch]);

    if (!filter.startDate || !filter.endDate || !filterList.departments || !filterList.names) return null;

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Grid container wrap='nowrap' alignItems='center'>
                <Grid sx={{ width: '135px' }} item>
                    <DesktopDatePicker
                        inputFormat='yyyy-MM-dd'
                        value={minValue}
                        minDate={subDays(today, 30)}
                        disableFuture
                        onChange={(newValue) => {
                            if (newValue) {
                                setMinValue(newValue);
                                setMaxValue(newValue);
                            }
                        }}
                        renderInput={(params) => <DateInput params={params} />}
                        renderDay={(date: Date, selectedDates: Array<Date | null>, pickersDayProps: PickersDayProps<Date>) => {
                            const isSunday = date.getDay() === 0;
                            return <PickersDay sx={{ color: isSunday ? '#F40C1A' : 'initial' }} {...pickersDayProps} />;
                        }}
                        PaperProps={{ sx: { pb: 2 } }}
                        onOpen={() => setOpen({ ...open, min: true })}
                        onClose={() => setOpen({ ...open, min: false })}
                    />
                </Grid>
                <Grid sx={{ p: 0.5 }}>-</Grid>
                <Grid sx={{ width: '135px' }} item>
                    <DesktopDatePicker
                        inputFormat='yyyy-MM-dd'
                        value={maxValue}
                        minDate={minValue}
                        disableFuture
                        onChange={(newValue) => newValue && setMaxValue(newValue)}
                        renderInput={(params) => <DateInput params={params} />}
                        renderDay={(date: Date, selectedDates: Array<Date | null>, pickersDayProps: PickersDayProps<Date>) => {
                            const isSunday = date.getDay() === 0;
                            return <PickersDay sx={{ color: isSunday ? '#F40C1A' : 'initial' }} {...pickersDayProps} />;
                        }}
                        PaperProps={{ sx: { pb: 2 } }}
                        onOpen={() => setOpen({ ...open, max: true })}
                        onClose={() => setOpen({ ...open, max: false })}
                    />
                </Grid>
                <Grid sx={{ flex: '1' }} container justifyContent='flex-end'>
                    <Button
                        sx={{ borderRadius: '6px', width: '50px', minWidth: 'unset', background: '#55606E', '&:hover': { background: '#55606E' }, p: 0.25, mt: 0.25, ml: 1 }}
                        disableElevation
                        variant='contained'
                        onClick={onButtonClick}>
                        <span style={{ paddingTop: '0.2rem' }}>조회</span>
                    </Button>
                </Grid>
            </Grid>
            <Typography sx={{ pt: 0.2, color: '#B2B2B2', fontSize: '10px' }}>* 최대 한 달까지 조회 가능</Typography>
        </LocalizationProvider>
    );
}
