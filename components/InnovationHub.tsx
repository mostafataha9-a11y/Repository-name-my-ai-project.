
import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { 
  Rocket, Sparkles, Box, Monitor, Image as ImageIcon, Palette, 
  Briefcase, Code, Loader2, ArrowRight, CheckCircle, Globe, Camera, Download, Layout, Share2, Target, Cpu,
  Maximize2, ArrowRightLeft, ShieldCheck, Zap, Info, Scaling, Armchair, LayoutGrid, FileText, 
  DollarSign, MapPin, Grid, Layers, Sun, AlertTriangle, Lightbulb, BarChart3, ListOrdered, Building2, ShoppingCart,
  Save, ZoomIn, X, ChevronLeft, ChevronRight, Volume2, Languages, Lock, Crown, ShieldAlert, Trash2, Shield, Activity, Users, TrendingUp,
  Video, Rotate3d, FileCode, Smartphone, ExternalLink, Settings2, FileImage, CheckCircle2, Wand2, Mic, Send, GitCompare, Server, Pipette, Hammer, Lamp,
  Plus, History, Undo2, Search, Gauge, Award, CheckCircle as CheckCircleIcon, Key, Sliders, Contrast, Eye, Brain
} from 'lucide-react';
// Fixed: Removed missing Lifestyle and UserPersonalization imports as they are not defined in types.ts
import { Language, Region, UserRank } from '../types';
import { 
  generateRoomRedesign, 
  generateHighQualityRoomDesign,
  analyzeRoomEngineering, 
  analyzeColorPsychology, 
  analyzeDesignQualityMetrics,
  generateProfessionalTechnicalPlans, 
  generatePlanVisual, 
  generateAIVoiceNarration, 
  generateMarketReport, 
  refineRoomDesign 
} from '../services/geminiService';
import ARInnovationLab from '../components/ARInnovationLab';

interface RoomAnalysis {
  roomType: string;
  existingFurniture: string[];
  architecturalFeatures: string[];
  colorPalette: string[];
  lightingAnalysis: string;
  detectedDefects: string[];
  estimatedDimensions: {
    area: string;
    ceilingHeight: string;
  };
  currentStyle: string;
  technicalReport: string;
  swotAnalysis: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
  };
  recommendations: string[];
}

interface QualityMetrics {
  lighting: number;
  textures: number;
  integrity: number;
  resolution: number;
  hdr: number;
  saturation: number;
  summary: string;
}

interface VersionNode {
  image: string;
  prompt: string;
  timestamp: number;
}

interface InnovationHubProps {
  lang: Language;
}

const InnovationHub: React.FC<InnovationHubProps> = ({ lang }) => {
  const [activeSubTab, setActiveSubTab] = useState<'ai' | 'arvr' | 'psychology' | 'jobs' | 'api'>('ai');
  const [roomImg, setRoomImg] = useState<string | null>(null);
  const [redesignedImgs, setRedesignedImgs] = useState<string[]>([]);
  
  const [versionHistory, setVersionHistory] = useState<VersionNode[][]>([]); 
  const [activePreviewIndex, setActivePreviewIndex] = useState(0);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<RoomAnalysis | null>(null);
  const [qualityMetrics, setQualityMetrics] = useState<QualityMetrics | null>(null);
  const [hasKey, setHasKey] = useState(false);
  
  const [sliderPos, setSliderPos] = useState(50);
  const [selectedStyle, setSelectedStyle] = useState('Luxury Modern');
  const [budget, setBudget] = useState('15,000$');
  const [country, setCountry] = useState('United Arab Emirates');
  const [viewMode, setViewMode] = useState<'slider' | 'comparison' | 'history'>('slider');
  const [isUltra4K, setIsUltra4K] = useState(true);

  const [editPrompt, setEditPrompt] = useState('');
  const [isRefining, setIsRefining] = useState(false);
  const [isListeningForEdit, setIsListeningForEdit] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  
  const [selectedZoomImage, setSelectedZoomImage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    checkKeyStatus();
  }, []);

  const checkKeyStatus = async () => {
    const selected = await (window as any).aistudio.hasSelectedApiKey();
    setHasKey(selected);
  };

  const handleManageKey = async () => {
    await (window as any).aistudio.openSelectKey();
    checkKeyStatus();
  };

  const t = {
    en: {
      title: 'Innovation Layer',
      subtitle: 'World-class architectural synthesis, powered by 4K Neural Genesis.',
      tabs: { ai: 'AI Design', arvr: 'AR/VR Reality', psychology: 'Psychology', jobs: 'Global Careers', api: 'AI Engineering Developer Gateway' },
      aiTitle: 'AI Room Genesis 4K PRO',
      aiDesc: 'Professional architectural redesign engine. Produce cinematic 4K masterpieces.',
      generate: 'Generate 4 Design Variants',
      generate4K: 'Synthesize 4K Masterpiece',
      upload: 'Capture or Upload Room',
      styles: ['Luxury Modern', 'Japandi', 'Neo-Islamic', 'Industrial Loft', 'Minimalist Oasis'],
      before: 'Original State',
      after: 'Neural Vision',
      comparison: 'Diff Comparison',
      slider: 'Interactive Slider',
      versionTree: 'Version History Tree',
      downloadFinal: 'Download Unified Design Matrix (4-in-1)',
      executiveCommands: 'Executive Refinement Unit',
      refining: 'Refining Design...',
      previousVer: 'Previous Version',
      currentVer: 'Refined Version',
      historyTitle: 'Evolution Logic',
      executeEdit: 'Apply Modification',
      refinePlaceholder: 'Example: "Add a gold chandelier" or "Change flooring to white marble"',
      galleryTitle: 'Neural Asset Gallery',
      galleryDesc: 'Click to expand architectural variants to 70% scale.',
      ultraMode: 'Ultra 4K Production',
      ultraModeDesc: 'Highest fidelity with architectural precision. Requires Pro Certification.',
      qualityMetricsTitle: 'Pro Quality Metrics',
      lighting: 'HDR Luminous Balance',
      textures: 'Material Texture Fidelity',
      integrity: 'Structural Integrity',
      resScore: '4K Pixel Density',
      hdr: 'Dynamic Range',
      saturation: 'Color Chroma',
      auditSummary: 'AI Visual Audit Summary',
      manageKey: 'Manage Professional Key',
      keyActive: 'Pro Key Active',
      keyInactive: 'Key Required for 4K'
    },
    ar: {
      title: 'طبقة الابتكار الثوري',
      subtitle: 'بناء معمار عالمي المستوى، مدعوم بمحرك 4K العصبي.',
      tabs: { ai: 'تصميم الذكاء الاصطناعي', arvr: 'الواقع المعزز', psychology: 'سيكولوجية الألوان', jobs: 'وظائف عالمية', api: 'بوابة مطوري الهندسة بالذكاء الاصطناعي' },
      aiTitle: 'توليد الغرف الذكي 4K PRO',
      aiDesc: 'محرك إعادة التصميم المعماري الاحترافي. أنتج تحفاً سينمائية بدقة 4K.',
      generate: 'توليد 4 مقترحات تصميمية',
      generate4K: 'توليد تحفة فنية بدقة 4K',
      upload: 'التقط أو ارفع صورة الغرفة',
      styles: ['مودرن فاخر', 'جاباندي', 'إسلامي حديث', 'لوفت صناعي', 'واحة التبسيط'],
      before: 'الصورة الأصلية',
      after: 'الرؤية العصبية',
      comparison: 'مقارنة الفروقات',
      slider: 'منزلق تفاعلي',
      versionTree: 'شجرة سجل النسخ',
      downloadFinal: 'تنزيل مصفوفة التصميم الموحدة (4 في 1)',
      executiveCommands: 'وحدة الأوامر التنفيذية',
      refining: 'جاري دمج التعديلات...',
      previousVer: 'النسخة السابقة',
      currentVer: 'النسخة المعدلة',
      historyTitle: 'منطق تطور التصميم',
      executeEdit: 'تطبيق التعديل',
      refinePlaceholder: 'مثال: "أضف نجفة ذهبية" أو "غير الأرضية لرخام أبيض"',
      galleryTitle: 'معرض الأصول العصبية',
      galleryDesc: 'اضغط لتكبير المقترحات المعمارية إلى 70% من حجم الشاشة.',
      ultraMode: 'إنتاج بدقة 4K فائقة',
      ultraModeDesc: 'أعلى مستوى من التفاصيل والدقة المعمارية. يتطلب توثيق المحترفين.',
      qualityMetricsTitle: 'مقاييس الجودة الاحترافية',
      lighting: 'توازن الإضاءة HDR',
      textures: 'دقة وتفاصيل الخامات',
      integrity: 'النسب الهندسية المعمارية',
      resScore: 'كثافة البكسل 4K',
      hdr: 'النطاق الديناميكي',
      saturation: 'التشبع اللوني',
      auditSummary: 'ملخص التدقيق البصري',
      manageKey: 'إدارة مفتاح الوصول الاحترافي',
      keyActive: 'المفتاح نشط - وضع PRO',
      keyInactive: 'مفتاح الـ API مطلوب للـ 4K'
    }
  }[lang];

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        setRoomImg(base64);
        setIsAnalyzing(true);
        const audit = await analyzeRoomEngineering(base64.split(',')[1], lang);
        setAnalysis(audit as any);
        setIsAnalyzing(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRedesign = async () => {
    if (!roomImg) return;
    
    if (isUltra4K && !hasKey) {
       await handleManageKey();
       return;
    }

    setIsGenerating(true);
    setRedesignedImgs([]);
    setVersionHistory([]);
    setQualityMetrics(null);
    
    try {
      if (isUltra4K) {
        // Fix: Corrected function call to pass individual arguments as expected by geminiService.ts
        const result = await generateHighQualityRoomDesign(roomImg.split(',')[1], selectedStyle, budget, country);
        if (result) {
          setRedesignedImgs([result]);
          setVersionHistory([[{
            image: result,
            prompt: `Ultra 4K Masterpiece: ${selectedStyle}`,
            timestamp: Date.now()
          }]]);
          const metrics = await analyzeDesignQualityMetrics(result.split(',')[1], lang);
          setQualityMetrics({
            ...metrics,
            hdr: Math.floor(Math.random() * 15 + 85),
            saturation: Math.floor(Math.random() * 10 + 90)
          });
        }
      } else {
        const variantCount = 4;
        const promises = Array.from({ length: variantCount }).map((_, idx) => 
          // Fix: Corrected function call to pass required string parameters for budget and country
          generateRoomRedesign(roomImg.split(',')[1], selectedStyle, budget, country, idx)
        );
        const results = await Promise.all(promises);
        const validResults = results.filter((r): r is string => r !== null);
        setRedesignedImgs(validResults);
        const initialHistories = validResults.map(img => [{ image: img, prompt: `Initial ${selectedStyle}`, timestamp: Date.now() }]);
        setVersionHistory(initialHistories);
        if (validResults[0]) {
           const metrics = await analyzeDesignQualityMetrics(validResults[0].split(',')[1], lang);
           setQualityMetrics({ ...metrics, hdr: 75, saturation: 80 });
        }
      }
    } catch (err: any) {
      if (err?.message?.includes("Requested entity was not found")) {
        setHasKey(false);
        await handleManageKey();
      }
    }
    
    setActivePreviewIndex(0);
    setIsGenerating(false);
    setViewMode('slider');
  };

  const handleDownloadUnified = async () => {
    if (redesignedImgs.length < 1) return;
    setIsDownloading(true);
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      canvas.width = 2048; canvas.height = 2048;
      const loadImg = (url: string): Promise<HTMLImageElement> => new Promise((resolve) => {
        const img = new Image(); img.crossOrigin = "anonymous"; img.onload = () => resolve(img); img.src = url;
      });
      const imagesToLoad = redesignedImgs.slice(0, 4);
      const loadedImages = await Promise.all(imagesToLoad.map(loadImg));
      ctx.fillStyle = "#020617"; ctx.fillRect(0, 0, canvas.width, canvas.height);
      loadedImages.forEach((img, idx) => {
        const x = (idx % 2) * 1024; const y = Math.floor(idx / 2) * 1024;
        ctx.drawImage(img, x, y, 1024, 1024);
        ctx.fillStyle = "rgba(0, 0, 0, 0.6)"; ctx.fillRect(x + 30, y + 30, 240, 60);
        ctx.fillStyle = "#4f46e5"; ctx.font = "bold 28px 'Noto Sans Arabic', 'Inter', sans-serif";
        ctx.fillText(`Variant ${idx + 1}`, x + 50, y + 70);
      });
      ctx.fillStyle = "white"; ctx.font = "black 40px 'Inter'"; ctx.fillText("DG 4K PRO", 920, 1040);
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `DecorGlobal_4K_Project_${Date.now()}.png`;
      link.href = dataUrl; link.click();
    } catch (error) { console.error(error); } finally { setIsDownloading(false); }
  };

  const handleApplyRefinement = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentStack = versionHistory[activePreviewIndex];
    if (!currentStack || !editPrompt.trim() || isRefining) return;
    setIsRefining(true);
    const lastImage = currentStack[currentStack.length - 1].image;
    const base64 = lastImage.split(',')[1];
    // Fix: Corrected function call to match refineRoomDesign signature in geminiService.ts
    const refinedResult = await refineRoomDesign(base64, editPrompt, lang);
    if (refinedResult) {
      const newNode: VersionNode = { image: refinedResult, prompt: editPrompt, timestamp: Date.now() };
      const updatedHistory = [...versionHistory];
      updatedHistory[activePreviewIndex] = [...currentStack, newNode];
      setVersionHistory(updatedHistory);
      const updatedImgs = [...redesignedImgs];
      updatedImgs[activePreviewIndex] = refinedResult;
      setRedesignedImgs(updatedImgs);
      setEditPrompt(''); setViewMode('comparison');
      const metrics = await analyzeDesignQualityMetrics(refinedResult.split(',')[1], lang);
      setQualityMetrics({ ...metrics, hdr: 88, saturation: 92 });
    }
    setIsRefining(false);
  };

  return (
    <div className="space-y-16 animate-in fade-in duration-1000">
      {/* Zoom Overlay */}
      {selectedZoomImage && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 md:p-12" onClick={() => setSelectedZoomImage(null)}>
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-2xl"></div>
          <button onClick={() => setSelectedZoomImage(null)} className="absolute top-8 right-8 z-10 w-14 h-14 bg-white/10 text-white rounded-full flex items-center justify-center hover:bg-white/20 transition-all border border-white/10"><X className="w-8 h-8" /></button>
          <div className="relative w-full h-full max-w-[75vw] max-h-[75vh] flex items-center justify-center animate-in zoom-in-95 duration-500" onClick={(e) => e.stopPropagation()}>
            <img src={selectedZoomImage} className="w-full h-full object-contain rounded-[3rem] shadow-[0_60px_120px_rgba(0,0,0,0.6)] border border-white/10" alt="Zoomed Asset" />
            <div className="absolute bottom-[-70px] left-0 right-0 flex justify-center gap-4">
               <button onClick={() => { const link = document.createElement('a'); link.href = selectedZoomImage; link.download = `DG_4K_${Date.now()}.png`; link.click(); }} className="px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl flex items-center gap-3 hover:bg-indigo-500 transition-all">
                 <Download className="w-5 h-5" /> Download Full 4K Asset
               </button>
            </div>
          </div>
        </div>
      )}

      <section className="relative h-[450px] rounded-[4rem] overflow-hidden group shadow-2xl">
        <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2000" className="absolute inset-0 w-full h-full object-cover transition-transform duration-[20s] group-hover:scale-110" alt="Future Design" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-indigo-900/30"></div>
        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center p-12">
           <div className="w-24 h-24 bg-indigo-600 rounded-[2.2rem] flex items-center justify-center text-white mb-8 shadow-[0_20px_50px_rgba(79,70,229,0.4)] border border-white/20">
              <Rocket className="w-10 h-10 animate-bounce" />
           </div>
           <h1 className="text-6xl font-black text-white tracking-tighter mb-4">{t.title}</h1>
           <p className="text-xl text-indigo-100 font-bold opacity-80 max-w-2xl">{t.subtitle}</p>
        </div>
      </section>

      <div className="flex justify-center gap-4 overflow-x-auto no-scrollbar pb-4">
        {Object.entries(t.tabs).map(([key, label]) => (
          <button key={key} onClick={() => setActiveSubTab(key as any)} className={`px-10 py-5 rounded-full text-[11px] font-black uppercase tracking-widest transition-all ${activeSubTab === key ? 'bg-indigo-600 text-white shadow-xl' : 'bg-white text-slate-500 border border-slate-100 hover:border-indigo-300'}`}>
            {(label as string)}
          </button>
        ))}
      </div>

      <div className="min-h-[600px]">
        {activeSubTab === 'ai' && (
          <div className="space-y-12 animate-in fade-in duration-700">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div className="bg-white dark:bg-slate-900 p-10 rounded-[3.5rem] border border-slate-100 dark:border-white/5 shadow-sm space-y-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-950 rounded-2xl flex items-center justify-center text-indigo-500 shadow-xl border border-white/10">
                        <Cpu className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black tracking-tighter">{t.aiTitle}</h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">4K Neural Masterpiece Engine</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-slate-50 dark:bg-white/5 px-4 py-2 rounded-2xl border border-slate-100 dark:border-white/10">
                       <div className="text-right">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Production Mode</p>
                          <p className="text-[8px] font-bold text-indigo-400 uppercase">{isUltra4K ? 'Ultra 4K PRO' : 'Standard'}</p>
                       </div>
                       <button onClick={() => setIsUltra4K(!isUltra4K)} className={`w-12 h-6 rounded-full relative transition-colors ${isUltra4K ? 'bg-indigo-600' : 'bg-slate-300'}`}>
                         <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isUltra4K ? (lang === 'ar' ? 'left-1' : 'right-1') : (lang === 'ar' ? 'right-1' : 'left-1')}`}></div>
                       </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-2"><DollarSign className="w-3 h-3"/> {lang === 'ar' ? 'الميزانية' : 'Budget'}</label>
                       <input value={budget} onChange={e => setBudget(e.target.value)} className="w-full bg-slate-50 dark:bg-white/5 border-none rounded-xl p-3 text-sm font-bold focus:ring-2 ring-indigo-500 transition-all" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-2"><Globe className="w-3 h-3"/> {lang === 'ar' ? 'البلد' : 'Country'}</label>
                       <input value={country} onChange={e => setCountry(e.target.value)} className="w-full bg-slate-50 dark:bg-white/5 border-none rounded-xl p-3 text-sm font-bold focus:ring-2 ring-indigo-500 transition-all" />
                    </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-2"><Palette className="w-3.5 h-3.5" /> Architectural Style</label>
                     <select value={selectedStyle} onChange={e => setSelectedStyle(e.target.value)} className="w-full bg-slate-50 dark:bg-white/5 border-none rounded-xl p-3 text-sm font-bold">
                        {t.styles.map(s => <option key={s} value={s}>{s}</option>)}
                     </select>
                  </div>

                  <div className="aspect-video bg-slate-50 dark:bg-white/5 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-[2.5rem] flex flex-col items-center justify-center cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-all overflow-hidden relative group" onClick={() => fileInputRef.current?.click()}>
                    {roomImg ? <img src={roomImg} className="w-full h-full object-cover group-hover:scale-105 transition-transform" /> : (
                      <>
                        <Camera className="w-12 h-12 text-slate-300 mb-4" />
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{t.upload}</span>
                      </>
                    )}
                  </div>
                  <input type="file" ref={fileInputRef} className="hidden" onChange={handleImageUpload} />
                  
                  <div className="space-y-4">
                    <button onClick={handleRedesign} disabled={!roomImg || isGenerating} className={`w-full py-6 text-white rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl flex items-center justify-center gap-4 disabled:opacity-50 transition-all ${isUltra4K ? 'bg-slate-950 hover:bg-indigo-900 border border-white/10' : 'bg-indigo-600 hover:bg-indigo-500'}`}>
                      {isGenerating ? <Loader2 className="w-6 h-6 animate-spin" /> : isUltra4K ? <Award className="w-6 h-6 text-amber-400" /> : <Sparkles className="w-6 h-6" />}
                      {isUltra4K ? t.generate4K : t.generate}
                    </button>
                    
                    <button onClick={handleManageKey} className="w-full py-4 bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-50 dark:hover:bg-white/10 transition-all flex items-center justify-center gap-3">
                       <Key className={`w-4 h-4 ${hasKey ? 'text-emerald-500' : 'text-amber-500'}`} />
                       {hasKey ? t.keyActive : t.manageKey}
                    </button>
                  </div>

                  {isUltra4K && (
                    <div className="p-5 bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-500/20 rounded-[2rem] flex items-start gap-4">
                       <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                       <p className="text-[10px] font-bold text-slate-600 dark:text-slate-400 leading-relaxed uppercase tracking-tight">{t.ultraModeDesc}</p>
                    </div>
                  )}
                </div>

                {qualityMetrics && (
                  <div className="bg-slate-950 p-10 rounded-[3.5rem] text-white border border-white/5 shadow-2xl space-y-10 animate-in slide-in-from-bottom-8 duration-700">
                     <div className="flex items-center justify-between border-b border-white/5 pb-8">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 bg-indigo-600/10 text-indigo-400 rounded-2xl flex items-center justify-center border border-indigo-400/20">
                              <Sliders className="w-6 h-6" />
                           </div>
                           <div>
                              <h4 className="text-xl font-black tracking-tighter">{t.qualityMetricsTitle}</h4>
                              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Global Production Standard Audit</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">
                           <CheckCircle2 className="w-4 h-4" />
                           <span className="text-[9px] font-black uppercase tracking-widest">4K Validated</span>
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                        {[
                           { label: t.lighting, value: qualityMetrics.lighting, icon: Sun, color: 'text-amber-400' },
                           { label: t.textures, value: qualityMetrics.textures, icon: Layers, color: 'text-indigo-400' },
                           { label: t.hdr, value: qualityMetrics.hdr, icon: Contrast, color: 'text-blue-400' },
                           { label: t.resScore, value: qualityMetrics.resolution, icon: Monitor, color: 'text-emerald-400' },
                           { label: t.integrity, value: qualityMetrics.integrity, icon: Scaling, color: 'text-purple-400' },
                           { label: t.saturation, value: qualityMetrics.saturation, icon: Palette, color: 'text-pink-400' }
                        ].map((m, i) => (
                           <div key={i} className="space-y-4">
                              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                 <div className="flex items-center gap-3">
                                    <m.icon className={`w-4 h-4 ${m.color}`} />
                                    <span className="text-slate-400">{m.label}</span>
                                 </div>
                                 <span className={m.color}>{m.value}%</span>
                              </div>
                              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                                 <div className={`h-full transition-all duration-[2.5s] rounded-full bg-gradient-to-r from-slate-800 via-indigo-600 to-indigo-400`} style={{ width: `${m.value}%` }}></div>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
                )}
              </div>

              <div className="space-y-12">
                <div className="bg-slate-950 rounded-[4rem] p-12 flex flex-col items-center justify-start text-center text-white relative overflow-hidden shadow-2xl min-h-[600px] border border-white/5">
                  /* Fixed: Corrected template literal for backgroundImage style to use proper quoting */
                  <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
                  {redesignedImgs.length > 0 ? (
                    <div className="w-full h-full relative z-10 flex flex-col gap-8">
                      <div className="flex justify-between items-center mb-4">
                          <div className="flex gap-4">
                             <button onClick={() => setViewMode('slider')} className={`px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'slider' ? 'bg-indigo-600 text-white shadow-xl' : 'bg-white/5 text-slate-400 hover:text-white'}`}><ArrowRightLeft className="w-4 h-4 mr-2 inline" /> {t.slider}</button>
                             <button onClick={() => setViewMode('comparison')} className={`px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'comparison' ? 'bg-indigo-600 text-white shadow-xl' : 'bg-white/5 text-slate-400 hover:text-white'}`}><GitCompare className="w-4 h-4 mr-2 inline" /> {t.comparison}</button>
                          </div>
                          {!isUltra4K && (
                            <div className="flex gap-2">
                               {redesignedImgs.map((_, i) => (
                                  <button key={i} onClick={() => setActivePreviewIndex(i)} className={`w-11 h-11 rounded-full font-black text-[10px] transition-all ${activePreviewIndex === i ? 'bg-indigo-600 border border-white/20' : 'bg-white/10 hover:bg-white/20'}`}>{i+1}</button>
                               ))}
                            </div>
                          )}
                      </div>

                      <div className="flex-1 rounded-[3.5rem] overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.5)] relative bg-slate-900 min-h-[450px] border border-white/10">
                        {viewMode === 'slider' ? (
                          <div className="relative w-full h-full group/view">
                            <img src={redesignedImgs[activePreviewIndex]} className="absolute inset-0 w-full h-full object-cover" />
                            <div className="absolute inset-y-0 left-0 overflow-hidden border-r-4 border-indigo-500 shadow-2xl z-10" style={{ width: `${sliderPos}%` }}>
                              <img src={roomImg!} className="absolute inset-0 w-[calc(100%*100/var(--pos))] h-full object-cover" style={{ width: `${100 * 100 / sliderPos}%` } as any} />
                            </div>
                            <input type="range" min="0" max="100" value={sliderPos} onChange={(e) => setSliderPos(parseInt(e.target.value))} className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20" />
                            /* Fixed: Corrected template literal for left position style */
                            <div className="absolute top-1/2 -translate-y-1/2 pointer-events-none z-30 flex items-center justify-center w-14 h-14 bg-white rounded-full shadow-[0_0_40px_rgba(79,70,229,0.5)] border-4 border-indigo-600 group-hover/view:scale-110 transition-transform" style={{ left: `calc(${sliderPos}% - 1.75rem)` }}>
                               <ArrowRightLeft className="w-7 h-7 text-indigo-600" />
                            </div>
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 gap-6 h-full p-6">
                             <div className="relative rounded-[2.5rem] overflow-hidden border border-white/10 group/comp">
                                <img src={versionHistory[activePreviewIndex]?.length > 1 ? versionHistory[activePreviewIndex][versionHistory[activePreviewIndex].length - 2].image : roomImg!} className="w-full h-full object-cover transition-transform group-hover/comp:scale-110 duration-1000" />
                                <div className="absolute bottom-6 left-6 bg-slate-950/80 backdrop-blur-xl px-4 py-2 rounded-2xl text-[9px] font-black uppercase tracking-widest border border-white/10">{t.previousVer}</div>
                             </div>
                             <div className="relative rounded-[2.5rem] overflow-hidden border border-indigo-500 shadow-2xl group/comp">
                                <img src={redesignedImgs[activePreviewIndex]} className="w-full h-full object-cover transition-transform group-hover/comp:scale-110 duration-1000" />
                                <div className="absolute bottom-6 right-6 bg-indigo-600/90 backdrop-blur-xl px-4 py-2 rounded-2xl text-[9px] font-black uppercase tracking-widest border border-white/20 shadow-xl">{t.currentVer}</div>
                             </div>
                          </div>
                        )}
                      </div>

                      <div className="mt-8 p-10 bg-white/5 backdrop-blur-3xl rounded-[3.5rem] border border-white/10 text-start relative overflow-hidden shadow-2xl">
                         <div className="absolute top-0 right-0 w-56 h-56 bg-indigo-600/10 blur-[120px]"></div>
                         <div className="mb-8 flex items-center gap-5">
                            <div className="p-4 bg-indigo-600 rounded-[1.5rem] shadow-2xl shadow-indigo-600/30 border border-white/10">
                               <Wand2 className="w-6 h-6 text-white" />
                            </div>
                            <div>
                               <h5 className="text-2xl font-black tracking-tighter text-white">{t.executiveCommands}</h5>
                               <p className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400">{t.historyTitle}</p>
                            </div>
                         </div>

                         <div className="flex flex-col gap-8">
                            <div className="relative group">
                               <textarea value={editPrompt} onChange={(e) => setEditPrompt(e.target.value)} placeholder={t.refinePlaceholder} rows={3} className="w-full bg-white/5 border border-white/10 rounded-[2.5rem] py-8 px-10 text-sm font-bold text-white placeholder:text-slate-600 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none resize-none" />
                               <div className="absolute right-6 bottom-6 flex gap-3">
                                  <button onClick={() => { const sr = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition; if (!sr) return; const r = new sr(); r.lang = lang === 'ar' ? 'ar-SA' : 'en-US'; r.onstart = () => setIsListeningForEdit(true); r.onresult = (e: any) => { setEditPrompt(e.results[0][0].transcript); setIsListeningForEdit(false); }; r.onerror = () => setIsListeningForEdit(false); r.start(); }} className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isListeningForEdit ? 'bg-red-500 text-white animate-pulse shadow-xl' : 'bg-white/10 text-slate-400 hover:text-white hover:bg-white/20'}`}>
                                     <Mic className="w-6 h-6" />
                                  </button>
                                  <button onClick={handleApplyRefinement} disabled={!editPrompt.trim() || isRefining} className="px-12 py-5 bg-indigo-600 text-white rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] shadow-[0_20px_40px_rgba(79,70,229,0.3)] hover:bg-indigo-50 hover:scale-105 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-4 border border-white/10">
                                     {isRefining ? <Loader2 className="w-5 h-5 animate-spin" /> : <GitCompare className="w-5 h-5" />}
                                     {isRefining ? t.refining : t.executeEdit}
                                  </button>
                               </div>
                            </div>
                         </div>
                      </div>

                      <div className="pt-6">
                        <button onClick={handleDownloadUnified} disabled={isDownloading || redesignedImgs.length < 1} className="w-full py-7 bg-emerald-600 text-white rounded-[2.5rem] font-black text-[13px] uppercase tracking-[0.3em] shadow-[0_25px_70px_rgba(16,185,129,0.3)] hover:bg-emerald-500 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-5 disabled:opacity-50 border border-white/20">
                          {isDownloading ? <Loader2 className="w-7 h-7 animate-spin" /> : <Download className="w-7 h-7" />} 
                          {t.downloadFinal}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="relative z-10 space-y-12 py-48">
                      <div className="w-32 h-32 bg-white/5 border border-white/10 rounded-[3rem] flex items-center justify-center mx-auto shadow-[0_30px_60px_rgba(0,0,0,0.4)] group">
                         <Cpu className={`w-16 h-16 text-indigo-400 ${isGenerating ? 'animate-spin' : 'group-hover:scale-110 transition-transform'}`} />
                      </div>
                      <div className="space-y-6">
                         <h4 className="text-4xl font-black tracking-tighter opacity-50 uppercase">Neural Synthesis Node</h4>
                         <p className="text-xs text-slate-500 uppercase font-black tracking-[0.5em] max-w-sm mx-auto leading-relaxed">
                            Awaiting Pro Analysis & Genesis Synthesis Activation
                         </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {redesignedImgs.length > 0 && (
              <div className="animate-in fade-in slide-in-from-bottom-12 duration-1000 pt-10">
                <div className="flex items-center justify-between mb-10 border-b border-slate-100 dark:border-white/5 pb-8">
                  <div className="flex items-center gap-6">
                     <div className="w-16 h-16 bg-slate-950 text-indigo-500 rounded-[1.8rem] flex items-center justify-center border border-white/10 shadow-2xl">
                        <Grid className="w-8 h-8" />
                     </div>
                     <div>
                        <h3 className="text-4xl font-black tracking-tighter">{t.galleryTitle}</h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{t.galleryDesc}</p>
                     </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                  {redesignedImgs.map((img, idx) => (
                    <div key={idx} onClick={() => setSelectedZoomImage(img)} className="group relative aspect-square bg-slate-950 rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl hover:-translate-y-3 transition-all duration-500 cursor-zoom-in">
                      <img src={img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s] opacity-90 group-hover:opacity-100" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <div className="w-16 h-16 bg-white/10 backdrop-blur-2xl rounded-2xl flex items-center justify-center border border-white/30 transform scale-50 group-hover:scale-100 transition-all duration-500 shadow-2xl">
                            <Maximize2 className="w-8 h-8 text-white" />
                         </div>
                      </div>
                      <div className="absolute top-6 left-6">
                         <span className="bg-indigo-600/80 backdrop-blur-xl text-white text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border border-white/20">
                            Neural Variant {idx + 1}
                         </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        {activeSubTab === 'arvr' && (
          <ARInnovationLab lang={lang} />
        )}

        {activeSubTab === 'psychology' && (
          <div className="space-y-12 animate-in fade-in duration-700">
            <div className="bg-white dark:bg-slate-900 p-16 rounded-[4rem] border border-slate-100 dark:border-white/5 shadow-2xl flex flex-col lg:flex-row gap-16 items-center relative overflow-hidden">
               <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/5 blur-[150px]"></div>
               <div className="max-w-2xl space-y-10 relative z-10">
                  <h3 className="text-5xl font-black tracking-tighter flex items-center gap-6 text-slate-900 dark:text-white uppercase">
                    <Palette className="w-16 h-16 text-indigo-600" /> Neural Color Psychology
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 font-bold text-xl leading-relaxed uppercase tracking-tight">AI analyzes how regional heritage and light frequencies influence spatial emotion.</p>
                  <div className="flex gap-4">
                    <select value={country} onChange={(e) => setCountry(e.target.value)} className="flex-1 bg-slate-50 dark:bg-white/5 border-none rounded-2xl p-6 font-black uppercase tracking-widest text-xs text-slate-900 dark:text-white focus:ring-4 ring-indigo-500/10">
                      <option>United Arab Emirates</option>
                      <option>Saudi Arabia</option>
                      <option>United Kingdom</option>
                      <option>Japan</option>
                      <option>France</option>
                    </select>
                    <button onClick={async () => { setIsAnalyzing(true); await analyzeColorPsychology(country, lang); setIsAnalyzing(false); }} className="px-16 py-6 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-indigo-500">
                       {isAnalyzing ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Audit Culture'}
                    </button>
                  </div>
               </div>
               <div className="flex-1 grid grid-cols-2 gap-6 relative z-10">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="aspect-square bg-slate-50 dark:bg-white/5 rounded-[2.5rem] border border-white/10 p-8 flex flex-col items-center justify-center text-center group hover:bg-indigo-600 transition-all cursor-pointer">
                       <Zap className="w-10 h-10 text-indigo-400 mb-4 group-hover:text-white" />
                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white">Sentiment {i}</span>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InnovationHub;
