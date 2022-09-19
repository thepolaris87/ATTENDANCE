import { getAccessToken } from '../utils/util';

export const getConfigure = (type: 'GET' | 'POST' | 'PATCH' | 'DELETE') => {
    const accessToken = getAccessToken();
    const headers: Record<string, string> = { Authorization: `Bearer ${accessToken}` };

    if (['POST', 'PATCH'].includes(type)) headers['Content-type'] = 'application/json; charset=UTF-8';

    return { headers };
};
