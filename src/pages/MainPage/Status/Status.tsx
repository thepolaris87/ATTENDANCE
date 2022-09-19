import { Grid } from '@mui/material';
import CircularCompletionRate from '../../../components/CircularCompletionRate';
import StatusText from './StatusText';

import CheckIn from './CheckIn';

import useUserInfo from '../../../hooks/useUserInfo';

export default function Status() {
    const { userInfo } = useUserInfo();
    const { info, extraInfo } = userInfo;

    if (!info) return null;

    return (
        <Grid sx={{ position: 'relative', pointerEvents: 'none' }} container justifyContent='center'>
            <CircularCompletionRate
                key={extraInfo.currentState}
                value={extraInfo.completion || extraInfo.realtimeCompletion || 0}
                size={305}
                outerSize={322.5}
                innerSize={295}
                thickness={1.8}
                pointer={extraInfo.currentState === 'off' ? false : true}
                primaryBlur
                whiteBackground
                strokeDashArray
                boxShadow
            />
            <StatusText />
            {extraInfo.checkIn && <CheckIn completionRatio={extraInfo.realtimeCompletion || 0} />}
        </Grid>
    );
}
