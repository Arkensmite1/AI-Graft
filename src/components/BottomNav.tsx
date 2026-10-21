import React from 'react';
import { Camera, Scissors, Award, Clock, FileBarChart } from 'lucide-react';
import { Language, TRANSLATIONS } from '../i18n/translations';

export type TabKey = 'intake' | 'planning' | 'quality' | 'healing' | 'advisory';

interface BottomNavProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  highContrast: boolean;
  language: Language;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  highContrast,
  language
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const NAV_ITEMS = [
    { key: 'intake' as TabKey, srsCode: 'FR-1', label: t.tabIntake, icon: Camera },
    { key: 'planning' as TabKey, srsCode: 'FR-2', label: t.tabPlanning, icon: Scissors },
    { key: 'quality' as TabKey, srsCode: 'FR-3', label: t.tabQuality, icon: Award },
    { key: 'healing' as TabKey, srsCode: 'FR-4', label: t.tabHealing, icon: Clock },
    { key: 'advisory' as TabKey, srsCode: 'FR-5', label: t.tabAdvisory, icon: FileBarChart },
  ];

  return (
    <nav 
      aria-label="Workflow Navigation"
      className={`fixed bottom-0 left-0 right-0 z-40 border-t ${
        highContrast
          ? 'bg-stone-950 border-amber-400 text-stone-100'
          : 'bg-[#faf9f6] border-stone-300 text-stone-700 shadow-sm'
      }`}
    >
      <div className="max-w-4xl mx-auto grid grid-cols-5 h-16">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.key;

          return (
            <button
              key={item.key}
              onClick={() => onTabChange(item.key)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex flex-col items-center justify-center py-1 px-0.5 transition-colors relative border-r last:border-r-0 ${
                highContrast
                  ? 'border-stone-800'
                  : 'border-stone-200'
              } ${
                isActive
                  ? highContrast
                    ? 'bg-amber-400 text-stone-950 font-black'
                    : 'bg-[#eef4ee] text-[#143d26] font-extrabold border-b-2 border-b-[#143d26]'
                  : highContrast
                  ? 'text-amber-200/70 hover:text-amber-300 hover:bg-stone-900'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Icon className="w-4 h-4 mb-1" />
              
              <span className="text-[11px] leading-tight text-center tracking-tight truncate w-full px-0.5 font-medium">
                {item.label}
              </span>
              <span className={`text-[9px] font-mono tracking-wider ${
                isActive 
                  ? highContrast ? 'text-stone-900 font-bold' : 'text-[#18482d] font-bold' 
                  : 'opacity-50'
              }`}>
                {item.srsCode}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
