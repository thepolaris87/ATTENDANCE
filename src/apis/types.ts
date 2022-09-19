/* CLOCK */
export type USERINFO = {
    companyCode: 'A' | 'B' | 'P';
    employeeId: string;
    email: string;
    displayName: string;
    companyName: string;
    departmentCode1: string;
    departmentCode2: string;
    departmentName: string;
    dutyCode: string;
    dutyName: string;
    positionCode: string;
    positionName: string;
    dayOffCode: '00' | '01' | '02' | '03';
};

export type SIGNIN = { token: string };

export type HISTORY = {
    attendanceDate: string;
    clockIn: string | null;
    clockOut: string | null;
    workHours: number | null;
    completionRatio: number | null;
    modificationHours: 4 | 8 | null;
    modificationStatusCode: '1' | '2' | '9' | null;
    modificationReason: string | null;
    dayOffCode: USERINFO['dayOffCode'];
};

export type GROUPHISTORY = HISTORY & {
    companyCode: USERINFO['companyCode'];
    employeeId: USERINFO['employeeId'];
    email: USERINFO['email'];
    displayName: USERINFO['displayName'];
    companyName: USERINFO['companyName'];
    departmentCode1: USERINFO['departmentCode1'];
    departmentCode2: USERINFO['departmentCode2'];
    departmentName: USERINFO['departmentName'];
    dutyCode: USERINFO['dutyCode'];
    dutyName: USERINFO['dutyName'];
    positionName: USERINFO['positionName'];
};