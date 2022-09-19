import { useEffect, useMemo } from 'react';

import { Box } from '@mui/material';
import Header from './Header';
import Status from './Status';
import Table from './Table';
import Loading from '../../components/Loading';

import useUserInfo from '../../hooks/useUserInfo';
import useRealtimeStatus from './useRealtimeStatus';
import { useMutation } from 'react-query';
import { postCheckIn } from '../../apis/clock';

import { useNavigate } from 'react-router-dom';

export default function MainPage() {
    const { userInfo } = useUserInfo();
    const { data, mutate, error } = useMutation(postCheckIn);
    const positionCodes = useMemo(() => userInfo.info && userInfo.info.map(({ positionCode }) => positionCode.slice(0, 1)), [userInfo.info]);
    const isRedirect = useMemo(() => positionCodes && positionCodes.includes('A'), [positionCodes]);

    useRealtimeStatus(userInfo);

    // 리다이렉션
    const navigate = useNavigate();
    useEffect(() => {
        if (userInfo.info && positionCodes && isRedirect) navigate('/manager');
    }, [userInfo.info, navigate, positionCodes, isRedirect]);

    useEffect(() => {
        if (userInfo && userInfo.info && !data && positionCodes && !isRedirect && userInfo.info[0].dayOffCode !== '01') mutate();
    }, [userInfo, data, mutate, positionCodes, isRedirect]);

    if (error) throw error;

    if (!userInfo.info || (!data && userInfo.info[0].dayOffCode !== '01')) return <Loading />;

    return (
        <Box>
            <Box sx={{ position: 'absolute', inset: '0', height: '500px', background: '#FAFAFA', pointerEvents: 'none' }}></Box>
            <Box sx={{ pt: 2, pb: 2 }}>
                <Header />
            </Box>
            <Box sx={{ pb: 4 }}>
                <Status />
            </Box>
            <Box>
                <Table />
            </Box>
        </Box>
    );
}
