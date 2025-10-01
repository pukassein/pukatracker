import React from 'react';
import { TransactionCategory } from '../types';
import { 
    FoodIcon, 
    TransportIcon, 
    CoffeeIcon, 
    UserIcon, 
    ClothesIcon, 
    TravelIcon, 
    GadgetsIcon, 
    PlusIcon,
    ShoppingIcon,
    BillsIcon,
    EntertainmentIcon,
    HealthIcon
} from './icons';

interface QuickAccessProps {
    onQuickAdd: (category: TransactionCategory, description: string, owedBy?: string) => void;
    onOpenAddModal: () => void;
}

const quickAddItems = [
    { label: 'Eating Out', category: TransactionCategory.Food, description: "Eating Out", icon: <FoodIcon /> },
    { label: 'Coffee', category: TransactionCategory.Food, description: "Coffee", icon: <CoffeeIcon /> },
    { label: 'Groceries', category: TransactionCategory.Food, description: "Groceries", icon: <ShoppingIcon /> },
    { label: 'Transport', category: TransactionCategory.Transport, description: "Transport", icon: <TransportIcon /> },
    { label: 'Bills', category: TransactionCategory.Bills, description: "Bills", icon: <BillsIcon /> },
    { label: 'Entertainment', category: TransactionCategory.Entertainment, description: "Entertainment", icon: <EntertainmentIcon /> },
    { label: 'Health', category: TransactionCategory.Health, description: "Health", icon: <HealthIcon /> },
    { label: 'Travel', category: TransactionCategory.Travel, description: "Travel", icon: <TravelIcon /> },
    { label: 'Clothes', category: TransactionCategory.Shopping, description: "Clothes", icon: <ClothesIcon /> },
    { label: 'Gadgets', category: TransactionCategory.Shopping, description: "Gadgets", icon: <GadgetsIcon /> },
    { label: "Dad's Expense", category: TransactionCategory.Other, description: "Dad's Expense", icon: <UserIcon />, owedBy: 'dad' },
];

const QuickAccess: React.FC<QuickAccessProps> = ({ onQuickAdd, onOpenAddModal }) => {
    return (
        <div className="mb-8">
            <h2 className="text-xl font-bold text-white mb-3">Quick Add</h2>
            <div className="grid grid-cols-4 md:grid-cols-6 gap-3 md:gap-4">
                {quickAddItems.map(item => (
                    <button
                        key={item.label}
                        onClick={() => onQuickAdd(item.category, item.description, item.owedBy)}
                        className="flex flex-col items-center justify-center gap-2 p-3 md:p-4 bg-zinc-800/50 hover:bg-zinc-700/80 rounded-2xl transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 aspect-square"
                        aria-label={`Quick add ${item.label}`}
                    >
                        {item.icon}
                        <span className="font-semibold text-xs md:text-sm text-center text-zinc-300">{item.label}</span>
                    </button>
                ))}
                 <button
                    onClick={onOpenAddModal}
                    className="flex flex-col items-center justify-center gap-2 p-3 md:p-4 bg-zinc-800/50 hover:bg-zinc-700/80 rounded-2xl transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 aspect-square"
                    aria-label="Add other transaction"
                >
                    <PlusIcon />
                    <span className="font-semibold text-xs md:text-sm text-center text-zinc-300">Other</span>
                </button>
            </div>
        </div>
    );
};

export default QuickAccess;