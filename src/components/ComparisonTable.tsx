import React from 'react';
import { InsuranceCompany } from '../types/insurance';
import { addOnFeatures } from '../data/addOnFeatures';
import { Download, Edit3, IndianRupee, Building2, Trophy } from 'lucide-react';

interface ComparisonTableProps {
  companies: InsuranceCompany[];
  bestOption: InsuranceCompany | null;
  selectedAddOns: string[];
  onCompanyUpdate: (companyId: string, field: keyof InsuranceCompany, value: any) => void;
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({
  companies,
  bestOption,
  selectedAddOns,
  onCompanyUpdate,
}) => {
  const downloadCSV = () => {
    if (companies.length === 0) return;

    const selectedFeatures = addOnFeatures.filter(feature => 
      selectedAddOns.includes(feature.key)
    );

    // Create headers array
    const headers = ['Attributes'];
    companies.forEach(company => {
      headers.push(company.companyName);
    });

    // Create rows array - each row represents an attribute
    const rows = [];
    
    // IDV Value row
    const idvRow = ['IDV Value'];
    companies.forEach(company => {
      idvRow.push(company.idvValue || 'N/A');
    });
    rows.push(idvRow);
    
    // Feature rows
    selectedFeatures.forEach(feature => {
      const featureRow = [feature.label];
      companies.forEach(company => {
        featureRow.push(company[feature.key] ? 'YES' : 'NO');
      });
      rows.push(featureRow);
    });
    
    // Premium row
    const premiumRow = ['Total Premium (₹)'];
    companies.forEach(company => {
      premiumRow.push(company.totalPremiumPayable?.toString() || 'N/A');
    });
    rows.push(premiumRow);
    
    // Payout row
    const payoutRow = ['Payout (₹)'];
    companies.forEach(company => {
      payoutRow.push(company.payout?.toString() || 'N/A');
    });
    rows.push(payoutRow);
    
    // After Payout row
    const afterPayoutRow = ['After Payout (₹)'];
    companies.forEach(company => {
      afterPayoutRow.push(company.afterPayout?.toString() || 'N/A');
    });
    rows.push(afterPayoutRow);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `insurance-comparison-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const calculateAfterPayout = (premium: number | null, payout: number | null) => {
    if (premium === null || payout === null) return null;
    return premium - payout;
  };

  const handlePremiumChange = (companyId: string, value: string) => {
    const premium = value === '' ? null : parseInt(value, 10);
    onCompanyUpdate(companyId, 'totalPremiumPayable', premium);
    
    const company = companies.find(c => c.id === companyId);
    if (company) {
      const afterPayout = calculateAfterPayout(premium, company.payout);
      onCompanyUpdate(companyId, 'afterPayout', afterPayout);
    }
  };

  const handlePayoutChange = (companyId: string, value: string) => {
    const payout = value === '' ? null : parseInt(value, 10);
    onCompanyUpdate(companyId, 'payout', payout);
    
    const company = companies.find(c => c.id === companyId);
    if (company) {
      const afterPayout = calculateAfterPayout(company.totalPremiumPayable, payout);
      onCompanyUpdate(companyId, 'afterPayout', afterPayout);
    }
  };

  const handleFeatureToggle = (companyId: string, feature: keyof InsuranceCompany) => {
    const company = companies.find(c => c.id === companyId);
    if (company) {
      onCompanyUpdate(companyId, feature, !company[feature]);
    }
  };

  if (companies.length === 0) {
    return (
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl p-12 text-center border border-white/20">
        <Edit3 className="w-16 h-16 text-slate-400 mx-auto mb-6" />
        <h3 className="text-2xl font-bold text-slate-600 mb-4">No Companies Added</h3>
        <p className="text-slate-500 text-lg">
          Select companies and add-on features above to start building your comparison.
        </p>
      </div>
    );
  }

  const selectedFeatures = addOnFeatures.filter(feature => 
    selectedAddOns.includes(feature.key)
  );

  return (
    <>
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <div className="flex items-center gap-3">
            <Building2 className="text-blue-600" size={24} />
            <h2 className="text-2xl font-bold text-slate-800">Insurance Comparison</h2>
          </div>
          <button
            onClick={downloadCSV}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Download size={16} />
            Download CSV
          </button>
        </div>

        {/* Vertical Table Layout */}
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-4 px-4 font-semibold text-slate-700 min-w-[200px]">
                    Companies
                  </th>
                  {companies.map((company) => {
                    const isBestOption = bestOption?.id === company.id;
                    return (
                      <th key={company.id} className="text-center py-4 px-4 min-w-[180px]">
                        <div className="flex flex-col items-center gap-2">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold shadow-lg ${
                            isBestOption 
                              ? 'bg-gradient-to-br from-yellow-500 to-orange-600' 
                              : 'bg-gradient-to-br from-blue-500 to-blue-600'
                          }`}>
                            {isBestOption ? <Trophy size={20} /> : company.companyName.charAt(0)}
                          </div>
                          <div className="text-center">
                            <div className="font-bold text-slate-800">{company.companyName}</div>
                            {isBestOption && (
                              <div className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full mt-1">
                                Best Option
                              </div>
                            )}
                          </div>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {/* IDV Value Row */}
                <tr className="border-b border-slate-100 hover:bg-white/50">
                  <td className="py-4 px-4 font-semibold text-slate-700">IDV Value</td>
                  {companies.map((company) => (
                    <td key={company.id} className="py-4 px-4 text-center">
                      <input
                        type="text"
                        value={company.idvValue}
                        onChange={(e) => onCompanyUpdate(company.id, 'idvValue', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center font-medium bg-white/80 backdrop-blur-sm min-w-[120px]"
                        placeholder="Enter IDV"
                      />
                    </td>
                  ))}
                </tr>

                {/* Feature Rows */}
                {selectedFeatures.map(feature => (
                  <tr key={feature.key} className="border-b border-slate-100 hover:bg-white/50">
                    <td className="py-4 px-4 font-semibold text-slate-700">
                      <div>
                        <div>{feature.label}</div>
                        <div className="text-xs text-slate-500 mt-1">{feature.description}</div>
                      </div>
                    </td>
                    {companies.map((company) => (
                      <td key={company.id} className="py-4 px-4 text-center">
                        <button
                          onClick={() => handleFeatureToggle(company.id, feature.key)}
                          className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 text-sm ${
                            company[feature.key]
                              ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg'
                              : 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg'
                          }`}
                        >
                          {company[feature.key] ? 'YES' : 'NO'}
                        </button>
                      </td>
                    ))}
                  </tr>
                ))}

                {/* Premium Row */}
                <tr className="border-b border-slate-100 hover:bg-white/50">
                  <td className="py-4 px-4 font-semibold text-slate-700">
                    <div className="flex items-center gap-2">
                      <IndianRupee size={16} />
                      Premium
                    </div>
                  </td>
                  {companies.map((company) => (
                    <td key={company.id} className="py-4 px-4 text-center">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <IndianRupee className="h-4 w-4 text-slate-400" />
                        </div>
                        <input
                          type="number"
                          value={company.totalPremiumPayable || ''}
                          onChange={(e) => handlePremiumChange(company.id, e.target.value)}
                          placeholder="000000"
                          className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-lg text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium bg-white/80 backdrop-blur-sm min-w-[140px]"
                        />
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Payout Row */}
                <tr className="border-b border-slate-100 hover:bg-white/50">
                  <td className="py-4 px-4 font-semibold text-slate-700">
                    <div className="flex items-center gap-2">
                      <IndianRupee size={16} className="text-orange-600" />
                      Payout
                    </div>
                  </td>
                  {companies.map((company) => (
                    <td key={company.id} className="py-4 px-4 text-center">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <IndianRupee className="h-4 w-4 text-orange-400" />
                        </div>
                        <input
                          type="number"
                          value={company.payout || ''}
                          onChange={(e) => handlePayoutChange(company.id, e.target.value)}
                          placeholder="000000"
                          className="w-full pl-8 pr-3 py-2 border border-orange-300 rounded-lg text-center focus:ring-2 focus:ring-orange-500 focus:border-orange-500 font-medium bg-orange-50/80 backdrop-blur-sm min-w-[140px]"
                        />
                      </div>
                    </td>
                  ))}
                </tr>

                {/* After Payout Row */}
                <tr className="border-b border-slate-100 hover:bg-white/50">
                  <td className="py-4 px-4 font-semibold text-slate-700">
                    <div className="flex items-center gap-2">
                      <IndianRupee size={16} className="text-green-600" />
                      After Payout
                    </div>
                  </td>
                  {companies.map((company) => (
                    <td key={company.id} className="py-4 px-4 text-center">
                      <div className="bg-green-50 rounded-lg px-4 py-2 border border-green-200">
                        <div className="font-bold text-green-800">
                          ₹{company.afterPayout !== null ? new Intl.NumberFormat('en-IN').format(company.afterPayout) : 'N/A'}
                        </div>
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Instructions */}
          <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-bold">💡</span>
              </div>
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-2"> Important Information </p>
                <p className="font-semibold mb-2">• Premium quotations are based on your claim history confirmation and may vary according to the company's vehicle rating. </p>
                 <p className="font-semibold mb-2"> • To proceed, Login Details to be required </p>
                <p className="font-semibold mb-2"> • Aadhaar and PAN must match the details on your Registration Certificate (RC)  </p>
                <ul className="space-y-1 text-blue-700">
                  <li></li>
                  <li></li>
                  <li> </li>
                  <li></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ComparisonTable;