import React, { useState } from 'react';
import { Box, Divider, Grid } from '@mui/material';
import type { HISTORY, GROUPHISTORY } from '../../apis/types';
import CircularCompletionRate from '../../components/CircularCompletionRate';

import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { ReactComponent as ModificationIcon } from '../../aseets/images/modification.svg';
import { ReactComponent as ModificationStatus1 } from '../../aseets/images/modificationStatus1.svg';
import { ReactComponent as ModificationStatus2 } from '../../aseets/images/modificationStatus2.svg';
import { ReactComponent as ModificationStatus9 } from '../../aseets/images/modificationStatus9.svg';
import { circularColor } from '../../utils/const';
import { getAttendanceStatus, isWorkDay } from '../../utils/util';
import { getCompletion, isInAMonth } from '../../utils/date';
import { ReactComponent as CheckIcon } from '../../aseets/images/check.svg';

import { TableLabel, TableCell, TableStatus } from './TableList.styles';
import { useSelector } from 'react-redux';
import { selectUser } from '../../slices/user';

export type SORTLIST = 'displayName' | 'attendanceDate' | 'clockIn' | 'clockOut' | 'completionRatio';

type TABLELIST = {
    name?: boolean;
    history: (HISTORY & Partial<GROUPHISTORY> & { disabled?: boolean })[];
    onClick?: (e: HISTORY) => void;
    realTime?: boolean;
    sort?: (state: { type: SORTLIST; current: number }) => void;
};

const SortIcon = ({ index }: { index: number }) => {
    return (
        <Box sx={{ position: 'absolute', top: '-1px', right: '2px' }}>
            {index === 1 && <ArrowDropUpIcon sx={{ color: '#bababa' }} />}
            {index === 2 && <ArrowDropDownIcon sx={{ color: '#bababa' }} />}
        </Box>
    );
};

export default function TableList({ name, history, onClick, realTime, sort }: TABLELIST) {
    const { extraInfo } = useSelector(selectUser);
    const [sortState, setSortState] = useState({ displayName: 0, attendanceDate: 0, clockIn: 0, clockOut: 0, completionRatio: 0 });

    const onSortClick = (target: SORTLIST) => {
        const copy = { ...sortState };
        sort?.({ type: target, current: sortState[target] });
        for (const key in copy) {
            if (key === target) copy[key] = (copy[key] + 1) % 3;
            else copy[key as SORTLIST] = 0;
        }
        setSortState(copy);
    };

    return (
        <Box>
            <Grid sx={{ background: '#F4F4F4', pt: 1, pb: 1, borderRadius: '8px' }} container alignItems='center'>
                {name && (
                    <Grid sx={{ flex: '1', cursor: !!sort ? 'pointer' : 'inherit', position: 'relative' }} item onClick={() => onSortClick('displayName')}>
                        <TableLabel align='center'>이름</TableLabel>
                        {!!sort && <SortIcon index={sortState.displayName} />}
                    </Grid>
                )}
                <Grid sx={{ flex: '1', cursor: !!sort ? 'pointer' : 'inherit', position: 'relative' }} item onClick={() => onSortClick('attendanceDate')}>
                    <TableLabel align='center'>날짜</TableLabel>
                    {!!sort && <SortIcon index={sortState.attendanceDate} />}
                </Grid>
                <Grid sx={{ flex: '1', cursor: !!sort ? 'pointer' : 'inherit', position: 'relative' }} item onClick={() => onSortClick('clockIn')}>
                    <TableLabel align='center'>출근</TableLabel>
                    {!!sort && <SortIcon index={sortState.clockIn} />}
                </Grid>
                <Grid sx={{ flex: '1', cursor: !!sort ? 'pointer' : 'inherit', position: 'relative' }} item onClick={() => onSortClick('clockOut')}>
                    <TableLabel align='center'>퇴근</TableLabel>
                    {!!sort && <SortIcon index={sortState.clockOut} />}
                </Grid>
                <Grid sx={{ flex: '1', cursor: !!sort ? 'pointer' : 'inherit', position: 'relative' }} item onClick={() => onSortClick('completionRatio')}>
                    <TableLabel align='center'>상태</TableLabel>
                    {!!sort && <SortIcon index={sortState.completionRatio} />}
                </Grid>
            </Grid>
            {history.map(({ displayName, attendanceDate, clockIn, clockOut, completionRatio, modificationStatusCode, disabled, dayOffCode, ...rest }, i) => (
                <React.Fragment key={`${displayName}-${attendanceDate}-${clockIn}-${clockOut}-${completionRatio}-${i}`}>
                    <Grid container alignItems='center'>
                        {name && (
                            <Grid sx={{ flex: '1' }} item>
                                <TableCell align='center'>{displayName}</TableCell>
                            </Grid>
                        )}
                        <Grid sx={{ flex: '1' }} item>
                            <TableCell align='center'>{attendanceDate.substring(5)}</TableCell>
                        </Grid>
                        <Grid sx={{ flex: '1' }} item>
                            {getAttendanceStatus({ attendanceDate, dayOffCode, checkIn: clockIn, type: 'in' }) === '출근전' ? (
                                <TableCell sx={{ color: '#CCCCCC' }} align='center'>
                                    출근전
                                </TableCell>
                            ) : (
                                <TableCell align='center'>{getAttendanceStatus({ attendanceDate, dayOffCode, checkIn: clockIn, type: 'in' })}</TableCell>
                            )}
                        </Grid>
                        <Grid sx={{ flex: '1' }} item>
                            {getAttendanceStatus({ attendanceDate, dayOffCode, checkIn: clockIn, checkOut: clockOut, type: 'out' }) === '퇴근전' ? (
                                <TableCell sx={{ color: '#CCCCCC' }} align='center'>
                                    퇴근전
                                </TableCell>
                            ) : (
                                <TableCell align='center'>{getAttendanceStatus({ attendanceDate, dayOffCode, checkIn: clockIn, checkOut: clockOut, type: 'out' })}</TableCell>
                            )}
                        </Grid>
                        <Grid sx={{ flex: '1', display: 'flex', justifyContent: 'center', position: 'relative' }} item>
                            <CircularCompletionRate
                                key={!!realTime ? extraInfo.currentState : ''}
                                button={
                                    !disabled &&
                                    (typeof modificationStatusCode === 'string' ||
                                        (!isWorkDay(attendanceDate) && Number(completionRatio) < 100) ||
                                        (isWorkDay(attendanceDate) && Number(completionRatio) < 100 && !!clockOut))
                                }
                                value={
                                    !!realTime && !clockOut && isWorkDay(attendanceDate)
                                        ? Number(extraInfo.realtimeCompletion)
                                        : dayOffCode === '01'
                                        ? 100
                                        : isWorkDay(attendanceDate) && !clockOut
                                        ? getCompletion({ checkIn: clockIn, dayOffCode, companyCode: rest.companyCode! })
                                        : Number(completionRatio)
                                }
                                size={40}
                                innerSize={38}
                                outerSize={44}
                                thickness={4}
                                onClick={onClick?.bind(null, { displayName, attendanceDate, clockIn, clockOut, completionRatio, modificationStatusCode, dayOffCode, ...rest })}
                                color={
                                    dayOffCode === '01'
                                        ? circularColor['leave']
                                        : modificationStatusCode
                                        ? circularColor[modificationStatusCode]
                                        : !!completionRatio && completionRatio > 100
                                        ? circularColor['overtime']
                                        : !!completionRatio && completionRatio === 100
                                        ? circularColor['normal']
                                        : !!clockOut
                                        ? circularColor['off']
                                        : circularColor['default']
                                }
                            />
                            <Box sx={{ pointerEvents: 'none' }}>
                                {modificationStatusCode && (
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: '2px',
                                            right: '0',
                                            p: '0 5px',
                                            zIndex: 2
                                        }}>
                                        {modificationStatusCode === '1' && <ModificationStatus1 />}
                                        {modificationStatusCode === '2' && <ModificationStatus2 />}
                                        {modificationStatusCode === '9' && <ModificationStatus9 />}
                                    </Box>
                                )}
                                {!modificationStatusCode &&
                                    !disabled &&
                                    isInAMonth(attendanceDate) &&
                                    ((!isWorkDay(attendanceDate) && Number(completionRatio) < 100) ||
                                        (isWorkDay(attendanceDate) && Number(completionRatio) < 100 && !!clockOut)) && (
                                        <Box sx={{ position: 'absolute', top: '2px', left: '55%', zIndex: 2 }}>
                                            <ModificationIcon />
                                        </Box>
                                    )}
                                {dayOffCode === '01' && (
                                    <TableStatus sx={{ color: '#959595' }} align='center'>
                                        휴가
                                    </TableStatus>
                                )}
                                {dayOffCode !== '01' && !!completionRatio && completionRatio > 100 && (
                                    <TableStatus sx={{ color: '#842AFB' }} align='center'>
                                        초과
                                    </TableStatus>
                                )}
                                {dayOffCode !== '01' && !!completionRatio && completionRatio < 100 && (
                                    <TableStatus sx={{ color: modificationStatusCode === '9' ? '#959595' : '#2C57E5' }} align='center'>
                                        {completionRatio}%
                                    </TableStatus>
                                )}
                                {dayOffCode !== '01' && !!completionRatio && completionRatio === 100 && (
                                    <CheckIcon style={{ position: 'absolute', left: 'calc(50% - 10px)', top: '21px', color: '#C4D8FD' }} />
                                )}
                            </Box>
                        </Grid>
                    </Grid>
                    <Divider />
                </React.Fragment>
            ))}
        </Box>
    );
}
