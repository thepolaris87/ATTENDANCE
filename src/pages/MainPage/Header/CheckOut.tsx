import { useState } from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';
import Modal from '../../../components/Modal';
import useUserInfo from '../../../hooks/useUserInfo';
import { createDateFormat, NOW } from '../../../utils/date';
import { postCheckOut } from '../../../apis/clock';
import { useMutation, useQueryClient } from 'react-query';
import { useDispatch } from 'react-redux';
import { updateCheckOut } from '../../../slices/main';

export default function CheckOut() {
    const { userInfo } = useUserInfo();
    const { info, extraInfo } = userInfo;
    const [openCheckOutModal, setOpenCheckOutModal] = useState(false);
    const queryClient = useQueryClient();
    const dispatch = useDispatch();
    const { mutate, error } = useMutation(() => postCheckOut(info![0].dayOffCode), {
        onSuccess: () => {
            queryClient.refetchQueries('history', { active: true });
            dispatch(updateCheckOut(true));
        }
    });

    const isFullTime = Number(extraInfo.realtimeCompletion) >= 100;

    const onClick = () => {
        const isFullWork = extraInfo.standardCheckOut && NOW() > createDateFormat(extraInfo.standardCheckOut);
        if (!isFullWork) setOpenCheckOutModal(true);
        else mutate();
    };

    if (error) throw error;

    return (
        <>
            <Grid sx={{ pb: 0.2 }} container justifyContent='center'>
                <Button
                    className={isFullTime && extraInfo.currentState !== 'off' ? 'checkout-animation' : ''}
                    sx={{                        
                        width: '100px',
                        height: '44px',
                        borderRadius: '8px',
                        background: isFullTime && extraInfo.currentState !== 'off' ? '#fff' : '#efeded',
                        '&:hover': { background: isFullTime && extraInfo.currentState !== 'off' ? '#fff' : '#efeded' },
                        color: '#696969',
                        fontWeight: 500
                    }}
                    disableElevation
                    variant={isFullTime && extraInfo.currentState !== 'off' ? 'outlined' : 'contained'}
                    onClick={onClick}>
                    <span style={{ paddingTop: '0.2rem' }}>퇴근</span>
                </Button>
            </Grid>
            <Modal open={openCheckOutModal} title='퇴근 확인'>
                <Box>
                    <Box sx={{ pt: 3 }}>
                        <Typography align='center'>근무 시간을 완료하지 못했습니다.</Typography>
                        <Typography align='center'>퇴근하시겠습니까?</Typography>
                    </Box>
                    <Box sx={{ pt: 8 }}>
                        <Grid container>
                            <Button
                                sx={{
                                    borderRadius: '8px',
                                    flex: '1',
                                    mr: 0.5,
                                    background: '#ffffff',
                                    '&:hover': { background: '#ffffff' },
                                    color: '#55606E',
                                    border: '1px solid #EAEAEA'
                                }}
                                disableElevation
                                variant='contained'
                                onClick={() => setOpenCheckOutModal(false)}>
                                취소
                            </Button>
                            <Button
                                sx={{ borderRadius: '8px', flex: '1', ml: 0.5, background: '#55606E', '&:hover': { background: '#55606E' }, color: '#FFFFFF' }}
                                disableElevation
                                variant='contained'
                                onClick={() => {
                                    mutate();
                                    setOpenCheckOutModal(false);
                                }}>
                                확인
                            </Button>
                        </Grid>
                    </Box>
                </Box>
            </Modal>
        </>
    );
}
