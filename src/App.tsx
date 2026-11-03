import React, { useState, useEffect } from 'react';
import {
  Home,
  Smartphone,
  FolderOpen,
  Grid,
  Gamepad2,
  Sliders,
  Cpu,
  Info,
  X,
  Play,
} from 'lucide-react';
import {
  SectionId,
  VirtualDevice,
  FileItem,
  AppShortcut,
  EmulatorSettings,
  LogEntry,
} from './types';
import {
  INITIAL_DEVICES,
  INITIAL_FILES,
  INITIAL_APPS,
  DEFAULT_SETTINGS,
  INITIAL_LOGS,
} from './initialData';
import { BootScreen } from './components/BootScreen';
import { HomeView } from './components/HomeView';
import { DeviceManagerView } from './components/DeviceManagerView';
import { FileManagerView } from './components/FileManagerView';
import { AppLibraryView } from './components/AppLibraryView';
import { GamerModeView } from './components/GamerModeView';
import { SettingsCenterView } from './components/SettingsCenterView';
import { SystemAdvancedView } from './components/SystemAdvancedView';
import { AboutView } from './components/AboutView';

export default function App() {
  const [isBooting, setIsBooting] = useState<boolean>(true);
  const [activeSection, setActiveSection] = useState<SectionId>('home');

  const [devices, setDevices] = useState<VirtualDevice[]>(() => {
    const saved = localStorage.getItem('a34_devices');
    return saved ? JSON.parse(saved) : INITIAL_DEVICES;
  });

  const [files, setFiles] = useState<FileItem[]>(() => {
    const saved = localStorage.getItem('a34_files');
    return saved ? JSON.parse(saved) : INITIAL_FILES;
  });

  const [apps, setApps] = useState<AppShortcut[]>(() => {
    const saved = localStorage.getItem('a34_apps');
    return saved ? JSON.parse(saved) : INITIAL_APPS;
  });

  const [settings, setSettings] = useState<EmulatorSettings>(() => {
    const saved = localStorage.getItem('a34_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  const [logs, setLogs] = useState<LogEntry[]>(INITIAL_LOGS);
  const [launchedAppModal, setLaunchedAppModal] = useState<AppShortcut | null>(null);

  // Sync theme with document.documentElement for Tailwind v4 @custom-variant dark
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('a34_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('a34_devices', JSON.stringify(devices));
  }, [devices]);

  useEffect(() => {
    localStorage.setItem('a34_files', JSON.stringify(files));
  }, [files]);

  useEffect(() => {
    localStorage.setItem('a34_apps', JSON.stringify(apps));
  }, [apps]);

  const addLog = (
    module: string,
    message: string,
    level: 'INFO' | 'WARN' | 'SYS' = 'INFO'
  ) => {
    const timestamp = new Date().toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    setLogs((prev) => [
      {
        id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        timestamp,
        level,
        module,
        message,
      },
      ...prev.slice(0, 49),
    ]);
  };

  // Device Handlers
  const handleAddDevice = (
    newDev: Omit<VirtualDevice, 'id' | 'createdAt' | 'usedStorageGB'>
  ) => {
    const created: VirtualDevice = {
      ...newDev,
      id: `dev-${Date.now()}`,
      usedStorageGB: 4.8,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setDevices((prev) => [created, ...prev]);
  };

  const handleUpdateDevice = (id: string, updated: Partial<VirtualDevice>) => {
    setDevices((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...updated } : d))
    );
  };

  const handleDeleteDevice = (id: string) => {
    setDevices((prev) => prev.filter((d) => d.id !== id));
    addLog('DeviceManager', 'Perfil de dispositivo virtual removido.', 'WARN');
  };

  const handleQuickToggleDevice = (id: string) => {
    setDevices((prev) =>
      prev.map((d) => {
        if (d.id !== id) return d;
        const nextStatus = d.status === 'Em Execução' ? 'Parado' : 'Em Execução';
        addLog('DeviceManager', `Container "${d.name}" definido para ${nextStatus}.`, 'SYS');
        return { ...d, status: nextStatus };
      })
    );
  };

  // File Handlers
  const handleAddFile = (newFile: Omit<FileItem, 'id' | 'modifiedAt'>) => {
    const nowStr = new Date().toLocaleString('pt-BR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
    setFiles((prev) => [
      {
        ...newFile,
        id: `file-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
        modifiedAt: nowStr,
      },
      ...prev,
    ]);
  };

  const handleDeleteFiles = (ids: string[]) => {
    setFiles((prev) => prev.filter((f) => !ids.includes(f.id)));
  };

  const handleMoveFiles = (ids: string[], targetFolderId: string | null) => {
    setFiles((prev) =>
      prev.map((f) => (ids.includes(f.id) ? { ...f, parentId: targetFolderId } : f))
    );
  };

  // App Library Handlers
  const handleAddApp = (newApp: Omit<AppShortcut, 'id'>) => {
    setApps((prev) => [
      {
        ...newApp,
        id: `app-${Date.now()}`,
      },
      ...prev,
    ]);
  };

  const handleTogglePinApp = (id: string) => {
    setApps((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isPinned: !a.isPinned } : a))
    );
  };

  const handleDeleteApp = (id: string) => {
    setApps((prev) => prev.filter((a) => a.id !== id));
    addLog('AppLibrary', 'Atalho de aplicativo removido da biblioteca.', 'WARN');
  };

  const handleLaunchAppModal = (app: AppShortcut) => {
    addLog('AppLauncher', `Abrindo atalho simulado: "${app.name}" (${app.packageFormat}).`, 'INFO');
    if (app.id === 'app-finder') {
      setActiveSection('files');
      return;
    }
    if (app.id === 'app-devices') {
      setActiveSection('devices');
      return;
    }
    if (app.id === 'app-gamer') {
      setActiveSection('gamer');
      return;
    }
    if (app.id === 'app-monitor') {
      setActiveSection('system');
      return;
    }
    setLaunchedAppModal(app);
  };

  const handleUpdateSettings = (partial: Partial<EmulatorSettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  };

  const dockItems: {
    id: SectionId;
    label: string;
    icon: React.FC<{ className?: string }>;
  }[] = [
    { id: 'home', label: 'Início', icon: Home },
    { id: 'devices', label: 'Dispositivos', icon: Smartphone },
    { id: 'files', label: 'Arquivos', icon: FolderOpen },
    { id: 'apps', label: 'Biblioteca', icon: Grid },
    { id: 'gamer', label: 'Gamer', icon: Gamepad2 },
    { id: 'settings', label: 'Ajustes', icon: Sliders },
    { id: 'system', label: 'Sistema', icon: Cpu },
    { id: 'about', label: 'Sobre', icon: Info },
  ];

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#05070B] text-slate-900 dark:text-slate-100 transition-colors relative overflow-x-hidden">
      {/* Boot Screen Overlay */}
      {isBooting && <BootScreen onComplete={() => setIsBooting(false)} />}

      {/* Ambient Neon Blue & Slate Background Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-36 left-1/4 w-96 h-96 rounded-full bg-[#007AFF]/15 dark:bg-[#007AFF]/12 blur-3xl" />
        <div className="absolute top-1/3 -right-24 w-80 h-80 rounded-full bg-[#00E5FF]/15 dark:bg-[#00E5FF]/10 blur-3xl" />
      </div>

      {/* Top Bar Contract: 3 Zones (Brand Wordmark — 5 Single-Line Nav Links — 1 Primary Action) */}
      <header className="sticky top-0 z-30 flex items-center justify-between gap-8 px-4 sm:px-6 h-14 bg-white/80 dark:bg-[#090D16]/80 backdrop-blur-xl border-b border-slate-200/80 dark:border-white/10">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => setActiveSection('home')}
          className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0 cursor-pointer"
        >
          Apple Emulator A34
        </button>

        {/* Zone 2: 5 concise single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            onClick={() => setActiveSection('home')}
            className={`hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeSection === 'home' ? 'text-[#007AFF] dark:text-[#00E5FF] font-semibold' : ''
            }`}
          >
            Início
          </button>
          <button
            onClick={() => setActiveSection('devices')}
            className={`hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeSection === 'devices' ? 'text-[#007AFF] dark:text-[#00E5FF] font-semibold' : ''
            }`}
          >
            Dispositivos
          </button>
          <button
            onClick={() => setActiveSection('files')}
            className={`hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeSection === 'files' ? 'text-[#007AFF] dark:text-[#00E5FF] font-semibold' : ''
            }`}
          >
            Arquivos
          </button>
          <button
            onClick={() => setActiveSection('apps')}
            className={`hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeSection === 'apps' ? 'text-[#007AFF] dark:text-[#00E5FF] font-semibold' : ''
            }`}
          >
            Biblioteca
          </button>
          <button
            onClick={() => setActiveSection('system')}
            className={`hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeSection === 'system' ? 'text-[#007AFF] dark:text-[#00E5FF] font-semibold' : ''
            }`}
          >
            Sistema
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveSection('gamer')}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-[#007AFF] to-[#00E5FF] rounded-xl hover:opacity-95 transition-opacity whitespace-nowrap shrink-0 cursor-pointer shadow-[0_0_15px_rgba(0,229,255,0.25)]"
          >
            Modo Gamer
          </button>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-5 pb-24">
        {activeSection === 'home' && (
          <HomeView
            onNavigate={setActiveSection}
            devices={devices}
            apps={apps}
            settings={settings}
            onQuickToggleDevice={handleQuickToggleDevice}
            onTriggerBoot={() => setIsBooting(true)}
            onLaunchAppModal={handleLaunchAppModal}
          />
        )}

        {activeSection === 'devices' && (
          <DeviceManagerView
            devices={devices}
            onAddDevice={handleAddDevice}
            onUpdateDevice={handleUpdateDevice}
            onDeleteDevice={handleDeleteDevice}
            onAddLog={addLog}
          />
        )}

        {activeSection === 'files' && (
          <FileManagerView
            files={files}
            onAddFile={handleAddFile}
            onDeleteFiles={handleDeleteFiles}
            onMoveFiles={handleMoveFiles}
            onAddLog={addLog}
          />
        )}

        {activeSection === 'apps' && (
          <AppLibraryView
            apps={apps}
            onAddApp={handleAddApp}
            onTogglePin={handleTogglePinApp}
            onDeleteApp={handleDeleteApp}
            onLaunchAppModal={handleLaunchAppModal}
            onAddLog={addLog}
          />
        )}

        {activeSection === 'gamer' && (
          <GamerModeView
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onAddLog={addLog}
          />
        )}

        {activeSection === 'settings' && (
          <SettingsCenterView
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onAddLog={addLog}
          />
        )}

        {activeSection === 'system' && (
          <SystemAdvancedView
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            logs={logs}
            onClearLogs={() => setLogs([])}
            onAddLog={addLog}
            devices={devices}
          />
        )}

        {activeSection === 'about' && <AboutView />}
      </main>

      {/* Bottom Navigation Bar (iOS / macOS Inspired Glass Dock optimized for Galaxy A34 thumb zone) */}
      <nav
        aria-label="Barra de navegação inferior"
        className="fixed bottom-0 left-0 right-0 z-30 h-16 bg-white/85 dark:bg-[#090D16]/85 backdrop-blur-xl border-t border-slate-200/80 dark:border-white/10 px-2"
      >
        <div className="max-w-4xl mx-auto h-full grid grid-cols-8 items-center gap-1">
          {dockItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`min-h-[44px] flex flex-col items-center justify-center rounded-xl transition-all cursor-pointer ${
                  isActive
                    ? 'text-[#007AFF] dark:text-[#00E5FF] font-semibold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <IconComponent className="w-5 h-5" />
                <span className="text-[10px] tracking-tight mt-0.5 truncate max-w-full px-1">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Simulated App Container Window Modal */}
      {launchedAppModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/15 shadow-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  {launchedAppModal.name}
                </span>
                <span className="text-xs font-mono text-[#007AFF] dark:text-[#00E5FF]">
                  {launchedAppModal.packageFormat}
                </span>
              </div>
              <button
                onClick={() => setLaunchedAppModal(null)}
                className="min-h-[38px] min-w-[38px] rounded-xl bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-600 dark:text-slate-300 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-5 rounded-2xl bg-slate-950 text-slate-200 border border-cyan-500/20 space-y-2">
                <div className="text-xs font-mono text-[#00E5FF]">
                  CONTAINER SANDBOX A34 · SIMULAÇÃO ATIVA
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {launchedAppModal.description}
                </p>
                <div className="pt-2 text-[11px] font-mono text-slate-400">
                  Versão: {launchedAppModal.version} · Memória Alocada: {launchedAppModal.sizeMB} MB
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5">
                <button
                  onClick={() => {
                    setLaunchedAppModal(null);
                    setActiveSection('gamer');
                  }}
                  className="min-h-[42px] px-4 py-2 rounded-xl bg-gradient-to-r from-[#007AFF] to-[#00E5FF] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Abrir com Controle Gamer</span>
                </button>
                <button
                  onClick={() => setLaunchedAppModal(null)}
                  className="min-h-[42px] px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/10 text-xs font-medium text-slate-700 dark:text-slate-200 cursor-pointer"
                >
                  Fechar Janela
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
