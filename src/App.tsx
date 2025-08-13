import React, { useState, useMemo } from 'react';
import { Shield, BarChart3, Settings, Calculator, Sparkles } from 'lucide-react';
import { FilterState, SortOption, InsuranceCompany } from './types/insurance';
import CompanySelector from './components/CompanySelector';
import AddOnSelector from './components/AddOnSelector';
import SortControls from './components/SortControls';
import ComparisonTable from './components/ComparisonTable';
import BestOptionCard from './components/BestOptionCard';
import InsuranceCalculator from './components/InsuranceCalculator';
import { filterCompanies, sortCompanies, getBestOption } from './utils/filterSort';
import { availableCompanies } from './data/availableCompanies';

function App() {
  // Selection states
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'comparison' | 'calculator'>('comparison');
  
  // Company data
  const [companies, setCompanies] = useState<InsuranceCompany[]>([]);
  
  // Filter and sort states
  const [filters, setFilters] = useState<FilterState>({
    zeroDepreciation: null,
    engineProtect: null,
    keyReplacement: null,
    consumableCover: null,
    legalLiabilityPaidDriver: null,
    cpacover: null,
    roadsideAssistance: null,
    tyreSecure: null,
    returnToInvoice: null,
    personalBaggage: null,
    batteryProtect: null,
    passengerPA: null,
    rubberPlasticFibre: null,
    maxBudget: null
  });

  const [sortOption, setSortOption] = useState<SortOption>('premium-asc');

  // Handlers
  const handleCompanyToggle = (companyId: string) => {
    setSelectedCompanies(prev => {
      const newSelection = prev.includes(companyId) 
        ? prev.filter(id => id !== companyId)
        : [...prev, companyId];
      
      // Update companies list immediately
      updateCompaniesFromSelection(newSelection);
      return newSelection;
    });
  };

  const handleAddOnToggle = (addOnKey: string) => {
    setSelectedAddOns(prev => 
      prev.includes(addOnKey) 
        ? prev.filter(key => key !== addOnKey)
        : [...prev, addOnKey]
    );
  };

  const updateCompaniesFromSelection = (companyIds: string[]) => {
    if (companyIds.length === 0) {
      setCompanies([]);
      return;
    }
    
    const newCompanies = companyIds.map(companyId => {
      const existingCompany = companies.find(c => c.id === companyId);
      if (existingCompany) return existingCompany;
      
      const availableCompany = availableCompanies.find(c => c.id === companyId);
      return {
        id: companyId,
        companyName: availableCompany?.name || 'Unknown Company',
        idvValue: '',
        zeroDepreciation: true,
        engineProtect: true,
        keyReplacement: true,
        consumableCover: true,
        legalLiabilityPaidDriver: true,
        cpacover: true,
        roadsideAssistance: true,
        tyreSecure: true,
        returnToInvoice: true,
        personalBaggage: true,
        batteryProtect: true,
        passengerPA: true,
        rubberPlasticFibre: true,
        totalPremiumPayable: null,
        payout: null,
        afterPayout: null
      };
    });
    
    setCompanies(newCompanies);
  };

  const handleCompanyUpdate = (companyId: string, field: keyof InsuranceCompany, value: any) => {
    setCompanies(prev => prev.map(company => 
      company.id === companyId 
        ? { ...company, [field]: value }
        : company
    ));
  };

  const filteredAndSortedCompanies = useMemo(() => {
    const filtered = filterCompanies(companies, filters);
    return sortCompanies(filtered, sortOption);
  }, [companies, filters, sortOption]);

  const bestOption = useMemo(() => {
    return getBestOption(filteredAndSortedCompanies, sortOption);
  }, [filteredAndSortedCompanies, sortOption]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-cyan-600/20 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-2xl">
                <Shield className="text-white" size={32} />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Sparkles className="text-white" size={12} />
              </div>
            </div>
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-700 via-purple-700 to-indigo-800 bg-clip-text text-transparent">
                Vehicl Insurance 
              </h1>
              <p className="text-lg text-slate-600 font-medium">Compare • Calculate • Choose</p>
            </div>
          </div>
          <p className="text-slate-600 text-lg max-w-3xl mx-auto leading-relaxed">
            Your comprehensive platform for insurance comparison and premium calculation. 
            Make informed decisions with our advanced comparison tools and instant premium estimates.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-2 flex gap-2 border border-white/20">
            <button
              onClick={() => setActiveTab('comparison')}
              className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold transition-all duration-500 ${
                activeTab === 'comparison'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-2xl transform scale-105'
                  : 'text-slate-600 hover:bg-white/50 hover:text-blue-600'
              }`}
            >
              <Shield size={22} />
              <span>Insurance Comparison</span>
            </button>
            <button
              onClick={() => setActiveTab('calculator')}
              className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold transition-all duration-500 ${
                activeTab === 'calculator'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-2xl transform scale-105'
                  : 'text-slate-600 hover:bg-white/50 hover:text-blue-600'
              }`}
            >
              <Calculator size={22} />
              <span>Premium Calculator</span>
            </button>
          </div>
        </div>

        {/* Conditional Content */}
        {activeTab === 'comparison' ? (
          <>
            {/* Setup Section */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-8">
                <Settings className="text-blue-600" size={28} />
                <h2 className="text-3xl font-bold text-slate-800">Setup Your Comparison</h2>
              </div>
              
              {/* Company Selection */}
              <CompanySelector 
                selectedCompanies={selectedCompanies}
                onCompanyToggle={handleCompanyToggle}
                maxCompanies={10}
              />

              {/* Add-On Selection */}
              <AddOnSelector 
                selectedAddOns={selectedAddOns}
                onAddOnToggle={handleAddOnToggle}
              />
            </div>

            {/* Show comparison when companies are selected */}
            {selectedCompanies.length > 0 ? (
              <>
                {/* Stats Bar */}
                <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl p-6 mb-8 border border-white/20">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                        <BarChart3 className="text-white" size={20} />
                      </div>
                      <div>
                        <div className="text-sm text-slate-500 font-medium">Companies</div>
                        <div className="font-bold text-2xl text-slate-800">{companies.length}</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                        <Shield className="text-white" size={20} />
                      </div>
                      <div>
                        <div className="text-sm text-slate-500 font-medium">Features</div>
                        <div className="font-bold text-2xl text-slate-800">{selectedAddOns.length}</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <Calculator className="text-white" size={20} />
                      </div>
                      <div>
                        <div className="text-sm text-slate-500 font-medium">Matching</div>
                        <div className="font-bold text-2xl text-slate-800">{filteredAndSortedCompanies.length}</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                        <Sparkles className="text-white" size={20} />
                      </div>
                      <div>
                        <div className="text-sm text-slate-500 font-medium">Best Option</div>
                        <div className="font-bold text-lg text-slate-800">{bestOption?.companyName || 'None'}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sort Controls */}
                <SortControls sortOption={sortOption} onSortChange={setSortOption} />

                {/* Best Option Card */}
                {bestOption && (
                  <BestOptionCard 
                    bestOption={bestOption} 
                    sortOption={sortOption} 
                    totalCompanies={filteredAndSortedCompanies.length}
                    selectedAddOns={selectedAddOns}
                  />
                )}

                {/* Comparison Table */}
                <ComparisonTable 
                  companies={filteredAndSortedCompanies} 
                  bestOption={bestOption}
                  selectedAddOns={selectedAddOns}
                  onCompanyUpdate={handleCompanyUpdate}
                />
              </>
            ) : (
              /* Instructions when nothing is selected */
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl p-12 text-center border border-white/20">
                <div className="w-24 h-24 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield size={48} className="text-slate-500" />
                </div>
                <h3 className="text-2xl font-bold text-slate-700 mb-4">
                  Ready to Start Your Comparison
                </h3>
                <p className="text-slate-600 mb-8 text-lg">
                  Select companies above to start building your comparison table.
                </p>
                <div className="flex justify-center gap-8 text-sm">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${selectedCompanies.length > 0 ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                    <span className="font-medium">Companies ({selectedCompanies.length}/10)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${selectedAddOns.length > 0 ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                    <span className="font-medium">Features ({selectedAddOns.length})</span>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <InsuranceCalculator />
        )}

        {/* Footer */}
        <div className="text-center mt-16 text-slate-500">
          <p className="text-lg">
            💡 {activeTab === 'comparison' 
              ? 'Build your custom comparison by selecting companies and features above.' 
              : 'Get instant premium estimates based on IRDAI guidelines and vehicle specifications.'
            }
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;