import React from 'react';
import { availableCompanies } from '../data/availableCompanies';
import { Building2, Plus, X, Users } from 'lucide-react';

interface CompanySelectorProps {
  selectedCompanies: string[];
  onCompanyToggle: (companyId: string) => void;
  maxCompanies?: number;
}

const CompanySelector: React.FC<CompanySelectorProps> = ({ 
  selectedCompanies, 
  onCompanyToggle, 
  maxCompanies = 10 
}) => {
  const canAddMore = selectedCompanies.length < maxCompanies;

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl p-8 mb-8 border border-white/20">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
          <Building2 className="text-white" size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Select Companies to Compare</h2>
          <p className="text-slate-600">Choose up to {maxCompanies} insurance companies for comparison</p>
        </div>
        <div className="ml-auto">
          <div className="bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 rounded-xl">
            <span className="text-sm font-semibold text-slate-700">
              {selectedCompanies.length}/{maxCompanies} selected
            </span>
          </div>
        </div>
      </div>

      {selectedCompanies.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Users className="text-green-600" size={16} />
            <h3 className="text-lg font-semibold text-slate-700">Selected Companies:</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {selectedCompanies.map(companyId => {
              const company = availableCompanies.find(c => c.id === companyId);
              return (
                <div
                  key={companyId}
                  className="flex items-center gap-3 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 px-4 py-3 rounded-xl text-sm font-semibold shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">
                    {company?.name.charAt(0)}
                  </div>
                  <span>{company?.name}</span>
                  <button
                    onClick={() => onCompanyToggle(companyId)}
                    className="hover:bg-blue-300 rounded-full p-1 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {availableCompanies.map(company => {
          const isSelected = selectedCompanies.includes(company.id);
          const isDisabled = !isSelected && !canAddMore;

          return (
            <button
              key={company.id}
              onClick={() => onCompanyToggle(company.id)}
              disabled={isDisabled}
              className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-300 text-left transform hover:scale-105 ${
                isSelected
                  ? 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-300 text-blue-800 shadow-lg'
                  : isDisabled
                  ? 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed opacity-50'
                  : 'bg-white/80 border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-blue-50 shadow-md hover:shadow-lg'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg ${
                isSelected 
                  ? 'bg-gradient-to-br from-blue-600 to-blue-700' 
                  : isDisabled
                  ? 'bg-slate-400'
                  : 'bg-gradient-to-br from-slate-500 to-slate-600'
              }`}>
                {isSelected ? <X size={20} /> : <Plus size={20} />}
              </div>
              <div>
                <div className="font-semibold text-lg">{company.name}</div>
                <div className="text-sm opacity-75">
                  {isSelected ? 'Click to remove' : 'Click to add'}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {!canAddMore && (
        <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">!</span>
            </div>
            <p className="text-yellow-800 font-medium">
              Maximum {maxCompanies} companies can be selected for comparison. Remove a company to add another.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanySelector;