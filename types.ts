
export enum GatewayRole {
  ENGINEER = 'Engineer',
  AUDITOR = 'Auditor',
  FIRM = 'Engineering Office',
  CERTIFYING_BODY = 'Accreditation Body',
  ADMIN = 'System Administrator'
}

export interface AuditLog {
  id: string;
  userId: string;
  userRole: GatewayRole;
  action: string;
  details: string;
  timestamp: number;
  projectId?: string;
}

export interface DrawingVersion {
  id: string;
  versionNumber: number;
  image: string;
  analysis: any;
  timestamp: number;
  createdBy: string;
  changeLog: string;
  confidenceScore?: number;
}

export interface EngineeringProject {
  id: string;
  name: string;
  versions: DrawingVersion[];
  currentVersionIndex: number;
  auditTrail: AuditLog[];
  status: 'Draft' | 'In Review' | 'Approved' | 'Rejected';
}

export enum UserRank {
  BEGINNER = 'Beginner',
  CERTIFIED = 'Certified Engineer',
  DESIGN_EXPERT = 'Design Expert',
  CONSULTANT = 'Decor Consultant',
  GOLD = 'Gold Member',
  INFLUENCER = 'Influencer',
  ARCHITECT_MASTERS = 'Architect Masters',
  COUNCIL_MEMBER = 'Expert Council Member',
  AWARD_WINNER = 'Global Award Winner'
}

export enum PlanType {
  FREE = 'FREE',
  PRO = 'PRO',
  ENTERPRISE = 'ENTERPRISE'
}

export enum AccessLevel {
  VIEW_ONLY = 'View Only',
  EDIT_ACCESS = 'Full Edit Access',
  ADMIN = 'System Admin'
}

export enum Region {
  GULF = 'GULF',
  EUROPE = 'EUROPE',
  AMERICA = 'AMERICA',
  ASIA = 'ASIA'
}

export type Language = 'en' | 'ar' | 'fr' | 'de' | 'es' | 'zh' | 'it' | 'tr';

export enum PersonalityType {
  ANALYTICAL = 'Analytical',
  CREATIVE = 'Creative',
  SOCIAL = 'Social',
  CALM = 'Calm'
}

export interface PersonalityQuizResult {
  type: PersonalityType;
  description: string;
  descriptionAr: string;
  suggestedPalette: { name: string; hex: string }[];
  traits: string[];
}

export interface UserPreferences {
  budget: string;
  country: string;
  lifestyle: string;
  tasteProfile: string[];
  interactionCount: number;
  lastUpdated: number;
  plan?: PlanType;
  personalityResult?: PersonalityQuizResult;
}

export interface ARAsset {
  id: string;
  name: string;
  nameAr: string;
  category: string;
  thumbnail: string;
  modelUrl: string; // GLB for Android/Web
  iosModelUrl?: string; // USDZ for iOS
  dimensions: string;
  brand: string;
  price?: string;
  stockStatus?: 'In Stock' | 'Limited' | 'Out of Stock';
  stockStatusAr?: string;
  tryCount?: number;
  conversionRate?: number;
  ipProtected?: boolean;
}

export interface ARProjectSave {
  id: string;
  timestamp: number;
  name: string;
  assets: { assetId: string; position: { x: number; y: number; z: number } }[];
  measurements: { label: string; value: string }[];
  snapshot: string; // base64 thumbnail
}

export interface ARVersion {
  id: string;
  timestamp: number;
  changes: string;
  snapshot: string;
}

export interface Citation {
  title: string;
  source: string;
}

export interface IPStatus {
  fingerprint: string;
  isRegistered: boolean;
  timestamp: Date;
  protectionLevel: string;
}

export interface VoiceSettings {
  rate: number;
  pitch: number;
  volume: number;
  voiceName: string;
  neuralEnabled: boolean;
  autoReadAloud: boolean;
}

export enum DatabaseType {
  RELATIONAL = 'SQL (Core)',
  AUTH_SERVICE = 'Auth DB (Identity)',
  MESSAGING_BUS = 'Messaging (NoSQL)',
  SEARCH = 'Vector Search',
  VECTOR_DB = 'Pinecone/Weaviate',
  REALTIME = 'Real-time (Cache)',
  QUEUE_ENGINE = 'Redis (Queue)',
  WAREHOUSE = 'Data Warehouse',
  NOSQL = 'NoSQL (Document Store)',
  FINANCIAL_LEDGER = 'Immutable Ledger (ACID)',
  VOICE_PREFS = 'Preferences DB'
}

export interface DatabaseNode {
  id: string;
  location: string;
  region: Region;
  type: DatabaseType;
  dbEngine: string;
  status: 'Online' | 'Offline' | 'Optimizing' | 'Syncing' | 'Failover';
  latency: number;
  uptime: string;
  load: number;
  throughput: string;
  shardingActive: boolean;
  rlsStatus: 'Enforced' | 'Disabled';
  i18nSupport: boolean;
}

export interface RelationalTableStatus {
  name: string;
  rowCount: number;
  status: 'Healthy' | 'Vulnerable' | 'Indexing' | 'Syncing';
  lastVacuum: string;
  integrityScore: number;
  rbacLevel: string;
  i18nCompliant: boolean;
}

export interface QueryLog {
  id: string;
  query: string;
  duration: number;
  timestamp: Date;
  database: string;
  severity: 'normal' | 'slow' | 'critical';
  impact: string;
}

export interface SystemAlert {
  id: string;
  title: string;
  type: 'critical' | 'warning' | 'info';
  timestamp: Date;
  message: string;
  resolved: boolean;
}

export interface DataSyncStatus {
  lastSync: Date;
  consistencyScore: number;
  activeTransactions: number;
  globalPropagationTime: string;
  hybridSyncActive: boolean;
  failoverStatus: 'Standby' | 'Active';
}

export interface Project {
  id: string;
  title: string;
  author: string;
  rank: UserRank;
  imageBefore: string;
  imageAfter: string;
  budget: string;
  budgetNumeric: number;
  tags: string[];
  description: string;
  location: string;
  materials: string[];
  likes: number;
  area: string;
  areaNumeric: number;
  style: string;
  clientReview: string;
  completionDate: string;
  consultationFee: string;
  integrityScore?: number;
  isVerifiedProject: boolean;
  awards?: any[];
  linkedSuppliers?: any[];
}

export enum ChatRole {
  OWNER = 'Owner',
  MODERATOR = 'Moderator',
  MEMBER = 'Member',
  VIEWER = 'Viewer'
}

export interface ChatPermission {
  role: ChatRole;
  canSendMessages: boolean;
  canSendFiles: boolean;
  canStartCalls: boolean;
  canModerate: boolean;
  canInvite: boolean;
}

export interface ChatInvitation {
  id: string;
  roomId: string;
  invitedBy: string;
  inviteeEmail?: string;
  code: string;
  expiresAt: number;
  maxUses: number;
  currentUses: number;
  status: 'Active' | 'Expired' | 'Revoked';
}

export interface LiveStream {
  id: string;
  roomId: string;
  hostId: string;
  title: string;
  titleAr: string;
  startTime: number;
  status: 'Live' | 'Ended' | 'Scheduled';
  participants: string[];
  viewerCount: number;
  isRecording: boolean;
  recordingUrl?: string;
}

export interface LiveStreamRecording {
  id: string;
  streamId: string;
  roomId: string;
  title: string;
  duration: string;
  fileSize: string;
  downloadUrl: string;
  timestamp: number;
}

export interface MeetingDocumentation {
  id: string;
  roomId: string;
  meetingTitle: string;
  meetingTitleAr: string;
  startTime: number;
  endTime?: number;
  attendees: { userId: string; userName: string; joinTime: number; leaveTime?: number }[];
  decisions: string[];
  transcriptUrl?: string;
  isOfficial: boolean;
}

export interface ChatArchive {
  id: string;
  roomId: string;
  archivedAt: number;
  reason: string;
  summary: string;
  summaryAr: string;
  messageCount: number;
  fileCount: number;
}

export interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: Date;
  isAI?: boolean;
  senderRank?: UserRank;
  translation?: string;
  type?: 'text' | 'image' | 'system' | 'pdf' | 'cad' | 'video' | 'audio' | 'voice-note';
  mediaUrl?: string;
  isEncrypted?: boolean;
  encryptedContent?: string;
  fileMetadata?: {
    name: string;
    size: string;
    extension: string;
  };
}

export interface ChatRoom {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  category: 'lighting' | 'kitchen' | 'classic' | 'modern' | 'general' | 'smart-home' | 'webinar' | 'private' | 'engineering';
  activeUsers: number;
  minRank?: UserRank;
  isLive?: boolean;
  isPaid?: boolean;
  price?: string;
  lastMessage?: string;
  unreadCount?: number;
  isRecording?: boolean;
  host?: string;
  linkedProjectId?: string;
  isWebinarMode?: boolean;
  isLocked?: boolean;
  isEncrypted?: boolean;
  ownerId: string;
  moderators: string[];
  members: string[];
  viewers: string[];
  invitations: ChatInvitation[];
  activeStream?: LiveStream;
  recordings: LiveStreamRecording[];
  meetingDocs: MeetingDocumentation[];
  isArchived?: boolean;
}

export interface DrawingComment {
  id: string;
  drawingId: string;
  elementId: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: number;
  position: { x: number; y: number };
}

export interface DecisionLogEntry {
  id: string;
  projectId: string;
  decision: string;
  decisionAr: string;
  decidedBy: string;
  timestamp: number;
  status: 'Approved' | 'Pending' | 'Rejected';
}

export interface MeetingSummary {
  id: string;
  roomId: string;
  timestamp: number;
  summaryText: string;
  summaryTextAr: string;
  actionItems: string[];
  attendees: string[];
}

export interface ExpertRating {
  id: string;
  expertId: string;
  userId: string;
  rating: number;
  comment: string;
  timestamp: number;
  category: string;
}

export interface PilotOffice {
  id: string;
  name: string;
  location: string;
  projectsCount: number;
  status: 'Active' | 'Completed';
  feedbackScore: number;
}

export interface CaseStudy {
  id: string;
  title: string;
  titleAr: string;
  projectType: string;
  country: string;
  beforeTime: string;
  afterTime: string;
  errorReduction: string;
  summary: string;
  summaryAr: string;
  image: string;
}

export interface MarketProofMetrics {
  selectedCountry: string;
  selectedProjectType: string;
  pilotOffices: PilotOffice[];
  totalErrorsReduced: number;
  averageTimeSaved: string;
  caseStudies: CaseStudy[];
}

export interface MarketplaceItem {
  id: string;
  title: string;
  category: 'template' | 'material' | 'tool' | 'article' | 'session' | '3d-asset';
  price: string;
  image: string;
  seller: string;
  rating?: number;
  fileFormat?: string;
}

export interface B2BJob {
  id: string;
  company: string;
  role: string;
  budget: string;
  location: string;
  requiredRank: UserRank;
}

export interface SecurityStatus {
  sslActive: boolean;
  ddosProtected: boolean;
  twoFactorEnabled: boolean;
  lastBackup: string;
  behavioralRisk: 'Low' | 'Medium' | 'High';
  isAccountIsolated: boolean;
  e2eeEnabled: boolean;
  zeroTrustStatus: 'Active' | 'Scanning' | 'Standby';
  gdprCompliant: boolean;
  fraudDetectionScore: number;
  rlsEnforced: boolean;
  rbacActive: boolean;
}

export interface UserStats {
  points: number;
  articlesCount: number;
  projectsCount: number;
  qualityScore: number; 
  memberRating: number; 
  securityLevel: number; 
  verification?: any;
}

export interface BackupStrategy {
  dailyFull: { status: 'Success' | 'Running'; lastRun: Date; size: string };
  hourlyIncremental: { status: 'Active' | 'Pending'; nextPulse: number; lastPulse: Date };
  externalEncryption: { provider: string; status: 'Encrypted' | 'Syncing'; keyRotation: string };
  restorationTest: { lastTest: Date; result: 'Pass' | 'Fail'; score: number };
}

export interface TaskQueueItem {
  id: string;
  taskName: string;
  status: 'Pending' | 'Processing' | 'Completed' | 'Failed';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  startTime: Date;
  progress: number;
  serviceId: string;
  fileSize?: string;
  estimatedTime?: string;
}

export interface AnalysisEngineMetrics {
  cpuUsage: number;
  memoryUsage: number;
  activeThreads: number;
  processedDrawings: number;
  averageProcessingTime: number;
  errorRate: number;
  uptime: string;
  queueLength: number;
}

export interface AccuracyTestResult {
  id: string;
  timestamp: number;
  drawingName: string;
  expectedErrors: number;
  detectedErrors: number;
  accuracyScore: number;
  deviationPercentage: number;
  falsePositives: number;
  falseNegatives: number;
  notes: string;
}

export interface BuildingCodeRule {
  id: string;
  codeName: string; // e.g., "IBC 2024"
  category: string; // e.g., "Fire Safety", "Accessibility"
  ruleDescription: string;
  parameters: Record<string, any>;
  isActive: boolean;
}

export interface FinancialTransaction {
  id: string;
  type: string;
  amount: number;
  currency: string;
  status: 'Committed' | 'Pending' | 'Failed';
  acidVerified: boolean;
  timestamp: Date;
  traceId: string;
}

export interface BrandColorAnalysisResult {
  primaryColors: { name: string; hex: string; percentage: number; psychology: string }[];
  secondaryColors: { name: string; hex: string; percentage: number; psychology: string }[];
  brandPersonality: string;
  impactScore: number;
  recommendations: string[];
}

export interface ColorDistributionSuggestion {
  zone: string;
  suggestedColors: { name: string; hex: string; ratio: string }[];
  reasoning: string;
  visualImpact: string;
}

export interface CustomerBehaviorImpact {
  metric: string;
  impact: 'Positive' | 'Neutral' | 'Negative';
  percentage: number;
  description: string;
}

export interface ProfessionalBrandEngineResult {
  analysis: BrandColorAnalysisResult;
  distributions: ColorDistributionSuggestion[];
  behaviorImpact: CustomerBehaviorImpact[];
}

export interface CulturalAnalysisResult {
  region: string;
  country: string;
  colorMeanings: { color: string; hex: string; meaning: string; symbolism: string }[];
  religiousContext: string;
  socialNorms: string;
  designRecommendations: string[];
}

export interface ColorIntelligenceResult {
  temperature: { value: string; description: string; kelvinEstimate: number };
  balance: { score: number; status: string; description: string };
  saturation: { level: number; status: string; description: string };
  detectedColors: { name: string; hex: string; percentage: number }[];
  smartImprovements: string[];
}

export interface SmartColorConsultantResult {
  recommendedPalette: { name: string; hex: string; ratio: string; psychology: string }[];
  spatialAnalysis?: {
    lightingImpact: string;
    areaOptimization: string;
    ageSuitability: string;
  };
  psychologicalAlignment: string;
  mlInsights: string;
  confidenceScore: number;
}

export interface FunctionalMatrixResult {
  spaceType: string;
  psychologicalGoal: string;
  activityLevel: string;
  lightingIntensity: string;
  bestColorRange: {
    name: string;
    description: string;
    saturation: string;
    temperature: string;
    hexCodes: string[];
  };
  designTips: string[];
}

export interface NeuroDesignResult {
  wavelengthEffect: {
    color: string;
    wavelength: string;
    brainImpact: string;
    neuralFrequency: string;
  }[];
  heartRateImpact: {
    colorRange: string;
    bpmChange: string;
    physiologicalState: string;
  }[];
  lightingNeuroEffect: {
    type: 'Warm' | 'Cold';
    melatoninImpact: string;
    circadianRhythmEffect: string;
    cognitivePerformance: string;
  }[];
  neuralStimulationLevels: {
    range: string;
    stimulationScore: number; // 1-100
    dominantBrainWave: 'Alpha' | 'Beta' | 'Theta' | 'Delta' | 'Gamma';
    recommendedTask: string;
  }[];
}

export interface VisualFatigueResult {
  fatigueScore: number; // 1-100
  riskLevel: 'Low' | 'Medium' | 'High';
  detectedIssues: string[];
  recommendations: string[];
  contrastRatio: string;
  readabilityScore: number;
}

export interface InteractivePaletteResult {
  palette: { name: string; hex: string; psychology: string; usage: string }[];
  harmonyType: string;
  accessibilityCheck: boolean;
  contrastMatrix: { colors: string[]; score: number }[];
}

export interface EventBusStatus {
  broker: string;
  throughput: string;
  activeConsumers: number;
  lag: number;
  health: 'Optimal' | 'Degraded' | 'Offline';
}

export interface SecurityActivityLog {
  id: string;
  timestamp: number;
  type: 'Access' | 'Encryption' | 'Auth' | 'Policy' | 'System';
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  details: string;
  ipAddress: string;
  location: string;
  deviceId: string;
}

export interface ProjectEncryptionKey {
  projectId: string;
  projectName: string;
  keyId: string;
  algorithm: string;
  status: 'Active' | 'Rotated' | 'Revoked';
  lastRotation: number;
  nextRotation: number;
}

export interface DataRetentionPolicy {
  id: string;
  dataType: string;
  retentionPeriod: string;
  actionAfterPeriod: 'Delete' | 'Archive' | 'Anonymize';
  legalBasis: string;
  lastReview: number;
}

export interface ISOComplianceStatus {
  standard: string; // e.g., "ISO 27001"
  progress: number; // 0-100
  status: 'Initiated' | 'In Progress' | 'Audit Pending' | 'Certified';
  lastAssessment: number;
  nextAudit: number;
  controlsImplemented: number;
  totalControls: number;
}

export interface ClashDetectionResult {
  id: string;
  timestamp: number;
  disciplines: string[]; // e.g., ["Architectural", "Structural"]
  clashType: 'Hard' | 'Soft' | 'Clearance';
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  description: string;
  location: { x: number; y: number; z?: number; floor?: string };
  suggestedSolution: string;
  status: 'Open' | 'Resolved' | 'Ignored';
}

export interface DesignRiskIndicator {
  overallScore: number; // 0-100
  categories: {
    category: string;
    score: number;
    riskLevel: 'Low' | 'Medium' | 'High';
    details: string;
  }[];
  criticalWarnings: string[];
  mitigationStrategy: string;
}

export interface SmartVersionDiff {
  versionA: number;
  versionB: number;
  additions: number;
  deletions: number;
  modifications: number;
  semanticChanges: {
    element: string;
    change: string;
    impact: string;
  }[];
}

export interface EngineeringErrorDatabaseEntry {
  id: string;
  errorCode: string;
  category: string;
  description: string;
  frequency: number;
  commonSolutions: string[];
  relatedCodes: string[];
}

export interface UserCorrectionFeedback {
  id: string;
  timestamp: number;
  originalAIPrediction: string;
  userCorrection: string;
  context: any;
  isLearned: boolean;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  nameAr: string;
  price: number;
  currency: string;
  billingCycle: 'monthly' | 'yearly';
  features: string[];
  featuresAr: string[];
  isPopular?: boolean;
}

export interface UsageContract {
  id: string;
  title: string;
  titleAr: string;
  content: string;
  contentAr: string;
  version: string;
  lastUpdated: number;
}

export interface PaymentGatewayStatus {
  provider: string;
  status: 'Active' | 'Maintenance' | 'Down';
  supportedCurrencies: string[];
  lastTransaction?: number;
}

export interface AISummaryReport {
  overallStatus: 'Ready' | 'Needs Revision' | 'Critical Issues';
  summaryText: string;
  summaryTextAr: string;
  keyMetrics: { label: string; value: string; trend: 'up' | 'down' | 'stable' }[];
  submissionReadiness: {
    municipality: string;
    score: number;
    status: 'Pass' | 'Fail' | 'Warning';
    missingRequirements: string[];
  };
}

export interface SmartNotification {
  id: string;
  type: 'Critical' | 'Warning' | 'Info' | 'Success';
  title: string;
  titleAr: string;
  message: string;
  messageAr: string;
  timestamp: number;
  isRead: boolean;
}
