import { useEffect, useMemo, useState } from 'react';

import Loading from '../../../components/Loading';
import Modal from '../../../components/Modal';
import TableList from '../../../components/TableList';
import { SORTLIST } from '../../../components/TableList/TableList';
import ConfirmModification from './ConfirmModification';

import { useDispatch, useSelector } from 'react-redux';
import { selectManager, setAverage, setFilterList } from '../../../slices/manager';

import { useQuery } from 'react-query';
import { useInView } from 'react-intersection-observer';
import { getGroupHistory } from '../../../apis/clock';
import { getUniqueArray, isWorkDay } from '../../../utils/util';
import { HISTORY, GROUPHISTORY } from '../../../apis/types';
import { getAverageWorkTime, getCompletion, parseDateTime } from '../../../utils/date';

export default function Table() {
    const { filter, filterList } = useSelector(selectManager);
    const { departmentCode1, departmentCode2, startDate, endDate } = filter;
    const { data, isLoading, error } = useQuery(
        ['totalGruopHistory', departmentCode1, departmentCode2, startDate, endDate],
        () => getGroupHistory({ departmentCode1, departmentCode2, startDate, endDate }),
        { enabled: !!(departmentCode1 && departmentCode2 && startDate && endDate) }
    );
    const [currentIndex, setCurrentIndex] = useState(1);
    const { ref, inView } = useInView();

    const [confirmValue, setConfirmValue] = useState<HISTORY & Partial<GROUPHISTORY>>();
    const [openRequest, setOpenRequest] = useState(false);
    const [sort, setSort] = useState<{ key: SORTLIST; current: number }[]>([]);
    const dispatch = useDispatch();

    const filteredList = useMemo(() => {
        if (data) {
            return data.list.filter(
                ({ departmentName, displayName }) => (filter.team === '전체' || departmentName === filter.team) && (filter.name === '전체' || displayName === filter.name)
            );
        }
    }, [data, filter.team, filter.name]);

    const sortedList = useMemo(() => {
        if (filteredList) {
            const copy = filteredList.concat();

            sort.forEach(({ key, current }) => {
                copy.sort((a, b) => {
                    let result = 0;

                    if (current === 2) return result;

                    if (key === 'completionRatio') {
                        let _a = isWorkDay(a.attendanceDate) ? getCompletion({ checkIn: a.clockIn, dayOffCode: a.dayOffCode, companyCode: a.companyCode }) : a.completionRatio;
                        let _b = isWorkDay(b.attendanceDate) ? getCompletion({ checkIn: b.clockIn, dayOffCode: b.dayOffCode, companyCode: b.companyCode }) : b.completionRatio;
                        if (!_a && _b) return 1;
                        if (_a && !_b) return -1;
                        if (!_a || !_b) return 0;
                        if (_a! > _b!) result = current === 0 ? 1 : -1;
                        if (_a! < _b!) result = current === 0 ? -1 : 1;

                        return result;
                    }

                    if (key === 'clockIn' || key === 'clockOut') {
                        if (!a[key] && b[key]) return 1;
                        if (a[key] && !b[key]) return -1;
                        if (!a[key] || !b[key]) return 0;
                        if (parseDateTime(a[key]!).time > parseDateTime(b[key]!).time) result = current === 0 ? 1 : -1;
                        if (parseDateTime(a[key]!).time < parseDateTime(b[key]!).time) result = current === 0 ? -1 : 1;
                        return result;
                    }

                    if (a[key]! > b[key]!) result = current === 0 ? 1 : -1;
                    if (a[key]! < b[key]!) result = current === 0 ? -1 : 1;

                    return result;
                });
            });

            return copy;
        }
    }, [filteredList, sort]);

    const viewList = useMemo(() => {
        if (sortedList) {
            return sortedList.slice(0, 30 * currentIndex);
        }
    }, [sortedList, currentIndex]);

    const onListClick = (e: HISTORY & Partial<GROUPHISTORY>) => {
        setConfirmValue(e);
        setOpenRequest(true);
    };

    const onSortClick = ({ type, current }: { type: SORTLIST; current: number }) => {
        setSort([{ key: type, current }]);
    };

    useEffect(() => {
        if (data) {
            const departments = !filterList.departments && data.list && ['전체'].concat(getUniqueArray(data.list.map((el) => el.departmentName)));
            const names = !filterList.names && data.list && ['전체'].concat(getUniqueArray(data.list.map((el) => el.displayName)));
            departments && names && dispatch(setFilterList({ departments, names }));
        }
    }, [dispatch, filterList.departments, filterList.names, data]);

    useEffect(() => {
        if (data && filteredList) {
            const filteredTeam = data.list.filter(({ departmentName }) => filter.team === '전체' || departmentName === filter.team);
            const averageData = data.list.filter(
                ({ departmentName, displayName }) => (filter.team === '전체' || departmentName === filter.team) && (filter.name === '전체' || displayName === filter.name)
            );
            const { averageTime, rate } = getAverageWorkTime(averageData);
            dispatch(setFilterList({ names: ['전체'].concat(getUniqueArray(filteredTeam.map(({ displayName }) => displayName))) }));
            dispatch(setAverage({ averageTime, rate, standardWorkDayCount: data.standardWorkDayCount }));
        }
    }, [dispatch, filteredList, filter.team, filter.name, data]);

    useEffect(() => {
        if (inView) {
            setCurrentIndex((prev) => (prev += 1));
        }
    }, [inView]);

    if (error) throw error;
    if (isLoading) return <Loading />;
    if (!viewList || !filterList.departments || !filterList.names) return null;

    return (
        <>
            <TableList name history={viewList.map((el) => ({ ...el, disabled: typeof el.modificationStatusCode !== 'string' }))} onClick={onListClick} sort={onSortClick} />
            <div ref={ref} style={{ padding: '4px' }}></div>
            <Modal open={openRequest} onClose={() => setOpenRequest(false)}>
                <ConfirmModification confirmValue={confirmValue!} onClose={() => setOpenRequest(false)}></ConfirmModification>
            </Modal>
        </>
    );
}
