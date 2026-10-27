import React, { useState, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { TRANSLATIONS } from '../data/translations';
import { Calculator, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

interface PdaCalculatorProps {
  onApplyEstimateToForm: (data: {
    vesselType: string;
    grossTonnage: number;
    portStayDays: number;
    terminal: string;
    services: string[];
    estimatedSummary: string;
  }) => void;
}

export const PdaCalculatorSection: React.FC<PdaCalculatorProps> = ({ onApplyEstimateToForm }) => {
  const { lang } = useLanguage();
  const t = TRANSLATIONS[lang].calculator;

  const [vesselType, setVesselType] = useState('tug-barge');
  const [grossTonnage, setGrossTonnage] = useState<number>(3500);
  const [portStayDays, setPortStayDays] = useState<number>(3);
  const [targetTerminal, setTargetTerminal] = useState('Terminal LDC East Indonesia');
  
  const [serviceFreshWater, setServiceFreshWater] = useState(false);
  const [freshWaterTons, setFreshWaterTons] = useState(100);
  const [serviceCrewChange, setServiceCrewChange] = useState(false);
  const [crewChangeCount, setCrewChangeCount] = useState(4);
  const [serviceBunkerCoord, setServiceBunkerCoord] = useState(false);
  const [serviceCargoHandling, setServiceCargoHandling] = useState(false);

  // Calculation logic for Indonesian port agency workflows
  const calculation = useMemo(() => {
    let agencyFeeBase = 12000000; // Base IDR
    if (grossTonnage > 15000) agencyFeeBase = 22000000;
    else if (grossTonnage > 5000) agencyFeeBase = 16000000;
    else if (grossTonnage < 1500) agencyFeeBase = 8500000;

    let stayFee = (portStayDays - 1) * 1250000;
    if (stayFee < 0) stayFee = 0;

    let waterFee = serviceFreshWater ? freshWaterTons * 85000 : 0;
    let crewFee = serviceCrewChange ? crewChangeCount * 2200000 : 0;
    let bunkerFee = serviceBunkerCoord ? 4500000 : 0;
    let cargoFee = serviceCargoHandling ? 7500000 : 0;

    const estimatedTotal = agencyFeeBase + stayFee + waterFee + crewFee + bunkerFee + cargoFee;

    return {
      agencyFeeBase,
      stayFee,
      waterFee,
      crewFee,
      bunkerFee,
      cargoFee,
      estimatedTotal,
    };
  }, [grossTonnage, portStayDays, serviceFreshWater, freshWaterTons, serviceCrewChange, crewChangeCount, serviceBunkerCoord, serviceCargoHandling]);

  const handleApply = () => {
    const selectedServices: string[] = ['Port Clearance CIQP'];
    if (serviceFreshWater) selectedServices.push(`Fresh Water Supply (${freshWaterTons} Ton)`);
    if (serviceCrewChange) selectedServices.push(`Crew Change (${crewChangeCount} Crew)`);
    if (serviceBunkerCoord) selectedServices.push('Bunker Coordination');
    if (serviceCargoHandling) selectedServices.push('Cargo Stevedoring / Tally');

    const summaryText = `Estimasi Port Call ${vesselType.toUpperCase()}, GT: ${grossTonnage.toLocaleString()}, Durasi: ${portStayDays} hari di ${targetTerminal}. Layanan: ${selectedServices.join(', ')}.`;

    onApplyEstimateToForm({
      vesselType,
      grossTonnage,
      portStayDays,
      terminal: targetTerminal,
      services: selectedServices,
      estimatedSummary: summaryText,
    });
  };

  const vesselOptions = lang === 'en' ? [
    { id: 'tug-barge', label: 'Tug & Barge' },
    { id: 'bulk-carrier', label: 'Bulk Carrier (Dry Bulk)' },
    { id: 'oil-tanker', label: 'CPO / Chemical Tanker' },
    { id: 'general-cargo', label: 'General Cargo / Container' },
    { id: 'lct-landing', label: 'LCT / Project Vessel' },
    { id: 'offshore-vessel', label: 'Offshore Supply / AHTS' },
  ] : [
    { id: 'tug-barge', label: 'Tug & Barge / Tongkang' },
    { id: 'bulk-carrier', label: 'Bulk Carrier (Curah)' },
    { id: 'oil-tanker', label: 'Oil / Chemical Tanker' },
    { id: 'general-cargo', label: 'General Cargo / Petikemas' },
    { id: 'lct-landing', label: 'LCT / Proyek' },
    { id: 'offshore-vessel', label: 'Offshore Supply / AHTS' },
  ];

  return (
    <section id="kalkulator-pda" className="py-20 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-2">
            {t.kicker}
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white mb-4">
            {t.title}
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls Column */}
          <div className="lg:col-span-7 bg-slate-800/80 p-6 sm:p-8 rounded-xl border border-slate-700 space-y-6">
            
            {/* 1. Vessel Type */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-300 mb-2">
                {t.step1}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {vesselOptions.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setVesselType(type.id)}
                    className={`px-3 py-2 text-xs font-semibold rounded-lg border text-left transition-colors ${
                      vesselType === type.id
                        ? 'bg-blue-600 border-blue-500 text-white shadow-sm'
                        : 'bg-slate-900/60 border-slate-700 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Gross Tonnage & Port Stay Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div>
                <div className="flex justify-between items-center mb-1 text-xs">
                  <span className="font-bold text-slate-300 uppercase">{t.gtLabel}</span>
                  <span className="font-mono font-bold text-amber-400">{grossTonnage.toLocaleString()} GT</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="40000"
                  step="500"
                  value={grossTonnage}
                  onChange={(e) => setGrossTonnage(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer h-2 bg-slate-700 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                  <span>500 GT</span>
                  <span>20.000 GT</span>
                  <span>40.000 GT+</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1 text-xs">
                  <span className="font-bold text-slate-300 uppercase">{t.stayLabel}</span>
                  <span className="font-mono font-bold text-amber-400">{portStayDays} {t.daysUnit}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="14"
                  step="1"
                  value={portStayDays}
                  onChange={(e) => setPortStayDays(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer h-2 bg-slate-700 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                  <span>1 {t.daysUnit}</span>
                  <span>7 {t.daysUnit}</span>
                  <span>14 {t.daysUnit}</span>
                </div>
              </div>
            </div>

            {/* 3. Port / Terminal Destination */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-300 mb-2">
                {t.step2}
              </label>
              <select
                value={targetTerminal}
                onChange={(e) => setTargetTerminal(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Terminal LDC East Indonesia">1. Terminal LDC East Indonesia (Refinery & CPO)</option>
                <option value="Terminal Kutai Refinery Nusantara (KRN)">2. Terminal Kutai Refinery Nusantara / KRN (Apical CPO)</option>
                <option value="Terminal Wahana Prima Sejati (WPS)">3. Terminal Wahana Prima Sejati / WPS (Curah Kering & Batu Bara)</option>
                <option value="Terminal Agpa Refinery Complex (ARC)">4. Terminal Agpa Refinery Complex / ARC (Refinery Cair)</option>
                <option value="Terminal Interport ILSS">5. Terminal Interport ILSS (Offshore Supply Base & Pipa)</option>
                <option value="Pelabuhan Semayang">6. Pelabuhan Semayang (Hub Umum & Niaga Balikpapan)</option>
              </select>
            </div>

            {/* 4. Additional Marine Services */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-300 mb-3">
                {t.step3}
              </label>
              <div className="space-y-3">
                
                {/* CIQP (Mandatory) */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/60 border border-slate-700 text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="font-medium text-slate-200">{t.ciqpIncluded}</span>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400">{t.ciqpBase}</span>
                </div>

                {/* Fresh Water */}
                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-700 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={serviceFreshWater}
                        onChange={(e) => setServiceFreshWater(e.target.checked)}
                        className="rounded accent-blue-500 w-4 h-4"
                      />
                      <span className="font-medium text-slate-200">{t.freshWater}</span>
                    </label>
                    {serviceFreshWater && (
                      <span className="font-mono text-amber-400 text-xs font-bold">
                        {freshWaterTons} Ton
                      </span>
                    )}
                  </div>
                  {serviceFreshWater && (
                    <div className="pt-2 flex items-center gap-3">
                      <input
                        type="range"
                        min="20"
                        max="500"
                        step="20"
                        value={freshWaterTons}
                        onChange={(e) => setFreshWaterTons(Number(e.target.value))}
                        className="flex-1 accent-amber-400 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
                      />
                      <span className="text-[11px] text-slate-400 font-mono">20 - 500 Ton</span>
                    </div>
                  )}
                </div>

                {/* Crew Change */}
                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-700 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={serviceCrewChange}
                        onChange={(e) => setServiceCrewChange(e.target.checked)}
                        className="rounded accent-blue-500 w-4 h-4"
                      />
                      <span className="font-medium text-slate-200">{t.crewChange}</span>
                    </label>
                    {serviceCrewChange && (
                      <span className="font-mono text-amber-400 text-xs font-bold">
                        {crewChangeCount} {lang === 'en' ? 'Crew' : 'Awak'}
                      </span>
                    )}
                  </div>
                  {serviceCrewChange && (
                    <div className="pt-2 flex items-center gap-3">
                      <input
                        type="range"
                        min="1"
                        max="20"
                        step="1"
                        value={crewChangeCount}
                        onChange={(e) => setCrewChangeCount(Number(e.target.value))}
                        className="flex-1 accent-amber-400 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
                      />
                      <span className="text-[11px] text-slate-400 font-mono">1 - 20 {lang === 'en' ? 'Crew' : 'Kru'}</span>
                    </div>
                  )}
                </div>

                {/* Bunker & Cargo checkboxes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex items-center gap-2 p-3 rounded-lg bg-slate-900/60 border border-slate-700 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={serviceBunkerCoord}
                      onChange={(e) => setServiceBunkerCoord(e.target.checked)}
                      className="rounded accent-blue-500 w-4 h-4"
                    />
                    <span className="text-slate-200">{t.bunkerCoord}</span>
                  </label>

                  <label className="flex items-center gap-2 p-3 rounded-lg bg-slate-900/60 border border-slate-700 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={serviceCargoHandling}
                      onChange={(e) => setServiceCargoHandling(e.target.checked)}
                      className="rounded accent-blue-500 w-4 h-4"
                    />
                    <span className="text-slate-200">{t.cargoCoord}</span>
                  </label>
                </div>

              </div>
            </div>

          </div>

          {/* Breakdown & Summary Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-gradient-to-br from-slate-800 to-slate-950 p-6 sm:p-8 rounded-xl border border-slate-700 shadow-xl space-y-6">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <Calculator className="w-5 h-5 text-amber-400" />
                  <span>{t.summaryTitle}</span>
                </div>
                <span className="text-[11px] font-mono text-emerald-400">IDR Estimasi</span>
              </div>

              {/* Itemized list */}
              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center text-slate-300">
                  <span>{t.agencyBaseFee}</span>
                  <span className="font-mono font-medium text-white">
                    Rp {calculation.agencyFeeBase.toLocaleString('id-ID')}
                  </span>
                </div>

                <div className="flex justify-between items-center text-slate-300">
                  <span>{t.stayFee} ({portStayDays} {t.daysUnit}):</span>
                  <span className="font-mono font-medium text-white">
                    Rp {calculation.stayFee.toLocaleString('id-ID')}
                  </span>
                </div>

                {serviceFreshWater && (
                  <div className="flex justify-between items-center text-slate-300">
                    <span>{t.freshWaterFee} ({freshWaterTons} Ton):</span>
                    <span className="font-mono font-medium text-white">
                      Rp {calculation.waterFee.toLocaleString('id-ID')}
                    </span>
                  </div>
                )}

                {serviceCrewChange && (
                  <div className="flex justify-between items-center text-slate-300">
                    <span>{t.crewFee} ({crewChangeCount} {lang === 'en' ? 'Crew' : 'Awak'}):</span>
                    <span className="font-mono font-medium text-white">
                      Rp {calculation.crewFee.toLocaleString('id-ID')}
                    </span>
                  </div>
                )}

                {serviceBunkerCoord && (
                  <div className="flex justify-between items-center text-slate-300">
                    <span>{t.bunkerFee}</span>
                    <span className="font-mono font-medium text-white">
                      Rp {calculation.bunkerFee.toLocaleString('id-ID')}
                    </span>
                  </div>
                )}

                {serviceCargoHandling && (
                  <div className="flex justify-between items-center text-slate-300">
                    <span>{t.cargoFee}</span>
                    <span className="font-mono font-medium text-white">
                      Rp {calculation.cargoFee.toLocaleString('id-ID')}
                    </span>
                  </div>
                )}
              </div>

              {/* Total Calculation */}
              <div className="pt-4 border-t border-slate-700/80">
                <div className="text-xs text-slate-400 mb-1">{t.totalLabel}</div>
                <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono tracking-tight">
                  Rp {calculation.estimatedTotal.toLocaleString('id-ID')}
                  <span className="text-xs text-slate-400 font-normal ml-2">{t.estimateDisclaimer}</span>
                </div>
              </div>

              <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-950/40 border border-blue-900/60 text-[11px] text-blue-200">
                <AlertCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>{t.tariffNote}</span>
              </div>

              {/* Apply to Form Button */}
              <button
                type="button"
                onClick={handleApply}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-lg transition-colors shadow-md"
              >
                <span>{t.applyBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
