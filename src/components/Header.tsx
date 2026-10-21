import React, { useState } from 'react';
import { 
  Volume2, 
  Mic, 
  MicOff,
  Sun, 
  Type, 
  BookOpen, 
  WifiOff, 
  HelpCircle,
  Languages
} from 'lucide-react';
import { AppSettings } from '../services/storage';
import { voiceService } from '../services/voiceAssistant';
import { Language, TRANSLATIONS } from '../i18n/translations';

interface HeaderProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  activeTab: string;
  onOpenVoiceModal: () => void;
  onOpenSrsModal: () => void;
  onOpenHelpModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  onUpdateSettings,
  activeTab,
  onOpenVoiceModal,
  onOpenSrsModal,
  onOpenHelpModal
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const t = TRANSLATIONS[settings.language] || TRANSLATIONS.en;

  const toggleLanguage = () => {
    const nextLang: Language = settings.language === 'en' ? 'hi' : 'en';
    const updated: AppSettings = { ...settings, language: nextLang };
    onUpdateSettings(updated);
    voiceService.setLanguage(nextLang);
    voiceService.speak(nextLang === 'hi' ? 'भाषा बदलकर हिन्दी की गई' : 'Language set to English');
  };

  const toggleHighContrast = () => {
    const updated = { ...settings, highContrast: !settings.highContrast };
    onUpdateSettings(updated);
    voiceService.speak(
      settings.language === 'hi' 
        ? (updated.highContrast ? 'हाई कंट्रास्ट सक्रिय' : 'सामान्य कंट्रास्ट सक्रिय')
        : (updated.highContrast ? 'High contrast mode enabled' : 'Standard contrast mode enabled')
    );
  };

  const cycleFontSize = () => {
    const nextSize: Record<AppSettings['fontSize'], AppSettings['fontSize']> = {
      normal: 'large',
      large: 'xlarge',
      xlarge: 'normal',
    };
    const updated = { ...settings, fontSize: nextSize[settings.fontSize] };
    onUpdateSettings(updated);
    voiceService.speak(
      settings.language === 'hi'
        ? `अक्षर आकार ${updated.fontSize} सेट हुआ`
        : `Text size set to ${updated.fontSize}`
    );
  };

  const toggleVoiceDictation = () => {
    const updatedState = !settings.voiceDictationEnabled;
    const updated: AppSettings = { ...settings, voiceDictationEnabled: updatedState };
    onUpdateSettings(updated);
    voiceService.setAudioEnabled(updatedState);
    if (!updatedState) {
      voiceService.stopListening();
      voiceService.stopSpeaking();
    } else {
      voiceService.speak(settings.language === 'hi' ? 'आवाज़ डिक्टेशन चालू' : 'Voice dictation turned on');
    }
  };

  const speakTabOverview = () => {
    setIsSpeaking(true);
    let message = '';
    if (settings.language === 'hi') {
      switch (activeTab) {
        case 'intake':
          message = 'चरण 1: पौध आवक एवं तना मूल्यांकन। 20 मिलीमीटर संदर्भ मार्कर द्वारा तने की मोटाई और ग्राफ्टिंग तत्परता की जांच करें।';
          break;
        case 'planning':
          message = 'चरण 2: ग्राफ्ट योजना एवं कटाई। मूलवृंत और सायन के तने के व्यास का मिलान करें और 45 डिग्री कोण कटाई निर्देश देखें।';
          break;
        case 'quality':
          message = 'चरण 3: कलम गुणवत्ता सूचकांक। कलम लगाने के बाद संरेखण जांचें और GQI स्कोर की गणना करें।';
          break;
        case 'healing':
          message = 'चरण 4: उपचार समय-सारणी एवं विफलता जोखिम। दिन 1 से 14 तक की तस्वीरें देखें और अस्थानिक जड़ों से सतर्क रहें।';
          break;
        case 'advisory':
          message = 'चरण 5: उपचार कक्ष परामर्श। तापमान और आर्द्रता लक्ष्य देखें और शोध डेटा डाउनलोड करें।';
          break;
        default:
          message = 'एआई-ग्राफ्ट में आपका स्वागत है। सब्जी ग्राफ्टिंग बुद्धिमत्ता मंच।';
      }
    } else {
      switch (activeTab) {
        case 'intake':
          message = 'Step 1: Seedling Intake and Assessment. Capture seedling with 20 millimeter marker to measure caliber and evaluate readiness.';
          break;
        case 'planning':
          message = 'Step 2: Graft Planning and Pairing. Match stem calibers and follow the 45-degree angle cutting protocol.';
          break;
        case 'quality':
          message = 'Step 3: Graft Quality Scoring. Inspect post-graft alignment and calculate the Graft Quality Index.';
          break;
        case 'healing':
          message = 'Step 4: Healing Monitoring. Review time-lapse photography and monitor early failure risks.';
          break;
        case 'advisory':
          message = 'Step 5: Healing Advisory. Review evidence-bounded chamber targets and export research datasets.';
          break;
        default:
          message = 'Welcome to AI-GRAFT, software intelligence for vegetable grafting.';
      }
    }
    voiceService.speak(message, () => setIsSpeaking(false));
  };

  return (
    <header className={`sticky top-0 z-30 transition-colors border-b ${
      settings.highContrast 
        ? 'bg-stone-950 text-amber-300 border-amber-400' 
        : 'bg-[#183625] text-stone-100 border-[#0d2116] shadow-sm'
    }`}>
      {/* Top Banner with Tactile Botanical Field Station Aesthetic */}
      <div className="max-w-5xl mx-auto px-3 sm:px-4 py-2.5 flex items-center justify-between gap-2">
        
        {/* Brand & Crop - Zero-Pill Rectangular Badge */}
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-sm flex items-center justify-center font-bold text-base border ${
            settings.highContrast 
              ? 'bg-amber-400 text-stone-950 border-amber-300' 
              : 'bg-[#254f38] text-emerald-200 border-[#32694b]'
          }`}>
            🌱
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight leading-tight">
                {t.appTitle}
              </span>
              {/* Unboxed Metadata Tag */}
              <span className="text-[11px] font-mono text-stone-300 dark:text-amber-200/90 border-l border-stone-500/50 pl-2">
                {t.cropTag}
              </span>
            </div>
            <p className="text-[11px] text-stone-300/80 dark:text-amber-300/80 hidden xs:block">
              {t.appSubtitle}
            </p>
          </div>
        </div>

        {/* Action Controls - Rectangular, Tactile Field Lab Tools */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* Language Switcher Button [EN / हिन्दी] */}
          <button
            onClick={toggleLanguage}
            title={settings.language === 'en' ? 'हिन्दी में बदलें' : 'Switch to English'}
            className={`px-2.5 py-1.5 rounded-sm text-xs font-bold transition flex items-center gap-1 border ${
              settings.highContrast
                ? 'bg-stone-900 text-amber-300 border-amber-400 hover:bg-stone-800'
                : 'bg-[#234834] text-stone-100 border-[#376b4d] hover:bg-[#2c5b42]'
            }`}
          >
            <Languages className="w-3.5 h-3.5" />
            <span className="font-sans font-extrabold">{settings.language === 'en' ? 'हिन्दी' : 'English'}</span>
          </button>

          {/* Spoken Audio Screen Briefing Button */}
          <button
            onClick={speakTabOverview}
            title={t.listen}
            aria-label={t.listen}
            className={`px-2.5 py-1.5 rounded-sm font-bold flex items-center gap-1 text-xs transition border ${
              isSpeaking
                ? 'bg-amber-400 text-stone-950 border-amber-300'
                : settings.highContrast
                ? 'bg-stone-900 text-amber-300 border-amber-400 hover:bg-stone-800'
                : 'bg-[#234834] text-stone-100 border-[#376b4d] hover:bg-[#2c5b42]'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.listen}</span>
          </button>

          {/* Voice Dictation Toggle Button (On/Off) */}
          <button
            onClick={toggleVoiceDictation}
            title={settings.voiceDictationEnabled ? t.dictationOn : t.dictationOff}
            aria-label={t.toggleDictation}
            className={`px-2 py-1.5 rounded-sm font-bold flex items-center gap-1.5 text-xs transition border ${
              settings.voiceDictationEnabled
                ? settings.highContrast
                  ? 'bg-amber-400 text-stone-950 border-amber-300'
                  : 'bg-[#caa056] text-stone-950 border-[#b58c42]'
                : settings.highContrast
                ? 'bg-stone-900 text-stone-400 border-stone-700 hover:text-amber-200'
                : 'bg-[#234834] text-stone-300 border-[#376b4d] hover:bg-[#2c5b42]'
            }`}
          >
            {settings.voiceDictationEnabled ? (
              <Mic className="w-3.5 h-3.5 text-stone-950" />
            ) : (
              <MicOff className="w-3.5 h-3.5 opacity-60" />
            )}
            <span className="font-mono text-[11px] font-bold">
              {settings.voiceDictationEnabled 
                ? (settings.language === 'hi' ? 'डिक्टेशन: चालू' : 'Dictation: ON')
                : (settings.language === 'hi' ? 'डिक्टेशन: बंद' : 'Dictation: OFF')}
            </span>
          </button>

          {/* Voice Command Center Trigger */}
          <button
            onClick={onOpenVoiceModal}
            title={t.voiceCenterTitle}
            aria-label="Open Voice Commands"
            className={`p-1.5 sm:px-2 rounded-sm font-bold text-xs transition border flex items-center gap-1 ${
              settings.highContrast
                ? 'bg-stone-900 text-amber-300 border-amber-400 hover:bg-stone-800'
                : 'bg-[#234834] text-stone-100 border-[#376b4d] hover:bg-[#2c5b42]'
            }`}
          >
            <Mic className="w-3.5 h-3.5 opacity-80" />
            <span className="hidden sm:inline font-mono">{settings.language === 'hi' ? 'कमांड्स' : 'Commands'}</span>
          </button>

          {/* High Contrast Mode Toggle */}
          <button
            onClick={toggleHighContrast}
            title={settings.highContrast ? t.normalContrast : t.highContrast}
            aria-label="Toggle Contrast"
            className={`p-1.5 sm:px-2 rounded-sm border text-xs font-semibold transition flex items-center gap-1 ${
              settings.highContrast
                ? 'bg-amber-400 text-stone-950 border-amber-300'
                : 'bg-[#234834] text-stone-100 border-[#376b4d] hover:bg-[#2c5b42]'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{settings.highContrast ? 'Normal' : 'Contrast'}</span>
          </button>

          {/* Font Size Stepper (A / A+ / A++) */}
          <button
            onClick={cycleFontSize}
            title={`${t.fontSize}: ${settings.fontSize.toUpperCase()}`}
            aria-label={t.fontSize}
            className={`px-2 py-1.5 rounded-sm border text-xs font-mono font-bold transition flex items-center gap-0.5 ${
              settings.highContrast
                ? 'bg-stone-900 text-amber-300 border-amber-400'
                : 'bg-[#234834] text-stone-100 border-[#376b4d] hover:bg-[#2c5b42]'
            }`}
          >
            <Type className="w-3 h-3" />
            <span>{settings.fontSize === 'normal' ? 'A' : settings.fontSize === 'large' ? 'A+' : 'A++'}</span>
          </button>

          {/* SRS Specs Modal Button */}
          <button
            onClick={onOpenSrsModal}
            title={t.specsBtn}
            aria-label={t.specsBtn}
            className={`p-1.5 rounded-sm border text-xs font-medium transition ${
              settings.highContrast
                ? 'bg-stone-900 text-amber-300 border-amber-400'
                : 'bg-[#234834] text-stone-200 border-[#376b4d] hover:bg-[#2c5b42]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Sub-header Ribbon with Clean Unboxed Text Dividers */}
      <div className={`px-3 sm:px-4 py-1 text-[11px] flex items-center justify-between border-t ${
        settings.highContrast
          ? 'bg-stone-900 text-amber-300 border-stone-800'
          : 'bg-[#122b1d] text-stone-300 border-[#1c3f2b]'
      }`}>
        <div className="flex items-center gap-2 text-[10px] sm:text-[11px]">
          <span className="font-bold flex items-center gap-1 text-emerald-300 dark:text-amber-300">
            <WifiOff className="w-3 h-3 inline" /> {t.offlineStatus}
          </span>
          <span aria-hidden="true" className="opacity-40">·</span>
          <span className="hidden sm:inline opacity-80">{t.onDeviceStorage}</span>
        </div>
        <div className="text-[10px] sm:text-[11px] opacity-80 truncate max-w-[240px] sm:max-w-none font-medium">
          {t.operatorDisclaimer}
        </div>
      </div>
    </header>
  );
};
