import React, { useState } from 'react';
import { XIcon } from './icons';

interface ExchangeModalProps {
    onClose: () => void;
    onExchange: (pygSold: number, brlReceived: number) => void;
    pygBalance: number;
}

const ExchangeModal: React.FC<ExchangeModalProps> = ({ onClose, onExchange, pygBalance }) => {
    const [pygAmount, setPygAmount] = useState('');
    const [brlAmount, setBrlAmount] = useState('');
    const [error, setError] = useState('');

    const formattedPygBalance = new Intl.NumberFormat('es-PY', {
        style: 'currency',
        currency: 'PYG',
        maximumFractionDigits: 0,
    }).format(pygBalance);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const numericPyg = parseFloat(pygAmount);
        const numericBrl = parseFloat(brlAmount);

        if (!numericPyg || numericPyg <= 0 || !numericBrl || numericBrl <= 0) {
            setError('Please enter valid positive amounts for both currencies.');
            return;
        }

        if (numericPyg > pygBalance) {
            setError('Amount to sell cannot exceed your PYG balance.');
            return;
        }
        
        setError('');
        onExchange(numericPyg, numericBrl);
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true">
            <div className="bg-zinc-800 rounded-2xl shadow-xl w-full max-w-md p-6 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-zinc-400 hover:text-white" aria-label="Close">
                    <XIcon className="w-6 h-6" />
                </button>
                <h2 className="text-2xl font-bold mb-2 text-white text-center">Exchange Currency</h2>
                <p className="text-center text-zinc-400 mb-6 text-sm">
                    Current PYG Balance: {formattedPygBalance}
                </p>
                
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
        </div>
    );
};

export default ExchangeModal;