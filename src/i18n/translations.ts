export type Language = 'en' | 'hi';

export interface TranslationDictionary {
  appTitle: string;
  appSubtitle: string;
  cropTag: string;
  offlineStatus: string;
  onDeviceStorage: string;
  operatorDisclaimer: string;
  
  // Accessibility
  listen: string;
  voiceBtn: string;
  dictationOn: string;
  dictationOff: string;
  toggleDictation: string;
  dictationDisabledNotice: string;
  highContrast: string;
  normalContrast: string;
  fontSize: string;
  specsBtn: string;
  guideBtn: string;
  langToggle: string;
  
  // Navigation
  tabIntake: string;
  tabPlanning: string;
  tabQuality: string;
  tabHealing: string;
  tabAdvisory: string;
  
  // FR-1 Intake
  intakeTitle: string;
  intakeSubtitle: string;
  speakAssessment: string;
  quickPresetsTitle: string;
  presetReadyRootstock: string;
  presetReadyScion: string;
  presetSlender: string;
  presetOvergrown: string;
  presetBlur: string;
  presetTilt: string;
  plantRole: string;
  roleRootstock: string;
  roleScion: string;
  plantTag: string;
  cultivar: string;
  scaleMarkerNotice: string;
  openCamera: string;
  snapPicture: string;
  uploadPhoto: string;
  measuringStem: string;
  verdictReady: string;
  verdictSlender: string;
  verdictOvergrown: string;
  verdictBlur: string;
  verdictTilt: string;
  stemDiameter: string;
  hypocotylHeight: string;
  cotyledonHeight: string;
  stemStraightness: string;
  saveSeedling: string;
  savedToBatch: string;
  pairRootstockScion: string;
  registeredSeedlings: string;

  // FR-2 Planning & Cutting
  planningTitle: string;
  planningSubtitle: string;
  listenCutGuide: string;
  advisoryNoticeTitle: string;
  advisoryNoticeDesc: string;
  selectPairTitle: string;
  selectRootstock: string;
  selectScion: string;
  caliberDifferential: string;
  matchOptimal: string;
  matchAcceptable: string;
  matchPoor: string;
  rootstockLabel: string;
  scionLabel: string;
  diffLabel: string;
  recommendedClip: string;
  recommendedCutAngle: string;
  proceedToScore: string;
  cutGeometryTitle: string;
  stepChecklistTitle: string;
  step1: string;
  step2: string;
  step3: string;
  step4: string;

  // FR-3 Quality Scoring
  qualityTitle: string;
  qualitySubtitle: string;
  announceGQI: string;
  simulateGQI: string;
  gqiExcellent: string;
  gqiMisaligned: string;
  gqiLoose: string;
  postGraftPhoto: string;
  permanentTag: string;
  operatorName: string;
  gqiOverallScore: string;
  tierA: string;
  tierB: string;
  tierC: string;
  tierReject: string;
  featureDiameter: string;
  featureVascular: string;
  featureCut: string;
  featureClip: string;
  operatorNotes: string;
  saveRecord: string;
  recordSaved: string;
  viewTimeline: string;
  traceableRecords: string;

  // FR-4 Healing Monitoring
  healingTitle: string;
  healingSubtitle: string;
  speakHealing: string;
  trackedPlant: string;
  addDayLog: string;
  day10Preset: string;
  rootAlertPreset: string;
  occludedPreset: string;
  visibleIndicators: string;
  indicatorCallus: string;
  indicatorAdventitious: string;
  indicatorNecrosis: string;
  indicatorTurgor: string;
  failureRisk7Day: string;
  riskLow: string;
  riskModerate: string;
  riskHigh: string;
  riskExperimental: string;
  uncertaintyMargin: string;
  adventitiousAlertTitle: string;
  adventitiousAlertDesc: string;

  // FR-5 Advisory & Research
  advisoryTitle: string;
  advisorySubtitle: string;
  speakChamber: string;
  nonActuatingNoticeTitle: string;
  nonActuatingNoticeDesc: string;
  selectPhase: string;
  targetHumidity: string;
  targetTemp: string;
  lightIntensity: string;
  farmerGuidance: string;
  researchExport: string;
  exportJSON: string;
  exportCSV: string;
  auditOutcomes: string;
  outcomePending: string;
  outcomeSuccess: string;
  outcomeWilt: string;
  outcomeNecrosis: string;
  outcomeRooting: string;

  // Voice Center
  voiceCenterTitle: string;
  voiceCenterSubtitle: string;
  listeningState: string;
  stoppedState: string;
  clickToTest: string;
  farmerVoiceTip: string;
  closeBtn: string;
}

export const TRANSLATIONS: Record<Language, TranslationDictionary> = {
  en: {
    appTitle: 'AI-GRAFT',
    appSubtitle: 'Vegetable Grafting Intelligence Platform',
    cropTag: 'Tomato Research',
    offlineStatus: 'Offline Ready',
    onDeviceStorage: 'On-Device Storage',
    operatorDisclaimer: 'Human Operator Performs Graft · Advisory Only',
    
    listen: 'Listen',
    voiceBtn: 'Voice',
    dictationOn: 'Dictation: ON',
    dictationOff: 'Dictation: OFF',
    toggleDictation: 'Toggle Voice Dictation',
    dictationDisabledNotice: 'Voice dictation is currently turned OFF. Toggle it ON to enable microphone listening.',
    highContrast: 'High Contrast',
    normalContrast: 'Standard Contrast',
    fontSize: 'Text Size',
    specsBtn: 'SRS Matrix',
    guideBtn: 'Farmer Guide',
    langToggle: 'हिन्दी',

    tabIntake: '1. Intake',
    tabPlanning: '2. Pair & Cut',
    tabQuality: '3. Quality (GQI)',
    tabHealing: '4. Healing',
    tabAdvisory: '5. Advisory',

    intakeTitle: '1. Seedling Intake & Assessment',
    intakeSubtitle: 'Calibrated stem diameter, hypocotyl geometry, and graft-readiness classification.',
    speakAssessment: 'Read Assessment Aloud',
    quickPresetsTitle: 'Field Test Presets',
    presetReadyRootstock: 'Ready Rootstock (2.14mm)',
    presetReadyScion: 'Ready Scion (2.10mm)',
    presetSlender: 'Too Slender (1.32mm)',
    presetOvergrown: 'Overgrown (3.02mm)',
    presetBlur: 'Blur Quality Flag (Abstain)',
    presetTilt: 'Out-of-Plane Tilt (Abstain)',
    plantRole: 'Plant Role',
    roleRootstock: 'Rootstock (Base)',
    roleScion: 'Scion (Fruiting Top)',
    plantTag: 'Plant Tag',
    cultivar: 'Cultivar / Variety',
    scaleMarkerNotice: '20mm Reference Marker',
    openCamera: 'Open Camera',
    snapPicture: 'Capture Frame',
    uploadPhoto: 'Upload Photo',
    measuringStem: 'Calibrating Stem Geometry...',
    verdictReady: 'READY TO GRAFT',
    verdictSlender: 'TOO SLENDER (WAIT)',
    verdictOvergrown: 'OVERGROWN (TOO THICK)',
    verdictBlur: 'ABSTAIN: BLUR DETECTED',
    verdictTilt: 'ABSTAIN: TILT DETECTED',
    stemDiameter: 'Stem Diameter',
    hypocotylHeight: 'Hypocotyl Height',
    cotyledonHeight: 'Cotyledon Height',
    stemStraightness: 'Stem Straightness',
    saveSeedling: 'Save Seedling',
    savedToBatch: 'Saved to Batch',
    pairRootstockScion: 'Pair Rootstock & Scion',
    registeredSeedlings: 'Registered Seedlings in Batch',

    planningTitle: '2. Graft Planning & Cutting Guide',
    planningSubtitle: 'Stem caliber matching algorithm and 45-degree angle visual cutting protocol.',
    listenCutGuide: 'Listen to Cutting Guide',
    advisoryNoticeTitle: 'Human Operator Advisory Boundary',
    advisoryNoticeDesc: 'AI-GRAFT provides computer vision decision support. Human operators execute all physical cuts, blade sterilization, and silicone clip placement.',
    selectPairTitle: 'Select Seedlings for Grafting Pair',
    selectRootstock: '1. Rootstock (Disease-Resistant Base)',
    selectScion: '2. Scion (Fruiting Top)',
    caliberDifferential: 'Caliber Differential',
    matchOptimal: 'OPTIMAL MATCH (98%)',
    matchAcceptable: 'ACCEPTABLE MATCH (82%)',
    matchPoor: 'POOR MATCH (CALIBER MISMATCH)',
    rootstockLabel: 'Rootstock',
    scionLabel: 'Scion',
    diffLabel: 'Caliber Gap (Δ)',
    recommendedClip: 'Recommended Clip Caliber',
    recommendedCutAngle: 'Recommended Cut Angle',
    proceedToScore: 'Proceed to Physical Graft & Scoring (GQI)',
    cutGeometryTitle: 'Cut Geometry & Cambium Alignment',
    stepChecklistTitle: 'Step-by-Step Splice Graft Protocol',
    step1: 'Sterilize razor blade with 70% isopropyl alcohol.',
    step2: 'Cut rootstock at 45° angle, ~18mm above soil line.',
    step3: 'Cut scion at matching 45° angle below cotyledons.',
    step4: 'Slide silicone clip over rootstock; press scion cut face flush.',

    qualityTitle: '3. Graft Quality Scoring (GQI)',
    qualitySubtitle: 'Post-graft visual inspection, multi-factor GQI calculation, and traceable plant record.',
    announceGQI: 'Announce GQI Verdict',
    simulateGQI: 'Simulate Post-Graft Inspection Conditions',
    gqiExcellent: 'Tier A (GQI 95) - Optimal Alignment',
    gqiMisaligned: 'Tier C (GQI 69) - Lateral Stepping',
    gqiLoose: 'Tier B (GQI 78) - Loose Clip Seating',
    postGraftPhoto: 'Post-Graft Photograph',
    permanentTag: 'Permanent Plant Tag',
    operatorName: 'Grafting Operator',
    gqiOverallScore: 'Overall Graft Quality Score',
    tierA: 'TIER A — EXCELLENT HEALING VIABILITY',
    tierB: 'TIER B — GOOD HEALING VIABILITY',
    tierC: 'TIER C — MARGINAL UNION (MONITOR CLOSELY)',
    tierReject: 'REJECT — RECUT & RECLIP RECOMMENDED',
    featureDiameter: '1. Stem Diameter Match (Weight 30%)',
    featureVascular: '2. Vascular Cambium Alignment (Weight 35%)',
    featureCut: '3. Cut Coplanarity & Contact Surface (Weight 20%)',
    featureClip: '4. Clip Seating & Stability (Weight 15%)',
    operatorNotes: 'Operator Observational Notes',
    saveRecord: 'Save Plant Record',
    recordSaved: 'Graft Record Saved!',
    viewTimeline: 'View Healing Timeline',
    traceableRecords: 'Traceable Plant Records',

    healingTitle: '4. Time-Lapse Healing & Failure Risk',
    healingSubtitle: 'Repeated dated photography, callus proliferation tracking, and 7-day failure risk estimation.',
    speakHealing: 'Speak Healing Status',
    trackedPlant: 'Tracked Plant',
    addDayLog: 'Add Observation',
    day10Preset: '+ Day 10 (Healed)',
    rootAlertPreset: '+ Rooting Alert',
    occludedPreset: '+ Occluded (Abstain)',
    visibleIndicators: 'Visible Stage Indicators',
    indicatorCallus: 'Callus Bridge Proliferation',
    indicatorAdventitious: 'Adventitious Roots on Scion',
    indicatorNecrosis: 'Union Necrosis / Rot',
    indicatorTurgor: 'Leaf Turgor Pressure',
    failureRisk7Day: 'Estimated 7-Day Failure Risk',
    riskLow: 'LOW RISK — HEALING ON SCHEDULE',
    riskModerate: 'MODERATE RISK — MONITOR TURGOR DAILY',
    riskHigh: 'HIGH FAILURE RISK — PATHOLOGY DETECTED',
    riskExperimental: 'EXPERIMENTAL / UNCERTAIN EVIDENCE',
    uncertaintyMargin: 'Uncertainty Interval (95% CI)',
    adventitiousAlertTitle: 'Critical Pathology: Adventitious Roots on Scion',
    adventitiousAlertDesc: 'Roots from scion bypass rootstock resistance to soilborne pathogens. Prune adventitious roots immediately.',

    advisoryTitle: '5. Healing Advisory & Research Export',
    advisorySubtitle: 'Evidence-bounded healing chamber climate targets and dataset export.',
    speakChamber: 'Speak Chamber Advice',
    nonActuatingNoticeTitle: 'Non-Actuating Advisory Constraint',
    nonActuatingNoticeDesc: 'AI-GRAFT calculates evidence-bounded agronomic advice. The software does not control actuators or guarantee biological survival.',
    selectPhase: 'Select Healing Protocol Phase',
    targetHumidity: 'Target Humidity (RH)',
    targetTemp: 'Target Temperature',
    lightIntensity: 'Light Intensity',
    farmerGuidance: 'Field Action Guidance',
    researchExport: 'Research Dataset Export',
    exportJSON: 'Export JSON Dataset',
    exportCSV: 'Export CSV Spreadsheet',
    auditOutcomes: 'Audit Eventual Plant Outcomes',
    outcomePending: 'In Chamber (Pending)',
    outcomeSuccess: '✓ Healed & Planted',
    outcomeWilt: '✗ Failed: Wilt Desiccation',
    outcomeNecrosis: '✗ Failed: Union Necrosis',
    outcomeRooting: '✗ Failed: Scion Rooting',

    voiceCenterTitle: 'Voice Command Assistant',
    voiceCenterSubtitle: 'Hands-Free Control for Humid Greenhouses & Gloves',
    listeningState: 'Listening... Speak clearly into your microphone.',
    stoppedState: 'Microphone paused. Tap to listen again.',
    clickToTest: 'One-Tap Voice Command Simulator (Click to Test Instantly)',
    farmerVoiceTip: 'Farmer Tip: When wearing rubber grafting gloves or working in mist chambers, use voice commands to keep your device clean.',
    closeBtn: 'Close',
  },

  hi: {
    appTitle: 'एआई-ग्राफ्ट',
    appSubtitle: 'सब्जी पौध ग्राफ्टिंग (कलम) बुद्धिमत्ता प्रणाली',
    cropTag: 'टमाटर शोध',
    offlineStatus: 'ऑफ़लाइन सक्रिय',
    onDeviceStorage: 'डिवाइस पर सुरक्षित',
    operatorDisclaimer: 'मानव ऑपरेटर द्वारा ग्राफ्टिंग · केवल परामर्श हेतु',

    listen: 'सुने',
    voiceBtn: 'आवाज़',
    dictationOn: 'डिक्टेशन: चालू',
    dictationOff: 'डिक्टेशन: बंद',
    toggleDictation: 'आवाज़ डिक्टेशन ऑन/ऑफ करें',
    dictationDisabledNotice: 'आवाज़ डिक्टेशन वर्तमान में बंद है। चालू करने हेतु टॉगल दबाएं।',
    highContrast: 'हाई कंट्रास्ट',
    normalContrast: 'सामान्य कंट्रास्ट',
    fontSize: 'अक्षर आकार',
    specsBtn: 'एसआरएस विवरण',
    guideBtn: 'किसान मार्गदर्शिका',
    langToggle: 'English',

    tabIntake: '1. पौध जांच',
    tabPlanning: '2. जोड़ी व कटाई',
    tabQuality: '3. गुणवत्ता (GQI)',
    tabHealing: '4. उपचार निगरानी',
    tabAdvisory: '5. कक्ष परामर्श',

    intakeTitle: '1. पौध आवक एवं तना मूल्यांकन',
    intakeSubtitle: '20 मिमी संदर्भ मार्कर द्वारा तने की मोटाई (व्यास) व ग्राफ्टिंग तत्परता की सटीक जांच।',
    speakAssessment: 'मूल्यांकन पढ़कर सुनाएं',
    quickPresetsTitle: 'त्वरित फील्ड परीक्षण विकल्प',
    presetReadyRootstock: 'तैयार मूलवृंत (2.14 मिमी)',
    presetReadyScion: 'तैयार सायन (2.10 मिमी)',
    presetSlender: 'पतला तना (1.32 मिमी - प्रतीक्षा करें)',
    presetOvergrown: 'अत्यधिक मोटा (3.02 मिमी)',
    presetBlur: 'धुंधला चित्र (सिस्टम अस्वीकृत)',
    presetTilt: 'झुका हुआ तना (समतल से बाहर)',
    plantRole: 'पौधे की भूमिका',
    roleRootstock: 'मूलवृंत (Rootstock - निचला आधार)',
    roleScion: 'सायन (Scion - फलदार ऊपरी शाखा)',
    plantTag: 'पौध पहचान क्रमांक (Tag)',
    cultivar: 'किस्म / प्रजाति',
    scaleMarkerNotice: '20 मिमी पैमाना मार्कर',
    openCamera: 'कैमरा चालू करें',
    snapPicture: 'तस्वीर खींचें',
    uploadPhoto: 'फोटो अपलोड करें',
    measuringStem: 'तने का मापन किया जा रहा है...',
    verdictReady: 'कलम बांधने हेतु तैयार',
    verdictSlender: 'तना अत्यधिक पतला है (2-3 दिन रुकें)',
    verdictOvergrown: 'अत्यधिक मोटा तना (क्लिप से बाहर)',
    verdictBlur: 'अस्वीकृत: धुंधला चित्र',
    verdictTilt: 'अस्वीकृत: तना झुका हुआ है',
    stemDiameter: 'तने का व्यास (मोटाई)',
    hypocotylHeight: 'अधोबीजपत्र ऊंचाई',
    cotyledonHeight: 'बीजपत्र ऊंचाई',
    stemStraightness: 'तने का सीधापन',
    saveSeedling: 'पौध रिकॉर्ड सहेजें',
    savedToBatch: 'बैच में सहेजा गया',
    pairRootstockScion: 'मूलवृंत व सायन जोड़ी बनाएं',
    registeredSeedlings: 'बैच में पंजीकृत पौधे',

    planningTitle: '2. ग्राफ्ट योजना एवं कटाई मार्गदर्शन',
    planningSubtitle: 'तने के व्यास का सटीक मिलान और 45-डिग्री कोण तिरछी कटाई की सचित्र विधि।',
    listenCutGuide: 'कटाई निर्देश सुनें',
    advisoryNoticeTitle: 'ऑपरेटर सीमा चेतावनी',
    advisoryNoticeDesc: 'एआई-ग्राफ्ट केवल परामर्श मार्गदर्शन देता है। ब्लेड की सफाई, तने की कटाई और सिलिकॉन क्लिप लगाना किसान द्वारा ही किया जाता है।',
    selectPairTitle: 'कलम बांधने हेतु पौधों की जोड़ी चुनें',
    selectRootstock: '1. मूलवृंत (रोग प्रतिरोधी निचला तना)',
    selectScion: '2. सायन (उत्तम फल देने वाली शाखा)',
    caliberDifferential: 'तने के व्यास का अंतर (Δ)',
    matchOptimal: 'उत्कृष्ट जोड़ी (98% मिलान)',
    matchAcceptable: 'स्वीकार्य जोड़ी (82% मिलान)',
    matchPoor: 'अनुपयुक्त जोड़ी (व्यास में भारी अंतर)',
    rootstockLabel: 'मूलवृंत व्यास',
    scionLabel: 'सायन व्यास',
    diffLabel: 'व्यास अंतर (Δ)',
    recommendedClip: 'सुझाई गई सिलिकॉन क्लिप',
    recommendedCutAngle: 'सुझाया गया कटाई कोण',
    proceedToScore: 'कलम लगाएं और गुणवत्ता जांचें (GQI)',
    cutGeometryTitle: 'कटाई कोण एवं कैम्बियम संरेखण चित्र',
    stepChecklistTitle: 'चरणबद्ध स्प्लिस ग्राफ्टिंग विधि',
    step1: 'ब्लेड को 70% आइसोप्रोपिल अल्कोहल से कीटाणुरहित करें।',
    step2: 'मूलवृंत को मिट्टी से 18 मिमी ऊपर 45° कोण पर तिरछा काटें।',
    step3: 'सायन को भी बीजपत्र के नीचे उसी 45° कोण पर काटें।',
    step4: 'मूलवृंत पर क्लिप चढ़ाएं और सायन के कटे भाग को मिलाकर दबाएं।',

    qualityTitle: '3. कलम गुणवत्ता सूचकांक (GQI)',
    qualitySubtitle: 'कलम लगाने के बाद दृश्य निरीक्षण, बहु-घटक GQI स्कोर एवं स्थायी पौध रिकॉर्ड।',
    announceGQI: 'GQI स्कोर बोलकर बताएं',
    simulateGQI: 'कलम गुणवत्ता निरीक्षण स्थितियां परखें',
    gqiExcellent: 'श्रेणी क (GQI 95) - उत्तम संरेखण',
    gqiMisaligned: 'श्रेणी ग (GQI 69) - आंशिक मिसअलाइनमेंट',
    gqiLoose: 'श्रेणी ख (GQI 78) - ढीली क्लिप',
    postGraftPhoto: 'कलम लगाने के बाद की तस्वीर',
    permanentTag: 'स्थायी पौध टैग',
    operatorName: 'कलम बांधने वाले ऑपरेटर का नाम',
    gqiOverallScore: 'कुल कलम गुणवत्ता स्कोर',
    tierA: 'श्रेणी क — उत्कृष्ट जीवित रहने की संभावना',
    tierB: 'श्रेणी ख — अच्छी संभावना',
    tierC: 'श्रेणी ग — कमजोर जोड़ (नियमित निगरानी आवश्यक)',
    tierReject: 'अस्वीकृत — दोबारा कटाई व क्लिप लगाना आवश्यक',
    featureDiameter: '1. तने के व्यास का मिलान (भार 30%)',
    featureVascular: '2. कैम्बियम संवहनी संरेखण (भार 35%)',
    featureCut: '3. कटाई समतलता एवं संपर्क सतह (भार 20%)',
    featureClip: '4. क्लिप की पकड़ व स्थिरता (भार 15%)',
    operatorNotes: 'ऑपरेटर का व्यावहारिक अवलोकन / टिप्पणी',
    saveRecord: 'पौध रिकॉर्ड सुरक्षित करें',
    recordSaved: 'कलम रिकॉर्ड सुरक्षित हुआ!',
    viewTimeline: 'उपचार समय-सारणी देखें',
    traceableRecords: 'पंजीकृत कलम रिकॉर्ड',

    healingTitle: '4. समय-सारणी उपचार एवं विफलता जोखिम',
    healingSubtitle: 'दिनांकित तस्वीरें, कैलस ऊतक जुड़ाव एवं 7-दिवसीय विफलता जोखिम का अनुमान।',
    speakHealing: 'उपचार स्थिति सुनें',
    trackedPlant: 'निगरानी में पौधा',
    addDayLog: 'निरीक्षण जोड़ें',
    day10Preset: '+ दिन 10 (पूर्ण स्वस्थ)',
    rootAlertPreset: '+ अस्थानिक जड़ चेतावनी',
    occludedPreset: '+ धुंधला दृश्य (अस्वीकृत)',
    visibleIndicators: 'दिखने वाले जैविक लक्षण',
    indicatorCallus: 'कैलस ऊतक की वृद्धि',
    indicatorAdventitious: 'सायन पर अस्थानिक जड़ें',
    indicatorNecrosis: 'जोड़ पर सड़न / नेक्रोसिस',
    indicatorTurgor: 'पत्तियों का सीधापन (टर्गोर)',
    failureRisk7Day: '7-दिन में विफलता का अनुमानित जोखिम',
    riskLow: 'कम जोखिम — उपचार सही दिशा में है',
    riskModerate: 'मध्यम जोखिम — प्रतिदिन पत्तियों की जांच करें',
    riskHigh: 'उच्च जोखिम — रोग या खराबी पाई गई',
    riskExperimental: 'प्रायोगिक / अनिश्चित साक्ष्य',
    uncertaintyMargin: 'अनिश्चितता सीमा (95% CI)',
    adventitiousAlertTitle: 'गंभीर चेतावनी: सायन पर अस्थानिक जड़ें निकली हैं',
    adventitiousAlertDesc: 'सायन की जड़ें मूलवृंत को बायपास कर रही हैं जिससे रोग प्रतिरोधक क्षमता खत्म हो जाएगी। इन जड़ों को तुरंत काटें।',

    advisoryTitle: '5. उपचार कक्ष परामर्श एवं शोध डेटा',
    advisorySubtitle: 'अनुसंधान-आधारित तापमान व आर्द्रता लक्ष्य, उत्तरजीविता लेखापरीक्षा और डेटा निर्यात।',
    speakChamber: 'कक्ष परामर्श सुनें',
    nonActuatingNoticeTitle: 'गैर-स्वचालित परामर्श सीमा',
    nonActuatingNoticeDesc: 'एआई-ग्राफ्ट कृषि अनुसंधान आधारित सलाह देता है। यह किसी मोटर या हीटर को सीधे नियंत्रित नहीं करता।',
    selectPhase: 'उपचार का चरण चुनें',
    targetHumidity: 'लक्षित सापेक्ष आर्द्रता (RH)',
    targetTemp: 'लक्षित तापमान',
    lightIntensity: 'प्रकाश तीव्रता',
    farmerGuidance: 'किसान के लिए जरूरी कदम',
    researchExport: 'शोध डेटा डाउनलोड करें',
    exportJSON: 'JSON डेटा डाउनलोड करें',
    exportCSV: 'CSV स्प्रेडशीट डाउनलोड करें',
    auditOutcomes: 'पौधे का अंतिम परिणाम दर्ज करें',
    outcomePending: 'उपचार कक्ष में (प्रतीक्षारत)',
    outcomeSuccess: '✓ स्वस्थ व खेत में रोपित',
    outcomeWilt: '✗ विफल: सूखने के कारण',
    outcomeNecrosis: '✗ विफल: जोड़ सड़न के कारण',
    outcomeRooting: '✗ विफल: सायन पर जड़ें निकलने से',

    voiceCenterTitle: 'आवाज़ सहायक (वॉइस कमांड)',
    voiceCenterSubtitle: 'दस्ताने पहनने या नम ग्रीनहाउस में हाथों-मुक्त संचालन',
    listeningState: 'सुन रहा हूं... अपने माइक्रोफ़ोन में स्पष्ट बोलें।',
    stoppedState: 'माइक्रोफ़ोन रुका है। सुनने के लिए टैप करें।',
    clickToTest: 'एक-क्लिक आवाज़ सिम्युलेटर (तुरंत परीक्षण करें)',
    farmerVoiceTip: 'किसान सलाह: कलम बांधते समय हाथों में दस्ताने या मिट्टी लगी हो तो स्क्रीन को छुए बिना आवाज़ से ऐप चलाएं।',
    closeBtn: 'बंद करें',
  },
};
