
import React, { useState, useEffect } from 'react';
import { 
  Landmark, ShoppingBag, BookOpen, UserCheck, 
  TrendingUp, Star, LayoutGrid, Package, 
  Sparkles, DollarSign, ArrowRight, Zap, 
  Percent, CreditCard, Award, Rocket, Building2, Factory, MapPin,
  FileText, ShieldCheck, User, Boxes, Cpu, Target, Briefcase, 
  BarChart3, Globe2, ChevronRight, CheckCircle, Lock
} from 'lucide-react';
import { Language, MarketplaceItem, Region, UserRank, B2BJob } from '../types';
import { generateMarketReport } from '../services/geminiService';

interface MonetizationHubProps {
  lang: Language;
}

const MonetizationHub: React.FC<MonetizationHubProps> = ({ lang }) => {
  const [activeReport, setActiveReport] = useState<any>(null);
  const [isLoadingReport, setIsLoadingReport] = useState(false);

  useEffect(() => {
    handleLoadIntelligence();
  }, [lang]);

  const handleLoadIntelligence = async () => {
    setIsLoadingReport(true);
    const data = await generateMarketReport(Region.GULF, lang);
    setActiveReport(data);
    setIsLoadingReport(false);
  };

  const t = {
    en: {
      title: 'Global Business & Scaling',
      subtitle: 'The ultimate neural ecosystem for professional architectural growth.',
      tiers: 'Professional Scaling Tiers',
      assetStore: '3D & CAD Asset Marketplace',
      b2bPortal: 'B2B Recruitment & Contracts',
      marketIntel: 'Market Intelligence Reports',
      joinNow: 'Upgrade Account',
      buyReport: 'Purchase Full Data',
      commissionInfo: 'Transparent Commission Model',
      affiliateTitle: 'Global Supplier Network',
      monetizeBtn: 'Monetize My Content'
    },
    ar: {
      title: 'نمو الأعمال والتوسع العالمي',
      subtitle: 'المنظومة العصبية النهائية للنمو المهني المعماري المتقدم.',
      tiers: 'مستويات التوسع المهني',
      assetStore: 'سوق أصول 3D و CAD',
      b2bPortal: 'بوابة التوظيف والتعاقدات B2B',
      marketIntel: 'تقارير استخبارات السوق',
      joinNow: 'ترقية الحساب الآن',
      buyReport: 'شراء البيانات الكاملة',
      commissionInfo: 'نموذج عمولة شفاف',
      affiliateTitle: 'شبكة الموردين العالمية',
      monetizeBtn: 'ابدأ في الربح من محتواك'
    }
  }[lang];

  const tiers = [
    { name: 'Designer Pro', price: '$49/mo', icon: UserCheck, benefits: ['Standard Portfolio', 'AI Co-Writer', '5% Commission'] },
    { name: 'Agency Elite', price: '$199/mo', icon: Award, benefits: ['B2B Priority', 'Custom Brand Hub', '2% Commission'] },
    { name: 'Enterprise', price: 'Custom', icon: Building2, benefits: ['Neural API Access', 'Global Staffing', '0% Commission'] }
  ];

  const assets: MarketplaceItem[] = [
    { id: 'as1', title: 'Modular Smart Office (Revit)', category: '3d-asset', price: '$120', image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=400', seller: 'Studio Alpha', rating: 4.9, fileFormat: 'RVT' },
    { id: 'as2', title: 'Neo-Islamic Facade Kit', category: '3d-asset', price: '$85', image: 'https://images.unsplash.com/photo-1518005020251-58296d85171d?auto=format&fit=crop&q=80&w=400', seller: 'Arch. Khalid', rating: 5.0, fileFormat: 'MAX' }
  ];

  const b2bJobs: B2BJob[] = [
    { id: 'j1', company: 'Riyadh Holdings', role: 'Lead Interior Architect', budget: '$12k/mo', location: 'Riyadh, KSA', requiredRank: UserRank.ARCHITECT_MASTERS },
    { id: 'j2', company: 'Neo-Living Dubai', role: 'Smart Home Specialist', budget: '$15k/mo', location: 'Dubai, UAE', requiredRank: UserRank.CONSULTANT }
  ];

  return (
    <div className="space-y-24 animate-in fade-in duration-1000">
      {/* Hero Section */}
      <section className="bg-slate-950 rounded-[4rem] p-16 text-white relative overflow-hidden shadow-2xl border border-white/5">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/10 blur-[150px]"></div>
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-14 h-14 bg-indigo-600 rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-indigo-600/30">
                <Landmark className="w-7 h-7" />
              </div>
              <span className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.4em]">DecorGlobal v3.5 Enterprise</span>
            </div>
            <h1 className="text-6xl font-black tracking-tighter mb-6 leading-tight">{t.title}</h1>
            <p className="text-slate-400 text-xl font-bold opacity-80 mb-10 leading-relaxed max-w-xl">{t.subtitle}</p>
            <div className="flex flex-wrap gap-6">
               <button className="px-12 py-6 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-indigo-500 transition-all shadow-2xl shadow-indigo-600/20">
                  {t.joinNow}
               </button>
               <button className="px-12 py-6 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-white/10 transition-all">
                  Partner with Us
               </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6 w-full lg:w-[450px]">
             <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5 text-center">
                <div className="text-indigo-400 font-black text-4xl mb-2">15%</div>
                <div className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Global Marketplace Cap</div>
             </div>
             <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5 text-center">
                <div className="text-emerald-400 font-black text-4xl mb-2">+24%</div>
                <div className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Avg. Monthly Scaling</div>
             </div>
             <div className="col-span-2 bg-indigo-600/10 p-6 rounded-[2rem] border border-indigo-500/20 flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <Target className="w-6 h-6 text-indigo-400" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-indigo-100">AI B2B Matching Active</span>
                </div>
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
             </div>
          </div>
        </div>
      </section>

      {/* Tier Selection */}
      <section className="space-y-12">
         <div className="text-center space-y-4">
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter">{t.tiers}</h2>
            <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs">Architectural levels designed for every stage of your career.</p>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tiers.map((tier, i) => (
               <div key={i} className={`p-12 rounded-[3.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-2xl transition-all relative overflow-hidden group ${i === 1 ? 'ring-2 ring-indigo-500' : ''}`}>
                  {i === 1 && <div className="absolute top-0 inset-x-0 h-2 bg-indigo-500"></div>}
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 ${i === 1 ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-400'}`}>
                     <tier.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-950 mb-2">{tier.name}</h3>
                  <div className="text-4xl font-black text-indigo-600 mb-10 tracking-tighter">{tier.price}</div>
                  <ul className="space-y-4 mb-10">
                     {tier.benefits.map((b, idx) => (
                        <li key={idx} className="flex items-center gap-3 text-sm font-bold text-slate-600">
                           <CheckCircle className="w-4 h-4 text-emerald-500" /> {b}
                        </li>
                     ))}
                  </ul>
                  <button className={`w-full py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${i === 1 ? 'bg-indigo-600 text-white shadow-xl' : 'bg-slate-900 text-white'}`}>
                     Select Plan
                  </button>
               </div>
            ))}
         </div>
      </section>

      {/* 3D/CAD Marketplace */}
      <section className="space-y-12">
         <div className="flex items-center justify-between border-b border-slate-100 pb-10">
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter flex items-center gap-4">
               <Boxes className="w-10 h-10 text-indigo-600" /> {t.assetStore}
            </h2>
            <button className="px-10 py-4 bg-slate-950 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3">
               <Sparkles className="w-4 h-4" /> {t.monetizeBtn}
            </button>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {assets.map(asset => (
               <div key={asset.id} className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm group hover:shadow-2xl transition-all">
                  <div className="aspect-[4/3] relative overflow-hidden">
                     <img src={asset.image} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-1000" />
                     <div className="absolute top-4 left-4 bg-slate-900/60 backdrop-blur-md px-3 py-1 rounded-full text-[8px] font-black text-white uppercase border border-white/10">
                        {asset.fileFormat}
                     </div>
                  </div>
                  <div className="p-8">
                     <h4 className="text-lg font-black text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-1">{asset.title}</h4>
                     <div className="flex items-center justify-between mb-8">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">By {asset.seller}</span>
                        <div className="flex items-center gap-1">
                           <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />
                           <span className="text-[10px] font-black text-slate-900">{asset.rating}</span>
                        </div>
                     </div>
                     <div className="flex items-center justify-between">
                        <span className="text-2xl font-black text-indigo-600 tracking-tighter">{asset.price}</span>
                        <button className="w-12 h-12 flex items-center justify-center bg-slate-50 text-slate-900 rounded-xl hover:bg-indigo-600 hover:text-white transition-all">
                           <ShoppingBag className="w-5 h-5" />
                        </button>
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </section>

      {/* Market Intelligence */}
      <section className="bg-indigo-600 rounded-[4rem] p-16 text-white shadow-2xl relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-full h-full opacity-5 pointer-events-none">
            <BarChart3 className="w-full h-full scale-150 -rotate-12" />
         </div>
         <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20">
            <div className="space-y-10">
               <h2 className="text-5xl font-black tracking-tighter flex items-center gap-6">
                  <Cpu className="w-12 h-12 text-indigo-200" /> {t.marketIntel}
               </h2>
               <p className="text-indigo-100 text-lg font-bold leading-relaxed opacity-80">
                  Access proprietary neural analytics of building trends, material cost projections, and spatial ROI metrics.
               </p>
               <div className="space-y-4">
                  {[
                    '2026 Aesthetic Forecast (GCC)',
                    'Material Volatility Index',
                    'Strategic Development Hotspots'
                  ].map((item, idx) => (
                     <div key={idx} className="flex items-center gap-4 p-5 bg-white/10 rounded-2xl border border-white/10">
                        <div className="w-2 h-2 bg-indigo-300 rounded-full"></div>
                        <span className="text-sm font-black uppercase tracking-widest">{item}</span>
                     </div>
                  ))}
               </div>
               <button className="px-12 py-6 bg-white text-indigo-600 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:bg-indigo-50 transition-all">
                  {t.buyReport}
               </button>
            </div>
            <div className="bg-white/5 backdrop-blur-xl rounded-[3rem] p-12 border border-white/10">
               {isLoadingReport ? (
                 <div className="h-full flex flex-col items-center justify-center space-y-6">
                    <Sparkles className="w-12 h-12 text-indigo-200 animate-spin" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-200">Processing Big Data...</span>
                 </div>
               ) : activeReport && (
                 <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                    <div className="flex justify-between items-start">
                       <h3 className="text-2xl font-black tracking-tighter">{activeReport.title}</h3>
                       <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-[8px] font-black uppercase tracking-widest">Verified 2025</span>
                    </div>
                    <p className="text-sm text-indigo-100 font-bold leading-relaxed">{activeReport.executiveSummary}</p>
                    <div className="grid grid-cols-2 gap-4">
                       {activeReport.investmentHotspots?.map((hot: string, i: number) => (
                          <div key={i} className="p-4 bg-white/5 rounded-xl border border-white/5">
                             <MapPin className="w-4 h-4 text-indigo-300 mb-2" />
                             <span className="text-[10px] font-black">{hot}</span>
                          </div>
                       ))}
                    </div>
                 </div>
               )}
            </div>
         </div>
      </section>

      {/* B2B Portal */}
      <section className="space-y-12">
         <div className="flex items-center justify-between border-b border-slate-100 pb-10">
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter flex items-center gap-4">
               <Briefcase className="w-10 h-10 text-indigo-600" /> {t.b2bPortal}
            </h2>
            <div className="flex items-center gap-3">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Contracts: 42</span>
            </div>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {b2bJobs.map(job => (
               <div key={job.id} className="p-10 bg-white rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all group flex flex-col md:flex-row items-center gap-10">
                  <div className="w-24 h-24 bg-slate-50 rounded-3xl flex items-center justify-center shrink-0">
                     <Building2 className="w-10 h-10 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                     <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                        <h3 className="text-2xl font-black text-slate-950 tracking-tight">{job.role}</h3>
                        <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest">{job.requiredRank}</span>
                     </div>
                     <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">{job.company} • {job.location}</p>
                     <div className="flex items-center justify-center md:justify-start gap-8">
                        <div>
                           <div className="text-xl font-black text-slate-950">{job.budget}</div>
                           <div className="text-[8px] text-slate-400 font-black uppercase tracking-widest">Est. Retainer</div>
                        </div>
                        <button className="px-8 py-3 bg-slate-950 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all flex items-center gap-2">
                           View Brief <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </section>

      {/* Supplier Affiliate Network */}
      <section className="bg-slate-50 rounded-[4rem] p-16 border border-slate-100">
         <div className="flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="max-w-xl">
               <h2 className="text-4xl font-black text-slate-950 tracking-tighter mb-4">{t.affiliateTitle}</h2>
               <p className="text-slate-500 font-bold text-lg leading-relaxed mb-8">
                  Connect with the world's leading manufacturers. Earn up to 12% affiliate commission on every material specification.
               </p>
               <div className="flex flex-wrap gap-4">
                  {['Furniture', 'Lighting', 'Fabrics', 'Finishes'].map(cat => (
                     <span key={cat} className="px-6 py-2 bg-white rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-100">{cat}</span>
                  ))}
               </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
               {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-32 h-32 bg-white rounded-3xl border border-slate-100 flex items-center justify-center hover:scale-105 transition-transform shadow-sm">
                     <Factory className="w-10 h-10 text-slate-200" />
                  </div>
               ))}
            </div>
         </div>
      </section>
    </div>
  );
};

export default MonetizationHub;
