
import React, { useState, useEffect } from 'react';
import { Database, Server, Globe2, Activity, ShieldCheck, RefreshCw, Zap, Cpu, Terminal, DatabaseBackup, Search, HardDrive, BarChart3, Cloud, Layers, Binary, Workflow, Table, Users as UsersIcon, Key, CreditCard, Bookmark, FileText, Share2, Sparkles, Filter, Eye, Image as ImageIcon, ClipboardList, Info, ListTree, DatabaseZap, ShieldPlus, Radio, MessageSquare, Award, FolderKanban, Layout, Languages, Network, History, ShieldAlert, Lock, Boxes, Mic } from 'lucide-react';
import { Language, Region, DatabaseNode, DataSyncStatus, DatabaseType, RelationalTableStatus, BackupStrategy } from '../types';
import { auditGlobalScaling, generateArchitectureReport } from '../services/geminiService';

interface SystemArchitectureProps {
  lang: Language;
}

const SystemArchitecture: React.FC<SystemArchitectureProps> = ({ lang }) => {
  const [nodes, setNodes] = useState<DatabaseNode[]>([
    { id: 'rel-core-01', location: 'Dubai, UAE', region: Region.GULF, type: DatabaseType.RELATIONAL, dbEngine: 'PostgreSQL (Aurora)', status: 'Online', latency: 8, uptime: '99.999%', load: 38, throughput: '4.8 GB/s', shardingActive: true, rlsStatus: 'Enforced', i18nSupport: true },
    { id: 'auth-sec-01', location: 'Frankfurt, DE', region: Region.EUROPE, type: DatabaseType.AUTH_SERVICE, dbEngine: 'Auth0 / Keycloak DB', status: 'Online', latency: 15, uptime: '99.999%', load: 12, throughput: '1.2 GB/s', shardingActive: false, rlsStatus: 'Enforced', i18nSupport: true },
    { id: 'vec-pine-02', location: 'US-East (Pinecone)', region: Region.AMERICA, type: DatabaseType.VECTOR_DB, dbEngine: 'Pinecone Vector DB', status: 'Online', latency: 42, uptime: '99.99%', load: 45, throughput: '22.1 GB/s', shardingActive: false, rlsStatus: 'Enforced', i18nSupport: true },
    { id: 'msg-bus-03', location: 'Riyadh, KSA', region: Region.GULF, type: DatabaseType.MESSAGING_BUS, dbEngine: 'Redis / Kafka Bus', status: 'Online', latency: 5, uptime: '99.99%', load: 28, throughput: '35.4 GB/s', shardingActive: true, rlsStatus: 'Disabled', i18nSupport: true },
    { id: 'pref-voice-01', location: 'Singapore', region: Region.ASIA, type: DatabaseType.VOICE_PREFS, dbEngine: 'Redis (Cache)', status: 'Online', latency: 45, uptime: '99.99%', load: 5, throughput: '0.5 GB/s', shardingActive: false, rlsStatus: 'Enforced', i18nSupport: true },
  ]);

  const [tables] = useState<RelationalTableStatus[]>([
    { name: 'dg_users_auth', rowCount: 12450000, status: 'Healthy', lastVacuum: '2024-05-21 02:00', integrityScore: 99.9, rbacLevel: 'Level 5 (Isolated)', i18nCompliant: true },
    { name: 'dg_voice_preferences', rowCount: 8500000, status: 'Healthy', lastVacuum: '2024-05-21 04:00', integrityScore: 100, rbacLevel: 'Level 2', i18nCompliant: true },
    { name: 'dg_chat_history', rowCount: 45000000, status: 'Healthy', lastVacuum: '2024-05-21 04:30', integrityScore: 99.7, rbacLevel: 'Level 4', i18nCompliant: true },
    { name: 'dg_localized_content', rowCount: 12000000, status: 'Healthy', lastVacuum: '2024-05-21 01:00', integrityScore: 99.8, rbacLevel: 'Level 3', i18nCompliant: true },
  ]);

  const [backupStrategy] = useState<BackupStrategy>({
    dailyFull: { status: 'Success', lastRun: new Date(Date.now() - 86400000), size: '14.2 TB' },
    hourlyIncremental: { status: 'Active', nextPulse: 42, lastPulse: new Date(Date.now() - 1800000) },
    externalEncryption: { provider: 'AWS KMS / Azure Key Vault', status: 'Encrypted', keyRotation: '30 Days' },
    restorationTest: { lastTest: new Date(Date.now() - 172800000), result: 'Pass', score: 99.98 }
  });

  const [syncStatus] = useState<DataSyncStatus>({
    lastSync: new Date(),
    consistencyScore: 99.94,
    activeTransactions: 128400,
    globalPropagationTime: '0.2s',
    hybridSyncActive: true,
    failoverStatus: 'Standby'
  });

  const [archReport, setArchReport] = useState<string | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);

  const t = {
    en: {
      title: 'Decoupled Enterprise Infrastructure',
      subtitle: 'Global architecture supporting 100M users via isolated services.',
      scalingTitle: 'Global Scalability Audit',
      tablesTitle: 'Decoupled Data Segments',
      voicePrefs: 'User Voice & UI Preferences',
      strategyAudit: 'Generate Architecture Report'
    },
    ar: {
      title: 'البنية التحتية للمؤسسات',
      subtitle: 'هندسة عالمية تدعم 100 مليون مستخدم عبر خدمات معزولة.',
      scalingTitle: 'تدقيق التوسع العالمي',
      tablesTitle: 'قطاعات البيانات المنفصلة',
      voicePrefs: 'تفضيلات الصوت والواجهة للمستخدم',
      strategyAudit: 'توليد تقرير الهندسة المعمارية'
    }
  }[lang];

  const runStrategyAudit = async () => {
    setIsAuditing(true);
    const report = await generateArchitectureReport(lang);
    setArchReport(report);
    setIsAuditing(false);
  };

  return (
    <div className="space-y-16 animate-in fade-in duration-1000 pb-20">
      <section className="bg-slate-950 rounded-[4rem] p-12 text-white relative overflow-hidden shadow-2xl border border-white/5">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[150px]"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-black tracking-tighter mb-4 leading-tight">{t.title}</h1>
            <p className="text-slate-400 text-lg font-bold opacity-80 mb-8 max-w-lg leading-relaxed">{t.subtitle}</p>
            <button onClick={runStrategyAudit} disabled={isAuditing} className="px-10 py-5 bg-white text-slate-950 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-2xl flex items-center gap-3">
               {isAuditing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <ClipboardList className="w-5 h-5" />}
               {t.strategyAudit}
            </button>
          </div>
        </div>
      </section>

      <section className="space-y-10">
         <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter flex items-center gap-4">
            <DatabaseZap className="w-10 h-10 text-indigo-600" /> {t.tablesTitle}
         </h2>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {tables.map(table => (
               <div key={table.name} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-white/5 shadow-sm group">
                  <div className="flex justify-between items-start mb-6">
                     <div className="w-12 h-12 bg-slate-50 dark:bg-white/5 rounded-xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                        {table.name.includes('voice') ? <Mic className="w-6 h-6" /> : <Table className="w-6 h-6" />}
                     </div>
                     <div className="px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 rounded-full text-[8px] font-black uppercase tracking-widest">{table.status}</div>
                  </div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white mb-1">{table.name}</h3>
                  <div className="text-2xl font-black text-indigo-600 mb-6">{table.rowCount.toLocaleString()} <span className="text-[10px] text-slate-400 uppercase font-black">Entries</span></div>
               </div>
            ))}
         </div>
      </section>

      <section className="space-y-10">
         <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter flex items-center gap-4">
            <Globe2 className="w-10 h-10 text-indigo-600" /> Infrastructure Nodes
         </h2>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
           {nodes.map(node => (
             <div key={node.id} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-white/5 shadow-sm group transition-all">
                <div className="flex justify-between items-start mb-8">
                   <div className="w-12 h-12 bg-slate-50 dark:bg-white/5 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all">
                      {node.type === DatabaseType.VOICE_PREFS ? <Mic className="w-6 h-6" /> : <Database className="w-6 h-6" />}
                   </div>
                   <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${node.status === 'Online' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>{node.status}</div>
                </div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white mb-1">{node.type}</h3>
                <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-2">{node.dbEngine}</p>
             </div>
           ))}
         </div>
      </section>
    </div>
  );
};

export default SystemArchitecture;
