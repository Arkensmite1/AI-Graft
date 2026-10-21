// Voice assistant service supporting Web Speech Recognition and Web SpeechSynthesis for accessibility in English and Hindi

import { Language } from '../i18n/translations';

type VoiceCommandHandler = (command: string, actionType: string) => void;

interface IWindowWithSpeech extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

class VoiceService {
  private recognition: any = null;
  private isListening: boolean = false;
  private isSupported: boolean = false;
  private onCommandCallback: VoiceCommandHandler | null = null;
  private speechRate: number = 0.95; // Steady rate for elderly & field farmers
  private currentLanguage: Language = 'en';
  private isAudioEnabled: boolean = true; // Controlled by the dictation / voice toggle

  constructor() {
    const win = typeof window !== 'undefined' ? (window as unknown as IWindowWithSpeech) : null;
    if (win && (win.SpeechRecognition || win.webkitSpeechRecognition)) {
      const SpeechRecognitionClass = win.SpeechRecognition || win.webkitSpeechRecognition;
      try {
        this.recognition = new SpeechRecognitionClass();
        this.recognition.continuous = true;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-US';
        this.isSupported = true;
      } catch (err) {
        console.warn('Speech recognition init error:', err);
      }
    }
  }

  public setAudioEnabled(enabled: boolean) {
    this.isAudioEnabled = enabled;
    if (!enabled) {
      this.stopSpeaking();
      this.stopListening();
    }
  }

  public getAudioEnabled(): boolean {
    return this.isAudioEnabled;
  }

  public setLanguage(lang: Language) {
    this.currentLanguage = lang;
    if (this.recognition) {
      this.recognition.lang = lang === 'hi' ? 'hi-IN' : 'en-US';
    }
  }

  public getLanguage(): Language {
    return this.currentLanguage;
  }

  public getIsSupported(): boolean {
    return this.isSupported;
  }

  public getIsListening(): boolean {
    return this.isListening;
  }

  public startListening(onCommand: VoiceCommandHandler, onStatusChange?: (listening: boolean) => void): boolean {
    if (!this.isAudioEnabled) {
      if (onStatusChange) onStatusChange(false);
      return false;
    }

    this.onCommandCallback = onCommand;

    if (!this.recognition) {
      if (onStatusChange) onStatusChange(false);
      return false;
    }

    try {
      this.recognition.lang = this.currentLanguage === 'hi' ? 'hi-IN' : 'en-US';

      this.recognition.onstart = () => {
        this.isListening = true;
        if (onStatusChange) onStatusChange(true);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        if (onStatusChange) onStatusChange(false);
      };

      this.recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        this.isListening = false;
        if (onStatusChange) onStatusChange(false);
      };

      this.recognition.onresult = (event: any) => {
        const lastResultIndex = event.results.length - 1;
        const transcript = event.results[lastResultIndex][0].transcript.trim().toLowerCase();
        this.handleTranscript(transcript);
      };

      this.recognition.start();
      return true;
    } catch (e) {
      console.warn('Failed to start recognition:', e);
      this.isListening = false;
      if (onStatusChange) onStatusChange(false);
      return false;
    }
  }

  public stopListening(onStatusChange?: (listening: boolean) => void) {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        console.warn(e);
      }
    }
    this.isListening = false;
    if (onStatusChange) onStatusChange(false);
  }

  public handleTranscript(rawTranscript: string) {
    const text = rawTranscript.toLowerCase();

    let matchedAction = 'UNKNOWN';

    // English and Hindi command recognition
    if (
      text.includes('intake') || text.includes('seedling') || text.includes('camera') || 
      text.includes('पौध') || text.includes('नर्सरी') || text.includes('जांच')
    ) {
      matchedAction = 'NAV_INTAKE';
    } else if (
      text.includes('pair') || text.includes('match') || text.includes('plan') || text.includes('cut') ||
      text.includes('जोड़ी') || text.includes('कलम') || text.includes('कटाई')
    ) {
      matchedAction = 'NAV_PLANNING';
    } else if (
      text.includes('quality') || text.includes('score') || text.includes('gqi') ||
      text.includes('गुणवत्ता') || text.includes('स्कोर')
    ) {
      matchedAction = 'NAV_QUALITY';
    } else if (
      text.includes('heal') || text.includes('timeline') || text.includes('risk') || text.includes('monitor') ||
      text.includes('उपचार') || text.includes('निगरानी') || text.includes('जोखिम')
    ) {
      matchedAction = 'NAV_HEALING';
    } else if (
      text.includes('advisory') || text.includes('chamber') || text.includes('report') || text.includes('advice') ||
      text.includes('सलाह') || text.includes('परामर्श') || text.includes('कक्ष')
    ) {
      matchedAction = 'NAV_ADVISORY';
    } else if (
      text.includes('speak') || text.includes('read') || text.includes('tell') ||
      text.includes('सुनाएं') || text.includes('पढ़ो') || text.includes('बोलो')
    ) {
      matchedAction = 'TRIGGER_SPEAK_SUMMARY';
    } else if (
      text.includes('contrast') || text.includes('high contrast') || text.includes('कंट्रास्ट')
    ) {
      matchedAction = 'TOGGLE_CONTRAST';
    } else if (
      text.includes('bigger') || text.includes('large text') || text.includes('font') ||
      text.includes('बड़ा') || text.includes('अक्षर')
    ) {
      matchedAction = 'TOGGLE_LARGE_FONT';
    } else if (
      text.includes('next') || text.includes('forward') || text.includes('आगे') || text.includes('अगला')
    ) {
      matchedAction = 'ACTION_NEXT';
    } else if (
      text.includes('back') || text.includes('previous') || text.includes('पीछे') || text.includes('वापस')
    ) {
      matchedAction = 'ACTION_BACK';
    } else if (
      text.includes('assess') || text.includes('evaluate') || text.includes('measure') || text.includes('ready') ||
      text.includes('मापो') || text.includes('तैयार')
    ) {
      matchedAction = 'ACTION_EVALUATE';
    }

    if (this.onCommandCallback) {
      this.onCommandCallback(rawTranscript, matchedAction);
    }
  }

  // Text-To-Speech with Hindi & English voice selection
  // CRITICAL: If audio is turned off, this strictly returns without playing any voice sound!
  public speak(text: string, onEnd?: () => void) {
    if (!this.isAudioEnabled) {
      if (onEnd) onEnd();
      return;
    }

    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = this.speechRate;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      utterance.lang = this.currentLanguage === 'hi' ? 'hi-IN' : 'en-US';

      // Pick localized voice if available
      const voices = window.speechSynthesis.getVoices();
      if (this.currentLanguage === 'hi') {
        const hindiVoice = voices.find(v => v.lang.startsWith('hi'));
        if (hindiVoice) utterance.voice = hindiVoice;
      } else {
        const engVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha')));
        if (engVoice) utterance.voice = engVoice;
      }

      if (onEnd) {
        utterance.onend = onEnd;
      }

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
    }
  }

  public stopSpeaking() {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }
}

export const voiceService = new VoiceService();
