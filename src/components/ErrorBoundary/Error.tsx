import { Button, Dialog, DialogContent, DialogTitle, Grid, Typography } from '@mui/material';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import NetworkError from './NetworkError';

export default function Error({ open, onClose, error }: { open: boolean; onClose: Function; error: (AxiosError & { error: AxiosError; from: string }) | null }) {
    document.body.style.display = 'initial';
    const navigate = useNavigate();
    let errorText = `로그 아웃 되었습니다.\n다시 로그인 해주세요.`;

    console.log('error : ', error);

    if (error?.response?.status === 412) return <NetworkError />;
    if (error?.error?.response?.status === 403 && error?.from === 'sign-in') errorText = '허용된 사용자가 아닙니다.';

    return (
        <Dialog PaperProps={{ sx: { borderRadius: '16px', minWidth: '310px' } }} open={open}>
            <DialogTitle sx={{ color: '#34393C', fontWeight: 700, fontSize: '20px' }}>알림</DialogTitle>
            <DialogContent sx={{ minWidth: '310px', maxWidth: '400px', m: '0 auto', p: 0}}>
                <Grid sx={{ p: 3, pt: 0 }} container direction='column' justifyContent='center' alignItems='center'>
                    <Grid sx={{ pt: 4, pb: 4 }} item>
                        <Typography sx={{ color: '#000000', whiteSpace: 'pre-line' }} align='center'>
                            {errorText}
                        </Typography>
                    </Grid>
                    <Grid sx={{ pt: 4, width: '100%' }} item>
                        <Button
                            sx={{ borderRadius: '12px', fontSize: '18px', color: '#55606E', background: '#F2F4F6', '&:hover': { background: '#F2F4F6' } }}
                            disableElevation
                            fullWidth
                            variant='contained'
                            onClick={() => {
                                navigate('/sign-in');
                                onClose();
                            }}>
                            확인
                        </Button>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    );
}
