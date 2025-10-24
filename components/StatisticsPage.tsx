
import React, { useState, useMemo } from 'react';
import { Transaction, TransactionCategory } from '../types';
import {
    PieChartIcon,
    DollarSignIcon,
    CreditCardIcon,
    FoodIcon,
    TransportIcon,
    ShoppingIcon,
    BillsIcon,
    EntertainmentIcon,
    HealthIcon,
    TravelIcon,
    OtherIcon,
} from './icons';
import DashboardCard from './DashboardCard';
import PieChart from './PieChart';
import TransactionItem from './TransactionItem';

interface StatisticsPageProps {
    transactions: Transaction[];
}

// Map categories to icons and colors for consistency
const categoryDetails: Record<string, { icon: React.ReactNode; color: string }> = {
    [TransactionCategory.Food]: { icon: <FoodIcon />, color: '#34D399' }, // emerald-400
    [TransactionCategory.Transport]: { icon: <TransportIcon />, color: '#60A5FA' }, // blue-400
    [TransactionCategory.Shopping]: { icon: <ShoppingIcon />, color: '#F472B6' }, // pink-400
    [TransactionCategory.Travel]: { icon: <TravelIcon />, color: '#818CF8' }, // indigo-400
    [TransactionCategory.Bills]: { icon: <BillsIcon />, color: '#FBBF24' }, // amber-400
    [TransactionCategory.Entertainment]: { icon: <EntertainmentIcon />, color: '#A78BFA' }, // violet-400
    [TransactionCategory.Health]: { icon: <HealthIcon />, color: '#F87171' }, // red-400
    [TransactionCategory.CreditCard]: { icon: <BillsIcon />, color: '#FBBF24' }, // same as bills
    [TransactionCategory.Other]: { icon: <OtherIcon />, color: '#9CA3AF' }, // gray-400
    Default: { icon: <OtherIcon />, color: '#9CA3AF' },
};
const CHART_COLORS = Object.values(categoryDetails).map(d => d.color);

const StatisticsPage: React.FC<StatisticsPageProps> = ({ transactions }) => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const today = now.toISOString().split('T')[0];
    
    const [startDate, setStartDate] = useState(startOfMonth);
    const [endDate, setEndDate] = useState(today);

    const filteredTransactions = useMemo(() => {
        if (!startDate || !endDate) return [];
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0); // Start of the day
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999); // End of the day

        return transactions.filter(t => {
            const txDate = new Date(t.date);
            return txDate >= start && txDate <= end;
        });
    }, [transactions, startDate, endDate]);

    const { totalExpenses, totalIncome, categoryData } = useMemo(() => {
        const expenses = filteredTransactions.filter(t => t.type === 'expense');
        const income = filteredTransactions.filter(t => t.type === 'income');

        const totalExpenses = expenses.reduce((sum, t) => sum + (t.amount ?? 0), 0);
        const totalIncome = income.reduce((sum, t) => sum + (t.amount ?? 0), 0);

        const categoryMap: { [key: string]: number } = {};
        expenses.forEach(tx => {
            const category = tx.category || 'Other';
            if (!categoryMap[category]) {
                categoryMap[category] = 0;
            }
            categoryMap[category] += tx.amount ?? 0;
        });
        
        const categoryData = Object.entries(categoryMap)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);

        return { totalExpenses, totalIncome, categoryData };
    }, [filteredTransactions]);

    return (
        <div className="max-w-7xl mx-auto">
            <header className="flex items-center gap-3 mb-6">
                <PieChartIcon className="w-8 h-8 text-emerald-400" />
                <h1 className="text-3xl font-bold text-white">Spending Analysis</h1>
            </header>

            {/* Date Filters */}
            <div className="bg-zinc-800/50 p-4 rounded-2xl mb-6 flex flex-col md:flex-row gap-4 items-center">
                <div className="flex items-center gap-2">
                    <label htmlFor="start-date" className="text-zinc-400 font-semibold">From:</label>
                    <input 
                        type="date"
                        id="start-date"
                        value={startDate}
                        onChange={e => setStartDate(e.target.value)}
                        className="bg-zinc-700 border-zinc-600 rounded-lg p-2 text-white focus:ring-2 focus:ring-emerald-500"
                    />
                </div>
                <div className="flex items-center gap-2">
                     <label htmlFor="end-date" className="text-zinc-400 font-semibold">To:</label>
                    <input 
                        type="date"
                        id="end-date"
                        value={endDate}
                        onChange={e => setEndDate(e.target.value)}
                        className="bg-zinc-700 border-zinc-600 rounded-lg p-2 text-white focus:ring-2 focus:ring-emerald-500"
                    />
                </div>
            </div>

            {/* Summary Cards */}
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <DashboardCard title="Total Expenses" amount={totalExpenses} icon={<CreditCardIcon />} color="text-rose-400" currency="USD" />
                <DashboardCard title="Total Income" amount={totalIncome} icon={<DollarSignIcon />} color="text-cyan-400" currency="USD" />
                <DashboardCard title="Net Flow" amount={totalIncome - totalExpenses} icon={<DollarSignIcon />} color={totalIncome >= totalExpenses ? "text-green-400" : "text-rose-400"} currency="USD" />
            </div>

            {/* Chart and Category List */}
             <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-8">
                <div className="lg:col-span-3 bg-zinc-800/50 p-6 rounded-2xl shadow-lg flex items-center justify-center">
                    <PieChart data={categoryData} colors={CHART_COLORS} />
                </div>
                <div className="lg:col-span-2 bg-zinc-800/50 p-6 rounded-2xl shadow-lg">
                    <h2 className="text-2xl font-bold text-white mb-4">Top Categories</h2>
                    <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
                        {categoryData.map(cat => {
                            const details = categoryDetails[cat.name] || categoryDetails.Default;
                            const percentage = totalExpenses > 0 ? (cat.value / totalExpenses) * 100 : 0;
                            return (
                                <div key={cat.name}>
                                    <div className="flex justify-between items-center mb-1 text-sm">
                                        <div className="flex items-center gap-2">
                                            {React.cloneElement(details.icon, { className: "w-5 h-5" })}
                                            <span className="font-semibold text-zinc-200">{cat.name}</span>
                                        </div>
                                        <span className="font-semibold text-white">
                                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cat.value)}
                                        </span>
                                    </div>
                                    <div className="w-full bg-zinc-700 rounded-full h-2">
                                        <div
                                            className="h-2 rounded-full"
                                            style={{ width: `${percentage}%`, backgroundColor: details.color }}
                                        ></div>
                                    </div>
                                </div>
                            );
                        })}
                        {categoryData.length === 0 && <p className="text-zinc-500 text-center py-10">No expenses in this period.</p>}
                    </div>
                </div>
            </div>

            {/* Full Transaction List */}
            <div className="bg-zinc-800/50 p-6 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-bold text-white mb-4">Transactions in Period</h2>
                 <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                    {filteredTransactions.filter(t => t.type !== 'exchange').length > 0 ? (
                        filteredTransactions.filter(t => t.type !== 'exchange').map(tx => <TransactionItem key={tx.id} transaction={tx} />)
                    ) : (
                        <div className="text-center py-16">
                            <p className="text-zinc-400">No transactions found for the selected dates.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StatisticsPage;
