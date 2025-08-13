export interface InsuranceCompany {
  id: string;
  companyName: string;
  idvValue: string;
  zeroDepreciation: boolean;
  engineProtect: boolean;
  keyReplacement: boolean;
  consumableCover: boolean;
  legalLiabilityPaidDriver: boolean;
  cpacover: boolean;
  roadsideAssistance: boolean;
  tyreSecure: boolean;
  returnToInvoice: boolean;
  personalBaggage: boolean;
  batteryProtect: boolean;
  passengerPA: boolean;
  rubberPlasticFibre: boolean;
  totalPremiumPayable: number | null;
  payout: number | null;
  afterPayout: number | null;
}

export interface FilterState {
  zeroDepreciation: boolean | null;
  engineProtect: boolean | null;
  keyReplacement: boolean | null;
  consumableCover: boolean | null;
  legalLiabilityPaidDriver: boolean | null;
  cpacover: boolean | null;
  roadsideAssistance: boolean | null;
  tyreSecure: boolean | null;
  returnToInvoice: boolean | null;
  personalBaggage: boolean | null;
  batteryProtect: boolean | null;
  passengerPA: boolean | null;
  rubberPlasticFibre: boolean | null;
  maxBudget: number | null;
}

export type SortOption = 'premium-asc' | 'premium-desc' | 'payout-asc' | 'payout-desc' | 'after-payout-asc' | 'after-payout-desc' | 'company-name';

export interface AvailableCompany {
  id: string;
  name: string;
}

export interface AddOnFeature {
  key: keyof InsuranceCompany;
  label: string;
  description: string;
}