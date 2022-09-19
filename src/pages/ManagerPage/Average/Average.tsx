import { Grid, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import CircularCompletionRate from '../../../components/CircularCompletionRate';
import { selectManager } from '../../../slices/manager';
import { convertTo2digit } from '../../../utils/util';

export default function Average() {
    const { average } = useSelector(selectManager);
    const { averageTime, standardWorkDayCount, rate } = average;
    const [h, m, s] = averageTime ? Object.values(averageTime!).map((el) => convertTo2digit(el)) : ['00', '00', '00'];

    if (!averageTime || !standardWorkDayCount) return null;

    return (
        <Grid sx={{ pt: 3, pb: 1, position: 'relative' }} container justifyContent='center' direction='column'>
            <Grid sx={{ width: 'fit-content', m: 'auto' }} item>
                <CircularCompletionRate
                    key={rate}
                    value={rate || 0}
                    size={305}
                    outerSize={322.5}
                    innerSize={295}
                    thickness={1.8}
                    primaryBlur
                    whiteBackground
                    strokeDashArray
                    boxShadow
                />
            </Grid>
            <Grid sx={{ position: 'absolute', inset: '0' }} container direction='column' justifyContent='center' alignItems='center'>
                <Grid sx={{ background: '#F8F8F8', pr: 1, pl: 1, pt: 0.5, pb: 0.5, borderRadius: '16px' }} item>
                    <Typography sx={{ color: '#A3A5A5', pt: 0.2, fontSize: '14px' }}>평균 근무 시간</Typography>
                </Grid>
                <Grid sx={{ pt: 0.5, pb: 1 }} item>
                    <Typography sx={{ fontSize: '36px', fontWeight: 700, color: '#2C57E5' }} component='span'>
                        {h}:{m}
                    </Typography>
                    <Typography sx={{ fontSize: '36px', fontWeight: 300, color: '#A3A5A5' }} component='span'>
                        :
                    </Typography>
                    <Typography sx={{ fontSize: '36px', fontWeight: 300, color: '#A3A5A5' }} component='span'>
                        {s}
                    </Typography>
                </Grid>
                {standardWorkDayCount && (
                    <>
                        <Grid item>
                            <Typography sx={{ color: '#CCCCCC', fontSize: '12px' }} component='span'>
                                근무일 :{' '}
                            </Typography>
                            <Typography sx={{ color: '#CCCCCC', fontSize: '12px', fontWeight: 700 }} component='span'>
                                {standardWorkDayCount}일
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Typography sx={{ color: '#CCCCCC', fontSize: '12px' }} component='span'>
                                기준시간 :{' '}
                            </Typography>
                            <Typography sx={{ color: '#CCCCCC', fontSize: '12px', fontWeight: 700 }} component='span'>
                                {8 * standardWorkDayCount}시간
                            </Typography>
                        </Grid>
                    </>
                )}
            </Grid>
        </Grid>
    );
}
