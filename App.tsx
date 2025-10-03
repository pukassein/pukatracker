
import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from './supabaseClient';
import { Transaction, RecurringPayment, SmartPromptData, TransactionCategory, Database, Accounts } from './types';

// Components
import Header from './components/Header';
import DashboardCard from './components/DashboardCard';
import TransactionItem from './components/TransactionItem';
import AddTransactionForm from './components/AddTransactionForm';
import Calculator from './components/Calculator';
import SmartPrompt from './components/SmartPrompt';
import Navigation from './components/Navigation';
import QuickAccess from './components/QuickAccess';
import QuickAddForm from './components/QuickAddForm';
import Notification from './components/Notification';
import EditBalancesModal from './components/EditBalancesModal';
import BillSelectionModal from './components/BillSelectionModal';

// Pages
import DadsExpensesPage from './components/DadsExpensesPage';
import RecurringPaymentsPage from './components/RecurringPaymentsPage';
import TransactionsPage from './components/TransactionsPage';
import ExchangePage from './components/ExchangePage';
import BudgetPage from './components/BudgetPage';

// Icons
import { WalletIcon, DollarSignIcon, CreditCardIcon, RepeatIcon } from './components/icons';

type Page = 'dashboard' | 'recurring' | 'dads-expenses' | 'transactions' | 'exchange' | 'budget';
type Modal = 'add' | 'quick-add' | 'exchange' | 'edit-balances' | 'bill-selection' | null;
type NotificationType = { message: string; type: 'success' | 'error' };
type BillType = 'Rent' | 'Wifi' | 'Condominio' | 'Other';

const App: React.FC = () => {
    // State
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [recurringPayments, setRecurringPayments] = useState<RecurringPayment[]>([]);
    const [accounts, setAccounts] = useState<Database['public']['Tables']['accounts']['Row'] | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState<Page>('dashboard');
    const [activeModal, setActiveModal] = useState<Modal>(null);
    const [isCalculatorOpen, setCalculatorOpen] = useState(false);
    const [isDashboardExpanded, setDashboardExpanded] = useState(false);
    const [smartPrompt, setSmartPrompt] = useState<SmartPromptData | null>(null);
    const [quickAddData, setQuickAddData] = useState<{ category: TransactionCategory, description: string, owedBy?: string } | null>(null);
    const [notification, setNotification] = useState<NotificationType | null>(null);

    // Data Fetching
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const { data: transactionsData, error: transactionsError } = await supabase.from('transactions').select('*').order('date', { ascending: false });
                if (transactionsError) throw transactionsError;
                setTransactions(transactionsData as unknown as Transaction[]);

                const { data: recurringData, error: recurringError } = await supabase.from('recurring_payments').select('*');
                if (recurringError) throw recurringError;
                setRecurringPayments(recurringData as RecurringPayment[]);
                
                const { data: accountsData, error: accountsError } = await supabase.from('accounts').select('*').limit(1).single();
                if (accountsError) throw accountsError;
                setAccounts(accountsData);

            } catch (error) {
                console.error("Error fetching data:", error);
                setNotification({ message: 'Failed to load data.', type: 'error' });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Smart Prompts Logic
    useEffect(() => {
        const now = new Date();
        const hour = now.getHours();
        if (hour >= 8 && hour < 11) {
            setSmartPrompt({ message: "Did you grab a coffee this morning?", category: TransactionCategory.Food, icon: 'coffee' });
        } else if (hour >= 12 && hour < 15) {
            setSmartPrompt({ message: "Time for lunch? Log your expense.", category: TransactionCategory.Food, icon: 'lunch' });
        }
    }, []);

    // Memoized Calculations
    const { monthlyIncome, monthlyExpenses, totalBalance, creditCardDebt } = useMemo(() => {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const currentMonthTxs = transactions.filter(t => new Date(t.date) >= startOfMonth);

        const income = currentMonthTxs
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + (t.amount ?? 0), 0);

        const expenses = currentMonthTxs
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + (t.amount ?? 0), 0);
        
        const balance = transactions.reduce((acc, t) => {
            if (t.type === 'income') return acc + (t.amount ?? 0);
            if (t.type === 'expense' && (t.paymentMethod === 'cash' || t.paymentMethod === 'brl_account')) return acc - (t.amount ?? 0);
            return acc;
        }, 0);
        
        const debt = transactions
            .filter(t => t.type === 'expense' && t.paymentMethod === 'credit')
            .reduce((sum, t) => sum + (t.amount ?? 0), 0);
        const payments = transactions
            .filter(t => t.category === TransactionCategory.CreditCard)
            .reduce((sum, t) => sum + (t.amount ?? 0), 0);

        return {
            monthlyIncome: income,
            monthlyExpenses: expenses,
            totalBalance: balance,
            creditCardDebt: debt - payments
        };
    }, [transactions]);
    
    const monthlyTransactions = useMemo(() => {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        return transactions.filter(t => new Date(t.date) >= startOfMonth);
    }, [transactions]);

    // Handlers
    const handleDashboardToggle = () => setDashboardExpanded(prev => !prev);

    const showNotification = (notif: NotificationType) => {
        setNotification(notif);
        setTimeout(() => setNotification(null), 5300); // slightly longer than the component's own timeout
    };

    const handleAddTransaction = async (transaction: Omit<Transaction, 'id' | 'date'>, date: string) => {
        const { data, error } = await supabase.from('transactions').insert([{...transaction, date}]).select();
        if (error) {
            console.error('Supabase insert error:', error);
            showNotification({ message: 'Failed to add transaction.', type: 'error' });
            return;
        }
        setTransactions(prev => [data[0] as unknown as Transaction, ...prev]);
        showNotification({ message: 'Transaction added!', type: 'success' });
        setActiveModal(null);
        setQuickAddData(null);
    };

    const handleDeleteTransaction = async (id: string) => {
        const { error } = await supabase.from('transactions').delete().eq('id', id);
        if (error) {
            showNotification({ message: 'Failed to delete transaction.', type: 'error' });
            return;
        }
        setTransactions(prev => prev.filter(t => t.id !== id));
        showNotification({ message: 'Transaction deleted.', type: 'success' });
    };
    
    const handleAddExchange = async (pygSold: number, brlReceived: number) => {
        if (!accounts) {
             showNotification({ message: 'Accounts data not loaded.', type: 'error' });
             return;
        }
        // 1. Update account balances in DB
        const newPyg = accounts.pyg - pygSold;
        const newBrl = accounts.brl + brlReceived;
        const { data: updatedAccount, error: accountError } = await supabase.from('accounts').update({ pyg: newPyg, brl: newBrl }).eq('id', accounts.id).select().single();
         if (accountError) {
             showNotification({ message: 'Failed to update accounts.', type: 'error' });
             return;
         }

        // 2. Add exchange transaction to DB
        const newTransaction: Omit<Transaction, 'id'> = {
            type: 'exchange',
            date: new Date().toISOString(),
            pygSold,
            brlReceived
        };
        const { data: newTx, error: txError } = await supabase.from('transactions').insert(newTransaction).select().single();
        if (txError) {
            showNotification({ message: 'Failed to log exchange.', type: 'error' });
            // Rollback account update?
            return;
        }

        // 3. Update local state
        setAccounts(updatedAccount);
        setTransactions(prev => [newTx as unknown as Transaction, ...prev]);
        showNotification({ message: 'Exchange successful!', type: 'success' });
    }

    const handleUpdateBalances = async (newBalances: { pyg: number; brl: number }) => {
        if (!accounts) {
            showNotification({ message: 'Account data not found.', type: 'error' });
            return;
        }
        const { data, error } = await supabase
            .from('accounts')
            .update({ pyg: newBalances.pyg, brl: newBalances.brl })
            .eq('id', accounts.id)
            .select()
            .single();

        if (error) {
            showNotification({ message: 'Failed to update balances.', type: 'error' });
            return;
        }
        setAccounts(data);
        showNotification({ message: 'Balances updated successfully!', type: 'success' });
        setActiveModal(null);
    };


    const handleQuickAdd = (category: TransactionCategory, description: string, owedBy?: string) => {
        setQuickAddData({ category, description, owedBy });
        setActiveModal('quick-add');
    };
    
    const handleSelectBill = (bill: BillType) => {
        setActiveModal(null); // Close selection modal first
        if (bill === 'Other') {
            // Open the full form for a generic bill
            setQuickAddData({ category: TransactionCategory.Bills, description: '' });
            setActiveModal('add');
        } else {
            // Open the quick add form for a specific bill
            setQuickAddData({ category: TransactionCategory.Bills, description: bill });
            setActiveModal('quick-add');
        }
    };

    const renderPage = () => {
        const pageAccounts: Accounts = accounts ? { pyg: accounts.pyg, brl: accounts.brl } : { pyg: 0, brl: 0 };
        switch (currentPage) {
            case 'dashboard':
                return (
                    <>
                        {isDashboardExpanded && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 animate-fade-in-down">
                                <DashboardCard title="Cash Balance" amount={totalBalance} icon={<WalletIcon />} color="text-green-400" currency="USD" />
                                <DashboardCard title="Monthly Income" amount={monthlyIncome} icon={<DollarSignIcon />} color="text-cyan-400" currency="USD" />
                                <DashboardCard title="Monthly Expenses" amount={monthlyExpenses} icon={<CreditCardIcon />} color="text-rose-400" currency="USD" />
                                <DashboardCard title="Credit Card Debt" amount={creditCardDebt} icon={<RepeatIcon />} color="text-amber-400" currency="USD" />
                            </div>
                        )}
                        {smartPrompt && (
                            <SmartPrompt 
                                prompt={smartPrompt}
                                onAddExpense={(category) => { setActiveModal('add'); setQuickAddData({ category, description: '', owedBy: undefined }); setSmartPrompt(null); }}
                                onDismiss={() => setSmartPrompt(null)}
                            />
                        )}
                        <QuickAccess onQuickAdd={handleQuickAdd} onOpenAddModal={() => setActiveModal('add')} onOpenBillSelection={() => setActiveModal('bill-selection')} />
                         <div className="grid grid-cols-1 gap-8">
                             <div className="bg-zinc-800/50 p-6 rounded-2xl shadow-lg">
                                <h2 className="text-2xl font-bold text-white mb-4">Recent Transactions</h2>
                                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                                    {transactions.filter(t => t.type !== 'exchange').slice(0, 10).map(tx => (
                                        <TransactionItem key={tx.id} transaction={tx} onDelete={handleDeleteTransaction} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>
                );
            case 'recurring':
                return <RecurringPaymentsPage 
                    recurringPayments={recurringPayments} 
                    setRecurringPayments={setRecurringPayments} 
                    onNotify={showNotification} 
                />;
            case 'dads-expenses':
                return <DadsExpensesPage transactions={transactions} setTransactions={setTransactions} onSettle={showNotification} />;
            case 'transactions':
                return <TransactionsPage transactions={transactions} onDelete={handleDeleteTransaction} onOpenAddModal={() => setActiveModal('add')} />;
            case 'exchange':
                return <ExchangePage accounts={pageAccounts} transactions={transactions} onAddExchange={handleAddExchange} onOpenEditBalancesModal={() => setActiveModal('edit-balances')} />;
            case 'budget':
                return <BudgetPage monthlyIncome={monthlyIncome} monthlyTransactions={monthlyTransactions} />;
            default:
                return null;
        }
    };

    if (loading) {
        return <div className="bg-zinc-900 min-h-screen flex items-center justify-center text-white">Loading...</div>;
    }

    return (
        <div className="bg-zinc-900 text-zinc-200 min-h-screen font-sans">
            <div className="max-w-7xl mx-auto p-4 md:p-8">
                <Header 
                    onCalculatorToggle={() => setCalculatorOpen(prev => !prev)} 
                    isDashboardExpanded={isDashboardExpanded}
                    onDashboardToggle={handleDashboardToggle}
                />
                <Navigation currentPage={currentPage} onNavigate={(page) => setCurrentPage(page)} />
                <main className="pb-24 md:pb-0">
                    {renderPage()}
                </main>
            </div>
            {isCalculatorOpen && <Calculator onClose={() => setCalculatorOpen(false)} />}
            {activeModal === 'add' && <AddTransactionForm onClose={() => setActiveModal(null)} onAddTransaction={handleAddTransaction} prefillCategory={quickAddData?.category} />}
            {activeModal === 'quick-add' && quickAddData && <QuickAddForm onClose={() => { setActiveModal(null); setQuickAddData(null); }} onAddTransaction={handleAddTransaction} {...quickAddData} />}
            {activeModal === 'edit-balances' && accounts && <EditBalancesModal accounts={accounts} onClose={() => setActiveModal(null)} onSave={handleUpdateBalances} />}
            {activeModal === 'bill-selection' && <BillSelectionModal onClose={() => setActiveModal(null)} onSelect={handleSelectBill} />}
            {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}
        </div>
    );
};

export default App;
