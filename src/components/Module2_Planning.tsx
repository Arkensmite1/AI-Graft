import React, { useState } from 'react';
import { 
  Scissors, 
  Volume2, 
  ArrowRight, 
  ShieldCheck, 
  Ruler,
  Check
} from 'lucide-react';
import { GraftPair, Seedling } from '../types/graft';
import { voiceService } from '../services/voiceAssistant';
import { Language, TRANSLATIONS } from '../i18n/translations';

interface Module2PlanningProps {
  seedlings: Seedling[];
  pairs: GraftPair[];
  onSelectPairForGraft: (pair: GraftPair) => void;
  onProceedToQuality: () => void;
  highContrast: boolean;
  fontSize: 'normal' | 'large' | 'xlarge';
  language: Language;
}

export const Module2_Planning: React.FC<Module2PlanningProps> = ({
  seedlings,
  pairs,
  onSelectPairForGraft,
  onProceedToQuality,
  highContrast,
  fontSize,
  language
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const readyRootstocks = seedlings.filter(s => s.role === 'rootstock' && s.readinessVerdict === 'READY');
  const readyScions = seedlings.filter(s => s.role === 'scion' && s.readinessVerdict === 'READY');

  const [selectedRootstockId, setSelectedRootstockId] = useState<string>(readyRootstocks[0]?.id || seedlings[0]?.id || '');
  const [selectedScionId, setSelectedScionId] = useState<string>(readyScions[0]?.id || seedlings[1]?.id || '');

  const rootstock = seedlings.find(s => s.id === selectedRootstockId) || seedlings[0];
  const scion = seedlings.find(s => s.id === selectedScionId) || seedlings[1];

  const rootstockDia = rootstock?.stemDiameterMm || 2.12;
  const scionDia = scion?.stemDiameterMm || 2.08;
  const diameterDiff = Math.abs(rootstockDia - scionDia);
  const matchScore = Math.max(0, Math.min(100, Math.round(100 - (diameterDiff / rootstockDia) * 120)));

  const matchQuality: 'OPTIMAL' | 'ACCEPTABLE' | 'POOR' = 
    diameterDiff <= 0.15 ? 'OPTIMAL' : diameterDiff <= 0.35 ? 'ACCEPTABLE' : 'POOR';

  const recommendedAngle = 45;
  const recommendedCutHeightMm = 18.0;
  const recommendedClipSize = rootstockDia <= 2.2 ? 2.0 : 2.5;

  const currentPair: GraftPair = {
    id: `pair-${rootstock?.id || 'r'}-${scion?.id || 's'}`,
    rootstockId: rootstock?.id || '',
    scionId: scion?.id || '',
    rootstockTag: rootstock?.tag || 'ROOTSTOCK',
    scionTag: scion?.tag || 'SCION',
    rootstockDiameterMm: rootstockDia,
    scionDiameterMm: scionDia,
    diameterDiffMm: Number(diameterDiff.toFixed(2)),
    matchScorePct: matchScore,
    matchQuality,
    recommendedCutAngleDeg: recommendedAngle,
    recommendedCutHeightMm,
    clipSizeMm: recommendedClipSize,
    confidencePct: 96.5,
    notes: matchQuality === 'OPTIMAL' 
      ? (language === 'hi' ? 'व्यास अंतर < 0.15 मिमी। कैम्बियम संवहनी वलय लगभग 100% संरेखित होंगे।' : 'Caliber differential < 0.15 mm. Vascular cambium ring alignment will be nearly 100% concentric.')
      : (language === 'hi' ? 'मध्यम व्यास अंतर। सिलिकॉन क्लिप के अंदर एक किनारा बिल्कुल सटाकर जोड़ें।' : 'Moderate caliber differential. Align one lateral edge flush inside silicone clip.')
  };

  const speakGuidance = () => {
    if (language === 'hi') {
      let script = `मूलवृंत ${rootstock?.tag} और सायन ${scion?.tag} की ग्राफ्ट योजना। `;
      script += `मूलवृंत का व्यास ${rootstockDia} मिमी और सायन का व्यास ${scionDia} मिमी है। `;
      script += `दोनों में व्यास अंतर मात्र ${diameterDiff.toFixed(2)} मिलीमीटर है। `;
      script += `कटाई निर्देश: मिट्टी से 18 मिमी ऊपर एकल 45 डिग्री तिरछी कटाई करें। ${recommendedClipSize} मिलीमीटर सिलिकॉन क्लिप का उपयोग करें।`;
      voiceService.speak(script);
    } else {
      let script = `Graft plan for Rootstock ${rootstock?.tag} and Scion ${scion?.tag}. `;
      script += `Rootstock caliber is ${rootstockDia} mm. Scion caliber is ${scionDia} mm. `;
      script += `Caliber gap is ${diameterDiff.toFixed(2)} millimeters. `;
      script += `Make a clean 45-degree angle slice 18 millimeters below cotyledons. Use a ${recommendedClipSize} millimeter clear silicone clip.`;
      voiceService.speak(script);
    }
  };

  const handleSelectThisPair = () => {
    onSelectPairForGraft(currentPair);
    voiceService.speak(language === 'hi' ? 'जोड़ी पुष्ट हुई। कलम लगाने के बाद गुणवत्ता जांचें।' : 'Pair confirmed. Ready for grafting and quality inspection.');
    onProceedToQuality();
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
            FR-2 · Pairing & Cutting Guide
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight mt-0.5">{t.planningTitle}</h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-amber-200/80 mt-1 max-w-2xl">
            {t.planningSubtitle}
          </p>
        </div>

        <button
          onClick={speakGuidance}
          className={`px-3 py-2 border text-xs font-bold flex items-center gap-1.5 transition shrink-0 ${
            highContrast
              ? 'bg-amber-400 text-stone-950 border-amber-300 hover:bg-amber-300'
              : 'bg-[#183625] text-stone-100 border-[#0d2116] hover:bg-[#254f38]'
          }`}
        >
          <Volume2 className="w-4 h-4" />
          <span>{t.listenCutGuide}</span>
        </button>
      </div>

      {/* Operator Advisory Boundary Banner */}
      <div className={`p-3 border flex items-start gap-2.5 text-xs ${
        highContrast ? 'bg-stone-950 border-amber-400/80 text-amber-200' : 'bg-[#fffbeb] border-[#fde68a] text-[#78350f]'
      }`}>
        <ShieldCheck className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="block font-bold text-xs uppercase mb-0.5">{t.advisoryNoticeTitle}</strong>
          <span className="leading-relaxed opacity-90">{t.advisoryNoticeDesc}</span>
        </div>
      </div>

      {/* Pair Selection Matrix */}
      <div className={`p-4 border ${
        highContrast ? 'bg-stone-950 border-amber-400' : 'bg-white border-stone-300'
      }`}>
        <span className="font-mono text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-amber-200 block mb-3">
          {t.selectPairTitle}:
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          
          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-600 dark:text-amber-200/80 block">
              {t.selectRootstock}:
            </label>
            <select
              value={selectedRootstockId}
              onChange={(e) => setSelectedRootstockId(e.target.value)}
              className={`w-full p-2 text-xs font-mono font-medium border ${
                highContrast ? 'bg-stone-900 border-amber-400 text-amber-300' : 'bg-stone-50 border-stone-300 text-stone-900'
              }`}
            >
              {seedlings.filter(s => s.role === 'rootstock').map((s) => (
                <option key={s.id} value={s.id}>
                  {s.tag} ({s.variety}) — Ø {s.stemDiameterMm.toFixed(2)} mm [{s.readinessVerdict}]
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-600 dark:text-amber-200/80 block">
              {t.selectScion}:
            </label>
            <select
              value={selectedScionId}
              onChange={(e) => setSelectedScionId(e.target.value)}
              className={`w-full p-2 text-xs font-mono font-medium border ${
                highContrast ? 'bg-stone-900 border-amber-400 text-amber-300' : 'bg-stone-50 border-stone-300 text-stone-900'
              }`}
            >
              {seedlings.filter(s => s.role === 'scion').map((s) => (
                <option key={s.id} value={s.id}>
                  {s.tag} ({s.variety}) — Ø {s.stemDiameterMm.toFixed(2)} mm [{s.readinessVerdict}]
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main 2-Column: Left Differential Score / Right Cut Geometry Diagram */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Left Column: Differential Score & Supplies */}
        <div className={`p-4 border flex flex-col justify-between ${
          highContrast ? 'bg-stone-950 text-amber-300 border-amber-400' : 'bg-white text-stone-900 border-stone-300'
        }`}>
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-stone-300 dark:border-amber-400/40">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-amber-200">
                {t.caliberDifferential}
              </span>
              <span className="text-xs font-mono text-stone-500">FR-2 Match Algorithm</span>
            </div>

            {/* Match Quality Banner */}
            <div className={`my-3 p-3.5 border-2 text-center ${
              matchQuality === 'OPTIMAL'
                ? highContrast ? 'bg-stone-900 text-emerald-300 border-emerald-400' : 'bg-[#eef6ee] text-[#143d26] border-[#2e6d47]'
                : matchQuality === 'ACCEPTABLE'
                ? highContrast ? 'bg-stone-900 text-amber-300 border-amber-400' : 'bg-[#fffbeb] text-[#78350f] border-[#d97706]'
                : highContrast ? 'bg-stone-900 text-rose-300 border-rose-400' : 'bg-[#fff1f2] text-[#9f1239] border-[#e11d48]'
            }`}>
              <div className="text-xs font-mono font-bold uppercase tracking-wider opacity-80">Compatibility Rating</div>
              <div className="text-lg sm:text-xl font-bold mt-0.5">
                {matchQuality === 'OPTIMAL' && t.matchOptimal}
                {matchQuality === 'ACCEPTABLE' && t.matchAcceptable}
                {matchQuality === 'POOR' && t.matchPoor}
              </div>
              <p className="text-xs font-medium opacity-90 mt-1 max-w-sm mx-auto leading-relaxed">
                {currentPair.notes}
              </p>
            </div>

            {/* Caliber Comparison */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className={`p-2 border ${highContrast ? 'bg-stone-900 border-amber-400' : 'bg-stone-50 border-stone-200'}`}>
                <span className="text-stone-500 block text-[10px]">{t.rootstockLabel}</span>
                <span className="text-base font-bold font-mono text-emerald-800 dark:text-amber-300">
                  {rootstockDia.toFixed(2)} mm
                </span>
                <span className="text-[10px] block text-stone-400 truncate">{rootstock?.variety}</span>
              </div>

              <div className={`p-2 border ${highContrast ? 'bg-stone-900 border-amber-400' : 'bg-stone-50 border-stone-200'}`}>
                <span className="text-stone-500 block text-[10px]">{t.scionLabel}</span>
                <span className="text-base font-bold font-mono text-emerald-800 dark:text-amber-300">
                  {scionDia.toFixed(2)} mm
                </span>
                <span className="text-[10px] block text-stone-400 truncate">{scion?.variety}</span>
              </div>

              <div className={`p-2 border ${highContrast ? 'bg-stone-900 border-amber-400' : 'bg-stone-50 border-stone-200'}`}>
                <span className="text-stone-500 block text-[10px]">{t.diffLabel}</span>
                <span className={`text-base font-bold font-mono ${
                  diameterDiff <= 0.15 ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'
                }`}>
                  {diameterDiff.toFixed(2)} mm
                </span>
                <span className="text-[10px] block text-stone-400">Max: 0.35mm</span>
              </div>
            </div>

            {/* Recommended Supplies */}
            <div className="mt-4 space-y-2 text-xs">
              <span className="font-mono font-bold uppercase tracking-wider text-stone-600 dark:text-amber-200 block">
                Field Equipment Guidance:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <div className={`p-2.5 border ${highContrast ? 'bg-stone-900 border-amber-400/40' : 'bg-stone-50 border-stone-200'}`}>
                  <span className="text-stone-500 block text-[11px]">{t.recommendedClip}:</span>
                  <span className="text-xs font-bold text-[#183625] dark:text-amber-300">
                    Ø {recommendedClipSize.toFixed(1)} mm Silicone Clip
                  </span>
                </div>
                <div className={`p-2.5 border ${highContrast ? 'bg-stone-900 border-amber-400/40' : 'bg-stone-50 border-stone-200'}`}>
                  <span className="text-stone-500 block text-[11px]">{t.recommendedCutAngle}:</span>
                  <span className="text-xs font-bold text-[#183625] dark:text-amber-300">
                    45° Single Slant Cut
                  </span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleSelectThisPair}
            className={`mt-4 w-full py-2.5 px-3 font-bold text-xs flex items-center justify-center gap-2 border transition ${
              highContrast
                ? 'bg-amber-400 text-stone-950 border-amber-300 hover:bg-amber-300'
                : 'bg-[#183625] text-stone-100 border-[#0d2116] hover:bg-[#254f38]'
            }`}
          >
            <span>{t.proceedToScore}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right Column: Visual 45° Angle Cut Diagram */}
        <div className={`p-4 border flex flex-col justify-between ${
          highContrast ? 'bg-stone-950 text-amber-300 border-amber-400' : 'bg-white text-stone-900 border-stone-300'
        }`}>
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-stone-300 dark:border-amber-400/40">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-amber-200">
                {t.cutGeometryTitle}
              </span>
              <span className="text-xs font-mono font-bold">45° Slant</span>
            </div>

            <div className="mt-3 border border-stone-300 dark:border-amber-400/60 bg-stone-950 p-2 overflow-hidden flex items-center justify-center">
              <svg viewBox="0 0 320 220" className="w-full h-44 select-none">
                <defs>
                  <linearGradient id="stemG1" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#254f38" />
                    <stop offset="50%" stopColor="#3d7a57" />
                    <stop offset="100%" stopColor="#183625" />
                  </linearGradient>
                  <linearGradient id="scionG1" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#2d6a4f" />
                    <stop offset="50%" stopColor="#40916c" />
                    <stop offset="100%" stopColor="#1b4332" />
                  </linearGradient>
                </defs>

                <rect x="20" y="195" width="280" height="15" fill="#3e2723" />
                <text x="160" y="206" fill="#a1887f" fontSize="8" fontFamily="sans-serif" textAnchor="middle">Substrate Soil Baseline</text>

                {/* Rootstock */}
                <path d="M 148 200 L 148 120 L 172 96 L 172 200 Z" fill="url(#stemG1)" stroke="#1b4332" strokeWidth="1.5" />
                
                {/* Scion */}
                <path d="M 148 116 L 148 35 L 172 35 L 172 92 Z" fill="url(#scionG1)" stroke="#1b4332" strokeWidth="1.5" />
                
                {/* Cotyledons */}
                <ellipse cx="120" cy="35" rx="26" ry="10" fill="#40916c" stroke="#1b4332" strokeWidth="1" />
                <ellipse cx="200" cy="35" rx="26" ry="10" fill="#40916c" stroke="#1b4332" strokeWidth="1" />
                <text x="160" y="22" fill="#d8f3dc" fontSize="9" fontWeight="bold" textAnchor="middle">Scion Cotyledons</text>

                {/* 45 Degree Angle indicator */}
                <path d="M 172 94 L 148 118" stroke="#f59e0b" strokeWidth="3" strokeDasharray="3 2" />
                <line x1="148" y1="118" x2="190" y2="118" stroke="#9ca3af" strokeWidth="1" strokeDasharray="2 2" />
                <text x="180" y="112" fill="#fbbf24" fontSize="10" fontWeight="bold">45° Cut</text>

                {/* Height line */}
                <line x1="130" y1="120" x2="130" y2="195" stroke="#60a5fa" strokeWidth="1.5" />
                <polygon points="127,125 130,118 133,125" fill="#60a5fa" />
                <polygon points="127,190 130,197 133,190" fill="#60a5fa" />
                <text x="122" y="160" fill="#93c5fd" fontSize="9" fontWeight="bold" textAnchor="end">18 mm</text>

                {/* Silicone Clip representation */}
                <rect x="140" y="90" width="40" height="36" fill="rgba(56, 189, 248, 0.35)" stroke="#38bdf8" strokeWidth="1.5" />
                <circle cx="176" cy="108" r="4" fill="#0284c7" />
                <text x="235" y="105" fill="#38bdf8" fontSize="9" fontWeight="bold">2.0mm Clip</text>
                <line x1="182" y1="108" x2="225" y2="108" stroke="#38bdf8" strokeWidth="1" />
              </svg>
            </div>

            {/* Checklist */}
            <div className="mt-3 space-y-1.5 text-xs">
              <span className="font-bold text-stone-800 dark:text-amber-200 block">
                {t.stepChecklistTitle}:
              </span>
              <ul className="space-y-1 text-stone-600 dark:text-amber-200/80 text-[11px] leading-relaxed">
                <li className="flex items-start gap-1.5">
                  <span className="font-mono font-bold text-stone-900 dark:text-amber-300">1.</span>
                  <span>{t.step1}</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="font-mono font-bold text-stone-900 dark:text-amber-300">2.</span>
                  <span>{t.step2}</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="font-mono font-bold text-stone-900 dark:text-amber-300">3.</span>
                  <span>{t.step3}</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="font-mono font-bold text-stone-900 dark:text-amber-300">4.</span>
                  <span>{t.step4}</span>
                </li>
              </ul>
            </div>
          </div>

          <div className={`mt-3 p-2 border text-[11px] font-medium ${
            highContrast ? 'bg-stone-900 border-amber-400 text-amber-300' : 'bg-stone-50 border-stone-200 text-stone-700'
          }`}>
            {language === 'hi'
              ? 'टिप: कैम्बियम वलयों को क्लिप के अंदर समान दबाव के साथ जोड़ना सबसे आवश्यक है।'
              : 'Tip: Maintaining flush vascular ring contact under steady clip tension is critical for callus formation.'}
          </div>
        </div>

      </div>
    </div>
  );
};
