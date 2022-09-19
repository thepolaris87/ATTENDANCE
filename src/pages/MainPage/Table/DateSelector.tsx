import { useRef, useState } from 'react';

import { Box, Grid, IconButton, Slide } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { differenceInCalendarMonths } from 'date-fns';

export default function DateSelector({ display, onArrowClick }: { display: string; onArrowClick: (index: number, from: string) => void }) {
    const wrapper = useRef();
    const [index, setIndex] = useState(0);
    const [direction, setDirection] = useState<'left' | 'right' | undefined>();

    const parseCurrent = display.split('-').map((el) => parseInt(el));
    const currentTime = new Date(parseCurrent[0], parseCurrent[1] - 1, 1);
    const startTime = new Date(2022, 6, 1);
    const isPast = differenceInCalendarMonths(currentTime, startTime) < 1;

    const onLeftArrowClick = () => {
        setDirection('right');
        setIndex((state) => (state -= 1));
        onArrowClick(index - 1, 'right');
    };
    const onRightArrowClick = () => {
        setDirection('left');
        setIndex((state) => (state += 1));
        onArrowClick(index + 1, 'right');
    };

    return (
        <Grid sx={{ pb: 1 }} container alignItems='center' justifyContent='space-between'>
            <Grid sx={{ width: '20%' }} container justifyContent='flex-end'>
                <IconButton disabled={isPast} onClick={onLeftArrowClick}>
                    <ChevronLeftIcon fontSize='large' />
                </IconButton>
            </Grid>
            <Grid sx={{ position: 'relative' }} item>
                <Box ref={wrapper}>
                    <Slide key={index} container={wrapper.current} direction={direction} in timeout={direction ? 250 : 0}>
                        <div style={{ width: 'fit-content', margin: '0 auto', paddingTop: '4px', fontSize: '20px', color: '#000000', fontWeight: 500 }}>{display}</div>
                    </Slide>
                </Box>
            </Grid>
            <Grid sx={{ width: '20%' }} container>
                <IconButton disabled={!Boolean(index)} onClick={onRightArrowClick}>
                    <ChevronRightIcon fontSize='large' />
                </IconButton>
            </Grid>
        </Grid>
    );
}
