import { Typography, Grid } from '@mui/material';
import { ReactComponent as ClockIcon } from '../../../aseets/images/clock.svg';
import { statusTextMSG } from '../../../utils/const';
import useUserInfo from '../../../hooks/useUserInfo';
import { parseDateTime } from '../../../utils/date';

export default function StatusText() {
    const { userInfo } = useUserInfo();
    const { extraInfo } = userInfo;
    const standardCheckIn = parseDateTime(extraInfo.standardCheckIn);
    const [h, m] = standardCheckIn.time.split(':');

    return (
        <>
            {extraInfo.currentState === 'early' && (
                <Grid sx={{ position: 'absolute', inset: '0', top: '-120px', color: '#2C57E5' }} container alignItems='center' justifyContent='center'>
                    <ClockIcon />
                    <Typography sx={{ ml: 0.5, pt: 0.4, fontWeight: 700 }} component='span'>
                        {h}시
                    </Typography>
                    <Typography sx={{ pt: 0.4, fontWeight: 700, whiteSpace: 'break-spaces' }} component='span'>
                        {Number(m) !== 0 && ` ${m}분`}
                    </Typography>
                    <Typography sx={{ pt: 0.4 }} component='span'>
                        부터 근무 시작
                    </Typography>
                </Grid>
            )}
            <Grid sx={{ position: 'absolute', inset: '0', top: '-18px' }} container alignItems='center' justifyContent='center'>
                <Typography sx={{ fontSize: '36px', fontWeight: 700, color: extraInfo.currentState === 'leave' ? '#999999' : '#34393C' }}>
                    {statusTextMSG[extraInfo.currentState!]}
                </Typography>
            </Grid>
        </>
    );
}
