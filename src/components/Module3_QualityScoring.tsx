import React, { useState } from 'react';
import { 
  Award, 
  Volume2, 
  Save, 
  ArrowRight, 
  Check
} from 'lucide-react';
import { GQIComponents, GraftPair, GraftRecord, Seedling } from '../types/graft';
import { generateSeedlingSvg } from '../data/mockData';
import { voiceService } from '../services/voiceAssistant';
import { Language, TRANSLATIONS } from '../i18n/translations';

interface Module3QualityProps {
  selectedPair?: GraftPair | null;
  seedlings: Seedling[];
  records: GraftRecord[];
  onSaveGraftRecord: (record: GraftRecord) => void;
  onProceedToHealing: (graftId: string) => void;
  highContrast: boolean;
  fontSize: 'normal' | 'large' | 'xlarge';
  language: Language;
}

export const Module3_QualityScoring: React.FC<Module3QualityProps> = ({
  selectedPair,
  seedlings,
  records,
  onSaveGraftRecord,
  onProceedToHealing,
  highContrast,
  fontSize,
  language
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const [operatorName, setOperatorName] = useState('Maria Santos');
  const [technique, setTechnique] = useState('Splice Graft (45° Single Slant Cut)');
  const [clipType, setClipType] = useState('2.0mm Clear Silicone Clip');
  const [plantTag, setPlantTag] = useState(`TOM-GRAFT-10${records.length + 1}`);

  // Observable GQI vision metrics & operator override sliders
  const [diameterMatchPct, setDiameterMatchPct] = useState(96);
  const [vascularAlignmentPct, setVascularAlignmentPct] = useState(94);
  const [cutCoplanarityPct, setCutCoplanarityPct] = useState(92);
  const [clipSeatingPct, setClipSeatingPct] = useState(90);
  const [overrideNotes, setOverrideNotes] = useState(
    language === 'hi' 
      ? 'दोनों कटे तनों का संरेखण उत्तम है। सिलिकॉन क्लिप के अंदर हवा का बुलबुला नहीं है।'
      : 'Both cut surfaces show flush concentric contact. No air pocket inside silicone sleeve.'
  );
  
  const [postGraftImage, setPostGraftImage] = useState(generateSeedlingSvg('grafted', 2.1, 'healthy'));
  const [isSaved, setIsSaved] = useState(false);
  const [savedRecordId, setSavedRecordId] = useState('');

  const gqiScore = Math.round(
    diameterMatchPct * 0.30 +
    vascularAlignmentPct * 0.35 +
    cutCoplanarityPct * 0.20 +
    clipSeatingPct * 0.15
  );

  const gqiTier: 'A' | 'B' | 'C' | 'REJECT' = 
    gqiScore >= 88 ? 'A' : gqiScore >= 75 ? 'B' : gqiScore >= 60 ? 'C' : 'REJECT';

  const speakGqiVerdict = () => {
    if (language === 'hi') {
      let tierSpeech = gqiTier === 'A' ? 'श्रेणी क, उत्कृष्ट जीवित रहने की संभावना।' : gqiTier === 'B' ? 'श्रेणी ख, अच्छी संभावना।' : 'श्रेणी ग, नियमित जांच आवश्यक।';
      voiceService.speak(`कलम गुणवत्ता सूचकांक स्कोर ${gqiScore} है। ${tierSpeech} संवहनी संरेखण ${vascularAlignmentPct} प्रतिशत है।`);
    } else {
      let tierSpeech = gqiTier === 'A' ? 'Tier A, Excellent graft quality' : gqiTier === 'B' ? 'Tier B, Good quality' : 'Tier C, Needs close monitoring';
      voiceService.speak(`Graft Quality Index is ${gqiScore} out of 100. ${tierSpeech}. Vascular alignment is ${vascularAlignmentPct} percent.`);
    }
  };

  const applyGqiScenario = (type: 'excellent' | 'misaligned' | 'loose_clip') => {
    setIsSaved(false);
    if (type === 'excellent') {
      setDiameterMatchPct(98);
      setVascularAlignmentPct(96);
      setCutCoplanarityPct(94);
      setClipSeatingPct(95);
      setOverrideNotes(language === 'hi' ? 'उत्तम संरेखण, मजबूत सिलिकॉन पकड़, कोई ऊतक क्षति नहीं।' : 'Optimum concentric alignment, tight silicone grip, no tissue bruising.');
      setPostGraftImage(generateSeedlingSvg('grafted', 2.1, 'healthy'));
      voiceService.speak(language === 'hi' ? 'श्रेणी क उत्तम ग्राफ्ट लागू हुआ।' : 'Preset applied: Tier A optimum graft.');
    } else if (type === 'misaligned') {
      setDiameterMatchPct(72);
      setVascularAlignmentPct(64);
      setCutCoplanarityPct(70);
      setClipSeatingPct(80);
      setOverrideNotes(language === 'hi' ? 'आंशिक मिसअलाइनमेंट। कैम्बियम वलय केवल 65% मिल रहे हैं।' : 'Lateral step detected. Cambium rings only partially overlap (approx 65%).');
      setPostGraftImage(generateSeedlingSvg('grafted', 2.3, 'rooting'));
      voiceService.speak(language === 'hi' ? 'आंशिक संरेखण चेतावनी लागू हुई।' : 'Preset applied: Partial cambium misalignment.');
    } else if (type === 'loose_clip') {
      setDiameterMatchPct(88);
      setVascularAlignmentPct(80);
      setCutCoplanarityPct(75);
      setClipSeatingPct(52);
      setOverrideNotes(language === 'hi' ? 'क्लिप नीचे खिसक गई है। जोड़ पर पूरा दबाव नहीं है।' : 'Clip slipped slightly downward. Junction lacks full clamping pressure.');
      setPostGraftImage(generateSeedlingSvg('grafted', 2.0, 'healthy'));
      voiceService.speak(language === 'hi' ? 'ढीली क्लिप चेतावनी लागू हुई।' : 'Preset applied: Loose clip seating warning.');
    }
  };

  const handleSaveRecord = () => {
    const components: GQIComponents = {
      diameterMatchPct,
      vascularAlignmentPct,
      cutCoplanarityPct,
      clipSeatingPct,
    };

    const newRecord: GraftRecord = {
      id: `graft-${Date.now()}`,
      plantTag,
      batchId: 'batch-tomato-01',
      rootstockId: selectedPair?.rootstockId || 'seedling-r01',
      scionId: selectedPair?.scionId || 'seedling-s01',
      rootstockVariety: selectedPair?.rootstockTag ? `${selectedPair.rootstockTag}` : 'Maxifort F1',
      scionVariety: selectedPair?.scionTag ? `${selectedPair.scionTag}` : 'San Marzano',
      graftDate: new Date().toLocaleString(),
      operatorName,
      technique,
      clipType,
      gqiScore,
      gqiTier,
      components,
      postGraftImageUrl: postGraftImage,
      operatorOverrideNotes: overrideNotes,
      outcome: 'PENDING',
    };

    onSaveGraftRecord(newRecord);
    setSavedRecordId(newRecord.id);
    setIsSaved(true);
    voiceService.speak(
      language === 'hi'
        ? `कलम रिकॉर्ड ${plantTag} GQI स्कोर ${gqiScore} के साथ सुरक्षित हुआ।`
        : `Graft record ${plantTag} saved with GQI score of ${gqiScore}.`
    );
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
            FR-3 · Graft Quality Scoring (GQI)
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight mt-0.5">{t.qualityTitle}</h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-amber-200/80 mt-1 max-w-2xl">
            {t.qualitySubtitle}
          </p>
        </div>

        <button
          onClick={speakGqiVerdict}
          className={`px-3 py-2 border text-xs font-bold flex items-center gap-1.5 transition shrink-0 ${
            highContrast
              ? 'bg-amber-400 text-stone-950 border-amber-300 hover:bg-amber-300'
              : 'bg-[#183625] text-stone-100 border-[#0d2116] hover:bg-[#254f38]'
          }`}
        >
          <Volume2 className="w-4 h-4" />
          <span>{t.announceGQI}</span>
        </button>
      </div>

      {/* Preset Scenarios (Zero-Pill) */}
      <div className={`p-3 border ${
        highContrast ? 'bg-stone-950 border-amber-400/60' : 'bg-white border-stone-300 shadow-2xs'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-stone-600 dark:text-amber-300">
            {t.simulateGQI}:
          </span>
          <span className="text-[11px] text-stone-400 font-mono">1-tap simulation</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button
            onClick={() => applyGqiScenario('excellent')}
            className={`p-2 border text-xs font-medium text-left transition ${
              highContrast ? 'bg-stone-900 border-emerald-400 text-emerald-300' : 'bg-[#f4f8f4] border-emerald-300 text-emerald-950'
            }`}
          >
            ✓ {t.gqiExcellent}
          </button>
          <button
            onClick={() => applyGqiScenario('misaligned')}
            className={`p-2 border text-xs font-medium text-left transition ${
              highContrast ? 'bg-stone-900 border-amber-400 text-amber-300' : 'bg-[#fffbeb] border-amber-300 text-amber-950'
            }`}
          >
            ▲ {t.gqiMisaligned}
          </button>
          <button
            onClick={() => applyGqiScenario('loose_clip')}
            className={`p-2 border text-xs font-medium text-left transition ${
              highContrast ? 'bg-stone-900 border-orange-400 text-orange-300' : 'bg-[#fff7ed] border-orange-300 text-orange-950'
            }`}
          >
            ▲ {t.gqiLoose}
          </button>
        </div>
      </div>

      {/* Main 2-Column Inspector */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Left Column: Post-Graft Photograph */}
        <div className={`p-4 border flex flex-col justify-between ${
          highContrast ? 'bg-stone-950 text-amber-300 border-amber-400' : 'bg-white text-stone-900 border-stone-300'
        }`}>
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-stone-300 dark:border-amber-400/40">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-amber-200">
                {t.postGraftPhoto}
              </span>
              <span className="text-xs font-mono font-bold">FR-3 Inspection</span>
            </div>

            <div className="my-3 relative border border-stone-300 dark:border-amber-400/60 bg-stone-100 aspect-4/3 flex items-center justify-center overflow-hidden">
              <img
                src={postGraftImage}
                alt="Post-graft union"
                className="w-full h-full object-contain"
              />

              <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-2">
                <span className="self-start px-1.5 py-0.5 bg-stone-900/80 text-stone-200 text-[10px] font-mono">
                  Clip: {clipType}
                </span>
                <div className="border border-dashed border-sky-400 mx-auto w-3/5 h-16 flex items-center justify-center">
                  <span className="text-[10px] bg-stone-900/80 text-sky-200 px-1.5 py-0.5 font-mono">
                    Union Interface
                  </span>
                </div>
                <span className="self-end px-1.5 py-0.5 bg-[#183625]/90 text-stone-100 text-[10px] font-mono">
                  Vascular Ring: Inspected
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-stone-500 block mb-0.5">{t.permanentTag}:</span>
                <input
                  type="text"
                  value={plantTag}
                  onChange={(e) => setPlantTag(e.target.value)}
                  className={`w-full font-mono font-bold px-2 py-1 border ${
                    highContrast ? 'bg-stone-900 border-amber-400 text-amber-300' : 'bg-stone-50 border-stone-300'
                  }`}
                />
              </div>

              <div>
                <span className="text-stone-500 block mb-0.5">{t.operatorName}:</span>
                <input
                  type="text"
                  value={operatorName}
                  onChange={(e) => setOperatorName(e.target.value)}
                  className={`w-full font-medium px-2 py-1 border ${
                    highContrast ? 'bg-stone-900 border-amber-400 text-amber-300' : 'bg-stone-50 border-stone-300'
                  }`}
                />
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-300 dark:border-amber-400/40 flex items-center justify-between text-xs">
            <span className="text-stone-600 dark:text-amber-200/80 font-mono text-[11px]">{technique}</span>
            <span className="font-mono text-[11px] text-stone-400">Traceable Record</span>
          </div>
        </div>

        {/* Right Column: Multi-Factor GQI Score & Operator Adjustments */}
        <div className={`p-4 border flex flex-col justify-between ${
          highContrast ? 'bg-stone-950 text-amber-300 border-amber-400' : 'bg-white text-stone-900 border-stone-300'
        }`}>
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-stone-300 dark:border-amber-400/40">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-amber-200">
                {t.gqiOverallScore}
              </span>
              <span className="text-xs font-mono font-bold">FR-3 Formula</span>
            </div>

            {/* Giant GQI Score Banner (Rectangular, no pills) */}
            <div className={`my-3 p-3.5 border-2 text-center ${
              gqiTier === 'A'
                ? highContrast ? 'bg-stone-900 text-emerald-300 border-emerald-400' : 'bg-[#eef6ee] text-[#143d26] border-[#2e6d47]'
                : gqiTier === 'B'
                ? highContrast ? 'bg-stone-900 text-amber-300 border-amber-400' : 'bg-[#fffbeb] text-[#78350f] border-[#d97706]'
                : highContrast ? 'bg-stone-900 text-orange-300 border-orange-400' : 'bg-[#fff7ed] text-[#9a3412] border-[#ea580c]'
            }`}>
              <div className="text-xs font-mono font-bold uppercase tracking-wider opacity-80">GQI Index</div>
              <div className="text-3xl sm:text-4xl font-bold font-mono mt-0.5">
                {gqiScore} <span className="text-base font-normal opacity-70">/ 100</span>
              </div>
              <div className="text-xs font-bold mt-1 uppercase">
                {gqiTier === 'A' && t.tierA}
                {gqiTier === 'B' && t.tierB}
                {gqiTier === 'C' && t.tierC}
                {gqiTier === 'REJECT' && t.tierReject}
              </div>
            </div>

            {/* Sliders for 4 Observable Features */}
            <div className="space-y-2 text-xs">
              
              <div>
                <div className="flex justify-between font-medium">
                  <span>{t.featureDiameter}:</span>
                  <span className="font-mono font-bold text-[#183625] dark:text-amber-300">{diameterMatchPct}%</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="100"
                  value={diameterMatchPct}
                  onChange={(e) => { setDiameterMatchPct(Number(e.target.value)); setIsSaved(false); }}
                  className="w-full accent-[#183625] dark:accent-amber-400 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between font-medium">
                  <span>{t.featureVascular}:</span>
                  <span className="font-mono font-bold text-[#183625] dark:text-amber-300">{vascularAlignmentPct}%</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="100"
                  value={vascularAlignmentPct}
                  onChange={(e) => { setVascularAlignmentPct(Number(e.target.value)); setIsSaved(false); }}
                  className="w-full accent-[#183625] dark:accent-amber-400 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between font-medium">
                  <span>{t.featureCut}:</span>
                  <span className="font-mono font-bold text-[#183625] dark:text-amber-300">{cutCoplanarityPct}%</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="100"
                  value={cutCoplanarityPct}
                  onChange={(e) => { setCutCoplanarityPct(Number(e.target.value)); setIsSaved(false); }}
                  className="w-full accent-[#183625] dark:accent-amber-400 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between font-medium">
                  <span>{t.featureClip}:</span>
                  <span className="font-mono font-bold text-[#183625] dark:text-amber-300">{clipSeatingPct}%</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="100"
                  value={clipSeatingPct}
                  onChange={(e) => { setClipSeatingPct(Number(e.target.value)); setIsSaved(false); }}
                  className="w-full accent-[#183625] dark:accent-amber-400 cursor-pointer"
                />
              </div>

              <div className="pt-1">
                <span className="text-stone-500 block text-[11px] mb-0.5">{t.operatorNotes}:</span>
                <input
                  type="text"
                  value={overrideNotes}
                  onChange={(e) => setOverrideNotes(e.target.value)}
                  className={`w-full px-2 py-1 text-xs border ${
                    highContrast ? 'bg-stone-900 border-amber-400 text-amber-300' : 'bg-stone-50 border-stone-300'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="mt-4 pt-3 border-t border-stone-300 dark:border-amber-400/40 flex flex-col sm:flex-row items-center gap-2">
            <button
              onClick={handleSaveRecord}
              disabled={isSaved}
              className={`w-full sm:w-1/2 py-2.5 px-3 font-bold text-xs flex items-center justify-center gap-1.5 border transition ${
                isSaved
                  ? 'bg-emerald-700 text-white border-emerald-800'
                  : highContrast
                  ? 'bg-amber-400 text-stone-950 border-amber-300 hover:bg-amber-300'
                  : 'bg-[#183625] text-stone-100 border-[#0d2116] hover:bg-[#254f38]'
              }`}
            >
              <Save className="w-4 h-4" />
              <span>{isSaved ? t.recordSaved : t.saveRecord}</span>
            </button>

            <button
              onClick={() => onProceedToHealing(savedRecordId || 'graft-rec-101')}
              className={`w-full sm:w-1/2 py-2.5 px-3 font-bold text-xs flex items-center justify-center gap-1.5 border transition ${
                highContrast
                  ? 'bg-stone-900 text-amber-300 border-amber-400 hover:bg-stone-800'
                  : 'bg-stone-800 text-white border-stone-900 hover:bg-stone-900'
              }`}
            >
              <span>{t.viewTimeline}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Traceable Records Ledger */}
      <div className={`p-4 border ${
        highContrast ? 'bg-stone-950 border-amber-400/60' : 'bg-white border-stone-300'
      }`}>
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-stone-200 dark:border-amber-400/30">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-amber-200">
            {t.traceableRecords} ({records.length} Grafts)
          </span>
          <span className="font-mono text-xs text-stone-500">FR-3 Audit Ledger</span>
        </div>

        <div className="space-y-2">
          {records.map((r) => (
            <div
              key={r.id}
              className={`p-3 border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs ${
                highContrast ? 'bg-stone-900 border-amber-400/50' : 'bg-stone-50 border-stone-200'
              }`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-[#183625] dark:text-amber-300">{r.plantTag}</span>
                  <span className="font-mono text-[11px] text-stone-500">
                    Tier {r.gqiTier} (GQI: {r.gqiScore})
                  </span>
                  <span className="text-[11px] text-stone-400">· {r.graftDate}</span>
                </div>
                <div className="text-[11px] text-stone-600 dark:text-amber-200/80 mt-0.5">
                  {r.rootstockVariety} × {r.scionVariety} · Operator: {r.operatorName}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono px-2 py-0.5 border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900">
                  {r.outcome === 'SUCCESS_HEALED' ? t.outcomeSuccess : r.outcome === 'PENDING' ? t.outcomePending : 'Failed'}
                </span>

                <button
                  onClick={() => onProceedToHealing(r.id)}
                  className={`px-3 py-1 text-xs font-bold border transition ${
                    highContrast ? 'bg-amber-400 text-stone-950 border-amber-300' : 'bg-[#183625] text-stone-100 border-[#0d2116]'
                  }`}
                >
                  Inspect
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
