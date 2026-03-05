
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
import BillSelectionModal from './components/BillSelectionModal';
import EditBalancesModal from './components/EditBalancesModal';

// Pages
import RecurringPaymentsPage from './components/RecurringPaymentsPage';
import TransactionsPage from './components/TransactionsPage';
import BudgetPage from './components/BudgetPage';
import StatisticsPage from './components/StatisticsPage';
import ExchangePage from './components/ExchangePage';

// Icons
import { WalletIcon, DollarSignIcon, CreditCardIcon, RepeatIcon } from './components/icons';

type Page = 'dashboard' | 'recurring' | 'transactions' | 'budget' | 'statistics' | 'exchange';
type Modal = 'add' | 'quick-add' | 'bill-selection' | 'edit-balances' | null;
type NotificationType = { message: string; type: 'success' | 'error' };
type BillType = 'Rent' | 'Wifi' | 'Condominio' | 'Other';

const App: React.FC = () => {
    // State
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [recurringPayments, setRecurringPayments] = useState<RecurringPayment[]>([]);
    const [accounts, setAccounts] = useState<Accounts | null>(null);
    const [accountsError, setAccountsError] = useState<string | null>(null);
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

                const { data: accountsData, error: accountsError } = await supabase.from('accounts').select('*').single();
                
                if (accountsError && accountsError.code !== 'PGRST116') { // PGRST116 is "The result contains 0 rows"
                     throw accountsError;
                }

                if (accountsData) {
                    setAccounts(accountsData as Accounts);
                } else {
                    // Create default account if none exists
                    const { data: newAccount, error: createError } = await supabase.from('accounts').insert([{ pyg: 0, brl: 0 }]).select().single();
                    if (createError) throw createError;
                    setAccounts(newAccount as Accounts);
                }
                
            } catch (error: any) {
                console.error("Error fetching data:", error);
                setNotification({ message: 'Failed to load data.', type: 'error' });
                setAccountsError(error.message || 'Unknown error loading data');
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

    const parseTransactionDate = (dateString: string): Date => {
        // Handles UTC timestamps that may be stored without timezone info in the DB.
        // Appending 'Z' ensures they are parsed as UTC, not local time.
        const normalizedDateStr = dateString.replace(' ', 'T');
        if (normalizedDateStr.endsWith('Z') || /[\+\-]\d{2}:\d{2}$/.test(normalizedDateStr)) {
            return new Date(normalizedDateStr);
        }
        return new Date(normalizedDateStr + 'Z');
    };
    
    // Memoized Calculations
    const { monthlyIncome, monthlyExpenses, totalBalance, creditCardDebt } = useMemo(() => {
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();

        const currentMonthTxs = transactions.filter(t => {
            const txDate = parseTransactionDate(t.date);
            return txDate.getFullYear() === currentYear && txDate.getMonth() === currentMonth;
        });

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
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();
        return transactions.filter(t => {
            const txDate = parseTransactionDate(t.date);
            return txDate.getFullYear() === currentYear && txDate.getMonth() === currentMonth;
        });
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

    const handleUpdateBalances = async (newBalances: { pyg: number; brl: number }) => {
        if (!accounts) return;
        
        const { data, error } = await supabase
            .from('accounts')
            .update(newBalances)
            .eq('id', accounts.id)
            .select()
            .single();

        if (error) {
            console.error('Error updating balances:', error);
            showNotification({ message: 'Failed to update balances.', type: 'error' });
            return;
        }

        setAccounts(data as Accounts);
        showNotification({ message: 'Balances updated successfully!', type: 'success' });
        setActiveModal(null);
    };

    const handleAddExchange = async (pygSold: number, brlReceived: number) => {
        if (!accounts) return;

        // 1. Create transaction record
        const transaction = {
            type: 'exchange',
            date: new Date().toISOString(),
            pygSold,
            brlReceived,
            description: 'Currency Exchange',
            category: TransactionCategory.Other, // Or a specific 'Exchange' category if added
        };

        const { data: txData, error: txError } = await supabase.from('transactions').insert([transaction]).select();

        if (txError) {
            console.error('Error adding exchange transaction:', txError);
            showNotification({ message: 'Failed to record exchange.', type: 'error' });
            return;
        }

        // 2. Update account balances
        const newPygBalance = accounts.pyg - pygSold;
        const newBrlBalance = accounts.brl + brlReceived;

        const { data: accData, error: accError } = await supabase
            .from('accounts')
            .update({ pyg: newPygBalance, brl: newBrlBalance })
            .eq('id', accounts.id)
            .select()
            .single();

        if (accError) {
            console.error('Error updating account balances after exchange:', accError);
            showNotification({ message: 'Failed to update balances.', type: 'error' });
            // Ideally rollback transaction here, but for simplicity we'll just notify
            return;
        }

        setTransactions(prev => [txData[0] as unknown as Transaction, ...prev]);
        setAccounts(accData as Accounts);
        showNotification({ message: 'Exchange recorded successfully!', type: 'success' });
    };

    const renderPage = () => {
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
            case 'transactions':
                return <TransactionsPage transactions={transactions} onDelete={handleDeleteTransaction} onOpenAddModal={() => setActiveModal('add')} />;
            case 'budget':
                return <BudgetPage monthlyIncome={monthlyIncome} monthlyTransactions={monthlyTransactions} />;
            case 'statistics':
                return <StatisticsPage transactions={transactions} />;
            case 'exchange':
                if (accountsError) {
                    return (
                        <div className="flex flex-col items-center justify-center h-64 text-center">
                            <div className="text-red-400 text-xl font-bold mb-2">Unable to load Exchange</div>
                            <p className="text-zinc-400 mb-4 max-w-md">
                                We couldn't load your account balances. This might be due to a network issue or missing database configuration.
                            </p>
                            <div className="bg-zinc-800 p-4 rounded-lg text-left mb-6 max-w-md w-full overflow-auto">
                                <p className="text-xs text-zinc-500 font-mono">Error details: {accountsError}</p>
                            </div>
                            <button 
                                onClick={() => window.location.reload()}
                                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors"
                            >
                                Reload Page
                            </button>
                        </div>
                    );
                }
                return accounts ? (
                    <ExchangePage 
                        accounts={accounts} 
                        transactions={transactions} 
                        onAddExchange={handleAddExchange} 
                        onOpenEditBalancesModal={() => setActiveModal('edit-balances')} 
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-zinc-400">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500 mb-4"></div>
                        <p>Loading your accounts...</p>
                    </div>
                );
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
            {activeModal === 'bill-selection' && <BillSelectionModal onClose={() => setActiveModal(null)} onSelect={handleSelectBill} />}
            {activeModal === 'edit-balances' && accounts && <EditBalancesModal accounts={accounts} onClose={() => setActiveModal(null)} onSave={handleUpdateBalances} />}
            {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}
        </div>
    );
};

export default App;
