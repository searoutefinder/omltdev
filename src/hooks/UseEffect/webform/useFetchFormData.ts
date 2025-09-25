import { useEffect } from 'react';
import { FormatProps } from '../../../pages/WebForm/types';

interface UseFetchFormDataProps {
    setInputKeys: (inputKeys: any[]) => void;
    setIsFetching: (isFetching: boolean) => void;
    setAllowedFileTypes: (allowedFileTypes: FormatProps[]) => void;
}

const proxy = import.meta.env.VITE_BACKEND_PROXY_URL;

export function useFetchFormData({
    setInputKeys,
    setIsFetching,
    setAllowedFileTypes
}: UseFetchFormDataProps) {
    useEffect(() => {
        const fetchData = async () => {
            setIsFetching(true);
            try {
                const response = await fetch(`${proxy}/formData`, { method: 'GET' });
                if (response.ok) {
                    const data = await response.json();
                    setInputKeys(data.formData);
                    setAllowedFileTypes(data.allowedFileTypes);
                } 
            } catch (error) {
                console.error('Error fetching form data:', error);
            } finally {
                setIsFetching(false);
            };
        };

        fetchData();

    }, [setInputKeys, setAllowedFileTypes, setIsFetching]);

    return null;
}
