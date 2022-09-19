import type { GROUPHISTORY, HISTORY, USERINFO } from '../apis/types';

import { differenceInMinutes, subDays, subMilliseconds, differenceInCalendarDays, differenceInSeconds } from 'date-fns';
import { convertTo2digit, getUniqueArray, isAcademy, isHalfDay, isWorkDay } from './util';
import { overtime } from './const';

type GETCOMPLETION = { checkIn: string | null; dayOffCode: USERINFO['dayOffCode']; companyCode: USERINFO['companyCode'] };

export const getCompletion = ({ checkIn, dayOffCode, companyCode }: GETCOMPLETION) => {
    if (!checkIn) return 0;
    // 출근 시간
    const standardCheckIn = getStandardCheckIn(checkIn, companyCode);
    const standardCheckInTime = createDateFormat(standardCheckIn);

    // 퇴근 시간
    const standardCheckOut = getStandardCheckOut(standardCheckIn, dayOffCode);
    const standardCheckOutTime = createDateFormat(standardCheckOut);

    // 현재 시간
    const currentTime = NOW();

    // 현재 시간이 출근 시간 전인 경우 || 연차인 경우
    if (currentTime < standardCheckInTime || dayOffCode === '01') return 0;

    // 점심 시간
    const breakTime = getBreakTime();

    // 점심 시간 포함 여부 (점심 시간 전에 출근해서 현재가 점심 시간 이후인 경우)
    const isSubBreakTime = standardCheckInTime <= breakTime.start && currentTime > breakTime.end;

    // 점심 시간인 경우 현재 시간을 점심 시간 시작 시간으로 고정
    if (isBreakTime(currentTime)) {
        const { start } = breakTime;
        currentTime.setHours(start.getHours());
        currentTime.setMinutes(start.getMinutes());
        currentTime.setSeconds(start.getSeconds());
    }

    // 퇴근 시간 내 30분 이하인 경우 시작 시간을 퇴근 시간으로 고정
    const outDiff = differenceInMinutes(currentTime, standardCheckOutTime);
    if (0 < outDiff && outDiff < overtime) {
        currentTime.setHours(standardCheckOutTime.getHours());
        currentTime.setMinutes(standardCheckOutTime.getMinutes());
        currentTime.setSeconds(standardCheckOutTime.getMinutes());
    }

    const diff = differenceInMinutes(currentTime, standardCheckInTime) - (isSubBreakTime ? 60 : 0);

    const result = (diff / (isHalfDay(dayOffCode) ? 240 : 480)) * 100;

    return Math.floor(result);
};

export const getWorkDay = () => {
    const baseCheckInTime = 6;
    const today = getToday();
    const now = getNow();
    const isOvernight = parseInt(now.h) < baseCheckInTime;
    const date = isOvernight && subDays(NOW(), 1);

    if (date) {
        return {
            year: convertTo2digit(date.getFullYear()),
            month: convertTo2digit(date.getMonth() + 1),
            date: convertTo2digit(date.getDate()),
            day: parseDay(date.getDay()) || ''
        };
    }
    return today;
};
export const getToday = () => {
    const today = NOW();
    const date = {
        year: convertTo2digit(today.getFullYear()),
        month: convertTo2digit(today.getMonth() + 1),
        date: convertTo2digit(today.getDate()),
        day: parseDay(today.getDay()) || ''
    };
    return date;
};
export const getNow = () => {
    const today = NOW();
    const h = convertTo2digit(today.getHours());
    const m = convertTo2digit(today.getMinutes());
    const s = convertTo2digit(today.getSeconds());
    return { h, m, s };
};
export const parseDay = (index: number) => ({ 0: '일', 1: '월', 2: '화', 3: '수', 4: '목', 5: '금', 6: '토' }[index]);
export const parseDateTime = (checkTime: string | undefined) => {
    if (!checkTime) return { yearMonth: '', time: '' };
    const [yearMonth, time] = checkTime.split(' ');
    return { yearMonth, time };
};

export const getStandardClock = (time: string, type: 'in' | 'out', isAcademy: boolean): string => {
    let standardClock!: string;
    const [h, m, s] = time.split(':');
    const ms = Number(`${m}${s}`);
    if (type === 'in') standardClock = isAcademy && ms < 3000 ? `${h}:30:00` : `${Number(h) + 1}:00:00`;
    if (type === 'out') standardClock = isAcademy && ms >= 3000 ? `${h}:30:00` : `${h}:00:00`;
    if (standardClock.length === 7) standardClock = '0' + standardClock;
    return standardClock;
};

export const getStandardCheckIn = (checkIn: string, companyCode: USERINFO['companyCode']) => {
    // 점심 시간 중 출근한 경우 점심 시간이 끝나는 시간이 출근 시간
    const _checkIn = createDateFormat(checkIn);
    const isPreCheckInWorkHour = _checkIn.getHours() < 8;

    if (isPreCheckInWorkHour) {
        _checkIn.setHours(7);
        _checkIn.setMinutes(59);
        _checkIn.setSeconds(59);
    }

    const breakEndTime = getBreakTime().end;
    const checkInTime = isBreakTime(_checkIn) ? convertFromDateFormat(subMilliseconds(breakEndTime, 1)) : convertFromDateFormat(_checkIn);

    const parseCheckInTime = parseDateTime(checkInTime);
    const standardCheckIn = getStandardClock(parseCheckInTime.time, 'in', isAcademy(companyCode));
    return parseCheckInTime.yearMonth + ' ' + standardCheckIn;
};

export const getStandardCheckOut = (standardCheckIn: string, dayOffCode: USERINFO['dayOffCode']) => {
    const workHour = isHalfDay(dayOffCode) ? 4 : 8;
    const parseStandardCheckIn = parseDateTime(standardCheckIn);
    const [year, month, date] = parseStandardCheckIn.yearMonth.split('-').map((el) => parseInt(el));
    const [h, m, s] = parseStandardCheckIn.time.split(':').map((el) => parseInt(el));
    const standardCheckOutTime = new Date(year, month - 1, date, h + workHour, m, s);
    // 점심 시간 이전 출근 & 점심 시간 이후 퇴근
    const breakTime = getBreakTime();
    const haveBreakTime = createDateFormat(standardCheckIn) <= breakTime.start && standardCheckOutTime > breakTime.end;
    if (haveBreakTime) standardCheckOutTime.setHours(standardCheckOutTime.getHours() + 1);

    return convertFromDateFormat(standardCheckOutTime);
};

export const createDateFormat = (time: string) => {
    const parseTime = parseDateTime(time);
    const [year, month, date] = parseTime.yearMonth.split('-').map((el) => parseInt(el));
    const [h, m, s] = parseTime.time.split(':').map((el) => parseInt(el));
    return new Date(year, month - 1, date, h, m, s);
};
export const convertFromDateFormat = (Date: Date) => {
    const year = Date.getFullYear();
    const month = convertTo2digit(Date.getMonth() + 1);
    const date = convertTo2digit(Date.getDate());
    const h = convertTo2digit(Date.getHours());
    const m = convertTo2digit(Date.getMinutes());
    const s = convertTo2digit(Date.getSeconds());
    return year + '-' + month + '-' + date + ' ' + h + ':' + m + ':' + s;
};

export const getBreakTime = () => {
    const [workYear, workMonth, workDate] = Object.values(getWorkDay()).map((value) => parseInt(value));
    const breakTime = {
        start: new Date(workYear, workMonth - 1, workDate, 12, 0, 0),
        end: new Date(workYear, workMonth - 1, workDate, 13, 0, 0)
    };
    return breakTime;
};

export const isBreakTime = (time: Date) => {
    const breakTime = getBreakTime();
    const isBreakTime = breakTime.start <= time && time < breakTime.end;
    return isBreakTime;
};

export const isInAMonth = (attendance: HISTORY['attendanceDate']) => {
    const [year, month, date] = attendance.split('-').map((el) => parseInt(el));
    const diff = differenceInCalendarDays(NOW(), new Date(year, month - 1, date));
    return diff < 30;
};

export const covertSToH = (s: number) => {
    let m = Math.floor(s / 60);
    let h = Math.floor(m / 60);
    m = m % 60;
    s = s % 60;
    return { h, m, s };
};

export const getWorkTime = (checkIn: HISTORY['clockIn'], checkOut: HISTORY['clockOut']) => {
    if (!checkOut || !checkIn) return { h: '00', m: '00', s: '00' };
    const checkInTime = createDateFormat(checkIn);
    const checkOutTime = createDateFormat(checkOut);
    let sec = differenceInSeconds(checkOutTime, checkInTime);
    const { h, m, s } = covertSToH(sec);

    return { h: convertTo2digit(h), m: convertTo2digit(m), s: convertTo2digit(s) };
};

export const getAverageWorkTime = (data: GROUPHISTORY[]) => {
    const headCount = getUniqueArray(data.map(({ displayName }) => displayName)).length;

    // 점심 시간
    const breakTime = getBreakTime();

    const totalWorkTime = data.reduce((p, { attendanceDate, clockIn, workHours, dayOffCode, modificationStatusCode, companyCode }) => {
        if (workHours) {
            p = p + workHours * 60 * 60;
        } else {
            if (isWorkDay(attendanceDate) && clockIn) {
                // 점심 시간 포함 여부 (점심 시간 전에 출근해서 현재가 점심 시간 이후인 경우)
                const standardCheckInTime = createDateFormat(getStandardCheckIn(clockIn, companyCode));
                const isSubBreakTime = standardCheckInTime <= breakTime.start && NOW() > breakTime.end;
                const sec = differenceInSeconds(NOW(), standardCheckInTime) - (isSubBreakTime ? 60 * 60 : 0);
                p += sec < 0 ? 0 : sec;
            }
            if (modificationStatusCode === '2') p = p + (isHalfDay(dayOffCode) ? 4 : 8) * 60 * 60;
        }

        return p;
    }, 0);

    const averageTime = covertSToH(Math.round(totalWorkTime / headCount));
    const rate = Math.round((totalWorkTime / (data.length * 8 * 60 * 60)) * 100);

    return { averageTime, rate };
};

export const parseWorkHours = (workHours: number) => {
    const h = Math.floor(workHours);
    const mDecimal = Number((workHours % 1).toFixed(2));
    const m = mDecimal * 60;
    const sDecimal = Number((m % 1).toFixed(2));
    const s = sDecimal * 60;

    return { h: convertTo2digit(h), m: convertTo2digit(Math.floor(m)), s: convertTo2digit(Math.floor(s)) };
};

export const getAllPageParam = (startDate: string, endDate: string, diff: number) => {
    const createDate = (date: string) => {
        const [y, m, d] = date.split('-').map((el) => parseInt(el));
        return new Date(y, m - 1, d);
    };

    const convertDate = (date: Date) => {
        const y = date.getFullYear();
        const m = convertTo2digit(date.getMonth() + 1);
        const d = convertTo2digit(date.getDate());
        return [y, m, d].join('-');
    };

    let startTime = createDate(startDate);
    let endTime = createDate(endDate);
    let midTime = startTime;
    const result = [];

    if (differenceInCalendarDays(endTime, startTime) <= diff) return [{ startDate, endDate }];

    while (true) {
        midTime = subDays(endTime, diff);
        result.push({ endDate: convertDate(endTime), startDate: convertDate(midTime) });
        endTime = subDays(midTime, 1);
        midTime = subDays(midTime, diff);

        if (startTime > midTime) {
            result.push({ endDate: convertDate(endTime), startDate: convertDate(startTime) });
            break;
        }
    }

    return result;
};

export const NOW = () => new Date();
