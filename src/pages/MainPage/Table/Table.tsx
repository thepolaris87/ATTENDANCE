import { useEffect, useState } from 'react';

import { Box } from '@mui/material';
import TableList from '../../../components/TableList';
import Modal from '../../../components/Modal';
import DateSelector from './DateSelector';
import RequestModification from './RequestModification';

import { useDispatch, useSelector } from 'react-redux';
import { setUserExtra } from '../../../slices/user';
import { selectMain, updateCheckOut } from '../../../slices/main';

import { useQuery } from 'react-query';
import { getMonthlyHistory } from '../../../apis/clock';

import { addMonths } from 'date-fns';
import { convertTo2digit } from '../../../utils/util';
import { getWorkDay, getToday, getStandardCheckIn, getStandardCheckOut, isInAMonth } from '../../../utils/date';

import useUserInfo from '../../../hooks/useUserInfo';
import { HISTORY } from '../../../apis/types';

export default function Table() {
    const { userInfo } = useUserInfo();
    const { info, extraInfo } = userInfo;
    const today = getToday();
    const workDay = getWorkDay();
    const [yearMonth, setYearMonth] = useState(`${today.year}-${today.month}`);
    const [openRequest, setOpenRequest] = useState(false);
    const [requestValue, setRequestValue] = useState<HISTORY & { inAMonth: boolean }>();
    const { isUpdateCheckOut } = useSelector(selectMain);
    const dispatch = useDispatch();
    const { data: history, error } = useQuery(['history', yearMonth], () => getMonthlyHistory(yearMonth), { enabled: true });

    const onArrowClick = (index: number, from: string) => {
        const date = addMonths(new Date(parseInt(today.year), parseInt(today.month) - 1), index);
        setYearMonth(`${date.getFullYear()}-${convertTo2digit(date.getMonth() + 1)}`);
    };

    const onListClick = (e: HISTORY) => {
        setRequestValue({ ...e, inAMonth: isInAMonth(e.attendanceDate) });
        setOpenRequest(true);
    };

    useEffect(() => {
        if (history) {
            const target = history.find(({ attendanceDate }) => attendanceDate === `${workDay.year}-${workDay.month}-${workDay.date}`);
            
            if (target) {
                const checkIn = target.clockIn;
                const checkOut = target.clockOut;
                const completion = target.completionRatio || 0;
                const standardCheckIn = checkIn ? getStandardCheckIn(checkIn, userInfo.info![0].companyCode) : '';
                const standardCheckOut = standardCheckIn ? getStandardCheckOut(standardCheckIn, userInfo.info![0].dayOffCode) : '';
                dispatch(setUserExtra({ checkIn: checkIn || '', checkOut, standardCheckIn, standardCheckOut, completion }));
            }
        }
    }, [history, dispatch, today, workDay, extraInfo.checkIn, extraInfo.checkOut, userInfo.info, info]);

    useEffect(() => {
        if (history && isUpdateCheckOut) {
            setYearMonth(`${today.year}-${today.month}`);
            dispatch(updateCheckOut(false));
        }
    }, [dispatch, history, isUpdateCheckOut, today.year, today.month]);

    if (error) throw error;

    return (
        <Box>
            <DateSelector display={yearMonth} onArrowClick={onArrowClick} />
            {history && <TableList history={history.map((el, i) => ({ ...el, disabled: el.dayOffCode === '01' }))} onClick={onListClick} realTime />}
            <div style={{ padding: '4px' }}></div>
            <Modal open={openRequest} onClose={() => setOpenRequest(false)}>
                <RequestModification requestValue={requestValue!} onClose={() => setOpenRequest(false)} />
            </Modal>
        </Box>
    );
}
