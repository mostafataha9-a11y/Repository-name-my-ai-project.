
import React, { useState, useRef } from 'react';
import { Award, Zap, BookOpen, Star, Briefcase, TrendingUp, CheckCircle2, ShieldCheck, ChevronRight, UserCheck, Flame, Sparkles, Fingerprint, Upload, Loader2, AlertCircle } from 'lucide-react';
import { UserRank, UserStats, Language } from '../types';
import { verifyProfessionalIdentity } from '../services/geminiService';

interface MembershipCenterProps {
  lang: Language;
}

const MembershipCenter: React.FC<MembershipCenterProps> = ({ lang }) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentUserStats: UserStats = {
    points: 1250,
    articlesCount: 8,
    projectsCount: 4,
    qualityScore: 88,
    memberRating: 4.8,
    securityLevel: 95,
    // Fix: Added missing verificationLevel property
    verification: { status: 'unverified', verificationLevel: 1 }
  };

  const handleVerificationUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsVerifying(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = (reader.result as string).split(',')[1];
      const result = await verifyProfessionalIdentity(base64, `Architect Khalid - Registered in GCC region`);
      setVerificationResult(result);
      setIsVerifying(false);
    };
    reader.readAsDataURL(file);
  };

  const rankData = [
    { rank: UserRank.BEGINNER, nameAr: 'عضو مبتدئ', icon: Flame, color: 'slate', minPoints: 0, desc: 'Entry level for enthusiasts.' },
    { rank: UserRank.CERTIFIED, nameAr: 'مهندس معتمد', icon: UserCheck, color: 'blue', minPoints: 500, desc: 'Professionals with verified degrees.' },
    { rank: UserRank.DESIGN_EXPERT, nameAr: 'خبير تصميم', icon: Sparkles, color: 'purple', minPoints: 2000, desc: 'Designers with high quality scores.' },
    { rank: UserRank.CONSULTANT, nameAr: 'استشاري ديكور', icon: ShieldCheck, color: 'emerald', minPoints: 5000, desc: 'Proven expertise in spatial planning.' },
    { rank: UserRank.GOLD, nameAr: 'عضو ذهبي', icon: Star, color: 'amber', minPoints: 10000, desc: 'Exclusive community leaders.' },
    { rank: UserRank.INFLUENCER, nameAr: 'عضو مؤثر', icon: TrendingUp, color: 'pink', minPoints: 25000, desc: 'High impact and large following.' }
  ];

  const t = {
    en: {
      title: 'Elite Architectural Ranks',
      subtitle: 'Advance your career through contributions and engineering excellence.',
      currentRank: 'Current Level',
      stats: 'Mastery Statistics',
      nextRank: 'Next Architectural Milestone',
      requirements: 'Requirements for Promotion',
      benefits: 'Unlock Professional Benefits',
      points: 'Engagement Points',
      articles: 'Technical Articles',
      projects: 'Published Projects',
      quality: 'AI Quality Index',
      verifyTitle: 'Professional Identity Verification',
      verifySub: 'Secure your "Verified Architect" badge by submitting credentials.',
      uploadDoc: 'Upload License/ID',
      verifying: 'Neural Audit in Progress...'
    },
    ar: {
      title: 'رتب النخبة المعمارية',
      subtitle: 'ارتقِ بمسيرتك المهنية من خلال المساهمات والتميز الهندسي.',
      currentRank: 'المستوى الحالي',
      stats: 'إحصائيات الإتقان',
      nextRank: 'المحطة المعمارية القادمة',
      requirements: 'متطلبات الترقية',
      benefits: 'فتح المزايا المهنية',
      points: 'نقاط التفاعل',
      articles: 'المقالات التقنية',
      projects: 'المشاريع المنشورة',
      quality: 'مؤشر الجودة الذكي',
      verifyTitle: 'توثيق الهوية المهنية',
      verifySub: 'احصل على وسام "معماري موثق" عن طريق تقديم مستنداتك.',
      uploadDoc: 'رفع الرخصة/الهوية',
      verifying: 'جاري التدقيق العصبي...'
    }
  }[lang];

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      <section className="bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 blur-[120px]"></div>
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="max-w-xl">
            <h1 className="text-5xl font-black tracking-tighter mb-4 leading-tight">{t.title}</h1>
            <p className="text-slate-400 text-lg font-bold opacity-80 mb-8 uppercase tracking-wide">{t.subtitle}</p>
            <div className="flex flex-wrap gap-4">
               <div className="bg-white/10 px-6 py-3 rounded-2xl border border-white/5 flex items-center gap-3">
                 <Zap className="w-5 h-5 text-indigo-400" />
                 <span className="text-xs font-black uppercase tracking-widest">{currentUserStats.points} {t.points}</span>
               </div>
               <div className="bg-white/10 px-6 py-3 rounded-2xl border border-white/5 flex items-center gap-3">
                 <Star className="w-5 h-5 text-amber-400" />
                 <span className="text-xs font-black uppercase tracking-widest">{currentUserStats.qualityScore}% {t.quality}</span>
               </div>
            </div>
          </div>
          
          <div className="w-full lg:w-96 bg-white/5 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/10">
            <div className="flex items-center justify-between mb-8">
               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">{t.currentRank}</span>
               <Award className="w-6 h-6 text-indigo-400" />
            </div>
            <div className="flex items-center gap-6 mb-8">
               <div className="w-20 h-20 bg-indigo-600 rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-indigo-600/40">
                 <UserCheck className="w-10 h-10" />
               </div>
               <div>
                 <h2 className="text-2xl font-black tracking-tight">{lang === 'en' ? UserRank.CERTIFIED : 'مهندس معتمد'}</h2>
                 <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mt-1">Verified Professional</p>
               </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                <span>Progress to Design Expert</span>
                <span className="text-indigo-400">62%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                <div className="bg-indigo-500 h-full rounded-full w-[62%]"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Identity Verification Section */}
      <section className="bg-white rounded-[3rem] border border-slate-100 p-10 shadow-sm">
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="w-24 h-24 bg-indigo-50 rounded-[2rem] flex items-center justify-center text-indigo-600 shrink-0">
             <Fingerprint className="w-12 h-12" />
          </div>
          <div className="flex-1">
             <h3 className="text-2xl font-black text-slate-900 tracking-tighter mb-2">{t.verifyTitle}</h3>
             <p className="text-slate-500 font-bold text-sm uppercase tracking-wide opacity-80">{t.verifySub}</p>
          </div>
          <div>
             <input type="file" ref={fileInputRef} className="hidden" onChange={handleVerificationUpload} accept="image/*" />
             <button 
               onClick={() => fileInputRef.current?.click()}
               disabled={isVerifying}
               className="px-10 py-5 bg-slate-950 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all flex items-center gap-3 disabled:opacity-50"
             >
               {isVerifying ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
               {isVerifying ? t.verifying : t.uploadDoc}
             </button>
          </div>
        </div>
        
        {verificationResult && (
          <div className="mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-100 animate-in fade-in slide-in-from-top-4">
             <div className="flex items-center gap-4 mb-4">
                <ShieldCheck className={`w-6 h-6 ${verificationResult.isValid ? 'text-emerald-500' : 'text-red-500'}`} />
                <h4 className="font-black text-slate-900 uppercase text-xs tracking-widest">Neural Audit Result</h4>
             </div>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Detected Name</span>
                   <p className="text-sm font-black text-slate-900">{verificationResult.detectedName}</p>
                </div>
                <div>
                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Confidence Score</span>
                   <p className="text-sm font-black text-indigo-600">{Math.round(verificationResult.confidenceScore * 100)}%</p>
                </div>
                <div>
                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">License Status</span>
                   <p className={`text-sm font-black ${verificationResult.isValid ? 'text-emerald-500' : 'text-red-500'}`}>{verificationResult.isValid ? 'Valid' : 'Invalid'}</p>
                </div>
                <div>
                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Expiry Date</span>
                   <p className="text-sm font-black text-slate-900">{verificationResult.expiryDate || 'N/A'}</p>
                </div>
             </div>
          </div>
        )}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-2xl font-black tracking-tighter flex items-center gap-4 mb-8">
            <Award className="w-8 h-8 text-indigo-600" /> {lang === 'en' ? 'Professional Tier Structure' : 'هيكل فئات الاحتراف'}
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {rankData.map((item, idx) => (
              <div key={idx} className={`p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${item.rank === UserRank.CERTIFIED ? 'ring-2 ring-indigo-500' : ''}`}>
                <div className="flex items-center gap-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
                    item.color === 'blue' ? 'bg-blue-50 text-blue-600' : 
                    item.color === 'purple' ? 'bg-purple-50 text-purple-600' :
                    item.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
                    item.color === 'amber' ? 'bg-amber-50 text-amber-600' :
                    item.color === 'pink' ? 'bg-pink-50 text-pink-600' : 'bg-slate-100 text-slate-500'
                  }`}>
                    <item.icon className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="text-lg font-black tracking-tight">{lang === 'en' ? item.rank : item.nameAr}</h4>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wide">{item.desc}</p>
                  </div>
                </div>
                <div className="text-right">
                   <div className="text-sm font-black text-slate-900">{item.minPoints.toLocaleString()}</div>
                   <div className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Min. Points</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-xl">
            <h3 className="font-black text-xs uppercase tracking-[0.2em] text-slate-400 mb-8">{t.requirements}</h3>
            <div className="space-y-6">
               {[
                 { label: t.points, current: currentUserStats.points, target: 2000, icon: Zap },
                 { label: t.articles, current: currentUserStats.articlesCount, target: 10, icon: BookOpen },
                 { label: t.projects, current: currentUserStats.projectsCount, target: 5, icon: Briefcase },
                 { label: t.quality, current: currentUserStats.qualityScore, target: 90, icon: Star }
               ].map((req, i) => (
                 <div key={i} className="space-y-3">
                   <div className="flex justify-between items-center">
                     <div className="flex items-center gap-3">
                       <req.icon className="w-4 h-4 text-indigo-600" />
                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">{req.label}</span>
                     </div>
                     <span className="text-[10px] font-bold text-slate-400">{req.current} / {req.target}</span>
                   </div>
                   <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                     <div 
                       className={`h-full rounded-full transition-all duration-1000 ${req.current >= req.target ? 'bg-emerald-500' : 'bg-indigo-500'}`} 
                       style={{ width: `${Math.min((req.current / req.target) * 100, 100)}%` }}
                     ></div>
                   </div>
                 </div>
               ))}
            </div>
          </div>

          <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-indigo-600/30">
            <h3 className="font-black text-xs uppercase tracking-[0.2em] text-indigo-200 mb-8">{t.benefits}</h3>
            <ul className="space-y-4">
               {[
                 'Access to VIP Design Hubs',
                 'Direct Gemini Image Credits',
                 'Verified Professional Badge',
                 'Unlimited Project Showcase',
                 'Bidding Priority'
               ].map((benefit, i) => (
                 <li key={i} className="flex items-center gap-4 text-xs font-black uppercase tracking-tight">
                   <CheckCircle2 className="w-5 h-5 text-indigo-200 shrink-0" />
                   {benefit}
                 </li>
               ))}
            </ul>
            <button className="w-full mt-8 py-5 bg-white text-indigo-600 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-indigo-50 transition-all">
              Apply for Certification
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembershipCenter;
