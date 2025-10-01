
import React from 'react';
import { RecurringPayment } from '../types';
import { XIcon, UndoIcon } from './icons';

interface UnmarkPaidModalProps {
    payment: RecurringPayment;
    month: number;
    year: number;
    onClose: () => void;
    onConfirm: (monthString: string) => void;
}

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const UnmarkPaidModal: React.FC<UnmarkPaidModalProps> = ({ payment, month, year, onClose, onConfirm }) => {
    const monthName = MONTH_NAMES[month];

    const handleConfirm = () => {
        const monthString = `${year}-${String(month + 1).padStart(2, '0')}`;
        onConfirm(monthString);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true">
            <div className="bg-zinc-800 rounded-2xl shadow-xl w-full max-w-sm p-6 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-zinc-400 hover:text-white" aria-label="Close">
                    <XIcon className="w-6 h-6" />
                </button>
                <h2 className="text-xl font-bold mb-2 text-white text-center">Undo Payment</h2>
                <p className="text-center text-zinc-400 mb-6 text-sm">
                    Unmark <span className="font-semibold text-zinc-200">{payment.name}</span> for <span className="font-semibold text-zinc-200">{monthName} {year}</span> as paid?
                </p>
                <p className="text-center text-zinc-500 mb-6 text-xs">
                    This will remove the corresponding expense transaction. This action cannot be undone.
                </p>
                
                <div className="flex gap-2 !mt-6">
                    <button onClick={onClose} className="w-full bg-zinc-600 hover:bg-zinc-500 text-white font-bold py-3 rounded-lg transition-colors">
                        Cancel
                    </button>
                    <button 
                        onClick={handleConfirm} 
                        className="w-full flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 rounded-lg transition-colors"
                    >
                        <UndoIcon className="w-5 h-5" />
                        Confirm Undo
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UnmarkPaidModal;
