import { Box, Typography } from '@mui/material';
import { useMemo } from 'react';
import { attendanceMSG } from '../../utils/const';
import { getToday, NOW } from '../../utils/date';

export default function Message() {
    const [year, month, date] = Object.values(getToday()).map((el) => parseInt(el));
    const current = NOW();
    const start = new Date(year, month - 1, date, 6, 0, 0);
    const end = new Date(year, month - 1, date, 16, 55, 0);
    const isIn = start < current && current < end;
    const msgs = attendanceMSG[isIn ? 'in' : 'out'];
    const msg = useMemo(() => msgs.sort(() => Math.random() - 0.5)[0], [msgs]);

    return (
        <Box sx={{ width: '250px', m: 'auto' }}>
            <Typography sx={{ whiteSpace: 'pre-line', fontSize: '16px', wordBreak: 'keep-all' }} color='#97AFFF' align='center'>
                {msg}
            </Typography>
        </Box>
    );
}
