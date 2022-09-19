import { FormControl, Grid, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useDispatch, useSelector } from 'react-redux';
import { selectManager, setFilter } from '../../../slices/manager';

export default function ListFilter() {
    const { filterList, filter } = useSelector(selectManager);
    const dispatch = useDispatch();

    const onDepartmentsFilterClick = (e: SelectChangeEvent) => {
        dispatch(setFilter({ team: e.target.value, name: '전체' }));
    };

    const onNameFilterClick = (e: SelectChangeEvent) => {
        dispatch(setFilter({ name: e.target.value }));
    };

    if (!filterList.departments || !filterList.names) return null;

    return (
        <Grid sx={{ pt: 2, pb: 1 }} container justifyContent='space-between'>
            {filterList.departments.length > 2 && (
                <FormControl sx={{ pr: 2, fieldset: { display: 'none' } }}>
                    <Typography sx={{ margin: '0', fontSize: '12px', color: 'darkgray' }}>팀/파트</Typography>
                    <Select
                        sx={{
                            width: '150px',
                            background: '#fff',
                            borderBottom: '1px solid darkgray',
                            borderRadius: '0',
                            '&:hover': { background: '#F1F1F1' }
                        }}
                        inputProps={{ sx: { p: 1 } }}
                        IconComponent={({ className }) => <ExpandMoreIcon sx={{ fill: '#999' }} className={className} />}
                        value={filter.team}
                        onChange={onDepartmentsFilterClick}>
                        {filterList.departments.map((el) => (
                            <MenuItem key={el} value={el}>
                                {el}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            )}
            <FormControl sx={{ pr: 2, fieldset: { display: 'none' } }}>
                <Typography sx={{ margin: '0', fontSize: '12px', color: 'darkgray' }}>이름</Typography>
                <Select
                    sx={{
                        width: '150px',
                        background: '#fff',
                        borderBottom: '1px solid darkgray',
                        borderRadius: '0',
                        '&:hover': { background: '#F1F1F1' }
                    }}
                    inputProps={{ sx: { p: 1 } }}
                    IconComponent={({ className }) => <ExpandMoreIcon sx={{ fill: '#999' }} className={className} />}
                    value={filter.name}
                    onChange={onNameFilterClick}>
                    {filterList.names.map((el) => (
                        <MenuItem key={el} value={el}>
                            {el}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Grid>
    );
}
