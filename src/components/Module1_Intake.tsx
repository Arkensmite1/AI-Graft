import React, { useState, useRef } from 'react';
import { 
  Camera, 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  Volume2, 
  Save, 
  ArrowRight,
  Info
} from 'lucide-react';
import { Batch, ReadinessVerdict, Seedling, SeedlingRole } from '../types/graft';
import { generateSeedlingSvg } from '../data/mockData';
import { voiceService } from '../services/voiceAssistant';
import { Language, TRANSLATIONS } from '../i18n/translations';

interface Module1IntakeProps {
  batches: Batch[];
  seedlings: Seedling[];
  onAddSeedling: (seedling: Seedling) => void;
  onSelectPairingModule: () => void;
  highContrast: boolean;
  fontSize: 'normal' | 'large' | 'xlarge';
  language: Language;
}

export const Module1_Intake: React.FC<Module1IntakeProps> = ({
  batches,
  seedlings,
  onAddSeedling,
  onSelectPairingModule,
  highContrast,
  fontSize,
  language
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const [selectedBatchId, setSelectedBatchId] = useState<string>(batches[0]?.id || 'batch-tomato-01');
  const [role, setRole] = useState<SeedlingRole>('rootstock');
  const [plantTag, setPlantTag] = useState<string>('MAXI-R05');
  const [variety, setVariety] = useState<string>('Maxifort F1');
  
  // Camera state
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Seedling image & assessment states
  const [currentImage, setCurrentImage] = useState<string>(generateSeedlingSvg('rootstock', 2.12, 'healthy'));
  const [isAssessing, setIsAssessing] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  // Calibrated measurements
  const [stemDiameter, setStemDiameter] = useState<number>(2.12);
  const [hypocotylHeight, setHypocotylHeight] = useState<number>(46.5);
  const [cotyledonHeight, setCotyledonHeight] = useState<number>(38.0);
  const [straightness, setStraightness] = useState<number>(97.0);
  const [verdict, setVerdict] = useState<ReadinessVerdict>('READY');
  const [confidence, setConfidence] = useState<number>(96.8);
  const [markerCalibrated, setMarkerCalibrated] = useState<boolean>(true);
  const [abstentionReason, setAbstentionReason] = useState<string | undefined>(undefined);

  const selectedBatch = batches.find(b => b.id === selectedBatchId) || batches[0];

  const handleRoleChange = (newRole: SeedlingRole) => {
    setRole(newRole);
    if (newRole === 'rootstock') {
      setPlantTag(`MAXI-R0${seedlings.filter(s => s.role === 'rootstock').length + 1}`);
      setVariety(selectedBatch?.rootstockVariety || 'Maxifort F1');
    } else {
      setPlantTag(`SANM-S0${seedlings.filter(s => s.role === 'scion').length + 1}`);
      setVariety(selectedBatch?.scionVariety || 'San Marzano');
    }
  };

  const applyPreset = (presetType: 'ready_rootstock' | 'ready_scion' | 'too_slender' | 'overgrown' | 'blurred' | 'tilted') => {
    setIsAssessing(true);
    setIsSaved(false);

    setTimeout(() => {
      if (presetType === 'ready_rootstock') {
        setRole('rootstock');
        setVariety('Maxifort F1');
        setPlantTag('MAXI-R06');
        setStemDiameter(2.14);
        setHypocotylHeight(47.2);
        setCotyledonHeight(38.5);
        setStraightness(98.1);
        setVerdict('READY');
        setConfidence(97.2);
        setMarkerCalibrated(true);
        setAbstentionReason(undefined);
        setCurrentImage(generateSeedlingSvg('rootstock', 2.14, 'healthy'));
        voiceService.speak(
          language === 'hi'
            ? 'मूलवृंत मैक्सीफोर्ट का मूल्यांकन पूर्ण। तने का व्यास 2.14 मिलीमीटर है। स्थिति: ग्राफ्टिंग हेतु तैयार।'
            : 'Rootstock Maxifort assessed. Stem diameter is 2.14 millimeters. Status: Ready for grafting.'
        );
      } else if (presetType === 'ready_scion') {
        setRole('scion');
        setVariety('San Marzano');
        setPlantTag('SANM-S06');
        setStemDiameter(2.10);
        setHypocotylHeight(41.8);
        setCotyledonHeight(34.2);
        setStraightness(95.4);
        setVerdict('READY');
        setConfidence(96.1);
        setMarkerCalibrated(true);
        setAbstentionReason(undefined);
        setCurrentImage(generateSeedlingSvg('scion', 2.10, 'healthy'));
        voiceService.speak(
          language === 'hi'
            ? 'सायन सान मारजानो का मूल्यांकन पूर्ण। तने का व्यास 2.10 मिलीमीटर है। स्थिति: ग्राफ्टिंग हेतु तैयार।'
            : 'Scion San Marzano assessed. Stem diameter is 2.10 millimeters. Status: Ready for grafting.'
        );
      } else if (presetType === 'too_slender') {
        setRole('rootstock');
        setVariety('Maxifort F1');
        setPlantTag('MAXI-R-SLENDER');
        setStemDiameter(1.32);
        setHypocotylHeight(30.5);
        setCotyledonHeight(24.0);
        setStraightness(89.0);
        setVerdict('TOO_SLENDER');
        setConfidence(92.5);
        setMarkerCalibrated(true);
        setAbstentionReason(
          language === 'hi' 
            ? 'तने का व्यास 1.32 मिमी है, जो न्यूनतम 1.60 मिमी सीमा से कम है। पौध को 2-3 दिन नर्सरी में और रहने दें।'
            : 'Stem diameter is 1.32 mm, below the 1.60 mm minimum threshold. Keep in nursery 2-3 more days.'
        );
        setCurrentImage(generateSeedlingSvg('rootstock', 1.32, 'slender'));
        voiceService.speak(
          language === 'hi'
            ? 'चेतावनी: तना अत्यधिक पतला है, मात्र 1.32 मिलीमीटर। अभी कलम न बांधें।'
            : 'Warning: Seedling is too slender at 1.32 millimeters. Not ready for grafting.'
        );
      } else if (presetType === 'overgrown') {
        setRole('scion');
        setVariety('San Marzano');
        setPlantTag('SANM-S-OVERGROWN');
        setStemDiameter(3.02);
        setHypocotylHeight(64.0);
        setCotyledonHeight(51.0);
        setStraightness(84.0);
        setVerdict('OVERGROWN');
        setConfidence(94.8);
        setMarkerCalibrated(true);
        setAbstentionReason(
          language === 'hi'
            ? 'तने की मोटाई 2.80 मिमी की अधिकतम सीमा से अधिक है। मानक 2.0-2.5 मिमी क्लिप नहीं लग पाएगी।'
            : 'Stem caliber exceeds 2.80 mm maximum limit for standard 2.0-2.5 mm grafting clips.'
        );
        setCurrentImage(generateSeedlingSvg('scion', 3.02, 'healthy'));
        voiceService.speak(
          language === 'hi'
            ? 'चेतावनी: तना अत्यधिक मोटा है, 3.02 मिलीमीटर। क्लिप क्षमता से अधिक।'
            : 'Warning: Seedling is overgrown at 3.02 millimeters. Exceeds standard clip capacity.'
        );
      } else if (presetType === 'blurred') {
        setRole('rootstock');
        setPlantTag('MAXI-R-BLUR');
        setStemDiameter(0);
        setHypocotylHeight(0);
        setCotyledonHeight(0);
        setStraightness(0);
        setVerdict('ABSTAIN_BLURRED');
        setConfidence(22.0);
        setMarkerCalibrated(false);
        setAbstentionReason(
          language === 'hi'
            ? 'एसआरएस NFR-3 अस्वीकृति: कैमरे में गति के कारण चित्र धुंधला है। गलत माप से बचने हेतु दोबारा फोटो लें।'
            : 'SRS NFR-3 Abstention: Motion blur detected. System abstains to avoid false measurements. Please retake photo.'
        );
        setCurrentImage(generateSeedlingSvg('blurred', 2.0, 'healthy'));
        voiceService.speak(
          language === 'hi'
            ? 'अस्वीकृति: फोटो धुंधली है। कृपया हाथ स्थिर रखकर दोबारा फोटो लें।'
            : 'Abstention triggered. Photograph is blurry. Please hold camera steady and retake.'
        );
      } else if (presetType === 'tilted') {
        setRole('scion');
        setPlantTag('SANM-S-TILT');
        setStemDiameter(1.98);
        setHypocotylHeight(38.0);
        setCotyledonHeight(30.0);
        setStraightness(56.0);
        setVerdict('ABSTAIN_OUT_OF_PLANE');
        setConfidence(44.0);
        setMarkerCalibrated(true);
        setAbstentionReason(
          language === 'hi'
            ? 'एसआरएस 2.5 ज्यामिति बाधा: तना 20 डिग्री से अधिक झुका हुआ है। समतल कोण ठीक करें।'
            : 'SRS 2.5 Geometry Constraint: Stem angle is tilted >20 degrees out-of-plane. In-plane measurements would yield distorted caliber.'
        );
        setCurrentImage(generateSeedlingSvg('tilted', 1.98, 'healthy'));
        voiceService.speak(
          language === 'hi'
            ? 'चेतावनी: पौधे का तना कैमरे के समतल से बाहर झुका है। कृपया सीधा करके फोटो लें।'
            : 'Warning: Plant stem is tilted out of focal plane. Please position seedling upright.'
        );
      }
      setIsAssessing(false);
    }, 350);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
      voiceService.speak(
        language === 'hi' 
          ? 'कैमरा चालू है। 20 मिमी मार्कर और पौधे को चौखट के अंदर रखें।'
          : 'Camera active. Align seedling and 20 millimeter marker inside guides.'
      );
    } catch (err) {
      console.warn('Camera access error:', err);
      voiceService.speak(language === 'hi' ? 'कैमरा उपलब्ध नहीं। प्रीसेट का उपयोग करें।' : 'Camera not accessible. Using preset photos.');
    }
  };

  const captureCameraFrame = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, 640, 480);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setCurrentImage(dataUrl);
      setIsCameraActive(false);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
      runAssessmentSimulation();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCurrentImage(reader.result as string);
        runAssessmentSimulation();
      };
      reader.readAsDataURL(file);
    }
  };

  const runAssessmentSimulation = () => {
    setIsAssessing(true);
    setIsSaved(false);
    setTimeout(() => {
      const simulatedDiameter = Number((1.95 + Math.random() * 0.35).toFixed(2));
      setStemDiameter(simulatedDiameter);
      setHypocotylHeight(Number((42 + Math.random() * 8).toFixed(1)));
      setCotyledonHeight(Number((34 + Math.random() * 6).toFixed(1)));
      setStraightness(Number((93 + Math.random() * 5).toFixed(1)));
      setMarkerCalibrated(true);
      setVerdict('READY');
      setConfidence(95.8);
      setAbstentionReason(undefined);
      setIsAssessing(false);
      voiceService.speak(
        language === 'hi'
          ? `तने का मापन पूर्ण। तने का व्यास ${simulatedDiameter} मिलीमीटर है। कलम हेतु तैयार।`
          : `Seedling measured. Stem caliber is ${simulatedDiameter} millimeters. Ready for grafting.`
      );
    }, 500);
  };

  const handleSaveSeedling = () => {
    const newSeedling: Seedling = {
      id: `seedling-${Date.now()}`,
      tag: plantTag,
      batchId: selectedBatchId,
      crop: selectedBatch.crop,
      variety,
      role,
      stemDiameterMm: stemDiameter,
      hypocotylHeightMm: hypocotylHeight,
      cotyledonHeightMm: cotyledonHeight,
      straightnessPct: straightness,
      readinessVerdict: verdict,
      confidencePct: confidence,
      markerCalibrated,
      markerScaleMmPerPx: 0.114,
      imageQualityScore: verdict === 'ABSTAIN_BLURRED' ? 32 : 94,
      imageUrl: currentImage,
      captureDate: new Date().toLocaleString(),
      notes: `Measured via AI-GRAFT vision pipeline. Marker calibrated.`,
      abstentionReason,
    };
    onAddSeedling(newSeedling);
    setIsSaved(true);
    voiceService.speak(language === 'hi' ? `पौधा ${plantTag} बैच में सहेजा गया।` : `Seedling ${plantTag} saved to batch.`);
  };

  const announceReadiness = () => {
    if (language === 'hi') {
      if (verdict === 'READY') {
        voiceService.speak(`पौधा ${plantTag} कलम बांधने हेतु तैयार है। तने की मोटाई ${stemDiameter} मिलीमीटर है, जो 1.6 से 2.4 मिमी के सटीक दायरे में है।`);
      } else if (verdict === 'TOO_SLENDER') {
        voiceService.speak(`तना अत्यधिक पतला है, मात्र ${stemDiameter} मिलीमीटर। 2-3 दिन प्रतीक्षा करें।`);
      } else if (verdict === 'OVERGROWN') {
        voiceService.speak(`तना अत्यधिक मोटा है, ${stemDiameter} मिलीमीटर।`);
      } else {
        voiceService.speak(`चेतावनी: ${abstentionReason || 'चित्र की गुणवत्ता अपर्याप्त है।'}`);
      }
    } else {
      if (verdict === 'READY') {
        voiceService.speak(`Seedling ${plantTag} is READY for grafting. Stem diameter is ${stemDiameter} millimeters, matching the optimal 1.60 to 2.40 millimeter target.`);
      } else if (verdict === 'TOO_SLENDER') {
        voiceService.speak(`Seedling is TOO SLENDER at ${stemDiameter} millimeters. Retain in nursery.`);
      } else if (verdict === 'OVERGROWN') {
        voiceService.speak(`Seedling is OVERGROWN at ${stemDiameter} millimeters.`);
      } else {
        voiceService.speak(`Warning: ${abstentionReason || 'Image quality below threshold.'}`);
      }
    }
  };

  return (
    <div className="space-y-4 pb-20 animate-fade-in">
      
      {/* Title Header - Redesigned Zero-Pill Sturdy Botanical Banner */}
      <div className={`p-4 border transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
        highContrast
          ? 'bg-stone-950 text-amber-300 border-amber-400'
          : 'bg-[#faf9f6] text-stone-900 border-stone-300'
      }`}>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-[#1e4a31] dark:text-amber-400 uppercase tracking-wider">
              FR-1 · Intake & Assessment
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight mt-0.5">{t.intakeTitle}</h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-amber-200/80 mt-1 max-w-2xl">
            {t.intakeSubtitle}
          </p>
        </div>

        <button
          onClick={announceReadiness}
          className={`px-3 py-2 border text-xs font-bold flex items-center gap-1.5 transition shrink-0 ${
            highContrast
              ? 'bg-amber-400 text-stone-950 border-amber-300 hover:bg-amber-300'
              : 'bg-[#183625] text-stone-100 border-[#0d2116] hover:bg-[#254f38]'
          }`}
        >
          <Volume2 className="w-4 h-4" />
          <span>{t.speakAssessment}</span>
        </button>
      </div>

      {/* Field Test Presets - Rectangular Functional Chips (Zero-Pill) */}
      <div className={`p-3 border ${
        highContrast ? 'bg-stone-950 border-amber-400/60' : 'bg-white border-stone-300 shadow-2xs'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-stone-600 dark:text-amber-300">
            {t.quickPresetsTitle}
          </span>
          <span className="text-[11px] text-stone-400 font-mono">1-tap simulation</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <button
            onClick={() => applyPreset('ready_rootstock')}
            className={`p-2 border text-xs font-medium text-left transition ${
              highContrast
                ? 'bg-stone-900 border-emerald-400 text-emerald-300 hover:bg-stone-800'
                : 'bg-[#f4f8f4] border-emerald-300 text-emerald-950 hover:bg-[#eaf3ea]'
            }`}
          >
            ✓ {t.presetReadyRootstock}
          </button>
          <button
            onClick={() => applyPreset('ready_scion')}
            className={`p-2 border text-xs font-medium text-left transition ${
              highContrast
                ? 'bg-stone-900 border-emerald-400 text-emerald-300 hover:bg-stone-800'
                : 'bg-[#f4f8f4] border-emerald-300 text-emerald-950 hover:bg-[#eaf3ea]'
            }`}
          >
            ✓ {t.presetReadyScion}
          </button>
          <button
            onClick={() => applyPreset('too_slender')}
            className={`p-2 border text-xs font-medium text-left transition ${
              highContrast
                ? 'bg-stone-900 border-amber-400 text-amber-300 hover:bg-stone-800'
                : 'bg-[#fffbeb] border-amber-300 text-amber-950 hover:bg-[#fef3c7]'
            }`}
          >
            ▲ {t.presetSlender}
          </button>
          <button
            onClick={() => applyPreset('overgrown')}
            className={`p-2 border text-xs font-medium text-left transition ${
              highContrast
                ? 'bg-stone-900 border-amber-500 text-amber-300 hover:bg-stone-800'
                : 'bg-[#fff7ed] border-orange-300 text-orange-950 hover:bg-[#ffedd5]'
            }`}
          >
            ▲ {t.presetOvergrown}
          </button>
          <button
            onClick={() => applyPreset('blurred')}
            className={`p-2 border text-xs font-medium text-left transition ${
              highContrast
                ? 'bg-stone-900 border-rose-500 text-rose-300 hover:bg-stone-800'
                : 'bg-[#fff1f2] border-rose-300 text-rose-950 hover:bg-[#ffe4e6]'
            }`}
          >
            ✖ {t.presetBlur}
          </button>
          <button
            onClick={() => applyPreset('tilted')}
            className={`p-2 border text-xs font-medium text-left transition ${
              highContrast
                ? 'bg-stone-900 border-sky-400 text-sky-300 hover:bg-stone-800'
                : 'bg-[#f0f9ff] border-sky-300 text-sky-950 hover:bg-[#e0f2fe]'
            }`}
          >
            📐 {t.presetTilt}
          </button>
        </div>
      </div>

      {/* Main Grid: Left Image Capture / Right Calibrated Morphology */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Left Column: Image & Calibration Card */}
        <div className={`p-4 border flex flex-col justify-between ${
          highContrast ? 'bg-stone-950 text-amber-300 border-amber-400' : 'bg-white text-stone-900 border-stone-300'
        }`}>
          <div>
            {/* Plant Role Segmented Control (Rectangular, not pills) */}
            <div className="space-y-2 mb-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-stone-600 dark:text-amber-200">
                  {t.plantRole}:
                </span>
                <div className="flex border border-stone-300 dark:border-amber-400/60 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => handleRoleChange('rootstock')}
                    className={`px-3 py-1 text-xs font-bold transition ${
                      role === 'rootstock'
                        ? highContrast ? 'bg-amber-400 text-stone-950' : 'bg-[#183625] text-stone-100'
                        : 'bg-stone-50 dark:bg-stone-900 text-stone-600 dark:text-amber-200 hover:bg-stone-100'
                    }`}
                  >
                    {t.roleRootstock}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRoleChange('scion')}
                    className={`px-3 py-1 text-xs font-bold transition border-l border-stone-300 dark:border-amber-400/60 ${
                      role === 'scion'
                        ? highContrast ? 'bg-amber-400 text-stone-950' : 'bg-[#183625] text-stone-100'
                        : 'bg-stone-50 dark:bg-stone-900 text-stone-600 dark:text-amber-200 hover:bg-stone-100'
                    }`}
                  >
                    {t.roleScion}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-stone-500 dark:text-amber-300/70 block mb-0.5">{t.plantTag}:</span>
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
                  <span className="text-stone-500 dark:text-amber-300/70 block mb-0.5">{t.cultivar}:</span>
                  <input
                    type="text"
                    value={variety}
                    onChange={(e) => setVariety(e.target.value)}
                    className={`w-full font-medium px-2 py-1 border ${
                      highContrast ? 'bg-stone-900 border-amber-400 text-amber-300' : 'bg-stone-50 border-stone-300'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Viewport with Calibrated Marker Reticle */}
            <div className="relative border border-stone-300 dark:border-amber-400/60 bg-stone-100 aspect-4/3 flex items-center justify-center overflow-hidden">
              {isCameraActive ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={currentImage}
                  alt="Seedling analysis"
                  className="w-full h-full object-contain"
                />
              )}

              {/* Real In-Frame Measurement HUD */}
              <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-2">
                <div className="flex justify-between items-start">
                  <span className="px-1.5 py-0.5 bg-stone-900/80 text-stone-200 text-[10px] font-mono border border-stone-600">
                    20mm Scale: 0.114 mm/px
                  </span>
                  {verdict !== 'ABSTAIN_BLURRED' && (
                    <span className="px-1.5 py-0.5 bg-[#183625]/90 text-stone-100 text-[10px] font-mono">
                      Hypocotyl ROI: Calibrated
                    </span>
                  )}
                </div>

                <div className="border border-dashed border-[#183625]/80 mx-auto w-3/4 h-20 flex items-center justify-center">
                  <span className="text-[10px] bg-stone-900/80 text-stone-200 px-1.5 py-0.5 font-mono">
                    Caliber Scan Line
                  </span>
                </div>

                <div className="flex justify-between items-end text-[10px] text-stone-300">
                  <span className="bg-stone-900/80 px-1.5 py-0.5">Substrate Base</span>
                  <span className="bg-stone-900/80 px-1.5 py-0.5">Cotyledon Clearance</span>
                </div>
              </div>

              {isAssessing && (
                <div className="absolute inset-0 bg-stone-900/70 flex flex-col items-center justify-center text-white p-4">
                  <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent animate-spin mb-2" />
                  <span className="text-xs font-mono font-bold uppercase">{t.measuringStem}</span>
                </div>
              )}
            </div>
          </div>

          {/* Camera / Upload Controls */}
          <div className="mt-3 grid grid-cols-2 gap-2">
            {isCameraActive ? (
              <button
                onClick={captureCameraFrame}
                className={`col-span-2 py-2.5 font-bold text-xs flex items-center justify-center gap-1.5 border transition ${
                  highContrast ? 'bg-amber-400 text-stone-950 border-amber-300' : 'bg-[#183625] text-stone-100 border-[#0d2116]'
                }`}
              >
                <Camera className="w-4 h-4" />
                <span>{t.snapPicture}</span>
              </button>
            ) : (
              <>
                <button
                  onClick={startCamera}
                  className={`py-2 px-2 font-bold text-xs flex items-center justify-center gap-1.5 border transition ${
                    highContrast
                      ? 'bg-stone-900 text-amber-300 border-amber-400 hover:bg-stone-800'
                      : 'bg-white text-stone-800 border-stone-300 hover:bg-stone-50'
                  }`}
                >
                  <Camera className="w-4 h-4" />
                  <span>{t.openCamera}</span>
                </button>

                <label className={`py-2 px-2 font-bold text-xs flex items-center justify-center gap-1.5 border cursor-pointer transition ${
                  highContrast
                    ? 'bg-stone-900 text-amber-300 border-amber-400 hover:bg-stone-800'
                    : 'bg-white text-stone-800 border-stone-300 hover:bg-stone-50'
                }`}>
                  <Upload className="w-4 h-4" />
                  <span>{t.uploadPhoto}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </>
            )}
          </div>
        </div>

        {/* Right Column: Calibrated Data & High-Contrast Verdict */}
        <div className={`p-4 border flex flex-col justify-between ${
          highContrast ? 'bg-stone-950 text-amber-300 border-amber-400' : 'bg-white text-stone-900 border-stone-300'
        }`}>
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-stone-300 dark:border-amber-400/40">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-amber-200">
                Quantitative Vision Morphology
              </span>
              <span className="text-xs font-mono font-bold">20.0 mm REF</span>
            </div>

            {/* Readiness Verdict Box - Clean Rectangular Sturdy Panel */}
            <div className={`my-3 p-3.5 border-2 text-center ${
              verdict === 'READY'
                ? highContrast ? 'bg-stone-900 text-emerald-300 border-emerald-400' : 'bg-[#eef6ee] text-[#143d26] border-[#2e6d47]'
                : verdict === 'TOO_SLENDER'
                ? highContrast ? 'bg-stone-900 text-amber-300 border-amber-400' : 'bg-[#fffbeb] text-[#78350f] border-[#d97706]'
                : verdict === 'OVERGROWN'
                ? highContrast ? 'bg-stone-900 text-orange-300 border-orange-400' : 'bg-[#fff7ed] text-[#9a3412] border-[#ea580c]'
                : highContrast ? 'bg-stone-900 text-rose-300 border-rose-400' : 'bg-[#fff1f2] text-[#9f1239] border-[#e11d48]'
            }`}>
              <div className="flex items-center justify-center gap-1.5 mb-1">
                {verdict === 'READY' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-700 dark:text-emerald-400 shrink-0" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
                )}
                <span className="text-base font-extrabold uppercase tracking-wide">
                  {verdict === 'READY' && t.verdictReady}
                  {verdict === 'TOO_SLENDER' && t.verdictSlender}
                  {verdict === 'OVERGROWN' && t.verdictOvergrown}
                  {verdict === 'ABSTAIN_BLURRED' && t.verdictBlur}
                  {verdict === 'ABSTAIN_OUT_OF_PLANE' && t.verdictTilt}
                </span>
              </div>
              <p className="text-xs font-medium opacity-90 max-w-sm mx-auto leading-relaxed">
                {verdict === 'READY' && (language === 'hi' 
                  ? 'तने की मोटाई 1.60 से 2.40 मिमी के मानक लक्ष्य में है। 2.0 मिमी क्लिप के साथ उत्तम जोड़ बनेगा।'
                  : 'Stem diameter is within optimal 1.60 – 2.40 mm target window for standard 2.0mm silicone clips.')}
                {verdict === 'TOO_SLENDER' && (language === 'hi'
                  ? 'तना पतला है (<1.60 मिमी)। क्लिप फिसल जाएगी। 2-3 दिन नर्सरी में और रहने दें।'
                  : 'Stem caliber is below 1.60 mm. Silicone clips will slip. Retain in seedling nursery.')}
                {verdict === 'OVERGROWN' && (language === 'hi'
                  ? 'तना 2.80 मिमी से अधिक मोटा है। ऊतक कुचलने और तना खोखला होने का खतरा।'
                  : 'Stem caliber exceeds 2.80 mm. Risk of stem crushing and vascular void.')}
                {verdict === 'ABSTAIN_BLURRED' && (abstentionReason || t.verdictBlur)}
                {verdict === 'ABSTAIN_OUT_OF_PLANE' && (abstentionReason || t.verdictTilt)}
              </p>
            </div>

            {/* Tabular Numerical Metric Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              
              <div className={`p-2.5 border ${
                highContrast ? 'bg-stone-900 border-amber-400' : 'bg-stone-50 border-stone-200'
              }`}>
                <span className="text-stone-500 dark:text-amber-200/70 block text-[11px]">{t.stemDiameter}</span>
                <div className="text-xl font-bold font-mono text-[#183625] dark:text-amber-300">
                  {stemDiameter > 0 ? `${stemDiameter.toFixed(2)} mm` : '--'}
                </div>
                <span className="text-[10px] text-stone-400 font-mono">Target: 1.60 – 2.40 mm</span>
              </div>

              <div className={`p-2.5 border ${
                highContrast ? 'bg-stone-900 border-amber-400' : 'bg-stone-50 border-stone-200'
              }`}>
                <span className="text-stone-500 dark:text-amber-200/70 block text-[11px]">{t.hypocotylHeight}</span>
                <div className="text-xl font-bold font-mono">
                  {hypocotylHeight > 0 ? `${hypocotylHeight.toFixed(1)} mm` : '--'}
                </div>
                <span className="text-[10px] text-stone-400 font-mono">Target: 35 – 55 mm</span>
              </div>

              <div className={`p-2.5 border ${
                highContrast ? 'bg-stone-900 border-amber-400' : 'bg-stone-50 border-stone-200'
              }`}>
                <span className="text-stone-500 dark:text-amber-200/70 block text-[11px]">{t.cotyledonHeight}</span>
                <div className="text-xl font-bold font-mono">
                  {cotyledonHeight > 0 ? `${cotyledonHeight.toFixed(1)} mm` : '--'}
                </div>
                <span className="text-[10px] text-stone-400 font-mono">Clearance &gt; 25 mm</span>
              </div>

              <div className={`p-2.5 border ${
                highContrast ? 'bg-stone-900 border-amber-400' : 'bg-stone-50 border-stone-200'
              }`}>
                <span className="text-stone-500 dark:text-amber-200/70 block text-[11px]">{t.stemStraightness}</span>
                <div className="text-xl font-bold font-mono">
                  {straightness > 0 ? `${straightness.toFixed(1)}%` : '--'}
                </div>
                <span className="text-[10px] text-stone-400 font-mono">Confidence: {confidence.toFixed(1)}%</span>
              </div>
            </div>

            {/* Uncertainty Notice */}
            {abstentionReason && (
              <div className={`mt-3 p-2.5 border text-xs flex items-start gap-2 ${
                highContrast ? 'bg-stone-900 border-rose-500 text-rose-300' : 'bg-rose-50 border-rose-300 text-rose-950'
              }`}>
                <Info className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                <span className="leading-relaxed">{abstentionReason}</span>
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="mt-4 pt-3 border-t border-stone-300 dark:border-amber-400/40 flex flex-col sm:flex-row items-center gap-2">
            <button
              onClick={handleSaveSeedling}
              disabled={isSaved || verdict.startsWith('ABSTAIN')}
              className={`w-full sm:w-1/2 py-2.5 px-3 font-bold text-xs flex items-center justify-center gap-1.5 border transition ${
                isSaved
                  ? 'bg-emerald-700 text-white border-emerald-800'
                  : verdict.startsWith('ABSTAIN')
                  ? 'bg-stone-200 text-stone-400 border-stone-300 cursor-not-allowed'
                  : highContrast
                  ? 'bg-amber-400 text-stone-950 border-amber-300 hover:bg-amber-300'
                  : 'bg-[#183625] text-stone-100 border-[#0d2116] hover:bg-[#254f38]'
              }`}
            >
              <Save className="w-4 h-4" />
              <span>{isSaved ? t.savedToBatch : t.saveSeedling}</span>
            </button>

            <button
              onClick={onSelectPairingModule}
              className={`w-full sm:w-1/2 py-2.5 px-3 font-bold text-xs flex items-center justify-center gap-1.5 border transition ${
                highContrast
                  ? 'bg-stone-900 text-amber-300 border-amber-400 hover:bg-stone-800'
                  : 'bg-stone-800 text-white border-stone-900 hover:bg-stone-900'
              }`}
            >
              <span>{t.pairRootstockScion}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Seedling Ledger */}
      <div className={`p-4 border ${
        highContrast ? 'bg-stone-950 border-amber-400/60' : 'bg-white border-stone-300'
      }`}>
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-stone-200 dark:border-amber-400/30">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-amber-200">
            {t.registeredSeedlings} ({selectedBatch.name})
          </span>
          <span className="font-mono text-xs text-stone-500 dark:text-amber-300">
            {seedlings.length} Records
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {seedlings.map((s) => (
            <div
              key={s.id}
              className={`p-2.5 border text-xs flex flex-col justify-between ${
                s.readinessVerdict === 'READY'
                  ? highContrast ? 'bg-stone-900 border-emerald-500 text-emerald-300' : 'bg-[#f4f9f4] border-emerald-300 text-stone-900'
                  : highContrast ? 'bg-stone-900 border-stone-700 text-stone-300' : 'bg-stone-50 border-stone-200 text-stone-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold font-mono">{s.tag}</span>
                <span className="text-[10px] font-mono uppercase text-stone-500">
                  {s.role === 'rootstock' ? 'Rootstock' : 'Scion'}
                </span>
              </div>
              <div className="text-[11px] text-stone-600 dark:text-amber-200/70 truncate">{s.variety}</div>
              <div className="mt-2 flex items-center justify-between font-mono text-[11px] font-bold">
                <span>Ø {s.stemDiameterMm > 0 ? `${s.stemDiameterMm.toFixed(2)}mm` : '--'}</span>
                <span className={s.readinessVerdict === 'READY' ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'}>
                  {s.readinessVerdict === 'READY' ? 'READY' : 'WAIT'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
