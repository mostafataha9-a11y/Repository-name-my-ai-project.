import React, { useState, useEffect } from 'react';
import { Activity, BarChart3, Clock, AlertTriangle, ShieldCheck, Terminal, RefreshCw, Zap, Server, Database, Search, Cpu, LayoutGrid, ListTree, BugPlay, Radio, Bell, Info, Trash2, Filter, Settings, FileSearch, Sparkles, Network, ListChecks, PlayCircle } from 'lucide-react';
import { Language, QueryLog, SystemAlert, TaskQueueItem } from '../types';
import { auditMonitoringSystem } from '../services/geminiService';

// Added interface to prevent 'unknown' types when accessing AI audit results
interface AiAuditResult {
  systemHealthScore: number;
  serviceHealth: Record<string, number>;
  criticalBottlenecks: string[];
  optimizationPlan: string[];
}

interface MonitoringDashboardProps {
  lang: Language;
}

const MonitoringDashboard: React.FC<MonitoringDashboardProps> = ({ lang }) => {
  const [activeQueries, setActiveQueries] = useState<QueryLog[]>([
    { id: 'q1', query: 'SELECT * FROM dg_users_auth WHERE status = "active"', duration: 12, timestamp: new Date(), database: 'Auth-Service', severity: 'normal', impact: 'Low' },
    { id: 'q2', query: 'VECTOR_SEARCH(project_embeddings, {v: [0.1, ...]})', duration: 420, timestamp: new Date(Date.now() - 5000), database: 'Pinecone-Vector', severity: 'slow', impact: 'Medium' },
    { id: 'q3', query: 'PUSH_MSG {to: "user_42", body: "New Quote"}', duration: 5, timestamp: new Date(Date.now() - 15000), database: 'Messaging-Service', severity: 'normal', impact: 'Low' },
  ]);

  const [taskQueue, setTaskQueue] = useState<TaskQueueItem[]>([
    { id: 't1', taskName: '3D Room Rendering', status: 'Processing', priority: 'High', startTime: new Date(), progress: 65, serviceId: 'render-node-01' },
    { id: 't2', taskName: 'PDF Report Generation', status: 'Pending', priority: 'Medium', startTime: new Date(), progress: 0, serviceId: 'worker-node-04' },
    { id: 't3', taskName: 'Vector Embedding Re-index', status: 'Completed', priority: 'Critical', startTime: new Date(Date.now() - 3600000), progress: 100, serviceId: 'search-node-02' }
  ]);

  const [alerts, setAlerts] = useState<SystemAlert[]>([
    { id: 'a1', title: 'Auth-DB Replication Lag', type: 'warning', timestamp: new Date(), message: 'Isolated Auth DB lag detected between Frankfurt and Riyadh.', resolved: false },
    { id: 'a2', title: 'Messaging Cluster High Load', type: 'critical', timestamp: new Date(Date.now() - 600000), message: 'Chat microservice is approaching 85% CPU capacity.', resolved: false },
  ]);

  // Using specific interface instead of any to resolve unknown node rendering issues
  const [aiAudit, setAiAudit] = useState<AiAuditResult | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);

  const t = {
    en: {
      title: 'Decoupled Service Monitoring',
      subtitle: 'Real-time tracking of Auth, Messaging, Search, and Task Queue engines.',
      statsTraffic: 'Auth Requests',
      statsLatency: 'Msg Delivery',
      statsErrors: 'Queue Errors',
      performanceTab: 'Decoupled Queries',
      queueTab: 'Operation Queue',
      aiAudit: 'Decoupled Service Audit',
      auditBtn: 'Audit Scale Readiness',
      queueTitle: 'Live Task Queue Stream',
      serviceId: 'Worker Node',
      progress: 'Progress'
    },
    ar: {
      title: 'مراقبة الخدمات المنفصلة',
      subtitle: 'تتبع فوري لمحركات الهوية، المحادثات، البحث، وطوابير العمليات.',
      statsTraffic: 'طلبات الهوية',
      statsLatency: 'توصيل الرسائل',
      statsErrors: 'أخطاء الطوابير',
      performanceTab: 'الاستعلامات المنفصلة',
      queueTab: 'طابور العمليات',
      aiAudit: 'تدقيق الخدمات المنفصلة',
      auditBtn: 'تدقيق جاهزية التوسع',
      queueTitle: 'بث طابور العمليات المباشر',
      serviceId: 'نقطة المعالجة',
      progress: 'التقدم'
    }
  }[lang];

  const handleAiAudit = async () => {
    setIsAuditing(true);
    const logs = JSON.stringify({ queries: activeQueries, queue: taskQueue });
    const result = await auditMonitoringSystem(logs, lang);
    setAiAudit(result);
    setIsAuditing(false);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      <section className="bg-slate-950 rounded-[4rem] p-12 text-white relative overflow-hidden shadow-2xl border border-white/5">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[150px]"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-600/40">
                <ListChecks className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">Scaling Factor: 100M Readiness</span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter mb-4 leading-tight">{t.title}</h1>
            <p className="text-slate-400 text-lg font-bold opacity-80 mb-8 max-w-lg leading-relaxed">{t.subtitle}</p>
            <button onClick={handleAiAudit} disabled={isAuditing} className="px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-2xl flex items-center gap-3 disabled:opacity-50">
               {isAuditing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
               {t.auditBtn}
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-6 w-full md:w-96">
             {[
               { label: t.statsTraffic, value: '84k', unit: 'req/m', icon: ShieldCheck },
               { label: t.statsLatency, value: '2.4', unit: 'ms', icon: Clock },
               { label: t.statsErrors, value: '0.001', unit: '%', icon: AlertTriangle }
             ].map((stat, i) => (
               <div key={i} className={`bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10 ${i === 0 ? 'col-span-2' : ''}`}>
                  <div className="flex items-center gap-3 mb-4">
                     <stat.icon className="w-4 h-4 text-indigo-400" />
                     <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">{stat.label}</span>
                  </div>
                  <div className="text-3xl font-black">{stat.value} <span className="text-[10px] text-indigo-400">{stat.unit}</span></div>
               </div>
             ))}
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
           {/* Task Queue Section */}
           <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10 border-b border-slate-50 pb-8">
                 <h3 className="text-2xl font-black tracking-tighter flex items-center gap-4">
                    <PlayCircle className="w-8 h-8 text-emerald-500" /> {t.queueTitle}
                 </h3>
                 <div className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                    Queue Strategy: LIFO / Priority
                 </div>
              </div>

              <div className="space-y-4 overflow-x-auto no-scrollbar">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                          <th className="pb-4">Task Name</th>
                          <th className="pb-4">Status</th>
                          <th className="pb-4 text-center">{t.progress}</th>
                          <th className="pb-4 text-right">{t.serviceId}</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                       {taskQueue.map((task) => (
                         <tr key={task.id} className="group hover:bg-slate-50 transition-colors">
                            <td className="py-5">
                               <div className="flex items-center gap-3">
                                  <div className={`w-2 h-2 rounded-full ${task.priority === 'Critical' ? 'bg-red-500' : 'bg-indigo-500'}`}></div>
                                  <span className="text-xs font-black text-slate-900">{task.taskName}</span>
                               </div>
                            </td>
                            <td className="py-5">
                               <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase ${task.status === 'Processing' ? 'bg-amber-50 text-amber-600' : task.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-500'}`}>
                                  {task.status}
                               </span>
                            </td>
                            <td className="py-5 text-center">
                               <div className="w-24 bg-slate-100 h-1.5 rounded-full mx-auto overflow-hidden">
                                  <div className="bg-indigo-600 h-full" style={{ width: `${task.progress}%` }}></div>
                               </div>
                            </td>
                            <td className="py-5 text-right">
                               <span className="text-[10px] font-mono text-slate-500">{task.serviceId}</span>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>

           {aiAudit && (
             <div className="bg-slate-950 rounded-[3rem] p-12 text-white shadow-2xl animate-in slide-in-from-bottom-8 duration-500">
                <div className="flex items-center justify-between mb-10">
                   <h3 className="text-2xl font-black tracking-tighter flex items-center gap-4">
                      <Sparkles className="w-8 h-8 text-indigo-400" /> {t.aiAudit}
                   </h3>
                   <div className="text-3xl font-black text-indigo-400">{aiAudit.systemHealthScore}% <span className="text-[10px] uppercase font-black text-slate-500">Global Score</span></div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                   {Object.entries(aiAudit.serviceHealth || {}).map(([service, score]) => (
                     <div key={service} className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                        <div className="text-xl font-black">{score}%</div>
                        <div className="text-[8px] font-black uppercase tracking-widest">{service}</div>
                     </div>
                   ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   <div className="space-y-6">
                      <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Scale Bottlenecks</h4>
                      <div className="space-y-3">
                         {/* Explicitly cast to string to resolve unknown type issues during rendering */}
                         {(aiAudit.criticalBottlenecks || []).map((item, i) => (
                           <div key={i} className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                              <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                              <p className="text-xs font-bold text-slate-300 leading-relaxed">{(item as string)}</p>
                           </div>
                         ))}
                      </div>
                   </div>
                   <div className="space-y-6">
                      <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Infrastructure Plan</h4>
                      <div className="space-y-3">
                         {/* Explicitly cast to string to resolve unknown type issues during rendering */}
                         {(aiAudit.optimizationPlan || []).map((item, i) => (
                           <div key={i} className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                              <Zap className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                              <p className="text-xs font-bold text-slate-300 leading-relaxed">{(item as string)}</p>
                           </div>
                         ))}
                      </div>
                   </div>
                </div>
             </div>
           )}
        </div>

        <div className="space-y-8">
           <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
              <h3 className="text-lg font-black text-slate-900 tracking-tighter mb-8 flex items-center gap-3">
                 <Bell className="w-6 h-6 text-indigo-600" /> Decoupled Alerts
              </h3>
              <div className="space-y-4">
                 {alerts.map(alert => (
                   <div key={alert.id} className={`p-5 rounded-2xl border ${alert.type === 'critical' ? 'bg-red-50 border-red-100' : 'bg-amber-50 border-amber-100'}`}>
                      <h4 className={`text-[11px] font-black uppercase tracking-tight ${alert.type === 'critical' ? 'text-red-700' : 'text-amber-700'}`}>{alert.title}</h4>
                      <p className="text-[10px] font-bold text-slate-600 leading-relaxed mt-2">{alert.message}</p>
                   </div>
                 ))}
              </div>
           </div>

           <div className="bg-slate-950 rounded-[2.5rem] p-8 text-white shadow-2xl">
              <h3 className="text-sm font-black uppercase tracking-[0.3em] text-indigo-400 mb-8 flex items-center gap-3">
                <Network className="w-5 h-5" /> Decoupled Mesh
              </h3>
              <div className="space-y-4">
                 {[
                   { name: 'Auth Gateway', status: 'Healthy' },
                   { name: 'Messaging Node', status: 'High Load' },
                   { name: 'Vector Search', status: 'Optimizing' },
                   { name: 'Queue Stream', status: 'Healthy' }
                 ].map((svc, i) => (
                   <div key={i} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl">
                      <span className="text-[10px] font-black uppercase tracking-tight">{svc.name}</span>
                      <span className={`text-[8px] font-black px-2 py-0.5 rounded ${svc.status === 'Healthy' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>{svc.status}</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default MonitoringDashboard;