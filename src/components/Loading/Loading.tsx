import { Container, Backdrop, CircularProgress, Grid, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';

export default function Loading() {
    const { pathname } = useLocation();
    const isPc = pathname.split('/')[0] === 'aaa';
    return (
        <>
            <Backdrop sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} open>
                <Container sx={{ position: 'relative', padding: '0 !important' }} maxWidth={!isPc && 'xs'}>
                    <Grid sx={{ position: 'absoulte', inset: '0', height: '100vh', background: '#fff', zIndex: (theme) => theme.zIndex.drawer + 2 }} container direction='column' alignItems='center' justifyContent='center'>
                        <CircularProgress sx={{ mb: 8, color: theme=> theme.JEI.darkgray }} size={80} />
                        <Typography color='#767676'>잠시만 기다려 주세요.</Typography>
                    </Grid>
                </Container>
            </Backdrop>
        </>
    );
}
