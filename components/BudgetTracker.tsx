import React, { useState } from 'react';
import { Transaction, TransactionCategory } from '../types';
import { 
    BillsIcon, 
    FoodIcon, 
    TransportIcon, 
    HealthIcon, 
    EntertainmentIcon, 
    ShoppingIcon, 
    PlusIcon,
    ChevronDownIcon,
    ChevronUpIcon
} from './icons';

interface BudgetTrackerProps {
    monthlyIncome: number;
    monthlyTransactions: Transaction[];
}

const budgetConfig = [
    {
        name: 'Housing & Bills',
        icon: <BillsIcon className="w-5 h-5" />,
        percentage: 0.36,
        appCategories: [TransactionCategory.Bills, TransactionCategory.CreditCard],
    },
    {
        name: 'Food',
        icon: <FoodIcon className="w-5 h-5" />,
        percentage: 0.15,
        appCategories: [TransactionCategory.Food],
    },
    {
        name: 'Social Life',
        icon: <EntertainmentIcon className="w-5 h-5" />,
        percentage: 0.12,
        appCategories: [TransactionCategory.Entertainment],
    },
    {
        name: 'Flexible Spending',
        icon: <ShoppingIcon className="w-5 h-5" />,
        percentage: 0.10,
        appCategories: [TransactionCategory.Shopping, TransactionCategory.Travel, TransactionCategory.Other],
    },
    {
        name: 'Transport',
        icon: <TransportIcon className="w-5 h-5" />,
        percentage: 0.04,
        appCategories: [TransactionCategory.Transport],
    },
    {
        name: 'Health & Sports',
        icon: <HealthIcon className="w-5 h-5" />,
        percentage: 0.03,
        appCategories: [TransactionCategory.Health],
    },
];

const savingsTarget = 0.20;

const BudgetTracker: React.FC<BudgetTrackerProps> = ({ monthlyIncome, monthlyTransactions }) => {
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

    const handleToggleExpand = (categoryName: string) => {
        setExpandedCategory(prev => (prev === categoryName ? null : categoryName));
    };
    
    const calculateSpent = (budgetCategory: typeof budgetConfig[0]) => {
        return monthlyTransactions
            .filter(t => t.type === 'expense' && t.category && budgetCategory.appCategories.includes(t.category))
            .reduce((sum, t) => sum + (t.amount ?? 0), 0);
    };
    
    const totalMonthlyExpenses = monthlyTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + (t.amount ?? 0), 0);
        
    const currentSavings = monthlyIncome - totalMonthlyExpenses;
    const savingsGoal = monthlyIncome * savingsTarget;

    if (monthlyIncome === 0) {
        return (
             <div className="bg-zinc-800/50 p-6 rounded-2xl shadow-lg">
                <div className="text-center py-8">
                    <p className="text-zinc-400">Add this month's income to see your budget breakdown.</p>
                    <p className="text-zinc-500 text-sm">Your budget is automatically calculated based on your income.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-zinc-800/50 p-6 rounded-2xl shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {budgetConfig.map(category => {
                    const allocated = monthlyIncome * category.percentage;
                    const spent = calculateSpent(category);
                    const remaining = allocated - spent;
                    const spentPercent = allocated > 0 ? Math.min((spent / allocated) * 100, 100) : 0;
                    const isExpanded = expandedCategory === category.name;
                    const categoryTransactions = monthlyTransactions
                        .filter(t => t.type === 'expense' && t.category && category.appCategories.includes(t.category))
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());


                    let progressBarColor = 'bg-cyan-500';
                    if (spentPercent > 90) progressBarColor = 'bg-red-500';
                    else if (spentPercent > 75) progressBarColor = 'bg-yellow-500';
                    
                    return (
                        <div key={category.name} className="bg-zinc-700/50 p-4 rounded-lg flex flex-col justify-between">
                            <button
                                onClick={() => handleToggleExpand(category.name)}
                                className="w-full text-left"
                                aria-expanded={isExpanded}
                                aria-controls={`budget-details-${category.name}`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        {category.icon}
                                        <span className="font-semibold text-white">{category.name}</span>
                                    </div>
                                     <div className="flex items-center gap-2">
                                        <span className="text-xs font-mono px-2 py-1 bg-zinc-600 rounded">{category.percentage * 100}%</span>
                                        {isExpanded ? <ChevronUpIcon className="w-5 h-5 text-zinc-400" /> : <ChevronDownIcon className="w-5 h-5 text-zinc-400" />}
                                    </div>
                                </div>
                                
                                <div className="text-right mb-2">
                                     <p className="text-lg font-bold text-white">
                                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(spent)}
                                         <span className="text-sm text-zinc-400"> / {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(allocated)}</span>
                                    </p>
                                </div>

                                <div className="w-full bg-zinc-600 rounded-full h-2 mb-2">
                                    <div 
                                        className={`h-2 rounded-full transition-all duration-500 ${progressBarColor}`} 
                                        style={{ width: `${spentPercent}%` }}
                                    ></div>
                                </div>
                                <p className={`text-sm text-right font-medium ${remaining < 0 ? 'text-red-400' : 'text-zinc-400'}`}>
                                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(remaining)} Left
                                </p>
                            </button>

                            {isExpanded && (
                                <div id={`budget-details-${category.name}`} className="mt-4 border-t border-zinc-600 pt-3 animate-fade-in-down">
                                    {categoryTransactions.length > 0 ? (
                                        <ul className="space-y-2 max-h-40 overflow-y-auto pr-2">
                                            {categoryTransactions.map(tx => (
                                                <li key={tx.id} className="flex justify-between items-center text-sm">
                                                    <div>
                                                        <p className="font-medium text-zinc-200 truncate max-w-[150px]">{tx.description}</p>
                                                        <p className="text-xs text-zinc-400">{new Date(tx.date).toLocaleDateString()}</p>
                                                    </div>
                                                    <p className="font-semibold text-red-400">
                                                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(tx.amount ?? 0)}
                                                    </p>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-sm text-zinc-400 text-center py-2">No expenses this month.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
                
                <div className="bg-zinc-700/50 p-4 rounded-lg md:col-span-2 lg:col-span-1">
                     <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <PlusIcon className="w-5 h-5" />
                            <span className="font-semibold text-white">Savings</span>
                        </div>
                        <span className="text-xs font-mono px-2 py-1 bg-zinc-600 rounded">{savingsTarget * 100}% Target</span>
                    </div>
                    <div className="text-center py-4">
                        <p className="text-sm text-zinc-400">Current Month's Savings</p>
                         <p className={`text-3xl font-bold ${currentSavings >= savingsGoal ? 'text-green-400' : 'text-amber-400'}`}>
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(currentSavings)}
                        </p>
                         <p className="text-xs text-zinc-500">
                           Target: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(savingsGoal)}
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default BudgetTracker;