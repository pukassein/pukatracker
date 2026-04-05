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
    monthlyBudget: number;
    monthlyTransactions: Transaction[];
}

const budgetConfig = [
    {
        name: 'Housing & Bills',
        icon: <BillsIcon className="w-5 h-5" />,
        percentage: 0.36,
        appCategories: [TransactionCategory.Bills],
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

const BudgetTracker: React.FC<BudgetTrackerProps> = ({ monthlyBudget, monthlyTransactions }) => {
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
        .filter(t => t.type === 'expense' && t.category !== TransactionCategory.CreditCard)
        .reduce((sum, t) => sum + (t.amount ?? 0), 0);
        
    const remainingBudget = monthlyBudget - totalMonthlyExpenses;
    const totalSpentPercent = monthlyBudget > 0 ? Math.min((totalMonthlyExpenses / monthlyBudget) * 100, 100) : 0;

    if (monthlyBudget === 0) {
        return (
             <div className="bg-zinc-800/50 p-6 rounded-2xl shadow-lg">
                <div className="text-center py-8">
                    <p className="text-zinc-400">Set your monthly budget target to see your progress.</p>
                    <p className="text-zinc-500 text-sm">You can set this in the Edit Balances modal.</p>
                </div>
            </div>
        );
    }

    let mainProgressBarColor = 'bg-emerald-500';
    if (totalSpentPercent > 90) mainProgressBarColor = 'bg-red-500';
    else if (totalSpentPercent > 75) mainProgressBarColor = 'bg-amber-500';

    return (
        <div className="space-y-6">
            {/* Overall Budget Card */}
            <div className="bg-zinc-800/50 p-6 rounded-2xl shadow-lg border border-zinc-700/50">
                <div className="flex justify-between items-end mb-4">
                    <div>
                        <h2 className="text-lg font-semibold text-zinc-300 mb-1">Total Monthly Budget</h2>
                        <p className="text-4xl font-bold text-white">
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'BRL' }).format(totalMonthlyExpenses)}
                            <span className="text-xl text-zinc-500 font-normal"> / {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 }).format(monthlyBudget)}</span>
                        </p>
                    </div>
                    <div className="text-right">
                        <p className={`text-lg font-bold ${remainingBudget < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'BRL' }).format(remainingBudget)} Left
                        </p>
                    </div>
                </div>
                <div className="w-full bg-zinc-700 rounded-full h-4 mb-2">
                    <div 
                        className={`h-4 rounded-full transition-all duration-500 ${mainProgressBarColor}`} 
                        style={{ width: `${totalSpentPercent}%` }}
                    ></div>
                </div>
                <p className="text-sm text-zinc-400 text-right">{totalSpentPercent.toFixed(1)}% used</p>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {budgetConfig.map(category => {
                    const allocated = monthlyBudget * category.percentage;
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
                        <div key={category.name} className="bg-zinc-800/50 p-4 rounded-xl shadow-lg border border-zinc-700/50 flex flex-col justify-between">
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
                                        <span className="text-xs font-mono px-2 py-1 bg-zinc-700 rounded text-zinc-300">{category.percentage * 100}%</span>
                                        {isExpanded ? <ChevronUpIcon className="w-5 h-5 text-zinc-400" /> : <ChevronDownIcon className="w-5 h-5 text-zinc-400" />}
                                    </div>
                                </div>
                                
                                <div className="text-right mb-2">
                                     <p className="text-lg font-bold text-white">
                                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'BRL' }).format(spent)}
                                         <span className="text-sm text-zinc-500"> / {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(allocated)}</span>
                                    </p>
                                </div>

                                <div className="w-full bg-zinc-700 rounded-full h-2 mb-2">
                                    <div 
                                        className={`h-2 rounded-full transition-all duration-500 ${progressBarColor}`} 
                                        style={{ width: `${spentPercent}%` }}
                                    ></div>
                                </div>
                                <p className={`text-sm text-right font-medium ${remaining < 0 ? 'text-red-400' : 'text-zinc-400'}`}>
                                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'BRL' }).format(remaining)} Left
                                </p>
                            </button>

                            {isExpanded && (
                                <div id={`budget-details-${category.name}`} className="mt-4 border-t border-zinc-700 pt-3 animate-fade-in-down">
                                    {categoryTransactions.length > 0 ? (
                                        <ul className="space-y-2 max-h-40 overflow-y-auto pr-2">
                                            {categoryTransactions.map(tx => (
                                                <li key={tx.id} className="flex justify-between items-center text-sm">
                                                    <div>
                                                        <p className="font-medium text-zinc-200 truncate max-w-[150px]">{tx.description}</p>
                                                        <p className="text-xs text-zinc-500">{new Date(tx.date).toLocaleDateString()}</p>
                                                    </div>
                                                    <p className="font-semibold text-red-400">
                                                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'BRL' }).format(tx.amount ?? 0)}
                                                    </p>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-sm text-zinc-500 text-center py-2">No expenses this month.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default BudgetTracker;