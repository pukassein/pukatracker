
import React from 'react';
import { CalculatorIcon } from './icons/CalculatorIcon';

interface HeaderProps {
    onCalculatorToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onCalculatorToggle }) => {
    return (
        <header className="flex justify-between items-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                puka<span className="text-emerald-400">money</span>
                <span className="text-lg md:text-xl font-medium text-zinc-400 ml-2">tracker</span>
            </h1>
            <button
                onClick={onCalculatorToggle}
                className="p-3 bg-zinc-800 hover:bg-zinc-700 rounded-full transition-colors duration-300"
                aria-label="Open calculator"
            >
                <CalculatorIcon />
            </button>
        </header>
    );
};

export default Header;