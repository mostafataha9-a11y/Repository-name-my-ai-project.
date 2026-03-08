
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Award, Zap, Briefcase, 
  MessageSquare, Star, TrendingUp, Bell, 
  Settings, ArrowUpRight, Clock, ShieldCheck, 
  Sparkles, Layers, Search, Plus, Users, Share2, Target,
  Globe2, Server, Cpu, BarChart3, ChevronRight, Activity, Rocket,
  DollarSign, Languages, CheckCircle, Fingerprint, LineChart,
  AreaChart, MousePointer2, LayoutTemplate, Monitor, Download, Image as ImageIcon
} from 'lucide-react';
import { Language, Region, UserRank } from '../types';
import { analyzeSEOGaps, getPredictiveInsights, getMultiLangSEO, calculateNeuralReputation } from '../services/geminiService';

interface DashboardProps {
  lang: Language;
}

const Dashboard: React.FC<DashboardProps> = ({ lang }) => {
  const [seoGaps, setSeoGaps] = useState<any>(null);
  const [predictions, setPredictions] = useState<any>(null);
  const [multiLangSEO, setMultiLangSEO] = useState<any[]>([]);
  const [repData, setRepData] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [gaps, insights, seo, rep] = await Promise.all([
        analyzeSEOGaps(['Modernism', 'Islamic Architecture', 'Smart Homes'], lang),
        getPredictiveInsights(Region.GULF, lang),
        getMultiLangSEO('Luxury Villa Riyadh', ['en', 'ar', 'fr']),
        calculateNeuralReputation("Expert in GCC desert modernism with 15 verified projects.")
      ]);
      setSeoGaps(gaps);
      setPredictions(insights);
      setMultiLangSEO(seo);
      setRepData(rep);
      
      const savedHistory = JSON.parse(localStorage.getItem('dg_gen_history') || '[]');
      setHistory(savedHistory);
    };
    fetchData();
  }, [lang]);

  const handleReDownload = (img: string) => {
    const link = document.createElement('a');
    link.href = img;
    link.download = `DecorGlobal_ReDownload_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const translations = {
    en: {
      title: 'Professional Hub',
      welcome: 'Welcome back, Architect Khalid',
      localizationTitle: 'Global Localization Health',
      seoMulti: 'Cross-Language SEO Visibility',
      humanAudit: 'Human-in-the-loop Review',
      langCoverage: 'Language Coverage',
      points: 'Mastery Points',
      rank: 'Rank Index',
      impact: 'Market Impact',
      connections: 'Connections',
      predictionTitle: '2026 Predictive Trends',
      seoTitle: 'SEO Keyword Gap Insight',
      repTitle: 'Neural Reputation Feed',
      integrity: 'Design Integrity Index',
      heatmap: 'Global Aesthetic Heatmap',
      activity: 'Recent Activity Pulse',
      historyTitle: 'Recent AI Generations',
      reDownload: 'Re-Download',
      noHistory: 'No recent generations found. Visit Innovation Hub to start.'
    },
    ar: {
      title: 'لوحة التحكم المهنية',
      welcome: 'مرحباً بعودتك، المعماري خالد',
      localizationTitle: 'صحة التوطين العالمي',
      seoMulti: 'ظهور السيو متعدد اللغات',
      humanAudit: 'مراجعة المترجمين الذكية',
      langCoverage: 'تغطية اللغات',
      points: 'نقاط الإتقان',
      rank: 'مؤشر الرتبة',
      impact: 'التأثير في السوق',
      connections: 'اتصالات مهنية',
      predictionTitle: 'التنبؤ باتجاهات 2026',
      seoTitle: 'رؤى فجوة الكلمات المفتاحية SEO',
      repTitle: 'خلاصة السمعة العصبية',
      integrity: 'مؤشر تكامل التصميم',
      heatmap: 'خريطة حرارة الجماليات العالمية',
      activity: 'نبض النشاط الأخير',
      historyTitle: 'أحدث التوليدات الذكية',
      reDownload: 'إعادة تنزيل',
      noHistory: 'لا توجد توليدات حديثة. قم بزيارة قسم الابتكار للبدء.'
    }
  };
  const t = translations[lang as 'en' | 'ar'] || translations.en;

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">{t.welcome}</h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px]">{t.title} • {new Date().toLocaleDateString()}</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl border border-slate-100 dark:border-white/5 font-black text-[10px] uppercase tracking-widest shadow-sm">
            <Languages className="w-4 h-4 text-indigo-600" /> {t.langCoverage}
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl">
            <Plus className="w-4 h-4" /> New Vision
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { icon: Zap, label: t.points, value: '1,250', color: 'bg-indigo-600', trend: '+12%' },
          { icon: Award, label: t.rank, value: 'Master', color: 'bg-emerald-600', trend: 'Level 4' },
          { icon: Star, label: t.impact, value: repData?.reputationScore ? `${repData.reputationScore}%` : '98%', color: 'bg-amber-500', trend: 'AI Audited' },
          { icon: Users, label: t.connections, value: '842', color: 'bg-indigo-500', trend: '+18' }
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-white/5 shadow-sm group">
             <div className="flex justify-between items-start mb-6">
               <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                 <stat.icon className="w-6 h-6" />
               </div>
               <span className="text-[10px] font-black text-indigo-500 bg-indigo-50 dark:bg-indigo-600/20 px-3 py-1 rounded-full">{stat.trend}</span>
             </div>
             <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter mb-1">{stat.value}</div>
             <div className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em]">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
           
           {/* Recent AI History Section */}
           <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-slate-100 dark:border-white/5 shadow-sm">
              <div className="flex items-center justify-between mb-10">
                 <h3 className="text-2xl font-black tracking-tighter flex items-center gap-4">
                    <ImageIcon className="w-8 h-8 text-indigo-600" /> {t.historyTitle}
                 </h3>
                 <button className="p-2 bg-slate-50 dark:bg-white/5 rounded-xl hover:text-indigo-600 transition-all">
                    <ArrowUpRight className="w-5 h-5" />
                 </button>
              </div>
              
              <div className="space-y-6">
                {history.length > 0 ? history.map((item, idx) => (
                  <div key={item.id} className="flex items-center justify-between p-5 bg-slate-50 dark:bg-white/5 rounded-[2rem] border border-white dark:border-white/10 group hover:shadow-xl transition-all">
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-lg">
                        <img src={item.image} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-slate-900 dark:text-white">{item.style}</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                          {new Date(item.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleReDownload(item.image)}
                      className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-100 dark:border-white/5 font-black text-[9px] uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5" /> {t.reDownload}
                    </button>
                  </div>
                )) : (
                  <div className="text-center py-20 border-2 border-dashed border-slate-100 dark:border-white/5 rounded-[3rem]">
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">{t.noHistory}</p>
                  </div>
                )}
              </div>
           </div>

           {/* Performance Growth Analytics */}
           <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-slate-100 dark:border-white/5 shadow-sm">
              <div className="flex items-center justify-between mb-10">
                 <h3 className="text-2xl font-black tracking-tighter flex items-center gap-4">
                    <AreaChart className="w-8 h-8 text-indigo-600" /> {t.activity}
                 </h3>
                 <select className="bg-slate-50 dark:bg-white/5 border-none rounded-xl text-[10px] font-black uppercase tracking-widest px-4 py-2">
                    <option>Last 30 Days</option>
                    <option>Yearly Growth</option>
                 </select>
              </div>
              <div className="h-64 relative">
                 <svg viewBox="0 0 400 100" className="w-full h-full text-indigo-600 overflow-visible">
                    <path d="M0,80 Q50,60 100,75 T200,40 T300,55 T400,20" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    <path d="M0,80 Q50,60 100,75 T200,40 T300,55 T400,20 L400,100 L0,100 Z" fill="url(#grad)" className="opacity-10" />
                    <defs>
                       <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="currentColor" />
                          <stop offset="100%" stopColor="transparent" />
                       </linearGradient>
                    </defs>
                    <circle cx="200" cy="40" r="4" fill="white" stroke="currentColor" strokeWidth="2" />
                 </svg>
                 <div className="absolute top-10 left-[50%] -translate-x-1/2 bg-slate-950 text-white px-3 py-1.5 rounded-lg text-[9px] font-black shadow-2xl">
                    Peak Reach: +24%
                 </div>
              </div>
           </div>
        </div>

        <div className="space-y-8">
           {/* Integrity Index Widget */}
           <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-white/5 shadow-sm">
             <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8 flex items-center gap-3">
               <LineChart className="w-5 h-5 text-indigo-600" /> {t.integrity}
             </h3>
             <div className="flex items-center justify-center p-8 bg-slate-50 dark:bg-white/5 rounded-3xl border border-white dark:border-white/5 mb-8">
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100 dark:text-white/5" />
                    <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="364" strokeDashoffset={364 - (364 * 0.92)} className="text-indigo-600 transition-all duration-1000" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black text-slate-900 dark:text-white">92</span>
                    <span className="text-[8px] font-black text-slate-400 uppercase">Neural Pt</span>
                  </div>
                </div>
             </div>
             <p className="text-[9px] font-bold text-slate-500 uppercase leading-relaxed text-center">Your design logic matches global architectural standards at 92% accuracy.</p>
           </div>

           <div className="bg-slate-950 rounded-[2.5rem] p-10 text-white shadow-2xl">
              <h3 className="text-sm font-black uppercase tracking-[0.3em] text-indigo-400 mb-8 flex items-center gap-3">
                <Sparkles className="w-5 h-5" /> Professional Tools
              </h3>
              <div className="space-y-4">
                 {[
                   { label: 'Project Focus Optimizer', icon: Monitor },
                   { label: 'Global RFQ Bidding', icon: DollarSign },
                   { label: 'Technical SEO Pulse', icon: BarChart3 },
                 ].map((tool, i) => (
                   <button key={i} className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/10 hover:bg-white/10 rounded-2xl transition-all group">
                      <div className="flex items-center gap-4">
                        <tool.icon className="w-5 h-5 text-slate-400 group-hover:text-indigo-400" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">{tool.label}</span>
                      </div>
                   </button>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
