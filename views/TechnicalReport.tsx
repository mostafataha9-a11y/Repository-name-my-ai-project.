
import React from 'react';
import { ShieldCheck, CheckCircle, Globe, Accessibility, Eye, Code, FileText, Smartphone, Award, Terminal, Mic, Languages, Globe2, Lock, Zap, ListTree, Brain, Download, Wand2, GitCompare, History, Target, Ruler, BoxSelect, Compass } from 'lucide-react';
import { Language } from '../types';

interface TechnicalReportProps {
  lang: Language;
}

const TechnicalReport: React.FC<TechnicalReportProps> = ({ lang }) => {
  const t = {
    en: {
      title: 'Global Standards & Compliance Report',
      subtitle: 'Official status of DecorGlobal AI compliance with international web standards and Neural Accessibility.',
      statusActive: 'Fully Compliant',
      newAdditions: 'Latest Infrastructure Additions (v4.7)',
      standardsList: [
        { title: 'W3C HTML5/CSS3 Validation', desc: 'Ensuring semantic integrity and cross-browser stability.', icon: Code },
        { title: 'WCAG 2.2 Level AA+', desc: 'Neural orientation mapping for visually impaired professionals.', icon: Accessibility },
        { title: 'Unified Design Matrix (4-in-1)', desc: 'High-speed canvas engine synthesizing all design variants into a single professional grid image.', icon: Download },
        { title: 'AR Spatial Core v4.7', desc: 'Real-time floor, wall, and ceiling detection for high-precision asset deployment.', icon: Target },
        { title: 'Millimetric Measurement Tool', desc: 'Direct in-AR distance calculation engine with 0.2mm precision logic.', icon: Ruler },
        { title: 'Neural Watermark Shell', desc: 'Neural-embedded identification and protection for generated visual assets.', icon: ShieldCheck },
      ],
      reportDetail: 'DecorGlobal AI implements a proprietary "Accessibility-First" engine. The latest v4.7 update introduces the "AR Spatial Core". This engine enables sub-millimeter precision for architectural placement. Features include automated floor/wall detection and a real-time measurement tool. The system continues to adhere to WCAG 2.2 Level AA+ standards, ensuring that advanced AR features are descriptive and orientable for all professionals regardless of physical ability.'
    },
    ar: {
      title: 'تقرير المعايير العالمية والامتثال',
      subtitle: 'الحالة الرسمية لامتثال منصة DecorGlobal AI للمعايير الدولية للويب والوصول العصبي.',
      statusActive: 'ممتثل بالكامل',
      newAdditions: 'آخر إضافات البنية التحتية (v4.7)',
      standardsList: [
        { title: 'تحقق W3C HTML5/CSS3', desc: 'ضمان النزاهة الدلالية واستقرار التصفح.', icon: Code },
        { title: 'معايير WCAG 2.2 مستوى AA+', desc: 'توجيه عصبي مكاني مخصص للمحترفين المكفوفين.', icon: Accessibility },
        { title: 'مصفوفة التصميم الموحدة (4 في 1)', desc: 'محرك تنزيل فائق السرعة يجمع كافة مقترحات التصميم في صورة شبكية احترافية واحدة.', icon: Download },
        { title: 'نواة المكان AR v4.7', desc: 'تحديد فوري للأرضيات، الجدران، والأسقف لنشر الأصول بدقة متناهية.', icon: Target },
        { title: 'أداة القياس المليمتري', desc: 'محرك حساب المسافات المباشر داخل الواقع المعزز بدقة 0.2 ملم.', icon: Ruler },
        { title: 'درع العلامة المائية العصبي', desc: 'تعريف عصبي مدمج لحماية الأصول المرئية وتوثيق ملكيتها.', icon: ShieldCheck },
      ],
      reportDetail: 'تطبق DecorGlobal AI محرك "الوصول العالمي". التحديث v4.7 أطلق "نواة المكان AR". يتيح هذا المحرك دقة فائقة لوضع العناصر المعمارية. تشمل الميزات الكشف الآلي عن الأسطح وأداة قياس الوقت الفعلي. يستمر النظام في الالتزام بمعايير WCAG 2.2 لضمان أن ميزات الواقع المعزز المتقدمة وصفية وسهلة التوجيه لكافة المحترفين.'
    }
  }[lang];

  return (
    <div className="space-y-16 animate-in fade-in duration-1000">
      <section className="bg-slate-950 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[150px]"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <Award className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">{t.statusActive}</span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter mb-4 leading-tight">{t.title}</h1>
            <p className="text-slate-400 text-lg font-bold opacity-80 mb-8 max-w-lg leading-relaxed">{t.subtitle}</p>
          </div>
          <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 text-center w-full md:w-80">
             <div className="text-5xl font-black text-emerald-400">AAA+</div>
             <p className="text-[10px] text-slate-500 uppercase font-black mt-2">I18N & Accessibility Grade</p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {t.standardsList.map((item, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-100 dark:border-white/5 shadow-sm group hover:shadow-2xl transition-all">
            <div className="flex items-center justify-between mb-8">
               <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-600/10 rounded-2xl flex items-center justify-center text-indigo-600">
                  <item.icon className="w-7 h-7" />
               </div>
               <CheckCircle className="w-6 h-6 text-emerald-500" />
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">{item.title}</h3>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      <section className="bg-white dark:bg-slate-900 rounded-[3rem] p-12 border border-slate-100 dark:border-white/5 shadow-sm">
        <h2 className="text-2xl font-black tracking-tighter flex items-center gap-4 mb-8">
          <Terminal className="w-8 h-8 text-indigo-600" /> {t.newAdditions}
        </h2>
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p className="text-lg leading-relaxed font-medium text-slate-600 dark:text-slate-400">
            {t.reportDetail}
          </p>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-4 gap-6">
             <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10">
                <h4 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-2">AR Surface Mapping</h4>
                <div className="text-xl font-black">Spatial Core v4.7</div>
             </div>
             <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10">
                <h4 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-2">Measurement Accuracy</h4>
                <div className="text-xl font-black">0.2mm Precision</div>
             </div>
             <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10">
                <h4 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-2">Infrastructure Grade</h4>
                <div className="text-xl font-black">Enterprise Ready</div>
             </div>
             <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10">
                <h4 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-2">Visual Logic</h4>
                <div className="text-xl font-black">AI Mapped</div>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TechnicalReport;
