import React, { useEffect, useState } from 'react';
import { Mic, MicOff, X, Play, AlertCircle } from 'lucide-react';
import { voiceService } from '../services/voiceAssistant';
import { Language, TRANSLATIONS } from '../i18n/translations';

interface VoiceCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExecuteCommand: (actionType: string, spokenText: string) => void;
  highContrast: boolean;
  language: Language;
  voiceDictationEnabled: boolean;
  onToggleVoiceDictation: () => void;
}

export const VoiceCenterModal: React.FC<VoiceCenterModalProps> = ({
  isOpen,
  onClose,
  onExecuteCommand,
  highContrast,
  language,
  voiceDictationEnabled,
  onToggleVoiceDictation
}) => {
  const [isListening, setIsListening] = useState(false);
  const [lastSpoken, setLastSpoken] = useState('');
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const [statusMessage, setStatusMessage] = useState(t.listeningState);

  const COMMANDS_EN = [
    { label: 'Step 1: Seedling Intake', command: 'seedling intake', action: 'NAV_INTAKE', desc: 'Opens camera and scale calibration' },
    { label: 'Check Readiness', command: 'check readiness', action: 'ACTION_EVALUATE', desc: 'Measures stem diameter & scale' },
    { label: 'Step 2: Pair Planning', command: 'pair plants', action: 'NAV_PLANNING', desc: 'Shows stem matching & 45° angle cut guide' },
    { label: 'Step 3: Quality Scoring', command: 'quality score', action: 'NAV_QUALITY', desc: 'Opens post-graft GQI inspection' },
    { label: 'Step 4: Healing Timeline', command: 'healing timeline', action: 'NAV_HEALING', desc: 'Inspects day-by-day healing stages' },
    { label: 'Step 5: Chamber Advice', command: 'chamber advice', action: 'NAV_ADVISORY', desc: 'Environmental targets & dataset download' },
    { label: 'Read Screen Aloud', command: 'speak summary', action: 'TRIGGER_SPEAK_SUMMARY', desc: 'Speaks audio explanation of current view' },
    { label: 'Toggle Contrast', command: 'high contrast', action: 'TOGGLE_CONTRAST', desc: 'Switches high contrast visual mode' },
    { label: 'Bigger Text', command: 'large text', action: 'TOGGLE_LARGE_FONT', desc: 'Cycles through accessible font sizes' },
  ];

  const COMMANDS_HI = [
    { label: 'चरण 1: पौध जांच', command: 'पौध जांच', action: 'NAV_INTAKE', desc: 'कैमरा और 20 मिमी पैमाना जांच' },
    { label: 'तत्परता जांचें', command: 'तैयार', action: 'ACTION_EVALUATE', desc: 'तने का व्यास और स्वास्थ्य मापन' },
    { label: 'चरण 2: जोड़ी व कटाई', command: 'जोड़ी बनाएं', action: 'NAV_PLANNING', desc: 'मूलवृंत-सायन मिलान एवं 45° कटाई' },
    { label: 'चरण 3: गुणवत्ता स्कोर', command: 'गुणवत्ता', action: 'NAV_QUALITY', desc: 'कलम लगाने के बाद GQI स्कोर' },
    { label: 'चरण 4: उपचार निगरानी', command: 'उपचार', action: 'NAV_HEALING', desc: 'दिन-प्रतिदिन घाव भरने की जांच' },
    { label: 'चरण 5: कक्ष परामर्श', command: 'सलाह', action: 'NAV_ADVISORY', desc: 'तापमान-आर्द्रता लक्ष्य एवं डेटा डाउनलोड' },
    { label: 'स्क्रीन पढ़कर सुनाएं', command: 'सुनाएं', action: 'TRIGGER_SPEAK_SUMMARY', desc: 'वर्तमान स्क्रीन का विवरण बोलें' },
    { label: 'कंट्रास्ट बदलें', command: 'कंट्रास्ट', action: 'TOGGLE_CONTRAST', desc: 'धूप या कमजोर दृष्टि हेतु हाई कंट्रास्ट' },
    { label: 'बड़ा अक्षर आकार', command: 'बड़ा अक्षर', action: 'TOGGLE_LARGE_FONT', desc: 'आसान पढ़ने हेतु बड़ा टेक्स्ट' },
  ];

  const currentCommands = language === 'hi' ? COMMANDS_HI : COMMANDS_EN;

  useEffect(() => {
    voiceService.setLanguage(language);
  }, [language]);

  const startVoiceListener = () => {
    if (!voiceDictationEnabled) {
      setStatusMessage(t.dictationDisabledNotice);
      return;
    }

    const started = voiceService.startListening(
      (transcript, action) => {
        setLastSpoken(transcript);
        setStatusMessage(`${language === 'hi' ? 'पहचाना गया:' : 'Recognized:'} "${transcript}"`);
        onExecuteCommand(action, transcript);
      },
      (listening) => {
        setIsListening(listening);
        if (listening) {
          setStatusMessage(t.listeningState);
        } else {
          setStatusMessage(t.stoppedState);
        }
      }
    );

    if (!started) {
      setStatusMessage(language === 'hi' 
        ? 'माइक्रोफ़ोन अनुमति नहीं मिली। आप नीचे दिए गए किसी भी बटन पर क्लिक करके परीक्षण कर सकते हैं!' 
        : 'Microphone permission blocked or not supported. You can click any simulated voice command below!');
    }
  };

  const stopVoiceListener = () => {
    voiceService.stopListening((listening) => setIsListening(listening));
    setStatusMessage(t.stoppedState);
  };

  const handleSimulate = (cmd: typeof currentCommands[0]) => {
    setLastSpoken(cmd.command);
    setStatusMessage(`${language === 'hi' ? 'आदेश मिला:' : 'Simulated voice command:'} "${cmd.command}"`);
    voiceService.speak(language === 'hi' ? `आवाज़ आदेश: ${cmd.label}` : `Voice command: ${cmd.label}`);
    onExecuteCommand(cmd.action, cmd.command);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/80 backdrop-blur-xs animate-fade-in">
      <div className={`w-full max-w-xl border-2 p-5 shadow-xl max-h-[90vh] overflow-y-auto ${
        highContrast
          ? 'bg-stone-950 text-amber-300 border-amber-400'
          : 'bg-[#faf9f6] text-stone-900 border-stone-400'
      }`}>
        {/* Header - Zero-Pill Clean Layout */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-300 dark:border-amber-400/40">
          <div>
            <h2 className="text-lg font-extrabold tracking-tight">{t.voiceCenterTitle}</h2>
            <p className="text-xs text-stone-600 dark:text-amber-200/80 mt-0.5">{t.voiceCenterSubtitle}</p>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 border transition ${
              highContrast ? 'border-amber-400 text-amber-300 hover:bg-stone-900' : 'border-stone-300 text-stone-600 hover:bg-stone-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Master Voice Dictation Toggle Bar */}
        <div className={`p-3 border my-4 flex items-center justify-between ${
          highContrast ? 'bg-stone-900 border-amber-400/70' : 'bg-stone-100 border-stone-300'
        }`}>
          <div>
            <span className="font-mono text-xs font-bold uppercase tracking-wider block">
              {language === 'hi' ? 'आवाज़ डिक्टेशन नियंत्रण' : 'Voice Dictation Control'}
            </span>
            <span className="text-[11px] text-stone-500 dark:text-amber-200/70">
              {voiceDictationEnabled 
                ? (language === 'hi' ? 'माइक्रोफ़ोन डिक्टेशन सक्रिय है' : 'Microphone dictation is active') 
                : (language === 'hi' ? 'डिक्टेशन बंद है' : 'Dictation is currently OFF')}
            </span>
          </div>

          <button
            onClick={onToggleVoiceDictation}
            className={`px-3 py-1.5 font-bold text-xs border transition flex items-center gap-1.5 ${
              voiceDictationEnabled
                ? highContrast
                  ? 'bg-amber-400 text-stone-950 border-amber-300'
                  : 'bg-[#183625] text-stone-100 border-[#0d2116]'
                : highContrast
                ? 'bg-stone-950 text-stone-400 border-stone-700 hover:text-amber-300'
                : 'bg-stone-200 text-stone-700 border-stone-300 hover:bg-stone-300'
            }`}
          >
            {voiceDictationEnabled ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
            <span>
              {voiceDictationEnabled 
                ? (language === 'hi' ? 'डिक्टेशन: चालू' : 'Dictation: ON') 
                : (language === 'hi' ? 'डिक्टेशन: बंद' : 'Dictation: OFF')}
            </span>
          </button>
        </div>

        {/* Live Mic Action Panel */}
        <div className="my-4 flex flex-col items-center text-center">
          <button
            onClick={!voiceDictationEnabled ? onToggleVoiceDictation : isListening ? stopVoiceListener : startVoiceListener}
            className={`w-20 h-20 border-2 transition active:scale-95 flex flex-col items-center justify-center ${
              !voiceDictationEnabled
                ? 'bg-stone-200 text-stone-500 border-stone-300 dark:bg-stone-900 dark:text-stone-400 dark:border-stone-700'
                : isListening
                ? highContrast
                  ? 'bg-rose-700 text-white border-white animate-pulse'
                  : 'bg-rose-600 text-white border-rose-800 animate-pulse'
                : highContrast
                ? 'bg-amber-400 text-stone-950 border-amber-300 hover:bg-amber-300'
                : 'bg-[#183625] text-stone-100 border-[#0d2116] hover:bg-[#254f38]'
            }`}
          >
            {!voiceDictationEnabled ? (
              <>
                <MicOff className="w-7 h-7 mb-1 opacity-70" />
                <span className="text-[10px] font-mono uppercase font-bold">{language === 'hi' ? 'बंद है' : 'Turn ON'}</span>
              </>
            ) : isListening ? (
              <>
                <MicOff className="w-7 h-7 mb-1" />
                <span className="text-[10px] font-mono uppercase font-bold">{language === 'hi' ? 'रोकें' : 'Stop'}</span>
              </>
            ) : (
              <>
                <Mic className="w-7 h-7 mb-1" />
                <span className="text-[10px] font-mono uppercase font-bold">{language === 'hi' ? 'बोलें' : 'Speak'}</span>
              </>
            )}
          </button>

          <p className="mt-2.5 text-xs font-semibold">
            {!voiceDictationEnabled ? t.dictationDisabledNotice : statusMessage}
          </p>

          {lastSpoken && (
            <div className={`mt-2 px-3 py-1 border text-xs font-mono ${
              highContrast ? 'bg-stone-900 border-amber-400 text-amber-300' : 'bg-stone-100 border-stone-300 text-stone-900'
            }`}>
              {language === 'hi' ? 'सुना:' : 'Heard:'} "{lastSpoken}"
            </div>
          )}
        </div>

        {/* One-Tap Voice Command Simulator - Rectangular Chips */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-stone-600 dark:text-amber-200">
              {t.clickToTest}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {currentCommands.map((cmd) => (
              <button
                key={cmd.command}
                onClick={() => handleSimulate(cmd)}
                className={`p-2.5 border text-left transition flex items-start justify-between gap-2 ${
                  highContrast
                    ? 'bg-stone-900 border-amber-400/60 hover:bg-stone-800 text-amber-300'
                    : 'bg-white border-stone-300 hover:bg-[#f1f6f2] hover:border-[#2e6d47] text-stone-900 shadow-2xs'
                }`}
              >
                <div>
                  <div className="text-xs font-bold flex items-center gap-1.5">
                    <Play className="w-3 h-3 text-emerald-700 dark:text-amber-400 fill-current shrink-0" />
                    <span>"{cmd.command}"</span>
                  </div>
                  <div className="text-[11px] text-stone-500 dark:text-amber-200/70 mt-0.5">{cmd.label}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Field Tip */}
        <div className={`mt-4 p-3 border text-xs flex items-start gap-2 ${
          highContrast ? 'bg-stone-900 border-amber-400/50 text-amber-200' : 'bg-[#fffbeb] border-[#fde68a] text-[#78350f]'
        }`}>
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
          <span className="leading-relaxed">{t.farmerVoiceTip}</span>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-stone-300 dark:border-amber-400/40 flex justify-end">
          <button
            onClick={onClose}
            className={`px-4 py-1.5 font-bold text-xs border ${
              highContrast ? 'bg-amber-400 text-stone-950 border-amber-300' : 'bg-stone-800 text-white border-stone-900'
            }`}
          >
            {t.closeBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
