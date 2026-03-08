
import React, { useState, useEffect } from 'react';
import { 
  CreditCard, ShieldCheck, Zap, Activity, RefreshCw, 
  Terminal, Database, Radio, Binary, Sparkles, 
  CheckCircle2, AlertTriangle, ArrowRight, History,
  Lock, Network, Workflow, Table, Server
} from 'lucide-react';
import { FinancialTransaction, EventBusStatus, Language } from '../types';
import { auditFinancialSystem } from '../services/geminiService';

interface FinancialCoreProps {
  lang: Language;
}

const FinancialCore: React.FC<FinancialCoreProps> = ({ lang }) => {
  const [transactions] = useState<FinancialTransaction[]>([
    { id: 'txn_001', type: 'Payment', amount: 4500, currency: 'USD', status: 'Committed', acidVerified: true, timestamp: new Date(), traceId: '8f2a-9e11' },
    { id: 'txn_002', type: 'Commission', amount: 225, currency: 'USD', status: 'Committed', acidVerified: true, timestamp: new Date(Date.now() - 5000), traceId: '1a2b-3c4d' },
    { id: 'txn_003', type: 'Subscription', amount: 49, currency: 'USD', status: 'Pending', acidVerified: false, timestamp: new Date(Date.now() - 15000), traceId: '9z8y-7x6w' }
  ]);

  const [eventBus] = useState<EventBusStatus>({
    broker: 'Kafka',
    throughput: '125k msgs/sec',
    activeConsumers: 42,
    lag: 12,
    health: 'Optimal'
  });

  const [aiAudit, setAiAudit] = useState<any>(null);
  const [isAuditing, setIsAuditing] = useState(false);

  const t = {
    en: {
      title: 'Financial Core & ACID Integrity',
      subtitle: 'Immutable architectural ledger with real-time ACID compliance auditing.',
      acidTitle: 'ACID Property Status',
      eventBusTitle: 'Event-Driven Infrastructure',
      auditBtn: 'Run Neural ACID Audit',
      transactions: 'Committed Transactions',
      broker: 'Message Broker (Kafka)',
      throughput: 'Bus Throughput',
      lag: 'Consumer Lag',
      health: 'Event Mesh Health',
      reportTitle: 'Architectural Addition Report',
      apiLayer: 'Isolated API Layer Status',
      acidAtomicity: 'Atomicity (All-or-Nothing)',
      acidConsistency: 'Consistency (Constraint Validation)',
      acidIsolation: 'Isolation (Concurrent Sync)',
      acidDurability: 'Durability (Persistence)'
    },
    ar: {
      title: 'النواة المالية ونزاهة ACID',
      subtitle: 'دفتر أستاذ معماري غير قابل للتغيير مع تدقيق فوري للامتثال لـ ACID.',
      acidTitle: 'حالة خصائص ACID',
      eventBusTitle: 'البنية التحتية القائمة على الأحداث',
      auditBtn: 'إجراء تدقيق ACID العصبي',
      transactions: 'المعاملات المؤكدة',
      broker: 'وسيط الرسائل (Kafka)',
      throughput: 'إنتاجية الحافلة (Bus)',
      lag: 'تأخر المستهلك (Lag)',
      health: 'صحة شبكة الأحداث',
      reportTitle: 'تقرير الإضافة المعمارية',
      apiLayer: 'حالة طبقة API المعزولة',
      acidAtomicity: 'الذرية (الكل أو لا شيء)',
      acidConsistency: 'الاتساق (التحقق من القيود)',
      acidIsolation: 'العزل (المزامنة المتزامنة)',
      acidDurability: 'المتانة (الاستمرارية)'
    }
  }[lang];

  const handleRunAudit = async () => {
    setIsAuditing(true);
    const logs = JSON.stringify({ transactions, eventBus });
    const result = await auditFinancialSystem(logs, lang);
    setAiAudit(result);
    setIsAuditing(false);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      <section className="bg-slate-950 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl border border-white/5">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-600/10 blur-[150px]"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-600/40">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.4em]">ACID Compliant Transaction Engine</span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter mb-4 leading-tight">{t.title}</h1>
            <p className="text-slate-400 text-lg font-bold opacity-80 mb-8 max-w-lg leading-relaxed">{t.subtitle}</p>
            <button onClick={handleRunAudit} disabled={isAuditing} className="px-10 py-5 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-2xl flex items-center gap-3 disabled:opacity-50">
               {isAuditing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
               {t.auditBtn}
            </button>
          </div>
          <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 text-center w-full md:w-80">
             <h4 className="text-[10px] font-black uppercase text-emerald-400 mb-4 tracking-widest">Transaction Safety Score</h4>
             <div className="text-5xl font-black">99.9%</div>
             <p className="text-[8px] text-slate-500 uppercase font-black mt-2">Zero Data Loss Protocol</p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
           {/* Event-driven Architecture Monitoring */}
           <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-slate-100 dark:border-white/5 shadow-sm">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10 pb-8 border-b border-slate-50 dark:border-white/5">
                 <h2 className="text-2xl font-black tracking-tighter flex items-center gap-4">
                    <Workflow className="w-10 h-10 text-indigo-600" /> {t.eventBusTitle}
                 </h2>
                 <div className="px-4 py-2 bg-indigo-50 dark:bg-indigo-600/10 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                    Broker: {eventBus.broker} Cluster
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-2xl border border-white dark:border-white/5">
                    <Radio className="w-5 h-5 text-indigo-600 mb-4" />
                    <h4 className="text-[10px] font-black text-slate-400 uppercase mb-1">{t.throughput}</h4>
                    <p className="text-xl font-black text-slate-900 dark:text-white">{eventBus.throughput}</p>
                 </div>
                 <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-2xl border border-white dark:border-white/5">
                    <Activity className="w-5 h-5 text-amber-500 mb-4" />
                    <h4 className="text-[10px] font-black text-slate-400 uppercase mb-1">{t.lag}</h4>
                    <p className="text-xl font-black text-slate-900 dark:text-white">{eventBus.lag}ms</p>
                 </div>
                 <div className="p-6 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl border border-emerald-100 dark:border-emerald-500/20">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 mb-4" />
                    <h4 className="text-[10px] font-black text-emerald-600 uppercase mb-1">{t.health}</h4>
                    <p className="text-xl font-black text-emerald-600">{eventBus.health}</p>
                 </div>
              </div>
           </div>

           {/* Financial Transactions List */}
           <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-slate-100 dark:border-white/5 shadow-sm">
              <h3 className="text-2xl font-black tracking-tighter mb-10 flex items-center gap-4">
                 <History className="w-8 h-8 text-emerald-500" /> {t.transactions}
              </h3>
              <div className="space-y-4">
                 {transactions.map(txn => (
                   <div key={txn.id} className="flex items-center justify-between p-6 bg-slate-50 dark:bg-white/5 rounded-2xl group transition-all">
                      <div className="flex items-center gap-6">
                         <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${txn.status === 'Committed' ? 'bg-emerald-500' : 'bg-amber-500'}`}>
                            <CreditCard className="w-6 h-6" />
                         </div>
                         <div>
                            <h4 className="text-sm font-black text-slate-900 dark:text-white">{txn.type} #{txn.traceId}</h4>
                            <p className="text-[9px] text-slate-400 uppercase font-black mt-1">Status: {txn.status} • Trace: {txn.id}</p>
                         </div>
                      </div>
                      <div className="text-right">
                         <div className="text-lg font-black text-slate-900 dark:text-white">${txn.amount.toLocaleString()}</div>
                         <div className="flex items-center justify-end gap-1.5 mt-1">
                            {txn.acidVerified ? <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> : <RefreshCw className="w-3.5 h-3.5 text-amber-500 animate-spin" />}
                            <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">{txn.acidVerified ? 'ACID Verified' : 'Verifying...'}</span>
                         </div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        <div className="space-y-8">
           {/* ACID Compliance Scorecard */}
           <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-white/5 shadow-sm">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8 flex items-center gap-3">
                 <Table className="w-5 h-5 text-emerald-600" /> {t.acidTitle}
              </h3>
              <div className="space-y-6">
                 {[
                   { label: t.acidAtomicity, score: 100 },
                   { label: t.acidConsistency, score: 99.8 },
                   { label: t.acidIsolation, score: 99.4 },
                   { label: t.acidDurability, score: 100 }
                 ].map((prop, i) => (
                   <div key={i} className="space-y-3">
                      <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                         <span className="text-slate-600 dark:text-slate-400">{prop.label}</span>
                         <span className="text-emerald-500">{prop.score}%</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-white/5 h-1.5 rounded-full overflow-hidden">
                         <div className="bg-emerald-500 h-full" style={{ width: `${prop.score}%` }}></div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           {/* Isolated API Layer Alert */}
           <div className="bg-slate-950 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-600/10 blur-3xl"></div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-8 flex items-center gap-3">
                <Network className="w-5 h-5" /> {t.apiLayer}
              </h3>
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-4">
                 <Server className="w-6 h-6 text-emerald-400" />
                 <div>
                    <p className="text-[10px] font-black uppercase text-white">Gateway: Isolated</p>
                    <p className="text-[8px] text-emerald-400 uppercase tracking-widest">No Direct DB Access</p>
                 </div>
              </div>
              <p className="text-[9px] font-bold text-slate-500 mt-6 leading-relaxed uppercase">
                 The API layer communicates strictly via the Event Bus and authenticated service boundaries, ensuring total database isolation.
              </p>
           </div>
           
           {/* Architectural Report Section */}
           {aiAudit && (
             <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-white/5 text-white animate-in zoom-in-95 duration-500">
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-indigo-400 mb-6 flex items-center gap-3">
                   <Terminal className="w-5 h-5" /> {t.reportTitle}
                </h3>
                <div className="space-y-4">
                   <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                      <p className="text-xs font-bold leading-relaxed">{aiAudit.summary}</p>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-white/5 rounded-xl">
                         <div className="text-xl font-black">{aiAudit.acidComplianceScore}%</div>
                         <div className="text-[8px] uppercase font-black text-slate-500">ACID Score</div>
                      </div>
                      <div className="text-center p-3 bg-white/5 rounded-xl">
                         <div className="text-xl font-black">{aiAudit.eventBusHealth}%</div>
                         <div className="text-[8px] uppercase font-black text-slate-500">Bus Health</div>
                      </div>
                   </div>
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default FinancialCore;
