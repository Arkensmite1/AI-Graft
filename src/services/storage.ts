import {
  Batch,
  GraftPair,
  GraftRecord,
  HealingDayLog,
  Seedling
} from '../types/graft';
import {
  SAMPLE_BATCHES,
  SAMPLE_GRAFT_PAIRS,
  SAMPLE_GRAFT_RECORDS,
  SAMPLE_HEALING_LOGS,
  SAMPLE_SEEDLINGS
} from '../data/mockData';

const STORAGE_KEYS = {
  BATCHES: 'ai_graft_batches_v2',
  SEEDLINGS: 'ai_graft_seedlings_v2',
  PAIRS: 'ai_graft_pairs_v2',
  RECORDS: 'ai_graft_records_v2',
  HEALING: 'ai_graft_healing_v2',
  SETTINGS: 'ai_graft_settings_v2',
};

import { Language } from '../i18n/translations';

export interface AppSettings {
  language: Language;
  highContrast: boolean;
  fontSize: 'normal' | 'large' | 'xlarge';
  voiceFeedbackEnabled: boolean;
  voiceDictationEnabled: boolean;
  selectedBatchId: string;
}

export function loadBatches(): Batch[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BATCHES);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn(e);
  }
  localStorage.setItem(STORAGE_KEYS.BATCHES, JSON.stringify(SAMPLE_BATCHES));
  return SAMPLE_BATCHES;
}

export function saveBatches(batches: Batch[]) {
  localStorage.setItem(STORAGE_KEYS.BATCHES, JSON.stringify(batches));
}

export function loadSeedlings(): Seedling[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SEEDLINGS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn(e);
  }
  localStorage.setItem(STORAGE_KEYS.SEEDLINGS, JSON.stringify(SAMPLE_SEEDLINGS));
  return SAMPLE_SEEDLINGS;
}

export function saveSeedlings(seedlings: Seedling[]) {
  localStorage.setItem(STORAGE_KEYS.SEEDLINGS, JSON.stringify(seedlings));
}

export function loadGraftPairs(): GraftPair[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PAIRS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn(e);
  }
  localStorage.setItem(STORAGE_KEYS.PAIRS, JSON.stringify(SAMPLE_GRAFT_PAIRS));
  return SAMPLE_GRAFT_PAIRS;
}

export function saveGraftPairs(pairs: GraftPair[]) {
  localStorage.setItem(STORAGE_KEYS.PAIRS, JSON.stringify(pairs));
}

export function loadGraftRecords(): GraftRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RECORDS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn(e);
  }
  localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(SAMPLE_GRAFT_RECORDS));
  return SAMPLE_GRAFT_RECORDS;
}

export function saveGraftRecords(records: GraftRecord[]) {
  localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(records));
}

export function loadHealingLogs(): HealingDayLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HEALING);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn(e);
  }
  localStorage.setItem(STORAGE_KEYS.HEALING, JSON.stringify(SAMPLE_HEALING_LOGS));
  return SAMPLE_HEALING_LOGS;
}

export function saveHealingLogs(logs: HealingDayLog[]) {
  localStorage.setItem(STORAGE_KEYS.HEALING, JSON.stringify(logs));
}

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn(e);
  }
  const defaultSettings: AppSettings = {
    language: 'en',
    highContrast: false,
    fontSize: 'normal',
    voiceFeedbackEnabled: true,
    voiceDictationEnabled: true,
    selectedBatchId: 'batch-tomato-01',
  };
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(defaultSettings));
  return defaultSettings;
}

export function saveSettings(settings: AppSettings) {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

export function exportResearchDataJSON(): string {
  const data = {
    metadata: {
      appName: 'AI-GRAFT',
      version: 'prototype-release',
      exportTimestamp: new Date().toISOString(),
      standardsCompliance: 'SRS FR-1 to FR-5',
    },
    batches: loadBatches(),
    seedlings: loadSeedlings(),
    graftPairs: loadGraftPairs(),
    graftRecords: loadGraftRecords(),
    healingLogs: loadHealingLogs(),
  };
  return JSON.stringify(data, null, 2);
}

export function exportResearchDataCSV(): string {
  const records = loadGraftRecords();
  const headers = [
    'PlantTag',
    'BatchId',
    'RootstockId',
    'ScionId',
    'RootstockVariety',
    'ScionVariety',
    'GraftDate',
    'Operator',
    'Technique',
    'ClipType',
    'GQIScore',
    'GQITier',
    'DiameterMatchPct',
    'VascularAlignmentPct',
    'CutCoplanarityPct',
    'ClipSeatingPct',
    'FinalOutcome',
  ];

  const rows = records.map(r => [
    r.plantTag,
    r.batchId,
    r.rootstockId,
    r.scionId,
    `"${r.rootstockVariety}"`,
    `"${r.scionVariety}"`,
    r.graftDate,
    `"${r.operatorName}"`,
    `"${r.technique}"`,
    `"${r.clipType}"`,
    r.gqiScore,
    r.gqiTier,
    r.components.diameterMatchPct,
    r.components.vascularAlignmentPct,
    r.components.cutCoplanarityPct,
    r.components.clipSeatingPct,
    r.outcome,
  ]);

  return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
}

export function resetAllData() {
  localStorage.removeItem(STORAGE_KEYS.BATCHES);
  localStorage.removeItem(STORAGE_KEYS.SEEDLINGS);
  localStorage.removeItem(STORAGE_KEYS.PAIRS);
  localStorage.removeItem(STORAGE_KEYS.RECORDS);
  localStorage.removeItem(STORAGE_KEYS.HEALING);
}
