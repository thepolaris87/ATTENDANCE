import { Grid, Typography, Box } from '@mui/material';
import { ReactComponent as GroupIcon } from '../../../aseets/images/group.svg';
import CheckOut from './CheckOut';

import useUserInfo from '../../../hooks/useUserInfo';
import { useNavigate } from 'react-router-dom';
import { haveDutyCode } from '../../../utils/util';

export default function Header() {
    const { userInfo } = useUserInfo();
    const { info, extraInfo } = userInfo;
    const navigate = useNavigate();
    const { displayName, companyName } = info![0];
    const isShowIcon = haveDutyCode(info!, ['TJ', 'PJ']);

    const onIconClick = () => {
        navigate('/manager');
    };

    return (
        <Box sx={{ position: 'relative' }}>
            <Grid
                sx={{ height: '46px', width: 'fit-content', cursor: isShowIcon ? 'pointer' : 'initial' }}
                container
                alignItems='center'
                onClick={() => isShowIcon && onIconClick()}>
                <Grid sx={{ pt: 1 }} item>
                    <Typography sx={{ color: '#8C9195' }}>{companyName}</Typography>
                </Grid>
                {isShowIcon && (
                    <Grid sx={{ mt: 1, ml: 1 }} item>
                        <GroupIcon />
                    </Grid>
                )}
            </Grid>
            <Typography sx={{ fontWeight: 700, fontSize: '24px' }} component='span'>
                {displayName}
            </Typography>
            <Typography sx={{ fontSize: '24px' }} component='span'>
                님!
            </Typography>
            <Grid sx={{ mt: -0.5 }} container justifyContent='space-between' alignItems='flex-end' wrap='nowrap'>
                <Grid sx={{ flex: '1' }} item>
                    <Typography sx={{ fontSize: '24px' }}>{extraInfo.checkOut ? '수고하셨습니다.' : '좋은 하루 되세요.'}</Typography>
                </Grid>
                <Grid item>{info![0].dayOffCode !== '01' && <CheckOut />}</Grid>
            </Grid>
        </Box>
    );
}
