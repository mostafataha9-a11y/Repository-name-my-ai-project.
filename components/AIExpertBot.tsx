
import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Image as ImageIcon, X, MessageSquare, Loader2, Maximize2, Minimize2, Calculator, Info, Palette, DollarSign, Wand2, FileDigit, ScanEye, TrendingUp, Layers, Eye, Pipette } from 'lucide-react';
import { getAIExpertAdvice, generateMoodBoard, estimateProjectCost, analyzeTechnicalPlan, describeVisualImage, detectVisualColors } from '../services/geminiService';
import { ChatMessage, Language } from '../types';

interface AIExpertBotProps {
  lang: Language;
}

const AIExpertBot: React.FC<AIExpertBotProps> = ({ lang }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', sender: 'AI', text: lang === 'en' ? "Welcome to AI Engine Pro. I can now describe images, audit technical blueprints, and detect color palettes. What is your vision?" : "مرحباً بك في AI Engine Pro. يمكنني الآن وصف الصور، تدقيق المخططات الفنية، واكتشاف لوحات الألوان. ما هي رؤيتك؟", timestamp: new Date(), isAI: true }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const blueprintInputRef = useRef<HTMLInputElement>(null);
  const describeInputRef = useRef<HTMLInputElement>(null);
  const colorsInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async (e?: React.FormEvent, customPrompt?: string) => {
    e?.preventDefault();
    const activeInput = customPrompt || input;
    if (!activeInput.trim() || isLoading) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), sender: 'You', text: activeInput, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const aiResponse = await getAIExpertAdvice(activeInput);
      let finalResponse = aiResponse;
      
      if (aiResponse === "API_KEY_MISSING") {
        finalResponse = lang === 'ar' 
          ? "تنبيه: مفتاح GEMINI_API_KEY غير مهيأ. يرجى إضافة المفتاح في ملف .env لتفعيل ميزات الذكاء الاصطناعي."
          : "Alert: GEMINI_API_KEY is not configured. Please add the key to your .env file to enable AI features.";
      }

      const aiMsg: ChatMessage = { id: (Date.now() + 1).toString(), sender: 'AI', text: finalResponse || '...', timestamp: new Date(), isAI: true };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error: any) {
      const errorMsg = error?.message?.includes('429') 
        ? (lang === 'ar' ? "المحرك العصبي تحت ضغط عالٍ حالياً. يرجى المحاولة مرة أخرى بعد دقيقة." : "The Neural Engine is currently under high load. Please try again in a minute.")
        : (lang === 'ar' ? "حدث خطأ غير متوقع في الاتصال." : "An unexpected connection error occurred.");
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), sender: 'AI', text: errorMsg, timestamp: new Date(), isAI: true }]);
    }
    setIsLoading(false);
  };

  const handleMoodBoard = async () => {
    setIsLoading(true);
    const text = lang === 'en' ? "Generate a professional Mood Board." : "ولد لوحة مزاج احترافية.";
    setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'You', text, timestamp: new Date() }]);
    try {
      const imageUrl = await generateMoodBoard("desert colors, organic textures, natural stone", "Desert Modern");
      if (imageUrl) {
        setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'AI', text: `### Neural Mood Board v1.0\n![Mood Board](${imageUrl})`, timestamp: new Date(), isAI: true }]);
      }
    } catch (e) {
      setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'AI', text: lang === 'ar' ? "فشل توليد لوحة المزاج بسبب ضغط الشبكة." : "Mood board generation failed due to high engine traffic.", timestamp: new Date(), isAI: true }]);
    }
    setIsLoading(false);
  };

  const handleImageAnalysis = async (e: React.ChangeEvent<HTMLInputElement>, mode: 'describe' | 'colors' | 'blueprint') => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsLoading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = (reader.result as string).split(',')[1];
      const userText = mode === 'describe' ? (lang === 'ar' ? 'صف الصورة' : 'Describe Image') : 
                       mode === 'colors' ? (lang === 'ar' ? 'ما هي الألوان؟' : 'What are the colors?') : 
                       (lang === 'ar' ? 'اقرأ المخطط' : 'Read Blueprint');
      
      setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'You', text: `[Visual Request: ${userText}]`, timestamp: new Date() }]);
      
      try {
        let analysis = "";
        if (mode === 'describe') analysis = await describeVisualImage(base64, lang);
        else if (mode === 'colors') analysis = await detectVisualColors(base64, lang);
        else analysis = await analyzeTechnicalPlan(base64, lang);

        setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'AI', text: analysis, timestamp: new Date(), isAI: true }]);
      } catch (err) {
        setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'AI', text: lang === 'ar' ? "فشل تحليل الصورة. المحرك العصبي مشغول حالياً." : "Image analysis failed. Neural Engine is currently busy.", timestamp: new Date(), isAI: true }]);
      }
      setIsLoading(false);
    };
    reader.readAsDataURL(file);
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-50 bg-indigo-600 text-white w-16 h-16 rounded-3xl shadow-[0_20px_50px_rgba(79,70,229,0.3)] hover:scale-110 hover:shadow-indigo-500/40 transition-all group flex items-center justify-center"
      >
        <div className="relative">
          <Wand2 className="w-8 h-8" />
          <span className="absolute -top-1 -right-1 bg-indigo-400 w-4 h-4 rounded-full border-4 border-indigo-600 animate-pulse"></span>
        </div>
      </button>
    );
  }

  return (
    <div className={`fixed bottom-8 ${lang === 'ar' ? 'left-8' : 'right-8'} z-50 w-[95vw] md:w-[520px] bg-white rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden border border-slate-200 transition-all duration-500 ${isMinimized ? 'h-20' : 'h-[800px] max-h-[90vh]'}`}>
      <div className="bg-slate-950 px-6 py-5 flex items-center justify-between text-white shrink-0">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-600 p-2.5 rounded-2xl relative">
            <Sparkles className="w-6 h-6" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-400 rounded-full animate-ping"></div>
          </div>
          <div>
            <h3 className="font-black text-sm uppercase tracking-tighter">AI Engine Pro</h3>
            <p className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest">{lang === 'en' ? "Visual Intelligence Layer" : "طبقة الذكاء البصري"}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setIsMinimized(!isMinimized)} className="p-2 hover:bg-white/10 rounded-xl transition-all">
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-red-500/20 rounded-xl text-red-400 transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 no-scrollbar">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.isAI ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[92%] px-6 py-5 rounded-[2rem] text-sm leading-relaxed ${
                  m.isAI 
                    ? 'bg-white text-slate-800 shadow-xl border border-slate-100' 
                    : 'bg-indigo-600 text-white shadow-xl font-medium'
                }`}>
                  <div className="prose prose-sm prose-slate max-w-none prose-img:rounded-2xl prose-headings:font-black">
                    {m.text.split('\n').map((line, i) => {
                      const match = line.match(/\((.*?)\)/);
                      const imageUrl = match ? match[1] : null;
                      return (
                        <div key={i}>
                          {line.startsWith('![') && imageUrl ? (
                            <img src={imageUrl} className="w-full h-auto mt-4" alt="Design Vision" />
                          ) : (
                            <p>{line}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white px-6 py-4 rounded-3xl border border-slate-100 flex items-center gap-3 shadow-sm">
                  <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Analyzing Visual Data...</span>
                </div>
              </div>
            )}
          </div>

          <div className="px-6 py-3 bg-white border-t border-slate-100 flex gap-3 overflow-x-auto no-scrollbar">
             <button onClick={() => describeInputRef.current?.click()} className="flex items-center gap-2 whitespace-nowrap px-5 py-2.5 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg">
               <Eye className="w-4 h-4" /> {lang === 'ar' ? 'صف الصورة' : 'Describe Image'}
             </button>
             <button onClick={() => colorsInputRef.current?.click()} className="flex items-center gap-2 whitespace-nowrap px-5 py-2.5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all">
               <Pipette className="w-4 h-4" /> {lang === 'ar' ? 'ما هي الألوان؟' : 'Get Colors'}
             </button>
             <button onClick={() => blueprintInputRef.current?.click()} className="flex items-center gap-2 whitespace-nowrap px-5 py-2.5 bg-indigo-50 text-indigo-600 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-indigo-100 hover:bg-indigo-100 transition-all">
               <ScanEye className="w-4 h-4" /> {lang === 'ar' ? 'اقرأ المخطط' : 'Read Blueprint'}
             </button>
             <button onClick={handleMoodBoard} className="flex items-center gap-2 whitespace-nowrap px-5 py-2.5 bg-indigo-50 text-indigo-600 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-indigo-100 hover:bg-indigo-100 transition-all">
               <Layers className="w-4 h-4" /> Mood Board
             </button>
          </div>

          <form onSubmit={handleSend} className="p-6 bg-white border-t border-slate-100">
            <div className="flex items-center gap-4">
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-12 h-12 flex items-center justify-center text-slate-400 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 rounded-2xl transition-all"
              >
                <ImageIcon className="w-6 h-6" />
              </button>
              
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" />
              <input type="file" ref={describeInputRef} onChange={(e) => handleImageAnalysis(e, 'describe')} className="hidden" accept="image/*" />
              <input type="file" ref={colorsInputRef} onChange={(e) => handleImageAnalysis(e, 'colors')} className="hidden" accept="image/*" />
              <input type="file" ref={blueprintInputRef} onChange={(e) => handleImageAnalysis(e, 'blueprint')} className="hidden" accept="image/*,application/pdf" />
              
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={lang === 'en' ? "Query AI Engine Pro..." : "اسأل المحرك الذكي المطور..."}
                className="flex-1 py-4 px-6 bg-slate-50 rounded-[1.5rem] text-sm focus:ring-2 focus:ring-indigo-500 border-none transition-all outline-none font-medium"
              />
              <button 
                type="submit"
                disabled={!input.trim() || isLoading}
                className="w-12 h-12 flex items-center justify-center bg-slate-950 text-white rounded-2xl disabled:opacity-50 hover:bg-indigo-600 transition-all shadow-xl"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default AIExpertBot;
