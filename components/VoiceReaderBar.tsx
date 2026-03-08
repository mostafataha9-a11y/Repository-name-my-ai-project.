
import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, SkipForward, SkipBack, Volume2, 
  Settings2, Languages, Zap, Loader2, X, Mic,
  VolumeX, Gauge, Sparkles, HelpCircle, MicOff,
  Type, FileText, RotateCcw, FastForward, Rewind
} from 'lucide-react';
import { Language, VoiceSettings } from '../types';
import { generateAIVoiceNarration } from '../services/geminiService';
import { decodeBase64, decodeAudioData } from '../utils/audioUtils';

interface VoiceReaderBarProps {
  text: string;
  lang: Language;
  onClose: () => void;
}

const VoiceReaderBar: React.FC<VoiceReaderBarProps> = ({ text, lang, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isNeural, setIsNeural] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<VoiceSettings>({
    rate: 1, pitch: 1, volume: 1, voiceName: '', neuralEnabled: false, autoReadAloud: false
  });
  
  const synth = window.speechSynthesis;
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const activeSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const lastTypeRef = useRef<'full' | 'title' | 'summary'>('full');

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
      handleStop();
      if (audioContextRef.current) audioContextRef.current.close();
      recognitionRef.current?.stop();
    };
  }, [lang]);

  const t = {
    en: { 
      neural: 'Neural AI', standard: 'Standard', speed: 'Speed', pitch: 'Pitch',
      readTitle: 'Read Title', readSummary: 'Summary', readAll: 'Read Full',
      reset: 'Reset', listening: 'Listening for commands...', micHint: 'Voice Control Active',
      cmdStop: 'Stop reading', cmdContinue: 'Continue reading', cmdRepeat: 'Repeat last',
      cmdSlower: 'Slower', cmdFaster: 'Faster',
      fallback: 'Neural limit reached. Using Standard voice.'
    },
    ar: { 
      neural: 'ذكاء عصبي', standard: 'صوت قياسي', speed: 'السرعة', pitch: 'النبرة',
      readTitle: 'قراءة العنوان', readSummary: 'الملخص', readAll: 'قراءة كاملة',
      reset: 'البداية', listening: 'جاري الاستماع للأوامر...', micHint: 'التحكم الصوتي مفعل',
      cmdStop: 'أوقف القراءة', cmdContinue: 'تابع القراءة', cmdRepeat: 'أعد الفقرة الأخيرة',
      cmdSlower: 'اقرأ أبطأ', cmdFaster: 'اقرأ أسرع',
      fallback: 'تم الوصول لحد الاستخدام. جاري استخدام الصوت القياسي.'
    }
  }[lang];

  const handleVoiceCommand = (cmd: string) => {
    if (cmd.includes('أوقف') || cmd.includes('stop')) {
      handleStop();
    } else if (cmd.includes('تابع') || cmd.includes('continue')) {
      handlePlayAction(lastTypeRef.current);
    } else if (cmd.includes('أعد') || cmd.includes('repeat')) {
      handlePlayAction(lastTypeRef.current);
    } else if (cmd.includes('أبطأ') || cmd.includes('slower')) {
      setSettings(prev => ({ ...prev, rate: Math.max(0.5, prev.rate - 0.2) }));
    } else if (cmd.includes('أسرع') || cmd.includes('faster')) {
      setSettings(prev => ({ ...prev, rate: Math.min(2, prev.rate + 0.2) }));
    }
  };

  const handleStop = () => {
    synth.cancel();
    if (activeSourceRef.current) {
      try { activeSourceRef.current.stop(); } catch (e) {}
      activeSourceRef.current = null;
    }
    setIsPlaying(false);
  };

  const speakStandard = (textToRead: string) => {
    const utter = new SpeechSynthesisUtterance(textToRead);
    utter.lang = lang === 'ar' ? 'ar-SA' : 'en-US';
    utter.rate = settings.rate;
    utter.pitch = settings.pitch;
    utter.onend = () => setIsPlaying(false);
    synth.speak(utter);
    setIsPlaying(true);
  };

  const handlePlayAction = async (type: 'full' | 'title' | 'summary') => {
    handleStop();
    lastTypeRef.current = type;
    let textToRead = text;
    if (type === 'title') textToRead = text.split('.')[0];
    if (type === 'summary') textToRead = text.split('.').slice(0, 2).join('.');
    
    if (isNeural) {
      setIsLoading(true);
      const audioBase64 = await generateAIVoiceNarration(textToRead, lang);
      if (audioBase64) {
        if (!audioContextRef.current) {
          // Fix: Use simple constructor for widest compatibility and avoid "Illegal constructor"
          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          audioContextRef.current = new AudioContextClass();
        }
        const ctx = audioContextRef.current;
        const decodedBytes = decodeBase64(audioBase64);
        const audioBuffer = await decodeAudioData(decodedBytes, ctx, 24000, 1);
        
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        source.onended = () => {
          if (activeSourceRef.current === source) setIsPlaying(false);
        };
        activeSourceRef.current = source;
        source.start();
        setIsPlaying(true);
      } else {
        // Fallback to standard if Neural fails
        setIsNeural(false);
        speakStandard(textToRead);
      }
      setIsLoading(false);
    } else {
      speakStandard(textToRead);
    }
  };

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[70] w-[95vw] max-w-3xl animate-in slide-in-from-bottom-10 duration-700">
      {isListening && (
        <div className="mb-4 flex flex-col items-center">
           <div className="flex items-center gap-1.5 mb-2 h-8">
              {[...Array(12)].map((_, i) => (
                <div 
                    key={i} 
                    className="w-1 bg-indigo-500 rounded-full animate-bounce" 
                    style={{ height: `${Math.random() * 24 + 8}px`, animationDuration: `${Math.random() * 0.5 + 0.5}s`, animationDelay: `${i * 0.05}s` }}
                ></div>
              ))}
           </div>
           <span className="text-[9px] font-black text-white bg-indigo-600 px-6 py-2 rounded-full shadow-2xl uppercase tracking-[0.2em] border border-white/20 backdrop-blur-md">
              {t.listening}
           </span>
        </div>
      )}

      <div className={`glass-panel rounded-[2.5rem] p-6 shadow-[0_50px_100px_rgba(0,0,0,0.5)] border transition-all duration-500 ${isNeural ? 'border-indigo-500/40 shadow-indigo-600/10' : 'border-white/20'}`}>
        {showSettings && (
          <div className="px-6 py-5 border-b border-white/10 grid grid-cols-2 gap-10 mb-6 animate-in fade-in zoom-in-95">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-2">
                    <Gauge className="w-3.5 h-3.5" /> {t.speed}
                </label>
                <span className="text-[10px] font-black text-indigo-400">{settings.rate.toFixed(1)}x</span>
              </div>
              <input type="range" min="0.5" max="2" step="0.1" value={settings.rate} onChange={(e) => setSettings({...settings, rate: parseFloat(e.target.value)})} className="w-full accent-indigo-600 h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer" />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-2">
                    <Mic className="w-3.5 h-3.5" /> {t.pitch}
                </label>
                <span className="text-[10px] font-black text-indigo-400">{settings.pitch.toFixed(1)}</span>
              </div>
              <input type="range" min="0.5" max="2" step="0.1" value={settings.pitch} onChange={(e) => setSettings({...settings, pitch: parseFloat(e.target.value)})} className="w-full accent-indigo-600 h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer" />
            </div>
          </div>
        )}

        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between gap-6">
            <button onClick={() => setIsNeural(!isNeural)} className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${isNeural ? 'bg-indigo-600 text-white shadow-xl' : 'bg-white/5 text-slate-400 border border-white/10'}`}>
              {isNeural ? <Sparkles className="w-4 h-4 animate-pulse" /> : <Volume2 className="w-4 h-4" />}
              {isNeural ? t.neural : t.standard}
            </button>
            <div className="flex items-center gap-8">
              <button onClick={() => handleVoiceCommand('slower')} className="text-slate-400 hover:text-white transition-all"><Rewind className="w-6 h-6" /></button>
              <button onClick={() => isPlaying ? handleStop() : handlePlayAction('full')} disabled={isLoading} className={`w-20 h-20 rounded-[2.5rem] flex items-center justify-center shadow-2xl transition-all ${isNeural ? 'bg-indigo-600 text-white' : 'bg-white text-slate-950'}`}>
                {isLoading ? <Loader2 className="w-8 h-8 animate-spin" /> : isPlaying ? <Pause className="w-9 h-9 fill-current" /> : <Play className="w-9 h-9 fill-current ml-1" />}
              </button>
              <button onClick={() => handleVoiceCommand('faster')} className="text-slate-400 hover:text-white transition-all"><FastForward className="w-6 h-6" /></button>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => { setIsListening(!isListening); isListening ? recognitionRef.current?.stop() : recognitionRef.current?.start(); }} className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isListening ? 'bg-red-50 text-white' : 'bg-white/5 text-slate-400 border border-white/10'}`}>
                {isListening ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
              </button>
              <button onClick={() => setShowSettings(!showSettings)} className="w-14 h-14 rounded-2xl flex items-center justify-center bg-white/5 text-slate-400 border border-white/10"><Settings2 className="w-6 h-6" /></button>
              <button onClick={onClose} className="w-14 h-14 rounded-2xl flex items-center justify-center bg-white/5 text-red-400 border border-white/10"><X className="w-6 h-6" /></button>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4 border-t border-white/10">
             <button onClick={() => handlePlayAction('title')} className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase text-slate-300 flex items-center gap-2.5 transition-all"><Type className="w-3.5 h-3.5 text-indigo-400" /> {t.readTitle}</button>
             <button onClick={() => handlePlayAction('summary')} className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase text-slate-300 flex items-center gap-2.5 transition-all"><FileText className="w-3.5 h-3.5 text-emerald-400" /> {t.readSummary}</button>
             <button onClick={() => handlePlayAction('full')} className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase text-slate-300 flex items-center gap-2.5 transition-all"><RotateCcw className="w-3.5 h-3.5 text-amber-400" /> {t.cmdRepeat}</button>
             <button onClick={handleStop} className="px-5 py-2.5 bg-white/5 hover:bg-red-500/20 border border-white/10 rounded-xl text-[10px] font-black uppercase text-red-400 flex items-center gap-2.5 transition-all"><VolumeX className="w-3.5 h-3.5" /> {t.cmdStop}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceReaderBar;
