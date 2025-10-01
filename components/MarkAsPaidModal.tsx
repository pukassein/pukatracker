import React, { useState } from 'react';
import { RecurringPayment, Transaction } from '../types';
import { XIcon } from './icons';

interface MarkAsPaidModalProps {
    payment: RecurringPayment;
    month: number;
    year: number;
    onClose: () => void;
    onConfirm: (transaction: Omit<Transaction, 'id' | 'date'>, date: string, monthString: string) => void;
}

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const MarkAsPaidModal: React.FC<MarkAsPaidModalProps> = ({ payment, month, year, onClose, onConfirm }) => {
    const [paymentMethod, setPaymentMethod] = useState(payment.paymentMethod);
    const monthName = MONTH_NAMES[month];

    const handleConfirm = () => {
        const transactionDate = new Date(year, month, 1).toISOString();
        const transactionData: Omit<Transaction, 'id' | 'date'> = {
            type: 'expense',
            amount: payment.amount,
            description: `${payment.name} (${monthName} ${year})`,
            category: payment.category,
            paymentMethod,
        };
        const monthString = `${year}-${String(month + 1).padStart(2, '0')}`;
        onConfirm(transactionData, transactionDate, monthString);
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true">
            <div className="bg-zinc-800 rounded-2xl shadow-xl w-full max-w-sm p-6 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-zinc-400 hover:text-white" aria-label="Close">
                    <XIcon className="w-6 h-6" />
                </button>
                <h2 className="text-xl font-bold mb-2 text-white text-center">Confirm Payment</h2>
                <p className="text-center text-zinc-400 mb-4 text-sm">
                    Mark <span className="font-semibold text-zinc-200">{payment.name}</span> for <span className="font-semibold text-zinc-200">{monthName} {year}</span> as paid?
                </p>

                <div className="text-center bg-zinc-900/50 rounded-lg p-4 mb-4">
                    <p className="text-3xl font-bold text-emerald-400">
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(payment.amount)}
                    </p>
                </div>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-2">Payment Method</label>
                        <div className="grid grid-cols-3 gap-2 rounded-lg bg-zinc-700 p-1">
                            <button type="button" onClick={() => setPaymentMethod('cash')} className={`py-2 rounded-md font-semibold text-sm transition-colors ${paymentMethod === 'cash' ? 'bg-zinc-900 text-white' : 'text-zinc-400'}`}>Cash/Debit</button>
                            <button type="button" onClick={() => setPaymentMethod('credit')} className={`py-2 rounded-md font-semibold text-sm transition-colors ${paymentMethod === 'credit' ? 'bg-zinc-900 text-white' : 'text-zinc-400'}`}>Credit Card</button>
                            <button type="button" onClick={() => setPaymentMethod('brl_account')} className={`py-2 rounded-md font-semibold text-sm transition-colors ${paymentMethod === 'brl_account' ? 'bg-zinc-900 text-white' : 'text-zinc-400'}`}>BRL Acct</button>
                        </div>
                    </div>

                    <div className="flex gap-2 !mt-6">
                        <button onClick={onClose} className="w-full bg-zinc-600 hover:bg-zinc-500 text-white font-bold py-3 rounded-lg transition-colors">
                            Cancel
                        </button>
                        <button onClick={handleConfirm} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-lg transition-colors">
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MarkAsPaidModal;