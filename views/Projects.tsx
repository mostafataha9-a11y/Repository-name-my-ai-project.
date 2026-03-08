
import React, { useState, useEffect } from 'react';
import { Project, UserRank, Language } from '../types';
import ProjectCard from '../components/ProjectCard';
import ProjectDetail from '../components/ProjectDetail';
import { Filter, Search, Grid, List as ListIcon, SlidersHorizontal, Loader2, Sparkles, LayoutGrid, DollarSign, Scaling, Trophy } from 'lucide-react';

interface ProjectsProps {
  lang: Language;
}

const MOCK_PROJECTS: Project[] = [
  {
    id: 'p1',
    title: 'Modern Japandi Living Room',
    author: 'Eng. Omar Bakri',
    rank: UserRank.GOLD,
    imageBefore: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1200',
    imageAfter: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=1200',
    budget: '$15,000',
    budgetNumeric: 15000,
    tags: ['Japandi', 'Minimalist'],
    description: 'A transformative spatial overhaul merging Scandinavian efficiency with Japanese aesthetics. The project focused on light optimization and organic textures.',
    location: 'Dubai, UAE',
    materials: ['Natural Oak', 'Linen', 'Ceramic'],
    awards: [{ type: 'Innovation', year: 2024, grade: 'Platinum' }],
    likes: 1240,
    area: '45sqm',
    areaNumeric: 45,
    style: 'Minimalist',
    clientReview: 'The transformation exceeded our wildest expectations. The space feels infinite yet cozy.',
    completionDate: 'Oct 2024',
    consultationFee: '$150/hr',
    isVerifiedProject: true,
    integrityScore: 94
  },
  {
    id: 'p2',
    title: 'Neo-Classical Master Suite',
    author: 'Elena Rossi',
    rank: UserRank.ARCHITECT_MASTERS,
    imageBefore: 'https://images.unsplash.com/photo-1505691938895-1758d7eaa511?auto=format&fit=crop&q=80&w=1200',
    imageAfter: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&q=80&w=1200',
    budget: '$220,000',
    budgetNumeric: 220000,
    tags: ['Classical', 'Luxury'],
    description: 'Bespoke neo-classical restoration featuring hand-carved moldings and Italian marble finishes. Designed for an ultra-luxury residential estate.',
    location: 'Milan, Italy',
    materials: ['Marble', 'Gilding', 'Velvet'],
    awards: [{ type: 'Luxury', year: 2023, grade: 'Gold' }],
    likes: 2890,
    area: '132sqm',
    areaNumeric: 132,
    style: 'Classic',
    clientReview: 'Elena is a visionary. Her attention to historical detail is unparalleled in modern architecture.',
    completionDate: 'Dec 2023',
    consultationFee: '$200/hr',
    isVerifiedProject: true,
    integrityScore: 98
  }
];

const Projects: React.FC<ProjectsProps> = ({ lang }) => {
  const [activeSubTab, setActiveSubTab] = useState('case-studies');
  const [activeStyle, setActiveStyle] = useState('all');
  const [budgetRange, setBudgetRange] = useState<number>(1000000);
  const [areaRange, setAreaRange] = useState<number>(500);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const t = {
    en: {
      title: 'Global Case Studies',
      subtitle: 'Analyze documented spatial transformations from elite architectural creators.',
      nav: {
        caseStudies: 'Case Studies',
        analytics: 'Analytics',
        archive: 'Archive',
        standards: 'Standards'
      },
      styles: ['All', 'Minimalist', 'Classic', 'Industrial', 'Islamic'],
      refine: 'Advanced Filters',
      search: 'Search project ID, style, or architect...',
      aiFeatured: 'Certified Projects Only',
      budgetLabel: 'Max Investment',
      areaLabel: 'Max Area (sqm)',
      awardLabel: 'Award Winning Only',
      apply: 'Apply Audit Filters'
    },
    ar: {
      title: 'دراسات الحالة العالمية',
      subtitle: 'حلل التحولات المكانية الموثقة من نخبة المبدعين المعماريين.',
      nav: {
        caseStudies: 'دراسات الحالة',
        analytics: 'التحليلات',
        archive: 'الأرشيف',
        standards: 'المعايير'
      },
      styles: ['الكل', 'بسيط', 'كلاسيكي', 'صناعي', 'إسلامي'],
      refine: 'فلاتر متقدمة',
      search: 'ابحث عن رقم المشروع، الطراز، أو المعماري...',
      aiFeatured: 'المشاريع الموثقة فقط',
      budgetLabel: 'أقصى ميزانية',
      areaLabel: 'أقصى مساحة (م٢)',
      awardLabel: 'الحائزة على جوائز فقط',
      apply: 'تطبيق الفلاتر المهنية'
    }
  }[lang];

  const filteredProjects = MOCK_PROJECTS.filter(p => {
    const styleMatch = activeStyle === 'all' || p.style.toLowerCase() === activeStyle.toLowerCase();
    const budgetMatch = p.budgetNumeric <= budgetRange;
    const areaMatch = p.areaNumeric <= areaRange;
    return styleMatch && budgetMatch && areaMatch;
  });

  if (selectedProject) {
    return (
      <ProjectDetail 
        project={selectedProject} 
        lang={lang} 
        onBack={() => setSelectedProject(null)} 
      />
    );
  }

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Internal Navigation */}
      <div className="flex items-center gap-8 border-b border-slate-100 pb-4 overflow-x-auto no-scrollbar">
        {Object.entries(t.nav).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setActiveSubTab(key)}
            className={`text-[11px] font-black uppercase tracking-[0.2em] pb-4 transition-all relative ${
              activeSubTab === key ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {label as string}
            {activeSubTab === key && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 border-b border-slate-100 pb-16">
        <div className="max-w-2xl">
          <div className="flex items-center gap-4 mb-6">
             <div className="w-14 h-14 bg-indigo-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl shadow-indigo-600/30">
               <Trophy className="w-7 h-7" />
             </div>
             <div>
                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.4em] block">{t.aiFeatured}</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">42,000 Verified Studies</span>
             </div>
          </div>
          <h1 className="text-6xl font-black text-slate-950 mb-6 tracking-tighter leading-none">{t.title}</h1>
          <p className="text-slate-500 font-bold text-xl max-w-xl leading-relaxed">{t.subtitle}</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-4 px-10 py-5 rounded-[1.5rem] border text-[11px] font-black transition-all shadow-xl uppercase tracking-widest ${showFilters ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-900 border-slate-100 hover:border-indigo-300'}`}
          >
            <SlidersHorizontal className="w-5 h-5" /> {t.refine}
          </button>
        </div>
      </div>

      {/* Advanced Filter Panel */}
      {showFilters && (
        <div className="bg-white rounded-[3rem] p-12 border border-slate-100 shadow-2xl animate-in slide-in-from-top-4 duration-500 grid grid-cols-1 md:grid-cols-3 gap-12">
           <div className="space-y-6">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-3">
                 <DollarSign className="w-4 h-4 text-indigo-600" /> {t.budgetLabel}
              </label>
              <input 
                type="range" min="5000" max="1000000" step="5000"
                value={budgetRange} onChange={(e) => setBudgetRange(Number(e.target.value))}
                className="w-full accent-indigo-600 h-1.5 bg-slate-100 rounded-full appearance-none"
              />
              <div className="flex justify-between font-black text-slate-900 tracking-tighter text-lg">
                 <span>$5k</span>
                 <span className="text-indigo-600">${budgetRange.toLocaleString()}</span>
              </div>
           </div>
           <div className="space-y-6">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-3">
                 <Scaling className="w-4 h-4 text-indigo-600" /> {t.areaLabel}
              </label>
              <input 
                type="range" min="10" max="2000" step="10"
                value={areaRange} onChange={(e) => setAreaRange(Number(e.target.value))}
                className="w-full accent-indigo-600 h-1.5 bg-slate-100 rounded-full appearance-none"
              />
              <div className="flex justify-between font-black text-slate-900 tracking-tighter text-lg">
                 <span>10m²</span>
                 <span className="text-indigo-600">{areaRange}m²</span>
              </div>
           </div>
           <div className="flex items-end">
              <button 
                onClick={() => setShowFilters(false)}
                className="w-full py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl shadow-indigo-600/30 hover:bg-indigo-500 transition-all"
              >
                {t.apply}
              </button>
           </div>
        </div>
      )}

      {/* Main Search & Style Bar */}
      <div className="flex flex-col xl:flex-row gap-8 items-center">
        <div className="relative flex-1 w-full group">
          <div className="absolute inset-0 bg-indigo-600/5 blur-3xl opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
          <Search className={`absolute ${lang === 'ar' ? 'right-8' : 'left-8'} top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400`} />
          <input 
            type="text" 
            placeholder={t.search}
            className={`w-full ${lang === 'ar' ? 'pr-20 pl-8' : 'pl-20 pr-8'} py-7 bg-white border border-slate-50 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 focus:ring-2 focus:ring-indigo-500 transition-all outline-none font-bold text-base placeholder:text-slate-300`}
          />
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 xl:pb-0 no-scrollbar w-full xl:w-auto">
          {t.styles.map((style) => (
            <button 
              key={style}
              onClick={() => setActiveStyle(style.toLowerCase())}
              className={`whitespace-nowrap px-10 py-5 rounded-full text-[11px] font-black uppercase tracking-[0.2em] transition-all ${
                activeStyle === style.toLowerCase() ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-600/40' : 'bg-white text-slate-500 border border-slate-100 hover:border-indigo-300'
              }`}
            >
              {style}
            </button>
          ))}
        </div>
      </div>

      {/* Project Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-[3.5rem] border border-slate-50 p-8 space-y-8 shadow-sm">
              <div className="aspect-[4/3] rounded-[3rem] loading-shimmer"></div>
              <div className="h-10 w-3/4 rounded-2xl loading-shimmer"></div>
              <div className="h-6 w-1/2 rounded-2xl loading-shimmer"></div>
              <div className="pt-8 border-t border-slate-50 flex gap-6">
                 <div className="w-14 h-14 rounded-[1.5rem] loading-shimmer"></div>
                 <div className="flex-1 space-y-3">
                    <div className="h-5 w-1/2 rounded-lg loading-shimmer"></div>
                    <div className="h-3 w-1/3 rounded-lg loading-shimmer"></div>
                 </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="min-h-[600px] flex items-center justify-center border-2 border-dashed border-slate-100 rounded-[4rem] bg-slate-50/50">
          <div className="text-center space-y-4">
            <Grid className="w-16 h-16 text-slate-200 mx-auto" />
            <span className="text-slate-300 font-black uppercase tracking-[0.3em] text-[10px] block">
              {lang === 'ar' ? 'مساحة محجوزة لدراسات الحالة العالمية' : 'Space Reserved for Global Case Studies'}
            </span>
          </div>
        </div>
      )}

      {/* Professional Call to Action Placeholder */}
      <section className="min-h-[300px] flex items-center justify-center border-2 border-dashed border-slate-100 rounded-[4rem] mt-32 bg-slate-50/30">
        <div className="text-center space-y-4">
          <Sparkles className="w-12 h-12 text-slate-200 mx-auto" />
          <span className="text-slate-300 font-black uppercase tracking-[0.3em] text-[10px] block">
            {lang === 'ar' ? 'مساحة محجوزة للعروض الترويجية المهنية' : 'Space Reserved for Professional Promotions'}
          </span>
        </div>
      </section>
    </div>
  );
};

export default Projects;
