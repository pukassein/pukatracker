
import React, { useState } from 'react';
import { Transaction, TransactionCategory } from '../types';
import { XIcon } from './icons';

interface QuickAddFormProps {
    onClose: () => void;
    onAddTransaction: (transaction: Omit<Transaction, 'id' | 'date'>, date: string) => void;
    category: TransactionCategory;
    description: string;
    owedBy?: string;
}

const QuickAddForm: React.FC<QuickAddFormProps> = ({ onClose, onAddTransaction, category, description, owedBy }) => {
    const [amount, setAmount] = useState('');
    const [customDescription, setCustomDescription] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<'cash' | 'credit'>('credit');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const numericAmount = parseFloat(amount);
        if (!numericAmount || numericAmount <= 0) {
            return;
        }
        
        const finalDescription = owedBy === 'dad' 
            ? customDescription
            : description;

        onAddTransaction({
            type: 'expense',
            amount: numericAmount,
            description: finalDescription,
            category,
            paymentMethod: paymentMethod,
            owedBy: owedBy,
        }, new Date().toISOString());
        onClose();
    };

    const isDadsExpense = owedBy === 'dad';
    const title = isDadsExpense ? "Add Dad's Expense" : `Add ${description}`;
    const subTitle = isDadsExpense
        ? "Log an expense paid for Dad. It will be tracked as money he owes you."
        : "Defaults to Credit Card, but you can change it below.";


    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true">
            <div className="bg-zinc-800 rounded-2xl shadow-xl w-full max-w-sm p-6 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-zinc-400 hover:text-white" aria-label="Close">
                    <XIcon className="w-6 h-6" />
                </button>
                <h2 className="text-2xl font-bold mb-2 text-white text-center">{title}</h2>
                <p className="text-center text-zinc-400 mb-6 text-sm">{subTitle}</p>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                     <div>
                        <label htmlFor="quick-amount" className="block text-sm font-medium text-zinc-400 mb-1">Amount</label>
                        <input
                            id="quick-amount"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            className="w-full bg-zinc-700 border-zinc-600 rounded-lg p-3 text-white text-2xl text-center focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            required
                            autoFocus={!isDadsExpense}
                            step="0.01"
                        />
                    </div>
                    {isDadsExpense && (
                         <div>
                            <label htmlFor="quick-description" className="block text-sm font-medium text-zinc-400 mb-1">Description</label>
                            <input
                                id="quick-description"
                                type="text"
                                value={customDescription}
                                onChange={(e) => setCustomDescription(e.target.value)}
                                placeholder="e.g., Gas, Groceries"
                                className="w-full bg-zinc-700 border-zinc-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                autoFocus
                                required
                            />
                        </div>
                    )}
                    
                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-2">Payment Method</label>
                        <div className="grid grid-cols-2 gap-2 rounded-lg bg-zinc-700 p-1">
                            <button type="button" onClick={() => setPaymentMethod('cash')} className={`py-2 rounded-md font-semibold transition-colors ${paymentMethod === 'cash' ? 'bg-zinc-900 text-white' : 'text-zinc-400'}`}>
                                Cash/Debit
                            </button>
                            <button type="button" onClick={() => setPaymentMethod('credit')} className={`py-2 rounded-md font-semibold transition-colors ${paymentMethod === 'credit' ? 'bg-zinc-900 text-white' : 'text-zinc-400'}`}>
                                Credit Card
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-lg transition-colors !mt-6">
                        Add Expense
                    </button>
                </form>
            </div>
        </div>
    );
};

export default QuickAddForm;
