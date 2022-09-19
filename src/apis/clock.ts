import axios, { AxiosResponse } from 'axios';
import { setAccessToken } from '../utils/util';
import { getConfigure } from './util';
import type * as CLOCK from './types';

const clockClient = axios.create({ baseURL: `https://${process.env.REACT_APP_CLOCK_HOST}` });

const createGetRequest = (url: string) => clockClient.get(url, getConfigure('GET'));
const createPostRequest = (url: string, body?: any) => clockClient.post(url, body, getConfigure('POST'));
const createDeleteRequest = (url: string) => clockClient.delete(url, getConfigure('DELETE'));
// const createPatchRequest = (url: string, body?: any) => clockClient.patch(url, body, getConfigure('PATCH'));

// 사용자 네트워크 확인
export const postNetworkCheck = () => createPostRequest('/user/network-check').then((r) => r.status);

// 로그인 요청
export const postSignIn = (googleToken: string) => createPostRequest('/user/sign-in', { googleToken }).then(({ data }) => setAccessToken(data.token));

// 출근 기록 요청
export const postCheckIn = () => createPostRequest('/attendance/clock-in').then((r) => r.status);

// 퇴근 기록 요청
export const postCheckOut = (dayOffCode?: CLOCK.USERINFO['dayOffCode']) => createPostRequest('/attendance/clock-out', { dayOffCode });

// 유저 정보 조회
export const getUserInfo = (): Promise<AxiosResponse<CLOCK.USERINFO[]>> => createGetRequest('/user/info');

// 월별 출/퇴근 조회
export const getMonthlyHistory = (date: string): Promise<CLOCK.HISTORY[]> => createGetRequest(`/attendance/history/${date}`).then((r) => r.data);

// 출/퇴근 수정 요청
export const postAttendanceModification = ({
    attendanceDate,
    modificationHours,
    modificationReason
}: {
    attendanceDate: CLOCK.HISTORY['attendanceDate'];
    modificationHours: CLOCK.HISTORY['modificationHours'];
    modificationReason: CLOCK.HISTORY['modificationReason'];
}) => createPostRequest(`/attendance/modification/${attendanceDate}`, { modificationHours, modificationReason });

// 출/퇴근 수정 삭제
export const deleteAttendanceModification = ({ attendanceDate }: { attendanceDate: CLOCK.HISTORY['attendanceDate'] }) => createDeleteRequest(`/attendance/modification/${attendanceDate}`);

// 관리자 조직별 출퇴근 리스트 조회
export const getGroupHistory = ({
    departmentCode1,
    departmentCode2,
    startDate,
    endDate
}: {
    departmentCode1?: CLOCK.USERINFO['departmentCode1'];
    departmentCode2?: CLOCK.USERINFO['departmentCode2'];
    startDate?: string;
    endDate?: string;
}): Promise<{ standardWorkDayCount: number; list: CLOCK.GROUPHISTORY[] }> => createGetRequest(`/manager/group/list/${departmentCode1}/${departmentCode2}/${startDate}/${endDate}`).then((r) => r.data);

// 관리자 수정요청 리스트 조회
export const getModificationList = ({ departmentCodes }: { departmentCodes: CLOCK.USERINFO['departmentCode1'][] }): Promise<Omit<CLOCK.GROUPHISTORY, 'dayOffCode'>[]> =>
    createGetRequest(`/manager/modification/list/${departmentCodes.toString()}`).then((r) => r.data);

// 관리자 수정상태 변경
export const postModificationStatus = ({
    companyCode,
    employeeId,
    attendanceDate,
    modificationStatusCode
}: {
    companyCode: CLOCK.GROUPHISTORY['companyCode'];
    employeeId: CLOCK.GROUPHISTORY['employeeId'];
    attendanceDate: CLOCK.GROUPHISTORY['attendanceDate'];
    modificationStatusCode: CLOCK.GROUPHISTORY['modificationStatusCode'];
}) =>
    createPostRequest('/manager/modification/status', {
        companyCode,
        employeeId,
        attendanceDate,
        modificationStatusCode
    });
