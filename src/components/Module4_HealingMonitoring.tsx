import React, { useState } from 'react';
import { 
  Volume2, 
  CheckCircle2, 
  AlertTriangle, 
  Activity, 
  Info
} from 'lucide-react';
import { GraftRecord, HealingDayLog } from '../types/graft';
import { generateSeedlingSvg } from '../data/mockData';
import { voiceService } from '../services/voiceAssistant';
import { Language, TRANSLATIONS } from '../i18n/translations';

interface Module4HealingProps {
  records: GraftRecord[];
  healingLogs: HealingDayLog[];
  onAddHealingLog: (log: HealingDayLog) => void;
  selectedRecordId?: string;
  highContrast: boolean;
  fontSize: 'normal' | 'large' | 'xlarge';
  language: Language;
}

export const Module4_HealingMonitoring: React.FC<Module4HealingProps> = ({
  records,
  healingLogs,
  onAddHealingLog,
  selectedRecordId,
  highContrast,
  fontSize,
  language
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const [activeRecordId, setActiveRecordId] = useState<string>(selectedRecordId || records[0]?.id || 'graft-rec-101');
  const activeRecord = records.find(r => r.id === activeRecordId) || records[0];

  const plantLogs = healingLogs.filter(l => l.graftRecordId === activeRecordId);
  const [selectedDayLogId, setSelectedDayLogId] = useState<string>(plantLogs[plantLogs.length - 1]?.id || plantLogs[0]?.id || '');
  const activeLog = plantLogs.find(l => l.id === selectedDayLogId) || plantLogs[plantLogs.length - 1] || plantLogs[0];

  const speakHealingStatus = () => {
    if (!activeLog) return;
    if (language === 'hi') {
      let text = `पौधा ${activeRecord.plantTag}, दिन ${activeLog.dayNumber}। `;
      text += `अनुमानित 7-दिवसीय विफलता जोखिम ${activeLog.failureRiskPct} प्रतिशत है। `;
      if (activeLog.indicators.adventitiousRoots) {
        text += `गंभीर चेतावनी: सायन पर अस्थानिक जड़ें निकली हैं। ये जड़ें मूलवृंत को बायपास कर रही हैं। तुरंत जड़ें काटें। `;
      }
      if (activeLog.indicators.callusBridgeVisible) {
        text += `कैलस ऊतक की स्वस्थ वृद्धि सिलिकॉन क्लिप के माध्यम से देखी जा सकती है। `;
      }
      voiceService.speak(text);
    } else {
      let text = `Plant ${activeRecord.plantTag} at Day ${activeLog.dayNumber}. `;
      text += `Estimated 7-day failure risk is ${activeLog.failureRiskPct} percent, plus or minus ${activeLog.uncertaintyMarginPct} percent. `;
      if (activeLog.indicators.adventitiousRoots) {
        text += `Critical alert: Adventitious roots detected on the scion. Scion is bypassing rootstock. `;
      }
      if (activeLog.indicators.callusBridgeVisible) {
        text += `Healthy callus bridge proliferation is visible through the silicone clip. `;
      }
      voiceService.speak(text);
    }
  };

  const addObservationPreset = (scenario: 'normal_day10' | 'adventitious_root_alert' | 'insufficient_evidence') => {
    if (scenario === 'normal_day10') {
      const newLog: HealingDayLog = {
        id: `heal-${Date.now()}`,
        graftRecordId: activeRecordId,
        dayNumber: 10,
        date: '2026-10-24',
        stageCode: 'S4',
        stageName: language === 'hi' ? 'चरण 4: सख्त होना व संवहनी जुड़ाव' : 'Stage 4: Acclimatization & Hardened Vascular Union',
        failureRiskPct: 1.8,
        riskCategory: 'LOW',
        uncertaintyMarginPct: 0.9,
        imageUrl: generateSeedlingSvg('grafted', 2.1, 'callused'),
        indicators: {
          adventitiousRoots: false,
          callusBridgeVisible: true,
          turgorWiltingScore: 0,
          unionNecrosis: false,
          clipDisplaced: false,
          leafYellowing: false,
        },
        notes: language === 'hi'
          ? 'कक्ष आर्द्रता 70% तक घटाई गई। पौधा सामान्य प्रकाश में पूरी तरह सीधा है। कलम जुड़ चुकी है।'
          : 'Chamber humidity lowered to 70%. Seedling maintains full turgor under standard light. Graft healed.',
      };
      onAddHealingLog(newLog);
      setSelectedDayLogId(newLog.id);
      voiceService.speak(
        language === 'hi'
          ? 'दिन 10 का निरीक्षण दर्ज हुआ। अनुकूलन सफल। विफलता जोखिम मात्र 1.8 प्रतिशत।'
          : 'Day 10 observation added. Acclimatization successful. Failure risk down to 1.8 percent.'
      );
    } else if (scenario === 'adventitious_root_alert') {
      const newLog: HealingDayLog = {
        id: `heal-${Date.now()}`,
        graftRecordId: activeRecordId,
        dayNumber: 6,
        date: '2026-10-20',
        stageCode: 'S2',
        stageName: language === 'hi' ? 'चरण 2: अस्थानिक जड़ सतर्कता' : 'Stage 2: Adventitious Root Pathology Alert',
        failureRiskPct: 82.0,
        riskCategory: 'HIGH',
        uncertaintyMarginPct: 5.5,
        imageUrl: generateSeedlingSvg('grafted', 2.1, 'rooting'),
        indicators: {
          adventitiousRoots: true,
          callusBridgeVisible: false,
          turgorWiltingScore: 1,
          unionNecrosis: true,
          clipDisplaced: false,
          leafYellowing: true,
        },
        notes: language === 'hi'
          ? 'गंभीर चेतावनी: क्लिप के ऊपर सायन से जड़ें निकल रही हैं। सायन अपनी जड़ें बनाकर मिट्टी में प्रवेश कर जाएगा।'
          : 'Critical: Adventitious root emerging from scion stem above clip! Scion will develop own roots and bypass soilborne disease resistance.',
        abstainWarning: language === 'hi'
          ? 'अस्थानिक जड़ें पाई गईं। तुरंत जड़ें काटकर अलग करें।'
          : 'Adventitious roots detected. Prune adventitious roots immediately.',
      };
      onAddHealingLog(newLog);
      setSelectedDayLogId(newLog.id);
      voiceService.speak(
        language === 'hi'
          ? 'उच्च विफलता जोखिम चेतावनी! सायन के तने पर अस्थानिक जड़ें निकल आई हैं।'
          : 'High failure risk alert! Adventitious root detected on scion stem.'
      );
    } else if (scenario === 'insufficient_evidence') {
      const newLog: HealingDayLog = {
        id: `heal-${Date.now()}`,
        graftRecordId: activeRecordId,
        dayNumber: 4,
        date: '2026-10-18',
        stageCode: 'S2',
        stageName: language === 'hi' ? 'चरण 2: कैलस वृद्धि (अस्पष्ट दृश्य)' : 'Stage 2: Callus Formation (Occluded Observation)',
        failureRiskPct: 25.0,
        riskCategory: 'EXPERIMENTAL',
        uncertaintyMarginPct: 18.0,
        imageUrl: generateSeedlingSvg('grafted', 2.1, 'healthy'),
        indicators: {
          adventitiousRoots: false,
          callusBridgeVisible: false,
          turgorWiltingScore: 0,
          unionNecrosis: false,
          clipDisplaced: false,
          leafYellowing: false,
        },
        notes: language === 'hi'
          ? 'एसआरएस NFR-3: सिलिकॉन क्लिप पर पानी की बूंदों के कारण कैम्बियम जोड़ स्पष्ट नहीं दिख रहा।'
          : 'SRS NFR-3 Abstention: Heavy mist condensation on silicone clip occludes optical view of cambium union.',
        abstainWarning: language === 'hi'
          ? 'क्लिप पर नमी के कारण दृश्य साक्ष्य अपर्याप्त। मॉडल प्रायोगिक श्रेणी में है।'
          : 'Insufficient visual evidence due to clip condensation. Failure risk marked EXPERIMENTAL per SRS FR-4.',
      };
      onAddHealingLog(newLog);
      setSelectedDayLogId(newLog.id);
      voiceService.speak(
        language === 'hi'
          ? 'निरीक्षण प्रायोगिक माना गया। क्लिप पर धुंध के कारण जोड़ नहीं दिख रहा।'
          : 'Observation marked experimental. Clip condensation occludes union.'
      );
    }
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
            FR-4 · Time-Lapse Healing & Failure Prediction
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight mt-0.5">{t.healingTitle}</h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-amber-200/80 mt-1 max-w-2xl">
            {t.healingSubtitle}
          </p>
        </div>

        <button
          onClick={speakHealingStatus}
          className={`px-3 py-2 border text-xs font-bold flex items-center gap-1.5 transition shrink-0 ${
            highContrast
              ? 'bg-amber-400 text-stone-950 border-amber-300 hover:bg-amber-300'
              : 'bg-[#183625] text-stone-100 border-[#0d2116] hover:bg-[#254f38]'
          }`}
        >
          <Volume2 className="w-4 h-4" />
          <span>{t.speakHealing}</span>
        </button>
      </div>

      {/* Tracked Plant Selector & Observation Simulators */}
      <div className={`p-3 border flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
        highContrast ? 'bg-stone-950 border-amber-400' : 'bg-white border-stone-300'
      }`}>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-amber-200">
            {t.trackedPlant}:
          </span>
          <select
            value={activeRecordId}
            onChange={(e) => setActiveRecordId(e.target.value)}
            className={`font-mono text-xs font-medium p-1.5 border ${
              highContrast ? 'bg-stone-900 border-amber-400 text-amber-300' : 'bg-stone-50 border-stone-300 text-stone-900'
            }`}
          >
            {records.map((r) => (
              <option key={r.id} value={r.id}>
                {r.plantTag} ({r.rootstockVariety} × {r.scionVariety}) — GQI {r.gqiScore}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-mono text-stone-400">{t.addDayLog}:</span>
          <button
            onClick={() => addObservationPreset('normal_day10')}
            className={`px-2 py-1 text-[11px] font-medium border transition ${
              highContrast ? 'bg-stone-900 border-emerald-400 text-emerald-300' : 'bg-[#f4f8f4] border-emerald-300 text-emerald-950'
            }`}
          >
            {t.day10Preset}
          </button>
          <button
            onClick={() => addObservationPreset('adventitious_root_alert')}
            className={`px-2 py-1 text-[11px] font-medium border transition ${
              highContrast ? 'bg-stone-900 border-rose-500 text-rose-300' : 'bg-[#fff1f2] border-rose-300 text-rose-950'
            }`}
          >
            {t.rootAlertPreset}
          </button>
          <button
            onClick={() => addObservationPreset('insufficient_evidence')}
            className={`px-2 py-1 text-[11px] font-medium border transition ${
              highContrast ? 'bg-stone-900 border-sky-400 text-sky-300' : 'bg-[#f0f9ff] border-sky-300 text-sky-950'
            }`}
          >
            {t.occludedPreset}
          </button>
        </div>
      </div>

      {/* Time-Lapse Day Steps Ribbon (Zero-Pill Rectangles) */}
      <div className={`p-3 border overflow-x-auto ${
        highContrast ? 'bg-stone-950 border-amber-400/60' : 'bg-white border-stone-300'
      }`}>
        <div className="flex items-center gap-2 min-w-max">
          {plantLogs.map((log) => {
            const isSelected = (activeLog?.id === log.id);
            return (
              <button
                key={log.id}
                onClick={() => setSelectedDayLogId(log.id)}
                className={`p-2.5 border text-left transition flex flex-col justify-between w-36 ${
                  isSelected
                    ? highContrast
                      ? 'bg-amber-400 text-stone-950 border-amber-300 font-bold'
                      : 'bg-[#183625] text-stone-100 border-[#0d2116] font-bold shadow-2xs'
                    : highContrast
                    ? 'bg-stone-900 border-stone-700 text-amber-200 hover:bg-stone-800'
                    : 'bg-stone-50 border-stone-200 text-stone-800 hover:bg-stone-100'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-xs font-mono font-bold uppercase">Day {log.dayNumber}</span>
                  <span className="text-[10px] font-mono">
                    {log.riskCategory}
                  </span>
                </div>
                <div className="text-[10px] font-mono opacity-80">{log.date}</div>
                <div className="mt-1.5 text-[11px] font-mono font-bold">
                  Risk: {log.failureRiskPct}%
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main 2-Column Inspector */}
      {activeLog && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Left Column: Photograph & Callus Anatomical Overlay */}
          <div className={`p-4 border flex flex-col justify-between ${
            highContrast ? 'bg-stone-950 text-amber-300 border-amber-400' : 'bg-white text-stone-900 border-stone-300'
          }`}>
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-stone-300 dark:border-amber-400/40">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-amber-200">
                  Day {activeLog.dayNumber} Photograph
                </span>
                <span className="text-xs font-mono font-bold">{activeLog.date}</span>
              </div>

              <div className="my-3 relative border border-stone-300 dark:border-amber-400/60 bg-stone-100 aspect-4/3 flex items-center justify-center overflow-hidden">
                <img
                  src={activeLog.imageUrl}
                  alt={`Day ${activeLog.dayNumber} healing`}
                  className="w-full h-full object-contain"
                />

                <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-2">
                  <span className="self-start px-1.5 py-0.5 bg-stone-900/80 text-stone-200 text-[10px] font-mono">
                    {activeLog.stageCode} : {activeLog.stageName.split(':')[1] || activeLog.stageName}
                  </span>

                  {activeLog.indicators.adventitiousRoots && (
                    <div className="self-center px-2 py-1 bg-rose-700 text-white text-xs font-bold border border-white">
                      ▲ ADVENTITIOUS ROOT DETECTED
                    </div>
                  )}

                  {activeLog.indicators.callusBridgeVisible && !activeLog.indicators.adventitiousRoots && (
                    <div className="self-center px-2 py-1 bg-[#183625] text-stone-100 text-xs font-bold border border-emerald-300">
                      ✓ CALLUS INTERFACE INTACT
                    </div>
                  )}

                  <span className="self-end px-1.5 py-0.5 bg-stone-900/80 text-stone-200 text-[10px] font-mono">
                    Silicone Clamp: Seated
                  </span>
                </div>
              </div>

              {/* Indicators Checklist */}
              <div className="space-y-1.5 text-xs">
                <span className="font-mono font-bold uppercase tracking-wider text-stone-600 dark:text-amber-200 block">
                  {t.visibleIndicators}:
                </span>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className={`p-2 border flex items-center gap-1.5 ${
                    activeLog.indicators.callusBridgeVisible
                      ? 'bg-[#eef6ee] text-[#143d26] border-emerald-400'
                      : 'opacity-60 border-stone-200'
                  }`}>
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>{t.indicatorCallus}</span>
                  </div>

                  <div className={`p-2 border flex items-center gap-1.5 ${
                    activeLog.indicators.adventitiousRoots
                      ? 'bg-[#fff1f2] text-[#9f1239] border-rose-400 font-bold'
                      : 'opacity-60 border-stone-200'
                  }`}>
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>{t.indicatorAdventitious}: {activeLog.indicators.adventitiousRoots ? 'YES' : 'NO'}</span>
                  </div>

                  <div className={`p-2 border flex items-center gap-1.5 ${
                    activeLog.indicators.unionNecrosis
                      ? 'bg-[#fff1f2] text-[#9f1239] border-rose-400 font-bold'
                      : 'opacity-60 border-stone-200'
                  }`}>
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>{t.indicatorNecrosis}: {activeLog.indicators.unionNecrosis ? 'YES' : 'NO'}</span>
                  </div>

                  <div className={`p-2 border flex items-center gap-1.5 ${
                    activeLog.indicators.turgorWiltingScore === 0
                      ? 'bg-[#eef6ee] text-[#143d26] border-emerald-400'
                      : 'bg-[#fffbeb] text-[#78350f] border-amber-400 font-bold'
                  }`}>
                    <Activity className="w-3.5 h-3.5 shrink-0" />
                    <span>{t.indicatorTurgor}: {activeLog.indicators.turgorWiltingScore === 0 ? 'Firm' : 'Wilted'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-3 text-[11px] text-stone-500 font-mono italic">
              Observation: {activeLog.notes}
            </div>
          </div>

          {/* Right Column: Early Failure Risk Estimation */}
          <div className={`p-4 border flex flex-col justify-between ${
            highContrast ? 'bg-stone-950 text-amber-300 border-amber-400' : 'bg-white text-stone-900 border-stone-300'
          }`}>
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-stone-300 dark:border-amber-400/40">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-amber-200">
                  {t.failureRisk7Day}
                </span>
                <span className="text-xs font-mono font-bold">7-Day Horizon</span>
              </div>

              {/* High-Contrast Risk Gauge (Rectangular, zero-pill) */}
              <div className={`my-3 p-3.5 border-2 text-center ${
                activeLog.riskCategory === 'LOW'
                  ? highContrast ? 'bg-stone-900 text-emerald-300 border-emerald-400' : 'bg-[#eef6ee] text-[#143d26] border-[#2e6d47]'
                  : activeLog.riskCategory === 'HIGH'
                  ? highContrast ? 'bg-stone-900 text-rose-300 border-rose-400' : 'bg-[#fff1f2] text-[#9f1239] border-[#e11d48]'
                  : highContrast ? 'bg-stone-900 text-amber-300 border-amber-400' : 'bg-[#fffbeb] text-[#78350f] border-[#d97706]'
              }`}>
                <div className="text-xs font-mono font-bold uppercase tracking-wider opacity-80">{t.failureRisk7Day}</div>
                <div className="text-3xl sm:text-4xl font-bold font-mono mt-0.5">
                  {activeLog.failureRiskPct.toFixed(1)}%
                  <span className="text-xs font-mono opacity-70 block mt-0.5">
                    {t.uncertaintyMargin}: ±{activeLog.uncertaintyMarginPct.toFixed(1)}%
                  </span>
                </div>
                <div className="text-xs font-bold uppercase mt-1">
                  {activeLog.riskCategory === 'LOW' && t.riskLow}
                  {activeLog.riskCategory === 'MODERATE' && t.riskModerate}
                  {activeLog.riskCategory === 'HIGH' && t.riskHigh}
                  {activeLog.riskCategory === 'EXPERIMENTAL' && t.riskExperimental}
                </div>
              </div>

              {/* Pathological Explanation */}
              <div className="space-y-2 text-xs">
                {activeLog.indicators.adventitiousRoots && (
                  <div className={`p-3 border flex items-start gap-2 ${
                    highContrast ? 'bg-stone-900 text-rose-300 border-rose-500' : 'bg-[#fff1f2] text-[#9f1239] border-rose-300'
                  }`}>
                    <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                    <div>
                      <strong className="block font-bold text-xs uppercase">{t.adventitiousAlertTitle}</strong>
                      <span className="leading-relaxed opacity-90">{t.adventitiousAlertDesc}</span>
                    </div>
                  </div>
                )}

                {activeLog.abstainWarning && (
                  <div className={`p-3 border flex items-start gap-2 ${
                    highContrast ? 'bg-stone-900 text-sky-300 border-sky-400' : 'bg-[#f0f9ff] text-sky-950 border-sky-300'
                  }`}>
                    <Info className="w-4 h-4 shrink-0 text-sky-600 mt-0.5" />
                    <span className="leading-relaxed">{activeLog.abstainWarning}</span>
                  </div>
                )}

                <div className={`p-2.5 border ${highContrast ? 'bg-stone-900 border-amber-400/40' : 'bg-stone-50 border-stone-200'}`}>
                  <span className="font-bold block text-stone-700 dark:text-amber-200">Model Evaluation Basis (SRS 4.3):</span>
                  <span className="text-[11px] text-stone-500 leading-relaxed block mt-0.5">
                    Evaluated on held-out tomato batches to prevent leakage. Baseline AUROC 0.91 with 48h lead time before visible wilting.
                  </span>
                </div>
              </div>
            </div>

            <div className={`mt-4 p-2 border text-center text-xs font-mono ${
              highContrast ? 'bg-stone-900 border-amber-400 text-amber-300' : 'bg-stone-50 border-stone-200 text-stone-700'
            }`}>
              Day 8+ Acclimatization: Gradually reducing humidity conditions stomata for field planting.
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
