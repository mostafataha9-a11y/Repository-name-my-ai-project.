
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Home from './views/Home';
import Projects from './views/Projects';
import Community from './views/Community';
import ArticleEditor from './components/ArticleEditor';
import AIExpertBot from './components/AIExpertBot';
import MembershipCenter from './components/MembershipCenter';
import SecurityHub from './components/SecurityHub';
import MonitoringDashboard from './views/MonitoringDashboard';
import MonetizationHub from './views/MonetizationHub';
import Dashboard from './views/Dashboard';
import LocalSEOView from './views/LocalSEOView';
import GlobalExpansionView from './views/GlobalExpansionView';
import SystemArchitecture from './views/SystemArchitecture';
import InnovationHub from './views/InnovationHub';
import FinancialCore from './views/FinancialCore';
import TechnicalReport from './views/TechnicalReport';
import ARReport from './views/ARReport';
import UnifiedVoiceControl from './components/UnifiedVoiceControl';
import { Language } from './types';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language | null>(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('user-language');
      if (savedLang === 'ar' || savedLang === 'en') return savedLang as Language;
    }
    return null;
  });
  const [activeTab, setActiveTab] = useState('home');
  const [innovationSubTab, setInnovationSubTab] = useState<'ai' | 'arvr' | 'psychology' | 'jobs' | 'api'>('ai');

  useEffect(() => {
    if (!lang) {
      const browserLang = navigator.language.split('-')[0];
      const initialLang = browserLang === 'ar' ? 'ar' : 'en';
      setLang(initialLang);
      localStorage.setItem('user-language', initialLang);
    }
  }, [lang]);

  useEffect(() => {
    if (lang) {
      localStorage.setItem('user-language', lang);
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = lang;
      // Simulate cloud sync
      console.log(`Syncing language preference (${lang}) to cloud...`);
    }
  }, [lang]);

  if (!lang) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-400 font-black uppercase tracking-widest animate-pulse">Initializing Language Engine...</p>
        </div>
      </div>
    );
  }

  const navigateToAR = () => {
    setInnovationSubTab('arvr');
    setActiveTab('innovation');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Home lang={lang} onNavigateToAR={navigateToAR} />;
      case 'dashboard':
        return <Dashboard lang={lang} />;
      case 'editor':
        return <ArticleEditor lang={lang} />;
      case 'projects':
        return <Projects lang={lang} />;
      case 'community':
        return <Community lang={lang} />;
      case 'innovation':
        return <InnovationHub lang={lang} initialSubTab={innovationSubTab} />;
      case 'monitoring':
        return <MonitoringDashboard lang={lang} />;
      case 'membership':
        return <MembershipCenter lang={lang} />;
      case 'security':
        return <SecurityHub lang={lang} />;
      case 'business':
        return <MonetizationHub lang={lang} />;
      case 'global':
        return <GlobalExpansionView lang={lang} />;
      case 'localSeo':
        return <LocalSEOView lang={lang} />;
      case 'architecture':
        return <SystemArchitecture lang={lang} />;
      case 'financial':
        return <FinancialCore lang={lang} />;
      case 'standards':
        return <TechnicalReport lang={lang} />;
      case 'arReport':
        return <ARReport lang={lang} />;
      default:
        return <Home lang={lang} onNavigateToAR={navigateToAR} />;
    }
  };

  return (
    <Layout 
      lang={lang} 
      setLang={setLang} 
      activeTab={activeTab} 
      setActiveTab={setActiveTab}
    >
      <div className="animate-in fade-in duration-500">
        {renderContent()}
      </div>
      
      <AIExpertBot lang={lang} />
      
      <UnifiedVoiceControl 
        lang={lang} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />
    </Layout>
  );
};

export default App;
