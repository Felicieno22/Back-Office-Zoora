import { useState, useCallback } from 'react';
import { apiRequest } from '../utils/api';
import { toast } from 'sonner';

interface UseApiOptions<T> {
    onSuccess?: (data: T) => void;
    onError?: (error: any) => void;
    initialData?: T;
}

export function useApi<T = any>(endpoint: string, options: UseApiOptions<T> = {}) {
    const [data, setData] = useState<T | undefined>(options.initialData);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetch = useCallback(async (overrides?: any) => {
        setLoading(true);
        setError(null);
        try {
            const result = await apiRequest(endpoint, overrides);
            setData(result);
            if (options.onSuccess) options.onSuccess(result);
            return result;
        } catch (err: any) {
            setError(err);
            if (options.onError) options.onError(err);
            toast.error(err.message || "Une erreur est survenue");
            throw err;
        } finally {
            setLoading(false);
        }
    }, [endpoint, options]);

    return { data, loading, error, fetch, setData };
}

export function useMutation<T = any, R = any>(
    endpoint: string,
    method: 'POST' | 'PATCH' | 'PUT' | 'DELETE' = 'POST'
) {
    const [loading, setLoading] = useState(false);

    const execute = useCallback(async (data?: T, overrides?: any) => {
        setLoading(true);
        try {
            const result = await apiRequest(endpoint, {
                method,
                data,
                ...overrides
            });
            return result;
        } catch (err: any) {
            toast.error(err.message || "L'opération a échoué");
            throw err;
        } finally {
            setLoading(false);
        }
    }, [endpoint, method]);

    return { execute, loading };
}
