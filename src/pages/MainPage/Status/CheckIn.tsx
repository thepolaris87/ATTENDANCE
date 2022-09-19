import React, { useEffect, useMemo, useState } from 'react';
import { Box, Grid, Typography } from '@mui/material';

import { convertFromDateFormat, getWorkTime, NOW, parseDateTime } from '../../../utils/date';

import useUserInfo from '../../../hooks/useUserInfo';

export default function CheckIn({ completionRatio }: { completionRatio: number }) {
    const { userInfo } = useUserInfo();
    const { extraInfo } = userInfo;
    const checkInTime = useMemo(() => parseDateTime(extraInfo.checkIn!).time, [extraInfo.checkIn]);
    const checkOutTime = extraInfo.checkOut && parseDateTime(extraInfo.checkOut).time;
    const [time, setTime] = useState<null | { h: string; m: string; s: string }>();

    useEffect(() => {
        if (extraInfo.standardCheckOut && extraInfo.currentState === 'overtime') {
            const interval = setInterval(() => {
                const { h, m, s } = getWorkTime(extraInfo.standardCheckOut!, convertFromDateFormat(NOW()));
                setTime({ h, m, s });
            }, 100);
            return () => {
                clearInterval(interval);
            };
        }
    }, [extraInfo.currentState, extraInfo.standardCheckOut]);

    return (
        <Box sx={{ position: 'absolute', bottom: '105px' }}>
            {extraInfo.currentState === 'early' &&
                checkInTime.split(':').map((el, i) => (
                    <React.Fragment key={i}>
                        <Typography sx={{ color: i < 2 ? '#34393C' : '#A3A5A5', fontSize: '24px', fontWeight: i !== 2 ? 700 : 400 }} component='span'>
                            {el}
                        </Typography>
                        {i < 2 && (
                            <Typography sx={{ color: i < 1 ? '#34393C' : '#A3A5A5', fontSize: '24px', fontWeight: i !== 2 ? 700 : 400 }} component='span'>
                                :
                            </Typography>
                        )}
                    </React.Fragment>
                ))}

            {extraInfo.currentState === 'on' && (
                <Grid sx={{ position: 'absolute', inset: '0', top: '-50px' }} container alignItems='center' justifyContent='center'>
                    <Typography sx={{ fontWeight: 700, fontSize: '20pt', color: '#BBBBBB' }} align='center'>
                        {completionRatio}%
                    </Typography>
                </Grid>
            )}
            {extraInfo.currentState === 'off' &&
                checkOutTime &&
                checkOutTime.split(':').map((el, i) => (
                    <React.Fragment key={i}>
                        <Typography sx={{ color: i < 2 ? '#34393C' : '#A3A5A5', fontSize: '24px', fontWeight: i !== 2 ? 700 : 400 }} component='span'>
                            {el}
                        </Typography>
                        {i < 2 && (
                            <Typography sx={{ color: i < 1 ? '#34393C' : '#A3A5A5', fontSize: '24px', fontWeight: i !== 2 ? 700 : 400 }} component='span'>
                                :
                            </Typography>
                        )}
                    </React.Fragment>
                ))}
            {extraInfo.currentState === 'overtime' && time && (
                <>
                    <Typography sx={{ fontSize: '24px', fontWeight: 700, color: '#34393C' }} component='span' align='center'>
                        +
                    </Typography>
                    <Typography sx={{ display: 'inline-block', width: '30px', fontSize: '24px', fontWeight: 700, color: '#34393C' }} component='span' align='center'>
                        {time.h}
                    </Typography>
                    <Typography sx={{ fontSize: '24px', fontWeight: 700, color: '#34393C' }} component='span'>
                        :
                    </Typography>
                    <Typography sx={{ display: 'inline-block', width: '30px', fontSize: '24px', fontWeight: 700, color: '#34393C' }} component='span' align='center'>
                        {time.m}
                    </Typography>
                    <Typography sx={{ fontSize: '24px', fontWeight: 500, color: '#A3A5A5' }} component='span'>
                        :
                    </Typography>
                    <Typography sx={{ display: 'inline-block', width: '30px', fontSize: '24px', fontWeight: 300, color: '#A3A5A5' }} component='span' align='center'>
                        {time.s}
                    </Typography>
                </>
            )}
        </Box>
    );
}
