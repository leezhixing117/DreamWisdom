/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { User, BookBrainItem, EngineSettings, DreamEntry, AdVideoItem, TherapistItem, ProductItem, BannedRecord, normalizeRole, getRoleDisplayName } from './types';
import { INITIAL_USERS, INITIAL_BOOKS, INITIAL_SETTINGS, INITIAL_DREAMS, INITIAL_AD_VIDEOS } from './data';
import { INITIAL_THERAPISTS } from './data/therapists';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { HomeView } from './components/HomeView';
import { DreamWorkspace } from './components/DreamWorkspace';
import { AdminConsole } from './components/AdminConsole';
import { LoginModal } from './components/LoginModal';
import { StarVideoModal } from './components/StarVideoModal';
import { PricingView } from './components/PricingView';
import { PrivacyView } from './components/PrivacyView';
import { ProductStoreView } from './components/ProductStoreView';
import { StarCoinsView } from './components/StarCoinsView';
import { Footer } from './components/Footer';
import { INITIAL_PRODUCTS } from './data/products';
import { Sparkles, ShieldAlert, BookOpen, Star, Package, Tv } from 'lucide-react';
import { DreamAtmosphereController } from './components/DreamAtmosphereController';
import { trackLoginEvent } from './utils/auditLogger';

export default function App() {
  // Load or initialize state from localStorage
  const [currentView, setCurrentView] = useState<'home' | 'app' | 'pricing' | 'privacy' | 'store' | 'admin' | 'stars'>('home');
  const [activeSection, setActiveSection] = useState<'workspace' | 'dna' | 'constellation' | 'mystery' | 'history' | 'patterns'>('workspace');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isStarVideoOpen, setIsStarVideoOpen] = useState(false);
  const [prefilledDream, setPrefilledDream] = useState('');
  const [targetProductId, setTargetProductId] = useState<string | undefined>(undefined);

  // Full-screen Dream Atmosphere & Wallpaper state
  const [wallpaperOpacity, setWallpaperOpacity] = useState<number>(0.72);
  const [wallpaperBlur, setWallpaperBlur] = useState<number>(0);
  const [wallpaperTint, setWallpaperTint] = useState<'aurora' | 'twilight' | 'cyber' | 'deep'>('aurora');


  // Products catalog state
  const [products, setProducts] = useState<ProductItem[]>(() => {
    try {
      const saved = localStorage.getItem('dreamwisdom_products');
      if (saved) {
        const parsed: ProductItem[] = JSON.parse(saved);
        return parsed.map((p) => {
          if (!p.availabilityStatus) {
            const initialMatch = INITIAL_PRODUCTS.find((init) => init.id === p.id);
            if (initialMatch?.availabilityStatus) {
              return { ...p, availabilityStatus: initialMatch.availabilityStatus };
            }
            return {
              ...p,
              availabilityStatus: p.inStock === false
                ? '目前已售罄，正安排補貨，敬請稍候；補貨到貨後會通知您。'
                : '現貨供應',
            };
          }
          return p;
        });
      }
      return INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  // Advertisement & Sponsor Videos Catalog State
  const [adVideos, setAdVideos] = useState<AdVideoItem[]>(() => {
    try {
      const saved = localStorage.getItem('dreamwisdom_ad_videos');
      return saved ? JSON.parse(saved) : INITIAL_AD_VIDEOS;
    } catch {
      return INITIAL_AD_VIDEOS;
    }
  });

  // Therapist Directory state
  const [therapists, setTherapists] = useState<TherapistItem[]>(() => {
    try {
      const saved = localStorage.getItem('dreamwisdom_therapists');
      return saved ? JSON.parse(saved) : INITIAL_THERAPISTS;
    } catch {
      return INITIAL_THERAPISTS;
    }
  });

  // Persistent banned records blacklist
  const [bannedRecords, setBannedRecords] = useState<BannedRecord[]>(() => {
    try {
      const saved = localStorage.getItem('dreamwisdom_banned_records');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Persistent user state
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const savedDeleted = localStorage.getItem('dreamwisdom_deleted_user_ids');
      const deletedIds = new Set<string>(savedDeleted ? JSON.parse(savedDeleted) : []);

      const saved = localStorage.getItem('dreamwisdom_users');
      if (saved) {
        const parsed: User[] = JSON.parse(saved);
        const existingIds = new Set(parsed.map((u) => u.id));
        const merged: User[] = parsed
          .filter((u) => !deletedIds.has(u.id))
          .map((u) => ({
            ...u,
            password: u.password || 'Abc123',
          }));
        for (const initialU of INITIAL_USERS) {
          if (!existingIds.has(initialU.id) && !deletedIds.has(initialU.id)) {
            merged.push(initialU);
          }
        }
        return merged;
      }
      return INITIAL_USERS.filter((u) => !deletedIds.has(u.id));
    } catch {
      return INITIAL_USERS;
    }
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('dreamwisdom_current_user');
      if (saved) {
        const parsed: User = JSON.parse(saved);
        return {
          ...parsed,
          password: parsed.password || 'Abc123',
        };
      }
      return INITIAL_USERS[0]; // Default to super_admin (Mystic Blaza)
    } catch {
      return INITIAL_USERS[0];
    }
  });

  const normRole = currentUser ? normalizeRole(currentUser.role) : null;
  const isManagement = normRole === 'admin' || normRole === 'super_admin';

  const [books, setBooks] = useState<BookBrainItem[]>(() => {
    try {
      const saved = localStorage.getItem('dreamwisdom_books');
      return saved ? JSON.parse(saved) : INITIAL_BOOKS;
    } catch {
      return INITIAL_BOOKS;
    }
  });

  const [settings, setSettings] = useState<EngineSettings>(() => {
    try {
      const saved = localStorage.getItem('dreamwisdom_settings');
      return saved ? { ...INITIAL_SETTINGS, ...JSON.parse(saved) } : INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  const [history, setHistory] = useState<DreamEntry[]>(() => {
    try {
      const saved = localStorage.getItem('dreamwisdom_history');
      return saved ? JSON.parse(saved) : INITIAL_DREAMS;
    } catch {
      return INITIAL_DREAMS;
    }
  });

  // Load data from Backend PostgreSQL Database on mount
  useEffect(() => {
    async function loadDataFromDb() {
      try {
        const dreamsRes = await fetch('/api/dreams');
        if (dreamsRes.ok) {
          const dreamsData = await dreamsRes.json();
          if (Array.isArray(dreamsData.dreams) && dreamsData.dreams.length > 0) {
            setHistory(dreamsData.dreams);
          }
        }
      } catch (err) {
        console.warn('Could not fetch dreams from db, using local fallback', err);
      }

      try {
        const usersRes = await fetch('/api/users');
        if (usersRes.ok) {
          const usersData = await usersRes.json();
          if (Array.isArray(usersData.users) && usersData.users.length > 0) {
            setUsers(usersData.users);
          }
        }
      } catch (err) {
        console.warn('Could not fetch users from db', err);
      }

      try {
        const booksRes = await fetch('/api/books');
        if (booksRes.ok) {
          const booksData = await booksRes.json();
          if (Array.isArray(booksData.books) && booksData.books.length > 0) {
            setBooks(booksData.books);
          }
        }
      } catch (err) {
        console.warn('Could not fetch books from db', err);
      }

      try {
        const settingsRes = await fetch('/api/settings');
        if (settingsRes.ok) {
          const settingsData = await settingsRes.json();
          if (settingsData.settings) {
            setSettings((prev) => ({
              ...INITIAL_SETTINGS,
              ...prev,
              ...settingsData.settings,
            }));
          }
        }
      } catch (err) {
        console.warn('Could not fetch settings from db', err);
      }
    }

    loadDataFromDb();
  }, []);

  // Save changes to localStorage as offline safety
  useEffect(() => {
    localStorage.setItem('dreamwisdom_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('dreamwisdom_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('dreamwisdom_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('dreamwisdom_books', JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem('dreamwisdom_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('dreamwisdom_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('dreamwisdom_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('dreamwisdom_ad_videos', JSON.stringify(adVideos));
  }, [adVideos]);

  useEffect(() => {
    localStorage.setItem('dreamwisdom_therapists', JSON.stringify(therapists));
  }, [therapists]);

  // Apply URL anchor routing (e.g. #recorddream, #pricing, #privacy, #dna, etc.)
  const applyRouteFromHash = (hashStr: string) => {
    const raw = (hashStr || window.location.hash || '').replace(/^#/, '').toLowerCase().trim();
    if (!raw) return;

    if (raw === 'recorddream' || raw === 'record-dream' || raw === 'record' || raw === 'dream') {
      setCurrentView('app');
      setActiveSection('workspace');
      setTimeout(() => {
        const el = document.getElementById('recorddream') || document.getElementById('dream-input-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        else window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 80);
    } else if (raw === 'pricing' || raw === 'plan' || raw === 'plans') {
      setCurrentView('pricing');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (raw === 'privacy' || raw === 'terms') {
      setCurrentView('privacy');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (raw === 'store' || raw === 'shop') {
      setCurrentView('store');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (raw === 'stars' || raw === 'coin' || raw === 'coins') {
      setCurrentView('stars');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (raw === 'dna' || raw === 'dreamdna') {
      setCurrentView('app');
      setActiveSection('dna');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (raw === 'constellation' || raw === 'star-map') {
      setCurrentView('app');
      setActiveSection('constellation');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (raw === 'mystery' || raw === '30nights') {
      setCurrentView('app');
      setActiveSection('mystery');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (raw === 'history' || raw === 'journal') {
      setCurrentView('app');
      setActiveSection('history');
      setTimeout(() => {
        document.getElementById('history-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 80);
    } else if (raw === 'patterns') {
      setCurrentView('app');
      setActiveSection('patterns');
      setTimeout(() => {
        document.getElementById('patterns')?.scrollIntoView({ behavior: 'smooth' });
      }, 80);
    } else if (raw === 'admin') {
      if (isManagement) {
        setCurrentView('admin');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setCurrentView('home');
      }
    }
  };

  // Sync hash routing on initial mount and hashchange event
  useEffect(() => {
    applyRouteFromHash(window.location.hash);

    const handleHashChange = () => {
      applyRouteFromHash(window.location.hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Guard admin view: strictly restricted to admin and super_admin; non-admins are automatically redirected
  useEffect(() => {
    if (currentView === 'admin' && !isManagement) {
      setCurrentView('home');
    }
  }, [currentView, isManagement]);

  // Navigate handler with URL hash sync for SEO and social bookmarking
  const handleNavigate = (
    view: 'home' | 'app' | 'pricing' | 'privacy' | 'store' | 'admin' | 'stars',
    section?: 'workspace' | 'dna' | 'constellation' | 'mystery' | 'history' | 'patterns' | 'astrolabe'
  ) => {
    if ((section as string) === 'astrolabe') {
      setCurrentView('pricing');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (view === 'admin' && !isManagement) {
      setCurrentView('home');
      return;
    }
    setCurrentView(view);

    // Synchronize browser URL hash for easy sharing and SEO indexability
    let targetHash = '';
    if (view === 'home') {
      targetHash = '';
    } else if (view === 'pricing') {
      targetHash = '#pricing';
    } else if (view === 'privacy') {
      targetHash = '#privacy';
    } else if (view === 'store') {
      targetHash = '#store';
    } else if (view === 'stars') {
      targetHash = '#stars';
    } else if (view === 'admin') {
      targetHash = '#admin';
    } else if (view === 'app') {
      if (section === 'workspace') targetHash = '#recorddream';
      else if (section) targetHash = `#${section}`;
      else targetHash = '#recorddream';
    }

    try {
      if (targetHash) {
        window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}${targetHash}`);
      } else {
        window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
      }
    } catch {}

    if (section) {
      setActiveSection(section);
      setTimeout(() => {
        if (section === 'history') {
          document.getElementById('history-section')?.scrollIntoView({ behavior: 'smooth' });
        } else if (section === 'patterns') {
          document.getElementById('patterns')?.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 50);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleStartWithDream = (dreamText: string) => {
    setPrefilledDream(dreamText);
    setActiveSection('workspace');
    setCurrentView('app');
    try {
      window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#recorddream`);
    } catch {}
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDreamAdded = async (entry: DreamEntry) => {
    setHistory((prev) => {
      const updated = [entry, ...prev];
      try {
        localStorage.setItem('dreamwisdom_history', JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to persist dream to localStorage', e);
      }
      return updated;
    });

    try {
      await fetch('/api/dreams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: entry.id,
          title: entry.title,
          dream_text: entry.dream_text,
          category: entry.category,
          report_json: entry.report_json,
          tags: entry.tags || [],
          rawCantoneseTranscription: entry.rawCantoneseTranscription,
          created_at: entry.created_at,
        }),
      });
    } catch (e) {
      console.warn('Failed to sync new dream to Postgres', e);
    }
  };

  const handleUpdateSettings = async (newSettings: EngineSettings) => {
    setSettings(newSettings);
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: newSettings }),
      });
    } catch (e) {
      console.warn('Failed to sync settings to db', e);
    }
  };

  const handleSwitchUser = async (user: User) => {
    setCurrentUser(user);
    trackLoginEvent(user, 'quick_select', 'success');
    setUsers((prev) => {
      const exists = prev.some((u) => u.id === user.id);
      return exists ? prev.map((u) => (u.id === user.id ? user : u)) : [user, ...prev];
    });

    try {
      await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });
    } catch (e) {
      console.warn('Failed to sync user to db', e);
    }
  };

  const handleUpdateUsers = (newUsers: User[]) => {
    setUsers(newUsers);
    if (currentUser) {
      const updatedSelf = newUsers.find((u) => u.id === currentUser.id);
      if (updatedSelf) {
        setCurrentUser(updatedSelf);
      }
    }
  };

  const handleUpdateBooks = (newBooks: BookBrainItem[]) => {
    setBooks(newBooks);
  };

  const handleEarnStar = () => {
    if (!currentUser) return;
    const currentStars = currentUser.stars ?? 0;
    const nextStars = currentStars + 1;
    const updatedUser: User = { ...currentUser, stars: nextStars };
    setCurrentUser(updatedUser);
    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updatedUser : u)));
  };

  const handleUpdateUserStars = (newStars: number) => {
    if (!currentUser) return;
    const updatedUser: User = { ...currentUser, stars: newStars };
    setCurrentUser(updatedUser);
    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updatedUser : u)));
  };

  const handleResetPassword = (email: string, newPass: string): boolean => {
    const targetEmail = email.trim().toLowerCase();
    const userExists = users.some((u) => u.email.toLowerCase() === targetEmail);
    if (!userExists) {
      return false;
    }
    const updatedUsers = users.map((u) =>
      u.email.toLowerCase() === targetEmail ? { ...u, password: newPass } : u
    );
    setUsers(updatedUsers);
    try {
      localStorage.setItem('dreamwisdom_users', JSON.stringify(updatedUsers));
    } catch {}

    if (currentUser && currentUser.email.toLowerCase() === targetEmail) {
      const updatedSelf = { ...currentUser, password: newPass };
      setCurrentUser(updatedSelf);
      try {
        localStorage.setItem('dreamwisdom_current_user', JSON.stringify(updatedSelf));
      } catch {}
    }
    return true;
  };

  // Quota exchange with Star Coins (free users)
  const handleExchangeQuota = (starsCost: number, quotaToAdd: number) => {
    if (!currentUser) {
      setIsLoginOpen(true);
      return;
    }
    const currentStars = currentUser.stars ?? 2;
    if (currentStars < starsCost) {
      setIsStarVideoOpen(true);
      return;
    }
    const currentQuota = currentUser.storage_quota || 3;
    const newQuota = Math.min(10, currentQuota + quotaToAdd);
    const newStars = currentStars - starsCost;

    const updatedUser: User = {
      ...currentUser,
      stars: newStars,
      storage_quota: newQuota,
    };
    setCurrentUser(updatedUser);
    setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
  };

  // Upgrade to paid membership
  const handleUpgradeToPaid = () => {
    if (!currentUser) {
      setIsLoginOpen(true);
      return;
    }
    const updatedUser: User = {
      ...currentUser,
      role: 'paid',
      storage_quota: 99999,
    };
    setCurrentUser(updatedUser);
    setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
  };

  // Clear all dream records (Privacy right)
  const handleClearAllDreams = () => {
    setHistory([]);
    localStorage.removeItem('dreamwisdom_history');
  };

  // One-click delete entire account along with all dream records (Right to be forgotten)
  const handleDeleteAccountAndData = async () => {
    if (!currentUser) {
      handleClearAllDreams();
      return;
    }
    const currentId = currentUser.id;
    setHistory([]);
    localStorage.removeItem('dreamwisdom_history');
    setUsers((prev) => prev.filter((u) => u.id !== currentId));
    setCurrentUser(null);
    try {
      localStorage.removeItem('dreamwisdom_current_user');
      await fetch(`/api/users/${currentId}`, { method: 'DELETE' });
    } catch (e) {
      console.warn('Failed to delete user on backend', e);
    }
    setCurrentView('home');
  };

  // Toggle local-only mode
  const handleToggleLocalOnly = (localOnly: boolean) => {
    if (!currentUser) return;
    const updatedUser: User = {
      ...currentUser,
      privacy_local_only: localOnly,
    };
    setCurrentUser(updatedUser);
    setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('home');
  };

  // Dynamic tint gradient based on user selection
  const tintGradient = {
    aurora: 'from-[#060814]/40 via-[#0a1226]/30 to-[#060917]/60',
    twilight: 'from-[#0e0717]/40 via-[#140b20]/30 to-[#070510]/60',
    cyber: 'from-[#080d20]/40 via-[#0c142c]/30 to-[#050814]/60',
    deep: 'from-[#030610]/45 via-[#050e1e]/35 to-[#02040c]/65',
  }[wallpaperTint];

  return (
    <div className="min-h-screen flex flex-col text-[#102A4E] relative selection:bg-[#38BDF8]/30 selection:text-[#1E3A8A] overflow-x-hidden" id="dreamwisdom-app-root">
      {/* 🌟 藍銀白眼天體透亮背景層 (Celestial Ice-Blue & Porcelain-White Dreamscape) 🌟 */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden" id="celestial-dreamscape-bg">
        {/* 天體藍銀主漸層底色 */}
        <div className="absolute inset-0 bg-[radial-gradient(130%_90%_at_50%_-10%,#CDE7FE_0%,#E3F1FD_35%,#EDF6FF_70%,#F7FAFE_100%)]" />

        {/* 頂部月華光芒與柔和大光暈 */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-[#BAE6FD]/40 via-[#E0F2FE]/25 to-transparent rounded-full blur-[90px]" />
        <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-[#93C5FD]/20 rounded-full blur-[110px] glow-ambient-orb" />
        <div className="absolute top-1/2 -right-32 w-[550px] h-[550px] bg-[#7DD3FC]/20 rounded-full blur-[120px] glow-ambient-orb" style={{ animationDelay: '-6s' }} />

        {/* 飄浮天體晶透水珠氣泡 (Floating Specular Crystal Bubbles) */}
        <div className="celestial-bubble w-9 h-9 top-20 left-[6%] opacity-75" />
        <div className="celestial-bubble w-4 h-4 top-44 left-[14%] opacity-60" />
        <div className="celestial-bubble w-11 h-11 top-64 right-[8%] opacity-70" />
        <div className="celestial-bubble w-6 h-6 top-28 right-[18%] opacity-65" />
        <div className="celestial-bubble w-14 h-14 top-[480px] left-[3%] opacity-60" />
        <div className="celestial-bubble w-8 h-8 top-[680px] right-[5%] opacity-65" />
        <div className="celestial-bubble w-5 h-5 top-[920px] left-[8%] opacity-55" />
        <div className="celestial-bubble w-10 h-10 top-[1200px] right-[10%] opacity-60" />

        {/* 四角銀藍星塵 (Scattered Silver-Blue 4-point Sparkles) */}
        <span className="absolute top-36 left-[22%] text-[#38BDF8] text-xl opacity-70 animate-pulse select-none">✦</span>
        <span className="absolute top-72 left-[8%] text-[#60A5FA] text-sm opacity-60 select-none">✧</span>
        <span className="absolute top-28 right-[26%] text-[#38BDF8] text-2xl opacity-75 animate-pulse select-none" style={{ animationDuration: '3s' }}>✦</span>
        <span className="absolute top-80 right-[12%] text-[#60A5FA] text-lg opacity-70 select-none">✦</span>
        <span className="absolute top-[520px] right-[18%] text-[#38BDF8] text-base opacity-60 select-none">✧</span>
        <span className="absolute top-[750px] left-[12%] text-[#60A5FA] text-xl opacity-65 select-none">✦</span>
      </div>

      {/* Global Top Navbar */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        currentUser={currentUser}
        onOpenLogin={() => setIsLoginOpen(true)}
        onLogout={handleLogout}
        activeSection={activeSection}
        onNavigateSection={(sec) => handleNavigate('app', sec)}
        savedDreamCount={history.length}
      />


      {/* Main View Switcher */}
      {currentView === 'home' && (
        <HomeView
          currentUser={currentUser}
          onStartWithDream={handleStartWithDream}
          onGoToApp={(tab) => {
            if (tab) setActiveSection(tab);
            setCurrentView('app');
          }}
          onGoToPricing={() => handleNavigate('pricing')}
          onOpenLogin={() => setIsLoginOpen(true)}
          onGoToPrivacy={() => handleNavigate('privacy')}
          therapists={therapists}
        />
      )}

      {currentView === 'pricing' && (
        <PricingView
          currentUser={currentUser}
          onOpenEarnStars={() => setIsStarVideoOpen(true)}
          onOpenLogin={() => setIsLoginOpen(true)}
          onUpgradeToPaid={handleUpgradeToPaid}
          onGoToApp={(tab, prefill) => {
            if (prefill) {
              setPrefilledDream((prev) => (prev ? `${prev}\n${prefill}` : prefill));
            }
            handleNavigate('app', tab || 'workspace');
          }}
          onGoToStars={() => handleNavigate('stars')}
        />
      )}

      {currentView === 'privacy' && (
        <PrivacyView
          currentUser={currentUser}
          currentStoredDreamsCount={history.length}
          onClearAllData={handleClearAllDreams}
          onDeleteAccountAndData={handleDeleteAccountAndData}
          onToggleLocalOnly={handleToggleLocalOnly}
          isLocalOnly={!!currentUser?.privacy_local_only}
          onGoToApp={(tab) => handleNavigate('app', tab as any || 'workspace')}
          onGoBack={() => handleNavigate('home')}
          therapists={therapists}
        />
      )}

      {currentView === 'store' && (
        <ProductStoreView
          products={products}
          currentUser={currentUser}
          recommendedProductId={targetProductId}
          currentDreamSummary={history[0]?.dream_text?.slice(0, 100)}
          onOpenLogin={() => setIsLoginOpen(true)}
          onOpenEarnStars={() => setIsStarVideoOpen(true)}
          onUpdateUserStars={handleUpdateUserStars}
          onNavigateToWorkspace={() => handleNavigate('app', 'workspace')}
          onUpdateProducts={(updated) => setProducts(updated)}
          onNavigateToAdmin={() => handleNavigate('admin')}
        />
      )}

      {currentView === 'stars' && (
        <StarCoinsView
          currentUser={currentUser}
          onOpenEarnStars={() => setIsStarVideoOpen(true)}
          onGoToWorkspace={() => handleNavigate('app', 'workspace')}
          onGoToPricing={() => handleNavigate('pricing')}
          onUpgradeToPaid={handleUpgradeToPaid}
        />
      )}

      {currentView === 'app' && (
        <main className="page shell flex-1" id="app-page-layout">
          <div className="layout">
            <Sidebar
              currentUser={currentUser}
              activeSection={activeSection}
              onNavigate={handleNavigate}
              onLogout={handleLogout}
              onOpenEarnStars={() => setIsStarVideoOpen(true)}
            />

            <div className="content" id="app-workspace-content">
              <div className="toprow">
                <div>
                  <span className="badge">
                    <Sparkles className="w-3 h-3 text-[#78e1b5]" />
                    PRIVATE DREAM SPACE · 專屬夢境宇宙
                  </span>
                  <h1 style={{ marginTop: 8 }}>
                    你好，{currentUser?.display_name || currentUser?.email?.split('@')[0] || 'Dreamer'}。
                  </h1>
                  <p className="muted text-sm">
                    每一個夢，都可以成為認識自己內在情緒的鏡子。我們記得你的夢，為你持續累積 Dream DNA™️ 與星圖連線。
                  </p>
                </div>

                {!currentUser ? (
                  <button
                    type="button"
                    onClick={() => setIsLoginOpen(true)}
                    className="btn dark text-xs cursor-pointer"
                  >
                    EMAIL 登入以同步記錄
                  </button>
                ) : normRole === 'free' ? (
                  <button
                    type="button"
                    onClick={() => setIsStarVideoOpen(true)}
                    className="btn text-xs px-3.5 py-2 flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                    <span>隨機彈出片儲星星</span>
                  </button>
                ) : null}
              </div>

              <DreamWorkspace
                key={activeSection}
                initialHistory={history}
                settings={settings}
                demo={!process.env.GEMINI_API_KEY}
                prefilledDream={prefilledDream}
                initialTab={activeSection === 'patterns' ? 'history' : activeSection}
                currentUser={currentUser}
                onDreamAdded={handleDreamAdded}
                onUpdateUserStars={handleUpdateUserStars}
                onOpenEarnStars={() => setIsStarVideoOpen(true)}
                onGoToPricing={() => handleNavigate('pricing')}
                onGoToStore={(prodId) => {
                  setTargetProductId(prodId);
                  handleNavigate('store');
                }}
                therapists={therapists}
              />
            </div>
          </div>
        </main>
      )}

      {currentView === 'admin' && isManagement && currentUser && (
        <main className="page shell flex-1" id="admin-page-layout">
          <div className="layout">
            <Sidebar
              currentUser={currentUser}
              activeSection={activeSection}
              onNavigate={handleNavigate}
              onLogout={handleLogout}
              onOpenEarnStars={() => setIsStarVideoOpen(true)}
            />

            <div className="content" id="admin-console-content">
              <div className="toprow">
                <div>
                  <span className="badge">
                    <BookOpen className="w-3 h-3 text-[#78e1b5]" />
                    ADMIN CONTROL ROOM · 控制室
                  </span>
                  <h1 style={{ marginTop: 8 }}>DreamWisdom Control Room</h1>
                  <p className="muted text-sm">
                    Book Brain 典籍知識庫、AI 輸出風格參數、會員權限均在此即時管理。
                  </p>
                </div>
              </div>

              <AdminConsole
                initialBooks={books}
                initialUsers={users}
                initialSettings={settings}
                initialProducts={products}
                initialAdVideos={adVideos}
                initialTherapists={therapists}
                currentUserId={currentUser.id}
                currentUserRole={currentUser.role}
                onUpdateSettings={handleUpdateSettings}
                onUpdateUsers={handleUpdateUsers}
                onUpdateBooks={handleUpdateBooks}
                onUpdateProducts={(updated) => setProducts(updated)}
                onUpdateAdVideos={(updated) => setAdVideos(updated)}
                onUpdateTherapists={(updated) => setTherapists(updated)}
                onSwitchUser={handleSwitchUser}
              />
            </div>
          </div>
        </main>
      )}

      {/* Global Site Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Global Login / Switch Account Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLogin={(user) => {
          handleSwitchUser(user);
          setCurrentView('app');
        }}
        availableUsers={users}
        onResetPassword={handleResetPassword}
      />

      {/* Star Video Earning Modal (for General Members) */}
      <StarVideoModal
        isOpen={isStarVideoOpen}
        onClose={() => setIsStarVideoOpen(false)}
        onEarnStar={handleEarnStar}
        currentStars={currentUser?.stars ?? 2}
        currentUser={currentUser}
        adVideos={adVideos}
      />



      {/* Floating Atmosphere Customizer Widget */}
      <DreamAtmosphereController
        opacity={wallpaperOpacity}
        setOpacity={setWallpaperOpacity}
        blur={wallpaperBlur}
        setBlur={setWallpaperBlur}
        tint={wallpaperTint}
        setTint={setWallpaperTint}
      />
    </div>
  );
}

