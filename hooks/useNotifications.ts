import { useCallback, useState } from 'react';

interface NotificationOptions {
    title: string;
    message: string;
    type?: 'info' | 'warning' | 'success';
    autoHide?: boolean;
    onPress?: () => void;
}

interface NotificationState extends NotificationOptions {
    id: string;
}

export function useNotifications() {
    const [notifications, setNotifications] = useState<NotificationState[]>([]);

    const showNotification = useCallback((options: NotificationOptions) => {
        const notification: NotificationState = {
            ...options,
            id: Date.now().toString(),
        };

        setNotifications((prev) => [...prev, notification]);
        return notification.id;
    }, []);

    const hideNotification = useCallback((id: string) => {
        setNotifications((prev) => prev.filter((notification) => notification.id !== id));
    }, []);

    const clearAllNotifications = useCallback(() => {
        setNotifications([]);
    }, []);

    return {
        notifications,
        showNotification,
        hideNotification,
        clearAllNotifications,
    };
}
