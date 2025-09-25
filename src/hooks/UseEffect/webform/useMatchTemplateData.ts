import { useEffect } from 'react';

interface UseMatchTemplateData {
    template: string | null;
    setTemplateKeys: (template: any) => void;
    setIsFetching: (isFetching: boolean) => void;
}

const proxy = import.meta.env.VITE_BACKEND_PROXY_URL;

export function useMatchTemplateData({
    template,
    setTemplateKeys,
    setIsFetching,
}: UseMatchTemplateData) {
    useEffect(() => {
        if (!template) return;

        const fetchData = async () => {
            setIsFetching(true);
            try {
                const response = await fetch(`${proxy}/templateData/?id=${template}`, {
                    method: 'GET',
                });

                if (response.ok) {
                    const templateData = await response.json();
                    setTemplateKeys(templateData);
                } else {
                    console.error('Error fetching template data:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching template data:', error);
            } finally {
                setTimeout(() => {
                    setIsFetching(false);
                }, 150);
            }
        };

        fetchData();
    }, [setIsFetching, setTemplateKeys, template]);

    return null;
}

