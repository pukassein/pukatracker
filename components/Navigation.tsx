import React from 'react';
import { DashboardIcon, BillsIcon, UserIcon, ListIcon, TargetIcon, PieChartIcon } from './icons';

type Page = 'dashboard' | 'recurring' | 'transactions' | 'budget' | 'statistics';

interface NavigationProps {
    currentPage: Page;
    onNavigate: (page: Page) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage, onNavigate }) => {
    const navItems = [
        { page: 'dashboard', label: 'Dashboard', icon: <DashboardIcon className="w-6 h-6" /> },
        { page: 'transactions', label: 'History', icon: <ListIcon className="w-6 h-6" /> },
        { page: 'statistics', label: 'Analysis', icon: <PieChartIcon className="w-6 h-6" /> },
        { page: 'budget', label: 'Budget', icon: <TargetIcon className="w-6 h-6" /> },
        { page: 'recurring', label: 'Bills & Subs', icon: <BillsIcon className="w-6 h-6" /> },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-zinc-800/80 backdrop-blur-sm border-t border-zinc-700 z-40 md:relative md:bg-transparent md:border-none md:mb-8 md:z-auto">
            <div className="max-w-7xl mx-auto flex justify-around md:justify-start md:gap-4">
                {navItems.map(item => (
                    <button
                        key={item.page}
                        onClick={() => onNavigate(item.page as Page)}
                        className={`flex-1 md:flex-none flex flex-col md:flex-row items-center justify-center md:justify-start gap-2 py-2 md:py-3 px-4 md:rounded-lg transition-colors duration-300 ${
                            currentPage === item.page
                                ? 'text-emerald-400 md:bg-zinc-700/50'
                                : 'text-zinc-400 hover:text-white hover:md:bg-zinc-700/50'
                        }`}
                    >
                        {item.icon}
                        <span className="text-xs md:text-sm font-semibold">{item.label}</span>
                    </button>
                ))}
            </div>
        </nav>
    );
};

export default Navigation;