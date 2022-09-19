import { useEffect } from 'react';
import { useMutation } from 'react-query';
import { postNetworkCheck } from '../apis/clock';

export default function useNetworkCheck() {
    const { mutate, data: status, error } = useMutation(postNetworkCheck);

    if (status === 200) document.body.style.display = 'initial';
    else document.body.style.display = 'none';

    useEffect(() => {
        mutate();
    }, [mutate]);
    

    if (error) throw error;

    return { status, error };
}
