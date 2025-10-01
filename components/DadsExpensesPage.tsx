import React, { useMemo } from 'react';
import { Transaction, TransactionCategory } from '../types';
import TransactionItem from './TransactionItem';
import { UserIcon } from './icons';
import { supabase } from '../supabaseClient';

interface DadsExpensesPageProps {
    transactions: Transaction[];
    setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
    onSettle: (notification: { message: string; type: 'success' | 'error' }) => void;
}

const DadsExpensesPage: React.FC<DadsExpensesPageProps> = ({ transactions, setTransactions, onSettle }) => {
    
    const dadsTransactions = useMemo(() => {
        return transactions.filter(t => t.owedBy === 'dad');
    }, [transactions]);

    const totalOwed = useMemo(() => {
        return dadsTransactions.reduce((acc, t) => acc + (t.amount ?? 0), 0);
    }, [dadsTransactions]);

    const handleDelete = async (id: string) => {
        const { error } = await supabase.from('transactions').delete().eq('id', id);
        if (error) {
            onSettle({ message: "Failed to delete transaction.", type: 'error' });
            return;
        }
        setTransactions(prev => prev.filter(t => t.id !== id));
        onSettle({ message: "Transaction deleted.", type: 'success' });
    };

    const handleSettleDebt = async () => {
        if (totalOwed <= 0) return;

        // 1. Delete all of Dad's existing debt transactions from DB
        const { error: deleteError } = await supabase.from('transactions').delete().eq('owedBy', 'dad');
        if (deleteError) {
            onSettle({ message: "Error clearing old debts.", type: 'error' });
            return;
        }

        // 2. Add a single new income transaction to the DB
        const newIncomeTransaction: Omit<Transaction, 'id'> = {
            type: 'income',
            amount: totalOwed,
            description: "Dad settled his debt",
            category: TransactionCategory.Income,
            date: new Date().toISOString(),
        };
        const { data: newTx, error: insertError } = await supabase.from('transactions').insert(newIncomeTransaction).select().single();

        if (insertError) {
             onSettle({ message: "Error adding settlement income.", type: 'error' });
             // Here you might want to handle the case where deletion succeeded but insertion failed
             return;
        }

        // 3. Update local state
        const remainingTransactions = transactions.filter(t => t.owedBy !== 'dad');
        setTransactions([newTx as unknown as Transaction, ...remainingTransactions]);
        
        onSettle({ message: "Dad's debt has been settled!", type: 'success' });
    };

    return (
        <div className="max-w-7xl mx-auto">
            <header className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <UserIcon className="w-8 h-8 text-emerald-400" />
                    <h1 className="text-3xl font-bold text-white">Dad's Expenses</h1>
                </div>
                {totalOwed > 0 && (
                     <button 
                        onClick={handleSettleDebt}
                        className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
                    >
                        Settle Debt ({new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalOwed)})
                    </button>
                )}
            </header>
            
            <div className="bg-zinc-800/50 p-6 rounded-2xl shadow-lg mb-8">
                <p className="text-zinc-400 text-sm font-medium mb-1">Total Amount Owed by Dad</p>
                <p className={`text-3xl font-bold text-amber-400`}>
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalOwed)}
                p>
            </div>

            <div className="bg-zinc-800/50 p-6 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-bold text-white mb-4">Transaction History</h2>
                 <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                    {dadsTransactions.length > 0 ? (
                        dadsTransactions.map(tx => <TransactionItem key={tx.id} transaction={tx} onDelete={handleDelete} />)
                    ) : (
                        <div className="text-center py-16">
                            <p className="text-zinc-400">No expenses logged for Dad yet.</p>
                            <p className="text-zinc-500 text-sm">Use the "Quick Add" button on the dashboard.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DadsExpensesPage;