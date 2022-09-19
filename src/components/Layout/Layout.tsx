import { ReactNode } from 'react';
import { Box, Container } from '@mui/material';

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <>
            <Container
                sx={{
                    position: 'relative',
                    background: '#fff',
                    width: '100%',
                    minHeight: '100vh',
                    minWidth: '375px !important',
                    maxWidth: '444px !important'
                }}>
                {children}
            </Container>
            <Box sx={{ position: 'fixed', inset: '0', background: '#efefef', zIndex: '-1' }}></Box>
        </>
    );
}
