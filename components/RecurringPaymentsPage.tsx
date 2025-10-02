import React, { useState } from 'react';
import { RecurringPayment, Transaction, TransactionCategory, RecurringPaymentType } from '../types';
import { supabase } from '../supabaseClient';
import { ChevronDownIcon, CheckIcon, HomeIcon, BuildingIcon, WifiIcon, RepeatIcon, UndoIcon, PlusIcon, XIcon } from './icons';
import MarkAsPaidModal from './MarkAsPaidModal';
import UnmarkPaidModal from './UnmarkPaidModal';

interface RecurringPaymentsPageProps {
    recurringPayments: RecurringPayment[];
    setRecurringPayments: React.Dispatch<React.SetStateAction<RecurringPayment[]>>;
    transactions: Transaction[];
    setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
    onNotify: (notification: { message: string; type: 'success' | 'error' }) => void;
}

// FIX: Changed ICONS type from Record<string, React.ReactNode> to a more specific
// Record<'rent' | 'condominio' | 'wifi' | 'default', React.ReactElement>. This ensures
// that the keys are strongly typed, fixing an issue where `setIcon` was receiving a generic 'string'.
// It also types the values as React.ReactElement, which allows React.cloneElement to correctly
// infer props and resolves an error about the 'className' property not existing.
const ICONS: Record<'rent' | 'condominio' | 'wifi' | 'default', React.ReactElement> = {
    rent: <HomeIcon className="w-6 h-6" />,
    condominio: <BuildingIcon className="w-6 h-6" />,
    wifi: <WifiIcon className="w-6 h-6" />,
    default: <RepeatIcon className="w-6 h-6" />,
};

const AddNewPaymentForm: React.FC<{
    onAdd: (payment: Omit<RecurringPayment, 'id'>) => void;
    onClose: () => void;
}> = ({ onAdd, onClose }) => {
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState<TransactionCategory>(TransactionCategory.Bills);
    const [paymentMethod, setPaymentMethod] = useState<'cash' | 'credit' | 'brl_account'>('credit');
    const [icon, setIcon] = useState<'rent' | 'condominio' | 'wifi' | 'default'>('default');
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const numericAmount = parseFloat(amount);
        if (!name || !numericAmount || numericAmount <= 0) {
            alert("Please fill out all fields correctly.");
            return;
        }

        const newPayment: Omit<RecurringPayment, 'id'> = {
            name,
            amount: numericAmount,
            category,
            paymentMethod,
            icon,
            startDate,
            paidMonths: [],
            // Defaulting these values, can be expanded later
            type: RecurringPaymentType.Utility,
            billingCycle: 'monthly',
            nextPaymentDate: new Date().toISOString(),
        };
        onAdd(newPayment);
    };
    
    const expenseCategories = Object.values(TransactionCategory).filter(c => c !== TransactionCategory.Income);

    return (
        <div className="bg-zinc-800/50 p-6 rounded-2xl mb-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Add New Bill or Subscription</h2>
                 <button onClick={onClose} className="text-zinc-400 hover:text-white" aria-label="Close form">
                    <XIcon className="w-5 h-5" />
                </button>
            </div>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <input type="text" placeholder="Name (e.g., Netflix)" value={name} onChange={e => setName(e.target.value)} required className="md:col-span-2 lg:col-span-1 w-full bg-zinc-700 border-zinc-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-emerald-500" />
                <input type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} required className="w-full bg-zinc-700 border-zinc-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-emerald-500" />
                <select value={category} onChange={e => setCategory(e.target.value as TransactionCategory)} className="w-full bg-zinc-700 border-zinc-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-emerald-500">
                     {expenseCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <div className="md:col-span-2 lg:col-span-1">
                     <div className="grid grid-cols-3 gap-2 rounded-lg bg-zinc-700 p-1 h-full">
                        <button type="button" onClick={() => setPaymentMethod('cash')} className={`py-2 rounded-md font-semibold text-sm transition-colors ${paymentMethod === 'cash' ? 'bg-zinc-900 text-white' : 'text-zinc-400'}`}>Cash/Debit</button>
                        <button type="button" onClick={() => setPaymentMethod('credit')} className={`py-2 rounded-md font-semibold text-sm transition-colors ${paymentMethod === 'credit' ? 'bg-zinc-900 text-white' : 'text-zinc-400'}`}>Credit Card</button>
                        <button type="button" onClick={() => setPaymentMethod('brl_account')} className={`py-2 rounded-md font-semibold text-sm transition-colors ${paymentMethod === 'brl_account' ? 'bg-zinc-900 text-white' : 'text-zinc-400'}`}>BRL Acct</button>
                    </div>
                </div>
                 <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-zinc-400">Start Date:</label>
                    <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required className="w-full bg-zinc-700 border-zinc-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div className="grid grid-cols-4 gap-2 rounded-lg bg-zinc-700 p-1 md:col-span-2 lg:col-span-1">
                    {(Object.keys(ICONS) as Array<keyof typeof ICONS>).map(iconKey => (
                         <button type="button" key={iconKey} onClick={() => setIcon(iconKey)} className={`py-2 rounded-md flex justify-center items-center transition-colors ${icon === iconKey ? 'bg-zinc-900 text-emerald-400' : 'text-zinc-400 hover:bg-zinc-600'}`}>
                           {React.cloneElement(ICONS[iconKey], { className: 'w-5 h-5' })}
                        </button>
                    ))}
                </div>
                 <button type="submit" className="md:col-span-2 lg:col-span-3 w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-lg transition-colors">
                    Save Payment
                </button>
            </form>
        </div>
    );
};


const RecurringPaymentsPage: React.FC<RecurringPaymentsPageProps> = ({ recurringPayments, setRecurringPayments, transactions, setTransactions, onNotify }) => {
    const [modalState, setModalState] = useState<{ type: 'mark' | 'unmark'; payment: RecurringPayment; year: number; month: number } | null>(null);
    const [viewYear, setViewYear] = useState(new Date().getFullYear());
    const [isAddFormVisible, setAddFormVisible] = useState(false);

    const handleMarkAsPaid = async (transaction: Omit<Transaction, 'id' | 'date'>, date: string, monthString: string) => {
        if (!modalState) return;
        const paymentId = modalState.payment.id;

        const { data: newTx, error: txError } = await supabase.from('transactions').insert({ ...transaction, date }).select().single();
        if (txError) {
            onNotify({ message: "Failed to create transaction.", type: 'error' });
            return;
        }

        const updatedPaidMonths = [...(modalState.payment.paidMonths || []), monthString];
        const { data: updatedPayment, error: paymentError } = await supabase
            .from('recurring_payments')
            .update({ paidMonths: updatedPaidMonths })
            .eq('id', paymentId)
            .select()
            .single();

        if (paymentError) {
            onNotify({ message: "Failed to update payment status.", type: 'error' });
            await supabase.from('transactions').delete().eq('id', newTx.id);
            return;
        }

        setTransactions(prev => [newTx as Transaction, ...prev]);
        setRecurringPayments(prev => prev.map(p => p.id === paymentId ? updatedPayment as RecurringPayment : p));
        onNotify({ message: `${modalState.payment.name} marked as paid.`, type: 'success' });
        setModalState(null);
    };

    const handleUnmarkAsPaid = async (monthString: string) => {
        if (!modalState) return;
        const payment = modalState.payment;

        const transactionToDelete = transactions.find(t => 
            t.description?.startsWith(payment.name) &&
            t.amount === payment.amount &&
            new Date(t.date).getFullYear() === modalState.year &&
            new Date(t.date).getMonth() === modalState.month
        );
        
        if (transactionToDelete) {
             const { error: deleteError } = await supabase.from('transactions').delete().eq('id', transactionToDelete.id);
             if (deleteError) {
                onNotify({ message: "Could not delete associated transaction.", type: 'error' });
                // Don't proceed if we can't delete the transaction
                return;
             }
        }
        
        const updatedPaidMonths = (payment.paidMonths || []).filter(m => m !== monthString);
         const { data: updatedPayment, error: paymentError } = await supabase
            .from('recurring_payments')
            .update({ paidMonths: updatedPaidMonths })
            .eq('id', payment.id)
            .select()
            .single();

        if (paymentError) {
            onNotify({ message: "Failed to update payment status.", type: 'error' });
            // Here you might want to rollback the transaction deletion if possible, though it's complex.
            // For now, we'll just notify the user.
            return;
        }

        if(transactionToDelete) {
            setTransactions(prev => prev.filter(t => t.id !== transactionToDelete.id));
        }
        setRecurringPayments(prev => prev.map(p => p.id === payment.id ? updatedPayment as RecurringPayment : p));
        onNotify({ message: `${payment.name} payment undone.`, type: 'success' });
        setModalState(null);
    };
    
    const handleAddRecurringPayment = async (payment: Omit<RecurringPayment, 'id'>) => {
        const { data, error } = await supabase.from('recurring_payments').insert(payment).select().single();
        if (error) {
            onNotify({ message: 'Failed to add new payment.', type: 'error' });
            return;
        }
        setRecurringPayments(prev => [...prev, data as RecurringPayment]);
        onNotify({ message: 'New recurring payment added!', type: 'success' });
        setAddFormVisible(false);
    };

    return (
        <div className="max-w-7xl mx-auto">
             <header className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
                <div className="flex items-center gap-4">
                    <h1 className="text-3xl font-bold text-white">Bills & Subscriptions</h1>
                     <div className="flex items-center gap-2 bg-zinc-800 rounded-lg p-1">
                        <button onClick={() => setViewYear(y => y - 1)} className="px-2 py-1 rounded hover:bg-zinc-700">&lt;</button>
                        <span className="font-bold text-lg w-20 text-center">{viewYear}</span>
                        <button onClick={() => setViewYear(y => y + 1)} className="px-2 py-1 rounded hover:bg-zinc-700">&gt;</button>
                    </div>
                </div>
                <button 
                    onClick={() => setAddFormVisible(true)}
                    className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
                >
                    <PlusIcon /> Add New
                </button>
            </header>
            
            {isAddFormVisible && <AddNewPaymentForm onAdd={handleAddRecurringPayment} onClose={() => setAddFormVisible(false)} />}

            <div className="space-y-6">
                {recurringPayments.map(p => {
                    const startDate = p.startDate ? new Date(p.startDate) : null;

                    return (
                        <div key={p.id} className="bg-zinc-800/50 p-4 rounded-2xl flex flex-col md:flex-row md:items-center gap-4">
                            <div className="flex items-center gap-4 w-full md:w-64 flex-shrink-0">
                                <div className="p-3 bg-zinc-700 rounded-full text-emerald-400">
                                    {ICONS[p.icon || 'default']}
                                </div>
                                <div>
                                    <p className="font-bold text-lg text-white">{p.name}</p>
                                     <p className="font-bold text-md text-zinc-400">
                                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(p.amount)}
                                    </p>
                                </div>
                            </div>
                            <div className="grid grid-cols-6 lg:grid-cols-12 gap-2 w-full">
                                {Array.from({ length: 12 }).map((_, i) => {
                                    const month = i + 1;
                                    const monthString = `${viewYear}-${String(month).padStart(2, '0')}`;
                                    const monthDate = new Date(`${monthString}-02`);
                                    const today = new Date();
                                    today.setHours(0,0,0,0);


                                    const isPaid = p.paidMonths?.includes(monthString);
                                    const isDisabled = startDate && (startDate.getFullYear() > viewYear || (startDate.getFullYear() === viewYear && startDate.getMonth() > i));
                                    const isOverdue = !isPaid && !isDisabled && monthDate < today;

                                    let buttonClass = "bg-[#F3EAD3] text-black hover:bg-[#EAE0C8]"; // Upcoming (beige)
                                    if(isDisabled) buttonClass = "bg-zinc-700 text-zinc-500 cursor-not-allowed";
                                    else if(isPaid) buttonClass = "bg-emerald-600 text-white";
                                    else if(isOverdue) buttonClass = "bg-rose-600 text-white hover:bg-rose-500";
                                    
                                    return (
                                         <button
                                            key={month}
                                            disabled={isDisabled}
                                            onClick={() => {
                                                if (isPaid) setModalState({ type: 'unmark', payment: p, year: viewYear, month: i });
                                                else setModalState({ type: 'mark', payment: p, year: viewYear, month: i });
                                            }}
                                            className={`w-full aspect-square rounded-lg flex flex-col items-center justify-center font-bold text-sm transition-colors duration-200 ${buttonClass}`}
                                        >
                                            {isPaid ? (
                                                <>
                                                    <span className="text-xs font-normal">PAID</span>
                                                    <span>{String(month).padStart(2, '0')}</span>
                                                </>
                                            ) : (
                                                <span>{String(month).padStart(2, '0')}</span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
                 {recurringPayments.length === 0 && (
                     <div className="text-center py-16 bg-zinc-800/50 rounded-2xl">
                        <p className="text-zinc-400">No recurring bills or subscriptions found.</p>
                        <p className="text-zinc-500 text-sm">Click "Add New" to get started.</p>
                    </div>
                )}
            </div>
            
            {modalState?.type === 'mark' && (
                <MarkAsPaidModal 
                    payment={modalState.payment}
                    month={modalState.month}
                    year={modalState.year}
                    onClose={() => setModalState(null)}
                    onConfirm={handleMarkAsPaid}
                />
            )}
             {modalState?.type === 'unmark' && (
                <UnmarkPaidModal
                    payment={modalState.payment}
                    month={modalState.month}
                    year={modalState.year}
                    onClose={() => setModalState(null)}
                    onConfirm={handleUnmarkAsPaid}
                />
            )}
        </div>
    );
};

export default RecurringPaymentsPage;