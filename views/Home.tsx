
import React, { useState } from 'react';
/* Added missing Smartphone icon import */
import { ArrowUpRight, Award, Flame, Users, BookOpen, Star, TrendingUp, Sparkles, Globe2, ShieldCheck, Zap, Map, Building2, Factory, ChevronRight, Crown, Medal, Box, Smartphone } from 'lucide-react';
import { UserRank, Language, Region } from '../types';

interface HomeProps {
  lang: Language;
  onNavigateToAR?: () => void;
}

const Home: React.FC<HomeProps> = ({ lang, onNavigateToAR }) => {
  const [selectedRegion, setSelectedRegion] = useState<Region>(Region.GULF);

  const t = {
    en: {
      heroTitle: 'Designing Global Intelligence',
      heroSub: 'The ultimate neural ecosystem for architects and interior designers. Performance-first, AI-driven, globally connected.',
      statsProjects: 'Verified Case Studies',
      statsUsers: 'Master Designers',
      featured: 'Emerging Global Aesthetics',
      topCreators: 'Architectural Leaderboard',
      expansion: 'Strategic Global Expansion',
      markets: 'Target Markets 2025',
      partnerships: 'Global Network Partners',
      awardsTitle: 'Annual Design Awards 2025',
      awardsSub: 'Recognizing excellence in AI-integrated architecture.',
      tryARNow: 'Try Augmented Reality Now'
    },
    ar: {
      heroTitle: 'هندسة الذكاء العالمي',
      heroSub: 'المنظومة العصبية النهائية للمعماريين ومصممي الديكور. أداء فائق، ذكاء اصطناعي، تواصل عالمي.',
      statsProjects: 'دراسات حالة موثقة',
      statsUsers: 'كبار المصممين',
      featured: 'جماليات عالمية ناشئة',
      topCreators: 'لوحة متصدري العمارة',
      expansion: 'التوسع العالمي الاستراتيجي',
      markets: 'الأسواق المستهدفة 2025',
      partnerships: 'شركاء الشبكة العالمية',
      awardsTitle: 'جوائز التصميم السنوية 2025',
      awardsSub: 'تكريم التميز في العمارة المدمجة بالذكاء الاصطناعي.',
      tryARNow: 'جرب الواقع المعزز الآن'
    }
  }[lang];

  const marketData = [
    { region: Region.GULF, label: 'Gulf (GCC)', focus: 'Ultra-Luxury & Smart Cities', growth: '+12.4%' },
    { region: Region.EUROPE, label: 'Europe', focus: 'Sustainable Retrofit & Heritage', growth: '+8.1%' },
    { region: Region.AMERICA, label: 'North America', focus: 'Industrial Loft & Modernism', growth: '+9.5%' },
    { region: Region.ASIA, label: 'Asia-Pacific', focus: 'High-Density Smart Living', growth: '+15.2%' }
  ];

  return (
    <div className="space-y-24 animate-in fade-in slide-in-from-top-4 duration-1000">
      {/* Cinematic Hero Section */}
      <section className="relative h-[700px] rounded-[3rem] overflow-hidden group shadow-[0_50px_100px_rgba(0,0,0,0.15)] border border-slate-100">
        <img 
          src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=2000" 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[25s] group-hover:scale-110 ease-out"
          alt="Luxury Architecture"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>
        <div className="relative z-10 h-full flex flex-col justify-end p-10 md:p-20 max-w-5xl">
          <div className="inline-flex items-center gap-3 px-6 py-2.5 bg-indigo-600 shadow-2xl shadow-indigo-600/30 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-white mb-8 border border-white/10">
            <Zap className="w-4 h-4 fill-current" /> DecorGlobal v3.5 Enterprise AI
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white mb-8 leading-[1] tracking-tighter">
            {t.heroTitle}
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl font-bold leading-relaxed opacity-90">
            {t.heroSub}
          </p>
          <div className="flex flex-wrap gap-6">
            <button 
              onClick={onNavigateToAR}
              className="px-12 py-5 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-500 transition-all shadow-[0_20px_50px_rgba(79,70,229,0.3)] hover:scale-105 active:scale-95 flex items-center gap-3"
            >
              <Box className="w-5 h-5" /> {t.tryARNow}
            </button>
            <button className="px-12 py-5 bg-white text-slate-950 font-black rounded-2xl hover:bg-indigo-50 transition-all shadow-2xl hover:scale-105 active:scale-95">
              Explore The Gallery
            </button>
            <button className="px-12 py-5 bg-slate-900/40 backdrop-blur-xl text-white font-black rounded-2xl hover:bg-white/10 transition-all border border-white/20">
              Register as Certified Expert
            </button>
          </div>
        </div>
      </section>

      {/* Global Impact Metrics */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { icon: Globe2, label: t.statsUsers, value: '42k+', color: 'text-indigo-600' },
          { icon: ShieldCheck, label: t.statsProjects, value: '210k', color: 'text-emerald-600' },
          { icon: Star, label: 'Neural Index', value: 'Top 0.1%', color: 'text-amber-500' },
          { icon: Award, label: 'Design Excellence', value: '98/100', color: 'text-indigo-600' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
            <div className={`w-14 h-14 ${stat.color} bg-slate-50 rounded-2xl mb-8 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all duration-500`}>
              <stat.icon className="w-7 h-7" />
            </div>
            <div className="text-4xl font-black text-slate-950 tracking-tighter mb-2">{stat.value}</div>
            <div className="text-[10px] text-slate-400 uppercase font-black tracking-[0.3em]">{stat.label}</div>
          </div>
        ))}
      </section>

      {/* Direct AR Link Section (Command 9 Requirement) */}
      <section className="bg-indigo-600 rounded-[3rem] p-16 text-white relative overflow-hidden group shadow-2xl">
         <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
            <Box className="w-full h-full scale-150 rotate-12" />
         </div>
         <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="max-w-xl space-y-6">
               <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight">
                  {lang === 'ar' ? 'اختبر تصاميمك في واقعك الحقيقي' : 'Experience Designs in Your True Space'}
               </h2>
               <p className="text-indigo-100 font-bold text-lg leading-relaxed opacity-90">
                  {lang === 'ar' ? 'استخدم محرك نواة المكان v4.8 لنشر الأثاث والإضاءة بدقة متناهية مليمترية في منزلك الآن.' : 'Utilize Spatial Core v4.8 to deploy furniture and lighting with sub-millimeter precision in your home now.'}
               </p>
               <button 
                onClick={onNavigateToAR}
                className="px-16 py-6 bg-white text-indigo-600 font-black rounded-[2rem] hover:bg-indigo-50 transition-all shadow-2xl uppercase tracking-[0.3em] text-xs flex items-center gap-4"
               >
                  <Box className="w-5 h-5" /> {t.tryARNow}
               </button>
            </div>
            <div className="w-full md:w-1/3 aspect-square bg-white/10 backdrop-blur-xl rounded-[4rem] border border-white/20 flex items-center justify-center relative shadow-2xl">
                <Smartphone className="w-32 h-32 text-white animate-bounce" />
                <div className="absolute -bottom-4 -right-4 bg-emerald-500 text-white px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest shadow-xl">Real-time (12ms)</div>
            </div>
         </div>
      </section>

      {/* Annual Awards Banner */}
      <section className="bg-slate-950 rounded-[3rem] p-16 text-center text-white relative overflow-hidden group">
         <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/50 via-transparent to-indigo-900/50"></div>
         <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <Medal className="w-full h-full scale-150 rotate-12" />
         </div>
         <div className="relative z-10 space-y-8">
            <Sparkles className="w-16 h-16 text-amber-400 mx-auto mb-4 animate-pulse" />
            <h2 className="text-5xl font-black tracking-tighter">{t.awardsTitle}</h2>
            <p className="text-slate-400 font-bold text-lg uppercase tracking-wide opacity-80">{t.awardsSub}</p>
            <button className="px-16 py-6 bg-amber-500 text-slate-950 font-black rounded-[2rem] hover:bg-amber-400 transition-all shadow-2xl shadow-amber-500/40 uppercase tracking-[0.3em] text-xs">
               Nominate My Project
            </button>
         </div>
      </section>

      {/* Global Expansion Map Section */}
      <section className="bg-white rounded-[3rem] border border-slate-100 p-12 shadow-sm overflow-hidden relative">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-16">
          <div className="lg:w-1/2 space-y-8">
            <div className="flex items-center gap-4">
              <Map className="w-10 h-10 text-indigo-600" />
              <h2 className="text-4xl font-black text-slate-950 tracking-tighter">{t.expansion}</h2>
            </div>
            <p className="text-slate-500 text-lg font-bold leading-relaxed">{t.markets}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {marketData.map((market) => (
                <button 
                  key={market.region}
                  onClick={() => setSelectedRegion(market.region)}
                  className={`p-6 rounded-2xl border transition-all text-left flex flex-col gap-2 ${selectedRegion === market.region ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl' : 'bg-slate-50 border-slate-100 hover:border-indigo-300'}`}
                >
                  <span className="text-xs font-black uppercase tracking-widest opacity-80">{market.label}</span>
                  <span className="text-sm font-bold">{market.focus}</span>
                  <span className={`text-[10px] font-black ${selectedRegion === market.region ? 'text-indigo-200' : 'text-emerald-600'}`}>Growth: {market.growth}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="lg:w-1/2 relative">
             <div className="aspect-square bg-slate-50 rounded-full flex items-center justify-center relative overflow-hidden group">
                <Globe2 className="w-64 h-64 text-slate-200 animate-globe" />
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="p-8 bg-white/80 backdrop-blur rounded-3xl shadow-2xl border border-white max-w-xs text-center">
                      <Zap className="w-10 h-10 text-indigo-600 mx-auto mb-4" />
                      <h4 className="font-black text-slate-900 mb-2">Regional Intelligence</h4>
                      <p className="text-[10px] font-bold text-slate-500 uppercase leading-relaxed">Gemini AI analyzes local building codes and aesthetics for the {selectedRegion} market automatically.</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Partners Marquee */}
      <section className="space-y-12">
        <div className="text-center space-y-4">
           <h2 className="text-3xl font-black text-slate-950 tracking-tighter">{t.partnerships}</h2>
           <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs">Collaborating with the world's most innovative factories and platforms.</p>
        </div>
        <div className="min-h-[200px] flex items-center justify-center border-2 border-dashed border-slate-100 rounded-[3rem]">
           <span className="text-slate-300 font-black uppercase tracking-[0.3em] text-[10px]">Space Reserved for Global Partners</span>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Architectural Feed */}
        <div className="lg:col-span-2 space-y-12">
          <div className="flex items-center justify-between border-b border-slate-100 pb-8">
            <h2 className="text-4xl font-black text-slate-950 tracking-tighter flex items-center gap-4">
              <TrendingUp className="w-10 h-10 text-indigo-600" /> {t.featured}
            </h2>
            <button className="text-indigo-600 text-xs font-black uppercase tracking-[0.2em] hover:underline flex items-center gap-2 group">
              Browse All Mastery <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>
          
          <div className="min-h-[400px] flex items-center justify-center border-2 border-dashed border-slate-100 rounded-[3rem] bg-slate-50/50">
            <span className="text-slate-300 font-black uppercase tracking-[0.3em] text-[10px]">Space Reserved for Emerging Aesthetics</span>
          </div>
        </div>

        {/* Professional Leaderboard */}
        <div className="space-y-12">
          <h2 className="text-4xl font-black text-slate-950 tracking-tighter">{t.topCreators}</h2>
          <div className="bg-white rounded-[3rem] border border-slate-100 p-10 shadow-2xl shadow-slate-200/50 space-y-8 relative overflow-hidden min-h-[300px] flex items-center justify-center border-dashed">
            <span className="text-slate-300 font-black uppercase tracking-[0.3em] text-[10px]">Leaderboard Data Reserved</span>
          </div>
          
          <div className="bg-indigo-600/5 rounded-[2.5rem] p-10 border-2 border-dashed border-indigo-100 flex items-center justify-center min-h-[150px]">
            <span className="text-indigo-300 font-black uppercase tracking-[0.3em] text-[10px]">AI Boost Space Reserved</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
