import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserInfo } from '../apis/clock';
import { selectUser, setUser } from '../slices/user';

export default function useUserInfo() {
    const user = useSelector(selectUser);
    const [error, setError] = useState<unknown>();
    const dispatch = useDispatch();

    const fetch = useCallback(async () => {
        try {
            const userInfo = (await getUserInfo()).data;
            dispatch(setUser(userInfo));
        } catch (error) {
            setError(error);
        }
    }, [dispatch]);

    useEffect(() => {
        if (!user.info) fetch();
    }, [fetch, user.info]);

    if (error) throw error;

    return { userInfo: user, error };
}
