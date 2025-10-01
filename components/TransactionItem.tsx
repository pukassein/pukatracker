import React from 'react';
import { Transaction, TransactionCategory } from '../types';
import {
    FoodIcon,
    TransportIcon,
    ShoppingIcon,
    BillsIcon,
    EntertainmentIcon,
    HealthIcon,
    IncomeIcon,
    CreditCardPaymentIcon,
    OtherIcon,
    XIcon,
    CreditCardIcon,
    UserIcon,
    TravelIcon,
    DollarSignIcon,
} from './icons';

interface TransactionItemProps {
    transaction: Transaction;
    onDelete: (id: string) => void;
}

const categoryIcons: Record<TransactionCategory, React.ReactNode> = {
    [TransactionCategory.Food]: <FoodIcon />,
    [TransactionCategory.Transport]: <TransportIcon />,
    [TransactionCategory.Shopping]: <ShoppingIcon />,
    [TransactionCategory.Travel]: <TravelIcon />,
    [TransactionCategory.Bills]: <BillsIcon />,
    [TransactionCategory.Entertainment]: <EntertainmentIcon />,
    [TransactionCategory.Health]: <HealthIcon />,
    [TransactionCategory.Income]: <IncomeIcon />,
    [TransactionCategory.CreditCard]: <CreditCardPaymentIcon />,
    [TransactionCategory.Other]: <OtherIcon />,
};


const TransactionItem: React.FC<TransactionItemProps> = ({ transaction, onDelete }) => {
    const isIncome = transaction.type === 'income';
    const amountColor = isIncome ? 'text-green-400' : 'text-red-400';
    const amountPrefix = isIncome ? '+' : '-';

    const currency = transaction.paymentMethod === 'brl_account' ? 'BRL' : 'USD';
    const locale = transaction.paymentMethod === 'brl_account' ? 'pt-BR' : 'en-US';

    const formattedAmount = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
    }).format(transaction.amount);
    
    return (
        <div className="group flex items-center justify-between bg-zinc-800/50 hover:bg-zinc-700 p-3 rounded-lg transition-colors duration-200">
            <div className="flex items-center gap-4">
                <div className="p-2 bg-zinc-700 rounded-full">
                    {categoryIcons[transaction.category] || <OtherIcon />}
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <p className="font-semibold text-white">{transaction.description}</p>
                        {transaction.paymentMethod === 'credit' && transaction.type === 'expense' && (
                            <span title="Paid with Credit Card">
                                <CreditCardIcon className="w-4 h-4 text-zinc-400" />
                            </span>
                        )}
                         {transaction.paymentMethod === 'brl_account' && (
                            <span title="Paid with BRL Account" className="flex items-center text-xs bg-yellow-400/20 text-yellow-300 px-1.5 py-0.5 rounded-full font-bold">
                                R$
                            </span>
                        )}
                        {transaction.owedBy === 'dad' && (
                             <span title="Dad's Expense">
                                <UserIcon className="w-4 h-4 text-zinc-400" />
                            </span>
                        )}
                    </div>
                    <p className="text-xs text-zinc-400">{transaction.category} &middot; {new Date(transaction.date).toLocaleDateString()}</p>

                </div>
            </div>
            <div className="flex items-center gap-4">
                 <p className={`font-bold text-lg ${amountColor}`}>
                    {amountPrefix}{formattedAmount}
                </p>
                <button 
                    onClick={() => onDelete(transaction.id)}
                    className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-white transition-opacity duration-200"
                    aria-label="Delete transaction"
                >
                    <XIcon className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default TransactionItem;