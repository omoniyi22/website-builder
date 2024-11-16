import { useState } from 'react';

export const useToast = () => {
    const [toasts, setToasts] = useState<Array<{ message: string; type: 'success' | 'error' }>>([]);

    const toast = ({ title, description, type }: {
        title: string;
        description?: string;
        type: 'success' | 'error'
    }) => {
        setToasts(prev => [...prev, { message: description || title, type }]);
    };

    return { toast, toasts };
};