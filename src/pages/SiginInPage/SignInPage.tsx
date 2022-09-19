import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Box, Grid, Typography } from '@mui/material';
import GoogleLogin from '../../components/GoogleLogin';
import Message from './Message';
import RealTime from './RealTime';
import { setUser } from '../../slices/user';
import { postSignIn, getUserInfo } from '../../apis/clock';
import useNetworkCheck from '../../hooks/useNeteworkCheck';
import { CredentialResponse } from 'google-one-tap';

export default function SignInPage() {
    const [error, setError] = useState<unknown>();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    useNetworkCheck();

    const handleSignIn = async (response: CredentialResponse) => {
        const { credential } = response;

        try {
            await postSignIn(credential);
            const user = (await getUserInfo()).data;
            dispatch(setUser(user));
            navigate('/main');
        } catch (error) {
            setError({ error, from: 'sign-in' });
        }
    };

    if (error) throw error;

    return (
        <Box>
            <Box sx={{ position: 'absolute', inset: '0', height: '500px', background: '#2C57E5', pointerEvents: 'none' }}></Box>
            <Box sx={{ position: 'relative', pt: 15 }}>
                <RealTime />
            </Box>
            <Box sx={{ position: 'relative' }}>
                <Message />
            </Box>
            <Box sx={{ position: 'relative', pt: 22.5 }}>
                <Grid container direction='column' alignItems='center'>
                    <GoogleLogin client_id={process.env.REACT_APP_GOOGLE_CLIENT_ID!} callback={handleSignIn} />
                    <Typography sx={{ pt: 2, fontSize: '14px', color: (theme) => theme.signIn.gray }}>로그인 후 타임로그 확인이 가능합니다.</Typography>
                </Grid>
            </Box>
        </Box>
    );
}
