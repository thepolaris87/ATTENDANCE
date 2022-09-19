import { addMinutes } from 'date-fns';
import { useCallback, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { CURRENTSTATE, setUserExtra, STATE } from '../../slices/user';
import { overtime } from '../../utils/const';
import { createDateFormat, getCompletion, NOW } from '../../utils/date';

export default function useRealtimeStatus(userInfo: STATE) {
    const { info, extraInfo } = userInfo;
    const dispatch = useDispatch();
    const interval = useRef<ReturnType<typeof setInterval>>();

    const handler = useCallback(() => {
        if (info && info[0].dayOffCode === '01') {
            dispatch(setUserExtra({ currentState: 'leave' }));
            return;
        }
        const { standardCheckIn, standardCheckOut } = extraInfo;
        if (info && extraInfo.checkIn && standardCheckIn && standardCheckOut) {
            const currentTime = NOW();
            let currentState: CURRENTSTATE;
            const standardCheckInTime = createDateFormat(standardCheckIn);
            const standardCheckOutTime = createDateFormat(standardCheckOut);
            if (extraInfo.checkOut) currentState = 'off';
            else {
                if (addMinutes(standardCheckOutTime, overtime) <= currentTime) currentState = 'overtime';
                else if (standardCheckInTime > currentTime) currentState = 'early';
                else currentState = 'on';
            }

            const completion = getCompletion({ checkIn: extraInfo.checkIn, dayOffCode: info[0].dayOffCode, companyCode: info[0].companyCode });
            dispatch(setUserExtra({ standardCheckIn, standardCheckOut, currentState, realtimeCompletion: completion }));
        }
    }, [dispatch, extraInfo, info]);

    useEffect(() => {
        handler();
    }, [handler]);

    useEffect(() => {
        const { standardCheckIn, standardCheckOut } = extraInfo;
        if (extraInfo.checkIn) {
            if (info && standardCheckIn && standardCheckOut && !['leave'].includes(extraInfo.currentState!)) {
                interval.current = setInterval(handler, 1000);
                return () => clearInterval(interval.current);
            }
        }
    }, [dispatch, extraInfo, info, handler]);
}
