
import React, { useState } from 'react';
import { 
  ShieldCheck, Lock, Fingerprint, Activity, History, 
  AlertTriangle, RefreshCw, Key, ShieldAlert, Globe, 
  Database, UserCheck, CheckCircle2, MoreHorizontal,
  Globe2, Server, Terminal, ShieldPlus, Radio, Binary,
  EyeOff, Map, BugPlay, Scan, DatabaseBackup, Zap, Shield
} from 'lucide-react';
import { Language, SecurityStatus } from '../types';

interface SecurityHubProps {
  lang: Language;
}

const SecurityHub: React.FC<SecurityHubProps> = ({ lang }) => {
  const [status] = useState<SecurityStatus>({
    sslActive: true,
    ddosProtected: true,
    twoFactorEnabled: false,
    lastBackup: '2024-05-21 04:00 AM',
    behavioralRisk: 'Low',
    isAccountIsolated: true,
    e2eeEnabled: true,
    zeroTrustStatus: 'Active',
    gdprCompliant: true,
    fraudDetectionScore: 99.8,
    rlsEnforced: true,
    rbacActive: true
  });

  const t = {
    en: {
      title: 'Security & Integrity Hub',
      subtitle: 'Global infrastructure monitoring for architectural data protection.',
      ssl: 'SSL Encryption Status',
      ddos: 'DDoS Active Mitigation',
      twoFactor: 'Multi-Factor Auth (2FA)',
      backup: 'Neural Resilience Engine',
      risk: 'Behavioral Threat Detection',
      isolation: 'Sensitive Account Isolation',
      enable: 'Enable Security Layer',
      active: 'Fully Active',
      lastScan: 'Last Global Neural Scan',
      recentEvents: 'Recent Security Events',
      infraStatus: 'Global Edge Grid Status',
      e2ee: 'End-to-End Encryption (E2EE)',
      zeroTrust: 'Zero Trust Architecture',
      compliance: 'Regional Data Compliance (GDPR)',
      fraud: 'AI Fraud Prevention Score',
      incBackup: 'Hourly Pulse Active',
      extEnc: 'External Encrypted Vault',
      imagePrivacy: 'Neural Image Shield'
    },
    ar: {
      title: 'مركز الأمن والنزاهة',
      subtitle: 'مراقبة البنية التحتية العالمية لحماية البيانات المعمارية.',
      ssl: 'حالة تشفير SSL',
      ddos: 'تخفيف هجمات DDoS النشط',
      twoFactor: 'المصادقة الثنائية (2FA)',
      backup: 'محرك المرونة العصبي',
      risk: 'كشف التهديدات السلوكية',
      isolation: 'عزل الحسابات الحساسة',
      enable: 'تفعيل طبقة الحماية',
      active: 'نشط بالكامل',
      lastScan: 'آخر مسح عصبي عالمي',
      recentEvents: 'الأحداث الأمنية الأخيرة',
      infraStatus: 'حالة شبكة الحافة العالمية (Edge)',
      e2ee: 'تشفير طرف إلى طرف (E2EE)',
      zeroTrust: 'هندسة الثقة المعدومة (Zero Trust)',
      compliance: 'الامتثال الإقليمي للبيانات (GDPR)',
      fraud: 'درجة منع الاحتيال بالذكاء الاصطناعي',
      incBackup: 'النبض التزايدي نشط',
      extEnc: 'نسخة خارجية مشفرة',
      imagePrivacy: 'الدرع العصبي للصور'
    }
  }[lang];

  const securityCards = [
    { id: 'ssl', title: t.ssl, icon: Lock, active: status.sslActive, color: 'text-emerald-500', desc: 'Enterprise-grade 256-bit encryption for all project data.' },
    { id: 'backup', title: t.backup, icon: DatabaseBackup, active: true, color: 'text-indigo-600', desc: `Full daily: ${status.lastBackup} • ${t.incBackup}: Every 60m • ${t.extEnc}: Yes.` },
    { id: 'zeroTrust', title: t.zeroTrust, icon: ShieldPlus, active: status.zeroTrustStatus === 'Active', color: 'text-purple-500', desc: 'Always verify, never trust. Continuous identity validation.' },
    { id: 'imagePrivacy', title: t.imagePrivacy, icon: Shield, active: true, color: 'text-indigo-400', desc: 'Real-time encryption and auto-purge for design assets.' },
    { id: 'fraud', title: t.fraud, icon: Scan, active: status.fraudDetectionScore > 95, color: 'text-amber-500', desc: `AI-Neural engine score: ${status.fraudDetectionScore}% accuracy.` },
    { id: 'risk', title: t.risk, icon: Activity, active: status.behavioralRisk === 'Low', color: 'text-emerald-500', desc: `Current Risk Profile: ${status.behavioralRisk}` }
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      {/* Security Hero */}
      <section className="bg-slate-950 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[150px]"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-600/40">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">{t.active}</span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter mb-4 leading-tight">{t.title}</h1>
            <p className="text-slate-400 text-lg font-bold opacity-80 mb-8 max-w-lg leading-relaxed">{t.subtitle}</p>
            
            <div className="flex gap-4">
               <button className="px-8 py-4 bg-white text-slate-950 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-50 transition-all flex items-center gap-2">
                  <BugPlay className="w-4 h-4" /> Global Penetration Test
               </button>
               <button className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all">
                  Security Documentation
               </button>
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10 w-full md:w-80">
             <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-8">{t.lastScan}</h3>
             <div className="space-y-6">
                <div className="flex justify-between items-center">
                   <div className="flex items-center gap-3">
                      <RefreshCw className="w-4 h-4 text-indigo-400 animate-spin" />
                      <span className="text-xs font-black uppercase tracking-widest">Global Integrity Check</span>
                   </div>
                   <span className="text-xs font-black text-emerald-500">100%</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                   <div className="bg-indigo-500 h-full w-full"></div>
                </div>
                <div className="pt-4 border-t border-white/5">
                   <p className="text-[10px] text-slate-400 leading-relaxed font-bold uppercase tracking-tight">Zero-Day protection active across all nodes. AI-Fraud engine scanning 1.2M events/sec.</p>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Security Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {securityCards.map((card) => (
          <div key={card.id} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
             <div className="flex items-center justify-between mb-8">
                <div className={`w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center transition-all group-hover:bg-slate-900 group-hover:text-white ${card.color}`}>
                   <card.icon className="w-7 h-7" />
                </div>
                {card.active ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                ) : (
                  <div className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[9px] font-black uppercase tracking-widest">Attention Required</div>
                )}
             </div>
             <h3 className="text-lg font-black text-slate-900 mb-2 tracking-tight">{card.title}</h3>
             <p className="text-xs text-slate-500 font-bold uppercase tracking-wide leading-relaxed mb-8 opacity-70">{card.desc}</p>
             <button className={`w-full py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${card.active ? 'bg-slate-50 text-slate-400 cursor-default' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-600/20'}`}>
                {card.active ? 'System Verified' : t.enable}
             </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SecurityHub;
