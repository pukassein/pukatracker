import React, { useEffect, useState } from 'react';
import { CheckCircleIcon, AlertTriangleIcon, XIcon } from './icons';

interface NotificationProps {
    message: string;
    type: 'success' | 'error';
    onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, type, onClose }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true); 
        const timer = setTimeout(() => {
            handleClose();
        }, 5000); 

        return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [message, type, onClose]);
    
    const handleClose = () => {
         setIsVisible(false); 
         setTimeout(onClose, 300); 
    }

    const isSuccess = type === 'success';
    const bgColor = isSuccess ? 'bg-emerald-500' : 'bg-red-500';
    const icon = isSuccess ? <CheckCircleIcon className="w-6 h-6" /> : <AlertTriangleIcon className="w-6 h-6" />;

    return (
        <div
            role="alert"
            aria-live="assertive"
            className={`fixed top-5 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-4 text-white p-4 rounded-lg shadow-2xl transition-all duration-300 ease-in-out
                ${bgColor}
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`
            }
        >
            {icon}
            <span className="font-semibold">{message}</span>
            <button
                onClick={handleClose}
                className="p-1 rounded-full hover:bg-white/20 transition-colors"
                aria-label="Close notification"
            >
                <XIcon className="w-5 h-5" />
            </button>
        </div>
    );
};

export default Notification;