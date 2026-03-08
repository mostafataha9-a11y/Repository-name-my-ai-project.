
import React, { useState } from 'react';
import { Project, Language, UserRank } from '../types';
import { 
  ArrowLeft, MapPin, Calendar, Layers, DollarSign, 
  Star, Share2, Heart, MessageSquare, ShieldCheck, 
  Send, Maximize2, CheckCircle2, Info, User, 
  Sparkles, Zap, ArrowRightLeft, LayoutGrid, BoxSelect, View,
  Trophy, Building2, ExternalLink, Calculator, Factory, ShoppingCart,
  Medal, Scaling, Palette
} from 'lucide-react';

interface ProjectDetailProps {
  project: Project;
  lang: Language;
  onBack: () => void;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, lang, onBack }) => {
  const [showAfter, setShowAfter] = useState(true);
  const [liked, setLiked] = useState(false);
  const [showRfq, setShowRfq] = useState(false);
  const [rfqSubmitted, setRfqSubmitted] = useState(false);

  const t = {
    en: {
      back: 'Back to Showcase',
      before: 'Original State',
      after: 'Final Masterpiece',
      details: 'Technical Specifications',
      materials: 'Material Palette',
      budget: 'Estimated Investment',
      location: 'Site Location',
      completion: 'Completion Date',
      consultation: 'Request Expert Quote',
      consultationSub: 'Secure a direct lead with this lead architect.',
      review: 'Client Testimonial',
      area: 'Spatial Area',
      style: 'Design Style',
      materialsUsed: 'Suppliers & Components',
      requestBtn: 'Submit Quote Request',
      rating: 'Professional Rating',
      enterAR: 'Spatial 3D Reality Preview',
      arSub: 'Interact with the depth of the designed volume.',
      awards: 'Global Accolades',
      rfqSuccess: 'Your RFQ has been sent to the professional team.'
    },
    ar: {
      back: 'العودة للمعرض',
      before: 'الحالة الأصلية',
      after: 'التحفة النهائية',
      details: 'المواصفات الفنية',
      materials: 'لوحة الخامات',
      budget: 'الاستثمار التقديري',
      location: 'موقع المشروع',
      completion: 'تاريخ الإنجاز',
      consultation: 'طلب عرض سعر مباشر',
      consultationSub: 'تواصل مباشرة مع المعماري المسؤول.',
      review: 'رأي العميل',
      area: 'المساحة الكلية',
      style: 'طراز التصميم',
      materialsUsed: 'الموردون والمكونات',
      requestBtn: 'إرسال طلب السعر',
      rating: 'التقييم المهني',
      enterAR: 'معاينة مكانية ثلاثية الأبعاد',
      arSub: 'تفاعل مع عمق الكتلة المصممة والواقع المعزز.',
      awards: 'الأوسمة والجوائز العالمية',
      rfqSuccess: 'تم إرسال طلب عرض السعر للفريق المهني بنجاح.'
    }
  }[lang];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 max-w-7xl mx-auto pb-32">
      {/* RFQ Modal */}
      {showRfq && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-xl p-6">
           <div className="bg-white rounded-[3rem] p-12 max-w-xl w-full shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 blur-3xl"></div>
              {rfqSubmitted ? (
                <div className="text-center py-10 space-y-6">
                   <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-10 h-10" />
                   </div>
                   <h3 className="text-2xl font-black text-slate-900 tracking-tighter">{t.rfqSuccess}</h3>
                   <button onClick={() => setShowRfq(false)} className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest">Close</button>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-10">
                    <h2 className="text-3xl font-black tracking-tighter text-slate-900">{t.consultation}</h2>
                    <button onClick={() => setShowRfq(false)} className="text-slate-400 hover:text-slate-900">Close</button>
                  </div>
                  <form onSubmit={(e) => { e.preventDefault(); setRfqSubmitted(true); }} className="space-y-6">
                    <div>
                      <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Project Scope</label>
                      <input className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold" defaultValue={project.title} />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Your Budget Range</label>
                      <select className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold">
                        <option>$10k - $50k</option>
                        <option>$50k - $150k</option>
                        <option>$150k+</option>
                      </select>
                    </div>
                    <textarea className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold h-32" placeholder="Briefly describe your space requirements..." />
                    <button type="submit" className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-indigo-600/30">
                      {t.requestBtn}
                    </button>
                  </form>
                </>
              )}
           </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-12">
        <button 
          onClick={onBack}
          className="flex items-center gap-3 px-8 py-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:bg-slate-50 transition-all text-xs font-black text-slate-900 group"
        >
          <ArrowLeft className={`w-4 h-4 group-hover:-translate-x-1 transition-transform ${lang === 'ar' ? 'rotate-180' : ''}`} />
          {t.back}
        </button>
        <div className="flex gap-4">
          <button className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:text-indigo-600 transition-all">
            <Share2 className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setLiked(!liked)}
            className={`flex items-center gap-3 px-8 py-4 rounded-2xl border border-slate-100 shadow-sm transition-all text-xs font-black ${liked ? 'bg-pink-50 text-pink-600 border-pink-100' : 'bg-white text-slate-900 hover:text-pink-600'}`}
          >
            <Heart className={`w-4.5 h-4.5 ${liked ? 'fill-current' : ''}`} />
            {project.likes + (liked ? 1 : 0)}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 space-y-16">
          <div className="relative aspect-[16/9] rounded-[4rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.15)] border border-slate-100 group">
            <img 
              src={showAfter ? project.imageAfter : project.imageBefore} 
              alt={project.title}
              className="w-full h-full object-cover transition-all duration-[2s] group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
            
            <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end">
              <div className="text-white space-y-4">
                <div className="flex items-center gap-3">
                  <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] backdrop-blur-xl border border-white/20 ${showAfter ? 'bg-indigo-600/80' : 'bg-slate-900/80'}`}>
                    {showAfter ? t.after : t.before}
                  </span>
                  {project.isVerifiedProject && (
                    <span className="px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] bg-emerald-500/80 backdrop-blur-xl border border-white/10 flex items-center gap-2">
                       <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                    </span>
                  )}
                </div>
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter">{project.title}</h1>
                <div className="flex items-center gap-3 text-slate-300 text-sm font-bold tracking-wide">
                  <MapPin className="w-5 h-5 text-indigo-400" /> {project.location}
                </div>
              </div>
              
              <button 
                onClick={() => setShowAfter(!showAfter)}
                className="bg-white text-slate-900 w-20 h-20 rounded-[2.5rem] shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all group/btn"
              >
                <ArrowRightLeft className="w-8 h-8 group-hover/btn:rotate-180 transition-transform duration-700" />
              </button>
            </div>
          </div>

          {/* New 3D Preview Section */}
          <div className="bg-slate-950 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl group cursor-pointer border border-white/5">
             <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-transparent to-indigo-900/20 opacity-50 group-hover:opacity-100 transition-opacity"></div>
             {/* Architectural Wireframe Grid Background */}
             <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
             
             <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                <div className="flex items-center gap-8">
                   <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-indigo-600/40 relative">
                      <BoxSelect className="w-10 h-10" />
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-ping"></div>
                   </div>
                   <div>
                      <h3 className="text-3xl font-black tracking-tighter mb-2">{t.enterAR}</h3>
                      <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] opacity-80">{t.arSub}</p>
                   </div>
                </div>
                <div className="flex gap-4">
                  <div className="text-right hidden md:block border-r border-white/10 pr-6">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Engine Latency</p>
                    <p className="text-xl font-black text-white">8.4ms</p>
                  </div>
                  <button className="px-12 py-6 bg-white text-slate-950 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] hover:bg-indigo-50 transition-all shadow-2xl flex items-center gap-4">
                     <View className="w-5 h-5" /> Launch Viewer
                  </button>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white rounded-[3rem] border border-slate-100 p-12 shadow-sm space-y-12">
               <h3 className="text-2xl font-black text-slate-950 tracking-tighter flex items-center gap-4 border-b border-slate-50 pb-6">
                  <Scaling className="w-6 h-6 text-indigo-600" /> {t.details}
               </h3>
               <div className="grid grid-cols-2 gap-y-10">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <LayoutGrid className="w-3.5 h-3.5" /> {t.area}
                    </span>
                    <p className="text-xl font-black text-slate-900">{project.area}</p>
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Palette className="w-3.5 h-3.5" /> {t.style}
                    </span>
                    <p className="text-xl font-black text-slate-900">{project.style}</p>
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <DollarSign className="w-3.5 h-3.5" /> {t.budget}
                    </span>
                    <p className="text-xl font-black text-indigo-600">{project.budget}</p>
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5" /> {t.completion}
                    </span>
                    <p className="text-xl font-black text-slate-900">{project.completionDate}</p>
                  </div>
               </div>
               <p className="text-slate-600 leading-relaxed font-medium text-lg pt-6 border-t border-slate-50">
                  {project.description}
               </p>
            </div>

            <div className="space-y-12">
               {/* Suppliers Section */}
               <div className="bg-white rounded-[3rem] border border-slate-100 p-12 shadow-sm">
                  <h3 className="text-2xl font-black text-slate-950 tracking-tighter flex items-center gap-4 border-b border-slate-50 pb-6 mb-8">
                     <Building2 className="w-6 h-6 text-indigo-600" /> {t.materialsUsed}
                  </h3>
                  <div className="space-y-6">
                     {(project.linkedSuppliers || [
                        { id: 's1', name: 'Premium Nordic Flooring', category: 'Materials', website: '#' },
                        { id: 's2', name: 'Lumina Tech Global', category: 'Lighting', website: '#' },
                        { id: 's3', name: 'Organic Textile Hub', category: 'Fabrics', website: '#' }
                     ]).map(supplier => (
                        <div key={supplier.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl group hover:bg-white hover:shadow-xl transition-all cursor-pointer border border-transparent hover:border-indigo-100">
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                 <Factory className="w-6 h-6" />
                              </div>
                              <div>
                                 <h4 className="text-sm font-black text-slate-900">{supplier.name}</h4>
                                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{supplier.category}</span>
                              </div>
                           </div>
                           <button className="w-10 h-10 flex items-center justify-center bg-white text-slate-300 rounded-xl hover:text-indigo-600">
                              <ExternalLink className="w-4 h-4" />
                           </button>
                        </div>
                     ))}
                  </div>
                  <button className="w-full mt-10 py-5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3">
                     <ShoppingCart className="w-4 h-4" /> Purchase Bill of Materials
                  </button>
               </div>

               {/* Awards Section */}
               <div className="bg-amber-50 rounded-[3rem] border border-amber-100 p-12">
                  <h3 className="text-2xl font-black text-amber-900 tracking-tighter flex items-center gap-4 border-b border-amber-100 pb-6 mb-8">
                     <Trophy className="w-6 h-6 text-amber-500" /> {t.awards}
                  </h3>
                  <div className="space-y-6">
                     {(project.awards || [
                        { type: 'Innovation', year: 2024, grade: 'Platinum' },
                        { type: 'Luxury', year: 2024, grade: 'Gold' }
                     ]).map((award, i) => (
                        <div key={i} className="flex items-center gap-6 p-6 bg-white rounded-3xl border border-amber-100 shadow-sm">
                           <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${award.grade === 'Platinum' ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-600'}`}>
                              <Medal className="w-8 h-8" />
                           </div>
                           <div>
                              <h4 className="text-lg font-black text-slate-900 leading-none mb-1">{award.type} Mastery</h4>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{award.grade} Distinction • {award.year}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
          </div>
        </div>

        <div className="space-y-12">
          <div className="bg-white rounded-[3rem] border border-slate-100 p-10 shadow-2xl relative overflow-hidden text-center">
            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-600/5 blur-[80px]"></div>
            <div className="relative z-10">
              <div className="relative inline-block mb-8">
                <img 
                  src={`https://i.pravatar.cc/300?u=${project.author}`} 
                  className="w-40 h-40 rounded-[3.5rem] object-cover shadow-[0_30px_60px_rgba(0,0,0,0.1)] border-4 border-white"
                  alt={project.author}
                />
                <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-3 rounded-2xl shadow-2xl">
                  <ShieldCheck className="w-6 h-6" />
                </div>
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-1">{project.author}</h3>
              <div className={`text-[10px] font-black uppercase tracking-[0.2em] px-6 py-2 rounded-full inline-block mb-10 ${
                project.rank === UserRank.ARCHITECT_MASTERS ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'
              }`}>
                {project.rank}
              </div>
              
              <div className="grid grid-cols-2 gap-8 py-8 border-y border-slate-50 mb-10">
                <div>
                  <div className="text-2xl font-black text-slate-900">124</div>
                  <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Global Projects</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-900">4.96</div>
                  <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Audit Score</div>
                </div>
              </div>

              <div className="space-y-5">
                <div className="bg-slate-950 rounded-[2.5rem] p-8 text-white text-left shadow-2xl shadow-slate-950/20 group cursor-pointer" onClick={() => setShowRfq(true)}>
                  <div className="flex justify-between items-start mb-4">
                     <h4 className="text-lg font-black tracking-tighter flex items-center gap-3">
                       <Zap className="w-5 h-5 fill-indigo-400 text-indigo-400" /> {t.consultation}
                     </h4>
                     <ArrowRightLeft className="w-4 h-4 text-slate-700 group-hover:text-indigo-400 transition-colors" />
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold mb-8 uppercase tracking-wide leading-relaxed">{t.consultationSub}</p>
                  <button className="w-full py-5 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-indigo-500 transition-all flex items-center justify-center gap-3">
                    <Calculator className="w-4 h-4" /> {t.requestBtn}
                  </button>
                </div>
                
                <button className="w-full py-6 bg-white border border-slate-100 text-slate-900 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] hover:bg-slate-50 transition-all flex items-center justify-center gap-3">
                  <Star className="w-4 h-4 text-amber-500" /> Professional Portfolio
                </button>
              </div>
            </div>
          </div>
          
          {/* Integrity Metric Widget */}
          <div className="bg-indigo-50 rounded-[3rem] p-10 border border-indigo-100">
             <div className="flex items-center justify-between mb-8">
                <h4 className="text-[11px] font-black uppercase tracking-widest text-indigo-900">{t.rating}</h4>
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600"><Star className="w-5 h-5 fill-current" /></div>
             </div>
             <div className="space-y-6">
                {[
                   { label: 'Spatial Flow', value: 98 },
                   { label: 'Lighting Math', value: 94 },
                   { label: 'Sustainability', value: 89 }
                ].map((metric, i) => (
                   <div key={i} className="space-y-3">
                      <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-indigo-950">
                         <span>{metric.label}</span>
                         <span>{metric.value}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-white rounded-full overflow-hidden">
                         <div className="bg-indigo-600 h-full rounded-full transition-all duration-1000" style={{ width: `${metric.value}%` }}></div>
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

export default ProjectDetail;
