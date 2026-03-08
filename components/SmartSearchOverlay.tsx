
import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Camera, Sparkles, MapPin, DollarSign, Palette, Loader2, ArrowRight, History, TrendingUp, Filter, Mic, MicOff, Network } from 'lucide-react';
import { performSmartSearch, visualSearchAnalysis, getSearchSuggestions } from '../services/geminiService';
import { Language } from '../types';

interface SmartSearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

const SmartSearchOverlay: React.FC<SmartSearchOverlayProps> = ({ isOpen, onClose, lang }) => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const saved = localStorage.getItem('recent_searches');
    return saved ? JSON.parse(saved) : ['Lighting Audit 2025', 'Modern Kitchen Setup', 'Marble Supplier Search'];
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  const t = {
    en: {
      placeholder: "Ask AI: 'Minimalist villa with $100k budget'...",
      imageSearch: "Visual Search",
      voiceSearch: "Voice Input",
      trending: "Trending Design Aesthetics",
      recent: "Recent Audits",
      aiInsights: "Semantic Vector Breakdown",
      detectStyle: "Detected Style",
      budget: "Recommended Budget",
      location: "Region",
      filters: "Deep Filters",
      suggestions: "Predictive Suggestions",
      vectorSource: "Pinecone / Weaviate Indexing",
      trendingItems: ['Modern Design', 'Small Kitchens', 'Projects in Egypt', 'Sustainable Materials']
    },
    ar: {
      placeholder: "اسأل الذكاء الاصطناعي: 'فيلا مودرن بميزانية 100 ألف دولار'...",
      imageSearch: "البحث بالصور",
      voiceSearch: "البحث الصوتي",
      trending: "جماليات التصميم الرائجة",
      recent: "عمليات التدقيق الأخيرة",
      aiInsights: "تحليل المتجهات الدلالي (Vector)",
      detectStyle: "النمط المكتشف",
      budget: "الميزانية الموصى بها",
      location: "المنطقة",
      filters: "فلاتر متقدمة",
      suggestions: "اقتراحات تنبؤية",
      vectorSource: "فهرسة Pinecone / Weaviate",
      trendingItems: ['تصميم مودرن', 'مطابخ صغيرة', 'مشاريع في مصر', 'ابحث باللغة العربية']
    }
  }[lang];

  useEffect(() => {
    if (query.length > 2) {
      const timer = setTimeout(async () => {
        const suggs = await getSearchSuggestions(query, lang);
        setSuggestions(suggs);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setSuggestions([]);
    }
  }, [query, lang]);

  useEffect(() => {
    if (query.length > 5) {
      const timer = setTimeout(async () => {
        setIsSearching(true);
        const analysis = await performSmartSearch(query, lang);
        setAiAnalysis(analysis);
        setIsSearching(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [query]);

  const toggleVoiceSearch = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.lang = lang === 'ar' ? 'ar-SA' : 'en-US';
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      handleSearchCommit(transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    recognition.start();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsSearching(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = (reader.result as string).split(',')[1];
      const analysis = await visualSearchAnalysis(base64, lang);
      setAiAnalysis(analysis);
      setIsSearching(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSearchCommit = (q: string) => {
    setQuery(q);
    const updated = [q, ...recentSearches.filter(s => s !== q)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recent_searches', JSON.stringify(updated));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-slate-950/95 backdrop-blur-2xl animate-in fade-in duration-500 overflow-y-auto" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-5xl mx-auto w-full px-6 pt-12 pb-20">
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-2xl">
              <Network className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-black text-white tracking-tighter uppercase">{lang === 'ar' ? 'محرك البحث الدلالي المطور' : 'Enhanced Semantic AI Search'}</h2>
          </div>
          <button onClick={onClose} className="w-12 h-12 flex items-center justify-center bg-white/5 text-white rounded-2xl hover:bg-white/10 transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="relative group">
          <div className="absolute inset-0 bg-indigo-600/20 blur-[100px] opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
          <div className="relative flex items-center gap-4 bg-white/5 border border-white/10 rounded-[2.5rem] p-4 shadow-2xl focus-within:border-indigo-500 transition-all">
            <Search className={`w-8 h-8 ${query ? 'text-indigo-500' : 'text-slate-500'} ${lang === 'ar' ? 'mr-4' : 'ml-4'}`} />
            <input 
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.placeholder}
              className="flex-1 bg-transparent border-none focus:ring-0 text-xl md:text-2xl font-bold text-white placeholder:text-slate-600 py-6 text-start"
            />
            <div className="flex items-center gap-2 pr-4">
              <button 
                onClick={toggleVoiceSearch}
                className={`w-14 h-14 flex items-center justify-center rounded-2xl transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-white/10 text-slate-400 hover:text-white'}`}
              >
                {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              </button>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-3 px-6 py-4 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20"
              >
                <Camera className="w-5 h-5" /> <span className="hidden lg:inline">{t.imageSearch}</span>
              </button>
              <input type="file" ref={fileInputRef} className="hidden" onChange={handleImageUpload} accept="image/*" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-16">
          <div className="lg:col-span-2 space-y-12">
            {isSearching ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white/5 rounded-[3rem] border border-white/10">
                 <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-6" />
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">جاري تحليل الاستعلام دلالياً...</p>
              </div>
            ) : aiAnalysis ? (
              <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10 space-y-10 animate-in slide-in-from-bottom-8">
                <div className="flex items-center justify-between border-b border-white/5 pb-8">
                  <h3 className="font-black text-white flex items-center gap-4 text-lg tracking-tighter">
                    <Sparkles className="w-6 h-6 text-indigo-400" /> {t.aiInsights}
                  </h3>
                  <span className="text-[8px] font-black text-indigo-400 uppercase bg-indigo-500/10 px-3 py-1 rounded-full">{t.vectorSource}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                      <Palette className="w-4 h-4 text-indigo-400 mb-3" />
                      <span className="text-[10px] font-black uppercase text-slate-500 block mb-1">{t.detectStyle}</span>
                      <p className="text-xl font-black text-white tracking-tight">{aiAnalysis.detectedStyle}</p>
                   </div>
                   <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                      <DollarSign className="w-4 h-4 text-emerald-400 mb-3" />
                      <span className="text-[10px] font-black uppercase text-slate-500 block mb-1">{t.budget}</span>
                      <p className="text-xl font-black text-emerald-400 tracking-tight">{aiAnalysis.suggestedBudget}</p>
                   </div>
                </div>

                <button className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl flex items-center justify-center gap-4">
                  Explore Vector Matches <ArrowRight className={`w-5 h-5 ${lang === 'ar' ? 'rotate-180' : ''}`} />
                </button>
              </div>
            ) : (
              <div className="space-y-12">
                <div>
                   <h3 className="text-slate-500 font-black text-xs uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                     <TrendingUp className="w-5 h-5 text-indigo-400" /> {t.trending}
                   </h3>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {t.trendingItems.map(style => (
                        <button key={style} onClick={() => handleSearchCommit(style)} className="p-6 bg-white/5 border border-white/10 rounded-[1.5rem] text-white font-black text-[11px] uppercase tracking-widest text-start hover:bg-indigo-600 transition-all group flex justify-between items-center">
                          {style}
                          <ArrowRight className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-all ${lang === 'ar' ? 'rotate-180' : ''}`} />
                        </button>
                      ))}
                   </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-12">
             <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8">
                <h3 className="text-slate-500 font-black text-xs uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                  <History className="w-5 h-5 text-indigo-400" /> {t.recent}
                </h3>
                <div className="space-y-4">
                   {recentSearches.map(term => (
                     <div key={term} onClick={() => handleSearchCommit(term)} className="flex items-center justify-between group cursor-pointer">
                        <span className="text-xs font-bold text-slate-400 group-hover:text-white transition-colors uppercase tracking-tight">{term}</span>
                        <ArrowRight className={`w-4 h-4 text-slate-700 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all ${lang === 'ar' ? 'rotate-180' : ''}`} />
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartSearchOverlay;
