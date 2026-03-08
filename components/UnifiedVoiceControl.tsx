
import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Radio, Sparkles, Navigation, ShieldCheck, Lock, Eye, Info, Command, Zap, MessageSquare, Brain, ListTree, VolumeX, X, ScanEye } from 'lucide-react';
import { Language } from '../types';
import { getSpatialOrientation, generateAIVoiceNarration, explainComplexity, summarizeArchitecturalContent, describeDataStructure } from '../services/geminiService';
import { decodeBase64, decodeAudioData } from '../utils/audioUtils';

interface UnifiedVoiceControlProps {
  lang: Language;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const UnifiedVoiceControl: React.FC<UnifiedVoiceControlProps> = ({ lang, activeTab, setActiveTab }) => {
  const [isActive, setIsActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [lastAnnouncement, setLastAnnouncement] = useState('');
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const activeSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const synth = window.speechSynthesis;

  const t = {
    en: {
      status: "Neural Orientation Mode",
      micSecured: "E2EE Neural Privacy",
      guide: "Try: 'Where am I?', 'Explain terms', or 'Go to dashboard'.",
      navigating: "Transitioning focus to ",
      error: "Command not recognized by Neural Engine.",
      analyzing: "Analyzing spatial context for accessibility...",
      latency: "Real-time Neural Response",
      modeName: "Neural Orientation System v4.8",
      stopped: "Audio feedback terminated.",
      stopAudio: "Mute Guide",
      scan: "Spatial Scan"
    },
    ar: {
      status: "وضع التوجيه العصبي",
      micSecured: "خصوصية عصبية مشفرة",
      guide: "جرب: 'أين أنا؟'، 'اشرح المصطلحات'، أو 'اذهب للوحة التحكم'.",
      navigating: "يتم الآن نقل التركيز إلى ",
      error: "لم يتعرف المحرك العصبي على الأمر.",
      analyzing: "جاري تحليل السياق المكاني للوصول...",
      latency: "استجابة عصبية فورية",
      modeName: "نظام التوجيه العصبي v4.8",
      stopped: "تم إيقاف التوجيه الصوتي.",
      stopAudio: "كتم المرشد",
      scan: "مسح مكاني"
    }
  }[lang];

  const stopAudio = () => {
    synth.cancel();
    if (activeSourceRef.current) {
      try { 
        activeSourceRef.current.stop(); 
      } catch (e) {
        // Audio already stopped
      }
      activeSourceRef.current = null;
    }
    setIsThinking(false);
  };

  const speakStandard = (text: string) => {
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = lang === 'ar' ? 'ar-SA' : 'en-US';
    utter.rate = 1.0;
    utter.onend = () => setIsThinking(false);
    synth.speak(utter);
  };

  const announce = async (text: string) => {
    if (!text) return;
    setIsThinking(true);
    stopAudio();

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
      source.onended = () => { if (activeSourceRef.current === source) { activeSourceRef.current = null; setIsThinking(false); } };
      activeSourceRef.current = source;
      source.start();
    } else {
      // Fallback to standard browser synthesis if Neural TTS fails (quota/limit)
      speakStandard(text);
    }
    setLastAnnouncement(text);
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
        handleUnifiedCommand(command);
      };
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognitionRef.current = recognition;
    }
    return () => { stopAudio(); if (audioContextRef.current) audioContextRef.current.close(); };
  }, [lang]);

  // Priority: Auto-announce spatial orientation on tab change
  useEffect(() => {
    if (isActive) handleSpatialUpdate();
  }, [activeTab]);

  const handleSpatialUpdate = async () => {
    const elementCount = document.querySelectorAll('button, a, [role="button"]').length;
    const orientation = await getSpatialOrientation(activeTab, elementCount, lang);
    announce(orientation);
  };

  const handleUnifiedCommand = async (cmd: string) => {
    // Stop command
    const stopCmds = ['stop', 'أوقف', 'إيقاف', 'اسكت', 'silence', 'halt', 'كفى'];
    if (stopCmds.some(v => cmd.includes(v))) {
      stopAudio();
      setLastAnnouncement(t.stopped);
      return;
    }

    // Navigation Commands
    const navCmds = {
      home: ['home', 'الرئيسية', 'بداية', 'main'],
      projects: ['projects', 'مشاريع', 'المعرض', 'gallery'],
      community: ['community', 'مجتمع', 'دردشة', 'hub'],
      dashboard: ['dashboard', 'لوحة التحكم', 'control'],
      security: ['security', 'أمان', 'حماية', 'الأمان']
    };

    if (navCmds.home.some(v => cmd.includes(v))) {
      setActiveTab('home');
    } else if (navCmds.projects.some(v => cmd.includes(v))) {
      setActiveTab('projects');
    } else if (navCmds.community.some(v => cmd.includes(v))) {
      setActiveTab('community');
    } else if (navCmds.dashboard.some(v => cmd.includes(v))) {
      setActiveTab('dashboard');
    } else if (navCmds.security.some(v => cmd.includes(v))) {
      setActiveTab('security');
    } 
    // Knowledge & Accessibility Commands
    else if (cmd.includes('اشرح') || cmd.includes('explain') || cmd.includes('معنى')) {
      const term = cmd.replace(/explain|term|معنى|اشرح/g, '').trim();
      if (term) {
        announce(lang === 'ar' ? `جاري تبسيط مفهوم ${term}` : `Simplifying ${term}`);
        const explanation = await explainComplexity(term, lang);
        announce(explanation);
      }
    } else if (cmd.includes('لخص') || cmd.includes('summarize')) {
      const content = document.body.innerText.substring(0, 500);
      const summary = await summarizeArchitecturalContent(content, lang);
      announce(summary);
    } else if (cmd.includes('أين') || cmd.includes('where')) {
      handleSpatialUpdate();
    } else {
      const errVoice = lang === 'ar' ? "عذراً، لم أتعرف على الأمر الصوتي." : "Sorry, I didn't catch that command.";
      announce(errVoice);
    }
  };

  const toggle = () => {
    if (isActive) {
      recognitionRef.current?.stop();
      setIsActive(false);
      stopAudio();
    } else {
      setIsActive(true);
      recognitionRef.current?.start();
      announce(lang === 'ar' ? "تم تفعيل نظام التوجيه العصبي للمكفوفين. أنا مرشدك المكاني الآن." : "Neural Orientation System active. I am now your spatial guide.");
    }
  };

  return (
    <div className={`fixed bottom-8 ${lang === 'ar' ? 'left-40' : 'right-40'} z-50 flex flex-col items-center gap-4`}>
      <button 
        onClick={toggle}
        className={`flex items-center gap-4 px-8 py-5 rounded-[2.2rem] font-black text-[11px] uppercase tracking-widest transition-all shadow-2xl ${isActive ? 'bg-indigo-600 text-white ring-4 ring-indigo-500/20' : 'bg-white text-slate-950 border border-slate-200 hover:border-indigo-500'}`}
      >
        <div className="relative">
          {isActive ? <Radio className="w-5 h-5 animate-pulse" /> : <Mic className="w-5 h-5" />}
          {isThinking && <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-ping"></div>}
        </div>
        {isActive ? t.status : t.modeName}
      </button>

      {isActive && (
        <div className="glass-panel w-96 p-6 rounded-[2.5rem] border border-white/20 shadow-2xl animate-in slide-in-from-bottom-4">
          <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4">
             <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t.micSecured}</span>
             </div>
             <div className="flex items-center gap-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); handleSpatialUpdate(); }}
                  className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 rounded-full border border-indigo-500/20 transition-all"
                  title={t.scan}
                >
                  <ScanEye className="w-3.5 h-3.5" />
                  <span className="text-[8px] font-black uppercase">{t.scan}</span>
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); stopAudio(); setLastAnnouncement(t.stopped); }}
                  className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-full border border-red-500/20 transition-all"
                  title={t.stopAudio}
                >
                  <VolumeX className="w-3.5 h-3.5" />
                  <span className="text-[8px] font-black uppercase">{t.stopAudio}</span>
                </button>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-[8px] font-black text-emerald-500 uppercase">Live</span>
                </div>
             </div>
          </div>
          <p className="text-[11px] font-bold text-slate-600 dark:text-slate-300 leading-relaxed italic mb-4">
            {isThinking ? t.analyzing : (lastAnnouncement || t.guide)}
          </p>
          <div className="flex items-center justify-between pt-4 border-t border-white/5">
             <div className="flex items-center gap-2">
                <Navigation className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-[9px] font-black uppercase text-indigo-400 tracking-widest">{activeTab}</span>
             </div>
             <span className="text-[8px] font-bold text-slate-500 uppercase">{t.latency}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default UnifiedVoiceControl;
