import React from 'react';
import { X, HelpCircle, Camera, Mic, WifiOff, Scissors } from 'lucide-react';
import { Language } from '../i18n/translations';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  highContrast: boolean;
  language: Language;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose, highContrast, language }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/80 backdrop-blur-xs animate-fade-in">
      <div className={`w-full max-w-lg border-2 p-5 shadow-xl max-h-[90vh] overflow-y-auto ${
        highContrast
          ? 'bg-stone-950 text-amber-300 border-amber-400'
          : 'bg-[#faf9f6] text-stone-900 border-stone-400'
      }`}>
        <div className="flex items-center justify-between pb-3 border-b border-stone-300 dark:border-amber-400/40">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 border ${highContrast ? 'bg-amber-400 text-stone-950 border-amber-300' : 'bg-[#183625] text-stone-100 border-[#0d2116]'}`}>
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">
                {language === 'hi' ? 'किसान एवं ऑपरेटर मार्गदर्शिका' : 'Farmer & Field Operator Guide'}
              </h2>
              <p className="text-xs text-stone-500 dark:text-amber-200/70">
                {language === 'hi' ? 'एआई-ग्राफ्ट का उपयोग करने के सरल निर्देश' : 'Clear field instructions for tomato grafting'}
              </p>
            </div>
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

        <div className="space-y-3 my-4 text-xs">
          {/* Step 1 */}
          <div className={`p-3 border ${highContrast ? 'bg-stone-900 border-amber-400/50' : 'bg-white border-stone-200'}`}>
            <div className="font-bold text-xs flex items-center gap-2 text-[#183625] dark:text-amber-300 mb-1">
              <Camera className="w-4 h-4" />
              <span>{language === 'hi' ? '1. 20 मिमी संदर्भ मार्कर के साथ फोटो कैसे लें' : '1. Capturing Seedlings (20mm Reference Marker)'}</span>
            </div>
            <p className="text-stone-600 dark:text-amber-200/80 leading-relaxed">
              {language === 'hi'
                ? 'मुद्रित 20 मिलीमीटर काले-सफेद चौकोर मार्कर को पौधे के तने के पास मिट्टी पर रखें। मोबाइल को सीधा और समतल रखकर फोटो लें ताकि तना और मार्कर दोनों स्पष्ट दिखें।'
                : 'Place the printed 20mm square reference marker on the soil surface next to the seedling stem. Hold the phone camera flat and upright so the stem and marker are both in focus.'}
            </p>
          </div>

          {/* Step 2 */}
          <div className={`p-3 border ${highContrast ? 'bg-stone-900 border-amber-400/50' : 'bg-white border-stone-200'}`}>
            <div className="font-bold text-xs flex items-center gap-2 text-[#183625] dark:text-amber-300 mb-1">
              <Mic className="w-4 h-4" />
              <span>{language === 'hi' ? '2. हाथों-मुक्त आवाज़ आदेश (Voice Commands)' : '2. Hands-Free Voice Commands'}</span>
            </div>
            <p className="text-stone-600 dark:text-amber-200/80 leading-relaxed">
              {language === 'hi'
                ? 'दस्ताने पहने हों तो ऊपर दिए गए पीले "आवाज़" बटन को दबाएं। बोलें "पौध जांच", "जोड़ी बनाएं", "गुणवत्ता", "उपचार" या "सुनाएं"। ऐप स्क्रीन को छुए बिना खुद काम करेगा।'
                : 'When wearing grafting gloves, tap the "Voice" button in the header. Say "Seedling Intake", "Check Readiness", "Pair Plants", or "Speak Summary". The app will navigate and announce results out loud.'}
            </p>
          </div>

          {/* Step 3 */}
          <div className={`p-3 border ${highContrast ? 'bg-stone-900 border-amber-400/50' : 'bg-white border-stone-200'}`}>
            <div className="font-bold text-xs flex items-center gap-2 text-[#183625] dark:text-amber-300 mb-1">
              <Scissors className="w-4 h-4" />
              <span>{language === 'hi' ? '3. 45-डिग्री कोण पर तिरछी कटाई' : '3. Making the 45-Degree Cut'}</span>
            </div>
            <p className="text-stone-600 dark:text-amber-200/80 leading-relaxed">
              {language === 'hi'
                ? 'ब्लेड को अल्कोहल से साफ करें। मूलवृंत और सायन को 45 डिग्री कोण पर एक ही झटके में काटें। सुझाई गई 2.0 मिमी सिलिकॉन क्लिप लगाकर कटे भागों को आपस में सटा दें।'
                : 'Use a sterile razor blade. Slice rootstock and scion at identical 45-degree angles. Slide the recommended silicone clip (2.0mm or 2.5mm) over the rootstock and join the cut faces flush.'}
            </p>
          </div>

          {/* Step 4 */}
          <div className={`p-3 border ${highContrast ? 'bg-stone-900 border-amber-400/50' : 'bg-white border-stone-200'}`}>
            <div className="font-bold text-xs flex items-center gap-2 text-[#183625] dark:text-amber-300 mb-1">
              <WifiOff className="w-4 h-4" />
              <span>{language === 'hi' ? '4. 100% ऑफ़लाइन कार्यप्रणाली' : '4. 100% Offline Capability'}</span>
            </div>
            <p className="text-stone-600 dark:text-amber-200/80 leading-relaxed">
              {language === 'hi'
                ? 'सभी तस्वीरें, पौधे के टैग, GQI स्कोर और उपचार के रिकॉर्ड आपके फोन में सुरक्षित रहते हैं। बिना इंटरनेट के भी ग्रीनहाउस या खेत में काम किया जा सकता है।'
                : 'All plant tags, measurements, GQI scores, and photos are saved in your device browser storage. You can work inside metal-frame greenhouses or remote fields without internet.'}
            </p>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-stone-300 dark:border-amber-400/40 flex justify-end">
          <button
            onClick={onClose}
            className={`px-4 py-1.5 font-bold text-xs border ${
              highContrast ? 'bg-amber-400 text-stone-950 border-amber-300' : 'bg-stone-800 text-white border-stone-900'
            }`}
          >
            {language === 'hi' ? 'समझ गए' : 'Got It'}
          </button>
        </div>
      </div>
    </div>
  );
};
