import React, { useState, useMemo } from 'react';
// FIX: Changed import to use RecurringPayment and RecurringPaymentType from types.ts instead of the non-existent Subscription type.
import { RecurringPayment, RecurringPaymentType, TransactionCategory } from '../types';
import { PlusIcon, XIcon } from './icons';

interface SubscriptionManagerProps {
    // FIX: Updated the type for subscriptions to be an array of RecurringPayment.
    subscriptions: RecurringPayment[];
    setSubscriptions: React.Dispatch<React.SetStateAction<RecurringPayment[]>>;
}

const SubscriptionManager: React.FC<SubscriptionManagerProps> = ({ subscriptions, setSubscriptions }) => {
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

    const handleAddSubscription = (e: React.FormEvent) => {
        e.preventDefault();
        const numericAmount = parseFloat(amount);
        if (!name || !numericAmount || numericAmount <= 0) return;

        // FIX: Updated the new subscription object to match the RecurringPayment type, including adding the 'type' property.
        // FIX: Add missing properties 'category' and 'paymentMethod' to satisfy the RecurringPayment type.
        const newSubscription: RecurringPayment = {
            id: crypto.randomUUID(),
            name,
            amount: numericAmount,
            billingCycle,
            nextPaymentDate: new Date().toISOString(), // Simplified next payment date
            type: RecurringPaymentType.Subscription,
            category: TransactionCategory.Bills,
            paymentMethod: 'credit',
        };
        setSubscriptions(prev => [...prev, newSubscription]);
        setName('');
        setAmount('');
    };
    
    const handleDeleteSubscription = (id: string) => {
        setSubscriptions(prev => prev.filter(sub => sub.id !== id));
    };

    const totalMonthlyCost = useMemo(() => {
        return subscriptions.reduce((total, sub) => {
            return total + (sub.billingCycle === 'monthly' ? sub.amount : sub.amount / 12);
        }, 0);
    }, [subscriptions]);

    return (
        <div className="bg-zinc-800/50 p-6 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold text-white mb-4">Subscriptions</h2>
            <div className="bg-zinc-900/50 p-4 rounded-lg mb-4">
                <p className="text-zinc-400 text-sm">Total Monthly Cost</p>
                <p className="text-2xl font-bold text-cyan-400">
                     {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalMonthlyCost)}
                </p>
            </div>

            <div className="space-y-2 max-h-[150px] overflow-y-auto mb-4 pr-2">
                 {subscriptions.map(sub => (
                    <div key={sub.id} className="group flex justify-between items-center bg-zinc-700/50 p-2 rounded-md">
                        <div>
                            <p className="font-semibold">{sub.name}</p>
                            <p className="text-xs text-zinc-400">{sub.billingCycle}</p>
                        </div>
                         <div className="flex items-center gap-3">
                            <p className="font-bold text-zinc-200">
                                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(sub.amount)}
                            </p>
                             <button onClick={() => handleDeleteSubscription(sub.id)} className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-white transition-opacity">
                                <XIcon className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <form onSubmit={handleAddSubscription} className="space-y-3">
                <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Subscription Name"
                    className="w-full bg-zinc-700 border-zinc-600 rounded-lg p-2 text-white"
                />
                <div className="flex gap-2">
                    <input
                        type="number"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        placeholder="Amount"
                        className="w-2/3 bg-zinc-700 border-zinc-600 rounded-lg p-2 text-white"
                    />
                    <select
                        value={billingCycle}
                        onChange={e => setBillingCycle(e.target.value as 'monthly' | 'yearly')}
                        className="w-1/3 bg-zinc-700 border-zinc-600 rounded-lg p-2 text-white"
                    >
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                    </select>
                </div>
                 <button type="submit" className="w-full flex items-center justify-center gap-2 bg-zinc-600 hover:bg-zinc-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                    <PlusIcon /> Add Subscription
                </button>
            </form>
        </div>
    );
};

export default SubscriptionManager;