import React, { useState, useEffect } from 'react';
import { Calculator as CalcIcon, Info, Car, Bike, Truck, AlertCircle } from 'lucide-react';

// Unified Third Party Premium Rates (IRDAI)
const thirdPartyRates = {
  bike: {
    '75-150cc': 714,
    '151-350cc': 1366,
    '>350cc': 2804,
  },
  car: {
    '<1000cc': 2090,
    '1000-1500cc': 3416,
    '>1500cc': 7897,
  },
  commercial: {
    '1-2500': 15648,
    '2501-3500': 15648,
    '3501-7500': 15648,
    '7501-12000': 26217,
    '12001-20000': 33940,
    '20001-40000': 42133,
    '>40000': 42530,
  },
};

// Own Damage Base Rates
const ownDamageBaseRates: Record<string, number> = {
  bike: 0.0063,
  car: 0.0183,
  commercial: 0.016,
};

const addOns = [
  { id: 'zeroDep', name: 'Zero Depreciation' },
  { id: 'engineProtect', name: 'Engine Protect' },
  { id: 'consumable', name: 'Consumable Cover' },
  { id: 'rsa', name: 'Road Side Assistance' },
  { id: 'keyLock', name: 'Key and Lock Replacement' },
  { id: 'paOwner', name: 'PA For Owner Driver' },
  { id: 'llPaidDriver', name: 'Legal Liability Paid Driver' },
];

const faqs = [
  {
    question: "1. What documents do I need for vehicle insurance?",
    answer: "RC Copy, Previous Policy, and ID proof are required for vehicle insurance."
  },
  {
    question: "2. How long does the claim process take?",
    answer: "Claims are typically processed based on damage of the vehicle it may takes 1 week to 3 months for cashless claims at network garages."
  },
  {
    question: "3. Will I Require car insurance for Electric/CNG/LPG car?",
    answer: "Yes, owners of electric cars or cars fitted with CNG/LPG are also required to carry a valid car insurance policy. However, the premium charged can be slightly higher."
  },
  {
    question: "4. What is IDV in vehicle insurance?",
    answer: "1. Claim Settlement: The IDV determines the maximum claim amount you'll get if your car is totally damaged or stolen 2. Premium Calculation: A higher IDV means higher premium, and vice versa 3.Fair Compensation: It ensures you're compensated fairly based on the current market value 4.Don't undervalue your car just to save on premium—it could cost you during claims."
  },
   {
    question: "5. What is a 'No Claim Bonus' in a car insurance policy?",
    answer: "No claim bonus or NCB refers to the reward that your insurance company gives you for not filing a single claim throughout the policy tenure. This reward is the discount you get on the premium to be paid for car insurance renewal. NCB generally starts at 20% and goes up to 50% for 5 consecutive claim-free years. However, the NCB resets to 0% even if you make a single claim in a policy period."
  },
];

const getVehicleIcon = (type: string) => {
  switch (type) {
    case 'bike': return <Bike className="w-6 h-6" />;
    case 'car': return <Car className="w-6 h-6" />;
    case 'commercial': return <Truck className="w-6 h-6" />;
    default: return <Car className="w-6 h-6" />;
  }
};

const InsuranceCalculator: React.FC = () => {
  const [vehicleType, setVehicleType] = useState<'car' | 'bike' | 'commercial'>('car');
  const [engineCapacity, setEngineCapacity] = useState<string>('<1000cc');
  const [vehicleAge, setVehicleAge] = useState<number>(0);
  const [vehicleValue, setVehicleValue] = useState<number>(500000);
  const [coverageType, setCoverageType] = useState<'comprehensive' | 'thirdParty'>('comprehensive');
  const [showFAQ, setShowFAQ] = useState(false);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const [region, setRegion] = useState<string>('Hyderabad');
  const [previousClaims, setPreviousClaims] = useState<string>('no previous claims');

  // Dynamic IDV Range
  const getIDVRange = () => {
    if (vehicleType === 'bike') {
      return { min: 10000, max: 100000, step: 1000 };
    }
    // Default for car & commercial
    return { min: 50000, max: 2000000, step: 10000 };
  };
  const idvRange = getIDVRange();

  useEffect(() => {
    if (vehicleType === 'car') setEngineCapacity('<1000cc');
    else if (vehicleType === 'bike') setEngineCapacity('75-150cc');
    else if (vehicleType === 'commercial') setEngineCapacity('1-2500');
    // Set vehicleValue to match min if out of new range (e.g., switching from car to bike)
    if (vehicleValue < idvRange.min || vehicleValue > idvRange.max) {
      setVehicleValue(idvRange.min);
    }
    // eslint-disable-next-line
  }, [vehicleType]);

  // Third Party Premium Calculation
  const getThirdPartyPremium = () => {
    const rate = thirdPartyRates[vehicleType][engineCapacity as keyof typeof thirdPartyRates[typeof vehicleType]];
    return rate || 0;
  };

  // Add-ons Premium Calculation (dummy zero, as only visible, not calculated)
  const calculatePremium = () => {
    const tpPremium = getThirdPartyPremium();
    const tpWithGST = Math.round(tpPremium * 1.18);

    if (coverageType === 'thirdParty') {
      // For third-party, previous claims do NOT affect the premium
      return {
        total: tpWithGST,
        breakdown: { tp: tpPremium, od: 0, addOns: 0, gst: Math.round(tpPremium * 0.18) }
      };
    }

    // Only for comprehensive, apply 20% increase if have previous claim
    const baseRate = ownDamageBaseRates[vehicleType];
    const ageMultiplier = 1 + (vehicleAge * 0.02);
    const odPremium = Math.round(baseRate * vehicleValue * ageMultiplier);
    const totalBeforeGST = tpPremium + odPremium;
    const gst = Math.round(totalBeforeGST * 0.18);
    let total = Math.round(totalBeforeGST + gst);

    if (previousClaims === "have previous claim") {
      total = Math.round(total * 1.2);
    }

    return {
      total,
      breakdown: { tp: tpPremium, od: odPremium, addOns: 0, gst }
    };
  };

  const premium = calculatePremium();

  // Theme classes (slate/charcoal/indigo, similar but not black)
  const theme = {
    section: "bg-[#181c21]",
    card: "bg-[#1e232a] border border-slate-800",
    left: "bg-gradient-to-br from-indigo-950 to-indigo-900",
    infoCard: "bg-white/10 rounded-lg p-6 backdrop-blur-sm text-white mb-6 transform transition-all duration-300 hover:scale-105",
    info: "text-slate-100",
    heading: "text-slate-100",
    subheading: "text-slate-200",
    border: "border-slate-800",
    inputCard: "bg-[#20242d]",
    label: "text-slate-100",
    input: "bg-[#181c21] text-slate-100 border-slate-700 focus:ring-indigo-400 hover:border-indigo-400",
    select: "bg-[#181c21] text-slate-100 border-slate-700 focus:ring-indigo-400 hover:border-indigo-400",
    btnActive: "bg-indigo-900 text-white border-indigo-900 shadow-lg",
    btn: "bg-[#23283a] text-slate-300 border-slate-800 hover:bg-indigo-950 hover:text-white hover:border-indigo-400",
    slider: "bg-indigo-900",
    faqCard: "bg-[#20242d] border border-slate-800 text-slate-100",
    faqHeading: "text-slate-200",
    faqBtn: "text-indigo-400 hover:text-indigo-200",
    addOn: "text-slate-200 font-medium"
  };

  return (
    <section id="calculator" className={`py-20 ${theme.section} min-h-screen`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-indigo-900/70 px-4 py-2 rounded-full text-indigo-200 font-medium mb-4">
            <CalcIcon className="w-4 h-4 mr-2" />
            Premium Estimator
          </div>
          <h2 className={`text-3xl md:text-4xl font-bold ${theme.heading}`}>Calculate Your Insurance Premium</h2>
          <div className="w-24 h-1 bg-indigo-800 mx-auto mt-4 mb-6"></div>
          <p className={`text-lg ${theme.info} max-w-2xl mx-auto`}>
            Get an instant estimate of your insurance premium including third-party (with GST) per IRDAI. These are not accurate quotations for your vehicle. For detailed information contact Ravi Teja Vehicle Insurance Advisor.
          </p>
        </div>
        <div className={`max-w-4xl mx-auto rounded-xl shadow-2xl overflow-hidden transform hover:scale-[1.02] transition-all duration-300 ${theme.card}`}>
          <div className="md:flex">
            {/* PREMIUM DETAILS */}
            <div className={`md:w-1/2 p-8 ${theme.left}`}>
              {/* Available Add-ons moved here */}
              <div className="mt-0 mb-6">
                <div className="font-semibold text-slate-100 mb-2">Available Add-ons:</div>
                <ul className="list-disc list-inside text-slate-200 text-sm space-y-1">
                  {addOns.map(addOn => (
                    <li key={addOn.id} className={theme.addOn}>{addOn.name}</li>
                  ))}
                </ul>
              </div>
              {/* Estimated Premium section now after Add-ons */}
              <h3 className="text-2xl font-bold text-white mb-6">Estimated Premium</h3>
              <div className={theme.infoCard}>
                <div className="flex justify-between mb-4">
                  <span>Total Premium:</span>
                  <span className="text-2xl font-bold">₹{premium.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-white/80">
                  <span>Third Party Premium (incl. GST)</span>
                  <span>₹{(premium.breakdown.tp + premium.breakdown.gst).toLocaleString()}</span>
                </div>
                {coverageType === 'comprehensive' && (
                  <div className="flex justify-between text-sm text-white/80">
                    <span>Own Damage</span>
                    <span>₹{premium.breakdown.od.toLocaleString()}</span>
                  </div>
                )}
                {coverageType === 'comprehensive' && previousClaims === "have previous claim" && (
                  <div className="flex justify-between text-sm text-red-300 font-semibold mt-2">
                    <span>Premium Increases due to Previous Claim History</span>
                  </div>
                )}
              </div>
              <div className="space-y-4 text-white">
                <div className="flex items-start transform hover:translate-x-2 transition-all duration-300">
                  <Info className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-white/90">Third-party premiums include 18% GST as per IRDAI guidelines.</p>
                </div>
                <div className="flex items-start transform hover:translate-x-2 transition-all duration-300">
                  <Info className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-white/90">
                    Comprehensive covers own damage + third-party liability.
                  </p>
                </div>
              </div>
            </div>

            {/* VEHICLE DETAILS INPUT */}
            <div className={`md:w-1/2 p-8 ${theme.inputCard}`}>
              <h3 className={`text-xl font-bold mb-6 ${theme.subheading}`}>Vehicle Information</h3>
              <div className="space-y-6">
                <div>
                  <label className={`block mb-2 ${theme.label}`}>Vehicle Type</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { type: 'car', label: 'Car', icon: <Car className="w-6 h-6" /> },
                      { type: 'bike', label: 'Bike', icon: <Bike className="w-6 h-6" /> },
                      { type: 'commercial', label: 'Commercial', icon: <Truck className="w-6 h-6" /> },
                    ].map(({ type, label, icon }) => (
                      <button
                        key={type}
                        className={`py-3 px-4 rounded-md border flex items-center justify-center gap-2 transform transition-all duration-300 hover:scale-105 ${vehicleType === type ? theme.btnActive : theme.btn}`}
                        onClick={() => setVehicleType(type as 'car' | 'bike' | 'commercial')}
                        type="button"
                      >
                        {icon}
                        <span>{label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className={`block mb-2 ${theme.label}`}>
                    Engine Capacity
                    <button
                      className="ml-2 text-indigo-400 hover:text-indigo-200"
                      onMouseEnter={() => setShowTooltip('cc')}
                      onMouseLeave={() => setShowTooltip(null)}
                      type="button"
                    >
                      <Info className="w-4 h-4" />
                    </button>
                  </label>
                  {showTooltip === 'cc' && (
                    <div className="absolute z-20 bg-[#181c21] p-2 rounded shadow-lg text-sm text-slate-100 border border-slate-800">
                      Engine capacity affects third-party premium as per IRDAI.
                    </div>
                  )}
                  <select
                    value={engineCapacity}
                    onChange={e => setEngineCapacity(e.target.value)}
                    className={`w-full p-3 rounded-md transition-all duration-300 ${theme.select}`}
                  >
                    {vehicleType === 'bike' && (
                      <>
                        <option value="75-150cc">75-150cc</option>
                        <option value="151-350cc">151-350cc</option>
                        <option value=">350cc">&gt;350cc</option>
                      </>
                    )}
                    {vehicleType === 'car' && (
                      <>
                        <option value="<1000cc">&lt;1000cc</option>
                        <option value="1000-1500cc">1000-1500cc</option>
                        <option value=">1500cc">&gt;1500cc</option>
                      </>
                    )}
                    {vehicleType === 'commercial' && (
                      <>
                        <option value="1-2500">1-2500 kg</option>
                        <option value="2501-3500">2501-3500 kg</option>
                        <option value="3501-7500">3501-7500 kg</option>
                        <option value="7501-12000">7501-12000 kg</option>
                        <option value="12001-20000">12001-20000 kg</option>
                        <option value="20001-40000">20001-40000 kg</option>
                        <option value=">40000">&gt;40000 kg</option>
                      </>
                    )}
                  </select>
                </div>
                {/* Region Section */}
                <div>
                  <label className={`block mb-2 ${theme.label}`}>Region</label>
                  <select
                    value={region}
                    onChange={e => setRegion(e.target.value)}
                    className={`w-full p-3 rounded-md transition-all duration-300 ${theme.select}`}
                  >
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="out of Hyd">Out of Hyd</option>
                  </select>
                </div>
                {/* Previous Claims Section */}
                <div>
                  <label className={`block mb-2 ${theme.label}`}>Previous Claims</label>
                  <select
                    value={previousClaims}
                    onChange={e => setPreviousClaims(e.target.value)}
                    className={`w-full p-3 rounded-md transition-all duration-300 ${theme.select}`}
                  >
                    <option value="no previous claims">No Previous Claims</option>
                    <option value="have previous claim">Have Previous Claim</option>
                  </select>
                </div>
                {coverageType === 'comprehensive' && (
                  <div>
                    <label className={`block mb-2 ${theme.label}`}>Vehicle Value (IDV) ₹</label>
                    <input
                      type="range"
                      min={idvRange.min}
                      max={idvRange.max}
                      step={idvRange.step}
                      value={vehicleValue}
                      onChange={e => setVehicleValue(Number(e.target.value))}
                      className={`w-full h-2 rounded-lg appearance-none cursor-pointer transition-all duration-300 ${theme.slider}`}
                    />
                    <div className="flex justify-between text-slate-200 text-sm mt-1">
                      <span>Choose IDV {(vehicleValue / 100000).toFixed(1)} Lakhs</span>
                    </div>
                  </div>
                )}
                <div>
                  <label className={`block mb-2 ${theme.label}`}>Vehicle Age (Years)</label>
                  <select
                    value={vehicleAge}
                    onChange={e => setVehicleAge(Number(e.target.value))}
                    className={`w-full p-3 rounded-md transition-all duration-300 ${theme.select}`}
                  >
                    {[...Array(11)].map((_, i) => (
                      <option key={i} value={i}>{i === 0 ? 'Less than 1 year' : `${i} year${i !== 1 ? 's' : ''}`}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={`block mb-2 ${theme.label}`}>Coverage Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { type: 'comprehensive', label: 'Comprehensive' },
                      { type: 'thirdParty', label: 'Third-Party Only' },
                    ].map(({ type, label }) => (
                      <button
                        key={type}
                        className={`py-2 px-4 rounded-md border transform transition-all duration-300 hover:scale-105 ${coverageType === type ? theme.btnActive : theme.btn}`}
                        onClick={() => setCoverageType(type as 'comprehensive' | 'thirdParty')}
                        type="button"
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                {/* No submit button here */}
              </div>
            </div>
          </div>
        </div>
        {/* FAQ Section */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-2xl font-bold ${theme.faqHeading}`}>Frequently Asked Questions</h3>
            <button
              onClick={() => setShowFAQ(!showFAQ)}
              className={`flex items-center ${theme.faqBtn}`}
            >
              {showFAQ ? 'Show Less' : 'Show More'}
              <AlertCircle className="ml-2" size={18} />
            </button>
          </div>
          <div className={`space-y-4 transition-all duration-300 ${showFAQ ? 'block' : 'hidden'}`}>
            {faqs.map((faq, idx) => (
              <div key={idx} className={`rounded-lg shadow-md p-6 ${theme.faqCard}`}>
                <h4 className="text-lg font-semibold mb-2">{faq.question}</h4>
                <p>{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default InsuranceCalculator;