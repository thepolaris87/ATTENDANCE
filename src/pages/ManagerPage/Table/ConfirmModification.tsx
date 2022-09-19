import { Box, Divider } from '@mui/material';
import RequestModificationForm from '../../../components/RequestModificationForm';
import { ReactComponent as ModificationStatus1 } from '../../../aseets/images/modificationStatus1.svg';
import { ReactComponent as ModificationStatus2 } from '../../../aseets/images/modificationStatus2.svg';
import { ReactComponent as ModificationStatus9 } from '../../../aseets/images/modificationStatus9.svg';

import { GROUPHISTORY, HISTORY } from '../../../apis/types';

export default function ConfirmModification({ confirmValue, onClose }: { confirmValue: HISTORY & Partial<GROUPHISTORY>; onClose?: () => void }) {
    const { attendanceDate, clockIn, clockOut, completionRatio, modificationReason, modificationStatusCode } = confirmValue;

    const onOkClick = () => {
        onClose?.();
    };

    return (
        <Box>
            <RequestModificationForm sx={{ position: 'relative' }}>
                <RequestModificationForm.Header attendanceDate={attendanceDate} clockIn={clockIn} clockOut={clockOut} onClose={onClose} />
                <Divider sx={{ mt: 1, mb: 1, background: '#F7F7F7' }} />
                <RequestModificationForm.RequestArea completionRatio={completionRatio} readonly value={modificationReason || ''} />
                {modificationStatusCode && (
                    <Box sx={{ position: 'absolute', left: '72.5px', top: '3px', p: '2px 8px', borderRadius: '4px' }}>
                        {modificationStatusCode === '1' && <ModificationStatus1 />}
                        {modificationStatusCode === '2' && <ModificationStatus2 />}
                        {modificationStatusCode === '9' && <ModificationStatus9 />}
                    </Box>
                )}
                <RequestModificationForm.Button sx={{ mt: 2 }} onClick={onOkClick}>
                    확인
                </RequestModificationForm.Button>
            </RequestModificationForm>
        </Box>
    );
}
