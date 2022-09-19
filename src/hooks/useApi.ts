import { useCallback, useEffect, useState } from 'react';
type STATE = {
    data: null | any;
    loading: boolean;
    error: unknown;
};

export default function useApi(api: () => Promise<any>) {
    const [state, setState] = useState<STATE>({ data: null, loading: false, error: null });
    const executeApi = useCallback(async () => {
        setState((state) => ({ ...state, loading: true }));
        try {
            const data = await api();
            setState({ data, loading: false, error: null });
            return data;
        } catch (e) {
            setState({ data: null, loading: false, error: e });
        }
    }, [api]);

    useEffect(() => {
        executeApi();
    }, [executeApi]);
    return state;
}
