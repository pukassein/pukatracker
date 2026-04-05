import React from 'react';
import { Transaction, SmartPromptData, TransactionCategory } from '../types';
import TransactionItem from './TransactionItem';
import { PlusIcon } from './icons';
import QuickAccess from './QuickAccess';
import SmartPrompt from './SmartPrompt';

interface TransactionsPageProps {
    transactions: Transaction[];
    onDelete: (id: string) => void;
    onOpenAddModal: () => void;
    smartPrompt: SmartPromptData | null;
    onAddExpenseFromPrompt: (category: TransactionCategory) => void;
    onDismissPrompt: () => void;
    onQuickAdd: (category: TransactionCategory, description: string, owedBy?: string) => void;
    onOpenBillSelection: () => void;
}

const TransactionsPage: React.FC<TransactionsPageProps> = ({ 
    transactions, 
    onDelete, 
    onOpenAddModal,
    smartPrompt,
    onAddExpenseFromPrompt,
    onDismissPrompt,
    onQuickAdd,
    onOpenBillSelection
}) => {
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

            {smartPrompt && (
                <SmartPrompt 
                    prompt={smartPrompt}
                    onAddExpense={onAddExpenseFromPrompt}
                    onDismiss={onDismissPrompt}
                />
            )}
            
            <div className="mb-8">
                <QuickAccess 
                    onQuickAdd={onQuickAdd} 
                    onOpenAddModal={onOpenAddModal} 
                    onOpenBillSelection={onOpenBillSelection} 
                />
            </div>
            
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