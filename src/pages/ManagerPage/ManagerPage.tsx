import { useEffect } from 'react';
import { Box } from '@mui/material';
import Filter from './Filter';
import Header from './Header';
import Table from './Table';
import Average from './Average';

import useUserInfo from '../../hooks/useUserInfo';
import { useNavigate } from 'react-router-dom';
import { haveDutyCode } from '../../utils/util';
import { useSelector } from 'react-redux';
import { selectManager } from '../../slices/manager';

export default function ManagerPage() {
    const { userInfo } = useUserInfo();
    const { filter } = useSelector(selectManager);
    const { info } = userInfo;
    const navigate = useNavigate();

    useEffect(() => {
        if (info && haveDutyCode(info, ['00'])) navigate('/main');
    }, [navigate, info]);

    if (!info || haveDutyCode(info, ['00'])) return null;

    return (
        <Box>
            <Box>
                <Header />
            </Box>
            <Box sx={{ pt: 2 }}>
                <Filter />
            </Box>
            <Box>
                <Average />
            </Box>
            <Box key={filter.departmentCode1 + '-' + filter.departmentCode2 + '-' + filter.startDate + '-' + filter.endDate} sx={{ mt: 2 }}>
                <Table />
            </Box>
        </Box>
    );
}
