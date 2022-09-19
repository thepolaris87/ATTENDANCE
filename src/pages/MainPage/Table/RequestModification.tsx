import { useState, ChangeEvent } from 'react';
import { Box, Divider, Grid, Typography } from '@mui/material';
import RequestModificationForm from '../../../components/RequestModificationForm';
import { ReactComponent as ModificationStatus1 } from '../../../aseets/images/modificationStatus1.svg';
import { ReactComponent as ModificationStatus2 } from '../../../aseets/images/modificationStatus2.svg';
import { ReactComponent as ModificationStatus9 } from '../../../aseets/images/modificationStatus9.svg';

import { useMutation, useQueryClient } from 'react-query';
import { deleteAttendanceModification, postAttendanceModification } from '../../../apis/clock';

import { HISTORY } from '../../../apis/types';
import { isHalfDay } from '../../../utils/util';

export default function RequestModification({ requestValue, onClose }: { requestValue: HISTORY & { inAMonth: boolean }; onClose?: () => void }) {
    const { attendanceDate, clockIn, clockOut, completionRatio, modificationReason, dayOffCode, modificationStatusCode, inAMonth } = requestValue;
    const [reasonValue, setReasonValue] = useState(modificationReason || '');
    const queryClient = useQueryClient();
    const [errorText, setErrorText] = useState(false);

    const { mutate: requestMutate } = useMutation(postAttendanceModification, {
        onSuccess: () => queryClient.refetchQueries('history', { active: true })
    });
    const { mutate: cancleMutate } = useMutation(deleteAttendanceModification, {
        onSuccess: () => queryClient.refetchQueries('history', { active: true })
    });

    const readonly = modificationStatusCode === '1' || modificationStatusCode === '2';

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        setReasonValue(e.target.value);
        if (errorText) setErrorText(false);
    };

    const onModificationRequestClick = () => {
        if (reasonValue.length !== 0) {
            const modificationHours = isHalfDay(dayOffCode) ? 4 : 8;
            const modificationReason = reasonValue;
            requestMutate({ attendanceDate, modificationHours, modificationReason });
            onClose?.();
        } else {
            setErrorText(true);
        }
    };

    const onModificationCancleClick = () => {
        cancleMutate({ attendanceDate });
        onClose?.();
    };

    return (
        <Box>
            {!inAMonth && (!modificationStatusCode || modificationStatusCode === '9') ? (
                <RequestModificationForm sx={{ position: 'relative', width: '350px' }}>
                    <Typography sx={{ fontWeight: '700', fontSize: '20px', color: '#34393C', pb: 2 }}>요청 내역</Typography>
                    <Grid container direction='column' justifyContent='center' alignItems='center'>
                        <Grid sx={{ pt: 4, pb: 4 }} item>
                            <Typography sx={{ color: '#000000', whiteSpace: 'pre-line' }} align='center'>
                                {`상태 수정은 최근 1달 이내의\n기록만 가능합니다.`}
                            </Typography>
                        </Grid>
                        <Grid sx={{ pt: 4, width: '100%' }} item>
                            <RequestModificationForm.Button sx={{ color: '#55606E', background: '#F2F4F6', '&:hover': { background: '#F2F4F6' } }} onClick={onClose}>
                                확인
                            </RequestModificationForm.Button>
                        </Grid>
                    </Grid>
                </RequestModificationForm>
            ) : (
                <RequestModificationForm sx={{ position: 'relative' }}>
                    <RequestModificationForm.Header attendanceDate={attendanceDate} clockIn={clockIn} clockOut={clockOut} onClose={onClose} />
                    <Divider sx={{ mt: 1, mb: 1, background: '#F7F7F7' }} />
                    <RequestModificationForm.RequestArea
                        completionRatio={completionRatio}
                        modificationStatusCode={modificationStatusCode}
                        readonly={readonly}
                        value={reasonValue}
                        onChange={onChange}
                        isError={errorText}
                    />
                    <Typography sx={{ color: '#F40C1A', fontSize: '12px', pt: 1, opacity: Number(errorText) }}>입력해 주세요.</Typography>
                    {modificationStatusCode && (
                        <Box sx={{ position: 'absolute', left: '72.5px', top: '3px', p: '2px 8px', borderRadius: '4px' }}>
                            {modificationStatusCode === '1' && <ModificationStatus1 />}
                            {modificationStatusCode === '2' && <ModificationStatus2 />}
                            {modificationStatusCode === '9' && <ModificationStatus9 />}
                        </Box>
                    )}
                    <Box>
                        <Grid sx={{ pt: 2 }} container justifyContent='center'>
                            {modificationStatusCode === '1' && <RequestModificationForm.Button onClick={onModificationCancleClick}>요청 취소</RequestModificationForm.Button>}
                            {modificationStatusCode === '2' && <RequestModificationForm.Button onClick={onClose}>확인</RequestModificationForm.Button>}
                            {!readonly && (
                                <RequestModificationForm.Button onClick={onModificationRequestClick}>
                                    {modificationStatusCode === '9' ? '재수정' : '수정 요청'}
                                </RequestModificationForm.Button>
                            )}
                        </Grid>
                    </Box>
                </RequestModificationForm>
            )}
        </Box>
    );
}
