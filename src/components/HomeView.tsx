import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  FolderOpen,
  Gamepad2,
  Settings,
  Cpu,
  Grid,
  Info,
  Play,
  Sparkles,
  HardDrive,
  Layers,
  RotateCcw,
  CheckCircle2,
  Sliders,
} from 'lucide-react';
import { SectionId, VirtualDevice, AppShortcut, EmulatorSettings } from '../types';

interface HomeViewProps {
  onNavigate: (section: SectionId) => void;
  devices: VirtualDevice[];
  apps: AppShortcut[];
  settings: EmulatorSettings;
  onQuickToggleDevice: (id: string) => void;
  onTriggerBoot: () => void;
  onLaunchAppModal: (app: AppShortcut) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  devices,
  apps,
  settings,
  onQuickToggleDevice,
  onTriggerBoot,
  onLaunchAppModal,
}) => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const activeDevice = devices.find((d) => d.status === 'Em Execução') || devices[0];

  const formattedTime = now.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const formattedDate = now.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const quickModules: {
    id: SectionId;
    name: string;
    subtitle: string;
    icon: React.FC<{ className?: string }>;
    accent: string;
  }[] = [
    {
      id: 'devices',
      name: 'Dispositivos',
      subtitle: `${devices.length} perfis virtuais`,
      icon: Smartphone,
      accent: 'from-[#007AFF] to-[#00E5FF]',
    },
    {
      id: 'files',
      name: 'Arquivos Finder',
      subtitle: 'Diretório virtual',
      icon: FolderOpen,
      accent: 'from-sky-500 to-blue-600',
    },
    {
      id: 'apps',
      name: 'Biblioteca Apps',
      subtitle: `${apps.length} instalados`,
      icon: Grid,
      accent: 'from-cyan-500 to-blue-500',
    },
    {
      id: 'gamer',
      name: 'Modo Gamer',
      subtitle: 'Joystick & 120Hz',
      icon: Gamepad2,
      accent: 'from-[#00E5FF] to-blue-600',
    },
    {
      id: 'settings',
      name: 'Configurações',
      subtitle: 'Áudio, tela e tema',
      icon: Sliders,
      accent: 'from-slate-600 to-slate-800',
    },
    {
      id: 'system',
      name: 'Sistema Avançado',
      subtitle: 'Monitor & Logs',
      icon: Cpu,
      accent: 'from-blue-600 to-indigo-700',
    },
    {
      id: 'about',
      name: 'Sobre o Projeto',
      subtitle: 'Versão 1.0 A34',
      icon: Info,
      accent: 'from-slate-700 to-slate-900',
    },
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* Top Hero Widget: Clock, Date, Apple Emulator A34 Emblem & Active Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Clock & Brand Glass Panel */}
        <div className="lg:col-span-7 rounded-3xl p-6 sm:p-7 bg-white/80 dark:bg-slate-900/65 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 shadow-lg flex flex-col justify-between">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#007AFF] to-[#00E5FF] flex items-center justify-center text-white shadow-[0_0_25px_rgba(0,229,255,0.35)]">
                <Smartphone className="w-6 h-6 stroke-[2]" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Apple Emulator <span className="text-[#007AFF] dark:text-[#00E5FF]">A34</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Otimizado para Samsung Galaxy A34 5G · Super AMOLED 120Hz
                </p>
              </div>
            </div>

            <button
              onClick={onTriggerBoot}
              className="min-h-[44px] px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200/80 dark:border-white/10 text-xs font-medium text-slate-700 dark:text-slate-200 flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap shrink-0"
              title="Executar animação de inicialização"
            >
              <RotateCcw className="w-4 h-4 text-[#007AFF] dark:text-[#00E5FF]" />
              <span>Testar Boot</span>
            </button>
          </div>

          <div className="my-6">
            <div className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white font-mono tabular-nums">
              {formattedTime}
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 capitalize mt-1">
              {formattedDate}
            </p>
          </div>

          <div className="pt-4 border-t border-slate-200/70 dark:border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <span> Escala: {settings.resolutionScale.split(' ')[0]}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">{settings.targetFps} FPS Alvo</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">{settings.allocatedRamMB} MB RAM</span>
            </div>
            <span className="text-[#007AFF] dark:text-[#00E5FF] font-medium">
              Simulação Autorizada HTML5
            </span>
          </div>
        </div>

        {/* Active Virtual Machine Control Panel */}
        <div className="lg:col-span-5 rounded-3xl p-6 sm:p-7 bg-white/80 dark:bg-slate-900/65 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Container Principal
              </span>
              <span className="text-xs font-mono font-medium text-[#007AFF] dark:text-[#00E5FF]">
                {activeDevice.status}
              </span>
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate">
              {activeDevice.name}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {activeDevice.model} · {activeDevice.resolution}
            </p>

            {/* Hardware allocation bars */}
            <div className="mt-5 space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600 dark:text-slate-400">Memória Simulada</span>
                  <span className="font-mono tabular-nums text-slate-900 dark:text-slate-200">
                    {activeDevice.memoryMB} MB
                  </span>
                </div>
                <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#007AFF] to-[#00E5FF] rounded-full"
                    style={{ width: `${Math.min(100, (activeDevice.memoryMB / 8192) * 100)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600 dark:text-slate-400">Armazenamento Virtual</span>
                  <span className="font-mono tabular-nums text-slate-900 dark:text-slate-200">
                    {activeDevice.usedStorageGB} GB / {activeDevice.storageGB} GB
                  </span>
                </div>
                <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-[#00E5FF] rounded-full"
                    style={{
                      width: `${Math.min(100, (activeDevice.usedStorageGB / activeDevice.storageGB) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200/70 dark:border-white/10 flex items-center gap-3">
            <button
              onClick={() => onQuickToggleDevice(activeDevice.id)}
              className={`flex-1 min-h-[44px] px-4 py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeDevice.status === 'Em Execução'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950'
                  : 'bg-gradient-to-r from-[#007AFF] to-[#00E5FF] text-white shadow-[0_0_20px_rgba(0,229,255,0.3)]'
              }`}
            >
              <Play className="w-4 h-4 fill-current" />
              <span>
                {activeDevice.status === 'Em Execução' ? 'Pausar Container' : 'Iniciar Container'}
              </span>
            </button>
            <button
              onClick={() => onNavigate('devices')}
              className="min-h-[44px] px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-xs font-medium text-slate-700 dark:text-slate-200 transition-colors cursor-pointer whitespace-nowrap"
            >
              Configurar
            </button>
          </div>
        </div>
      </div>

      {/* System Modules Menu (iOS / macOS Launchpad Grid) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            Painel Principal de Módulos
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Toque para abrir o subsistema
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
          {quickModules.map((mod) => {
            const IconComponent = mod.icon;
            return (
              <button
                key={mod.id}
                onClick={() => onNavigate(mod.id)}
                className="group text-left p-4 rounded-2xl bg-white/80 dark:bg-slate-900/60 hover:bg-white dark:hover:bg-slate-900/90 backdrop-blur-md border border-slate-200/80 dark:border-white/10 hover:border-[#007AFF]/50 dark:hover:border-[#00E5FF]/50 transition-all flex items-center gap-3.5 cursor-pointer shadow-sm"
              >
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${mod.accent} flex items-center justify-center text-white shrink-0 shadow-md group-hover:scale-105 transition-transform`}
                >
                  <IconComponent className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                    {mod.name}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    {mod.subtitle}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Pinned Applications & Shortcuts Row */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            Atalhos Rápidos da Biblioteca
          </h3>
          <button
            onClick={() => onNavigate('apps')}
            className="text-xs font-medium text-[#007AFF] dark:text-[#00E5FF] hover:underline cursor-pointer"
          >
            Ver biblioteca completa
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {apps.slice(0, 6).map((app) => (
            <div
              key={app.id}
              className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/80 dark:border-white/10 flex items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                    {app.name}
                  </span>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1.5">
                  <span>{app.category}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono tabular-nums">{app.packageFormat}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono tabular-nums">{app.sizeMB} MB</span>
                </div>
              </div>

              <button
                onClick={() => onLaunchAppModal(app)}
                className="min-h-[40px] px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white/10 dark:hover:bg-[#00E5FF] dark:hover:text-slate-950 text-white text-xs font-medium transition-colors shrink-0 cursor-pointer"
              >
                Abrir
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
