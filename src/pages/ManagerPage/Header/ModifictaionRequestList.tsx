import React, { useRef, useState } from 'react';
import { Backdrop, Box, Button, CircularProgress, Container, Divider, Grid, IconButton, Typography } from '@mui/material';
import Loading from '../../../components/Loading';
import CloseIcon from '@mui/icons-material/Close';
import { ReactComponent as Alarm } from '../../../aseets/images/alarm.svg';

import { useMutation, useQueryClient } from 'react-query';
import { postModificationStatus } from '../../../apis/clock';
import { GROUPHISTORY } from '../../../apis/types';

export default function ModificationRequestList({ data, open, onClose }: { data: Omit<GROUPHISTORY, 'dayOffCode'>[]; open: boolean; onClose: () => void }) {
    const container = useRef(null);
    const queryClient = useQueryClient();
    const [currentButton, setCurrentButton] = useState<{ index: number; modificationStatusCode: GROUPHISTORY['modificationStatusCode'] }>({
        index: 0,
        modificationStatusCode: '1'
    });
    const [isLoading, setIsLoading] = useState(false);
    const { mutate, error } = useMutation(postModificationStatus, {
        onSuccess: async () => {
            await queryClient.refetchQueries(['totalGruopHistory'], { active: true });
            await queryClient.refetchQueries(['modificationList'], { active: true });
            setIsLoading(false);
        }
    });

    const onRequestButtonClick = ({
        companyCode,
        employeeId,
        attendanceDate,
        modificationStatusCode,
        i: index
    }: {
        companyCode: GROUPHISTORY['companyCode'];
        employeeId: GROUPHISTORY['employeeId'];
        attendanceDate: GROUPHISTORY['attendanceDate'];
        modificationStatusCode: GROUPHISTORY['modificationStatusCode'];
        i: number;
    }) => {
        mutate({ companyCode, employeeId, attendanceDate, modificationStatusCode });
        setIsLoading(true);
        setCurrentButton({ index, modificationStatusCode });
    };

    if (error) throw error;
    if (!data) return <Loading />;

    return (
        <Container
            ref={container}
            sx={{
                position: 'fixed',
                inset: '0',
                pointerEvents: open ? 'auto' : 'none',
                zIndex: (theme) => theme.zIndex.drawer + 1,
                overflow: 'hidden',
                width: '100%',
                minWidth: '375px !important',
                maxWidth: '444px !important'
            }}>
            <Backdrop open={open} onClick={onClose}></Backdrop>
            <Box
                sx={{
                    background: '#fff',
                    transition: 'right 225ms cubic-bezier(0, 0, 0.2, 1) 0ms',
                    width: '90%',
                    height: '100vh',
                    overflow: 'scroll',
                    position: 'absolute',
                    right: open ? '0' : '-90%'
                }}>
                <Grid sx={{ height: '100%' }} container direction='column' wrap='nowrap'>
                    <Grid sx={{ pt: 3.25, pb: 0.5, pl: 1 }} item>
                        <IconButton onClick={onClose}>
                            <CloseIcon />
                        </IconButton>
                    </Grid>
                    <Grid sx={{ flex: '1' }} item>
                        {data.length === 0 && (
                            <Grid sx={{ height: '100%' }} container direction='column' justifyContent='center' alignItems='center'>
                                <Alarm />
                                <Typography sx={{ pt: 1, color: '#B2B2B2', fontSize: '18px' }}>요청 내역이 없습니다.</Typography>
                            </Grid>
                        )}
                        {data.length !== 0 &&
                            data.map(({ attendanceDate, displayName, modificationHours, modificationReason, modificationStatusCode, companyCode, employeeId }, i) => (
                                <React.Fragment key={i}>
                                    <Box sx={{ pt: 1.5, pr: 3, pl: 3, boxSizing: 'border-box' }}>
                                        <Grid container alignItems='center' justifyContent='space-between'>
                                            <Grid item>
                                                <Typography sx={{ color: '#000000', fontSize: '16px', fontWeight: 700 }}>{displayName}</Typography>
                                            </Grid>
                                            <Grid item>
                                                <Typography sx={{ fontSize: '14px', color: '#999999' }} component='span'>
                                                    {attendanceDate.slice(5)}
                                                </Typography>
                                                <Typography sx={{ p: 1, fontSize: '14px', color: '#999999' }} component='span'>
                                                    |
                                                </Typography>
                                                <Typography sx={{ fontSize: '14px', color: '#999999' }} component='span'>
                                                    {modificationHours}시간 완료
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                        <Grid sx={{ pt: 1, pb: 1 }} container wrap='nowrap'>
                                            {modificationStatusCode === '2' && (
                                                <Grid
                                                    sx={{
                                                        minWidth: 'fit-content',
                                                        height: '22px',
                                                        borderRadius: '4pt',
                                                        background: '#167FFB',
                                                        color: '#ffffff',
                                                        pt: 0.5,
                                                        pb: 0.3,
                                                        pr: 1,
                                                        pl: 1,
                                                        mr: 1,
                                                        mt: 0.1,
                                                        fontSize: '12px'
                                                    }}
                                                    item>
                                                    승인
                                                </Grid>
                                            )}
                                            {modificationStatusCode === '9' && (
                                                <Grid
                                                    sx={{
                                                        minWidth: 'fit-content',
                                                        height: '22px',
                                                        borderRadius: '4pt',
                                                        background: '#F40319',
                                                        color: '#ffffff',
                                                        pt: 0.5,
                                                        pb: 0.3,
                                                        pr: 1,
                                                        pl: 1,
                                                        mr: 1,
                                                        mt: 0.1,
                                                        fontSize: '12px'
                                                    }}
                                                    item>
                                                    반려
                                                </Grid>
                                            )}
                                            <Grid item>
                                                <Typography sx={{ workBreak: 'keep-all', fontSize: '14px', color: '#000000', pt: 0.3 }}>{modificationReason}</Typography>
                                            </Grid>
                                        </Grid>
                                        {modificationStatusCode === '1' && (
                                            <Grid container>
                                                <Button
                                                    sx={{
                                                        borderRadius: '6px',
                                                        flex: '1',
                                                        mr: 0.5,
                                                        height: '36.5px',
                                                        background: '#ffffff',
                                                        '&:hover': { background: '#ffffff' },
                                                        color: '#55606E',
                                                        pointerEvents: isLoading ? 'none' : 'auto',
                                                        border: '1px solid #EAEAEA'
                                                    }}
                                                    disableElevation
                                                    variant='contained'
                                                    onClick={() => onRequestButtonClick({ companyCode, employeeId, attendanceDate, modificationStatusCode: '9', i })}>
                                                    {currentButton.index === i && currentButton.modificationStatusCode === '9' && isLoading ? (
                                                        <CircularProgress size={20} />
                                                    ) : (
                                                        '반려'
                                                    )}
                                                </Button>
                                                <Button
                                                    sx={{
                                                        borderRadius: '6px',
                                                        flex: '1',
                                                        ml: 0.5,
                                                        height: '36.5px',
                                                        background: '#55606E',
                                                        '&:hover': { background: '#55606E' },
                                                        color: '#FFFFFF',
                                                        pointerEvents: isLoading ? 'none' : 'auto'
                                                    }}
                                                    disableElevation
                                                    variant='contained'
                                                    onClick={() => onRequestButtonClick({ companyCode, employeeId, attendanceDate, modificationStatusCode: '2', i })}>
                                                    {currentButton.index === i && currentButton.modificationStatusCode === '2' && isLoading ? (
                                                        <CircularProgress size={20} />
                                                    ) : (
                                                        '승인'
                                                    )}
                                                </Button>
                                            </Grid>
                                        )}
                                    </Box>
                                    <Divider sx={{ m: '0 16px', mt: 1 }} />
                                </React.Fragment>
                            ))}
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
}
