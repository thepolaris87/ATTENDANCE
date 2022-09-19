import { Box, Button, Grid, IconButton, SxProps, TextField, Theme, Typography } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { ReactComponent as CloseIcon } from '../../aseets/images/close.svg';
import CircularCompletionRate from '../CircularCompletionRate';

import { HISTORY } from '../../apis/types';

export default function RequestModificationForm({ children, sx }: { children?: React.ReactNode; sx?: SxProps<Theme> }) {
    return <Box sx={{ minWidth: '280px', maxWidth: '440px', width: '100%', boxSizing: 'border-box', ...sx }}>{children}</Box>;
}

RequestModificationForm.Header = ({
    attendanceDate,
    clockIn,
    clockOut,
    onClose
}: {
    attendanceDate: HISTORY['attendanceDate'];
    clockIn: HISTORY['clockIn'];
    clockOut: HISTORY['clockOut'];
    onClose: (() => void) | undefined;
}) => {
    return (
        <Box>
            <Grid sx={{ pb: 2 }} container justifyContent='space-between' alignItems='center'>
                <Typography sx={{ fontWeight: '700', fontSize: '20px', color: '#34393C' }}>요청 내역</Typography>
                {onClose && (
                    <IconButton sx={{ position: 'relative', left: '8px' }} onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                )}
            </Grid>
            <Grid container>
                <Grid sx={{ minWidth: '120px', m: '4px 0' }} item>
                    <Grid container alignItems='center' wrap='nowrap'>
                        <Grid sx={{ background: '#F8F8F8', borderRadius: '16px', width: '40px', pt: 0.5, pb: 0.2, pr: 0.7, pl: 0.7, mr: 0.5 }} item>
                            <Typography sx={{ color: '#A3A5A5', fontWeight: 500, fontSize: '12px' }} align='center'>
                                날짜
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Typography sx={{ color: '#A3A5A5', fontSize: '14px', wordBreak: 'keep-all' }}>{attendanceDate.slice(5)}</Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid sx={{ m: '4px 0' }} item>
                    <Grid container alignItems='center' wrap='nowrap'>
                        <Grid sx={{ background: '#F8F8F8', borderRadius: '16px', width: '50px', pt: 0.5, pb: 0.2, pr: 0.7, pl: 0.7, mr: 0.5 }} item>
                            <Typography sx={{ color: '#A3A5A5', fontWeight: 500, fontSize: '12px', wordBreak: 'keep-all' }} align='center'>
                                출퇴근
                            </Typography>
                        </Grid>
                        <Grid item>
                            {(clockIn || clockOut) && (
                                <Typography sx={{ color: '#A3A5A5', fontSize: '14px', whiteSpace: 'nowrap' }}>
                                    {clockIn && clockIn.split(' ')[1]} ~ {clockOut && clockOut.split(' ')[1]}
                                </Typography>
                            )}
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
};

RequestModificationForm.CompletionRatio = ({ completionRatio, workTime }: { completionRatio: number | null; workTime: { h: string; m: string; s: string } }) => {
    return (
        <Box>
            <Grid sx={{ pt: 1, mb: 1.5, position: 'relative' }} container justifyContent='center' alignItems='center'>
                <CircularCompletionRate value={completionRatio || 0} size={120} />
                <Grid sx={{ position: 'absolute', inset: '0' }} container justifyContent='center' alignItems='center'>
                    <Typography sx={{ mt: '0.5rem', ml: '0.5rem', fontSize: '2rem' }} align='center'>
                        {completionRatio || 0}
                        <Typography component='span'>%</Typography>
                    </Typography>
                </Grid>
                <Grid sx={{ position: 'absolute', bottom: '0', right: '0' }} direction='column' container justifyContent='center' alignItems='flex-end'>
                    <Grid item>
                        <Typography>근무시간</Typography>
                        <Typography>
                            {workTime.h}:{workTime.m}:
                            <Typography sx={{ color: (theme) => theme.JEI.lightgray }} component='span'>
                                {workTime.s}
                            </Typography>
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
};

RequestModificationForm.RequestArea = ({
    completionRatio,
    modificationStatusCode,
    readonly,
    value,
    isError,
    onChange
}: {
    completionRatio: number | null;
    modificationStatusCode?: HISTORY['modificationStatusCode'];
    readonly: boolean;
    value: string;
    isError?: boolean;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
}) => {
    return (
        <Box>
            <Grid sx={{ pt: 1, pb: 1 }} container alignItems='center'>
                <Grid sx={{ width: '100px' }} item>
                    <Typography sx={{ pt: 0.5, color: '#34393C' }}>상태 변경</Typography>
                </Grid>
                <Grid item>
                    <Grid container alignItems='center' wrap='nowrap'>
                        {Number(completionRatio) < 100 && (
                            <>
                                <Typography sx={{ pt: 0.5, color: '#34393C' }} component='span'>
                                    {Number(completionRatio) < 100 && `${completionRatio || 0}%`}
                                </Typography>
                                <ChevronRightIcon sx={{ color: modificationStatusCode === '1' ? '#FF0F2A' : '#2C57E5', mr: 1, ml: 1 }} />
                            </>
                        )}
                        <Typography sx={{ pt: 0.5, color: modificationStatusCode === '1' ? '#FF0F2A' : '#2C57E5' }} component='span'>
                            100%
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
            <Typography sx={{ color: '#34393C', pt: 1, pb: 0.5 }}>변경 사유</Typography>
            <TextField
                sx={{ width: '100%', borderRadius: '4px', background: readonly ? '#F4F4F4' : '#FCFCFC', '& fieldset': readonly ? { borderStyle: 'none' } : {} }}
                inputProps={{ sx: { color: readonly ? '#B7B7B7' : '#777777' } }}
                multiline
                rows={3}
                disabled={readonly}
                error={isError}
                onChange={onChange}
                value={value}
                placeholder='변경 사유를 입력해 주세요.'
            />
        </Box>
    );
};

RequestModificationForm.Button = ({ onClick, children, sx }: { onClick?: () => void; children?: React.ReactNode; sx?: SxProps<Theme> }) => {
    return (
        <Button
            sx={{ borderRadius: '12px', background: '#55606E', '&:hover': { background: '#55606E' }, fontSize: '18px', ...sx }}
            disableElevation
            fullWidth
            variant='contained'
            onClick={onClick}>
            <span style={{ paddingTop: '0.2rem' }}>{children}</span>
        </Button>
    );
};
