
import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Radio, Sparkles, Navigation, Command, Globe } from 'lucide-react';
import { Language } from '../types';

interface VoiceNavigationSystemProps {
  lang: Language;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const VoiceNavigationSystem: React.FC<VoiceNavigationSystemProps> = ({ lang, activeTab, setActiveTab }) => {
  const [isActive, setIsActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const synth = window.speechSynthesis;

  const t = {
    en: {
      status: "AI Listening (EN)...",
      navFeedback: "Navigating to ",
      guide: "Try: 'Show projects', 'Go home', or 'Open dashboard'.",
      error: "Command not recognized, please try again."
    },
    ar: {
      status: "جاري الاستماع (عربي)...",
      navFeedback: "يتم الآن فتح ",
      guide: "جرب: 'عرض المشاريع'، 'الرئيسية'، أو 'لوحة التحكم'.",
      error: "لم يتم التعرف على الأمر، حاول مرة أخرى."
    }
  }[lang];

  const speak = (text: string) => {
    synth.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = lang === 'ar' ? 'ar-SA' : 'en-US';
    utter.rate = 1.0;
    synth.speak(utter);
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
        handleGlobalCommand(command);
      };

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognitionRef.current = recognition;
    }
  }, [lang]);

  const handleGlobalCommand = (cmd: string) => {
    // Mapping intents across multiple potential dialects/phrasings
    const commands = {
      home: ['home', 'الرئيسية', 'بداية', 'البيت', 'main'],
      projects: ['projects', 'مشاريع', 'المعرض', 'اعمال', 'gallery'],
      community: ['community', 'مجتمع', 'دردشة', 'forum', 'hub'],
      dashboard: ['dashboard', 'لوحة التحكم', 'ملفي', 'profile', 'control'],
      security: ['security', 'أمان', 'حماية', 'settings', 'اعدادات']
    };

    if (commands.home.some(v => cmd.includes(v))) {
      setActiveTab('home');
      speak(t.navFeedback + (lang === 'ar' ? "الرئيسية" : "Home"));
    } else if (commands.projects.some(v => cmd.includes(v))) {
      setActiveTab('projects');
      speak(t.navFeedback + (lang === 'ar' ? "المشاريع" : "Projects"));
    } else if (commands.community.some(v => cmd.includes(v))) {
      setActiveTab('community');
      speak(t.navFeedback + (lang === 'ar' ? "المجتمع" : "Community"));
    } else if (commands.dashboard.some(v => cmd.includes(v))) {
      setActiveTab('dashboard');
      speak(t.navFeedback + (lang === 'ar' ? "لوحة التحكم" : "Dashboard"));
    } else if (commands.security.some(v => cmd.includes(v))) {
      setActiveTab('security');
      speak(t.navFeedback + (lang === 'ar' ? "الأمان" : "Security"));
    } else {
      speak(t.error);
    }
  };

  const toggleSystem = () => {
    if (isActive) {
      recognitionRef.current?.stop();
      setIsActive(false);
    } else {
      setIsActive(true);
      recognitionRef.current?.start();
      speak(lang === 'ar' ? "نظام التحكم الصوتي العالمي مفعل" : "Global voice control enabled");
    }
  };

  return (
    <div className={`fixed bottom-8 ${lang === 'ar' ? 'right-32' : 'left-32'} z-50 flex items-center gap-4`}>
      <button 
        onClick={toggleSystem}
        className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-2xl ${isActive ? 'bg-indigo-600 text-white animate-pulse' : 'bg-white text-slate-900 border border-slate-200 hover:border-indigo-500'}`}
      >
        <div className="relative">
          {isActive ? <Radio className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          {isActive && <div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full animate-ping"></div>}
        </div>
        {isActive ? t.status : (lang === 'ar' ? "المرشد اللغوي" : "Linguistic Guide")}
      </button>

      {isActive && (
        <div className="bg-slate-950 text-white px-6 py-4 rounded-2xl shadow-2xl border border-white/10 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2">
           <Globe className="w-4 h-4 text-indigo-400" />
           <span className="text-[9px] font-bold uppercase tracking-widest opacity-80">{t.guide}</span>
        </div>
      )}
    </div>
  );
};

export default VoiceNavigationSystem;
