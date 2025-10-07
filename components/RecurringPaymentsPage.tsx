
import React, { useState } from 'react';
import { RecurringPayment } from '../types';
import { supabase } from '../supabaseClient';
import { HomeIcon, BuildingIcon, WifiIcon, CheckIcon, LightbulbIcon } from './icons';

interface RecurringPaymentsPageProps {
    recurringPayments: RecurringPayment[];
    setRecurringPayments: React.Dispatch<React.SetStateAction<RecurringPayment[]>>;
    onNotify: (notification: { message: string; type: 'success' | 'error' }) => void;
}

const CHECKLIST_ITEMS = [
    { name: 'Rent', icon: <HomeIcon className="w-6 h-6" /> },
    { name: 'Condominio', icon: <BuildingIcon className="w-6 h-6" /> },
    { name: 'Wifi', icon: <WifiIcon className="w-6 h-6" /> },
    { name: 'Luz', icon: <LightbulbIcon className="w-6 h-6" /> },
];

const RecurringPaymentsPage: React.FC<RecurringPaymentsPageProps> = ({ recurringPayments, setRecurringPayments, onNotify }) => {
    const [viewYear, setViewYear] = useState(new Date().getFullYear());
    const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

    const handleTogglePaidStatus = async (payment: RecurringPayment | undefined, itemName: string, monthString: string) => {
        if (!payment) {
            onNotify({ message: `${itemName} is not set up in your database.`, type: 'error' });
            return;
        }

        const loadingKey = `${payment.id}-${monthString}`;
        setLoadingStates(prev => ({ ...prev, [loadingKey]: true }));

        const isCurrentlyPaid = payment.paidMonths?.includes(monthString);
        const updatedPaidMonths = isCurrentlyPaid
            ? (payment.paidMonths || []).filter(m => m !== monthString)
            : [...(payment.paidMonths || []), monthString];

        const { data: updatedPayment, error } = await supabase
            .from('recurring_payments')
            .update({ paidMonths: updatedPaidMonths })
            .eq('id', payment.id)
            .select()
            .single();

        setLoadingStates(prev => ({ ...prev, [loadingKey]: false }));

        if (error) {
            onNotify({ message: `Failed to update ${payment.name}.`, type: 'error' });
        } else {
            setRecurringPayments(prev => prev.map(p => p.id === payment.id ? updatedPayment as RecurringPayment : p));
            onNotify({ message: `${payment.name} for ${monthString} updated.`, type: 'success' });
        }
    };

    return (
        <div className="max-w-7xl mx-auto">
            <header className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
                <div className="flex items-center gap-4">
                    <h1 className="text-3xl font-bold text-white">Monthly Checklist</h1>
                    <div className="flex items-center gap-2 bg-zinc-800 rounded-lg p-1">
                        <button onClick={() => setViewYear(y => y - 1)} className="px-2 py-1 rounded hover:bg-zinc-700">&lt;</button>
                        <span className="font-bold text-lg w-20 text-center">{viewYear}</span>
                        <button onClick={() => setViewYear(y => y + 1)} className="px-2 py-1 rounded hover:bg-zinc-700">&gt;</button>
                    </div>
                </div>
            </header>

            <div className="space-y-6">
                {CHECKLIST_ITEMS.map(item => {
                    const paymentData = recurringPayments.find(p => p.name.toLowerCase() === item.name.toLowerCase());
                    
                    return (
                        <div key={item.name} className="bg-zinc-800/50 p-4 rounded-2xl flex flex-col md:flex-row md:items-center gap-4">
                            <div className="flex items-center gap-4 w-full md:w-56 flex-shrink-0">
                                <div className="p-3 bg-zinc-700 rounded-full text-emerald-400">
                                    {item.icon}
                                </div>
                                <div>
                                    <p className="font-bold text-lg text-white">{item.name}</p>
                                    {!paymentData && <p className="text-xs text-amber-400">Not found in DB</p>}
                                </div>
                            </div>
                            <div className="grid grid-cols-6 lg:grid-cols-12 gap-2 w-full">
                                {Array.from({ length: 12 }).map((_, i) => {
                                    const month = i + 1;
                                    const monthString = `${viewYear}-${String(month).padStart(2, '0')}`;
                                    const isPaid = paymentData?.paidMonths?.includes(monthString);
                                    const loadingKey = `${paymentData?.id}-${monthString}`;
                                    const isLoading = loadingStates[loadingKey];
                                    
                                    let buttonClass = "bg-zinc-700 hover:bg-zinc-600 text-zinc-400";
                                    if(isPaid) buttonClass = "bg-emerald-600 hover:bg-emerald-500 text-white";
                                    if(!paymentData) buttonClass = "bg-zinc-700 text-zinc-500 cursor-not-allowed";

                                    return (
                                        <button
                                            key={month}
                                            disabled={!paymentData || isLoading}
                                            onClick={() => handleTogglePaidStatus(paymentData, item.name, monthString)}
                                            className={`w-full aspect-square rounded-lg flex items-center justify-center font-bold text-lg transition-colors duration-200 relative ${buttonClass}`}
                                            aria-label={`Mark ${item.name} for month ${month} as ${isPaid ? 'unpaid' : 'paid'}`}
                                        >
                                            {isLoading ? (
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                            ) : isPaid ? (
                                                <CheckIcon className="w-6 h-6" />
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
            </div>
        </div>
    );
};

export default RecurringPaymentsPage;