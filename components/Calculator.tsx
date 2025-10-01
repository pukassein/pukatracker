
import React, { useState } from 'react';
import { XIcon } from './icons';

interface CalculatorProps {
    onClose: () => void;
}

const Calculator: React.FC<CalculatorProps> = ({ onClose }) => {
    const [display, setDisplay] = useState('0');
    
    const handleButtonClick = (value: string) => {
        if (value === 'C') {
            setDisplay('0');
        } else if (value === '=') {
            try {
                // Using eval is not safe for production apps with user input, but fine for this controlled calculator.
                // eslint-disable-next-line no-eval
                const result = eval(display.replace(/×/g, '*').replace(/÷/g, '/'));
                setDisplay(String(result));
            } catch (error) {
                setDisplay('Error');
            }
        } else if (value === 'DEL') {
             setDisplay(display.length > 1 ? display.slice(0, -1) : '0');
        } else {
            if (display === '0' || display === 'Error') {
                setDisplay(value);
            } else {
                setDisplay(display + value);
            }
        }
    };
    
    const buttons = [
        'C', '÷', '×', 'DEL',
        '7', '8', '9', '-',
        '4', '5', '6', '+',
        '1', '2', '3', '=',
        '0', '.',
    ];

    const getButtonClass = (btn: string) => {
        if (['÷', '×', '-', '+', '='].includes(btn)) {
            return 'bg-emerald-600 hover:bg-emerald-700';
        }
        if (btn === 'C' || btn === 'DEL') {
            return 'bg-zinc-600 hover:bg-zinc-700';
        }
        return 'bg-zinc-700 hover:bg-zinc-600';
    };

    return (
        <div className="fixed bottom-8 right-8 z-50 bg-zinc-800 rounded-2xl shadow-2xl w-80 border border-zinc-700">
            <div className="flex justify-between items-center p-4 border-b border-zinc-700">
                <h3 className="font-bold text-lg">Calculator</h3>
                <button onClick={onClose} className="text-zinc-400 hover:text-white">
                    <XIcon className="w-5 h-5" />
                </button>
            </div>
            <div className="p-4">
                <div className="bg-zinc-900 rounded-lg p-4 text-right text-4xl font-mono mb-4 break-words">
                    {display}
                </div>
                <div className="grid grid-cols-4 gap-2">
                    {buttons.map(btn => (
                        <button
                            key={btn}
                            onClick={() => handleButtonClick(btn)}
                            className={`p-4 rounded-lg text-xl font-semibold transition-colors ${getButtonClass(btn)} ${btn === '0' || btn === '=' ? 'col-span-2' : ''}`}
                        >
                            {btn}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Calculator;