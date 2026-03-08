
import React, { useState, useRef, useEffect } from 'react';
import { ChatRoom, ChatMessage, UserRank, Language } from '../types';
import { 
  Hash, Users, Send, Smile, Paperclip, Sparkles, 
  Volume2, Languages, ShieldCheck, Lock, Globe, 
  Video, Play, Mic, MoreVertical, Search, Check, 
  CheckCheck, Image as ImageIcon, Camera, Phone, 
  VideoIcon, Info, Users2, X, DollarSign, 
  FileBox, UserPlus, Target, MessageSquare, MicOff, VideoOff,
  Briefcase, ShieldAlert
} from 'lucide-react';
/* Fixed: Removed 'Record' which is not exported from lucide-react */
import { performEngineerMatchmaking } from '../services/geminiService';

interface CommunityProps {
  lang: Language;
}

const ROOMS: ChatRoom[] = [
  { 
    id: 'r1', name: 'Global Lighting Summit', nameAr: 'قمة الإضاءة العالمية', 
    description: 'Advanced photometrics and mood engineering.', category: 'lighting', 
    activeUsers: 215, isLive: true, lastMessage: 'The Lidar scanning is complete.', unreadCount: 2,
    ownerId: 'u1', moderators: [], members: [], viewers: [], invitations: [], recordings: [], meetingDocs: []
  },
  { 
    id: 'r2', name: 'Materials Lab', nameAr: 'مختبر المواد', 
    description: 'Sustainable surfaces and composite tech.', category: 'kitchen', 
    activeUsers: 142, lastMessage: 'Check out this new marble composite.',
    ownerId: 'u2', moderators: [], members: [], viewers: [], invitations: [], recordings: [], meetingDocs: []
  },
  { 
    id: 'r3', name: 'Royal Estates (Private)', nameAr: 'القصور الفاخرة - خاص', 
    description: 'High-end classical restoration.', category: 'classic', 
    activeUsers: 84, minRank: UserRank.CERTIFIED, lastMessage: 'Working on the gilding details.', isPaid: true, price: '$50/hr',
    ownerId: 'u3', moderators: [], members: [], viewers: [], invitations: [], recordings: [], meetingDocs: []
  },
  { 
    id: 'r4', name: 'Smart Sanctuary', nameAr: 'الملاذ الذكي', 
    description: 'IoT architectural implementation.', category: 'modern', 
    activeUsers: 196, isLive: false, lastMessage: 'The automation protocol is updated.',
    ownerId: 'u4', moderators: [], members: [], viewers: [], invitations: [], recordings: [], meetingDocs: []
  }
];

const Community: React.FC<CommunityProps> = ({ lang }) => {
  const [activeRoom, setActiveRoom] = useState(ROOMS[0]);
  const [isLiveView, setIsLiveView] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [showMatchmaking, setShowMatchmaking] = useState(false);
  const [matchBrief, setMatchBrief] = useState('');
  const [matchResult, setMatchResult] = useState<any>(null);
  const [isMatching, setIsMatching] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', sender: 'Dr. Sarah V.', senderRank: UserRank.ARCHITECT_MASTERS, text: 'We are seeing a 15% increase in demand for biophilic integration in GCC offices.', timestamp: new Date(Date.now() - 3600000), isAI: false },
    { id: '2', sender: 'DecorGlobal AI Agent', text: 'Sarah is correct. Recent market data indicates that indoor greening improves productivity by 12% in arid climates.', timestamp: new Date(Date.now() - 3000000), isAI: true },
    { id: '3', sender: 'Eng. Omar B.', senderRank: UserRank.CERTIFIED, text: 'I have attached the floor plan for the LEED platinum project.', timestamp: new Date(Date.now() - 1000000), isAI: false, type: 'cad' },
  ]);
  const [input, setInput] = useState('');
  const [isTranslating, setIsTranslating] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLiveView]);

  const handleSend = (e?: React.FormEvent, customText?: string) => {
    e?.preventDefault();
    const messageText = customText || input;
    if (!messageText.trim()) return;
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'You',
      senderRank: UserRank.BEGINNER,
      text: messageText,
      timestamp: new Date(),
      type: 'text'
    };
    setMessages(prev => [...prev, newMsg]);
    if (!customText) setInput('');
  };

  const handleMatchmaking = async () => {
    if (!matchBrief.trim()) return;
    setIsMatching(true);
    const result = await performEngineerMatchmaking(matchBrief, lang);
    setMatchResult(result);
    setIsMatching(false);
  };

  // --- Voice Command Listener for Chat ---
  useEffect(() => {
    const handleVoiceCommand = (e: any) => {
      const { action, query, text } = e.detail;

      switch (action) {
        case 'OPEN_ROOM':
          const roomToOpen = ROOMS.find(r => 
            query.includes(r.name.toLowerCase()) || 
            (r.nameAr && query.includes(r.nameAr))
          );
          if (roomToOpen) {
            setActiveRoom(roomToOpen);
            window.dispatchEvent(new CustomEvent('VOICE_SYSTEM_FEEDBACK', { 
              detail: { message: lang === 'ar' ? `تم فتح غرفة ${roomToOpen.nameAr}` : `Opened ${roomToOpen.name} room` } 
            }));
          } else {
            window.dispatchEvent(new CustomEvent('VOICE_SYSTEM_FEEDBACK', { 
              detail: { message: lang === 'ar' ? "عذراً، لم أجد الغرفة المطلوبة" : "Sorry, I couldn't find that room" } 
            }));
          }
          break;

        case 'READ_LAST':
          if (messages.length > 0) {
            const lastMsg = messages[messages.length - 1];
            const feedback = lang === 'ar' 
              ? `آخر رسالة من ${lastMsg.sender} تقول: ${lastMsg.text}` 
              : `The last message from ${lastMsg.sender} says: ${lastMsg.text}`;
            window.dispatchEvent(new CustomEvent('VOICE_SYSTEM_FEEDBACK', { detail: { message: feedback } }));
          }
          break;

        case 'WHO_IS_TALKING':
          if (messages.length > 0) {
            const lastSender = messages[messages.length - 1].sender;
            const feedback = lang === 'ar' 
              ? `المتحدث الأخير هو ${lastSender}` 
              : `The last person who spoke is ${lastSender}`;
            window.dispatchEvent(new CustomEvent('VOICE_SYSTEM_FEEDBACK', { detail: { message: feedback } }));
          }
          break;

        case 'SEND_MESSAGE':
          const msgContent = text.replace('أرسل رسالة', '').replace('send message', '').trim();
          if (msgContent) {
            handleSend(undefined, msgContent);
            window.dispatchEvent(new CustomEvent('VOICE_SYSTEM_FEEDBACK', { 
              detail: { message: lang === 'ar' ? "تم إرسال رسالتك" : "Message sent" } 
            }));
          }
          break;

        case 'LEAVE_ROOM':
          window.dispatchEvent(new CustomEvent('VOICE_SYSTEM_FEEDBACK', { 
            detail: { message: lang === 'ar' ? "تم مغادرة الغرفة والعودة للقائمة" : "Leaving room, returning to list" } 
          }));
          // In this simplified UI, leaving room just means closing any overlay or focus
          setShowMatchmaking(false);
          break;
      }
    };

    window.addEventListener('CHAT_VOICE_COMMAND', handleVoiceCommand);
    return () => window.removeEventListener('CHAT_VOICE_COMMAND', handleVoiceCommand);
  }, [messages, activeRoom, lang]);

  const t = {
    en: {
      search: 'Search conversations...',
      chats: 'Design Channels',
      online: 'Online Experts',
      liveTitle: 'Live Workshop Stream',
      typeMessage: 'Type a message...',
      liveNow: 'LIVE NOW',
      translateActive: 'AI Neural Translation Active',
      matchTitle: 'AI Design Matchmaking',
      matchSub: 'Find the perfect engineer for your project brief.',
      paidRoom: 'Paid Entry',
      record: 'Record Session',
      shareCad: 'Share CAD/BIM',
      e2ee: 'End-to-End Encrypted'
    },
    ar: {
      search: 'بحث في المحادثات...',
      chats: 'قنوات التصميم',
      online: 'خبراء متصلون',
      liveTitle: 'بث ورشة العمل الحية',
      typeMessage: 'اكتب رسالة...',
      liveNow: 'مباشر الآن',
      translateActive: 'الترجمة العصبية مفعلة',
      matchTitle: 'التوفيق الذكي للمشاريع',
      matchSub: 'اعثر على المهندس المثالي لمتطلبات مشروعك.',
      paidRoom: 'دخول مأجور',
      record: 'تسجيل الجلسة',
      shareCad: 'مشاركة CAD/BIM',
      e2ee: 'تشفير طرف إلى طرف مفعل'
    }
  }[lang];

  return (
    <div className="h-[calc(100vh-14rem)] flex bg-[#f0f2f5] rounded-[2rem] border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in duration-700">
      
      {/* Sidebar */}
      <div className="w-96 flex flex-col bg-white border-r border-slate-200">
        <div className="p-5 bg-[#f0f2f5] flex items-center justify-between">
          <img src="https://i.pravatar.cc/100?u=current" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
          <div className="flex gap-4 text-slate-500">
             <Target className="w-5 h-5 cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => setShowMatchmaking(!showMatchmaking)} />
             <MoreVertical className="w-5 h-5 cursor-pointer hover:text-indigo-600 transition-colors" />
          </div>
        </div>

        <div className="p-3 bg-white">
          <div className="relative">
            <Search className={`absolute ${lang === 'ar' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400`} />
            <input 
              type="text" 
              placeholder={t.search} 
              className={`w-full bg-[#f0f2f5] border-none rounded-xl py-2.5 ${lang === 'ar' ? 'pr-12' : 'pl-12'} text-sm focus:ring-0 placeholder:text-slate-500`}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar">
          {ROOMS.map(room => (
            <div
              key={room.id}
              onClick={() => setActiveRoom(room)}
              className={`flex items-center gap-4 p-4 cursor-pointer hover:bg-slate-50 transition-colors border-b border-slate-50 relative ${activeRoom.id === room.id ? 'bg-slate-100' : ''}`}
            >
              <div className="relative">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white ${room.isLive ? 'bg-indigo-600 shadow-lg' : 'bg-slate-300'}`}>
                  {room.isPaid ? <DollarSign className="w-6 h-6" /> : room.minRank ? <Lock className="w-6 h-6" /> : <Hash className="w-6 h-6" />}
                </div>
                {room.isLive && (
                  <div className="absolute -bottom-1 -right-1 bg-red-500 border-2 border-white w-4 h-4 rounded-full animate-pulse"></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                  <h4 className="text-sm font-black text-slate-900 truncate">{lang === 'en' ? room.name : room.nameAr}</h4>
                  <span className="text-[10px] text-slate-400 font-bold">12:45 PM</span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-slate-500 truncate font-medium">{room.lastMessage}</p>
                  {room.isPaid && <span className="text-[9px] font-black text-emerald-600 uppercase bg-emerald-50 px-2 py-0.5 rounded">{room.price}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat / Media Interface */}
      <div className="flex-1 flex flex-col bg-[#efeae2] relative">
        
        {/* Chat Header */}
        <div className="p-4 bg-[#f0f2f5] border-b border-slate-200 flex items-center justify-between z-20">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-md">
                <VideoIcon className="w-5 h-5" />
             </div>
             <div>
                <h3 className="text-sm font-black text-slate-900">{lang === 'en' ? activeRoom.name : activeRoom.nameAr}</h3>
                <div className="flex items-center gap-2">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{activeRoom.activeUsers} {t.online}</p>
                  <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                  <div className="flex items-center gap-1 text-[8px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-1.5 py-0.5 rounded">
                     <ShieldCheck className="w-3 h-3" /> {t.e2ee}
                  </div>
                </div>
             </div>
          </div>
          <div className="flex items-center gap-4">
             {activeRoom.isLive && (
               <div className="flex items-center gap-2 mr-4 bg-white/50 p-1.5 rounded-xl border border-white">
                  <button onClick={() => setIsAudioMuted(!isAudioMuted)} className={`p-2 rounded-lg transition-colors ${isAudioMuted ? 'text-red-500 bg-red-50' : 'text-slate-500 hover:bg-white'}`}>
                    {isAudioMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>
                  <button onClick={() => setIsVideoMuted(!isVideoMuted)} className={`p-2 rounded-lg transition-colors ${isVideoMuted ? 'text-red-500 bg-red-50' : 'text-slate-500 hover:bg-white'}`}>
                    {isVideoMuted ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                  </button>
                  <button onClick={() => setIsRecording(!isRecording)} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[9px] font-black transition-all ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-white text-slate-500'}`}>
                    <div className={`w-2 h-2 rounded-full ${isRecording ? 'bg-white animate-pulse' : 'bg-slate-300'}`}></div>
                    {t.record}
                  </button>
               </div>
             )}
             <button onClick={() => setIsTranslating(!isTranslating)} className={`p-2 rounded-lg transition-colors ${isTranslating ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400'}`}>
               <Languages className="w-5 h-5" />
             </button>
             <Phone className="w-5 h-5 text-slate-500 cursor-pointer" />
             <MoreVertical className="w-5 h-5 text-slate-500 cursor-pointer" />
          </div>
        </div>

        {/* Matchmaking Overlay */}
        {showMatchmaking && (
          <div className="absolute inset-x-0 top-16 bottom-0 z-40 bg-white/95 backdrop-blur-xl p-10 overflow-y-auto animate-in fade-in slide-in-from-right duration-500">
             <div className="max-w-2xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                   <div className="flex items-center gap-4">
                      <Target className="w-10 h-10 text-indigo-600" />
                      <div>
                         <h2 className="text-2xl font-black tracking-tighter">{t.matchTitle}</h2>
                         <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{t.matchSub}</p>
                      </div>
                   </div>
                   <button onClick={() => setShowMatchmaking(false)} className="p-3 bg-slate-100 rounded-2xl hover:bg-slate-200"><X className="w-5 h-5" /></button>
                </div>
                
                <textarea 
                   value={matchBrief}
                   onChange={(e) => setMatchBrief(e.target.value)}
                   rows={6}
                   className="w-full p-6 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] text-sm font-medium focus:ring-0 focus:border-indigo-500"
                   placeholder="Describe your design vision, budget, and region..."
                />
                
                <button 
                  onClick={handleMatchmaking}
                  disabled={isMatching || !matchBrief.trim()}
                  className="w-full py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-2xl shadow-indigo-600/20 disabled:opacity-50 flex items-center justify-center gap-3"
                >
                   {isMatching ? <Sparkles className="w-5 h-5 animate-spin" /> : <Target className="w-5 h-5" />}
                   {isMatching ? 'Analyzing Professionals...' : 'Start Matching Process'}
                </button>

                {matchResult && (
                  <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 animate-in fade-in slide-in-from-bottom-4">
                     <div className="flex justify-between items-center mb-6">
                        <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Match Compatibility: {matchResult.matchScore}%</span>
                        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase">Verified Logic</div>
                     </div>
                     <p className="text-sm font-bold text-slate-800 mb-8 leading-relaxed">{matchResult.reasoning}</p>
                     <div className="grid grid-cols-2 gap-4">
                        {['Arch. Khalid', 'Eng. Sarah', 'Studio 42'].map(expert => (
                          <div key={expert} className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all cursor-pointer">
                             <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600"><Briefcase className="w-5 h-5" /></div>
                             <span className="text-[11px] font-black">{expert}</span>
                          </div>
                        ))}
                     </div>
                  </div>
                )}
             </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
          {messages.map((m) => (
            <div key={m.id} className={`flex flex-col ${m.sender === 'You' ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[80%] rounded-xl px-4 py-2.5 shadow-sm relative text-sm ${
                m.type === 'cad' ? 'bg-indigo-600 text-white w-full max-w-sm' :
                m.isAI ? 'bg-white text-slate-800 rounded-tl-none border-l-4 border-indigo-600' :
                m.sender === 'You' ? 'bg-[#d9fdd3] text-slate-800 rounded-tr-none' : 'bg-white text-slate-800 rounded-tl-none'
              }`}>
                {m.type === 'cad' ? (
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                       <FileBox className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                       <p className="text-[10px] font-black uppercase tracking-widest">Architectural Model Shared</p>
                       <p className="text-[9px] opacity-80">Revision_Final_v2.dwg (42 MB)</p>
                    </div>
                    <button className="p-2 bg-white/10 rounded-lg hover:bg-white/20"><Phone className="w-4 h-4 rotate-45" /></button>
                  </div>
                ) : (
                  <>
                    {m.sender !== 'You' && (
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black text-indigo-600">{m.sender}</span>
                        {m.senderRank && <span className="text-[8px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-black">{m.senderRank}</span>}
                      </div>
                    )}
                    <p className="leading-relaxed font-medium">
                      {isTranslating && m.sender !== 'You' && m.text.length > 5 ? (
                        <span className="italic flex flex-col">
                          <span className="text-[10px] text-indigo-400 font-black mb-1 flex items-center gap-1"><Sparkles className="w-3 h-3" /> AI Translation</span>
                          {lang === 'ar' ? (m.text === 'We are seeing a 15% increase in demand for biophilic integration in GCC offices.' ? 'نحن نرى زيادة بنسبة 15٪ في الطلب على التكامل البيوفيلي في مكاتب دول مجلس التعاون الخليجي.' : m.text) : m.text}
                        </span>
                      ) : m.text}
                    </p>
                  </>
                )}
                <div className="flex items-center justify-end gap-1 mt-1">
                  <span className="text-[9px] text-slate-400 font-bold">{m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  {m.sender === 'You' && <CheckCheck className="w-3.5 h-3.5 text-indigo-500" />}
                </div>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-[#f0f2f5] flex items-center gap-3">
           <div className="flex gap-4 px-2">
             <Smile className="w-6 h-6 text-slate-500 cursor-pointer" />
             {/* Fixed: Removed 'title' prop which is not supported on Lucide icons directly */}
             <FileBox className="w-6 h-6 text-slate-500 cursor-pointer hover:text-indigo-600 transition-colors" />
           </div>
           
           <form onSubmit={(e) => handleSend(e)} className="flex-1 flex items-center gap-3">
             <input 
               value={input}
               onChange={(e) => setInput(e.target.value)}
               placeholder={t.typeMessage}
               className="flex-1 bg-white border-none rounded-xl py-3 px-5 text-sm focus:ring-0 shadow-sm"
             />
             <button type="submit" className={`w-12 h-12 rounded-full flex items-center justify-center bg-indigo-600 text-white shadow-lg`}>
                <Send className="w-5 h-5" />
             </button>
           </form>
        </div>
      </div>

      {/* Info Panel */}
      <div className="w-80 bg-white border-l border-slate-200 hidden xl:flex flex-col">
        <div className="p-8 text-center border-b border-slate-50">
           <div className={`w-24 h-24 rounded-3xl mx-auto mb-6 flex items-center justify-center text-white ${activeRoom.isPaid ? 'bg-emerald-500' : 'bg-indigo-600'} shadow-2xl`}>
              <Video className="w-12 h-12" />
           </div>
           <h3 className="text-lg font-black text-slate-900 mb-1">{lang === 'en' ? activeRoom.name : activeRoom.nameAr}</h3>
           <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{activeRoom.category} Hub</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
           {activeRoom.isPaid && (
             <div className="bg-emerald-50 p-6 rounded-[2rem] border border-emerald-100">
                <div className="flex items-center gap-3 mb-4">
                   <DollarSign className="w-5 h-5 text-emerald-600" />
                   <span className="text-xs font-black uppercase tracking-widest text-emerald-600">{t.paidRoom}</span>
                </div>
                <p className="text-[10px] font-bold text-slate-600 uppercase mb-4 leading-relaxed">This is a premium workshop. Your access expires in 4 hours.</p>
                <div className="text-2xl font-black text-emerald-600">{activeRoom.price}</div>
             </div>
           )}

           <div>
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">{t.online} (215)</h4>
              <div className="space-y-4">
                 {[1, 2, 3].map(i => (
                   <div key={i} className="flex items-center gap-3">
                      <img src={`https://i.pravatar.cc/100?u=${i}`} className="w-8 h-8 rounded-full" />
                      <div>
                         <p className="text-[11px] font-black text-slate-900">Arch. Salim {i}</p>
                         <span className="text-[8px] text-indigo-600 font-black uppercase">Expert Member</span>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
