import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { IconButton, CircularProgress, Box } from '@mui/material';
import { getCircularCompletionValues } from '../../utils/util';

type CIRCULARCOMPLETIONRATE = {
    button?: boolean;
    value: number;
    size?: number;
    outerSize?: number;
    innerSize?: number;
    thickness?: number;
    pointer?: boolean;
    onClick?: (e: any) => void;
    onChange?: (values: number[]) => void;
    color?: { primary?: string; secondary?: string; background?: string };
    primaryBlur?: boolean;
    whiteBackground?: boolean;
    strokeDashArray?: boolean;
    boxShadow?: boolean;
};

const pointerColor = ['#C4D8FD', '#EBD0FF'];

export default function CircularCompletionRate({
    button,
    value,
    size = 40,
    outerSize = size,
    innerSize = size,
    thickness = 3.6,
    pointer,
    onClick,
    color = { primary: '#2C57E5', secondary: '#842AFD', background: '#ffffff' },
    primaryBlur,
    whiteBackground,
    onChange,
    strokeDashArray,
    boxShadow
}: CIRCULARCOMPLETIONRATE) {
    const values = useMemo(() => getCircularCompletionValues(value), [value]);
    const [transitionValue, setTransitionValue] = useState(values.map(() => 0));
    const ref = useRef<HTMLDivElement>();
    const pointerRef = useRef<SVGCircleElement>(null);

    const getPoint = (val: number) => {
        const radi = (-2 * Math.PI * val) / 100;
        const rx = 20.35 * Math.cos(radi + Math.PI / 2);
        const ry = -1 * 20.35 * Math.sin(radi + Math.PI / 2);
        return { rx, ry };
    };

    const onTransitionEnd = useCallback(
        (i: number) => {
            setTransitionValue((prev) => {
                const newVal = [...prev];
                if (!!values[i + 1]) {
                    newVal[i + 1] = values[i + 1];
                    if (ref.current && primaryBlur) {
                        const target = ref.current.getElementsByClassName(`circularProgress-${i}`)[0] as HTMLSpanElement;
                        if (target) target.style.opacity = '0.15';
                    }
                } else {
                    if (pointerRef.current) {
                        const pointerCircle = pointerRef.current.getElementsByTagName('circle')[0];
                        if (typeof prev[i] === 'number' && prev[i] % 100 !== 0) {
                            const { rx, ry } = getPoint(prev[i]);
                            pointerRef.current.setAttribute('transform', `matrix(1, 0, 0, 1, ${44 + rx}, ${44 + ry})`);
                            pointerRef.current.style.display = 'initial';
                        } else {
                            pointerRef.current.style.display = 'none';
                        }
                        pointerCircle.setAttribute('fill', pointerColor[(values.length + 1) % 2]);
                    }
                }
                return newVal;
            });
        },
        [values, primaryBlur]
    );

    useEffect(() => {
        onTransitionEnd(-1);
        onChange?.(values);
    }, [values, onTransitionEnd, onChange]);

    return (
        <Box ref={ref}>
            <IconButton sx={{ position: 'relative', p: 0, m: 1 }} disabled={!button} onClick={onClick}>
                {boxShadow && (
                    <span
                        style={{
                            position: 'absolute',
                            width: `${outerSize - 30}px`,
                            height: `${outerSize - 30}px`,
                            boxShadow: '0 0 12px #00000014',
                            background: 'tranparent',
                            borderRadius: '50%'
                        }}></span>
                )}

                <CircularProgress
                    sx={{ position: 'absolute', '& circle': { fill: !whiteBackground && value === 0 ? '#F1F1F1' : color.background } }}
                    value={0}
                    size={strokeDashArray ? outerSize : size}
                    variant='determinate'></CircularProgress>
                <CircularProgress
                    sx={{
                        '& circle': {
                            stroke: values.length > 1 ? '#ffffff' : strokeDashArray ? '#C8D3FA' : '#F1F1F1',
                            strokeDasharray: strokeDashArray ? '0.3 !important' : undefined,
                            strokeWidth: strokeDashArray ? '0.3px' : undefined
                        }
                    }}
                    value={100}
                    size={strokeDashArray ? size : innerSize}
                    variant='determinate'></CircularProgress>
                {pointer && (
                    <span style={{ position: 'absolute', width: `${size}px`, height: `${size}px` }} className='pointer'>
                        <svg viewBox={`22 22 44 44`}>
                            <g ref={pointerRef} style={{ display: 'none' }} transform='matrix(1, 0, 0, 1, 44, 44)'>
                                <circle className='pointer-animation' cx='0' cy='0' r={thickness * 0.9}></circle>
                            </g>
                        </svg>
                    </span>
                )}
                {transitionValue.map((el, i) => (
                    <CircularProgress
                        key={i}
                        className={`circularProgress-${i}`}
                        sx={{
                            position: 'absolute',
                            color: !!(i % 2) ? color.secondary : color.primary,
                            '& circle': {
                                strokeLinecap: 'round',
                                transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1) 300ms'
                            }
                        }}
                        value={el}
                        size={innerSize}
                        variant='determinate'
                        thickness={thickness}
                        onTransitionEnd={() => {
                            onTransitionEnd(i);
                        }}
                    />
                ))}
            </IconButton>
        </Box>
    );
}
