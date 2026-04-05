import React, { useState } from 'react';
import { Database } from '../types';
import { XIcon } from './icons';

interface EditBalancesModalProps {
    accounts: Database['public']['Tables']['accounts']['Row'] | null;
    monthlyBudget: number;
    onClose: () => void;
    onSave: (newBalances: { pyg: number; brl: number; savings_nubank: number; monthly_budget: number }) => void;
}

const EditBalancesModal: React.FC<EditBalancesModalProps> = ({ accounts, monthlyBudget, onClose, onSave }) => {
    const [pygAmount, setPygAmount] = useState(accounts?.pyg.toString() || '0');
    const [brlAmount, setBrlAmount] = useState(accounts?.brl.toString() || '0');
    const [savingsNubankAmount, setSavingsNubankAmount] = useState((accounts?.savings_nubank || 0).toString());
    const [monthlyBudgetAmount, setMonthlyBudgetAmount] = useState(monthlyBudget.toString());
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const numericPyg = parseFloat(pygAmount);
        const numericBrl = parseFloat(brlAmount);
        const numericSavings = parseFloat(savingsNubankAmount);
        const numericBudget = parseFloat(monthlyBudgetAmount);

        if (isNaN(numericPyg) || numericPyg < 0 || isNaN(numericBrl) || numericBrl < 0 || isNaN(numericSavings) || numericSavings < 0 || isNaN(numericBudget) || numericBudget < 0) {
            setError('Please enter valid, non-negative amounts for all fields.');
            return;
        }

        setError('');
        onSave({ pyg: numericPyg, brl: numericBrl, savings_nubank: numericSavings, monthly_budget: numericBudget });
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true">
            <div className="bg-zinc-800 rounded-2xl shadow-xl w-full max-w-md p-6 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-zinc-400 hover:text-white" aria-label="Close">
                    <XIcon className="w-6 h-6" />
                </button>
                <h2 className="text-2xl font-bold mb-6 text-white text-center">Edit Account Balances</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="pyg-balance" className="block text-sm font-medium text-zinc-300 mb-1">PYG Bank Account Balance</label>
                        <input
                            id="pyg-balance"
                            type="number"
                            value={pygAmount}
                            onChange={(e) => setPygAmount(e.target.value)}
                            placeholder="₲ 0"
                            className="w-full bg-zinc-700 border-zinc-600 rounded-lg p-3 text-white text-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            required
                            step="any"
                        />
                    </div>
                    <div>
                        <label htmlFor="brl-balance" className="block text-sm font-medium text-zinc-300 mb-1">BRL Balance</label>
                        <input
                            id="brl-balance"
                            type="number"
                            value={brlAmount}
                            onChange={(e) => setBrlAmount(e.target.value)}
                            placeholder="R$ 0.00"
                            className="w-full bg-zinc-700 border-zinc-600 rounded-lg p-3 text-white text-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            required
                            step="0.01"
                        />
                    </div>
                    <div>
                        <label htmlFor="savings-nubank-balance" className="block text-sm font-medium text-zinc-300 mb-1">Caixinha Nu Bank Balance</label>
                        <input
                            id="savings-nubank-balance"
                            type="number"
                            value={savingsNubankAmount}
                            onChange={(e) => setSavingsNubankAmount(e.target.value)}
                            placeholder="R$ 0.00"
                            className="w-full bg-zinc-700 border-zinc-600 rounded-lg p-3 text-white text-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            required
                            step="0.01"
                        />
                    </div>
                    <div>
                        <label htmlFor="monthly-budget" className="block text-sm font-medium text-zinc-300 mb-1">Monthly Budget Target</label>
                        <input
                            id="monthly-budget"
                            type="number"
                            value={monthlyBudgetAmount}
                            onChange={(e) => setMonthlyBudgetAmount(e.target.value)}
                            placeholder="R$ 8000.00"
                            className="w-full bg-zinc-700 border-zinc-600 rounded-lg p-3 text-white text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                            step="0.01"
                        />
                    </div>
                    
                    {error && <p className="text-red-400 text-sm text-center">{error}</p>}

                    <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-lg transition-colors !mt-6">
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditBalancesModal;
