import React from 'react';
import { SortOption } from '../types/insurance';
import { ArrowUpDown, TrendingDown, TrendingUp, Building2, IndianRupee, Wallet, CreditCard } from 'lucide-react';

interface SortControlsProps {
  sortOption: SortOption;
  onSortChange: (option: SortOption) => void;
}

const SortControls: React.FC<SortControlsProps> = ({ sortOption, onSortChange }) => {
  const sortOptions = [
    { value: 'premium-asc' as SortOption, label: 'Premium (Low to High)', icon: TrendingDown, color: 'from-green-500 to-green-600' },
    { value: 'premium-desc' as SortOption, label: 'Premium (High to Low)', icon: TrendingUp, color: 'from-red-500 to-red-600' },
    { value: 'payout-asc' as SortOption, label: 'Payout (Low to High)', icon: Wallet, color: 'from-blue-500 to-blue-600' },
    { value: 'payout-desc' as SortOption, label: 'Payout (High to Low)', icon: CreditCard, color: 'from-purple-500 to-purple-600' },
    { value: 'after-payout-asc' as SortOption, label: 'After Payout (Low to High)', icon: IndianRupee, color: 'from-emerald-500 to-emerald-600' },
    { value: 'after-payout-desc' as SortOption, label: 'After Payout (High to Low)', icon: IndianRupee, color: 'from-orange-500 to-orange-600' },
    { value: 'company-name' as SortOption, label: 'Company Name (A-Z)', icon: Building2, color: 'from-slate-500 to-slate-600' }
  ];

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl p-6 mb-8 border border-white/20">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
          <ArrowUpDown className="text-white" size={20} />
        </div>
        <h3 className="text-xl font-bold text-slate-800">Sort Comparison</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {sortOptions.map(({ value, label, icon: Icon, color }) => (
          <button
            key={value}
            type="button"
            onClick={() => onSortChange(value)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 focus:outline-none ${
              sortOption === value
                ? `bg-gradient-to-r ${color} text-white shadow-lg`
                : 'bg-white/80 text-slate-700 hover:bg-slate-50 border-2 border-transparent hover:border-slate-200 shadow-md hover:shadow-lg'
            }`}
            aria-pressed={sortOption === value}
            aria-label={`Sort by ${label}`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              sortOption === value ? 'bg-white/20' : 'bg-slate-100'
            }`}>
              <Icon size={16} className={sortOption === value ? 'text-white' : 'text-slate-600'} />
            </div>
            <span className="text-sm">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SortControls;