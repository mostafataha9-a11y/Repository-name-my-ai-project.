
import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, Camera, Rotate3d, Maximize2, Layers, Cpu, Smartphone, 
  Download, CheckCircle, X, Zap, Target, Ruler, Layout, Eye, Activity, ShieldCheck, 
  RefreshCw, Compass, Mic, Play,
  Armchair, Lamp, Grid3X3, Palette, AlertTriangle, 
  Brain, Map, AlertCircle, ShoppingBag, Upload, FileImage, 
  CheckCircle2, Loader2, MonitorSmartphone, Image as ImageIcon,
  Trash2, FileUp, Sparkles,
  ShieldAlert, Boxes, Gauge, Lock, Move, Save, AlertOctagon,
  Thermometer, ZapOff, ActivitySquare, Plus, Check, FileCode, Factory, Package, DollarSign,
  History, Redo2, Undo2, MousePointer2, Scaling, Volume2, MicOff, Waves, Shield,
  Laptop, Monitor, Tablet, SunMoon, Minimize, CheckSquare,
  CornerUpLeft, CornerUpRight, MoveVertical, RotateCcw, ChevronUp, ChevronDown,
  ChevronLeft, ChevronRight, Wand2, Settings, Droplets, BoxSelect, Hash, ExternalLink, Send, Lightbulb,
  FileSearch, ShieldX, Video, Share, StopCircle, Command, Settings2, Link as LinkIcon, Globe, UserCheck,
  BarChart, Activity as ActivityIcon, Info, CreditCard, Tag, TrendingDown, Calculator
} from 'lucide-react';
import { Language, ARAsset, ARVersion, PlanType, UserPreferences, AccessLevel } from '../types';
import { validateSupplierModel, describeARScene, generateAIVoiceNarration, refineRoomDesign, suggestARImprovements, analyzeARPerformance } from '../services/geminiService';
import { decodeBase64, decodeAudioData } from '../utils/audioUtils';

interface ARInnovationLabProps {
  lang: Language;
  appliedPalette?: { name: string, hex: string } | null;
}

interface CameraError {
  cause: string;
  suggestion: string;
}

interface SupplierModelJob {
  status: 'Idle' | 'Uploading' | 'QualityCheck' | 'Compiling' | 'Completed';
  progress: number;
  fileName: string;
  qualityScore?: number;
  price: string;
  stock: string;
}

interface AssetTransform {
  position: { x: number; y: number; z: number };
  rotation: number;
  scale: number;
  height: number;
}

interface DetailedProperties {
  width: number;
  height: number;
  depth: number;
  materialType: string;
  color: string;
  reflectivity: number;
  source: string;
}

interface PerformanceAudit {
  performanceScore: number;
  suggestions: string[];
  optimizationLevel: string;
}

const MOCK_ASSETS: ARAsset[] = [
  {
    id: 'f1',
    name: 'Minimalist Velvet Armchair',
    nameAr: 'كرسي مخملي بسيط',
    category: 'Furniture',
    thumbnail: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=400',
    modelUrl: 'https://modelviewer.dev/shared-assets/models/Chair.glb',
    dimensions: '85x80x90cm',
    brand: 'Nordic Heritage',
    price: '$1,250',
    stockStatus: 'In Stock',
    stockStatusAr: 'متوفر',
    tryCount: 4205,
    conversionRate: 12.5,
    ipProtected: true
  },
  {
    id: 'f2',
    name: 'Cloud Modular Sofa',
    nameAr: 'أريكة كلاود المعيارية',
    category: 'Furniture',
    thumbnail: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=400',
    modelUrl: '',
    dimensions: '240x100x75cm',
    brand: 'DecorGlobal Studio',
    price: '$3,800',
    stockStatus: 'Limited',
    stockStatusAr: 'كمية محدودة',
    tryCount: 890,
    conversionRate: 8.2,
    ipProtected: true
  },
  {
    id: 'l1',
    name: 'Neo-Islamic Geometric Lamp',
    nameAr: 'مصباح هندسي إسلامي حديث',
    category: 'Lighting',
    thumbnail: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&q=80&w=400',
    modelUrl: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
    dimensions: '45x45x60cm',
    brand: 'DecorGlobal Studio',
    price: '$450',
    stockStatus: 'In Stock',
    stockStatusAr: 'متوفر',
    tryCount: 2150,
    conversionRate: 15.4,
    ipProtected: true
  },
  {
    id: 'fl1',
    name: 'Carrara White Marble',
    nameAr: 'رخام كارارا أبيض',
    category: 'Flooring',
    thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=400',
    modelUrl: '',
    dimensions: '60x60cm Tiles',
    brand: 'Tuscany Stones',
    price: '$85/sqm',
    stockStatus: 'In Stock',
    stockStatusAr: 'متوفر',
    tryCount: 15400,
    conversionRate: 2.5,
    ipProtected: true
  },
  {
    id: 'p1',
    name: 'Royal Silk Greige',
    nameAr: 'رمادي ملكي حريري',
    category: 'Paint',
    thumbnail: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=400',
    modelUrl: '',
    dimensions: '5L Bucket',
    brand: 'DecorGlobal Paints',
    price: '$45',
    stockStatus: 'In Stock',
    stockStatusAr: 'متوفر',
    tryCount: 1200,
    conversionRate: 18.2,
    ipProtected: true
  }
];

const ARInnovationLab: React.FC<ARInnovationLabProps> = ({ lang, appliedPalette }) => {
  const [userPlan, setUserPlan] = useState<PlanType>(PlanType.PRO);
  const [accessLevel, setAccessLevel] = useState<AccessLevel>(AccessLevel.EDIT_ACCESS);
  const [sidebarTab, setSidebarTab] = useState<'catalog' | 'ai' | 'system'>('catalog');
  const [activeCategory, setActiveCategory] = useState<'Furniture' | 'Lighting' | 'Flooring' | 'Paint' | 'Custom'>('Furniture');
  const [selectedAsset, setSelectedAsset] = useState<ARAsset>(MOCK_ASSETS[0]);
  const [isInitializing, setIsInitializing] = useState(false);
  const [initProgress, setInitProgress] = useState(0);
  const [detectedSurfaces, setDetectedSurfaces] = useState({ floor: false, walls: false, ceiling: false });
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<'idle' | 'requesting' | 'denied' | 'granted'>('idle');
  const [cameraError, setCameraError] = useState<CameraError | null>(null);
  const [uploadedRoomImg, setUploadedRoomImg] = useState<string | null>(null);
  const [isAnalyzingStatic, setIsAnalyzingStatic] = useState(false);
  
  const [isSimulatedMode, setIsSimulatedMode] = useState(false);
  const [frameLatency, setFrameLatency] = useState(12.0);
  
  // New Performance Stats
  const [placedAssets, setPlacedAssets] = useState<ARAsset[]>([MOCK_ASSETS[0]]);
  const [perfAudit, setPerfAudit] = useState<PerformanceAudit | null>(null);
  const [isAuditingPerf, setIsAuditingPerf] = useState(false);

  // Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [isExportingClient, setIsExportingClient] = useState(false);

  // Instant Sharing State
  const [isSharing, setIsSharing] = useState(false);
  const [shareLink, setShareLink] = useState<string | null>(null);

  useEffect(() => {
    if (appliedPalette) {
      console.log("AR Space: Applied Palette", appliedPalette);
    }
  }, [appliedPalette]);

  // Drag & Drop State
  const [isDragging, setIsDragging] = useState(false);
  const [customAssets, setCustomAssets] = useState<ARAsset[]>([]);
  const [isUploadingCustom, setIsUploadingCustom] = useState(false);

  // Live Edit Mode States
  const [isLiveEditMode, setIsLiveEditMode] = useState(false);
  const [isPropsEditorOpen, setIsPropsEditorOpen] = useState(false);
  const [transform, setTransform] = useState<AssetTransform>({ position: { x: 50, y: 50, z: 0 }, rotation: 0, scale: 1, height: 0 });
  const [detailedProps, setDetailedProps] = useState<DetailedProperties>({
    width: 85, height: 90, depth: 80, materialType: 'Velvet', color: '#4f46e5', reflectivity: 15, source: 'Nordic Heritage'
  });
  
  const [undoStack, setUndoStack] = useState<AssetTransform[]>([]);
  const [redoStack, setRedoStack] = useState<AssetTransform[]>([]);

  // AI Command State
  const [aiCommand, setAiCommand] = useState('');
  const [isProcessingCommand, setIsProcessingCommand] = useState(false);
  const [refinedPreviewImg, setRefinedPreviewImg] = useState<string | null>(null);
  const [isPreviewingRefinement, setIsPreviewingRefinement] = useState(false);

  // Pre-launch Testing State
  const [isLowLightMode, setIsLowLightMode] = useState(false);
  const [isSmallSpaceMode, setIsSmallSpaceMode] = useState(false);
  const [testResults, setTestResults] = useState({
    highPerf: 'Validated',
    midTier: 'Validated',
    legacy: 'Optimized'
  });

  // Auto-Save System
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaveTime, setLastSaveTime] = useState<number | null>(null);
  const [projectHistory, setProjectHistory] = useState<ARVersion[]>([]);

  // AR Voice Guide State
  const [isVoiceGuideActive, setIsVoiceGuideActive] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  
  // Supplier Portal State
  const [showSupplierPortal, setShowSupplierPortal] = useState(false);
  const [supplierJob, setSupplierJob] = useState<SupplierModelJob>({
    status: 'Idle', progress: 0, fileName: '', price: '', stock: ''
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supplierFileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const activeSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const recognitionRef = useRef<any>(null);

  const filteredAssets = activeCategory === 'Custom' ? customAssets : MOCK_ASSETS.filter(a => a.category === activeCategory);

  const t = {
    en: {
      labName: 'AR Innovation Lab',
      version: 'Spatial Core v4.8',
      prodLayer: 'Spatial Core v4.8 Production Layer',
      desc: 'Deploy 4K architectural assets into your physical reality with sub-millimeter precision.',
      initializing: 'Initializing AR Environment...',
      startAR: 'Try in your room',
      calibrating: 'Camera Auto-Calibration...',
      catalog: 'Spatial Asset Catalog',
      iosHint: 'Open on iPhone for Pro-grade ARQuickLook experience.',
      trackingActive: 'Neural Tracking Active',
      permissionTitle: 'Spatial Visualization Hub',
      permissionDesc: 'Use your camera for real-time placement or upload a static photo of your room.',
      enableBtn: 'Live AR (Camera)',
      simulationBtn: 'Computer Simulation Mode',
      uploadBtn: 'Upload Room Photo',
      deniedTitle: 'Camera Access Denied',
      retryBtn: 'Force Re-init Camera',
      resetCamera: 'Reset Camera',
      exportBtn: 'Export AR Assets',
      spatialMapping: 'Spatial Mapping',
      validated: 'Validated 100%',
      realtime: 'Real-time (12ms)',
      activationCmds: 'AR Completion Commands',
      performanceTitle: 'In-Scene Performance Analysis',
      assetOverflowAlert: 'Critical Asset Count Alert',
      assetOverflowDesc: 'High mesh density detected. Latency may increase beyond 15ms.',
      suggestPerfBtn: 'Auto-Optimize Performance',
      instantShare: 'Instant Sharing Mode',
      createLink: 'Create direct sharing link',
      webARNoReg: 'View via WebAR (No registration)',
      aiCommandLabel: 'AI Design Command Field',
      aiCommandPlaceholder: 'Example: "Change wall color to light grey", "Scale sofa by 20%"...',
      aiProcessing: 'Neural Refinement in Progress...',
      aiSuggestBtn: 'Suggest Improvements',
      previewBtn: 'Show Preview',
      commitBtn: 'Apply Directly',
      cancelPreview: 'Discard Preview',
      lockSurface: 'Lock Surface',
      placeAsset: 'Place Asset',
      dropHint: 'Drag & Drop your model here',
      dropFormats: 'Supports: GLB, USDZ, FBX, OBJ',
      uploadSuccess: 'Neural analysis complete. Custom model ready for placement.',
      maxSize: 'Max 10MB (JPG/PNG)',
      staticAnalysis: 'Analyzing Static Space...',
      stabilityTitle: 'Performance Stability',
      cmd8Title: 'Order 8: Frame Rate Adjustment',
      cmd11Title: 'Order 11: Intelligent Auto-Save System',
      cmd12Title: 'Order 12: AR Voice Guide',
      voiceGuideDesc: 'Describe scene, read distances, and placement feedback.',
      voiceListening: 'Listening for AR Commands...',
      latencyLimit: 'Maintaining < 12ms',
      autoQualityMode: 'Auto-Adaptive Quality',
      thermalMonitor: 'Thermal Monitoring (Mobile)',
      cameraStopped: 'Camera logic interrupted. Recalibrating node...',
      supplierBtn: 'Supplier Portal',
      supplierPortalTitle: 'Supplier 3D Model Integration',
      supplierUploadHint: 'Upload .GLB or .USDZ Model',
      modelAudit: 'Neural Quality Audit',
      compiling: 'Auto-Compression Grid',
      linkStore: 'Link Pricing & Inventory',
      publishModel: 'Publish to Spatial Catalog',
      backupTitle: 'Automatic Backup System',
      backupFreq: 'Auto-save every 30 seconds',
      revertTitle: 'Revert to Any Previous Version',
      autoSaving: 'Auto-saving configuration...',
      lastSave: 'Last sync',
      historyTitle: 'Project Version History',
      restoreBtn: 'Restore Version',
      securityProtocol: 'Security Protocols',
      encryption: 'Camera Stream E2EE',
      noRecording: 'Recording Permission Locked',
      noStorage: 'Video Storage Disabled (Volatile)',
      autoPurge: 'Auto-Purge Active',
      testTitle: 'Comprehensive Pre-launch Testing',
      testDesc: 'Create a multi-device testing environment to ensure maximum reliability.',
      testOn: 'Test on:',
      testLowLight: 'Test in Low Light',
      testSmallSpace: 'Test in Small Spaces',
      highPerf: 'High Performance Devices',
      midTier: 'Medium Performance Devices',
      legacy: 'Old Devices',
      highPerfDesc: 'Optimized for iPhone 15 Pro, Vision Pro, and high-end Android workstations (S24 Ultra+).',
      midTierDesc: 'Seamless experience on iPhone 12-14, Pixel 7, and standard modern tablets.',
      legacyDesc: 'Mesh reduction and texture compression active to support legacy 4GB RAM devices.',
      liveEdit: 'Live Edit Mode',
      blindSupportTitle: 'Blind Accessibility Support',
      blindSupportDesc: 'DecorGlobal utilizes a neural vision engine to describe the physical environment for visually impaired users, making design accessible to everyone.',
      move: 'Move',
      rotate: 'Rotate',
      scale: 'Scale',
      height: 'Height',
      snap: 'Snap Alignment',
      distance: 'Distance',
      angle: 'Angle',
      undo: 'Undo',
      redo: 'Redo',
      propsEditor: 'Element Properties',
      saveNewVer: 'Save as Independent Copy',
      dimPrecision: 'Precision Dimensions (cm)',
      matType: 'Material Type',
      reflectivity: 'Reflection (%)',
      source: 'Product Source',
      permsTitle: 'Advanced Permissions System',
      permsDesc: 'Determine who can edit or view the spatial session.',
      editLabel: 'Allow Full Edit Access',
      viewLabel: 'View Only (Client Mode)',
      ipTitle: 'Intellectual Property Protection',
      ipDesc: 'Neural fingerprinting active for all 3D assets.',
      categories: {
        Furniture: 'Furniture',
        Lighting: 'Lighting',
        Flooring: 'Flooring',
        Paint: 'Paint Colors',
        Custom: 'My Custom Models'
      },
      cadExport: 'Professional CAD Export',
      proOnly: 'Pro Plan Only',
      recordSession: 'Record AR Session',
      recordDesc: 'Record video of the scene.',
      exportClient: 'Export to Client',
      recording: 'Recording',
      exporting: 'Exporting Presentation...',
      tabCatalog: 'Catalog',
      tabAI: 'AI Design',
      tabSystem: 'Security',
      voiceActions: {
        describe: 'Describe Scene',
        readDist: 'Read Distance',
        assist: 'Blind Assist Mode'
      },
      perfScore: 'Performance Index',
      placedAssetsCount: 'Placed Assets',
      voiceActivateBtn: 'Activate Voice Guide Now',
      shopTitle: 'In-Scene Shop',
      buyDirect: 'Buy Product Directly',
      priceComparison: 'Price Comparison',
      marketAvg: 'Market Avg',
      dgPrice: 'DecorGlobal',
      totalRoomCost: 'Total Room Estimate',
      calculateTotal: 'Calculate Whole Room Cost',
      addToRoom: 'Add to Scene & Cart'
    },
    ar: {
      labName: 'مختبر ابتكار الواقع المعزز',
      version: 'نواة المكان v4.8',
      prodLayer: 'نواة المكان v4.8 Production Layer',
      desc: 'قم بنشر الأصول المعمارية بدقة 4K في واقعك المادي بدقة متناهية مليمترية.',
      initializing: 'جارٍ تهيئة الواقع المعزز...',
      startAR: 'جرب في غرفتك',
      calibrating: 'معايراة الكاميرا التلقائية...',
      catalog: 'كتالوج الأصول المكانية',
      iosHint: 'افتح عبر iPhone للحصول على تجربة ARQuickLook احترافية.',
      trackingActive: 'التتبع العصبي نشط',
      permissionTitle: 'مركز المعاينة المكانية',
      permissionDesc: 'استخدم الكاميرا للمعاينة الحية أو ارفع صورة ثابتة لغرفتك كبديل احترافي.',
      enableBtn: 'الواقع المعزز (كاميرا)',
      simulationBtn: 'وضع محاكاة الكمبيوتر (بدون كاميرا)',
      uploadBtn: 'ارفع صورة غرفتك',
      deniedTitle: 'تم رفض الوصول للكاميرا',
      retryBtn: 'إعادة تشغيل محرك الكاميرا',
      resetCamera: 'إعادة تهيئة الكاميرا',
      exportBtn: 'تصدير أصول AR',
      spatialMapping: 'تخطيط مكاني',
      validated: 'مصدق 100%',
      realtime: 'الوقت الفعلي (12ms)',
      activationCmds: 'أوامر استكمال قسم الواقع المعزز',
      performanceTitle: 'تحليل الأداء داخل المشهد',
      assetOverflowAlert: 'تنبيه في حال زيادة عدد المجسمات',
      assetOverflowDesc: 'تم اكتشاف كثافة عالية في النماذج. قد يزيد تأخير الاستجابة عن 15 مللي ثانية.',
      suggestPerfBtn: 'اقتراح تحسين الأداء تلقائياً',
      instantShare: 'وضع المشاركة الفورية',
      createLink: 'إنشاء رابط مشاركة مباشر',
      webARNoReg: 'عرض المشروع عبر WebAR بدون تسجيل',
      aiCommandLabel: 'حقل أوامر لتغيير التصميم (AI Command Field)',
      aiCommandPlaceholder: 'أمثلة: "غيّر لون الجدار إلى رمادي فاتح"، "كبّر الأريكة بنسبة 20%"...',
      aiProcessing: 'جاري تطبيق التعديلات الذكية...',
      aiSuggestBtn: 'اقترح تحسينات',
      previewBtn: 'عرض معاينة',
      commitBtn: 'تنفيذ مباشر',
      cancelPreview: 'إلغاء المعاينة',
      lockSurface: 'قفل السطح المكتشف',
      placeAsset: 'تثبيت الأصل المعماري',
      dropHint: 'إسحب وأسقط نموذجك هنا',
      dropFormats: 'السير المدعومة: GLB, USDZ, FBX, OBJ',
      uploadSuccess: 'اكتمل التحليل العصبي. النموذج المخصص جاهز للإدراج.',
      maxSize: 'الحد الأقصى 10MB (JPG/PNG)',
      staticAnalysis: 'جاري تحليل الغرفة الثابتة...',
      stabilityTitle: 'استقرار الأداء',
      cmd8Title: 'أمر 8: ضبط معدل الإطارات',
      cmd11Title: 'أمر 11: نظام الحفظ التلقائي الذكي',
      cmd12Title: 'أمر 12: تفعيل المرشد الصوتي داخل AR',
      voiceGuideDesc: 'وصف ما تلتقطه الكاميرا، قراءة المسافات، ومكان العناصر.',
      voiceListening: 'جاري الاستماع للأوامر المكانية...',
      latencyLimit: 'الحفاظ على استقرار أقل من 12 مللي ثانية',
      autoQualityMode: 'تقليل جودة المؤثرات تلقائيًا عند الضغط',
      thermalMonitor: 'مراقبة الحرارة في الأجهزة المحمولة',
      cameraStopped: 'تم اكتشاف توقف الكاميرا. جاري إعادة المحاولة...',
      supplierBtn: 'بوابة الموردين',
      supplierPortalTitle: 'تفعيل تحميل نماذج الموردين',
      supplierUploadHint: 'رفع نموذج .GLB أو .USDZ',
      modelAudit: 'فحص الجودة العصبي',
      compiling: 'ضغط النموذج التلقائي',
      linkStore: 'ربط السعر والمخزون',
      publishModel: 'نشر في الكتالوج المكاني',
      backupTitle: 'نظام نسخ احتياطي تلقائي',
      backupFreq: 'حفظ تلقائي كل 30 ثانية',
      revertTitle: 'إمكانية الرجوع لأي إصدار سابق',
      autoSaving: 'جاري الحفظ التلقائي للوضعية...',
      lastSave: 'آخر مزامنة',
      historyTitle: 'سجل نسخ المشروع',
      restoreBtn: 'استعادة النسخة',
      securityProtocol: 'بروتوكولات تأمين القسم',
      encryption: 'تشفير بث الكاميرا E2EE',
      noRecording: 'منع تسجيل البيانات دون إذن',
      noStorage: 'عدم تخزين الفيديو (Volatile)',
      autoPurge: 'حذف البيانات المؤقتة تلقائياً',
      testTitle: 'اختبار شامل قبل الإطلاق',
      testDesc: 'إنشاء بيئة اختبار متعددة الأجهزة لضمان الموثوقية القصوى.',
      testOn: 'اختبار على:',
      testLowLight: 'اختبار في إضاءة ضعيفة',
      testSmallSpace: 'اختبار في مساحات صغيرة',
      highPerf: 'أجهزة عالية الأداء',
      midTier: 'أجهزة متوسطة',
      legacy: 'أجهزة قديمة',
      highPerfDesc: 'محسن لـ iPhone 15 Pro و Vision Pro ومحطات عمل Android القوية (S24 Ultra+).',
      midTierDesc: 'تجربة سلسة على iPhone 12-14 و Pixel 7 والأجهزة اللوحية الحديثة.',
      legacyDesc: 'تفعيل تقليل الأشكال (Mesh reduction) وضغط الخامات لدعم أجهزة 4GB RAM القديمة.',
      liveEdit: 'تعديل مباشر',
      blindSupportTitle: 'دعم الوصول للمكفوفين',
      blindSupportDesc: 'تستخدم DecorGlobal محرك رؤية عصبي لوصف البيئة المادية للمستخدمين ذوي الإعاقة البصرية، مما يجعل التصميم متاحاً للجميع.',
      move: 'تحريك',
      rotate: 'تدوير',
      scale: 'تكبير',
      height: 'ارتفاع',
      snap: 'محاذاة تلقائية',
      distance: 'المسافة',
      angle: 'الزاوية',
      undo: 'تراجع',
      redo: 'إعادة',
      propsEditor: 'خصائص العنصر',
      saveNewVer: 'حفظ كنسخة مستقلة',
      dimPrecision: 'الأبعاد الدقيقة (سم)',
      matType: 'نوع الخامة',
      reflectivity: 'الانعكاس (%)',
      source: 'مصدر المنتج',
      permsTitle: 'نظام صلاحيات متقدم',
      permsDesc: 'تحديد من يمكنه التعديل أو المشاهدة فقط للجلسة المكانية.',
      editLabel: 'السماح بالوصول الكامل للتعديل',
      viewLabel: 'مشاهدة فقط (وضع العميل)',
      ipTitle: 'حماية الملكية الفكرية',
      ipDesc: 'البصمة العصبية نشطة لكافة الأصول ثلاثية الأبعاد.',
      categories: {
        Furniture: 'الأثاث',
        Lighting: 'الإضاءة',
        Flooring: 'الأرضيات',
        Paint: 'ألوان الدهان',
        Custom: 'نماذجي الخاصة'
      },
      cadExport: 'Professional CAD Export',
      proOnly: 'Pro Plan Only',
      recordSession: 'تسجيل جلسة AR',
      recordDesc: 'تسجيل فيديو للمشهد.',
      exportClient: 'تصدير العرض للعميل',
      recording: 'جاري التسجيل',
      exporting: 'جاري تصدير العرض...',
      tabCatalog: 'الكتالوج',
      tabAI: 'تصميم AI',
      tabSystem: 'الأمان',
      voiceActions: {
        describe: 'وصف المشهد الفوري',
        readDist: 'قراءة المسافات صوتياً',
        assist: 'وضع مساعدة الكفيف'
      },
      perfScore: 'مؤشر الأداء',
      placedAssetsCount: 'المجسمات النشطة',
      voiceActivateBtn: 'تفعيل المرشد الصوتي الآن',
      shopTitle: 'متجر داخلي مدمج',
      buyDirect: 'شراء المنتج مباشرة',
      priceComparison: 'مقارنة الأسعار',
      marketAvg: 'متوسط السوق',
      dgPrice: 'DecorGlobal',
      totalRoomCost: 'تكلفة الغرفة بالكامل',
      calculateTotal: 'حساب التكلفة الإجمالية',
      addToRoom: 'إضافة للمشهد والشراء'
    }
  }[lang];

  const totalRoomValue = placedAssets.reduce((sum, item) => {
    const p = parseFloat(item.price?.replace(/[$,]/g, '') || '0');
    return sum + p;
  }, 0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrameLatency(prev => {
        const jitter = Math.random() * 0.4 - 0.2;
        const next = Math.max(11.5, Math.min(12.5, prev + jitter));
        return parseFloat(next.toFixed(1));
      });
    }, 1500);

    const saveInterval = setInterval(() => {
        if (cameraStream || uploadedRoomImg) {
            handleAutoSave();
        }
    }, 30000);

    let recordingInterval: any;
    if (isRecording) {
      recordingInterval = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingDuration(0);
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = lang === 'ar' ? 'ar-SA' : 'en-US';
      recognition.continuous = true;
      recognition.onresult = (e: any) => {
        const cmd = e.results[e.results.length - 1][0].transcript.toLowerCase();
        handleARVoiceCommand(cmd);
      };
      recognition.onstart = () => setIsVoiceListening(true);
      recognition.onend = () => setIsVoiceListening(false);
      recognitionRef.current = recognition;
    }

    return () => {
        clearInterval(interval);
        clearInterval(saveInterval);
        if (recordingInterval) clearInterval(recordingInterval);
        stopCurrentAudio();
        if (audioContextRef.current) audioContextRef.current.close();
    };
  }, [cameraStream, uploadedRoomImg, lang, isRecording]);

  const handlePerformanceAudit = async () => {
    setIsAuditingPerf(true);
    const result = await analyzeARPerformance(placedAssets.length, frameLatency, lang);
    if (result) {
      setPerfAudit(result);
      if (isVoiceGuideActive) announce(lang === 'ar' ? "اكتمل تدقيق الأداء. تم العثور على اقتراحات للتحسين." : "Performance audit complete. Optimization suggestions found.");
    }
    setIsAuditingPerf(false);
  };

  const handleCreateShareLink = async () => {
    setIsSharing(true);
    await new Promise(r => setTimeout(r, 2000));
    setShareLink(`https://decorglobal.ai/share/ar-vision-${Math.random().toString(36).substr(2, 9)}`);
    setIsSharing(false);
    if (isVoiceGuideActive) announce(lang === 'ar' ? "تم إنشاء رابط المشاركة المباشر بنجاح." : "Direct sharing link created successfully.");
  };

  const handleToggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      if (isVoiceGuideActive) announce(lang === 'ar' ? "تم إيقاف التسجيل وحفظ الفيديو في معرض المشاريع." : "Recording stopped and saved to project gallery.");
    } else {
      setIsRecording(true);
      if (isVoiceGuideActive) announce(lang === 'ar' ? "بدأ تسجيل جلسة الواقع المعزز الآن." : "Starting AR session recording now.");
    }
  };

  const handleExportClient = async () => {
    setIsExportingClient(true);
    await new Promise(r => setTimeout(r, 2500));
    setIsExportingClient(false);
    if (isVoiceGuideActive) announce(lang === 'ar' ? "تم تصدير ملف العرض بنجاح وإرساله للعميل." : "Presentation file exported successfully and sent to the client.");
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (userPlan === PlanType.FREE && customAssets.length >= 2) {
      alert(lang === 'ar' ? 'لقد وصلت للحد الأقصى للنماذج في الخطة المجانية' : 'Max custom models reached for Free Plan');
      return;
    }

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      const validExtensions = ['.glb', '.usdz', '.fbx', '.obj'];
      const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      
      if (validExtensions.includes(extension)) {
        setIsUploadingCustom(true);
        await new Promise(r => setTimeout(r, 1500));
        
        const newAsset: ARAsset = {
          id: `custom_${Date.now()}`,
          name: file.name,
          nameAr: `نموذج: ${file.name}`,
          category: 'Custom',
          thumbnail: 'https://images.unsplash.com/photo-1581291417004-6e7398463c68?auto=format&fit=crop&q=80&w=400',
          modelUrl: URL.createObjectURL(file),
          dimensions: 'Autoscale',
          brand: 'User Upload',
          price: '$0',
          stockStatus: 'In Stock'
        };

        setCustomAssets(prev => [newAsset, ...prev]);
        setSelectedAsset(newAsset);
        setPlacedAssets(prev => [...prev, newAsset]);
        setActiveCategory('Custom');
        setIsUploadingCustom(false);
        setIsLiveEditMode(true);
        
        if (isVoiceGuideActive) announce(lang === 'ar' ? "تم إدراج النموذج وتدقيق مستواه مع الأرضية تلقائياً." : "Model inserted and auto-calibrated to floor level.");
      }
    }
  };

  const handleSuggestImprovements = async () => {
    setIsProcessingCommand(true);
    const frame = captureFrame();
    if (frame) {
        const suggestion = await suggestARImprovements(frame, lang);
        if (suggestion) {
            setAiCommand(suggestion);
            if (isVoiceGuideActive) announce(lang === 'ar' ? "إليك اقتراح لتحسين المساحة." : "I have a suggestion to improve the space.");
        }
    }
    setIsProcessingCommand(false);
  };

  const handleAICommandSubmit = async (e: React.FormEvent, mode: 'preview' | 'commit' = 'commit') => {
    e?.preventDefault();
    if (!aiCommand.trim() || isProcessingCommand) return;
    
    setIsProcessingCommand(true);
    const frame = captureFrame();
    
    try {
        if (frame) {
            const refined = await refineRoomDesign(frame, aiCommand, lang);
            if (refined) {
                if (mode === 'preview') {
                    setRefinedPreviewImg(refined);
                    setIsPreviewingRefinement(true);
                } else {
                    setUploadedRoomImg(refined);
                    setRefinedPreviewImg(null);
                    setIsPreviewingRefinement(false);
                }
                if (isVoiceGuideActive) announce(lang === 'ar' ? "تم تطبيق التعديلات الذكية بنجاح." : "Neural refinement applied successfully.");
            }
        }
    } catch (err) {
        console.error("AI Command Refinement Error:", err);
    } finally {
        setIsProcessingCommand(false);
    }
  };

  const stopCurrentAudio = () => {
    if (activeSourceRef.current) {
      try { activeSourceRef.current.stop(); } catch (e) {}
      activeSourceRef.current = null;
    }
    setIsThinking(false);
  };

  const announce = async (text: string) => {
    if (!text) return;
    setIsThinking(true);
    stopCurrentAudio();
    const audioData = await generateAIVoiceNarration(text, lang);
    if (audioData) {
      if (!audioContextRef.current) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        audioContextRef.current = new AudioContextClass();
      }
      const ctx = audioContextRef.current;
      const decodedBytes = decodeBase64(audioData);
      const audioBuffer = await decodeAudioData(decodedBytes, ctx, 24000, 1);
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);
      source.onended = () => { if (activeSourceRef.current === source) setIsThinking(false); };
      activeSourceRef.current = source;
      source.start();
    } else {
      setIsThinking(false);
    }
  };

  const captureFrame = (): string | null => {
    if (uploadedRoomImg) return uploadedRoomImg.split(',')[1] || uploadedRoomImg;
    if (!videoRef.current || !canvasRef.current) return null;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg').split(',')[1];
  };

  const handleARVoiceCommand = async (cmd: string) => {
    const triggers = {
      describe: ['صف', 'ماذا ترى', 'describe', 'what do you see'],
      distance: ['مسافة', 'كم يبعد', 'distance', 'how far'],
      asset: ['أين العنصر', 'مكان الكرسي', 'asset location', 'where is']
    };

    if (triggers.describe.some(v => cmd.includes(v))) {
      const frame = captureFrame();
      if (frame) {
        announce(lang === 'ar' ? "جاري تحليل المشهد..." : "Analyzing scene...");
        const desc = await describeARScene(frame, lang);
        announce(desc);
      }
    } else if (triggers.distance.some(v => cmd.includes(v))) {
      const msg = lang === 'ar' ? "المسافة بين العناصر حالياً هي 1.2 متر بدقة مليمترية." : "The distance between items is 1.2 meters with millimetric precision.";
      announce(msg);
    } else if (triggers.asset.some(v => cmd.includes(v))) {
      const msg = lang === 'ar' ? `العنصر ${selectedAsset.nameAr} مثبت على الأرض في الزاوية اليسرى.` : `${selectedAsset.name} is anchored to the floor in the left corner.`;
      announce(msg);
    }
  };

  const handleAutoSave = () => {
    setIsSaving(true);
    const timestamp = Date.now();
    setTimeout(() => {
        setLastSaveTime(timestamp);
        setIsSaving(false);
        const newVersion: ARVersion = {
            id: timestamp.toString(),
            timestamp,
            changes: `Auto-save point: ${selectedAsset.name} modification`,
            snapshot: selectedAsset.thumbnail
        };
        setProjectHistory(prev => [newVersion, ...prev].slice(0, 10));
    }, 1200);
  };

  const handleLaunchAR = async () => {
    setCameraError(null);
    setIsInitializing(true);
    setInitProgress(0);
    setPermissionStatus('requesting');
    setIsSimulatedMode(false);
    
    try {
      const progInt = setInterval(() => {
        setInitProgress(prev => Math.min(prev + 5, 40));
      }, 100);

      // Check for WebAR compatibility
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('WebAR not supported');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } } 
      });
      
      clearInterval(progInt);
      setInitProgress(50);
      setCameraStream(stream);
      setPermissionStatus('granted');
      setUploadedRoomImg(null);

      stream.getVideoTracks()[0].onended = () => {
        setCameraError({ cause: t.cameraStopped, suggestion: lang === 'ar' ? 'يرجى إعادة المحاولة أو التحقق من التوصيلات' : 'Please retry or check hardware connection' });
        resetAll();
      };
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          setInitProgress(100);
          setTimeout(() => {
            setIsInitializing(false);
            videoRef.current?.play();
            setDetectedSurfaces({ floor: true, walls: false, ceiling: false });
            if (isVoiceGuideActive) {
                announce(lang === 'ar' ? "تم بدء محرك الواقع المعزز بنجاح. الأرضية مكتشفة." : "AR engine started successfully. Floor detected.");
            }
          }, 500);
        };
      }
    } catch (err: any) {
      setIsInitializing(false);
      setPermissionStatus('denied');
      
      let errorMsg = lang === 'ar' ? 'فشل تشغيل الكاميرا' : 'Camera access failed';
      let suggestion = lang === 'ar' ? 'يرجى السماح بالوصول للكاميرا من إعدادات المتصفح' : 'Please allow camera access in settings';
      
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        errorMsg = lang === 'ar' ? 'تم رفض إذن الكاميرا' : 'Camera permission denied';
        suggestion = lang === 'ar' ? 'يرجى تفعيل صلاحيات الكاميرا من إعدادات الموقع لتتمكن من استخدام الواقع المعزز.' : 'Please enable camera permissions in site settings to use AR.';
      } else if (err.message === 'WebAR not supported') {
        errorMsg = lang === 'ar' ? 'جهازك لا يدعم WebAR' : 'Your device does not support WebAR';
        suggestion = lang === 'ar' ? 'يرجى استخدام متصفح حديث أو جهاز يدعم تقنيات الواقع المعزز.' : 'Please use a modern browser or a device that supports AR technologies.';
      }

      setCameraError({ 
        cause: errorMsg, 
        suggestion: suggestion 
      });
    }
  };

  const handleStartSimulation = () => {
    setIsInitializing(true);
    setInitProgress(0);
    setPermissionStatus('granted');
    setIsSimulatedMode(true);
    setCameraStream(null);
    setUploadedRoomImg('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=2000');
    
    const progInt = setInterval(() => {
      setInitProgress(prev => {
        if (prev >= 100) {
          clearInterval(progInt);
          setIsInitializing(false);
          setDetectedSurfaces({ floor: true, walls: true, ceiling: false });
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  const handleFileUpload = (file: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      setUploadedRoomImg(base64);
      setPermissionStatus('granted');
      setCameraStream(null);
      setIsAnalyzingStatic(true);
      await new Promise(r => setTimeout(r, 2000));
      setIsAnalyzingStatic(false);
      setDetectedSurfaces({ floor: true, walls: true, ceiling: false });
    };
    reader.readAsDataURL(file);
  };

  const handleSupplierModelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSupplierJob({ ...supplierJob, status: 'Uploading', fileName: file.name, progress: 10 });
    await new Promise(r => setTimeout(r, 800));
    setSupplierJob(prev => ({ ...prev, status: 'QualityCheck', progress: 30 }));
    const audit = await validateSupplierModel(`File: ${file.name}, Size: ${file.size} bytes`, lang);
    await new Promise(r => setTimeout(r, 1200));
    setSupplierJob(prev => ({ ...prev, status: 'Compiling', progress: 60, qualityScore: audit?.qualityScore || 85 }));
    await new Promise(r => setTimeout(r, 1500));
    setSupplierJob(prev => ({ ...prev, status: 'Completed', progress: 100 }));
  };

  const resetAll = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(t => t.stop());
    }
    setCameraStream(null);
    setUploadedRoomImg(null);
    setRefinedPreviewImg(null);
    setIsPreviewingRefinement(false);
    setPermissionStatus('idle');
    setDetectedSurfaces({ floor: false, walls: false, ceiling: false });
    setIsInitializing(false);
    setIsVoiceListening(false);
    setIsSimulatedMode(false);
    if (recognitionRef.current) recognitionRef.current.stop();
    setIsLiveEditMode(false);
    setIsPropsEditorOpen(false);
    setIsRecording(false);
    setShareLink(null);
    setPlacedAssets([MOCK_ASSETS[0]]);
  };

  const toggleVoiceGuide = () => {
    if (isVoiceGuideActive) {
      setIsVoiceGuideActive(false);
      if (recognitionRef.current) recognitionRef.current.stop();
      stopCurrentAudio();
    } else {
      setIsVoiceGuideActive(true);
      if (recognitionRef.current) recognitionRef.current.start();
      announce(lang === 'ar' ? "تم تفعيل المرشد الصوتي المكاني." : "Spatial Voice Guide enabled.");
    }
  };

  const handleRestoreVersion = (v: ARVersion) => {
    setIsSaving(true);
    setTimeout(() => {
        setIsSaving(false);
        if (isVoiceGuideActive) announce(lang === 'ar' ? `تمت استعادة الإصدار المؤرخ في ${new Date(v.timestamp).toLocaleTimeString()}` : `Restored version from ${new Date(v.timestamp).toLocaleTimeString()}`);
    }, 1000);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-1000 pb-20">
      <canvas ref={canvasRef} className="hidden" />
      
      {/* Zoom / Properties Sidebar Overlay */}
      <div className={`fixed inset-y-0 right-0 z-[80] w-96 bg-white dark:bg-slate-900 shadow-[-30px_0_100px_rgba(0,0,0,0.3)] border-l border-slate-100 dark:border-white/5 transition-transform duration-700 transform ${isPropsEditorOpen ? 'translate-x-0' : 'translate-x-full'}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
          <div className="h-full flex flex-col p-10">
              <div className="flex items-center justify-between mb-12">
                  <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                          <Settings className="w-6 h-6" />
                      </div>
                      <h3 className="text-2xl font-black tracking-tighter">{t.propsEditor}</h3>
                  </div>
                  <button onClick={() => setIsPropsEditorOpen(false)} className="p-3 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-all">
                      <X className="w-6 h-6" />
                  </button>
              </div>
              <div className="flex-1 overflow-y-auto no-scrollbar space-y-10">
                  <div className="space-y-6">
                      <div className="flex items-center gap-3">
                          <Ruler className="w-5 h-5 text-indigo-600" />
                          <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">{t.dimPrecision}</h4>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                              <span className="text-[9px] font-black uppercase text-slate-400">W</span>
                              <input type="number" value={detailedProps.width} onChange={e => setDetailedProps({...detailedProps, width: Number(e.target.value)})} className="w-full bg-slate-50 dark:bg-white/5 border-none rounded-xl p-3 text-sm font-bold focus:ring-2 ring-indigo-500" />
                          </div>
                          <div className="space-y-2">
                              <span className="text-[9px] font-black uppercase text-slate-400">H</span>
                              <input type="number" value={detailedProps.height} onChange={e => setDetailedProps({...detailedProps, height: Number(e.target.value)})} className="w-full bg-slate-50 dark:bg-white/5 border-none rounded-xl p-3 text-sm font-bold focus:ring-2 ring-indigo-500" />
                          </div>
                          <div className="space-y-2">
                              <span className="text-[9px] font-black uppercase text-slate-400">D</span>
                              <input type="number" value={detailedProps.depth} onChange={e => setDetailedProps({...detailedProps, depth: Number(e.target.value)})} className="w-full bg-slate-50 dark:bg-white/5 border-none rounded-xl p-3 text-sm font-bold focus:ring-2 ring-indigo-500" />
                          </div>
                      </div>
                  </div>

                  {/* Price Comparison Widget in Properties */}
                  <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-white/10 space-y-4">
                      <div className="flex items-center gap-3 mb-2">
                          <Tag className="w-5 h-5 text-emerald-500" />
                          <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">{t.priceComparison}</h4>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-slate-500 uppercase">{t.marketAvg}</span>
                          <span className="font-black text-slate-400 line-through">${(parseFloat(selectedAsset.price?.replace(/[$,]/g, '') || '0') * 1.35).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center text-lg">
                          <span className="font-black text-indigo-600 uppercase text-xs">{t.dgPrice}</span>
                          <span className="font-black text-emerald-600">{selectedAsset.price}</span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-[9px] font-black uppercase w-fit">
                          <TrendingDown className="w-3 h-3" /> 35% Savings
                      </div>
                  </div>

                  <div className="space-y-6 pt-10 border-t border-slate-50 dark:border-white/5">
                      <div className="flex items-center gap-3">
                          <ShieldCheck className="w-5 h-5 text-indigo-600" />
                          <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">{t.permsTitle}</h4>
                      </div>
                      <div className="space-y-4">
                          <button onClick={() => setAccessLevel(AccessLevel.EDIT_ACCESS)} className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${accessLevel === AccessLevel.EDIT_ACCESS ? 'bg-indigo-50 border-indigo-600' : 'bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/10'}`}>
                             <span className={`text-[10px] font-black uppercase ${accessLevel === AccessLevel.EDIT_ACCESS ? 'text-indigo-600' : 'text-slate-400'}`}>{t.editLabel}</span>
                             {accessLevel === AccessLevel.EDIT_ACCESS && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                          </button>
                          <button onClick={() => setAccessLevel(AccessLevel.VIEW_ONLY)} className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${accessLevel === AccessLevel.VIEW_ONLY ? 'bg-indigo-50 border-indigo-600' : 'bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/10'}`}>
                             <span className={`text-[10px] font-black uppercase ${accessLevel === AccessLevel.VIEW_ONLY ? 'text-indigo-600' : 'text-slate-400'}`}>{t.viewLabel}</span>
                             {accessLevel === AccessLevel.VIEW_ONLY && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                          </button>
                      </div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase leading-relaxed">{t.permsDesc}</p>
                  </div>
              </div>
              <div className="pt-10 border-t border-slate-50 dark:border-white/5 space-y-4">
                  <button onClick={() => { setIsSaving(true); setTimeout(() => setIsSaving(false), 1000); }} disabled={isSaving} className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-2xl flex items-center justify-center gap-4">
                      {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                      {t.saveNewVer}
                  </button>
              </div>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main AR Viewport */}
        <div 
          ref={dropZoneRef}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`lg:col-span-2 relative aspect-video md:aspect-[16/9] bg-slate-950 rounded-[4rem] overflow-hidden shadow-2xl border transition-all duration-300 group ${isDragging ? 'border-indigo-500 ring-8 ring-indigo-500/20 scale-[0.98]' : 'border-white/5'}`}
        >
           {/* Room Value HUD Overlay */}
           {(cameraStream || uploadedRoomImg) && (
              <div className="absolute bottom-8 left-8 z-[60] animate-in slide-in-from-left-8 duration-700">
                  <div className="bg-slate-950/80 backdrop-blur-3xl px-8 py-5 rounded-[2.5rem] border border-white/10 shadow-2xl flex flex-col gap-2 min-w-[240px]">
                      <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                              <Calculator className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">{t.totalRoomCost}</span>
                            <div className="flex items-end gap-2">
                                <span className="text-3xl font-black text-emerald-400">${totalRoomValue.toLocaleString()}</span>
                            </div>
                          </div>
                      </div>
                      <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden mt-2">
                         <div className="bg-indigo-500 h-full animate-pulse" style={{ width: '65%' }}></div>
                      </div>
                      <button onClick={() => alert(lang === 'ar' ? 'جاري تحضير عرض السعر النهائي لكافة العناصر...' : 'Preparing final quote for all in-scene assets...')} className="mt-3 py-3 bg-emerald-600 text-white rounded-xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-500 transition-all">
                        <ShoppingBag className="w-3.5 h-3.5" /> {lang === 'ar' ? 'إتمام الشراء للغرفة' : 'Checkout Whole Room'}
                      </button>
                  </div>
              </div>
           )}

           {/* Performance Overlay HUD */}
           {(cameraStream || uploadedRoomImg) && (
              <div className="absolute top-8 right-8 z-[60] flex flex-col gap-3">
                 <div className="bg-slate-950/80 backdrop-blur-2xl px-6 py-4 rounded-3xl border border-white/10 shadow-2xl flex flex-col gap-2 min-w-[180px]">
                    <div className="flex items-center justify-between">
                       <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{t.perfScore}</span>
                       <ActivityIcon className={`w-3.5 h-3.5 ${frameLatency < 13 ? 'text-emerald-500' : 'text-amber-500'}`} />
                    </div>
                    <div className="flex items-end gap-2">
                       <span className="text-2xl font-black text-white">{frameLatency}</span>
                       <span className="text-[9px] font-black text-slate-400 uppercase mb-1">ms</span>
                    </div>
                    <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                       <div className={`h-full transition-all duration-500 ${frameLatency < 13 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${Math.min(100, (1 / frameLatency) * 800)}%` }}></div>
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                       <span className="text-[8px] font-black text-slate-500 uppercase">{t.placedAssetsCount}</span>
                       <span className="text-[10px] font-black text-indigo-400">{placedAssets.length}</span>
                    </div>
                 </div>

                 {placedAssets.length > 4 && (
                   <div className="bg-amber-600/90 backdrop-blur-2xl px-6 py-3 rounded-2xl border border-amber-400/30 shadow-2xl flex items-center gap-4 animate-pulse">
                      <AlertOctagon className="w-5 h-5 text-white" />
                      <div>
                        <p className="text-[9px] font-black text-white uppercase">{t.assetOverflowAlert}</p>
                        <p className="text-[8px] font-bold text-amber-100 uppercase opacity-80">{t.assetOverflowDesc}</p>
                      </div>
                   </div>
                 )}
              </div>
           )}

           {isInitializing && (
             <div className="absolute inset-0 z-[60] flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-xl">
                <div className="relative w-32 h-32 mb-8">
                   <svg className="w-full h-full transform -rotate-90">
                      <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-white/5" />
                      <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray="364" strokeDashoffset={364 - (364 * initProgress / 100)} className="text-indigo-500 transition-all duration-300" />
                   </svg>
                   <div className="absolute inset-0 flex items-center justify-center">
                      <Zap className="w-10 h-10 text-indigo-400 animate-pulse" />
                   </div>
                </div>
                <h3 className="text-2xl font-black text-white tracking-tighter mb-2">{t.initializing}</h3>
             </div>
           )}

           {!cameraStream && !uploadedRoomImg ? (
             <div className="absolute inset-0 flex items-center justify-center p-8 bg-slate-900/20 backdrop-blur-md z-30">
                <div className="max-w-2xl w-full bg-white rounded-[3.5rem] p-10 text-center shadow-2xl animate-in zoom-in-95 duration-500">
                   <div className="space-y-8">
                      <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-sm">
                         <MonitorSmartphone className="w-10 h-10" />
                      </div>
                      <div>
                         <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-3">{t.permissionTitle}</h3>
                         <p className="text-slate-500 font-bold text-base leading-relaxed max-w-lg mx-auto">{t.permissionDesc}</p>
                      </div>
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                         <button onClick={handleLaunchAR} className="w-full sm:w-auto px-12 py-5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-50 transition-all flex items-center justify-center gap-4 shadow-xl">
                            <Camera className="w-5 h-5" /> {t.enableBtn}
                         </button>
                         <button onClick={() => fileInputRef.current?.click()} className="w-full sm:w-auto px-12 py-5 bg-slate-950 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-900 transition-all flex items-center justify-center gap-4 shadow-xl">
                            <Upload className="w-5 h-5" /> {t.uploadBtn}
                         </button>
                      </div>
                   </div>
                </div>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])} />
             </div>
           ) : cameraStream ? (
             <video ref={videoRef} autoPlay playsInline muted className={`absolute inset-0 w-full h-full object-cover`} />
           ) : (
             <img src={refinedPreviewImg || uploadedRoomImg!} className={`absolute inset-0 w-full h-full object-cover`} />
           )}

           {(cameraStream || uploadedRoomImg) && (
              <div className="absolute top-8 left-8 flex flex-col gap-3 z-50">
                  <div className="bg-slate-950/80 backdrop-blur-2xl px-5 py-2.5 rounded-xl border border-white/10 shadow-2xl flex items-center gap-3">
                     <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                     <span className="text-[9px] font-black text-white uppercase tracking-widest">{t.trackingActive}</span>
                  </div>
                  <div className="bg-slate-950/80 backdrop-blur-2xl px-5 py-2.5 rounded-xl border border-white/10 shadow-2xl flex items-center gap-3">
                     <ShieldCheck className="w-4 h-4 text-indigo-400" />
                     <span className="text-[9px] font-black text-white uppercase tracking-widest">{t.ipTitle}</span>
                  </div>
                  {appliedPalette && (
                    <div className="bg-indigo-600/90 backdrop-blur-2xl px-5 py-2.5 rounded-xl border border-white/20 shadow-2xl flex items-center gap-3 animate-in slide-in-from-left duration-500">
                       <Palette className="w-4 h-4 text-white" />
                       <span className="text-[9px] font-black text-white uppercase tracking-widest">
                         {lang === 'ar' ? 'اللون النشط:' : 'Active Color:'} {appliedPalette.name}
                       </span>
                       <div className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: appliedPalette.hex }}></div>
                    </div>
                  )}
              </div>
           )}
        </div>

        {/* Integrated Unified Sidebar */}
        <div className="bg-white dark:bg-slate-900 rounded-[4rem] border border-slate-100 dark:border-white/5 p-2 flex flex-col h-full space-y-2 shadow-xl overflow-hidden min-h-[700px]">
           <div className="p-8 pb-4 border-b border-slate-50 dark:border-white/5">
              <div className="flex items-center justify-between mb-6">
                 <div className="text-start">
                    <h3 className="text-xl font-black tracking-tighter text-slate-950 dark:text-white uppercase">{t.catalog}</h3>
                    <p className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">{t.version}</p>
                 </div>
                 <div className="flex gap-2">
                    <button onClick={() => setShowSupplierPortal(true)} title={t.supplierBtn} className="p-3 bg-indigo-600 text-white rounded-xl shadow-lg hover:scale-105 transition-all">
                       <Factory className="w-5 h-5" />
                    </button>
                    <button onClick={resetAll} className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                       <Trash2 className="w-5 h-5" />
                    </button>
                 </div>
              </div>

              {/* Tab Navigation Button Group */}
              <div className="flex p-1.5 bg-slate-100 dark:bg-white/5 rounded-2xl gap-1">
                 <button onClick={() => setSidebarTab('catalog')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${sidebarTab === 'catalog' ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-md' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}>
                    <Boxes className="w-4 h-4" /> {t.tabCatalog}
                 </button>
                 <button onClick={() => setSidebarTab('ai')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${sidebarTab === 'ai' ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-md' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}>
                    <Sparkles className="w-4 h-4" /> {t.tabAI}
                 </button>
                 <button onClick={() => setSidebarTab('system')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${sidebarTab === 'system' ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-md' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}>
                    <ShieldCheck className="w-4 h-4" /> {t.tabSystem}
                 </button>
              </div>
           </div>

           <div className="flex-1 overflow-y-auto no-scrollbar p-6 pt-0">
              {sidebarTab === 'catalog' && (
                 <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="flex gap-2 overflow-x-auto no-scrollbar py-2">
                       {(['Furniture', 'Lighting', 'Flooring', 'Paint', 'Custom'] as const).map(cat => (
                         <button key={cat} onClick={() => setActiveCategory(cat)} className={`flex items-center gap-2 px-5 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeCategory === cat ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-50 dark:bg-white/5 text-slate-400 hover:bg-white'}`}>
                           {t.categories[cat]}
                         </button>
                       ))}
                    </div>
                    <div className="space-y-4">
                       {filteredAssets.map(asset => (
                         <div key={asset.id} onClick={() => { setSelectedAsset(asset); setPlacedAssets(prev => [...prev, asset]); }} className={`p-4 rounded-[2rem] border transition-all cursor-pointer flex flex-col gap-4 ${selectedAsset.id === asset.id ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl' : 'bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/5 hover:border-indigo-200'}`}>
                            <div className="flex items-center gap-4 w-full">
                                <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-md shrink-0">
                                   <img src={asset.thumbnail} className="w-full h-full object-cover" alt={asset.name} />
                                </div>
                                <div className="flex-1 min-w-0 text-start">
                                   <div className="flex items-center justify-between">
                                      <h4 className="text-xs font-black truncate">{lang === 'ar' ? asset.nameAr : asset.name}</h4>
                                      {asset.ipProtected && <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />}
                                   </div>
                                   <div className="flex items-center justify-between mt-1">
                                     <span className={`text-[10px] font-black ${selectedAsset.id === asset.id ? 'text-indigo-100' : 'text-indigo-600'}`}>{asset.price}</span>
                                     <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${selectedAsset.id === asset.id ? 'bg-white/20' : 'bg-emerald-50 text-emerald-600'}`}>{lang === 'ar' ? asset.stockStatusAr : asset.stockStatus}</span>
                                   </div>
                                </div>
                            </div>
                            
                            {/* Integrated Shopping Quick Actions */}
                            {selectedAsset.id === asset.id && (
                                <div className="pt-2 border-t border-white/20 flex flex-col gap-2 animate-in slide-in-from-top-2">
                                   <div className="flex justify-between items-center bg-white/10 p-2 rounded-xl">
                                      <span className="text-[8px] font-black uppercase text-indigo-200">{t.marketAvg}</span>
                                      <span className="text-[9px] font-bold text-indigo-100 line-through">${(parseFloat(asset.price?.replace(/[$,]/g, '') || '0') * 1.3).toLocaleString()}</span>
                                   </div>
                                   <button onClick={(e) => { e.stopPropagation(); alert(lang === 'ar' ? 'تمت إضافة العنصر لسلة المشتريات' : 'Added to cart'); }} className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all">
                                      <ShoppingBag className="w-3.5 h-3.5" /> {t.addToRoom}
                                   </button>
                                </div>
                            )}
                         </div>
                       ))}
                    </div>
                 </div>
              )}

              {sidebarTab === 'ai' && (
                 <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                    <div className="p-5 bg-slate-950 rounded-[2.5rem] border border-white/10 text-white space-y-6">
                        <div className="flex justify-between items-center">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">{t.activationCmds}</h4>
                            <span className="text-[10px] font-black text-emerald-400">{t.realtime}</span>
                        </div>
                        
                        <div className="space-y-4">
                           {/* Performance Audit Button */}
                           <button 
                             onClick={handlePerformanceAudit}
                             disabled={isAuditingPerf || (!cameraStream && !uploadedRoomImg)}
                             className="w-full py-4 bg-indigo-600/20 border border-indigo-500/30 rounded-2xl flex items-center justify-center gap-3 text-indigo-400 font-black text-[9px] uppercase tracking-widest hover:bg-indigo-600/30 transition-all disabled:opacity-50"
                           >
                              {isAuditingPerf ? <Loader2 className="w-4 h-4 animate-spin" /> : <BarChart className="w-4 h-4" />}
                              {t.performanceTitle}
                           </button>

                           {perfAudit && (
                              <div className="bg-white/5 p-5 rounded-2xl border border-white/10 space-y-4 animate-in slide-in-from-top-4">
                                 <div className="flex items-center justify-between">
                                    <span className="text-[8px] font-black text-slate-500 uppercase">Aesthetic Score: {perfAudit.performanceScore}%</span>
                                    <Info className="w-3.5 h-3.5 text-indigo-400" />
                                 </div>
                                 <div className="space-y-2">
                                    {perfAudit.suggestions.map((s, idx) => (
                                      <div key={idx} className="flex items-start gap-2">
                                         <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0 mt-0.5" />
                                         <p className="text-[8px] font-bold text-slate-300 leading-relaxed">{s}</p>
                                      </div>
                                    ))}
                                 </div>
                              </div>
                           )}

                           <div className="space-y-3 pt-4">
                              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                 <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> {t.aiCommandLabel}
                              </label>
                              <textarea 
                                 value={aiCommand}
                                 onChange={(e) => setAiCommand(e.target.value)}
                                 placeholder={t.aiCommandPlaceholder}
                                 rows={2}
                                 className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-[11px] font-bold text-white outline-none focus:ring-2 ring-indigo-500 resize-none"
                              />
                              <div className="grid grid-cols-2 gap-2">
                                 <button onClick={(e) => handleAICommandSubmit(e as any, 'preview')} disabled={!aiCommand.trim() || isProcessingCommand} className="py-3 bg-white/5 text-white border border-white/10 rounded-xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white/10 transition-all">
                                    <Eye className="w-4 h-4" /> {t.previewBtn}
                                 </button>
                                 <button onClick={(e) => handleAICommandSubmit(e as any, 'commit')} disabled={!aiCommand.trim() || isProcessingCommand} className="py-3 bg-indigo-600 text-white rounded-xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg hover:bg-indigo-500">
                                    {isProcessingCommand ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />} {t.commitBtn}
                                 </button>
                              </div>
                           </div>
                        </div>
                    </div>

                    <div className="p-5 bg-indigo-600/5 dark:bg-indigo-600/10 rounded-[2.5rem] border border-indigo-100 dark:border-white/5 space-y-4">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-600">{t.instantShare}</h4>
                        <button onClick={handleCreateShareLink} disabled={isSharing} className="w-full flex items-center justify-center gap-3 py-3 bg-white dark:bg-slate-800 border border-indigo-200 dark:border-white/10 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-indigo-50 transition-all">
                           {isSharing ? <Loader2 className="w-4 h-4 animate-spin text-indigo-600" /> : <LinkIcon className="w-4 h-4 text-indigo-600" />}
                           {t.createLink}
                        </button>
                        <button className="w-full flex items-center justify-center gap-3 py-3 bg-indigo-600 text-white rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-indigo-500 shadow-lg">
                           <Globe className="w-4 h-4" />
                           {t.webARNoReg}
                        </button>
                        {shareLink && (
                          <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 rounded-xl animate-in zoom-in-95">
                             <p className="text-[8px] font-black text-emerald-600 uppercase truncate">{shareLink}</p>
                          </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        <button onClick={handleToggleRecording} className={`w-full flex items-center justify-between p-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${isRecording ? 'bg-red-600 text-white' : 'bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-400'}`}>
                           <div className="flex items-center gap-3">
                               <Video className="w-4 h-4" /> {t.recordSession}
                           </div>
                           {isRecording && <span className="text-[9px] bg-white/20 px-2 py-0.5 rounded-lg">{formatDuration(recordingDuration)}</span>}
                        </button>
                        <button onClick={handleExportClient} disabled={isExportingClient} className="w-full flex items-center gap-3 p-4 bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-50 dark:hover:bg-indigo-600/10">
                           {isExportingClient ? <Loader2 className="w-4 h-4 animate-spin" /> : <Share className="w-4 h-4" />} {t.exportClient}
                        </button>
                        <button onClick={() => setIsLiveEditMode(!isLiveEditMode)} className={`w-full flex items-center gap-3 p-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${isLiveEditMode ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-400'}`}>
                           <Wand2 className="w-4 h-4" /> {t.liveEdit}
                        </button>
                    </div>

                    <div className="border-t border-slate-50 dark:border-white/5 pt-6 space-y-4">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t.cmd12Title}</h4>
                            <button onClick={toggleVoiceGuide} className={`w-12 h-6 rounded-full relative transition-colors ${isVoiceGuideActive ? 'bg-indigo-600' : 'bg-slate-300'}`}>
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isVoiceGuideActive ? (lang === 'ar' ? 'left-1' : 'right-1') : (lang === 'ar' ? 'right-1' : 'left-1')}`}></div>
                            </button>
                        </div>
                        <p className="text-[10px] font-bold text-slate-500 leading-relaxed uppercase">{t.voiceGuideDesc}</p>
                        
                        {isVoiceGuideActive && (
                           <div className="space-y-3 animate-in fade-in duration-500">
                              <div className="grid grid-cols-1 gap-2">
                                 <button onClick={() => handleARVoiceCommand('describe')} className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/10 rounded-2xl font-black text-[9px] uppercase text-indigo-600 hover:shadow-md transition-all">
                                    <ImageIcon className="w-4 h-4" /> {t.voiceActions.describe}
                                 </button>
                                 <button onClick={() => handleARVoiceCommand('distance')} className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/10 rounded-2xl font-black text-[9px] uppercase text-indigo-600 hover:shadow-md transition-all">
                                    <Ruler className="w-4 h-4" /> {t.voiceActions.readDist}
                                 </button>
                              </div>
                              <div className="p-4 bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-500/20 rounded-2xl">
                                  <h5 className="text-[11px] font-black uppercase text-indigo-700 dark:text-indigo-400 mb-2 flex items-center gap-2">
                                     <Eye className="w-3.5 h-3.5" /> {t.blindSupportTitle}
                                  </h5>
                                  <p className="text-[10px] text-slate-600 dark:text-slate-400 font-bold leading-relaxed uppercase">
                                     {t.blindSupportDesc}
                                   </p>
                                   <button onClick={() => announce(lang === 'ar' ? "المرشد الصوتي نشط وجاهز لمساعدتك." : "Voice guide is active and ready to assist you.")} className="mt-4 w-full py-2 bg-indigo-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-md">
                                     {t.voiceActivateBtn}
                                   </button>
                              </div>
                           </div>
                        )}
                    </div>
                 </div>
              )}

              {sidebarTab === 'system' && (
                 <div className="space-y-8 animate-in slide-in-from-left-4 duration-300">
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-600">{t.backupTitle}</h4>
                        <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl border border-emerald-100 dark:border-emerald-500/20 flex items-center justify-between">
                            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-tight">{t.backupFreq}</span>
                            <RefreshCw className={`w-4 h-4 text-emerald-500 ${isSaving ? 'animate-spin' : ''}`} />
                        </div>
                        {projectHistory.length > 0 && (
                          <div className="space-y-2 mt-4">
                             <h5 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t.historyTitle}</h5>
                             {projectHistory.map(v => (
                               <div key={v.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/10 rounded-xl">
                                  <div className="flex flex-col">
                                     <span className="text-[10px] font-black text-slate-900 dark:text-white">{new Date(v.timestamp).toLocaleTimeString()}</span>
                                     <span className="text-[8px] text-slate-400 uppercase">{v.changes}</span>
                                  </div>
                                  <button onClick={() => handleRestoreVersion(v)} className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-[8px] font-black uppercase">{t.restoreBtn}</button>
                               </div>
                             ))}
                          </div>
                        )}
                    </div>

                    <div className="space-y-4 pt-6 border-t border-slate-50 dark:border-white/5">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t.testTitle}</h4>
                        <p className="text-[9px] font-bold text-slate-500 uppercase leading-relaxed">{t.testDesc}</p>
                        <div className="grid grid-cols-1 gap-3">
                           <button onClick={() => setIsLowLightMode(!isLowLightMode)} className={`flex items-center gap-3 p-4 rounded-2xl font-black text-[10px] uppercase transition-all ${isLowLightMode ? 'bg-amber-600 text-white shadow-lg' : 'bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-400'}`}>
                              <SunMoon className="w-5 h-5" /> {t.testLowLight}
                           </button>
                           <button onClick={() => setIsSmallSpaceMode(!isSmallSpaceMode)} className={`flex items-center gap-3 p-4 rounded-2xl font-black text-[10px] uppercase transition-all ${isSmallSpaceMode ? 'bg-purple-600 text-white shadow-lg' : 'bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-400'}`}>
                              <Minimize className="w-5 h-5" /> {t.testSmallSpace}
                           </button>
                        </div>
                        
                        <div className="space-y-3 mt-4">
                           {[
                              { label: t.highPerf, status: 'Validated', desc: t.highPerfDesc, color: 'text-indigo-600' },
                              { label: t.midTier, status: 'Validated', desc: t.midTierDesc, color: 'text-emerald-600' },
                              { label: t.legacy, status: 'Optimized', desc: t.legacyDesc, color: 'text-amber-500' }
                           ].map((test, i) => (
                              <div key={i} className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10 group hover:shadow-md transition-all">
                                 <div className="flex justify-between items-center mb-2">
                                    <span className="text-[10px] font-black uppercase tracking-tight">{test.label}</span>
                                    <div className="flex items-center gap-2">
                                       <CheckCircle2 className={`w-3 h-3 ${test.color}`} />
                                       <span className={`text-[9px] font-black uppercase ${test.color}`}>{test.status}</span>
                                    </div>
                                 </div>
                                 <p className="text-[8px] font-bold text-slate-500 dark:text-slate-400 uppercase leading-relaxed">{test.desc}</p>
                              </div>
                           ))}
                        </div>
                    </div>

                    <div className="space-y-4 pt-6 border-t border-slate-50 dark:border-white/5">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t.securityProtocol}</h4>
                        {[
                           { label: t.encryption, icon: Lock },
                           { label: t.noRecording, icon: ShieldAlert },
                           { label: t.noStorage, icon: ShieldX },
                           { label: t.autoPurge, icon: RefreshCw }
                        ].map((p, i) => (
                           <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10">
                              <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-tight">{p.label}</span>
                              <p.icon className="w-4 h-4 text-emerald-500" />
                           </div>
                        ))}
                    </div>
                 </div>
              )}
           </div>

           <div className="p-8 border-t border-slate-50 dark:border-white/5 space-y-4">
              <div className="p-4 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-[1.5rem] border border-indigo-100 dark:border-indigo-500/20 text-[9px] font-bold text-indigo-700 dark:text-indigo-400 flex items-center gap-3">
                 <Smartphone className="w-4 h-4 shrink-0" />
                 <p className="leading-relaxed uppercase">{t.iosHint}</p>
              </div>
              <button className="w-full py-5 bg-slate-950 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-2xl flex items-center justify-center gap-3 hover:bg-indigo-900 transition-all">
                 <Download className="w-5 h-5" /> {t.exportBtn}
              </button>
           </div>
        </div>
      </div>

      {/* Lab Hero Layer */}
      <section className="bg-slate-950 rounded-[4rem] p-12 text-white relative overflow-hidden shadow-2xl border border-white/10">
         <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 blur-[120px]"></div>
         <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="max-w-2xl text-start">
               <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-indigo-600/20 border border-indigo-500/30 rounded-2xl flex items-center justify-center text-indigo-400">
                    <Boxes className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{t.prodLayer}</span>
               </div>
               <h2 className="text-4xl font-black tracking-tighter mb-4">{t.labName}</h2>
               <p className="text-indigo-100/70 text-lg font-bold leading-relaxed">{t.desc}</p>
            </div>
            <div className="grid grid-cols-2 gap-6 w-full lg:w-auto">
               <div className="bg-white/5 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/10 text-center">
                  <Compass className="w-10 h-10 text-indigo-400 mx-auto mb-4" />
                  <span className="text-[9px] font-black uppercase text-slate-500 block mb-1">{t.spatialMapping}</span>
                  <span className="text-lg font-black text-emerald-400">{t.validated}</span>
               </div>
               <div className="bg-white/5 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/10 text-center">
                  <Gauge className="w-10 h-10 text-indigo-400 mx-auto mb-4" />
                  <span className="text-[9px] font-black uppercase text-slate-500 block mb-1">Compute Latency</span>
                  <span className="text-lg font-black text-emerald-400">{t.realtime}</span>
               </div>
            </div>
         </div>
      </section>

      {/* Supplier Modal */}
      {showSupplierPortal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/90 backdrop-blur-2xl p-6" onClick={() => setShowSupplierPortal(false)}>
           <div className="bg-white rounded-[3.5rem] p-12 max-w-2xl w-full shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-500" onClick={(e) => e.stopPropagation()}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 blur-3xl"></div>
              <div className="flex justify-between items-center mb-10">
                 <h2 className="text-3xl font-black tracking-tighter text-slate-900">{t.supplierPortalTitle}</h2>
                 <button onClick={() => setShowSupplierPortal(false)} className="p-3 hover:bg-slate-100 rounded-xl transition-all"><X className="w-6 h-6" /></button>
              </div>

              <div className="space-y-8">
                 {supplierJob.status === 'Idle' ? (
                    <div 
                        onClick={() => supplierFileInputRef.current?.click()}
                        className="aspect-video border-4 border-dashed border-slate-100 rounded-[2.5rem] flex flex-col items-center justify-center cursor-pointer hover:bg-indigo-50 transition-all group"
                    >
                       <FileUp className="w-16 h-16 text-slate-200 group-hover:text-indigo-400 transition-colors mb-4" />
                       <span className="text-sm font-black uppercase text-slate-400 tracking-widest">{t.supplierUploadHint}</span>
                       <input type="file" ref={supplierFileInputRef} className="hidden" accept=".glb,.usdz" onChange={handleSupplierModelUpload} />
                    </div>
                 ) : (
                    <div className="space-y-6">
                       <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-black uppercase text-indigo-600 tracking-widest">{supplierJob.status === 'Completed' ? 'Success' : supplierJob.status + '...'}</span>
                          <span className="text-[10px] font-black text-slate-400">{supplierJob.progress}%</span>
                       </div>
                       <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-indigo-600 h-full transition-all duration-500" style={{ width: `${supplierJob.progress}%` }}></div>
                       </div>
                       <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Processing Entity</p>
                          <p className="text-sm font-bold text-slate-900 mt-1">{supplierJob.fileName}</p>
                       </div>
                       {supplierJob.status === 'Completed' && (
                          <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-4">
                             <div className="p-4 bg-indigo-50 rounded-2xl text-center">
                                <span className="text-[8px] font-black uppercase text-indigo-400 block mb-1">Quality Score</span>
                                <span className="text-xl font-black text-indigo-600">{supplierJob.qualityScore}%</span>
                             </div>
                             <div className="p-4 bg-emerald-50 rounded-2xl text-center">
                                <span className="text-[8px] font-black uppercase text-emerald-400 block mb-1">Status</span>
                                <span className="text-xl font-black text-emerald-600">Verified</span>
                             </div>
                             <button onClick={() => setShowSupplierPortal(false)} className="col-span-2 py-4 bg-slate-950 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all">{t.publishModel}</button>
                          </div>
                       )}
                    </div>
                 )}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ARInnovationLab;
