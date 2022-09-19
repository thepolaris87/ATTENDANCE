import { ReactComponent as NetworkErrorIcon } from '../../aseets/images/networkError.svg';
import { Box, Button, Grid, Typography } from '@mui/material';

export default function NetworkError() {
    return (
        <Box sx={{ position: 'fixed', width: '375px', inset: '0', m: '0 auto', background: '#fff', p: 3, boxSizing: 'border-box' }}>
            <Grid sx={{ height: '100%' }} container justifyContent='center' alignItems='center' direction='column'>
                <NetworkErrorIcon />
                <Typography
                    sx={{ pt: 3, workBreak: 'keep-all', whiteSpace: 'pre-line', color: '#777777' }}
                    align='center'>{`출퇴근 인증 화면은\n사내망에서만 접속이 가능합니다.`}</Typography>
                <Button
                    sx={{ borderRadius: '12px', m: 'auto', mt: 3, mb: 15, width: '100%', fontSize: '18px', background: '#55606E', '&:hover': { background: '#55606E' } }}
                    disableElevation
                    variant='contained'
                    onClick={() => window.location.reload()}>
                    <span style={{ paddingTop: '0.2rem' }}>다시 시도</span>
                </Button>
            </Grid>
        </Box>
    );
}
