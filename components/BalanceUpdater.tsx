import React, { useState } from 'react';
import { TransactionCategory } from '../types';
import { CreditCardIcon, BankIcon, DollarSignIcon, PlusIcon, XIcon, CheckIcon } from './icons';

interface BalanceUpdaterProps {
    currentCreditDebt: number;
    currentBrl: number;
    currentPyg: number;
    currentSavings: number;
    onUpdate: (
        account: 'credit' | 'brl' | 'pyg' | 'savings_nubank', 
        newBalance: number, 
        delta: number, 
        categories: { category: TransactionCategory, amount: number }[]
    ) => void;
}

const BalanceUpdater: React.FC<BalanceUpdaterProps> = ({ currentCreditDebt, currentBrl, currentPyg, currentSavings, onUpdate }) => {
    const [selectedAccount, setSelectedAccount] = useState<'credit' | 'brl' | 'pyg' | 'savings_nubank'>('credit');
    const [newBalanceStr, setNewBalanceStr] = useState('');
    const [splits, setSplits] = useState<{ category: TransactionCategory, percentageStr: string }[]>([]);

    const currentBalance = selectedAccount === 'credit' ? currentCreditDebt : selectedAccount === 'brl' ? currentBrl : selectedAccount === 'pyg' ? currentPyg : currentSavings;
    const newBalance = parseFloat(newBalanceStr);
    const isValidNewBalance = !isNaN(newBalance) && newBalance >= 0;
    
    let delta = 0;
    if (isValidNewBalance) {
        if (selectedAccount === 'credit') {
            delta = newBalance - currentBalance;
        } else {
            delta = currentBalance - newBalance;
        }
    }

    const isSpent = delta > 0;
    const isGained = delta < 0;
    const absDelta = Math.abs(delta);

    const handleAddSplit = () => {
        setSplits([...splits, { category: TransactionCategory.Food, percentageStr: '' }]);
    };

    const handleUpdateSplit = (index: number, field: 'category' | 'percentageStr', value: string) => {
        const newSplits = [...splits];
        newSplits[index] = { ...newSplits[index], [field]: value as any };
        setSplits(newSplits);
    };

    const handleRemoveSplit = (index: number) => {
        setSplits(splits.filter((_, i) => i !== index));
    };

    const handleSubmit = () => {
        if (!isValidNewBalance) return;

        let processedSplits: { category: TransactionCategory, amount: number }[] = [];
        let totalPercentage = 0;

        if (isSpent) {
            splits.forEach(s => {
                const pct = parseFloat(s.percentageStr);
                if (!isNaN(pct) && pct > 0) {
                    const allowedPct = Math.min(pct, 100 - totalPercentage);
                    if (allowedPct > 0) {
                        const amount = (allowedPct / 100) * absDelta;
                        processedSplits.push({ category: s.category, amount });
                        totalPercentage += allowedPct;
                    }
                }
            });

            if (totalPercentage < 100) {
                const remainingAmount = ((100 - totalPercentage) / 100) * absDelta;
                processedSplits.push({ category: TransactionCategory.Other, amount: remainingAmount });
            }
        } else if (isGained) {
            if (selectedAccount === 'credit') {
                processedSplits.push({ category: TransactionCategory.CreditCard, amount: absDelta });
            } else {
                processedSplits.push({ category: TransactionCategory.Income, amount: absDelta });
            }
        }

        onUpdate(selectedAccount, newBalance, delta, processedSplits);
        setNewBalanceStr('');
        setSplits([]);
    };

    const formatCurrency = (amount: number) => {
        const currency = selectedAccount === 'pyg' ? 'PYG' : 'BRL';
        const locale = selectedAccount === 'pyg' ? 'es-PY' : 'pt-BR';
        return new Intl.NumberFormat(locale, { style: 'currency', currency, maximumFractionDigits: selectedAccount === 'pyg' ? 0 : 2 }).format(amount);
    };

    return (
        <div className="bg-zinc-800/50 p-6 rounded-2xl shadow-lg border border-zinc-700/50">
            <h2 className="text-2xl font-bold text-white mb-6">Quick Balance Update</h2>
            
            {/* Account Selector */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <button 
                    onClick={() => { setSelectedAccount('credit'); setNewBalanceStr(''); setSplits([]); }}
                    className={`py-3 px-4 rounded-xl flex flex-col items-center gap-2 transition-colors ${selectedAccount === 'credit' ? 'bg-emerald-600 text-white' : 'bg-zinc-700/50 text-zinc-400 hover:bg-zinc-700'}`}
                >
                    <CreditCardIcon className="w-6 h-6" />
                    <span className="font-semibold text-sm text-center">Credit Card</span>
                </button>
                <button 
                    onClick={() => { setSelectedAccount('brl'); setNewBalanceStr(''); setSplits([]); }}
                    className={`py-3 px-4 rounded-xl flex flex-col items-center gap-2 transition-colors ${selectedAccount === 'brl' ? 'bg-emerald-600 text-white' : 'bg-zinc-700/50 text-zinc-400 hover:bg-zinc-700'}`}
                >
                    <DollarSignIcon className="w-6 h-6" />
                    <span className="font-semibold text-sm text-center">BRL Debit</span>
                </button>
                <button 
                    onClick={() => { setSelectedAccount('pyg'); setNewBalanceStr(''); setSplits([]); }}
                    className={`py-3 px-4 rounded-xl flex flex-col items-center gap-2 transition-colors ${selectedAccount === 'pyg' ? 'bg-emerald-600 text-white' : 'bg-zinc-700/50 text-zinc-400 hover:bg-zinc-700'}`}
                >
                    <BankIcon className="w-6 h-6" />
                    <span className="font-semibold text-sm text-center">PYG Debit</span>
                </button>
                <button 
                    onClick={() => { setSelectedAccount('savings_nubank'); setNewBalanceStr(''); setSplits([]); }}
                    className={`py-3 px-4 rounded-xl flex flex-col items-center gap-2 transition-colors ${selectedAccount === 'savings_nubank' ? 'bg-purple-600 text-white' : 'bg-zinc-700/50 text-zinc-400 hover:bg-zinc-700'}`}
                >
                    <BankIcon className="w-6 h-6" />
                    <span className="font-semibold text-sm text-center">NuBank Savings</span>
                </button>
            </div>

            {/* Current & New Balance Input */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
                    <p className="text-sm text-zinc-400 mb-1">Current {selectedAccount === 'credit' ? 'Debt' : 'Balance'}</p>
                    <p className="text-2xl font-bold text-white">{formatCurrency(currentBalance)}</p>
                </div>
                <div>
                    <label className="block text-sm text-zinc-400 mb-1">New {selectedAccount === 'credit' ? 'Debt' : 'Balance'}</label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-bold">
                            {selectedAccount === 'pyg' ? '₲' : 'R$'}
                        </span>
                        <input 
                            type="number" 
                            value={newBalanceStr}
                            onChange={(e) => setNewBalanceStr(e.target.value)}
                            placeholder="0.00"
                            className="w-full bg-zinc-700 border-zinc-600 rounded-xl py-3 pl-10 pr-4 text-white text-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                            step={selectedAccount === 'pyg' ? '1' : '0.01'}
                        />
                    </div>
                </div>
            </div>

            {/* Difference & Categorization */}
            {isValidNewBalance && delta !== 0 && (
                <div className="mb-6 animate-fade-in-down">
                    <div className={`p-4 rounded-xl mb-4 flex items-center justify-between ${isSpent ? 'bg-rose-500/10 border border-rose-500/20' : 'bg-emerald-500/10 border border-emerald-500/20'}`}>
                        <div>
                            <p className={`text-sm font-medium ${isSpent ? 'text-rose-400' : 'text-emerald-400'}`}>
                                {isSpent ? 'You spent:' : (selectedAccount === 'credit' ? 'You paid off:' : 'You received:')}
                            </p>
                            <p className={`text-2xl font-bold ${isSpent ? 'text-rose-500' : 'text-emerald-500'}`}>
                                {formatCurrency(absDelta)}
                            </p>
                        </div>
                    </div>

                    {isSpent && (
                        <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-sm font-semibold text-zinc-300">Categorize (Optional)</h3>
                                <button onClick={handleAddSplit} className="text-xs flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors">
                                    <PlusIcon className="w-3 h-3" /> Add Split
                                </button>
                            </div>
                            
                            {splits.length > 0 ? (
                                <div className="space-y-3">
                                    {splits.map((split, idx) => (
                                        <div key={idx} className="flex items-center gap-2">
                                            <select 
                                                value={split.category}
                                                onChange={(e) => handleUpdateSplit(idx, 'category', e.target.value)}
                                                className="flex-1 bg-zinc-700 border-zinc-600 rounded-lg py-2 px-3 text-white text-sm focus:ring-2 focus:ring-emerald-500"
                                            >
                                                {Object.values(TransactionCategory).filter(c => c !== TransactionCategory.Income && c !== TransactionCategory.CreditCard).map(c => (
                                                    <option key={c} value={c}>{c}</option>
                                                ))}
                                            </select>
                                            <div className="relative w-24">
                                                <input 
                                                    type="number" 
                                                    value={split.percentageStr}
                                                    onChange={(e) => handleUpdateSplit(idx, 'percentageStr', e.target.value)}
                                                    placeholder="0"
                                                    className="w-full bg-zinc-700 border-zinc-600 rounded-lg py-2 pl-3 pr-6 text-white text-sm focus:ring-2 focus:ring-emerald-500"
                                                />
                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm">%</span>
                                            </div>
                                            <button onClick={() => handleRemoveSplit(idx)} className="p-2 text-zinc-500 hover:text-rose-400 transition-colors">
                                                <XIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                    <div className="text-xs text-zinc-500 mt-2 text-right">
                                        Remaining {Math.max(0, 100 - splits.reduce((acc, s) => acc + (parseFloat(s.percentageStr) || 0), 0)).toFixed(0)}% will be categorized as "Other".
                                    </div>
                                </div>
                            ) : (
                                <p className="text-xs text-zinc-500">100% will be categorized as "Other". Add a split to specify.</p>
                            )}
                        </div>
                    )}
                </div>
            )}

            <button 
                onClick={handleSubmit}
                disabled={!isValidNewBalance || delta === 0}
                className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-700 disabled:text-zinc-500 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
                <CheckIcon className="w-5 h-5" />
                Log Changes
            </button>
        </div>
    );
};

export default BalanceUpdater;
