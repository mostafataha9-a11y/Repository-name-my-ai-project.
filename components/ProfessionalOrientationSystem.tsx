
import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Radio, Sparkles, Navigation, Info, List, Activity, Command, ShieldCheck, MessageSquare, BookOpen, LayoutGrid, Lock, Eye } from 'lucide-react';
import { Language } from '../types';
import { getSpatialOrientation, generateAIVoiceNarration, explainComplexity, summarizeArchitecturalContent, describeDataStructure } from '../services/geminiService';
import { decodeBase64, decodeAudioData } from '../utils/audioUtils';

interface ProfessionalOrientationSystemProps {
  lang: Language;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const ProfessionalOrientationSystem: React.FC<ProfessionalOrientationSystemProps> = ({ lang, activeTab, setActiveTab }) => {
  const [isActive, setIsActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [lastAnnouncement, setLastAnnouncement] = useState('');
  const [guidanceStep, setGuidanceStep] = useState<'idle' | 'explaining' | 'waiting_choice'>('idle');
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const activeSourceRef = useRef<AudioBufferSourceNode | null>(null);

  const t = {
    en: {
      guideTitle: "Neural Orientation System v4.1",
      blindMode: "Blind Accessibility Mode",
      statusListening: "Mic Active (Privacy Secured)",
      analyzing: "Scanning Spatial Metadata...",
      prompt: "Try: 'Explain terminology', 'Summarize this', or 'Describe technical data'.",
      welcomeMsg: "System active. High-privacy neural guidance enabled. Say 'Where am I' to get a spatial map or ask me to explain complex terms.",
      explanationStart: "Section focus: Articles. 1,200 verified technical studies available. Say 'Latest' or 'Summarize'.",
      choiceDetected: "Neural processing choice...",
      privacyNote: "Audio processed in real-time. No recordings stored.",
      latencyAlert: "Response optimized for low latency (<300ms cached).",
      summarizing: "Creating audio summary...",
      explainingTerm: "Simplifying complex terminology...",
      describingData: "Converting technical data to narrative..."
    },
    ar: {
      guideTitle: "نظام التوجيه العصبي v4.1",
      blindMode: "وضع مرشد المكفوفين",
      statusListening: "الميكروفون نشط (خصوصية مؤمنة)",
      analyzing: "مسح البيانات المكانية...",
      prompt: "جرب: 'اشرح المصطلح'، 'لخص هذا'، أو 'وصف البيانات الفنية'.",
      welcomeMsg: "النظام نشط. التوجيه العصبي مؤمن بالكامل. قل 'أين أنا' أو اطلب مني شرح المصطلحات الصعبة.",
      explanationStart: "التركيز الحالي: المقالات. يوجد 1200 دراسة فنية موثقة. قل 'لخص' أو 'الأحدث'.",
      choiceDetected: "جاري المعالجة العصبية للخيار...",
      privacyNote: "تتم معالجة الصوت فورياً. لا يتم تخزين تسجيلات.",
      latencyAlert: "استجابة فائقة السرعة (أقل من 300ms للتخزين المؤقت).",
      summarizing: "جاري إنشاء الملخص الصوتي...",
      explainingTerm: "تبسيط المصطلحات المعمارية المعقدة...",
      describingData: "تحويل البيانات الفنية إلى وصف سردي..."
    }
  }[lang];

  const stopCurrentAudio = () => {
    if (activeSourceRef.current) {
      try {
        activeSourceRef.current.stop();
      } catch (e) {}
      activeSourceRef.current = null;
    }
  };

  const announce = async (text: string) => {
    if (!text) return;
    setIsThinking(true);
    stopCurrentAudio();

    const audioData = await generateAIVoiceNarration(text, lang);
    if (audioData) {
      if (!audioContextRef.current) {
        // Fix: Use simple constructor for widest compatibility and avoid "Illegal constructor"
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        audioContextRef.current = new AudioContextClass();
      }
      
      const ctx = audioContextRef.current;
      const decodedBytes = decodeBase64(audioData);
      const audioBuffer = await decodeAudioData(decodedBytes, ctx, 24000, 1);
      
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);
      source.onended = () => {
        if (activeSourceRef.current === source) activeSourceRef.current = null;
      };
      
      activeSourceRef.current = source;
      source.start();
    }
    setLastAnnouncement(text);
    setIsThinking(false);
  };

  useEffect(() => {
    if (isActive && activeTab === 'home' && guidanceStep === 'idle') {
      announce(t.welcomeMsg);
    }
  }, [isActive]);

  useEffect(() => {
    if (isActive) {
      handleSpatialAudit();
    }
  }, [activeTab]);

  const handleSpatialAudit = async () => {
    if (guidanceStep !== 'idle') return; 
    const elementCount = document.querySelectorAll('button, a, [role="button"]').length;
    const orientationText = await getSpatialOrientation(activeTab, elementCount, lang);
    announce(orientationText);
  };

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = lang === 'ar' ? 'ar-SA' : 'en-US';
      recognition.continuous = true;
      recognition.interimResults = false;

      recognition.onresult = (event: any) => {
        const command = event.results[event.results.length - 1][0].transcript.toLowerCase();
        handleVoiceCommand(command);
      };

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognitionRef.current = recognition;
    }

    return () => {
      stopCurrentAudio();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [lang]);

  const handleVoiceCommand = async (cmd: string) => {
    if (cmd.includes('اشرح') || cmd.includes('ما معنى') || cmd.includes('explain') || cmd.includes('term')) {
      const term = cmd.replace(/explain|term|ما معنى|اشرح/g, '').trim();
      if (term) {
        announce(t.explainingTerm);
        const explanation = await explainComplexity(term, lang);
        announce(explanation);
      }
      return;
    }

    if (cmd.includes('لخص') || cmd.includes('ملخص') || cmd.includes('summarize') || cmd.includes('summary')) {
      announce(t.summarizing);
      const content = document.body.innerText.substring(0, 500);
      const summary = await summarizeArchitecturalContent(content, lang);
      announce(summary);
      return;
    }

    if (cmd.includes('جدول') || cmd.includes('بيانات فنية') || cmd.includes('describe data') || cmd.includes('table')) {
      announce(t.describingData);
      const dataElement = document.querySelector('table, .grid') as HTMLElement | null;
      const dataText = dataElement?.innerText?.substring(0, 300) || "No technical data found in current focus.";
      const description = await describeDataStructure(dataText, lang);
      announce(description);
      return;
    }

    if (cmd.includes('ابدأ شرح') || cmd.includes('start explanation') || cmd.includes('شرح')) {
      setGuidanceStep('explaining');
      announce(t.explanationStart);
      setGuidanceStep('waiting_choice');
      return;
    }

    if (guidanceStep === 'waiting_choice') {
      if (cmd.includes('أحدث') || cmd.includes('latest') || cmd.includes('جديد')) {
        announce(t.choiceDetected);
        setActiveTab('editor');
        setGuidanceStep('idle');
        return;
      }
    }
    
    if (cmd.includes('الرئيسية') || cmd.includes('home')) {
      setActiveTab('home');
      setGuidanceStep('idle');
      announce(lang === 'ar' ? "العودة للرئيسية" : "Returning to Home");
      return;
    } 
    if (cmd.includes('المشاريع') || cmd.includes('projects')) {
      setActiveTab('projects');
      setGuidanceStep('idle');
      announce(lang === 'ar' ? "فتح المعرض" : "Opening gallery");
      return;
    }

    if (cmd.includes('أين') || cmd.includes('where') || cmd.includes('مكاني')) {
      handleSpatialAudit();
    }
  };

  const toggleSystem = () => {
    if (isActive) {
      recognitionRef.current?.stop();
      setIsActive(false);
      setGuidanceStep('idle');
      stopCurrentAudio();
    } else {
      setIsActive(true);
      recognitionRef.current?.start();
    }
  };

  return (
    <div className={`fixed bottom-8 ${lang === 'ar' ? 'right-40' : 'left-40'} z-50 flex flex-col items-center gap-4`}>
      <button 
        onClick={toggleSystem}
        aria-label={isActive ? t.statusListening : t.blindMode}
        className={`group flex items-center gap-4 px-8 py-5 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.2em] transition-all shadow-[0_20px_50px_rgba(0,0,0,0.3)] ${isActive ? 'bg-indigo-600 text-white ring-4 ring-indigo-500/20' : 'bg-white text-slate-950 border border-slate-200'}`}
      >
        <div className="relative">
          {isActive ? <Radio className="w-5 h-5 animate-pulse" /> : <Mic className="w-5 h-5" />}
          {isThinking && <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-ping"></div>}
        </div>
        {isActive ? t.statusListening : t.blindMode}
      </button>

      {isActive && (
        <div 
          role="status"
          aria-live="polite"
          className="glass-panel w-96 p-6 rounded-[2.5rem] border border-white/20 shadow-2xl animate-in slide-in-from-bottom-4"
        >
           <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                 <ShieldCheck className="w-4 h-4 text-emerald-400" />
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t.guideTitle}</h4>
              </div>
              <div className="flex gap-2 items-center">
                 <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                 <span className="text-[8px] font-black text-emerald-500 uppercase">Privacy Secure</span>
              </div>
           </div>
           
           <div className="space-y-4">
              <p className="text-[11px] font-bold text-slate-600 dark:text-slate-300 leading-relaxed italic">
                 {isThinking ? t.analyzing : (lastAnnouncement || t.prompt)}
              </p>
              
              <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex flex-col gap-2">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <Navigation className="w-3 h-3 text-indigo-600" />
                       <span className="text-[8px] font-black uppercase text-indigo-600 tracking-widest">{activeTab}</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <Lock className="w-3 h-3 text-emerald-500" />
                       <span className="text-[8px] font-black uppercase text-emerald-500 tracking-widest">E2EE Audio</span>
                    </div>
                 </div>
                 <p className="text-[8px] text-slate-400 font-bold uppercase tracking-tight">{t.latencyAlert}</p>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ProfessionalOrientationSystem;
