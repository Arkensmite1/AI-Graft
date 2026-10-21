import React from 'react';
import { X, CheckCircle2, Cpu, FileText } from 'lucide-react';
import { Language } from '../i18n/translations';

interface SRSModalProps {
  isOpen: boolean;
  onClose: () => void;
  highContrast: boolean;
  language: Language;
}

export const SRSModal: React.FC<SRSModalProps> = ({ isOpen, onClose, highContrast, language }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/80 backdrop-blur-xs animate-fade-in">
      <div className={`w-full max-w-2xl border-2 p-5 shadow-xl max-h-[92vh] overflow-y-auto ${
        highContrast
          ? 'bg-stone-950 text-amber-300 border-amber-400'
          : 'bg-[#faf9f6] text-stone-900 border-stone-400'
      }`}>
        {/* Header - Zero-Pill Clean Layout */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-300 dark:border-amber-400/40">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#183625] dark:text-amber-400 uppercase tracking-wider">
                AI-GRAFT · SRS Compliance
              </span>
            </div>
            <h2 className="text-lg font-bold tracking-tight mt-0.5">
              {language === 'hi' ? 'एसआरएस आवश्यकता पूर्ति मैट्रिक्स (SRS Matrix)' : 'Software Requirements Compliance Matrix'}
            </h2>
            <p className="text-xs text-stone-500 dark:text-amber-200/70">
              {language === 'hi' ? 'प्लांट डिजीज डिटेक्शन प्रारूप अनुसार 5 शीर्ष-स्तरीय आवश्यकताएं' : '5 Top-Level Functional Requirements (FR-1 to FR-5)'}
            </p>
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

        {/* Core Proposition & Boundaries */}
        <div className={`my-4 p-3 border text-xs leading-relaxed ${
          highContrast ? 'bg-stone-900 border-amber-400/80 text-amber-200' : 'bg-white border-stone-300 text-stone-900'
        }`}>
          <div className="font-bold text-xs uppercase mb-1 flex items-center gap-1.5 text-[#183625] dark:text-amber-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 dark:text-emerald-400 inline" />
            {language === 'hi' ? 'प्रस्ताव एवं सीमाएं (SRS Section 1.4 & 6.0)' : 'Project Proposition & Boundaries (SRS Section 1.4 & 6.0)'}
          </div>
          <p className="opacity-90 leading-relaxed">
            {language === 'hi'
              ? 'एआई-ग्राफ्ट साधारण स्मार्टफोन/वेबकैम तस्वीरों और 20 मिमी मुद्रित संदर्भ मार्कर का उपयोग करके पौध का मूल्यांकन करता है, ऑपरेटर को कटाई का मार्गदर्शन देता है, ग्राफ्ट गुणवत्ता स्कोर करता है और उपचार की सलाह देता है।'
              : 'AI-GRAFT uses ordinary smartphone/webcam photographs and a 20mm printed reference marker to assess seedlings, guide human grafting operators, score graft quality (GQI), monitor healing, and provide bounded healing advice.'}
          </p>
          <div className="mt-2 font-mono text-[11px] opacity-90 border-t border-stone-200 dark:border-stone-800 pt-1.5">
            <strong>Scope Boundary:</strong> No robot actuators, thermal cameras, force sensors, or automatic chamber controls are used. Human operators perform all physical cuts and clip attachments.
          </div>
        </div>

        {/* 5 Functional Requirements */}
        <div className="space-y-2.5">
          <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-amber-200 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-emerald-700 dark:text-amber-400" />
            Top-Level Requirements (FR-1 to FR-5)
          </h3>

          <div className="space-y-2 text-xs">
            <div className={`p-3 border ${highContrast ? 'border-amber-400 bg-stone-900' : 'border-stone-200 bg-white'}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-[#183625] dark:text-amber-300 font-mono">
                  FR-1 / Must: Seedling Intake, Calibration & Assessment
                </span>
                <span className="font-mono text-[10px] text-emerald-700 dark:text-emerald-400 font-bold">✓ Satisfied</span>
              </div>
              <p className="text-stone-600 dark:text-amber-200/80 leading-relaxed">
                Batch creation, cultivar metadata, 20mm fiducial marker scale calibration, stem diameter & hypocotyl measurement, readiness classification (Ready, Too Slender, Overgrown), and uncertainty-aware abstention on blur and tilt.
              </p>
            </div>

            <div className={`p-3 border ${highContrast ? 'border-amber-400 bg-stone-900' : 'border-stone-200 bg-white'}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-[#183625] dark:text-amber-300 font-mono">
                  FR-2 / Must: Graft Planning & Decision Support
                </span>
                <span className="font-mono text-[10px] text-emerald-700 dark:text-emerald-400 font-bold">✓ Satisfied</span>
              </div>
              <p className="text-stone-600 dark:text-amber-200/80 leading-relaxed">
                Rootstock–scion pairing via stem diameter differentials (&lt;0.2mm match), 45-degree angle cutting guidance, clip caliber sizing (2.0mm / 2.5mm), and explicit human advisory labels.
              </p>
            </div>

            <div className={`p-3 border ${highContrast ? 'border-amber-400 bg-stone-900' : 'border-stone-200 bg-white'}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-[#183625] dark:text-amber-300 font-mono">
                  FR-3 / Must: Graft Quality Scoring (GQI) & Lifecycle Record
                </span>
                <span className="font-mono text-[10px] text-emerald-700 dark:text-emerald-400 font-bold">✓ Satisfied</span>
              </div>
              <p className="text-stone-600 dark:text-amber-200/80 leading-relaxed">
                Calculates Graft Quality Index (0-100) combining diameter match, vascular alignment, cut coplanarity, and clip seating. Links pre/post images, operator overrides, and eventual survival outcomes into one permanent plant tag record.
              </p>
            </div>

            <div className={`p-3 border ${highContrast ? 'border-amber-400 bg-stone-900' : 'border-stone-200 bg-white'}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-[#183625] dark:text-amber-300 font-mono">
                  FR-4 / Must: Time-Lapse Healing & Failure Prediction
                </span>
                <span className="font-mono text-[10px] text-emerald-700 dark:text-emerald-400 font-bold">✓ Satisfied</span>
              </div>
              <p className="text-stone-600 dark:text-amber-200/80 leading-relaxed">
                Dated time-lapse photographs (Days 1, 3, 5, 7, 10, 14), biological stage indicators (Pectin secretion, Callus proliferation, Vascular bridge), failure risk estimation with uncertainty confidence bounds, and early pathology alerts (adventitious roots, necrosis).
              </p>
            </div>

            <div className={`p-3 border ${highContrast ? 'border-amber-400 bg-stone-900' : 'border-stone-200 bg-white'}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-[#183625] dark:text-amber-300 font-mono">
                  FR-5 / Must: Healing Advisory & Research Reporting
                </span>
                <span className="font-mono text-[10px] text-emerald-700 dark:text-emerald-400 font-bold">✓ Satisfied</span>
              </div>
              <p className="text-stone-600 dark:text-amber-200/80 leading-relaxed">
                Evidence-bounded non-actuating chamber recommendations (RH% taper 98%→65%, 22-25°C, photoperiod progression), label corrections, and full research dataset exports in JSON and CSV format.
              </p>
            </div>
          </div>
        </div>

        {/* Non-Functional Highlights */}
        <div className="mt-4 pt-3 border-t border-stone-300 dark:border-amber-400/40 text-xs">
          <div className="font-bold mb-1 flex items-center gap-1.5 font-mono text-stone-700 dark:text-amber-300">
            <Cpu className="w-4 h-4 text-stone-600 dark:text-amber-400" />
            Non-Functional Requirements (NFR-1 to NFR-5)
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-stone-600 dark:text-amber-200/80 text-[11px]">
            <li>· <strong>NFR-1 (Response):</strong> Sub-second local client measurement calculation.</li>
            <li>· <strong>NFR-3 (Abstention):</strong> Blurry or out-of-plane images return clear warnings.</li>
            <li>· <strong>NFR-4 (Data Integrity):</strong> Plant tags, batches, and GQI linked via LocalStorage.</li>
            <li>· <strong>NFR-5 (Usability):</strong> Bilingual Hindi & English voice commands & high contrast mode.</li>
          </ul>
        </div>

        {/* Close Button */}
        <div className="mt-4 pt-3 border-t border-stone-300 dark:border-amber-400/40 flex justify-end">
          <button
            onClick={onClose}
            className={`px-4 py-1.5 font-bold text-xs border ${
              highContrast ? 'bg-amber-400 text-stone-950 border-amber-300' : 'bg-stone-800 text-white border-stone-900'
            }`}
          >
            {language === 'hi' ? 'बंद करें' : 'Close Matrix'}
          </button>
        </div>
      </div>
    </div>
  );
};
