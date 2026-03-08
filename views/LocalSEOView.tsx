
import React, { useState, useEffect } from 'react';
import { MapPin, Globe, Sparkles, TrendingUp, Search, Building2, LayoutGrid, ArrowRight } from 'lucide-react';
import { getLocalSEOData } from '../services/geminiService';
import { Language } from '../types';

interface LocalSEOViewProps {
  lang: Language;
}

const CITIES = ['Riyadh', 'Dubai', 'London', 'Paris', 'New York', 'Doha'];

const LocalSEOView: React.FC<LocalSEOViewProps> = ({ lang }) => {
  const [activeCity, setActiveCity] = useState(CITIES[0]);
  const [seoData, setSeoData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchLocalData = async () => {
      setIsLoading(true);
      const data = await getLocalSEOData(activeCity, lang);
      setSeoData(data);
      setIsLoading(false);
    };
    fetchLocalData();
  }, [activeCity, lang]);

  const t = {
    en: {
      title: 'Global City Design Hub',
      subtitle: 'Localized architectural trends and AI-driven spatial intelligence.',
      marketIntel: 'Regional Market Intelligence',
      topStyles: 'Dominant Styles in',
      knowledgeGraph: 'Knowledge Graph Integration'
    },
    ar: {
      title: 'مركز تصميم المدن العالمي',
      subtitle: 'اتجاهات معمارية محلية وذكاء مكاني مدعوم بالذكاء الاصطناعي.',
      marketIntel: 'ذكاء السوق الإقليمي',
      topStyles: 'الأنماط المهيمنة في',
      knowledgeGraph: 'تكامل مخطط المعرفة (Knowledge Graph)'
    }
  }[lang];

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-slate-100 pb-10">
        <div className="max-w-xl">
           <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-4">{t.title}</h1>
           <p className="text-slate-500 font-bold text-lg uppercase tracking-tight opacity-80">{t.subtitle}</p>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
          {CITIES.map(city => (
            <button 
              key={city}
              onClick={() => setActiveCity(city)}
              className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeCity === city ? 'bg-indigo-600 text-white shadow-xl' : 'bg-white text-slate-500 border border-slate-100 hover:border-indigo-200'}`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
         <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 blur-3xl"></div>
               <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-8">
                     <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-600/20">
                        <MapPin className="w-6 h-6" />
                     </div>
                     <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tighter">{seoData?.h1Header || activeCity}</h2>
                        <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{t.topStyles} {activeCity}</span>
                     </div>
                  </div>

                  <p className="text-slate-600 text-xl font-medium leading-relaxed mb-10">
                    {seoData?.metaDescription || 'Loading localized architectural data...'}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="p-6 bg-slate-50 rounded-2xl border border-white">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                           <TrendingUp className="w-4 h-4 text-indigo-600" /> SEO Keywords
                        </h4>
                        <div className="flex flex-wrap gap-2">
                           {seoData?.schemaKeywords?.map((kw: string) => (
                             <span key={kw} className="px-3 py-1 bg-white rounded-lg text-[9px] font-black text-indigo-600 shadow-sm">#{kw}</span>
                           ))}
                        </div>
                     </div>
                     <div className="p-6 bg-slate-50 rounded-2xl border border-white">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                           <Globe className="w-4 h-4 text-emerald-600" /> {t.marketIntel}
                        </h4>
                        <p className="text-[10px] text-slate-500 font-bold uppercase leading-relaxed">{seoData?.localContext || 'Processing regional metrics...'}</p>
                     </div>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {[1, 2].map(i => (
                 <div key={i} className="group cursor-pointer rounded-[2.5rem] overflow-hidden bg-white border border-slate-100 shadow-sm hover:shadow-2xl transition-all">
                    <div className="aspect-video bg-slate-100 overflow-hidden">
                       <img src={`https://images.unsplash.com/photo-${1550000000000 + i}?auto=format&fit=crop&q=80&w=600`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                    </div>
                    <div className="p-8">
                       <h3 className="text-lg font-black text-slate-900 mb-2">Featured {activeCity} Concept</h3>
                       <p className="text-xs text-slate-500 font-medium line-clamp-2">Localized design strategy for high-end {activeCity} urban apartments.</p>
                       <button className="mt-6 flex items-center gap-2 text-indigo-600 text-[10px] font-black uppercase tracking-widest">
                          Full Audit <ArrowRight className="w-4 h-4" />
                       </button>
                    </div>
                 </div>
               ))}
            </div>
         </div>

         <div className="space-y-8">
            <div className="bg-slate-950 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
               <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 blur-3xl"></div>
               <h3 className="text-sm font-black uppercase tracking-[0.2em] text-indigo-400 mb-8 flex items-center gap-3">
                 <Building2 className="w-5 h-5" /> {t.knowledgeGraph}
              </h3>
              <div className="space-y-4">
                 <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2 block">LD+JSON Schema</span>
                    <pre className="text-[8px] text-indigo-300 font-mono overflow-x-auto">
                      {`{
  "@type": "Service",
  "areaServed": "${activeCity}",
  "provider": "DecorGlobal AI"
}`}
                    </pre>
                 </div>
                 <div className="flex items-center gap-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                    <Sparkles className="w-5 h-5 text-emerald-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Google Discover Ready</span>
                 </div>
              </div>
            </div>

            <div className="p-10 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
               <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">{lang === 'ar' ? 'أفضل المدن نمواً' : 'Top Growth Cities'}</h3>
               <div className="space-y-4">
                  {CITIES.slice(0, 4).map(city => (
                    <div key={city} className="flex justify-between items-center group cursor-pointer" onClick={() => setActiveCity(city)}>
                       <span className={`text-sm font-black transition-colors ${activeCity === city ? 'text-indigo-600' : 'text-slate-900'}`}>{city}</span>
                       <span className="text-[10px] font-black text-emerald-500">+14.2%</span>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default LocalSEOView;
