import React from 'react';
import { Transaction } from '../types';
import TransactionItem from './TransactionItem';
import { PlusIcon } from './icons';

interface TransactionsPageProps {
    transactions: Transaction[];
    onDelete: (id: string) => void;
    onOpenAddModal: () => void;
}

const TransactionsPage: React.FC<TransactionsPageProps> = ({ transactions, onDelete, onOpenAddModal }) => {
    const nonExchangeTransactions = transactions.filter(t => t.type !== 'exchange');
    
    return (
        <div className="max-w-7xl mx-auto">
            <header className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-white">Transaction History</h1>
                <button 
                    onClick={onOpenAddModal}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
                >
                    <PlusIcon />
                    Add New
                </button>
            </header>
            
            <div className="bg-zinc-800/50 p-6 rounded-2xl shadow-lg">
                <div className="space-y-3 max-h-[calc(100vh-250px)] overflow-y-auto pr-2">
                    {nonExchangeTransactions.length > 0 ? (
                        nonExchangeTransactions.map(tx => <TransactionItem key={tx.id} transaction={tx} onDelete={onDelete} />)
                    ) : (
                        <div className="text-center py-16">
                            <p className="text-zinc-400">You haven't added any income or expense transactions yet.</p>
                            <p className="text-zinc-500 text-sm">Click "Add New" to get started.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TransactionsPage;