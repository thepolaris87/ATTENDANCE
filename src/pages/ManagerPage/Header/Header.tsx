import { useState } from 'react';

import { Badge, Grid, IconButton } from '@mui/material';
import TeamSelector from './TeamSelector';
import ModificationRequestList from './ModifictaionRequestList';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { ReactComponent as NotificatioIcon } from '../../../aseets/images/notification.svg';

import useUserInfo from '../../../hooks/useUserInfo';

import { isTJ, isPJ, haveDutyCode } from '../../../utils/util';
import { useQuery } from 'react-query';
import { getModificationList } from '../../../apis/clock';
import { USERINFO } from '../../../apis/types';

import { useNavigate } from 'react-router-dom';

export default function Header() {
    const { userInfo } = useUserInfo();
    const { info } = userInfo;
    const [openModReq, setOpenModReq] = useState(false);
    const navigate = useNavigate();
    const departmentCodes = info!.reduce((p, { departmentCode1 }) => {
        p.push(departmentCode1);
        return p;
    }, [] as USERINFO['departmentCode1'][]);
    const { data, error } = useQuery(['modificationList'], () => getModificationList({ departmentCodes }));

    const onBackClick = () => navigate('/main');

    if (error) throw error;
    if (!data) return null;

    return (
        <>
            <Grid sx={{ pt: 3 }} container justifyContent='space-between' alignItems='center' wrap='nowrap'>
                <Grid container alignItems='center'>
                    {(isTJ(info!) || isPJ(info!)) && (
                        <IconButton onClick={onBackClick}>
                            <ArrowBackIosIcon />
                        </IconButton>
                    )}
                    <TeamSelector />
                </Grid>
                {haveDutyCode(info!, ['TJ', 'DB', 'CB', 'DA']) && (
                    <Grid item>
                        <IconButton size='large' onClick={() => setOpenModReq(true)}>
                            <Badge
                                sx={{ color: '#fff' }}
                                componentsProps={{ badge: { style: { background: '#E30B17' } } }}
                                badgeContent={data.filter(({ modificationStatusCode }) => modificationStatusCode === '1').length}>
                                <NotificatioIcon />
                            </Badge>
                        </IconButton>
                    </Grid>
                )}
            </Grid>
            <ModificationRequestList open={openModReq} data={data} onClose={() => setOpenModReq(false)} />
        </>
    );
}
