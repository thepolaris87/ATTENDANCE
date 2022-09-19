import { Box } from '@mui/system';
import DateFilter from './DateFilter';
import ListFilter from './ListFilter';

export default function Filter() {
    return (
        <Box>
            <DateFilter />
            <ListFilter />
        </Box>
    );
}
