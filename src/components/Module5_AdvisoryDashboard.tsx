import React, { useState } from 'react';
import { 
  Download, 
  Thermometer, 
  Droplets, 
  Sun, 
  ShieldCheck, 
  Volume2, 
  CheckCircle2
} from 'lucide-react';
import { ChamberCondition, GraftRecord } from '../types/graft';
import { HEALING_CHAMBER_PROTOCOLS } from '../data/mockData';
import { exportResearchDataCSV, exportResearchDataJSON } from '../services/storage';
import { voiceService } from '../services/voiceAssistant';
import { Language, TRANSLATIONS } from '../i18n/translations';

interface Module5AdvisoryProps {
  records: GraftRecord[];
  onUpdateOutcome: (recordId: string, outcome: GraftRecord['outcome']) => void;
  highContrast: boolean;
  fontSize: 'normal' | 'large' | 'xlarge';
  language: Language;
}

export const Module5_AdvisoryDashboard: React.FC<Module5AdvisoryProps> = ({
  records,
  onUpdateOutcome,
  highContrast,
  fontSize,
  language
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const currentProtocol: ChamberCondition = HEALING_CHAMBER_PROTOCOLS[selectedDayIndex] || HEALING_CHAMBER_PROTOCOLS[0];

  const speakAdvisory = () => {
    if (language === 'hi') {
      let script = `उपचार कक्ष परामर्श: ${currentProtocol.dayRange}। चरण: ${currentProtocol.stageTitle}। `;
      script += `लक्षित तापमान ${currentProtocol.targetTempMinC} से ${currentProtocol.targetTempMaxC} डिग्री सेल्सियस। `;
      script += `लक्षित सापेक्ष आर्द्रता ${currentProtocol.targetRhMinPct} से ${currentProtocol.targetRhMaxPct} प्रतिशत है। `;
      script += `किसान निर्देश: ${currentProtocol.actionGuidance}`;
      voiceService.speak(script);
    } else {
      let script = `Healing Chamber Advisory for ${currentProtocol.dayRange}. Stage: ${currentProtocol.stageTitle}. `;
      script += `Target temperature is ${currentProtocol.targetTempMinC} to ${currentProtocol.targetTempMaxC} degrees Celsius. `;
      script += `Target relative humidity is ${currentProtocol.targetRhMinPct} to ${currentProtocol.targetRhMaxPct} percent. `;
      script += `Field action guidance: ${currentProtocol.actionGuidance}`;
      voiceService.speak(script);
    }
  };

  const handleDownloadJSON = () => {
    const jsonStr = exportResearchDataJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AI-GRAFT-Research-Dataset-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    voiceService.speak(language === 'hi' ? 'शोध डेटा JSON फाइल डाउनलोड हुई।' : 'Research dataset exported as JSON file.');
  };

  const handleDownloadCSV = () => {
    const csvStr = exportResearchDataCSV();
    const blob = new Blob([csvStr], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AI-GRAFT-Graft-Records-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    voiceService.speak(language === 'hi' ? 'कलम रिकॉर्ड CSV फाइल डाउनलोड हुई।' : 'Graft records exported as CSV spreadsheet.');
  };

  return (
    <div className="space-y-4 pb-20 animate-fade-in">
      
      {/* Title Header - Zero-Pill Botanical Banner */}
      <div className={`p-4 border transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
        highContrast
          ? 'bg-stone-950 text-amber-300 border-amber-400'
          : 'bg-[#faf9f6] text-stone-900 border-stone-300'
      }`}>
        <div>
          <span className="font-mono text-xs font-bold text-[#1e4a31] dark:text-amber-400 uppercase tracking-wider">
            FR-5 · Healing Advisory & Research Export
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight mt-0.5">{t.advisoryTitle}</h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-amber-200/80 mt-1 max-w-2xl">
            {t.advisorySubtitle}
          </p>
        </div>

        <button
          onClick={speakAdvisory}
          className={`px-3 py-2 border text-xs font-bold flex items-center gap-1.5 transition shrink-0 ${
            highContrast
              ? 'bg-amber-400 text-stone-950 border-amber-300 hover:bg-amber-300'
              : 'bg-[#183625] text-stone-100 border-[#0d2116] hover:bg-[#254f38]'
          }`}
        >
          <Volume2 className="w-4 h-4" />
          <span>{t.speakChamber}</span>
        </button>
      </div>

      {/* Non-Actuating Chamber Disclaimer */}
      <div className={`p-3 border flex items-start gap-2.5 text-xs ${
        highContrast ? 'bg-stone-950 border-amber-400/80 text-amber-200' : 'bg-[#fffbeb] border-[#fde68a] text-[#78350f]'
      }`}>
        <ShieldCheck className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="block font-bold text-xs uppercase mb-0.5">{t.nonActuatingNoticeTitle}</strong>
          <span className="leading-relaxed opacity-90">{t.nonActuatingNoticeDesc}</span>
        </div>
      </div>

      {/* Protocol Phase Selector (Zero-Pill Rectangles) */}
      <div className="space-y-1.5">
        <span className="font-mono text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-amber-200 block">
          {t.selectPhase}:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {HEALING_CHAMBER_PROTOCOLS.map((proto, idx) => (
            <button
              key={proto.dayRange}
              onClick={() => setSelectedDayIndex(idx)}
              className={`p-2.5 border text-left transition ${
                selectedDayIndex === idx
                  ? highContrast
                    ? 'bg-amber-400 text-stone-950 border-amber-300 font-bold'
                    : 'bg-[#183625] text-stone-100 border-[#0d2116] font-bold shadow-2xs'
                  : highContrast
                  ? 'bg-stone-900 border-stone-700 text-amber-200 hover:bg-stone-800'
                  : 'bg-white border-stone-300 text-stone-800 hover:bg-stone-50'
              }`}
            >
              <div className="text-xs font-mono font-bold uppercase">{proto.dayRange}</div>
              <div className="text-[11px] opacity-80 mt-0.5 truncate">{proto.stageTitle.split('&')[0]}</div>
              <div className="text-[10px] font-mono opacity-60 mt-1">
                RH: {proto.targetRhMinPct}–{proto.targetRhMaxPct}%
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main 2-Column: Left Protocol / Right Export & Audit */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Left Column: Bounded Climate Targets */}
        <div className={`p-4 border flex flex-col justify-between ${
          highContrast ? 'bg-stone-950 text-amber-300 border-amber-400' : 'bg-white text-stone-900 border-stone-300'
        }`}>
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-stone-300 dark:border-amber-400/40">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-amber-200">
                Evidence-Bounded Climate Bounds
              </span>
              <span className="text-xs font-mono font-bold">{currentProtocol.dayRange}</span>
            </div>

            <div className="my-3">
              <h3 className="text-base font-bold text-[#183625] dark:text-amber-300">
                {currentProtocol.stageTitle}
              </h3>
              <p className="text-xs text-stone-600 dark:text-amber-200/80 mt-1 leading-relaxed">
                <strong>Biological Purpose:</strong> {currentProtocol.purpose}
              </p>
            </div>

            {/* Target Metrics Grid */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              
              <div className={`p-2.5 border ${
                highContrast ? 'bg-stone-900 border-amber-400' : 'bg-stone-50 border-stone-200'
              }`}>
                <Droplets className="w-4 h-4 mx-auto mb-1 text-sky-600 dark:text-sky-400" />
                <span className="text-stone-500 block text-[10px]">{t.targetHumidity}</span>
                <span className="text-base font-bold font-mono text-stone-900 dark:text-amber-300">
                  {currentProtocol.targetRhMinPct}–{currentProtocol.targetRhMaxPct}%
                </span>
                <span className="text-[10px] block text-stone-400">Taper to harden</span>
              </div>

              <div className={`p-2.5 border ${
                highContrast ? 'bg-stone-900 border-amber-400' : 'bg-stone-50 border-stone-200'
              }`}>
                <Thermometer className="w-4 h-4 mx-auto mb-1 text-amber-600 dark:text-amber-400" />
                <span className="text-stone-500 block text-[10px]">{t.targetTemp}</span>
                <span className="text-base font-bold font-mono text-stone-900 dark:text-amber-300">
                  {currentProtocol.targetTempMinC}–{currentProtocol.targetTempMaxC}°C
                </span>
                <span className="text-[10px] block text-stone-400">Callus rate</span>
              </div>

              <div className={`p-2.5 border ${
                highContrast ? 'bg-stone-900 border-amber-400' : 'bg-stone-50 border-stone-200'
              }`}>
                <Sun className="w-4 h-4 mx-auto mb-1 text-yellow-600 dark:text-yellow-400" />
                <span className="text-stone-500 block text-[10px]">{t.lightIntensity}</span>
                <span className="text-base font-bold font-mono text-stone-900 dark:text-amber-300">
                  {currentProtocol.lightIntensityUmol} µmol
                </span>
                <span className="text-[10px] block text-stone-400">{currentProtocol.photoperiodHours}h Light</span>
              </div>
            </div>

            {/* Field Action Guidance */}
            <div className={`mt-4 p-3 border text-xs ${
              highContrast ? 'bg-stone-900 border-amber-400 text-amber-200' : 'bg-[#eef6ee] border-[#2e6d47] text-[#143d26]'
            }`}>
              <div className="font-bold text-xs uppercase mb-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                {t.farmerGuidance}:
              </div>
              <p className="leading-relaxed">{currentProtocol.actionGuidance}</p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-300 dark:border-amber-400/40 text-[11px] text-stone-500 font-mono italic">
            Source: USDA-ARS & Vegetable Grafting Working Group Solanaceous Guidelines.
          </div>
        </div>

        {/* Right Column: Dataset Export & Outcome Auditing */}
        <div className={`p-4 border flex flex-col justify-between ${
          highContrast ? 'bg-stone-950 text-amber-300 border-amber-400' : 'bg-white text-stone-900 border-stone-300'
        }`}>
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-stone-300 dark:border-amber-400/40">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-amber-200">
                {t.researchExport}
              </span>
              <span className="text-xs font-mono font-bold">FR-5 Deliverable</span>
            </div>

            <p className="text-xs text-stone-600 dark:text-amber-200/80 my-2 leading-relaxed">
              Export complete morphology measurements, GQI components, model versioning metadata, and temporal predictions for agronomic review.
            </p>

            {/* Export Buttons (Zero-Pill Rectangles) */}
            <div className="grid grid-cols-2 gap-2 my-3">
              <button
                onClick={handleDownloadJSON}
                className={`py-2.5 px-3 font-bold text-xs flex flex-col items-center justify-center gap-1 border transition ${
                  highContrast
                    ? 'bg-amber-400 text-stone-950 border-amber-300 hover:bg-amber-300'
                    : 'bg-[#183625] text-stone-100 border-[#0d2116] hover:bg-[#254f38]'
                }`}
              >
                <Download className="w-4 h-4" />
                <span>{t.exportJSON}</span>
                <span className="text-[10px] font-normal opacity-80 font-mono">(Metadata)</span>
              </button>

              <button
                onClick={handleDownloadCSV}
                className={`py-2.5 px-3 font-bold text-xs flex flex-col items-center justify-center gap-1 border transition ${
                  highContrast
                    ? 'bg-stone-900 text-amber-300 border-amber-400 hover:bg-stone-800'
                    : 'bg-stone-100 text-stone-900 border-stone-300 hover:bg-stone-200'
                }`}
              >
                <Download className="w-4 h-4" />
                <span>{t.exportCSV}</span>
                <span className="text-[10px] font-normal opacity-80 font-mono">(Pandas / R)</span>
              </button>
            </div>

            {/* Outcome Labeling */}
            <div className="mt-4 pt-3 border-t border-stone-300 dark:border-amber-400/40">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-amber-200 block mb-2">
                {t.auditOutcomes}:
              </span>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {records.map((r) => (
                  <div
                    key={r.id}
                    className={`p-2 border flex items-center justify-between text-xs ${
                      highContrast ? 'bg-stone-900 border-stone-700' : 'bg-stone-50 border-stone-200'
                    }`}
                  >
                    <div>
                      <span className="font-mono font-bold text-[#183625] dark:text-amber-300">{r.plantTag}</span>
                      <div className="text-[10px] text-stone-500 font-mono">GQI: {r.gqiScore} · {r.rootstockVariety}</div>
                    </div>

                    <select
                      value={r.outcome}
                      onChange={(e) => onUpdateOutcome(r.id, e.target.value as GraftRecord['outcome'])}
                      className={`text-xs font-medium p-1 border font-mono ${
                        highContrast ? 'bg-stone-950 border-amber-400 text-amber-300' : 'bg-white border-stone-300 text-stone-800'
                      }`}
                    >
                      <option value="PENDING">{t.outcomePending}</option>
                      <option value="SUCCESS_HEALED">{t.outcomeSuccess}</option>
                      <option value="FAILED_WILT">{t.outcomeWilt}</option>
                      <option value="FAILED_NECROSIS">{t.outcomeNecrosis}</option>
                      <option value="ADVENTITIOUS_ROOT_FAIL">{t.outcomeRooting}</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-2 text-[10px] text-stone-400 font-mono">
            Model: AI-GRAFT-GBoost-Tomato · Non-actuating software platform.
          </div>
        </div>

      </div>
    </div>
  );
};
