export type CropType = 'Tomato' | 'Cucumber' | 'Watermelon';

export type SeedlingRole = 'rootstock' | 'scion';

export type ReadinessVerdict = 
  | 'READY' 
  | 'TOO_SLENDER' 
  | 'OVERGROWN' 
  | 'ABSTAIN_BLURRED' 
  | 'ABSTAIN_OUT_OF_PLANE';

export interface Seedling {
  id: string;
  tag: string;
  batchId: string;
  crop: CropType;
  variety: string;
  role: SeedlingRole;
  stemDiameterMm: number;
  hypocotylHeightMm: number;
  cotyledonHeightMm: number;
  straightnessPct: number;
  readinessVerdict: ReadinessVerdict;
  confidencePct: number;
  markerCalibrated: boolean;
  markerScaleMmPerPx: number;
  imageQualityScore: number; // 0 - 100
  imageUrl: string;
  captureDate: string;
  notes: string;
  abstentionReason?: string;
}

export interface Batch {
  id: string;
  name: string;
  crop: CropType;
  rootstockVariety: string;
  scionVariety: string;
  sowingDate: string;
  seedlingCount: number;
  operator: string;
}

export interface GraftPair {
  id: string;
  rootstockId: string;
  scionId: string;
  rootstockTag: string;
  scionTag: string;
  rootstockDiameterMm: number;
  scionDiameterMm: number;
  diameterDiffMm: number;
  matchScorePct: number;
  matchQuality: 'OPTIMAL' | 'ACCEPTABLE' | 'POOR';
  recommendedCutAngleDeg: number;
  recommendedCutHeightMm: number;
  clipSizeMm: number;
  confidencePct: number;
  notes: string;
}

export interface GQIComponents {
  diameterMatchPct: number;     // Weight 30%
  vascularAlignmentPct: number; // Weight 35%
  cutCoplanarityPct: number;    // Weight 20%
  clipSeatingPct: number;       // Weight 15%
}

export interface GraftRecord {
  id: string;
  plantTag: string;
  batchId: string;
  rootstockId: string;
  scionId: string;
  rootstockVariety: string;
  scionVariety: string;
  graftDate: string;
  operatorName: string;
  technique: string; // e.g. 'Splice Graft (45°)' | 'Cleft Graft'
  clipType: string;  // e.g. '2.0mm Clear Silicone Clip'
  gqiScore: number;  // 0 - 100
  gqiTier: 'A' | 'B' | 'C' | 'REJECT';
  components: GQIComponents;
  postGraftImageUrl: string;
  operatorOverrideNotes?: string;
  outcome: 'PENDING' | 'SUCCESS_HEALED' | 'FAILED_WILT' | 'FAILED_NECROSIS' | 'ADVENTITIOUS_ROOT_FAIL';
  outcomeRecordedDate?: string;
}

export interface HealingDayLog {
  id: string;
  graftRecordId: string;
  dayNumber: number;
  date: string;
  stageCode: 'S1' | 'S2' | 'S3' | 'S4';
  stageName: string;
  failureRiskPct: number;
  riskCategory: 'LOW' | 'MODERATE' | 'HIGH' | 'EXPERIMENTAL';
  uncertaintyMarginPct: number;
  imageUrl: string;
  indicators: {
    adventitiousRoots: boolean;
    callusBridgeVisible: boolean;
    turgorWiltingScore: number; // 0 = firm turgid, 1 = slight wilt, 2 = severe wilt
    unionNecrosis: boolean;
    clipDisplaced: boolean;
    leafYellowing: boolean;
  };
  notes: string;
  abstainWarning?: string;
}

export interface ChamberCondition {
  dayRange: string;
  dayStart: number;
  dayEnd: number;
  stageTitle: string;
  targetTempMinC: number;
  targetTempMaxC: number;
  targetRhMinPct: number;
  targetRhMaxPct: number;
  photoperiodHours: number;
  lightIntensityUmol: number;
  purpose: string;
  actionGuidance: string;
}
