import React from 'react';
import { InsuranceCompany, SortOption } from '../types/insurance';
import { Trophy, IndianRupee, Star, TrendingDown, TrendingUp, Wallet, CreditCard, Sparkles, Shield, CheckCircle } from 'lucide-react';
import { addOnFeatures } from '../data/addOnFeatures';

interface BestOptionCardProps {
  bestOption: InsuranceCompany | null;
  sortOption: SortOption;
  totalCompanies: number;
  selectedAddOns: string[];
}

const BestOptionCard: React.FC<BestOptionCardProps> = ({ bestOption, sortOption, totalCompanies, selectedAddOns }) => {
  if (!bestOption) return null;

  const getSortDescription = () => {
    switch (sortOption) {
      case 'premium-asc':
        return `Lowest premium at ₹${bestOption.totalPremiumPayable ? new Intl.NumberFormat('en-IN').format(bestOption.totalPremiumPayable) : 'N/A'}`;
      case 'premium-desc':
        return `Highest premium at ₹${bestOption.totalPremiumPayable ? new Intl.NumberFormat('en-IN').format(bestOption.totalPremiumPayable) : 'N/A'}`;
      case 'payout-asc':
        return `Lowest payout at ₹${bestOption.payout ? new Intl.NumberFormat('en-IN').format(bestOption.payout) : 'N/A'}`;
      case 'payout-desc':
        return `Highest payout at ₹${bestOption.payout ? new Intl.NumberFormat('en-IN').format(bestOption.payout) : 'N/A'}`;
      case 'after-payout-asc':
        return `Lowest after payout at ₹${bestOption.afterPayout ? new Intl.NumberFormat('en-IN').format(bestOption.afterPayout) : 'N/A'}`;
      case 'after-payout-desc':
        return `Highest after payout at ₹${bestOption.afterPayout ? new Intl.NumberFormat('en-IN').format(bestOption.afterPayout) : 'N/A'}`;
      case 'company-name':
        return `Alphabetically first: ${bestOption.companyName}`;
      default:
        return 'Top recommendation';
    }
  };

  const getIcon = () => {
    switch (sortOption) {
      case 'premium-asc':
        return <TrendingDown className="text-green-600" size={16} />;
      case 'premium-desc':
        return <TrendingUp className="text-red-600" size={16} />;
      case 'payout-asc':
        return <Wallet className="text-blue-600" size={16} />;
      case 'payout-desc':
        return <CreditCard className="text-purple-600" size={16} />;
      case 'after-payout-asc':
        return <IndianRupee className="text-green-600" size={16} />;
      case 'after-payout-desc':
        return <IndianRupee className="text-orange-600" size={16} />;
      case 'company-name':
        return <Trophy className="text-blue-600" size={16} />;
      default:
        return <Trophy className="text-yellow-600" size={16} />;
    }
  };

  // Get selected add-ons that are enabled for this company
  const getSelectedAddOns = () => {
    return addOnFeatures.filter(feature => 
      selectedAddOns.includes(feature.key) && bestOption[feature.key]
    );
  };

  const selectedFeatures = getSelectedAddOns();

  return (
    <div className="relative mb-8">
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-orange-500/20 to-yellow-400/20 rounded-3xl blur-xl"></div>
      
      <div className="relative bg-gradient-to-r from-yellow-50 via-orange-50 to-yellow-50 border-2 border-yellow-300/50 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-6 mb-6">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 via-orange-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-2xl">
              <Trophy className="text-white" size={36} />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
              <Sparkles className="text-white" size={16} />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-slate-900 mb-2">🏆 Best Recommendation</h3>
            <p className="text-slate-700 font-semibold text-lg"></p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/50">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                {bestOption.companyName.charAt(0)}
              </div>
              <div>
                <h4 className="text-2xl font-bold text-slate-900">{bestOption.companyName}</h4>
                <div className="flex items-center gap-3 text-slate-700 font-medium">
                  {getIcon()}
                  <span>{getSortDescription()}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-500 font-medium uppercase tracking-wide">Premium</div>
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ₹{bestOption.totalPremiumPayable ? new Intl.NumberFormat('en-IN').format(bestOption.totalPremiumPayable) : 'N/A'}
              </div>
            </div>
          </div>

          {/* Selected Add-Ons Section */}
          <div className="border-t border-slate-200 pt-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="text-green-600" size={20} />
              <h5 className="text-lg font-bold text-slate-800">Selected Add-On Features</h5>
            </div>
            
            {selectedFeatures.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {selectedFeatures.map(feature => (
                  <div
                    key={feature.key}
                    className="flex items-center gap-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl px-4 py-3 shadow-sm"
                  >
                    <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                      <CheckCircle className="text-white" size={14} />
                    </div>
                    <span className="font-medium text-green-800">{feature.label}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 rounded-xl px-6 py-4 text-center">
                <p className="text-slate-600 font-medium">No add-on features selected for comparison</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-8 text-center border-t border-slate-200 pt-6 mt-6">
            <div>
              <div className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-2">IDV Value</div>
              <div className="font-bold text-xl text-slate-800">{bestOption.idvValue}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-2">Total Features</div>
              <div className="font-bold text-xl text-purple-600">
                {selectedFeatures.length}/{selectedAddOns.length}
              </div>
            </div>
          </div>
        </div>

        {totalCompanies > 1 && (
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full text-slate-600 font-medium">
              <Star className="w-4 h-4 text-yellow-500" />
              <span>Selected from {totalCompanies} available options</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BestOptionCard;