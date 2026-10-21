import React, { useState, useEffect } from 'react';
import { 
  loadBatches, 
  loadSeedlings, 
  saveSeedlings, 
  loadGraftPairs, 
  saveGraftPairs, 
  loadGraftRecords, 
  saveGraftRecords, 
  loadHealingLogs, 
  saveHealingLogs, 
  loadSettings, 
  saveSettings, 
  AppSettings 
} from './services/storage';
import { Batch, GraftPair, GraftRecord, HealingDayLog, Seedling } from './types/graft';
import { voiceService } from './services/voiceAssistant';
import { Header } from './components/Header';
import { BottomNav, TabKey } from './components/BottomNav';
import { VoiceCenterModal } from './components/VoiceCenterModal';
import { SRSModal } from './components/SRSModal';
import { HelpModal } from './components/HelpModal';
import { Module1_Intake } from './components/Module1_Intake';
import { Module2_Planning } from './components/Module2_Planning';
import { Module3_QualityScoring } from './components/Module3_QualityScoring';
import { Module4_HealingMonitoring } from './components/Module4_HealingMonitoring';
import { Module5_AdvisoryDashboard } from './components/Module5_AdvisoryDashboard';
import { TRANSLATIONS } from './i18n/translations';

export default function App() {
  const [settings, setSettings] = useState<AppSettings>(loadSettings());
  const [batches] = useState<Batch[]>(loadBatches());
  const [seedlings, setSeedlings] = useState<Seedling[]>(loadSeedlings());
  const [pairs, setPairs] = useState<GraftPair[]>(loadGraftPairs());
  const [records, setRecords] = useState<GraftRecord[]>(loadGraftRecords());
  const [healingLogs, setHealingLogs] = useState<HealingDayLog[]>(loadHealingLogs());

  const [activeTab, setActiveTab] = useState<TabKey>('intake');
  const [selectedPair, setSelectedPair] = useState<GraftPair | null>(null);
  const [selectedRecordId, setSelectedRecordId] = useState<string>(records[0]?.id || 'graft-rec-101');

  // Modals
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isSrsModalOpen, setIsSrsModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  const t = TRANSLATIONS[settings.language] || TRANSLATIONS.en;

  // Apply font size, contrast, and voice service language
  useEffect(() => {
    saveSettings(settings);
    voiceService.setLanguage(settings.language);
    voiceService.setAudioEnabled(settings.voiceDictationEnabled);

    if (typeof document !== 'undefined') {
      document.body.setAttribute('data-contrast', settings.highContrast ? 'high' : 'normal');
      document.body.setAttribute('data-font-size', settings.fontSize);
      if (settings.highContrast) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [settings]);

  // Voice Command Dispatcher with Bilingual Responses
  const handleVoiceCommand = (actionType: string, spokenText: string) => {
    const isHi = settings.language === 'hi';
    switch (actionType) {
      case 'NAV_INTAKE':
        setActiveTab('intake');
        voiceService.speak(isHi ? 'चरण 1: पौध आवक पर पहुंचे' : 'Switched to Step 1: Seedling Intake');
        break;
      case 'NAV_PLANNING':
        setActiveTab('planning');
        voiceService.speak(isHi ? 'चरण 2: ग्राफ्ट योजना पर पहुंचे' : 'Switched to Step 2: Graft Planning');
        break;
      case 'NAV_QUALITY':
        setActiveTab('quality');
        voiceService.speak(isHi ? 'चरण 3: कलम गुणवत्ता स्कोर पर पहुंचे' : 'Switched to Step 3: Graft Quality Scoring');
        break;
      case 'NAV_HEALING':
        setActiveTab('healing');
        voiceService.speak(isHi ? 'चरण 4: उपचार निगरानी पर पहुंचे' : 'Switched to Step 4: Healing Monitoring');
        break;
      case 'NAV_ADVISORY':
        setActiveTab('advisory');
        voiceService.speak(isHi ? 'चरण 5: उपचार कक्ष परामर्श पर पहुंचे' : 'Switched to Step 5: Healing Advisory');
        break;
      case 'TOGGLE_CONTRAST':
        setSettings(prev => ({ ...prev, highContrast: !prev.highContrast }));
        voiceService.speak(isHi ? 'कंट्रास्ट मोड बदला गया' : 'Toggled contrast mode');
        break;
      case 'TOGGLE_LARGE_FONT':
        setSettings(prev => {
          const nextSize: Record<AppSettings['fontSize'], AppSettings['fontSize']> = {
            normal: 'large',
            large: 'xlarge',
            xlarge: 'normal',
          };
          const updated = nextSize[prev.fontSize];
          voiceService.speak(isHi ? `अक्षर आकार ${updated} हुआ` : `Font size set to ${updated}`);
          return { ...prev, fontSize: updated };
        });
        break;
      case 'TRIGGER_SPEAK_SUMMARY':
        if (activeTab === 'intake') {
          voiceService.speak(
            isHi
              ? 'पौध आवक: 20 मिमी मार्कर से तने का व्यास नापें और तत्परता जांचें।'
              : 'Seedling Intake: Inspect stem caliber with the 20mm marker. Check if rootstock or scion is ready.'
          );
        } else if (activeTab === 'planning') {
          voiceService.speak(
            isHi
              ? 'ग्राफ्ट योजना: तने के व्यास का मिलान और 45 डिग्री तिरछी कटाई का सचित्र नक्शा।'
              : 'Graft Planning: Stem caliber matching algorithm with 45 degree angle visual cutting diagram.'
          );
        } else if (activeTab === 'quality') {
          voiceService.speak(
            isHi
              ? 'गुणवत्ता स्कोर: व्यास मिलान, संवहनी जुड़ाव, कटाई समतलता और क्लिप की पकड़ का बहु-घटक सूचकांक।'
              : 'Quality Scoring: Evaluates diameter match, vascular alignment, cut coplanarity, and clip seating.'
          );
        } else if (activeTab === 'healing') {
          voiceService.speak(
            isHi
              ? 'उपचार निगरानी: दिन 1 से 14 तक की तस्वीरें, कैलस ऊतक जुड़ाव और अस्थानिक जड़ जोखिम।'
              : 'Healing Monitoring: Tracks day 1 to 14 photographs, callus bridges, and early failure risks.'
          );
        } else if (activeTab === 'advisory') {
          voiceService.speak(
            isHi
              ? 'कक्ष परामर्श: तापमान और आर्द्रता लक्ष्य और शोध डेटा डाउनलोड करें।'
              : 'Healing Advisory: Bounded chamber targets for humidity and temperature. Download scientific data.'
          );
        }
        break;
      case 'ACTION_NEXT':
        const flow: TabKey[] = ['intake', 'planning', 'quality', 'healing', 'advisory'];
        const curIdx = flow.indexOf(activeTab);
        if (curIdx < flow.length - 1) {
          setActiveTab(flow[curIdx + 1]);
          voiceService.speak(isHi ? `अगले चरण पर: ${flow[curIdx + 1]}` : `Moved to next step: ${flow[curIdx + 1]}`);
        }
        break;
      case 'ACTION_BACK':
        const flowBack: TabKey[] = ['intake', 'planning', 'quality', 'healing', 'advisory'];
        const curIdxB = flowBack.indexOf(activeTab);
        if (curIdxB > 0) {
          setActiveTab(flowBack[curIdxB - 1]);
          voiceService.speak(isHi ? `पिछले चरण पर: ${flowBack[curIdxB - 1]}` : `Moved back to ${flowBack[curIdxB - 1]}`);
        }
        break;
      default:
        voiceService.speak(isHi ? `आदेश सुना: ${spokenText}` : `Command heard: ${spokenText}`);
    }
  };

  const handleAddSeedling = (newSeedling: Seedling) => {
    const updated = [newSeedling, ...seedlings];
    setSeedlings(updated);
    saveSeedlings(updated);
  };

  const handleSaveGraftRecord = (newRecord: GraftRecord) => {
    const updated = [newRecord, ...records];
    setRecords(updated);
    saveGraftRecords(updated);
    setSelectedRecordId(newRecord.id);
  };

  const handleAddHealingLog = (newLog: HealingDayLog) => {
    const updated = [...healingLogs, newLog];
    setHealingLogs(updated);
    saveHealingLogs(updated);
  };

  const handleUpdateOutcome = (recordId: string, outcome: GraftRecord['outcome']) => {
    const updated = records.map(r => r.id === recordId ? { ...r, outcome, outcomeRecordedDate: new Date().toLocaleDateString() } : r);
    setRecords(updated);
    saveGraftRecords(updated);
    voiceService.speak(
      settings.language === 'hi'
        ? `पौध परिणाम अपडेट हुआ: ${outcome}`
        : `Plant record outcome updated to ${outcome.replace('_', ' ')}.`
    );
  };

  const fontSizeClass = 
    settings.fontSize === 'xlarge' ? 'text-lg' : settings.fontSize === 'large' ? 'text-base' : 'text-sm';

  return (
    <div className={`min-h-screen transition-colors flex flex-col font-sans ${fontSizeClass} ${
      settings.highContrast
        ? 'bg-stone-950 text-amber-300'
        : 'bg-[#f5f4ef] text-stone-900'
    }`}>
      {/* Header with Bilingual Support & Tactile Station Controls */}
      <Header
        settings={settings}
        onUpdateSettings={setSettings}
        activeTab={activeTab}
        onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
        onOpenSrsModal={() => setIsSrsModalOpen(true)}
        onOpenHelpModal={() => setIsHelpModalOpen(true)}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-3 sm:p-5">
        
        {/* Research Station Quick Status Bar - Zero-Pill Rectangular Aesthetic */}
        <div className={`mb-3.5 px-3.5 py-2 border flex items-center justify-between text-xs ${
          settings.highContrast
            ? 'bg-stone-900 border-amber-400 text-amber-200'
            : 'bg-white text-stone-800 border-stone-300 shadow-2xs'
        }`}>
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-xs uppercase text-[#183625] dark:text-amber-400">
              {settings.language === 'hi' ? 'फील्ड स्टेशन मोड:' : 'Field Station Mode:'}
            </span>
            <span className="hidden sm:inline text-stone-600 dark:text-amber-200/80">
              {settings.language === 'hi' 
                ? '5 चरणबद्ध प्रक्रिया या त्वरित परीक्षण विकल्पों का प्रयोग करें' 
                : 'Execute the 5-step workflow or click field test presets'}
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono text-[11px]">
            <button
              onClick={() => setIsHelpModalOpen(true)}
              className="font-medium underline hover:text-[#183625] dark:hover:text-amber-300"
            >
              {t.guideBtn}
            </button>
            <span aria-hidden="true" className="opacity-40">·</span>
            <button
              onClick={() => setIsSrsModalOpen(true)}
              className="font-medium underline hover:text-[#183625] dark:hover:text-amber-300"
            >
              {t.specsBtn}
            </button>
          </div>
        </div>

        {/* Dynamic Tab Module Rendering */}
        {activeTab === 'intake' && (
          <Module1_Intake
            batches={batches}
            seedlings={seedlings}
            onAddSeedling={handleAddSeedling}
            onSelectPairingModule={() => setActiveTab('planning')}
            highContrast={settings.highContrast}
            fontSize={settings.fontSize}
            language={settings.language}
          />
        )}

        {activeTab === 'planning' && (
          <Module2_Planning
            seedlings={seedlings}
            pairs={pairs}
            onSelectPairForGraft={(pair) => setSelectedPair(pair)}
            onProceedToQuality={() => setActiveTab('quality')}
            highContrast={settings.highContrast}
            fontSize={settings.fontSize}
            language={settings.language}
          />
        )}

        {activeTab === 'quality' && (
          <Module3_QualityScoring
            selectedPair={selectedPair}
            seedlings={seedlings}
            records={records}
            onSaveGraftRecord={handleSaveGraftRecord}
            onProceedToHealing={(graftId) => {
              setSelectedRecordId(graftId);
              setActiveTab('healing');
            }}
            highContrast={settings.highContrast}
            fontSize={settings.fontSize}
            language={settings.language}
          />
        )}

        {activeTab === 'healing' && (
          <Module4_HealingMonitoring
            records={records}
            healingLogs={healingLogs}
            onAddHealingLog={handleAddHealingLog}
            selectedRecordId={selectedRecordId}
            highContrast={settings.highContrast}
            fontSize={settings.fontSize}
            language={settings.language}
          />
        )}

        {activeTab === 'advisory' && (
          <Module5_AdvisoryDashboard
            records={records}
            onUpdateOutcome={handleUpdateOutcome}
            highContrast={settings.highContrast}
            fontSize={settings.fontSize}
            language={settings.language}
          />
        )}
      </main>

      {/* Fixed Mobile Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          voiceService.speak(
            settings.language === 'hi' ? `चरण: ${tab}` : `Viewing Step: ${tab}`
          );
        }}
        highContrast={settings.highContrast}
        language={settings.language}
      />

      {/* Voice Assistant Center Modal */}
      <VoiceCenterModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onExecuteCommand={handleVoiceCommand}
        highContrast={settings.highContrast}
        language={settings.language}
        voiceDictationEnabled={settings.voiceDictationEnabled}
        onToggleVoiceDictation={() => {
          const updatedState = !settings.voiceDictationEnabled;
          const updated = { ...settings, voiceDictationEnabled: updatedState };
          setSettings(updated);
          saveSettings(updated);
          voiceService.setAudioEnabled(updatedState);
          if (!updatedState) {
            voiceService.stopListening();
            voiceService.stopSpeaking();
          } else {
            voiceService.speak(settings.language === 'hi' ? 'आवाज़ डिक्टेशन चालू की गई' : 'Voice dictation turned on');
          }
        }}
      />

      {/* SRS Compliance Specification Modal */}
      <SRSModal
        isOpen={isSrsModalOpen}
        onClose={() => setIsSrsModalOpen(false)}
        highContrast={settings.highContrast}
        language={settings.language}
      />

      {/* Farmer & Operator Help Modal */}
      <HelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
        highContrast={settings.highContrast}
        language={settings.language}
      />
    </div>
  );
}
