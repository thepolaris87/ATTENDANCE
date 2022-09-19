import { useEffect, useState } from 'react';
import { Grid, Typography } from '@mui/material';
import { ReactComponent as LoginClockIcon } from '../../aseets/images/login_clock.svg';
import { getToday, getNow } from '../../utils/date';

export default function RealTime() {
    const { year, month, date, day } = getToday();
    const [time, setTime] = useState<null | { h: string; m: string; s: string }>();
    useEffect(() => {
        const interval = setInterval(() => {
            const { h, m, s } = getNow();
            setTime({ h, m, s });
        }, 100);
        return () => {
            clearInterval(interval);
        };
    }, []);

    if (!time) return null;
    
    return (
        <Grid container direction='column' alignItems='center' justifyContent='center'>
            <Grid sx={{ pb: 5 }} item>
                <LoginClockIcon />
            </Grid>
            <Grid sx={{ pr: 5, pl: 5, background: '#1D33BD', borderRadius: '18px' }} item>
                <Typography sx={{ pt: 0.5, fontWeight: 300 }} color='#FFFFFF' align='center'>
                    {year}-{month}-{date} ({day})
                </Typography>
            </Grid>
            <Grid sx={{ pt: 0.5 }} item>
                <Typography sx={{ display: 'inline-block', width: '70px', fontSize: '56px', fontWeight: 700, color: '#FFFFFF' }} component='span' align='right'>
                    {time.h}
                </Typography>
                <Typography sx={{ fontSize: '56px', fontWeight: 700, color: '#FFFFFF' }} component='span'>
                    :
                </Typography>
                <Typography sx={{ display: 'inline-block', width: '70px', fontSize: '56px', fontWeight: 700, color: '#FFFFFF' }} component='span' align='center'>
                    {time.m}
                </Typography>
                <Typography sx={{ fontSize: '56px', fontWeight: 500, color: '#97AFFF' }} component='span'>
                    :
                </Typography>
                <Typography sx={{ display: 'inline-block', width: '70px', fontSize: '56px', fontWeight: 300, color: '#97AFFF' }} component='span' align='left'>
                    {time.s}
                </Typography>
            </Grid>
        </Grid>
    );
}
