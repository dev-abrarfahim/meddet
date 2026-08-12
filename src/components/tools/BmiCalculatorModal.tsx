import React, { useState } from 'react';
import { X, Calculator } from 'lucide-react';

interface BmiCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BmiCalculatorModal: React.FC<BmiCalculatorModalProps> = ({ isOpen, onClose }) => {
  const [heightCm, setHeightCm] = useState<number>(170);
  const [weightKg, setWeightKg] = useState<number>(68);

  if (!isOpen) return null;

  // BMI Calculation
  const heightMeters = heightCm / 100;
  const bmi = heightMeters > 0 ? Number((weightKg / (heightMeters * heightMeters)).toFixed(1)) : 0;

  let category = 'Normal Weight';
  let badgeColor = 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
  let gaugePercent = 45;

  if (bmi < 18.5) {
    category = 'Underweight';
    badgeColor = 'bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 border-sky-300 dark:border-sky-800';
    gaugePercent = Math.max(10, (bmi / 18.5) * 25);
  } else if (bmi >= 18.5 && bmi <= 24.9) {
    category = 'Normal Weight';
    badgeColor = 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
    gaugePercent = 25 + ((bmi - 18.5) / 6.4) * 25;
  } else if (bmi >= 25 && bmi <= 29.9) {
    category = 'Overweight';
    badgeColor = 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800';
    gaugePercent = 50 + ((bmi - 25) / 4.9) * 25;
  } else if (bmi >= 30) {
    category = 'Obesity Class';
    badgeColor = 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-800';
    gaugePercent = Math.min(100, 75 + ((bmi - 30) / 10) * 25);
  }

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#152232] rounded-xl border border-[#CCECEE] dark:border-[#243B53] shadow-2xl max-w-xl w-full p-5 sm:p-7 relative overflow-hidden my-8 transition-colors duration-300">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#F1F9FF] dark:border-[#243B53] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#14967F] dark:bg-[#2DD4BF] text-[#E2FCD6] dark:text-slate-950 flex items-center justify-center font-bold">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-[#095D7E] dark:text-slate-100">Medical Tools & BMI Calculator</h2>
              <p className="text-xs text-[#095D7E]/70 dark:text-slate-300">Clinical body mass index and health metrics</p>
            </div>
          </div>

          <button
            onClick={onClose}
            id="close-bmi-modal-btn"
            className="p-2 rounded-lg bg-[#F1F9FF] dark:bg-[#1A2B3E] text-[#095D7E] dark:text-slate-200 hover:bg-[#CCECEE] dark:hover:bg-[#243B53] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BMI Calculator Inputs & Meter */}
        <div className="mt-5 space-y-5">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Height Input */}
            <div className="bg-[#F1F9FF] dark:bg-[#1A2B3E] border border-[#CCECEE] dark:border-[#243B53] rounded-lg p-4 space-y-2">
              <label className="text-xs font-bold text-[#095D7E] dark:text-slate-300 uppercase tracking-wider flex items-center justify-between">
                <span>Height (cm)</span>
                <span className="text-[#14967F] dark:text-[#2DD4BF]">{heightCm} cm</span>
              </label>
              <input
                type="range"
                min="100"
                max="220"
                value={heightCm}
                onChange={(e) => setHeightCm(Number(e.target.value))}
                className="w-full accent-[#14967F] dark:accent-[#2DD4BF] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#095D7E]/60 dark:text-slate-400 font-semibold">
                <span>100 cm</span>
                <span>160 cm</span>
                <span>220 cm</span>
              </div>
            </div>

            {/* Weight Input */}
            <div className="bg-[#F1F9FF] dark:bg-[#1A2B3E] border border-[#CCECEE] dark:border-[#243B53] rounded-lg p-4 space-y-2">
              <label className="text-xs font-bold text-[#095D7E] dark:text-slate-300 uppercase tracking-wider flex items-center justify-between">
                <span>Weight (kg)</span>
                <span className="text-[#14967F] dark:text-[#2DD4BF]">{weightKg} kg</span>
              </label>
              <input
                type="range"
                min="30"
                max="150"
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                className="w-full accent-[#14967F] dark:accent-[#2DD4BF] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#095D7E]/60 dark:text-slate-400 font-semibold">
                <span>30 kg</span>
                <span>80 kg</span>
                <span>150 kg</span>
              </div>
            </div>

          </div>

          {/* BMI Result Box */}
          <div className="bg-[#E2FCD6]/40 dark:bg-[#064E3B]/40 border border-[#14967F]/30 dark:border-[#059669]/40 rounded-lg p-5 text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0D6F5D] dark:text-[#6EE7B7]">Calculated BMI Score</span>
            
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-4xl sm:text-5xl font-black text-[#095D7E] dark:text-slate-100">{bmi}</span>
              <span className="text-xs text-[#095D7E]/80 dark:text-slate-300 font-bold">kg/m²</span>
            </div>

            <div>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${badgeColor}`}>
                Category: {category}
              </span>
            </div>

            {/* Visual Gauge Bar */}
            <div className="space-y-1 pt-2">
              <div className="w-full h-3 bg-gray-200 dark:bg-[#243B53] rounded-full overflow-hidden relative">
                <div
                  className="h-full bg-[#14967F] dark:bg-[#2DD4BF] transition-all duration-300 rounded-full"
                  style={{ width: `${gaugePercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-[#095D7E]/70 dark:text-slate-400 font-semibold">
                <span>Underweight (&lt;18.5)</span>
                <span>Normal (18.5–24.9)</span>
                <span>Overweight (25–29.9)</span>
                <span>Obese (&ge;30)</span>
              </div>
            </div>
          </div>

          {/* Future Clinical Tools Placeholders */}
          <div className="pt-2 border-t border-[#F1F9FF] dark:border-[#243B53] space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#095D7E] dark:text-slate-300">Upcoming Clinical Tools</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              
              <div className="p-3 bg-[#F1F9FF] dark:bg-[#1A2B3E] border border-[#CCECEE] dark:border-[#243B53] rounded-xl flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#095D7E] dark:text-slate-100 block">eGFR Kidney Function</span>
                  <span className="text-[10px] text-[#095D7E]/70 dark:text-slate-400">Glomerular Filtration Calculator</span>
                </div>
                <span className="bg-[#CCECEE] dark:bg-[#1E3A52] text-[#095D7E] dark:text-[#2DD4BF] text-[10px] font-semibold px-2 py-0.5 rounded">
                  Coming Soon
                </span>
              </div>

              <div className="p-3 bg-[#F1F9FF] dark:bg-[#1A2B3E] border border-[#CCECEE] dark:border-[#243B53] rounded-xl flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#095D7E] dark:text-slate-100 block">Interaction Checker</span>
                  <span className="text-[10px] text-[#095D7E]/70 dark:text-slate-400">Multi-drug safety analysis</span>
                </div>
                <span className="bg-[#CCECEE] dark:bg-[#1E3A52] text-[#095D7E] dark:text-[#2DD4BF] text-[10px] font-semibold px-2 py-0.5 rounded">
                  Coming Soon
                </span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
