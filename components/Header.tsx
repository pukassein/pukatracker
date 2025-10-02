
import React from 'react';
import { CalculatorIcon } from './icons/CalculatorIcon';
import { ChevronDownIcon, ChevronUpIcon } from './icons';

interface HeaderProps {
    onCalculatorToggle: () => void;
    isDashboardExpanded: boolean;
    onDashboardToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onCalculatorToggle, isDashboardExpanded, onDashboardToggle }) => {
    return (
        <header className="flex justify-between items-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                puka<span className="text-emerald-400">money</span>
                <span className="text-lg md:text-xl font-medium text-zinc-400 ml-2">tracker</span>
            </h1>
            <div className="flex items-center gap-2">
                 <button
                    onClick={onDashboardToggle}
                    className="p-3 bg-zinc-800 hover:bg-zinc-700 rounded-full transition-colors duration-300"
                    aria-label={isDashboardExpanded ? "Collapse dashboard" : "Expand dashboard"}
                >
                    {isDashboardExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
                </button>
                <button
                    onClick={onCalculatorToggle}
                    className="p-3 bg-zinc-800 hover:bg-zinc-700 rounded-full transition-colors duration-300"
                    aria-label="Open calculator"
                >
                    <CalculatorIcon />
                </button>
            </div>
        </header>
    );
};

export default Header;
