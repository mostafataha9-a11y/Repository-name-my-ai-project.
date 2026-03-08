
import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Award, Zap, Activity, Gauge, 
  Target, Globe2, Sparkles, RefreshCw, Smartphone, 
  Glasses, Boxes, BarChart3, Info, Terminal, ChevronRight,
  Map, Fingerprint, Lock, Compass, Ruler, Microscope
} from 'lucide-react';
import { Language } from '../types';
import { generateARStatusReport } from '../services/geminiService';

interface ARReportProps {
  lang: Language;
}

const ARReport: React.FC<ARReportProps> = ({ lang }) => {
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchReport = async () => {
      setIsLoading(true);
      const report = await generateARStatusReport(lang);
      setAiSummary(report);
      setIsLoading(false);
    };
    fetchReport();
  }, [lang]);

  const t = {
    en: {
      title: 'AR Department Intelligence Report',
      subtitle: 'Official audit of Spatial Core v4.8 performance and architectural deployment metrics.',
      execSummary: 'Executive Neural Summary',
      performanceTitle: 'Spatial Engine Benchmarks',
      methodology: 'Core Methodology',
      compliance: 'Global Compliance Status',
      vision: 'Strategic AR Vision 2026',
      latency: 'Average Latency',
      precision: 'Millimetric Precision',
      stability: 'Neural Anchor Stability',
      fov: 'Optimized FOV Mesh',
      reportDetail: 'The AR Department operates on the proprietary Spatial Core v4.8, enabling sub-millimeter precision for architectural placement. Our methodology combines LiDAR data fusion with Neural Anchor points to ensure absolute stability in high-motion environments.'
    },
    ar: {
      title: 'تقرير ذكاء قسم الواقع المعزز',
      subtitle: 'التدقيق الرسمي لأداء نواة المكان v4.8 ومقاييس النشر المعماري.',
      execSummary: 'الملخص العصبي التنفيذي',
      performanceTitle: 'مؤشرات أداء محرك المكان',
      methodology: 'منهجية العمل الأساسية',
      compliance: 'حالة الامتثال العالمية',
      vision: 'رؤية الواقع المعزز الاستراتيجية 2026',
      latency: 'متوسط تأخير الاستجابة',
      precision: 'الدقة المليمترية',
      stability: 'استقرار المرساة العصبية',
      fov: 'شبكة مجال الرؤية المحسنة',
      reportDetail: 'يعمل قسم الواقع المعزز على نواة المكان v4.8 الخاصة بنا، مما يتيح دقة فائقة لوضع العناصر المعمارية. تجمع منهجيتنا بين دمج بيانات LiDAR ونقاط المرساة العصبية لضمان الاستقرار المطلق في البيئات ذات الحركة العالية.'
    }
  }[lang];

  return (
    <div className="space-y-16 animate-in fade-in duration-1000 pb-20">
      {/* Hero Section */}
      <section className="bg-slate-950 rounded-[4rem] p-12 text-white relative overflow-hidden shadow-2xl border border-white/5">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[150px]"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <Microscope className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">Audit Phase: Completed</span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter mb-4 leading-tight">{t.title}</h1>
            <p className="text-slate-400 text-lg font-bold opacity-80 mb-8 max-w-lg leading-relaxed">{t.subtitle}</p>
          </div>
          <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 text-center w-full md:w-80">
             <div className="text-5xl font-black text-indigo-400">v4.8</div>
             <p className="text-[10px] text-slate-500 uppercase font-black mt-2">Spatial Engine Build</p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
         {/* Main Content */}
         <div className="lg:col-span-2 space-y-12">
            
            {/* AI Executive Summary Card */}
            <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-slate-100 dark:border-white/5 shadow-sm relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 blur-3xl"></div>
               <div className="relative z-10">
                  <div className="flex items-center justify-between mb-8 border-b border-slate-50 dark:border-white/5 pb-6">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-600/10 text-indigo-600 rounded-2xl flex items-center justify-center border border-indigo-600/20">
                           <Sparkles className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-black tracking-tighter">{t.execSummary}</h3>
                     </div>
                     {isLoading && <RefreshCw className="w-5 h-5 text-indigo-500 animate-spin" />}
                  </div>
                  
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                     <p className="text-lg leading-relaxed font-medium text-slate-600 dark:text-slate-400 italic">
                        {aiSummary || (lang === 'ar' ? 'جاري استخراج البيانات العصبية...' : 'Extracting neural metrics...')}
                     </p>
                  </div>
               </div>
            </div>

            {/* Benchmarks Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {[
                 { label: t.latency, value: '12ms', icon: Gauge, color: 'text-emerald-500', trend: 'Optimized' },
                 { label: t.precision, value: '0.2mm', icon: Ruler, color: 'text-indigo-500', trend: 'Certified' },
                 { label: t.stability, value: '99.8%', icon: Target, color: 'text-amber-500', trend: 'Neural Locked' },
                 { label: t.fov, value: '2.4k Tri', icon: Compass, color: 'text-purple-500', trend: 'Ultra-Dense' }
               ].map((metric, i) => (
                 <div key={metric.label} className="p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-white/5 shadow-sm hover:shadow-xl transition-all">
                    <div className="flex justify-between items-start mb-6">
                       <div className={`w-12 h-12 bg-slate-50 dark:bg-white/5 rounded-xl flex items-center justify-center ${metric.color}`}>
                          <metric.icon className="w-6 h-6" />
                       </div>
                       <span className="text-[8px] font-black uppercase bg-slate-100 dark:bg-white/5 px-2 py-1 rounded text-slate-400">{metric.trend}</span>
                    </div>
                    <div className="text-3xl font-black text-slate-900 dark:text-white mb-1">{metric.value}</div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{metric.label}</div>
                 </div>
               ))}
            </div>

            {/* Methodology Content */}
            <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-12 border border-slate-100 dark:border-white/5 shadow-sm">
               <h3 className="text-2xl font-black mb-8 flex items-center gap-4">
                  <Terminal className="w-8 h-8 text-indigo-600" /> {t.methodology}
               </h3>
               <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg mb-10">
                  {t.reportDetail}
               </p>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10">
                     <Smartphone className="w-5 h-5 text-indigo-600 mb-4" />
                     <h4 className="font-black text-xs uppercase mb-2">WebXR Standard</h4>
                     <p className="text-[9px] font-bold text-slate-400 uppercase">Cross-Platform Ready</p>
                  </div>
                  <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10">
                     <Boxes className="w-5 h-5 text-emerald-600 mb-4" />
                     <h4 className="font-black text-xs uppercase mb-2">PBR Materials</h4>
                     <p className="text-[9px] font-bold text-slate-400 uppercase">Physically Correct</p>
                  </div>
                  <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10">
                     <Lock className="w-5 h-5 text-amber-600 mb-4" />
                     <h4 className="font-black text-xs uppercase mb-2">Encrypted Shell</h4>
                     <p className="text-[9px] font-bold text-slate-400 uppercase">Data Privacy Shield</p>
                  </div>
               </div>
            </div>
         </div>

         {/* Sidebar Stats */}
         <div className="space-y-8">
            <div className="bg-slate-950 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-600/10 blur-3xl"></div>
               <h3 className="text-sm font-black uppercase tracking-[0.2em] text-emerald-400 mb-8 flex items-center gap-3">
                 <ShieldCheck className="w-5 h-5" /> {t.compliance}
              </h3>
              <div className="space-y-6">
                 {[
                   { label: 'W3C Immersive Web', score: 100 },
                   { label: 'WCAG 2.2 AA+', score: 98 },
                   { label: 'GDPR Spatial Data', score: 100 }
                 ].map((c, i) => (
                   <div key={i} className="space-y-3">
                      <div className="flex justify-between items-center text-[9px] font-black uppercase">
                         <span className="text-slate-400">{c.label}</span>
                         <span className="text-emerald-400">{c.score}%</span>
                      </div>
                      <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                         <div className="bg-emerald-500 h-full" style={{ width: `${c.score}%` }}></div>
                      </div>
                   </div>
                 ))}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-white/5 shadow-sm">
               <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 mb-8 flex items-center gap-3">
                 <Activity className="w-5 h-5 text-indigo-600" /> Live Logic Pulse
              </h3>
              <div className="space-y-4">
                 {[
                   { node: 'Tracking API', status: 'Optimal' },
                   { node: 'Surface Meshing', status: 'Healthy' },
                   { node: 'Model Quantizer', status: 'Optimal' }
                 ].map((n, i) => (
                   <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-white dark:border-white/10">
                      <span className="text-[10px] font-black uppercase text-slate-600 dark:text-slate-300">{n.node}</span>
                      <div className="flex items-center gap-2">
                         <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                         <span className="text-[8px] font-black text-emerald-500 uppercase">{n.status}</span>
                      </div>
                   </div>
                 ))}
              </div>
            </div>

            <div className="bg-indigo-600 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
               <h3 className="text-xl font-black mb-4 relative z-10">{t.vision}</h3>
               <p className="text-indigo-100 text-xs font-bold leading-relaxed mb-8 relative z-10">
                  Integration with Apple Vision Pro and proprietary AR Glasses ecosystem.
               </p>
               <button className="w-full py-4 bg-white text-indigo-600 rounded-xl font-black text-[10px] uppercase tracking-widest relative z-10 hover:bg-indigo-50 transition-all flex items-center justify-center gap-3">
                  Read Roadmap <ChevronRight className="w-4 h-4" />
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default ARReport;
