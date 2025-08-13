import React from 'react';
import { addOnFeatures } from '../data/addOnFeatures';
import { Shield, Info, CheckCircle } from 'lucide-react';

interface AddOnSelectorProps {
  selectedAddOns: string[];
  onAddOnToggle: (addOnKey: string) => void;
}

const AddOnSelector: React.FC<AddOnSelectorProps> = ({ selectedAddOns, onAddOnToggle }) => {
  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl p-8 mb-8 border border-white/20">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
          <Shield className="text-white" size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Select Add-On Features</h2>
          <p className="text-slate-600">Choose the Add on's to compare the Premiums</p>
        </div>
        <div className="ml-auto">
          <div className="bg-gradient-to-r from-green-100 to-emerald-100 px-4 py-2 rounded-xl">
            <span className="text-sm font-semibold text-slate-700">
              {selectedAddOns.length} features selected
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addOnFeatures.map(feature => {
          const isSelected = selectedAddOns.includes(feature.key);

          return (
            <div
              key={feature.key}
              className={`border-2 rounded-xl p-6 transition-all duration-300 cursor-pointer transform hover:scale-105 ${
                isSelected
                  ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300 shadow-lg'
                  : 'bg-white/80 border-slate-200 hover:border-green-300 hover:bg-green-50 shadow-md hover:shadow-lg'
              }`}
              onClick={() => onAddOnToggle(feature.key)}
            >
              <div className="flex items-start gap-4">
                <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center mt-1 transition-all duration-300 ${
                  isSelected
                    ? 'bg-green-600 border-green-600 shadow-lg'
                    : 'border-slate-300 bg-white'
                }`}>
                  {isSelected && (
                    <CheckCircle className="w-5 h-5 text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className={`font-bold text-lg mb-2 ${isSelected ? 'text-green-800' : 'text-slate-800'}`}>
                    {feature.label}
                  </h3>
                  <p className={`text-sm leading-relaxed ${isSelected ? 'text-green-700' : 'text-slate-600'}`}>
                    {feature.description}
                  </p>
                </div>
                <Info className={`w-5 h-5 mt-1 ${isSelected ? 'text-green-600' : 'text-slate-400'}`} />
              </div>
            </div>
          );
        })}
      </div>

      {selectedAddOns.length === 0 && (
        <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xl">💡</span>
            </div>
            <div>
              <p className="text-blue-800 font-semibold mb-1">Get Started</p>
              <p className="text-blue-700">
                Select the add-on features you want to compare across insurance companies. 
                This will help you find the best coverage for your needs.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddOnSelector;