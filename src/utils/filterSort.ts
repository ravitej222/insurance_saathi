import { InsuranceCompany, FilterState, SortOption } from '../types/insurance';

export const filterCompanies = (companies: InsuranceCompany[], filters: FilterState): InsuranceCompany[] => {
  return companies.filter(company => {
    // Check feature filters
    const featureFilters = [
      'zeroDepreciation',
      'engineProtect',
      'keyReplacement', 
      'consumableCover',
      'legalLiabilityPaidDriver',
      'cpacover',
      'roadsideAssistance',
      'tyreSecure',
      'returnToInvoice',
      'personalBaggage',
      'batteryProtect',
      'passengerPA',
      'rubberPlasticFibre'
    ] as const;

    for (const feature of featureFilters) {
      const filterValue = filters[feature];
      if (filterValue !== null) {
        const companyValue = company[feature];
        if (filterValue !== companyValue) {
          return false;
        }
      }
    }

    // Check budget filter
    if (filters.maxBudget !== null && company.totalPremiumPayable !== null && company.totalPremiumPayable > filters.maxBudget) {
      return false;
    }

    return true;
  });
};

export const sortCompanies = (companies: InsuranceCompany[], sortOption: SortOption): InsuranceCompany[] => {
  const sorted = [...companies];

  switch (sortOption) {
    case 'premium-asc':
      return sorted.sort((a, b) => {
        const aVal = a.totalPremiumPayable || 0;
        const bVal = b.totalPremiumPayable || 0;
        return aVal - bVal;
      });
    
    case 'premium-desc':
      return sorted.sort((a, b) => {
        const aVal = a.totalPremiumPayable || 0;
        const bVal = b.totalPremiumPayable || 0;
        return bVal - aVal;
      });
    
    case 'payout-asc':
      return sorted.sort((a, b) => {
        const aVal = a.payout || 0;
        const bVal = b.payout || 0;
        return aVal - bVal;
      });
    
    case 'payout-desc':
      return sorted.sort((a, b) => {
        const aVal = a.payout || 0;
        const bVal = b.payout || 0;
        return bVal - aVal;
      });
    
    case 'after-payout-asc':
      return sorted.sort((a, b) => {
        const aVal = a.afterPayout || 0;
        const bVal = b.afterPayout || 0;
        return aVal - bVal;
      });
    
    case 'after-payout-desc':
      return sorted.sort((a, b) => {
        const aVal = a.afterPayout || 0;
        const bVal = b.afterPayout || 0;
        return bVal - aVal;
      });
    
    case 'company-name':
      return sorted.sort((a, b) => a.companyName.localeCompare(b.companyName));
    
    default:
      return sorted;
  }
};

export const getBestOption = (companies: InsuranceCompany[], sortOption: SortOption): InsuranceCompany | null => {
  if (companies.length === 0) return null;
  
  const sorted = sortCompanies(companies, sortOption);
  return sorted[0];
};