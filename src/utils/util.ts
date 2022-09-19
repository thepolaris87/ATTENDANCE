import type { HISTORY, USERINFO } from '../apis/types';
import { getWorkDay, parseDateTime } from './date';

export const setAccessToken = (token: string) => sessionStorage.setItem('accessToken', token);
export const getAccessToken = () => sessionStorage.getItem('accessToken');
export const getCircularCompletionValues = (value: number) => {
    value = Math.round(value);
    let r = value % 100;
    let q = value;
    let result = [r];
    while (q >= 100) {
        q -= 100;
        result.push(100);
    }
    return result.reverse();
};
export const getUniqueArray = (array: any[]) => Array.from(new Set(array));
export const getAttendanceStatus = ({
    dayOffCode,
    attendanceDate,
    checkIn,
    checkOut,
    type
}: {
    dayOffCode: USERINFO['dayOffCode'];
    attendanceDate: HISTORY['attendanceDate'];
    checkIn: HISTORY['clockIn'];
    checkOut?: HISTORY['clockOut'];
    type: 'in' | 'out';
}) => {
    const _isLeave = isLeave(dayOffCode);
    if (_isLeave) return '-';
    const workDay = getWorkDay();
    const _workDay = workDay.month + '-' + workDay.date;
    const isToday = attendanceDate && _workDay === attendanceDate.substring(5);
    if (type === 'in') {
        if (checkIn) return parseDateTime(checkIn).time;
        else {
            if (isToday) return '출근전';
            else return '-'; //출근 안 찍은 경우
        }
    }
    if (type === 'out') {
        if (!checkIn) return '-';
        if (checkOut) return parseDateTime(checkOut).time;
        else {
            if (isToday) return '퇴근전';
            else return '-'; //퇴근 안 찍은 경우
        }
    }
};
export const convertTo2digit = (number: number) => (number < 10 ? '0' + number : number.toString());
export const isAcademy = (companyCode: USERINFO['companyCode']) => companyCode === 'P';
export const isHalfDay = (dayOffCode: USERINFO['dayOffCode']) => ['02', '03'].includes(dayOffCode);
export const isLeave = (dayOffCode: USERINFO['dayOffCode']) => dayOffCode === '01';
export const isTJ = (info: USERINFO[]) => info.some(({ dutyCode }) => dutyCode === 'TJ');
export const isPJ = (info: USERINFO[]) => info.some(({ dutyCode }) => dutyCode === 'PJ');
export const isWorkDay = (attendanceDate: HISTORY['attendanceDate']) => {
    if (!attendanceDate) return false;
    const { month, date } = getWorkDay();
    const workDay = month + '-' + date;
    return workDay === attendanceDate.substring(5);
};
export const haveDutyCode = (info: USERINFO[], dutyCodes: USERINFO['dutyCode'][]) => info.some(({ dutyCode }) => dutyCodes.includes(dutyCode));
export const getSliceArray = <T>(array: T[], diff: number = 30) => {
    const result = [];
    const totalLen = array.length;
    let current = 0;

    while (totalLen > current) {
        const sliceArray = array.slice(current, current + diff);
        current += diff + 1;
        result.push(sliceArray);
    }
    return result;
};
