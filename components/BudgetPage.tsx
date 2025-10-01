import React from 'react';
import { Transaction } from '../types';
import BudgetTracker from './BudgetTracker';
import { TargetIcon } from './icons';

interface BudgetPageProps {
    monthlyIncome: number;
    monthlyTransactions: Transaction[];
}

const BudgetPage: React.FC<BudgetPageProps> = ({ monthlyIncome, monthlyTransactions }) => {
    return (
        <div className="max-w-7xl mx-auto">
             <header className="flex items-center gap-3 mb-6">
                <TargetIcon className="w-8 h-8 text-emerald-400" />
                <h1 className="text-3xl font-bold text-white">Monthly Budget</h1>
            </header>
            <BudgetTracker 
                monthlyIncome={monthlyIncome}
                monthlyTransactions={monthlyTransactions}
            />
        </div>
    );
};

export default BudgetPage;