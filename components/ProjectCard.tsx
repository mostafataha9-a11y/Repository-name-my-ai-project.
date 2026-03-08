import React, { useState } from 'react';
import { Project, Language, UserRank } from '../types';
import { Heart, MessageCircle, MapPin, Layers, DollarSign, ArrowRightLeft, Maximize2, ShieldCheck, Star, Trophy, Medal } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  lang: Language;
  onClick?: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, lang, onClick }) => {
  const [showAfter, setShowAfter] = useState(true);

  const rankColors = {
    [UserRank.BEGINNER]: 'bg-slate-100 text-slate-600',
    [UserRank.CERTIFIED]: 'bg-blue-50 text-blue-600',
    [UserRank.DESIGN_EXPERT]: 'bg-purple-50 text-purple-600',
    [UserRank.CONSULTANT]: 'bg-indigo-50 text-indigo-600',
    [UserRank.GOLD]: 'bg-amber-50 text-amber-600 border border-amber-200',
    [UserRank.INFLUENCER]: 'bg-pink-50 text-pink-600',
    [UserRank.ARCHITECT_MASTERS]: 'bg-indigo-900 text-white',
  };

  const t = {
    en: { 
      before: 'Before', 
      after: 'After', 
      budget: 'Budget', 
      materials: 'Materials', 
      view: 'View Project Analysis', 
      audit: 'Integrity Audit', 
      rfq: 'Direct Quote',
      toggleMsg: 'Toggle between original and final state',
      likeMsg: 'Like this project',
      commentMsg: 'Comment on this project'
    },
    ar: { 
      before: 'قبل', 
      after: 'بعد', 
      budget: 'الميزانية', 
      materials: 'المواد المستخدمة', 
      view: 'عرض تفاصيل المشروع', 
      audit: 'تدقيق النزاهة', 
      rfq: 'طلب عرض سعر',
      toggleMsg: 'التبديل بين الحالة الأصلية والنهائية',
      likeMsg: 'الإعجاب بهذا المشروع',
      commentMsg: 'التعليق على هذا المشروع'
    }
  }[lang];

  return (
    <article 
      className="group bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden hover:shadow-[0_50px_100px_rgba(0,0,0,0.12)] transition-all duration-700 cursor-pointer flex flex-col h-full relative"
      onClick={onClick}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={showAfter ? project.imageAfter : project.imageBefore} 
          alt={`${project.title} - ${showAfter ? t.after : t.before}`}
          className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110 ease-out"
        />
        
        {/* Awards Overlay */}
        {project.awards && project.awards.length > 0 && (
          <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
            {project.awards.map((award, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-slate-900/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl animate-in slide-in-from-left duration-500" style={{ transitionDelay: `${i * 100}ms` }}>
                <Trophy className={`w-3.5 h-3.5 ${award.grade === 'Platinum' ? 'text-indigo-400' : 'text-amber-400'}`} />
                <span className="text-[8px] font-black text-white uppercase tracking-widest">{award.type} {award.grade}</span>
              </div>
            ))}
          </div>
        )}

        {/* Integrity Badge */}
        {project.integrityScore && (
          <div className="absolute bottom-4 left-4 bg-indigo-600/90 backdrop-blur-md text-white px-3 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest shadow-2xl flex items-center gap-2 border border-white/20 z-10">
            <ShieldCheck className="w-3 h-3 fill-current" />
            {project.integrityScore}% {t.audit}
          </div>
        )}

        {/* Toggle Overlay */}
        <button 
          onClick={(e) => { e.stopPropagation(); setShowAfter(!showAfter); }}
          aria-label={t.toggleMsg}
          className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl text-[9px] font-black shadow-lg flex items-center gap-2 hover:bg-white transition-all uppercase tracking-widest active:scale-95 z-20"
        >
          <ArrowRightLeft className="w-3 h-3 text-indigo-600" aria-hidden="true" />
          {showAfter ? t.before : t.after}
        </button>

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4">
           <div className="bg-white text-slate-900 px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl flex items-center gap-3 transform translate-y-6 group-hover:translate-y-0 transition-transform duration-500">
             <Maximize2 className="w-4 h-4" /> {t.view}
           </div>
        </div>
      </div>

      <div className="p-8 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 bg-slate-100 rounded text-[7px] font-black text-slate-500 uppercase tracking-widest">{project.style}</span>
              <span className="px-2 py-0.5 bg-emerald-50 rounded text-[7px] font-black text-emerald-600 uppercase tracking-widest">{project.area}</span>
            </div>
            <h3 className="text-2xl font-black text-slate-950 group-hover:text-indigo-600 transition-colors line-clamp-1 tracking-tighter">
              {project.title}
            </h3>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-[0.15em]">
              <MapPin className="w-3.5 h-3.5 text-indigo-500" />
              {project.location}
            </div>
          </div>
          <div className="text-right">
            <div className="text-indigo-600 font-black text-xl tracking-tighter leading-none">{project.budget}</div>
            <div className="text-[8px] text-slate-400 uppercase font-black tracking-widest mt-1.5">{t.budget}</div>
          </div>
        </div>

        <p className="text-xs text-slate-500 line-clamp-2 mb-8 leading-relaxed font-medium">
          {project.description}
        </p>

        <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img src={`https://i.pravatar.cc/100?u=${project.author}`} className="w-11 h-11 rounded-2xl border-2 border-white shadow-xl object-cover" alt="" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <div className="text-[12px] font-black text-slate-900 leading-none">{project.author}</div>
                {project.rank === UserRank.ARCHITECT_MASTERS && <Medal className="w-3.5 h-3.5 text-amber-500" aria-label="Master Architect Award" />}
              </div>
              <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-lg inline-block tracking-tighter mt-1 ${rankColors[project.rank]}`}>
                {project.rank}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-5">
            <button 
              className="flex items-center gap-2 text-slate-400 hover:text-pink-500 transition-all hover:scale-110"
              aria-label={t.likeMsg}
              onClick={(e) => { e.stopPropagation(); }}
            >
              <Heart className="w-5 h-5" aria-hidden="true" />
              <span className="text-[10px] font-black tracking-tighter">{project.likes}</span>
            </button>
            <button 
              className="w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-400 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
              aria-label={t.commentMsg}
              onClick={(e) => { e.stopPropagation(); }}
            >
              <MessageCircle className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;