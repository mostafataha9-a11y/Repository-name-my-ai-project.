
import React, { useState, useEffect } from 'react';
import { 
  Menu, X, Globe, User, Search, Home, LayoutDashboard, 
  MessageSquare, Briefcase, Bell, Sparkles, Moon, Sun, 
  Award, ShieldCheck, Landmark, Zap, Activity, MapPin, 
  Globe2, Eye, EyeOff, Monitor, Database, Rocket, BarChart3,
  CreditCard, CheckCircle, FileText, Microscope
} from 'lucide-react';
import { Language } from '../types';
import SmartSearchOverlay from './SmartSearchOverlay';

interface LayoutProps {
  children: React.ReactNode;
  lang: Language;
  setLang: (l: Language) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, lang, setLang, activeTab, setActiveTab }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || 
           (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const t = {
    en: {
      home: 'Overview',
      dashboard: 'My Panel',
      projects: 'Showcase',
      community: 'Hub',
      standards: 'Global Standards',
      arReport: 'AR Report',
      innovation: 'Innovation Hub',
      financial: 'Financial Core',
      monitoring: 'Performance',
      architecture: 'Infrastructure',
      security: 'Security',
      notifications: 'Notifications',
      focusMode: 'Focus Mode',
      exitFocus: 'Exit Focus',
      langToggle: 'Switch to Arabic',
      themeToggle: 'Toggle Theme',
      searchLabel: 'Open Global Search'
    },
    ar: {
      home: 'نظرة عامة',
      dashboard: 'لوحة التحكم',
      projects: 'المعرض',
      community: 'المجتمع',
      standards: 'المعايير العالمية',
      arReport: 'تقرير AR',
      innovation: 'قسم الابتكار',
      financial: 'النواة المالية',
      monitoring: 'الأداء والمراقبة',
      architecture: 'البنية التحتية',
      security: 'الأمان',
      notifications: 'الإشعارات',
      focusMode: 'وضع التركيز',
      exitFocus: 'إلغاء وضع التركيز',
      langToggle: 'التحويل للإنجليزية',
      themeToggle: 'تغيير المظهر',
      searchLabel: 'فتح البحث العالمي'
    }
  }[lang];

  const menuItems = [
    { id: 'home', label: t.home, icon: Home },
    { id: 'dashboard', label: t.dashboard, icon: LayoutDashboard },
    { id: 'projects', label: t.projects, icon: Briefcase },
    { id: 'innovation', label: t.innovation, icon: Rocket },
    { id: 'arReport', label: t.arReport, icon: Microscope },
    { id: 'financial', label: t.financial, icon: CreditCard },
    { id: 'monitoring', label: t.monitoring, icon: Activity },
    { id: 'standards', label: t.standards, icon: ShieldCheck },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} ${lang === 'ar' ? 'rtl' : 'ltr'}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      
      <SmartSearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} lang={lang} />

      {!isFocusMode && (
        <header role="banner" className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? 'glass-panel shadow-2xl py-2' : 'bg-transparent py-4'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-14">
              <div className="flex items-center gap-10">
                <button 
                  onClick={() => setActiveTab('home')} 
                  aria-label="DecorGlobal Home" 
                  className="flex items-center gap-3 group focus-visible:ring-offset-4"
                >
                  <div className="w-11 h-11 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl group-hover:scale-105 transition-transform">D</div>
                  <span className="hidden lg:block text-2xl font-black tracking-tighter">DecorGlobal</span>
                </button>

                <nav role="navigation" aria-label="Main Navigation" className="hidden md:flex items-center gap-1 p-1.5 rounded-2xl bg-slate-100/50 dark:bg-white/5">
                  {menuItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      aria-current={activeTab === item.id ? 'page' : undefined}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] font-black transition-all whitespace-nowrap ${
                        activeTab === item.id 
                          ? 'bg-indigo-600 text-white shadow-lg' 
                          : 'text-slate-500 hover:text-indigo-600 dark:hover:text-white'
                      }`}
                    >
                      <item.icon className="w-4 h-4" aria-hidden="true" />
                      {item.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsSearchOpen(true)} 
                  aria-label={t.searchLabel} 
                  className="w-10 h-10 flex items-center justify-center rounded-2xl hover:bg-indigo-50 dark:hover:bg-white/5 transition-all"
                >
                  <Search className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setIsNotificationsOpen(true)} 
                  aria-label={t.notifications} 
                  className="w-10 h-10 flex items-center justify-center rounded-2xl hover:bg-indigo-50 dark:hover:bg-white/5 transition-all"
                >
                  <Bell className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setLang(lang === 'en' ? 'ar' : 'en')} 
                  aria-label={t.langToggle} 
                  className="w-10 h-10 flex items-center justify-center rounded-2xl hover:bg-indigo-50 dark:hover:bg-white/5 transition-all"
                >
                  <Globe className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setIsDarkMode(!isDarkMode)} 
                  aria-label={t.themeToggle} 
                  className="w-10 h-10 flex items-center justify-center rounded-2xl hover:bg-indigo-50 dark:hover:bg-white/5 transition-all"
                >
                  {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </header>
      )}

      <main role="main" id="main-content" className={`${isFocusMode ? 'pt-8' : 'pt-28'} max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 outline-none`}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
