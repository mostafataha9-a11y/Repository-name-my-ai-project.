
import React from 'react';
import { 
  Globe2, Building2, UserPlus, GraduationCap, 
  Trophy, Rocket, MapPin, ChevronRight, 
  Sparkles, Award, ShieldCheck, Flag, 
  ArrowRight, Users, BookOpen, Target
} from 'lucide-react';
import { Language, Region } from '../types';

interface GlobalExpansionViewProps {
  lang: Language;
}

const GlobalExpansionView: React.FC<GlobalExpansionViewProps> = ({ lang }) => {
  const t = {
    en: {
      title: 'Global Expansion & Vision',
      subtitle: 'Scaling our neural design ecosystem across continents.',
      officesTitle: 'Regional Representative Offices',
      officesSub: 'Establishing a physical presence in key design hubs.',
      ambassadorsTitle: 'Platform Ambassadors',
      ambassadorsSub: 'Leading voices in architecture representing DecorGlobal.',
      academyTitle: 'DecorGlobal Academy',
      academySub: 'University partnerships & certified professional training.',
      competitionsTitle: 'Global Design Awards',
      competitionsSub: 'Competing for excellence on a world stage.',
      usAllianceTitle: 'US Strategic Alliance',
      usAllianceSub: 'Entering the North American market through elite partnerships.',
      viewRoadmap: 'View 2025-2030 Roadmap',
      partnershipBtn: 'Join Global Network'
    },
    ar: {
      title: 'رؤية التوسع العالمي',
      subtitle: 'توسيع منظومتنا العصبية للتصميم عبر القارات.',
      officesTitle: 'المكاتب التمثيلية الإقليمية',
      officesSub: 'تأسيس حضور مادي في مراكز التصميم الرئيسية.',
      ambassadorsTitle: 'سفراء المنصة العالميّون',
      ambassadorsSub: 'أصوات رائدة في العمارة يمثلون DecorGlobal.',
      academyTitle: 'أكاديمية DecorGlobal',
      academySub: 'شراكات مع الجامعات وبرامج تدريب مهني معتمد.',
      competitionsTitle: 'جوائز التصميم العالمية',
      competitionsSub: 'التنافس على التميز على المسرح العالمي.',
      usAllianceTitle: 'التحالف الاستراتيجي الأمريكي',
      usAllianceSub: 'دخول سوق أمريكا الشمالية عبر تحالفات نخبوية.',
      viewRoadmap: 'عرض خارطة الطريق 2025-2030',
      partnershipBtn: 'انضم للشبكة العالمية'
    }
  }[lang];

  return (
    <div className="space-y-24 animate-in fade-in duration-1000">
      {/* Hero Section */}
      <section className="bg-slate-950 rounded-[4rem] p-16 text-white relative overflow-hidden shadow-2xl border border-white/5">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/10 blur-[150px]"></div>
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-14 h-14 bg-indigo-600 rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-indigo-600/30">
                <Globe2 className="w-7 h-7" />
              </div>
              <span className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.4em]">DecorGlobal Expansion Hub</span>
            </div>
            <h1 className="text-6xl font-black tracking-tighter mb-6 leading-tight">{t.title}</h1>
            <p className="text-slate-400 text-xl font-bold opacity-80 mb-10 leading-relaxed max-w-xl">{t.subtitle}</p>
            <div className="flex flex-wrap gap-6">
               <button className="px-12 py-6 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-indigo-500 transition-all shadow-2xl">
                  {t.partnershipBtn}
               </button>
               <button className="px-12 py-6 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-white/10 transition-all">
                  {t.viewRoadmap}
               </button>
            </div>
          </div>
          <div className="relative">
             <div className="w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl absolute animate-pulse"></div>
             <Globe2 className="w-64 h-64 text-indigo-500 opacity-20 animate-globe relative z-10" />
          </div>
        </div>
      </section>

      {/* Representative Offices */}
      <section className="space-y-12">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-10">
          <div>
            <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter flex items-center gap-4">
              <Building2 className="w-10 h-10 text-indigo-600" /> {t.officesTitle}
            </h2>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-2">{t.officesSub}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { city: 'London', region: 'Europe', status: 'Active', icon: '🇬🇧' },
            { city: 'Riyadh', region: 'Gulf (GCC)', status: 'Active', icon: '🇸🇦' },
            { city: 'Tokyo', region: 'Asia-Pacific', status: 'Planned', icon: '🇯🇵' }
          ].map((office, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-white/5 shadow-sm hover:shadow-2xl transition-all group">
              <div className="flex justify-between items-start mb-6">
                <div className="text-4xl">{office.icon}</div>
                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${office.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                  {office.status}
                </span>
              </div>
              <h4 className="text-2xl font-black text-slate-950 dark:text-white mb-2">{office.city}</h4>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{office.region}</p>
              <button className="mt-8 flex items-center gap-2 text-indigo-600 text-[10px] font-black uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                Office Details <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Ambassadors & Academy */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <section className="bg-slate-50 dark:bg-white/5 rounded-[4rem] p-12 border border-slate-100 dark:border-white/5">
          <div className="flex items-center gap-4 mb-10">
            <UserPlus className="w-8 h-8 text-indigo-600" />
            <h3 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white">{t.ambassadorsTitle}</h3>
          </div>
          <div className="space-y-6">
            {[1, 2].map(i => (
              <div key={i} className="flex items-center gap-6 p-6 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-50 dark:border-white/5 shadow-sm">
                <img src={`https://i.pravatar.cc/150?u=amb${i}`} className="w-16 h-16 rounded-2xl object-cover" />
                <div>
                  <h4 className="text-lg font-black text-slate-900 dark:text-white">Arch. Sophia Moretti</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Milan, Italy • Luxury Specialist</p>
                </div>
                <button className="ml-auto p-3 bg-slate-50 dark:bg-white/5 rounded-xl hover:text-indigo-600 transition-colors">
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-indigo-600/5 dark:bg-indigo-600/10 rounded-[4rem] p-12 border border-indigo-100 dark:border-white/5">
          <div className="flex items-center gap-4 mb-10">
            <GraduationCap className="w-8 h-8 text-indigo-600" />
            <h3 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white">{t.academyTitle}</h3>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] text-center border border-slate-50 dark:border-white/5">
              <BookOpen className="w-8 h-8 text-indigo-600 mx-auto mb-4" />
              <h4 className="font-black text-sm mb-2">University Alliance</h4>
              <p className="text-[9px] text-slate-400 uppercase font-black">12 Partners Globally</p>
            </div>
            <div className="p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] text-center border border-slate-50 dark:border-white/5">
              <Award className="w-8 h-8 text-emerald-500 mx-auto mb-4" />
              <h4 className="font-black text-sm mb-2">Certified Training</h4>
              <p className="text-[9px] text-slate-400 uppercase font-black">BIM & AI Mastery</p>
            </div>
          </div>
        </section>
      </div>

      {/* Global Competitions & US Alliance */}
      <section className="bg-slate-950 rounded-[4rem] p-16 text-white relative overflow-hidden border border-white/5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
          <div className="space-y-8">
            <h2 className="text-4xl font-black tracking-tighter flex items-center gap-4">
              <Trophy className="w-10 h-10 text-amber-500" /> {t.competitionsTitle}
            </h2>
            <p className="text-slate-400 font-bold text-lg leading-relaxed">{t.competitionsSub}</p>
            <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/10">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Next Major Event</span>
                <span className="px-3 py-1 bg-amber-500 text-slate-950 rounded-full text-[8px] font-black uppercase">Opening Dec 2025</span>
              </div>
              <h4 className="text-xl font-black">Sustainable Skyscraper Challenge</h4>
              <p className="text-xs text-slate-500 mt-2 font-medium">Grand Prize: $50,000 + Studio Incubation</p>
            </div>
          </div>
          <div className="space-y-8 border-l border-white/10 pl-16">
            <h2 className="text-4xl font-black tracking-tighter flex items-center gap-4">
              <Flag className="w-10 h-10 text-indigo-500" /> {t.usAllianceTitle}
            </h2>
            <p className="text-slate-400 font-bold text-lg leading-relaxed">{t.usAllianceSub}</p>
            <div className="flex items-center gap-6 p-8 bg-indigo-600/10 rounded-[2.5rem] border border-indigo-500/20">
              <Rocket className="w-12 h-12 text-indigo-400" />
              <div>
                <h4 className="font-black text-lg">North American Launchpad</h4>
                <p className="text-xs text-indigo-200/60 font-medium">Strategic alliance with Top 10 US Architecture Firms.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GlobalExpansionView;
