
import React, { useState, useEffect, useRef } from 'react';
import { 
  Save, Eye, Send, Bold, Italic, List, Link as LinkIcon, Image as ImageIcon, Sparkles, 
  BarChart3, CheckCircle2, AlertCircle, Search, 
  FileText, Wand2, ShieldCheck, Loader2,
  Languages, Globe, BookOpen, Quote, DollarSign, Fingerprint, Lock, Zap, Network, Share2,
  ArrowRight, Volume2, Mic
} from 'lucide-react';
import { Language, Citation, IPStatus } from '../types';
import { 
  generateArticleOutline, 
  getDecorCoWriterExpansion, 
  generateArchitecturalCitations,
  generateIPNeuralFingerprint,
  getSemanticRecommendations,
  refineDictatedText
} from '../services/geminiService';
import VoiceReaderBar from './VoiceReaderBar';

interface ArticleEditorProps {
  lang: Language;
}

const ArticleEditor: React.FC<ArticleEditorProps> = ({ lang }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isCoWriting, setIsCoWriting] = useState(false);
  const [isCiting, setIsCiting] = useState(false);
  const [isProtecting, setIsProtecting] = useState(false);
  const [isVectorSyncing, setIsVectorSyncing] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [citations, setCitations] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [ipStatus, setIpStatus] = useState<IPStatus | null>(null);
  const [vectorStatus, setVectorStatus] = useState<'Idle' | 'Syncing' | 'Linked'>('Idle');
  const [showVoiceReader, setShowVoiceReader] = useState(false);

  // --- Voice Command Listener for Editor ---
  useEffect(() => {
    const handleVoiceCommand = async (e: any) => {
      const { action, text } = e.detail;

      switch (action) {
        case 'SET_TITLE':
          if (text) {
            setIsRefining(true);
            const refined = await refineDictatedText(text, lang);
            setTitle(refined || text);
            setIsRefining(false);
            window.dispatchEvent(new CustomEvent('VOICE_SYSTEM_FEEDBACK', { 
              detail: { message: lang === 'ar' ? `تم إملاء العنوان: ${refined}` : `Title dictated: ${refined}` } 
            }));
          }
          break;

        case 'APPEND_PARA':
          if (text) {
            setIsRefining(true);
            const refined = await refineDictatedText(text, lang);
            setContent(prev => prev + (prev ? '\n\n' : '') + (refined || text));
            setIsRefining(false);
            window.dispatchEvent(new CustomEvent('VOICE_SYSTEM_FEEDBACK', { 
              detail: { message: lang === 'ar' ? "تمت إضافة الفقرة بنجاح" : "Paragraph added successfully" } 
            }));
          }
          break;

        case 'PUBLISH':
          // Simulate publishing
          window.dispatchEvent(new CustomEvent('VOICE_SYSTEM_FEEDBACK', { 
            detail: { message: lang === 'ar' ? "جاري نشر المقال عالمياً" : "Publishing article globally" } 
          }));
          break;
      }
    };

    window.addEventListener('EDITOR_VOICE_COMMAND', handleVoiceCommand);
    return () => window.removeEventListener('EDITOR_VOICE_COMMAND', handleVoiceCommand);
  }, [lang]);

  const handleCoWrite = async () => {
    if (!content.trim()) return;
    setIsCoWriting(true);
    const expansion = await getDecorCoWriterExpansion(content, "Contemporary Neo-Islamic", lang);
    if (expansion) setContent(prev => prev + "\n\n" + expansion);
    setIsCoWriting(false);
  };

  const handleFetchCitations = async () => {
    setIsCiting(true);
    const results = await generateArchitecturalCitations(content.substring(0, 300));
    setCitations(results);
    setIsCiting(false);
  };

  const handleVectorSync = async () => {
    if (!content.trim()) return;
    setIsVectorSyncing(true);
    setVectorStatus('Syncing');
    const recs = await getSemanticRecommendations(content, lang);
    setRecommendations(recs);
    setVectorStatus('Linked');
    setIsVectorSyncing(false);
  };

  const handleProtectIP = async () => {
    setIsProtecting(true);
    const fp = await generateIPNeuralFingerprint(content, "Architect Khalid");
    if (fp) {
      setIpStatus({
        fingerprint: fp.fingerprint,
        isRegistered: true,
        timestamp: new Date(),
        protectionLevel: 'Neural-Shield'
      });
    }
    setIsProtecting(false);
  };

  const translations = {
    en: {
      editorTitle: 'Pro Publishing Engine',
      coWriter: 'Decor AI Co-Writer',
      citations: 'Scientific Bibliography',
      ipTitle: 'Neural IP Shield',
      vectorSync: 'Vector DB Sync',
      semanticRecs: 'Semantic Recommendations',
      monetize: 'Enable Premium Access',
      voiceReader: 'Listen to Article',
      voiceActive: 'AI Voice Dictation Active'
    },
    ar: {
      editorTitle: 'محرك النشر الاحترافي',
      coWriter: 'كاتب الديكور الذكي',
      citations: 'المراجع العلمية',
      ipTitle: 'درع الملكية الفكرية',
      vectorSync: 'مزامنة المتجهات (Vector DB)',
      semanticRecs: 'توصيات البحث الدلالي',
      monetize: 'تفعيل المحتوى المدفوع',
      voiceReader: 'استمع للمقال',
      voiceActive: 'الإملاء الصوتي الذكي نشط'
    }
  };
  const t = translations[lang === 'ar' ? 'ar' : 'en'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 animate-in fade-in duration-700 max-w-[1700px] mx-auto pb-32">
      <div className="lg:col-span-3 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-8">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter flex items-center gap-3">
              {t.editorTitle} 
              {isRefining && <span className="text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-[10px] uppercase tracking-widest flex items-center gap-2 animate-pulse"><Mic className="w-3 h-3" /> {t.voiceActive}</span>}
            </h2>
          </div>
          <div className="flex gap-4">
             <button onClick={() => setShowVoiceReader(true)} className="flex items-center gap-2 px-6 py-3 text-xs font-black rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-200 hover:bg-indigo-100 transition-all">
               <Volume2 className="w-4 h-4" /> {t.voiceReader}
             </button>
             <button onClick={handleVectorSync} className={`flex items-center gap-2 px-6 py-3 text-xs font-black rounded-2xl transition-all ${vectorStatus === 'Linked' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-slate-50 text-slate-400 border border-slate-200'}`}>
               {isVectorSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Network className="w-4 h-4" />}
               {vectorStatus === 'Linked' ? 'Vector Mapped' : t.vectorSync}
             </button>
             <button className="flex items-center gap-2 px-10 py-3 text-xs font-black text-white bg-indigo-600 rounded-2xl shadow-xl">
               <Send className="w-4 h-4" /> Publish Globally
             </button>
          </div>
        </div>

        <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 p-12 min-h-[900px] relative">
          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-5xl font-black border-none focus:ring-0 placeholder:text-slate-100 bg-transparent tracking-tighter"
            placeholder="Visionary Title..."
          />
          <textarea 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={25}
            className="w-full border-none focus:ring-0 text-slate-700 text-xl leading-[1.7] mt-10 no-scrollbar"
            placeholder="Architecture begins with a single thought..."
          ></textarea>
        </div>
      </div>

      <div className="lg:col-span-1 space-y-8">
        <div className="bg-slate-950 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
           <h3 className="font-black text-xs uppercase tracking-[0.2em] text-indigo-400 mb-8 flex items-center gap-3">
             <Sparkles className="w-5 h-5" /> {t.semanticRecs}
           </h3>
           <div className="space-y-4 mb-8">
              {recommendations.length > 0 ? recommendations.map((rec, i) => (
                <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all cursor-pointer">
                   <p className="text-xs font-black mb-1">{rec.title}</p>
                   <div className="flex justify-between items-center">
                      <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest">{Math.round(rec.similarityScore * 100)}% Similarity</span>
                      <ArrowRight className="w-3 h-3" />
                   </div>
                </div>
              )) : (
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest text-center py-10 border border-dashed border-white/10 rounded-2xl">Trigger Vector Sync to load AI recommendations.</p>
              )}
           </div>
           <button onClick={handleVectorSync} disabled={isVectorSyncing} className="w-full py-4 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3">
             {isVectorSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Network className="w-4 h-4" />} Map Embeddings
           </button>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
           <h3 className="font-black text-xs uppercase tracking-[0.2em] text-slate-400 mb-8 flex items-center gap-3">
             <BookOpen className="w-5 h-5 text-indigo-600" /> {t.citations}
           </h3>
           <div className="space-y-4 max-h-60 overflow-y-auto no-scrollbar mb-6">
              {citations.map((c, i) => (
                <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                   <p className="text-[9px] font-black text-slate-900 line-clamp-2">{c.title}</p>
                   <p className="text-[8px] text-slate-400 mt-1 uppercase font-bold">{c.source}</p>
                </div>
              ))}
           </div>
           <button onClick={handleFetchCitations} disabled={isCiting} className="w-full py-3 bg-slate-50 text-slate-600 rounded-xl text-[9px] font-black uppercase tracking-widest border border-slate-200 flex items-center justify-center gap-2">
             {isCiting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Quote className="w-3 h-3" />} Fetch References
           </button>
        </div>
      </div>

      {showVoiceReader && (
        <VoiceReaderBar 
          text={`${title}. ${content}`} 
          lang={lang} 
          onClose={() => setShowVoiceReader(false)} 
        />
      )}
    </div>
  );
};

export default ArticleEditor;
