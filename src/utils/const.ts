export const attendanceMSG = {
    in: ['오늘은 누구보다 더 좋은 일만 가득하시길 바랍니다!', '오늘도 웃는 일만 가득한 좋은 하루 되세요!', '행복한 미소 지을 수 있는 좋은 하루 보내세요!'],
    out: [
        `오늘 하루도 고생 많으셨습니다.\n좋은 밤 되세요!`,
        `소중한 하루 수고 많으셨습니다.\n편히 쉬시고 행복한 저녁 되세요!`,
        `하루 마무리 잘 하셨나요?\n오늘도 고생 많으셨습니다.`
    ]
};

export const statusTextMSG = {
    leave: '휴가',
    early: '출근 완료',
    on: '근무 중',
    off: '퇴근 완료',
    overtime: '초과 근무 중'
};

export const modificationStatusText = {
    '1': '수정',
    '2': '승인',
    '9': '반려'
};

export const modificationRequestText = {
    '1': '승인',
    '2': '승인됨',
    '9': '반려함'
};

export const modificationStatusCodeColor = {
    '1': '#F89926',
    '2': '#167FFB',
    '9': '#F40C1A'
};

export const circularColor = {
    '1': { primary: '#959595', secondary: '#842AFD', background: '#fff' },
    '2': { primary: '#C4D8FD', secondary: '#842AFD', background: '#EDF3FF' },
    '9': { primary: '#959595', secondary: '#842AFD', background: '#fff' },
    normal: { primary: '#C4D8FD', secondary: '#842AFD', background: '#EDF3FF' },
    overtime: { primary: '#959595', secondary: '#842AFD', background: '#fff' },
    off: { primary: '#959595', secondary: '#842AFD', background: '#fff' },
    leave: { primary: '#E2E2E2', background: '#fff' },
    default: { primary: '#959595', secondary: '#842AFD', background: '#fff' }
};

export const overtime = 30;
