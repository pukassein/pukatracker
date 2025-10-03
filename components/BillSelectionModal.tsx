
import React from 'react';
import { XIcon, HomeIcon, WifiIcon, BuildingIcon, OtherIcon } from './icons';

type BillType = 'Rent' | 'Wifi' | 'Condominio' | 'Other';

interface BillSelectionModalProps {
    onClose: () => void;
    onSelect: (bill: BillType) => void;
}

const billOptions: { name: BillType; icon: React.ReactNode }[] = [
    { name: 'Rent', icon: <HomeIcon className="w-8 h-8" /> },
    { name: 'Wifi', icon: <WifiIcon className="w-8 h-8" /> },
    { name: 'Condominio', icon: <BuildingIcon className="w-8 h-8" /> },
    { name: 'Other', icon: <OtherIcon className="w-8 h-8" /> },
];

const BillSelectionModal: React.FC<BillSelectionModalProps> = ({ onClose, onSelect }) => {
    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true">
            <div className="bg-zinc-800 rounded-2xl shadow-xl w-full max-w-sm p-6 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-zinc-400 hover:text-white" aria-label="Close">
                    <XIcon className="w-6 h-6" />
                </button>
                <h2 className="text-2xl font-bold mb-6 text-white text-center">Select Bill Type</h2>
                
                <div className="grid grid-cols-2 gap-4">
                    {billOptions.map(option => (
                        <button
                            key={option.name}
                            onClick={() => onSelect(option.name)}
                            className="flex flex-col items-center justify-center gap-2 p-4 bg-zinc-700 hover:bg-zinc-600 rounded-2xl transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 aspect-square text-zinc-200"
                        >
                            {option.icon}
                            <span className="font-semibold text-sm">{option.name}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BillSelectionModal;
