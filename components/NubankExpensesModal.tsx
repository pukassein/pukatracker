import React from 'react';
import { RecurringPayment } from '../types';
import { XIcon, BillsIcon } from './icons';

interface Props { recurringPayments: RecurringPayment[]; onClose: () => void; }

const format = (amount: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount);

const NubankExpensesModal: React.FC<Props> = ({ recurringPayments, onClose }) => {
  const now = new Date();
  const thisMonth = now.toLocaleString('en-US', { month: 'long' });
  const next = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const nextMonth = next.toLocaleString('en-US', { month: 'long' });
  const monthly = recurringPayments.filter(p => p.billingCycle === 'monthly');
  const total = monthly.reduce((sum, payment) => sum + payment.amount, 0);
  const list = (month: string) => <div className="space-y-3"><h3 className="text-lg font-bold text-white capitalize">{month}</h3>{monthly.length ? monthly.map(payment => <div key={`${month}-${payment.id}`} className="flex items-center justify-between bg-zinc-700/60 rounded-xl px-4 py-3"><div className="flex items-center gap-3"><BillsIcon className="w-5 h-5 text-amber-400" /><span className="text-zinc-200">{payment.name}</span></div><span className="font-semibold text-white">{format(payment.amount)}</span></div>) : <p className="text-zinc-500">No planned expenses.</p>}</div>;
  return <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true"><div className="bg-zinc-800 rounded-2xl shadow-xl w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto"><button onClick={onClose} className="absolute top-4 right-4 text-zinc-400 hover:text-white" aria-label="Close"><XIcon className="w-6 h-6" /></button><h2 className="text-2xl font-bold text-white mb-1">Nubank planned expenses</h2><p className="text-zinc-400 mb-6">Recurring expenses expected on your Nubank account or card.</p>{list(thisMonth)}<div className="border-t border-zinc-700 my-6" />{list(nextMonth)}<div className="mt-6 pt-4 border-t border-zinc-700 flex justify-between"><span className="text-zinc-400">Monthly total</span><span className="font-bold text-amber-400">{format(total)}</span></div></div></div>;
};
export default NubankExpensesModal;
