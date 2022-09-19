import { useState, useRef, useEffect } from 'react';
import { Box, Grid, Menu, MenuItem, Typography, IconButton } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import useUserInfo from '../../../hooks/useUserInfo';
import { useDispatch } from 'react-redux';
import { USERINFO } from '../../../apis/types';
import { setFilter, initFilterList } from '../../../slices/manager';

export default function TeamSelector() {
    const { userInfo } = useUserInfo();
    const [display, setDisplay] = useState(userInfo.info![0].departmentName);
    const [open, setOpen] = useState(false);
    const anchorEl = useRef();
    const dispatch = useDispatch();
    const isMenu = userInfo.info!.length > 1;

    const handleClick = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const onMenuClick = (e: USERINFO) => {
        const { departmentName: display, departmentCode1, departmentCode2 } = e;
        setDisplay(display);
        setOpen(false);
        dispatch(setFilter({ team: '전체', name: '전체', departmentCode1, departmentCode2 }));
        dispatch(initFilterList());
    };

    useEffect(() => {
        const { departmentCode1, departmentCode2 } = userInfo.info![0];
        dispatch(setFilter({ departmentCode1, departmentCode2 }));
    }, [dispatch, userInfo.info]);

    return (
        <Box ref={anchorEl}>
            <Grid container alignItems='center'>
                <Typography variant='h6' sx={{ pt: 0.2 }}>
                    {display}
                </Typography>
                {isMenu && <IconButton onClick={handleClick}>{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}</IconButton>}
            </Grid>
            {isMenu && (
                <Menu anchorEl={anchorEl.current} open={open} onClose={handleClose} anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}>
                    {userInfo.info?.map((el, i) => (
                        <MenuItem key={i} onClick={onMenuClick.bind(null, el)}>
                            {el.departmentName}
                        </MenuItem>
                    ))}
                </Menu>
            )}
        </Box>
    );
}
