import React, { useState, useEffect, useMemo } from 'react';
import { Transaction, Accounts } from '../types';
import { BankIcon, DollarSignIcon, ExchangeIcon, PencilIcon } from './icons';
import DashboardCard from './DashboardCard';

interface ExchangePageProps {
    accounts: Accounts;
    transactions: Transaction[];
    onAddExchange: (pygSold: number, brlReceived: number) => void;
    onOpenEditBalancesModal: () => void;
}

const ExchangePage: React.FC<ExchangePageProps> = ({ accounts, transactions, onAddExchange, onOpenEditBalancesModal }) => {
    const [pygAmount, setPygAmount] = useState('');
    const [brlAmount, setBrlAmount] = useState('');
    const [error, setError] = useState('');
    const [exchangeRate, setExchangeRate] = useState<number | null>(null);
    const [loadingRate, setLoadingRate] = useState(true);

    useEffect(() => {
        const fetchRate = async () => {
            try {
                // Fetch rates with BRL as base
                const response = await fetch('https://open.er-api.com/v6/latest/BRL');
                const data = await response.json();
                if (data && data.rates && data.rates.PYG) {
                    setExchangeRate(data.rates.PYG); // 1 BRL = X PYG
                }
            } catch (err) {
                console.error("Failed to fetch exchange rate", err);
            } finally {
                setLoadingRate(false);
            }
        };
        fetchRate();
    }, []);

    const exchangeHistory = useMemo(() => {
        return transactions.filter(t => t.type === 'exchange');
    }, [transactions]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const numericPyg = parseFloat(pygAmount);
        const numericBrl = parseFloat(brlAmount);

        if (!numericPyg || numericPyg <= 0 || !numericBrl || numericBrl <= 0) {
            setError('Please enter valid positive amounts for both currencies.');
            return;
        }

        if (numericPyg > accounts.pyg) {
            setError('Amount to sell cannot exceed your PYG balance.');
            return;
        }
        
        setError('');
        onAddExchange(numericPyg, numericBrl);
        setPygAmount('');
        setBrlAmount('');
    };

    const pygInBrl = exchangeRate ? accounts.pyg / exchangeRate : 0;
    const totalInBrl = accounts.brl + pygInBrl;

    return (
        <div className="max-w-7xl mx-auto">
            <header className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <ExchangeIcon className="w-8 h-8 text-emerald-400" />
                    <h1 className="text-3xl font-bold text-white">Currency Exchange</h1>
                </div>
                <div className="flex gap-2">
                     <button 
                        onClick={onOpenEditBalancesModal}
                        className="flex items-center justify-center gap-2 bg-zinc-700 hover:bg-zinc-600 text-zinc-200 font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
                    >
                        <PencilIcon className="w-4 h-4" />
                        Edit Balances
                    </button>
                </div>
            </header>

            {/* Total Balance Section */}
            <div className="mb-8 bg-gradient-to-r from-emerald-900/50 to-zinc-900/50 p-6 rounded-2xl border border-emerald-500/20 shadow-lg">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h2 className="text-zinc-400 text-sm font-medium uppercase tracking-wider">Total Net Worth (Estimated)</h2>
                        <div className="text-4xl font-bold text-white mt-1">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalInBrl)}
                        </div>
                        {exchangeRate && (
                            <p className="text-xs text-zinc-500 mt-2">
                                Based on rate: 1 BRL ≈ {new Intl.NumberFormat('es-PY', { maximumFractionDigits: 2 }).format(exchangeRate)} PYG
                            </p>
                        )}
                    </div>
                    <div className="text-right hidden md:block">
                        <div className="text-zinc-400 text-sm">PYG Contribution</div>
                        <div className="text-emerald-400 font-medium">
                            + {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(pygInBrl)}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="relative">
                    <DashboardCard title="PYG Bank Account" amount={accounts.pyg} icon={<BankIcon />} color="text-green-400" currency="PYG" />
                    {exchangeRate && (
                        <div className="absolute top-4 right-4 bg-zinc-800/80 px-2 py-1 rounded text-xs text-zinc-300">
                            ≈ {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(pygInBrl)}
                        </div>
                    )}
                </div>
                <DashboardCard title="BRL Balance" amount={accounts.brl} icon={<DollarSignIcon />} color="text-yellow-400" currency="BRL" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Form Section */}
                <div className="bg-zinc-800/50 p-6 rounded-2xl shadow-lg">
                     <h2 className="text-2xl font-bold mb-4 text-white">Record Exchange</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="pyg-amount" className="block text-sm font-medium text-zinc-300 mb-1">You Sell (PYG)</label>
                            <input
                                id="pyg-amount"
                                type="number"
                                value={pygAmount}
                                onChange={(e) => setPygAmount(e.target.value)}
                                placeholder="₲ 0"
                                className="w-full bg-zinc-700 border-zinc-600 rounded-lg p-3 text-white text-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                required
                                step="any"
                            />
                        </div>
                        <div>
                            <label htmlFor="brl-amount" className="block text-sm font-medium text-zinc-300 mb-1">You Receive (BRL)</label>
                            <input
                                id="brl-amount"
                                type="number"
                                value={brlAmount}
                                onChange={(e) => setBrlAmount(e.target.value)}
                                placeholder="R$ 0.00"
                                className="w-full bg-zinc-700 border-zinc-600 rounded-lg p-3 text-white text-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                required
                                step="0.01"
                            />
                        </div>
                        
                        {error && <p className="text-red-400 text-sm text-center">{error}</p>}

                        <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-lg transition-colors !mt-6">
                            Confirm Exchange
                        </button>
                    </form>
                </div>
                
                {/* History Section */}
                 <div className="bg-zinc-800/50 p-6 rounded-2xl shadow-lg">
                    <h2 className="text-2xl font-bold text-white mb-4">Exchange History</h2>
                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                        {exchangeHistory.length > 0 ? (
                            exchangeHistory.map(tx => {
                                const rate = tx.pygSold && tx.brlReceived ? tx.pygSold / tx.brlReceived : 0;
                                return (
                                <div key={tx.id} className="bg-zinc-700/50 p-3 rounded-lg flex justify-between items-center">
                                    <div>
                                        <div className="flex items-center gap-3 font-semibold text-white">
                                            <span>{new Intl.NumberFormat('es-PY', { style: 'currency', currency: 'PYG', maximumFractionDigits: 0 }).format(tx.pygSold || 0)}</span>
                                            <ExchangeIcon className="w-4 h-4 text-zinc-400"/>
                                            <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(tx.brlReceived || 0)}</span>
                                        </div>
                                        <p className="text-xs text-zinc-400">{new Date(tx.date).toLocaleString()} &middot; Rate: ₲{rate.toFixed(2)}</p>
                                    </div>
                                </div>
                                );
                            })
                        ) : (
                            <div className="text-center py-10">
                                <p className="text-zinc-400">No exchange history yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExchangePage;