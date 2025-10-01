import React, { useState, useEffect } from 'react';
import { Transaction, TransactionType, TransactionCategory } from '../types';
import { XIcon } from './icons';

interface AddTransactionFormProps {
    onClose: () => void;
    onAddTransaction: (transaction: Omit<Transaction, 'id'>, date: string) => void;
    prefillCategory?: TransactionCategory;
}

const categoryRecommendations: Partial<Record<TransactionCategory, string[]>> = {
    [TransactionCategory.Food]: ["Groceries", "Coffee", "Lunch", "Dinner", "Takeout", "Snacks"],
    [TransactionCategory.Transport]: ["Gas", "Public Transit", "Uber/Lyft", "Parking", "Train Ticket"],
    [TransactionCategory.Shopping]: ["Clothing", "Electronics", "Home Goods", "Gifts", "Online Shopping"],
    [TransactionCategory.Travel]: ["Flight", "Hotel", "Rental Car", "Vacation"],
    [TransactionCategory.Bills]: ["Rent/Mortgage", "Electricity", "Water", "Internet", "Phone Bill"],
    [TransactionCategory.Entertainment]: ["Movies", "Concert", "Games", "Streaming Service", "Bar"],
    [TransactionCategory.Health]: ["Pharmacy", "Doctor's Visit", "Gym", "Medication"],
    [TransactionCategory.CreditCard]: ["Credit Card Payment"],
};

const AddTransactionForm: React.FC<AddTransactionFormProps> = ({ onClose, onAddTransaction, prefillCategory }) => {
    const [type, setType] = useState<'income' | 'expense'>('expense');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState<TransactionCategory>(TransactionCategory.Food);
    const [paymentMethod, setPaymentMethod] = useState<'cash' | 'credit' | 'brl_account'>('cash');
    
    useEffect(() => {
        if (prefillCategory) {
            setCategory(prefillCategory);
            setType('expense');
        }
    }, [prefillCategory]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const numericAmount = parseFloat(amount);
        if (!numericAmount || numericAmount <= 0 || !description) {
            // Add some error handling UI later
            return;
        }
        
        const transactionData: Omit<Transaction, 'id' | 'date'> = {
            type,
            amount: numericAmount,
            description,
            category: type === 'income' ? TransactionCategory.Income : category,
        };

        if (type === 'expense') {
            transactionData.paymentMethod = paymentMethod;
        }

        onAddTransaction(transactionData, new Date().toISOString());
    };

    const expenseCategories = Object.values(TransactionCategory).filter(c => c !== TransactionCategory.Income);
    const recommendations = categoryRecommendations[category] || [];

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true">
            <div className="bg-zinc-800 rounded-2xl shadow-xl w-full max-w-md p-6 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-zinc-400 hover:text-white" aria-label="Close">
                    <XIcon className="w-6 h-6" />
                </button>
                <h2 className="text-2xl font-bold mb-6 text-white text-center">Add Transaction</h2>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <button 
                        onClick={() => setType('expense')}
                        className={`py-3 rounded-lg font-semibold transition-colors ${type === 'expense' ? 'bg-red-500 text-white' : 'bg-zinc-700 hover:bg-zinc-600'}`}
                    >
                        Expense
                    </button>
                    <button 
                        onClick={() => setType('income')}
                        className={`py-3 rounded-lg font-semibold transition-colors ${type === 'income' ? 'bg-green-500 text-white' : 'bg-zinc-700 hover:bg-zinc-600'}`}
                    >
                        Income
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {type === 'expense' && (
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-2">Payment Method</label>
                            <div className="grid grid-cols-3 gap-2 rounded-lg bg-zinc-700 p-1">
                                <button type="button" onClick={() => setPaymentMethod('cash')} className={`py-2 rounded-md font-semibold text-sm transition-colors ${paymentMethod === 'cash' ? 'bg-zinc-900 text-white' : 'text-zinc-400'}`}>
                                    Cash/Debit
                                </button>
                                <button type="button" onClick={() => setPaymentMethod('credit')} className={`py-2 rounded-md font-semibold text-sm transition-colors ${paymentMethod === 'credit' ? 'bg-zinc-900 text-white' : 'text-zinc-400'}`}>
                                    Credit Card
                                </button>
                                <button type="button" onClick={() => setPaymentMethod('brl_account')} className={`py-2 rounded-md font-semibold text-sm transition-colors ${paymentMethod === 'brl_account' ? 'bg-zinc-900 text-white' : 'text-zinc-400'}`}>
                                    BRL Acct
                                </button>
                            </div>
                        </div>
                    )}

                    <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-zinc-400 mb-1">Amount</label>
                        <input
                            id="amount"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            className="w-full bg-zinc-700 border-zinc-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            required
                            step="0.01"
                        />
                    </div>
                     
                    {type === 'expense' && (
                         <div>
                            <label htmlFor="category" className="block text-sm font-medium text-zinc-400 mb-1">Category</label>
                            <select
                                id="category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value as TransactionCategory)}
                                className="w-full bg-zinc-700 border-zinc-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            >
                                {expenseCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                    )}

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-zinc-400 mb-1">Description</label>
                        <input
                            id="description"
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder={type === 'expense' ? 'e.g., Lunch with friends' : 'e.g., Monthly salary'}
                            className="w-full bg-zinc-700 border-zinc-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            required
                        />
                    </div>
                    
                    {type === 'expense' && recommendations.length > 0 && (
                        <div className="pt-1">
                            <div className="flex flex-wrap gap-2">
                                {recommendations.map(suggestion => (
                                    <button
                                        key={suggestion}
                                        type="button"
                                        onClick={() => setDescription(suggestion)}
                                        className="bg-zinc-600 hover:bg-zinc-500 text-zinc-200 text-sm font-medium py-1 px-3 rounded-full transition-colors"
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-lg transition-colors !mt-6">
                        Add Transaction
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddTransactionForm;