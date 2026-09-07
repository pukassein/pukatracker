import React from 'react';
import DashboardCard from './DashboardCard';
import { Accounts, RecurringPayment } from '../types';
import { BankIcon, CreditCardIcon, WalletIcon, BillsIcon } from './icons';

interface Props { accounts: Accounts | null; recurringPayments: RecurringPayment[]; onEdit: () => void; onInstallments: () => void; }

const money = (n: number, currency: 'BRL' | 'PYG') => new Intl.NumberFormat(currency === 'PYG' ? 'es-PY' : 'pt-BR', { style: 'currency', currency, maximumFractionDigits: currency === 'PYG' ? 0 : 2 }).format(n);

const MacroDashboard: React.FC<Props> = ({ accounts, recurringPayments, onEdit, onInstallments }) => {
  const brl = accounts?.brl || 0;
  const pygOne = accounts?.pyg || 0;
  const pygTwo = accounts?.pyg_bank_2 || 0;
  const card = accounts?.credit_card_balance || 0;
  const planned = recurringPayments.filter(p => p.billingCycle === 'monthly').reduce((s, p) => s + p.amount, 0);
  return <div className="space-y-8">
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div><p className="text-emerald-400 font-semibold">Monthly money view</p><h1 className="text-3xl md:text-4xl font-bold text-white">Where your money stands</h1><p className="text-zinc-400 mt-2">Update these snapshots whenever you want during the month.</p></div>
      <button onClick={onEdit} className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-5 py-3 rounded-xl">Update balances</button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <DashboardCard title="Nubank" amount={brl} icon={<WalletIcon />} color="text-purple-400" currency="BRL" />
      <DashboardCard title="Paraguay Bank 1" amount={pygOne} icon={<BankIcon />} color="text-cyan-400" currency="PYG" />
      <DashboardCard title="Paraguay Bank 2" amount={pygTwo} icon={<BankIcon />} color="text-blue-400" currency="PYG" />
      <DashboardCard title="Nubank Card Debt" amount={card} icon={<CreditCardIcon />} color="text-rose-400" currency="BRL" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-zinc-800/60 p-6 rounded-2xl"><p className="text-zinc-400">Planned monthly bills</p><p className="text-3xl font-bold text-amber-400 mt-2">{money(planned, 'BRL')}</p><p className="text-sm text-zinc-500 mt-2">Rent, Wi‑Fi, subscriptions, and other recurring expenses.</p><button onClick={() => onInstallments()} className="mt-5 text-emerald-400 font-semibold">View future card bills →</button></div>
      <div className="bg-zinc-800/60 p-6 rounded-2xl"><div className="flex items-center gap-3"><BillsIcon className="w-6 h-6 text-amber-400" /><h2 className="text-xl font-bold text-white">Your monthly plan</h2></div><p className="text-zinc-400 mt-3">Use Bills for expenses you expect, and update balances when your real accounts change.</p><button onClick={onEdit} className="mt-5 text-emerald-400 font-semibold">Edit account names and amounts →</button></div>
    </div>
  </div>;
};
export default MacroDashboard;
