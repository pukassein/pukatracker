
import React from 'react';

interface DashboardCardProps {
    title: string;
    amount: number;
    icon: React.ReactNode;
    color: string;
    currency?: 'USD' | 'PYG' | 'BRL';
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, amount, icon, color, currency = 'USD' }) => {
    
    const formatOptions: Intl.NumberFormatOptions = {
        style: 'currency',
        currency: currency,
    };
    let locale = 'en-US';

    if (currency === 'PYG') {
        locale = 'es-PY';
        formatOptions.maximumFractionDigits = 0;
    } else if (currency === 'BRL') {
        locale = 'pt-BR';
    }

    const formattedAmount = new Intl.NumberFormat(locale, formatOptions).format(amount);

    return (
        <div className="bg-zinc-800/60 p-6 rounded-2xl shadow-lg flex items-start justify-between">
            <div>
                <p className="text-zinc-400 text-sm font-medium mb-1">{title}</p>
                <p className={`text-3xl font-bold ${color}`}>{formattedAmount}</p>
            </div>
            <div className="bg-zinc-700 p-3 rounded-full">
                {icon}
            </div>
        </div>
    );
};

export default DashboardCard;