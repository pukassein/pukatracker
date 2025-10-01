
import React from 'react';
import { SmartPromptData, TransactionCategory } from '../types';
import { CoffeeIcon, LunchIcon, XIcon } from './icons';

interface SmartPromptProps {
    prompt: SmartPromptData;
    onAddExpense: (category: TransactionCategory) => void;
    onDismiss: () => void;
}

const icons: Record<'coffee' | 'lunch', React.ReactNode> = {
    coffee: <CoffeeIcon />,
    lunch: <LunchIcon />,
};

const SmartPrompt: React.FC<SmartPromptProps> = ({ prompt, onAddExpense, onDismiss }) => {
    return (
        <div className="bg-zinc-800/80 backdrop-blur-sm border border-zinc-700 p-4 rounded-2xl mb-6 flex items-center justify-between max-w-2xl mx-auto shadow-lg">
            <div className="flex items-center gap-4">
                <div className="text-yellow-400">
                    {icons[prompt.icon]}
                </div>
                <p className="text-zinc-200">{prompt.message}</p>
            </div>
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onAddExpense(prompt.category)}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold py-2 px-3 rounded-lg transition-colors"
                >
                    Add Expense
                </button>
                <button
                    onClick={onDismiss}
                    className="p-2 text-zinc-400 hover:text-white rounded-full transition-colors"
                    aria-label="Dismiss prompt"
                >
                    <XIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default SmartPrompt;