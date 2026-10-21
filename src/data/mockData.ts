import { Batch, ChamberCondition, GraftPair, GraftRecord, HealingDayLog, Seedling } from '../types/graft';

export const SAMPLE_BATCHES: Batch[] = [
  {
    id: 'batch-tomato-01',
    name: 'Batch 2026-T01 (Spring Commercial)',
    crop: 'Tomato',
    rootstockVariety: 'Maxifort F1',
    scionVariety: 'San Marzano',
    sowingDate: '2026-10-01',
    seedlingCount: 24,
    operator: 'Maria Santos (Senior Grafter)',
  },
  {
    id: 'batch-tomato-02',
    name: 'Batch 2026-T02 (Heirloom Evaluation)',
    crop: 'Tomato',
    rootstockVariety: 'Beaufort F1',
    scionVariety: 'Cherokee Purple',
    sowingDate: '2026-10-04',
    seedlingCount: 18,
    operator: 'J. Henderson',
  },
  {
    id: 'batch-cucurbit-03',
    name: 'Batch 2026-C03 (Trial Extensible)',
    crop: 'Cucumber',
    rootstockVariety: 'Shintoza (Squash hybrid)',
    scionVariety: 'Marketmore 76',
    sowingDate: '2026-10-10',
    seedlingCount: 12,
    operator: 'Maria Santos',
  },
];

// Helper to generate visual SVG seedling data URLs
export function generateSeedlingSvg(
  type: 'rootstock' | 'scion' | 'grafted' | 'blurred' | 'tilted',
  diameterMm: number,
  healthState: 'healthy' | 'slender' | 'wilted' | 'callused' | 'rooting' = 'healthy'
): string {
  const stemWidth = Math.max(8, Math.min(24, Math.round(diameterMm * 7)));
  const stemColor = healthState === 'wilted' ? '#8d7b4c' : healthState === 'rooting' ? '#5a823b' : '#3e8932';
  const leafColor = healthState === 'wilted' ? '#949c54' : '#228b22';

  let filter = '';
  if (type === 'blurred') {
    filter = `<filter id="blur"><feGaussianBlur stdDeviation="6" /></filter>`;
  }

  const transform = type === 'tilted' ? 'transform="rotate(24 100 130)"' : '';
  const filterAttr = type === 'blurred' ? 'filter="url(#blur)"' : '';

  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="320" viewBox="0 0 200 240">
    <defs>
      ${filter}
      <pattern id="soil" width="10" height="10" patternUnits="userSpaceOnUse">
        <rect width="10" height="10" fill="%234a3525"/>
        <circle cx="2" cy="2" r="1" fill="%2338271a"/>
        <circle cx="7" cy="7" r="1.5" fill="%232b1d13"/>
      </pattern>
    </defs>
    <!-- Background Neutral Grid for calibration inspection -->
    <rect width="200" height="240" fill="%23f4f6f0"/>
    <line x1="20" y1="0" x2="20" y2="240" stroke="%23e2e8f0" stroke-width="0.5"/>
    <line x1="180" y1="0" x2="180" y2="240" stroke="%23e2e8f0" stroke-width="0.5"/>
    <line x1="0" y1="60" x2="200" y2="60" stroke="%23e2e8f0" stroke-width="0.5"/>
    <line x1="0" y1="180" x2="200" y2="180" stroke="%23e2e8f0" stroke-width="0.5"/>

    <!-- Reference 20mm Fiducial Marker on Top-Left -->
    <g transform="translate(14, 16)">
      <rect x="0" y="0" width="36" height="36" fill="%23111827" stroke="%23ffffff" stroke-width="1.5"/>
      <rect x="6" y="6" width="24" height="24" fill="%23ffffff"/>
      <rect x="10" y="10" width="16" height="16" fill="%23111827"/>
      <rect x="14" y="14" width="8" height="8" fill="%23ffffff"/>
      <text x="18" y="46" font-size="8" font-family="sans-serif" font-weight="bold" fill="%23374151" text-anchor="middle">20mm REF</text>
    </g>

    <!-- Substrate / Pot Level -->
    <rect x="25" y="195" width="150" height="40" fill="url(%23soil)" rx="3"/>
    <rect x="20" y="190" width="160" height="8" fill="%2385583f" rx="2"/>

    <!-- Plant Group -->
    <g ${transform} ${filterAttr}>
      <!-- Main Hypocotyl Stem -->
      <rect x="${100 - stemWidth / 2}" y="70" width="${stemWidth}" height="122" rx="3" fill="${stemColor}" stroke="%231e3a12" stroke-width="1.5"/>
      
      <!-- Cotyledon Leaves -->
      <path d="M ${100 - stemWidth / 2} 75 C 60 65, 45 40, 30 55 C 38 78, 70 82, ${100 - stemWidth / 2} 80 Z" fill="${leafColor}" stroke="%23166534" stroke-width="1.5"/>
      <path d="M ${100 + stemWidth / 2} 75 C 140 65, 155 40, 170 55 C 162 78, 130 82, ${100 + stemWidth / 2} 80 Z" fill="${leafColor}" stroke="%23166534" stroke-width="1.5"/>

      <!-- True leaf bud in center -->
      <path d="M 98 70 C 90 45, 96 35, 100 30 C 104 35, 110 45, 102 70 Z" fill="%234ade80" stroke="%2315803d" stroke-width="1"/>

      ${
        type === 'grafted'
          ? `<!-- Graft Union & Transparent Silicone Clip -->
             <line x1="${100 - stemWidth / 2 - 4}" y1="125" x2="${100 + stemWidth / 2 + 4}" y2="135" stroke="%23ef4444" stroke-width="2.5" stroke-dasharray="2 1"/>
             <rect x="${100 - stemWidth / 2 - 7}" y="118" width="${stemWidth + 14}" height="22" rx="4" fill="rgba(56, 189, 248, 0.45)" stroke="%230284c7" stroke-width="2"/>
             <circle cx="${100 + stemWidth / 2 + 2}" cy="129" r="3.5" fill="%230284c7"/>`
          : ''
      }

      ${
        healthState === 'callused'
          ? `<!-- Callus Bridge Cells -->
             <ellipse cx="100" cy="129" rx="${stemWidth / 2 + 3}" ry="4" fill="%23a3e635" opacity="0.8"/>`
          : ''
      }

      ${
        healthState === 'rooting'
          ? `<!-- Undesirable Adventitious Root from Scion -->
             <path d="M ${100 + stemWidth / 2} 112 Q 130 115 135 130" stroke="%23eab308" stroke-width="3" fill="none" stroke-linecap="round"/>
             <circle cx="135" cy="130" r="2" fill="%23ca8a04"/>`
          : ''
      }
    </g>

    <!-- Calibrated Dimension Markers Overlay -->
    <g>
      <line x1="80" y1="130" x2="70" y2="130" stroke="%232563eb" stroke-width="1.5"/>
      <line x1="120" y1="130" x2="130" y2="130" stroke="%232563eb" stroke-width="1.5"/>
      <rect x="74" y="140" width="52" height="16" fill="%231e3a8a" rx="3"/>
      <text x="100" y="151" font-size="9" font-family="sans-serif" font-weight="bold" fill="%23ffffff" text-anchor="middle">Ø ${diameterMm.toFixed(2)} mm</text>
    </g>
  </svg>`;
}

export const SAMPLE_SEEDLINGS: Seedling[] = [
  {
    id: 'seedling-r01',
    tag: 'MAXI-R01',
    batchId: 'batch-tomato-01',
    crop: 'Tomato',
    variety: 'Maxifort F1',
    role: 'rootstock',
    stemDiameterMm: 2.12,
    hypocotylHeightMm: 46.5,
    cotyledonHeightMm: 38.0,
    straightnessPct: 97.4,
    readinessVerdict: 'READY',
    confidencePct: 96.8,
    markerCalibrated: true,
    markerScaleMmPerPx: 0.114,
    imageQualityScore: 95,
    imageUrl: generateSeedlingSvg('rootstock', 2.12, 'healthy'),
    captureDate: '2026-10-21 09:15',
    notes: 'Optimal vigorous hypocotyl, uniform round stem.',
  },
  {
    id: 'seedling-s01',
    tag: 'SANM-S01',
    batchId: 'batch-tomato-01',
    crop: 'Tomato',
    variety: 'San Marzano',
    role: 'scion',
    stemDiameterMm: 2.08,
    hypocotylHeightMm: 42.0,
    cotyledonHeightMm: 34.5,
    straightnessPct: 94.2,
    readinessVerdict: 'READY',
    confidencePct: 95.1,
    markerCalibrated: true,
    markerScaleMmPerPx: 0.114,
    imageQualityScore: 92,
    imageUrl: generateSeedlingSvg('scion', 2.08, 'healthy'),
    captureDate: '2026-10-21 09:20',
    notes: 'Crisp green turgor, ideal scion stem caliber.',
  },
  {
    id: 'seedling-r02',
    tag: 'MAXI-R02',
    batchId: 'batch-tomato-01',
    crop: 'Tomato',
    variety: 'Maxifort F1',
    role: 'rootstock',
    stemDiameterMm: 1.35,
    hypocotylHeightMm: 32.0,
    cotyledonHeightMm: 26.0,
    straightnessPct: 88.0,
    readinessVerdict: 'TOO_SLENDER',
    confidencePct: 93.0,
    markerCalibrated: true,
    markerScaleMmPerPx: 0.114,
    imageQualityScore: 90,
    imageUrl: generateSeedlingSvg('rootstock', 1.35, 'slender'),
    captureDate: '2026-10-21 09:25',
    notes: 'Stem below 1.6mm threshold; requires 2-3 more days in nursery.',
    abstentionReason: 'Stem caliber < 1.6 mm minimum for standard 2.0mm clip grip.',
  },
  {
    id: 'seedling-s02',
    tag: 'SANM-S02',
    batchId: 'batch-tomato-01',
    crop: 'Tomato',
    variety: 'San Marzano',
    role: 'scion',
    stemDiameterMm: 2.95,
    hypocotylHeightMm: 62.0,
    cotyledonHeightMm: 49.0,
    straightnessPct: 82.5,
    readinessVerdict: 'OVERGROWN',
    confidencePct: 94.0,
    markerCalibrated: true,
    markerScaleMmPerPx: 0.114,
    imageQualityScore: 91,
    imageUrl: generateSeedlingSvg('scion', 2.95, 'healthy'),
    captureDate: '2026-10-21 09:30',
    notes: 'Stem too thick for standard clip; excessive pith development.',
    abstentionReason: 'Diameter exceeds 2.8 mm maximum limit for splice clips.',
  },
  {
    id: 'seedling-r03',
    tag: 'MAXI-R03-BLUR',
    batchId: 'batch-tomato-01',
    crop: 'Tomato',
    variety: 'Maxifort F1',
    role: 'rootstock',
    stemDiameterMm: 0,
    hypocotylHeightMm: 0,
    cotyledonHeightMm: 0,
    straightnessPct: 0,
    readinessVerdict: 'ABSTAIN_BLURRED',
    confidencePct: 24.0,
    markerCalibrated: false,
    markerScaleMmPerPx: 0,
    imageQualityScore: 32,
    imageUrl: generateSeedlingSvg('blurred', 2.0, 'healthy'),
    captureDate: '2026-10-21 09:35',
    notes: 'Severe motion blur detected in camera frame.',
    abstentionReason: 'Laplacian variance check failed (blur score 32/100). Recapture required per NFR-3.',
  },
  {
    id: 'seedling-s03',
    tag: 'SANM-S03-TILT',
    batchId: 'batch-tomato-01',
    crop: 'Tomato',
    variety: 'San Marzano',
    role: 'scion',
    stemDiameterMm: 1.95,
    hypocotylHeightMm: 40.0,
    cotyledonHeightMm: 33.0,
    straightnessPct: 58.0,
    readinessVerdict: 'ABSTAIN_OUT_OF_PLANE',
    confidencePct: 48.0,
    markerCalibrated: true,
    markerScaleMmPerPx: 0.114,
    imageQualityScore: 68,
    imageUrl: generateSeedlingSvg('tilted', 1.95, 'healthy'),
    captureDate: '2026-10-21 09:40',
    notes: 'Plant stem leans >20° out of focal plane.',
    abstentionReason: 'SRS 2.5 Constraint: Single-view RGB requires in-plane stem. Out-of-plane tilt flagged to prevent biased diameter measurement.',
  },
];

export const SAMPLE_GRAFT_PAIRS: GraftPair[] = [
  {
    id: 'pair-01',
    rootstockId: 'seedling-r01',
    scionId: 'seedling-s01',
    rootstockTag: 'MAXI-R01',
    scionTag: 'SANM-S01',
    rootstockDiameterMm: 2.12,
    scionDiameterMm: 2.08,
    diameterDiffMm: 0.04,
    matchScorePct: 98.1,
    matchQuality: 'OPTIMAL',
    recommendedCutAngleDeg: 45,
    recommendedCutHeightMm: 18.0,
    clipSizeMm: 2.0,
    confidencePct: 96.5,
    notes: 'Differential <0.10mm is top-tier match. Cambium rings will align cleanly.',
  },
  {
    id: 'pair-02',
    rootstockId: 'seedling-r01',
    scionId: 'seedling-s02',
    rootstockTag: 'MAXI-R01',
    scionTag: 'SANM-S02',
    rootstockDiameterMm: 2.12,
    scionDiameterMm: 2.95,
    diameterDiffMm: 0.83,
    matchScorePct: 42.0,
    matchQuality: 'POOR',
    recommendedCutAngleDeg: 45,
    recommendedCutHeightMm: 20.0,
    clipSizeMm: 2.5,
    confidencePct: 54.0,
    notes: 'Large caliber mismatch (0.83mm). Severe risk of partial contact and desiccation.',
  },
];

export const SAMPLE_GRAFT_RECORDS: GraftRecord[] = [
  {
    id: 'graft-rec-101',
    plantTag: 'TOM-GRAFT-101',
    batchId: 'batch-tomato-01',
    rootstockId: 'seedling-r01',
    scionId: 'seedling-s01',
    rootstockVariety: 'Maxifort F1',
    scionVariety: 'San Marzano',
    graftDate: '2026-10-14 10:30',
    operatorName: 'Maria Santos',
    technique: 'Splice Graft (45° Single Slant Cut)',
    clipType: '2.0mm Clear Silicone Clip',
    gqiScore: 94,
    gqiTier: 'A',
    components: {
      diameterMatchPct: 98,
      vascularAlignmentPct: 95,
      cutCoplanarityPct: 92,
      clipSeatingPct: 91,
    },
    postGraftImageUrl: generateSeedlingSvg('grafted', 2.1, 'healthy'),
    operatorOverrideNotes: 'Smooth clean single-pass razor cut. Clip seated firmly over junction with no air bubble.',
    outcome: 'SUCCESS_HEALED',
    outcomeRecordedDate: '2026-10-21',
  },
  {
    id: 'graft-rec-102',
    plantTag: 'TOM-GRAFT-102',
    batchId: 'batch-tomato-01',
    rootstockId: 'seedling-r01',
    scionId: 'seedling-s02',
    rootstockVariety: 'Maxifort F1',
    scionVariety: 'San Marzano',
    graftDate: '2026-10-15 11:15',
    operatorName: 'J. Henderson',
    technique: 'Splice Graft (45°)',
    clipType: '2.5mm Silicone Clip',
    gqiScore: 61,
    gqiTier: 'C',
    components: {
      diameterMatchPct: 52,
      vascularAlignmentPct: 60,
      cutCoplanarityPct: 68,
      clipSeatingPct: 75,
    },
    postGraftImageUrl: generateSeedlingSvg('grafted', 2.4, 'rooting'),
    operatorOverrideNotes: 'Operator noted minor step edge at cut boundary due to caliber gap.',
    outcome: 'ADVENTITIOUS_ROOT_FAIL',
    outcomeRecordedDate: '2026-10-21',
  },
];

export const SAMPLE_HEALING_LOGS: HealingDayLog[] = [
  {
    id: 'heal-101-d01',
    graftRecordId: 'graft-rec-101',
    dayNumber: 1,
    date: '2026-10-15',
    stageCode: 'S1',
    stageName: 'Stage 1: Wound Response & Pectin Secretion',
    failureRiskPct: 6.2,
    riskCategory: 'LOW',
    uncertaintyMarginPct: 2.1,
    imageUrl: generateSeedlingSvg('grafted', 2.1, 'healthy'),
    indicators: {
      adventitiousRoots: false,
      callusBridgeVisible: false,
      turgorWiltingScore: 0,
      unionNecrosis: false,
      clipDisplaced: false,
      leafYellowing: false,
    },
    notes: 'Chamber at 96% RH. Scion cotyledons fully turgid. No wilt.',
  },
  {
    id: 'heal-101-d03',
    graftRecordId: 'graft-rec-101',
    dayNumber: 3,
    date: '2026-10-17',
    stageCode: 'S2',
    stageName: 'Stage 2: Callus Bridge Proliferation',
    failureRiskPct: 4.8,
    riskCategory: 'LOW',
    uncertaintyMarginPct: 1.8,
    imageUrl: generateSeedlingSvg('grafted', 2.1, 'callused'),
    indicators: {
      adventitiousRoots: false,
      callusBridgeVisible: true,
      turgorWiltingScore: 0,
      unionNecrosis: false,
      clipDisplaced: false,
      leafYellowing: false,
    },
    notes: 'Green callus cushion visible across cut interface through clear clip.',
  },
  {
    id: 'heal-101-d07',
    graftRecordId: 'graft-rec-101',
    dayNumber: 7,
    date: '2026-10-21',
    stageCode: 'S3',
    stageName: 'Stage 3: Vascular Differentiation & Xylem Bridge',
    failureRiskPct: 2.4,
    riskCategory: 'LOW',
    uncertaintyMarginPct: 1.2,
    imageUrl: generateSeedlingSvg('grafted', 2.1, 'callused'),
    indicators: {
      adventitiousRoots: false,
      callusBridgeVisible: true,
      turgorWiltingScore: 0,
      unionNecrosis: false,
      clipDisplaced: false,
      leafYellowing: false,
    },
    notes: 'Excellent healing. Acclimatization stage started. Ready for progressive humidity reduction.',
  },
  {
    id: 'heal-102-d05',
    graftRecordId: 'graft-rec-102',
    dayNumber: 5,
    date: '2026-10-20',
    stageCode: 'S2',
    stageName: 'Stage 2: Impaired Callus & Scion Stress',
    failureRiskPct: 78.5,
    riskCategory: 'HIGH',
    uncertaintyMarginPct: 6.4,
    imageUrl: generateSeedlingSvg('grafted', 2.4, 'rooting'),
    indicators: {
      adventitiousRoots: true,
      callusBridgeVisible: false,
      turgorWiltingScore: 1,
      unionNecrosis: true,
      clipDisplaced: false,
      leafYellowing: true,
    },
    notes: 'Alert: Adventitious root emerging from scion stem above clip! Scion bypassing rootstock.',
    abstainWarning: 'Adventitious roots detected. Water conduit from rootstock compromised.',
  },
];

export const HEALING_CHAMBER_PROTOCOLS: ChamberCondition[] = [
  {
    dayRange: 'Days 1 – 2',
    dayStart: 1,
    dayEnd: 2,
    stageTitle: 'Critical Sealed Healing (Dark/Saturated)',
    targetTempMinC: 22.0,
    targetTempMaxC: 25.0,
    targetRhMinPct: 95.0,
    targetRhMaxPct: 98.0,
    photoperiodHours: 0,
    lightIntensityUmol: 0,
    purpose: 'Prevent scion transpirational water loss while cuts are not vascularized.',
    actionGuidance: 'Keep chamber 100% closed. Avoid mist droplets directly hitting the graft clip.',
  },
  {
    dayRange: 'Days 3 – 4',
    dayStart: 3,
    dayEnd: 4,
    stageTitle: 'Callus Formation & Low Diffuse Light',
    targetTempMinC: 22.0,
    targetTempMaxC: 24.5,
    targetRhMinPct: 90.0,
    targetRhMaxPct: 95.0,
    photoperiodHours: 8,
    lightIntensityUmol: 50,
    purpose: 'Stimulate cellular division at junction without photostress.',
    actionGuidance: 'Turn on low diffuse LED (50 µmol/m²/s). Vent chamber for 5 minutes once daily.',
  },
  {
    dayRange: 'Days 5 – 7',
    dayStart: 5,
    dayEnd: 7,
    stageTitle: 'Vascular Reconnection & Initial Ventilation',
    targetTempMinC: 21.0,
    targetTempMaxC: 24.0,
    targetRhMinPct: 80.0,
    targetRhMaxPct: 85.0,
    photoperiodHours: 12,
    lightIntensityUmol: 100,
    purpose: 'Promote xylem and phloem differentiation between scion and rootstock.',
    actionGuidance: 'Open chamber vents 25-50%. If scion wilts, mist walls immediately and close vents.',
  },
  {
    dayRange: 'Days 8 – 10',
    dayStart: 8,
    dayEnd: 10,
    stageTitle: 'Hardening & Acclimatization',
    targetTempMinC: 20.0,
    targetTempMaxC: 23.0,
    targetRhMinPct: 65.0,
    targetRhMaxPct: 75.0,
    photoperiodHours: 14,
    lightIntensityUmol: 180,
    purpose: 'Stomata conditioning and cuticle development for greenhouse conditions.',
    actionGuidance: 'Chamber top opened. Ready to move to nursery bench if no midday wilting occurs.',
  },
];
