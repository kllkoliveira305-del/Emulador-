import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Activity,
  Terminal,
  Trash2,
  RefreshCw,
  HardDrive,
  Sliders,
  Smartphone,
} from 'lucide-react';
import { EmulatorSettings, LogEntry, VirtualDevice } from '../types';

interface SystemAdvancedViewProps {
  settings: EmulatorSettings;
  onUpdateSettings: (partial: Partial<EmulatorSettings>) => void;
  logs: LogEntry[];
  onClearLogs: () => void;
  onAddLog: (module: string, message: string, level?: 'INFO' | 'WARN' | 'SYS') => void;
  devices: VirtualDevice[];
}

export const SystemAdvancedView: React.FC<SystemAdvancedViewProps> = ({
  settings,
  onUpdateSettings,
  logs,
  onClearLogs,
  onAddLog,
  devices,
}) => {
  const [cpuLoad, setCpuLoad] = useState(24);
  const [gpuLoad, setGpuLoad] = useState(31);
  const [ramUsedMB, setRamUsedMB] = useState(1840);
  const [frameTimeMs, setFrameTimeMs] = useState(8.3);

  useEffect(() => {
    const runningCount = devices.filter((d) => d.status === 'Em Execução').length;
    const baseCpu = runningCount > 0 ? 28 : 12;
    const baseRam = runningCount > 0 ? 1920 : 1120;

    const timer = setInterval(() => {
      setCpuLoad(Math.min(95, baseCpu + Math.floor(Math.random() * 14)));
      setGpuLoad(Math.min(92, baseCpu + 6 + Math.floor(Math.random() * 16)));
      setRamUsedMB(Math.min(settings.allocatedRamMB, baseRam + Math.floor(Math.random() * 140)));
      setFrameTimeMs(
        settings.targetFps === 120
          ? Number((8.1 + Math.random() * 0.5).toFixed(1))
          : Number((16.4 + Math.random() * 0.6).toFixed(1))
      );
    }, 1500);

    return () => clearInterval(timer);
  }, [devices, settings.allocatedRamMB, settings.targetFps]);

  const handleGarbageCollect = () => {
    setRamUsedMB((prev) => Math.max(850, prev - 480));
    onAddLog(
      'MemoryManager',
      'Cache de texturas WebGL e buffers ociosos liberados com sucesso.',
      'SYS'
    );
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Sistema Avançado &amp; Monitor A34
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Informações do dispositivo, monitor de desempenho, uso de memória, configurações gráficas e logs
          </p>
        </div>

        <button
          onClick={handleGarbageCollect}
          className="min-h-[44px] px-4 py-2 rounded-xl bg-gradient-to-r from-[#007AFF] to-[#00E5FF] text-white text-xs font-semibold flex items-center gap-2 shadow-[0_0_20px_rgba(0,229,255,0.25)] cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Otimizar Memória Simulada</span>
        </button>
      </div>

      {/* Real-time Performance Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white/80 dark:bg-slate-900/65 backdrop-blur-xl border border-slate-200/80 dark:border-white/10">
          <span className="text-xs text-slate-500 dark:text-slate-400 block">
            Carga CPU (Dimensity 1080 Sim)
          </span>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-1">
            {cpuLoad}%
          </div>
          <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800 mt-3 overflow-hidden">
            <div
              className="h-full bg-[#007AFF] transition-all duration-300"
              style={{ width: `${cpuLoad}%` }}
            />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white/80 dark:bg-slate-900/65 backdrop-blur-xl border border-slate-200/80 dark:border-white/10">
          <span className="text-xs text-slate-500 dark:text-slate-400 block">
            Carga GPU (Mali-G68 MC4)
          </span>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-1">
            {gpuLoad}%
          </div>
          <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800 mt-3 overflow-hidden">
            <div
              className="h-full bg-[#00E5FF] transition-all duration-300"
              style={{ width: `${gpuLoad}%` }}
            />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white/80 dark:bg-slate-900/65 backdrop-blur-xl border border-slate-200/80 dark:border-white/10">
          <span className="text-xs text-slate-500 dark:text-slate-400 block">
            Uso de Memória Simulada
          </span>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-1">
            {ramUsedMB} <span className="text-sm font-normal text-slate-400">/ {settings.allocatedRamMB} MB</span>
          </div>
          <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800 mt-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#007AFF] to-[#00E5FF] transition-all duration-300"
              style={{
                width: `${Math.min(100, (ramUsedMB / settings.allocatedRamMB) * 100)}%`,
              }}
            />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white/80 dark:bg-slate-900/65 backdrop-blur-xl border border-slate-200/80 dark:border-white/10">
          <span className="text-xs text-slate-500 dark:text-slate-400 block">
            Tempo de Quadro / Taxa Alvo
          </span>
          <div className="text-2xl font-bold font-mono tabular-nums text-[#007AFF] dark:text-[#00E5FF] mt-1">
            {frameTimeMs} ms <span className="text-sm font-normal text-slate-400">({settings.targetFps}Hz)</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-3">
            Sincronização V-Sync: {settings.vsync ? 'Ativa' : 'Desativada'}
          </p>
        </div>
      </div>

      {/* Hardware Profile Info + Graphics Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Device Information Table */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-white/80 dark:bg-slate-900/65 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200/70 dark:border-white/10 pb-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Informações do Dispositivo Alvo
            </h3>
            <Smartphone className="w-4 h-4 text-[#007AFF] dark:text-[#00E5FF]" />
          </div>

          <div className="divide-y divide-slate-200/60 dark:divide-white/10 text-xs">
            <div className="py-2.5 flex justify-between gap-2">
              <span className="text-slate-500">Dispositivo Principal</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                Samsung Galaxy A34 5G (SM-A346M)
              </span>
            </div>
            <div className="py-2.5 flex justify-between gap-2">
              <span className="text-slate-500">Processador de Referência</span>
              <span className="font-mono text-slate-800 dark:text-slate-200">
                MediaTek Dimensity 1080 (6nm)
              </span>
            </div>
            <div className="py-2.5 flex justify-between gap-2">
              <span className="text-slate-500">Unidade Gráfica</span>
              <span className="font-mono text-slate-800 dark:text-slate-200">
                ARM Mali-G68 MC4
              </span>
            </div>
            <div className="py-2.5 flex justify-between gap-2">
              <span className="text-slate-500">Painel de Exibição</span>
              <span className="font-mono text-slate-800 dark:text-slate-200">
                6.6&quot; Super AMOLED · 1080x2340 · 120Hz
              </span>
            </div>
            <div className="py-2.5 flex justify-between gap-2">
              <span className="text-slate-500">Ponte Nativa Android (APK)</span>
              <span className="font-mono text-[#007AFF] dark:text-[#00E5FF]">
                WebView Capacitor / Bridge Ready
              </span>
            </div>
          </div>
        </div>

        {/* Graphics Configurations */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-white/80 dark:bg-slate-900/65 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200/70 dark:border-white/10 pb-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Configurações Gráficas Avançadas
            </h3>
            <Sliders className="w-4 h-4 text-[#007AFF] dark:text-[#00E5FF]" />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Motor de Renderização Simulada
            </label>
            <select
              value={settings.graphicsBackend}
              onChange={(e) => {
                const val = e.target.value as EmulatorSettings['graphicsBackend'];
                onUpdateSettings({ graphicsBackend: val });
                onAddLog('GraphicsCore', `Backend gráfico alterado para: ${val}.`, 'INFO');
              }}
              className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-white/15 text-sm font-mono text-slate-900 dark:text-white"
            >
              <option value="WebGL 2.0 (Mali-G68 MP4)">WebGL 2.0 (Mali-G68 MP4 Otimizado)</option>
              <option value="Vulkan Sim Wrapper">Vulkan Sim Wrapper (Experimental)</option>
              <option value="Canvas 2D Acelerado">Canvas 2D Acelerado (Compatibilidade)</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => onUpdateSettings({ vsync: !settings.vsync })}
              className={`min-h-[44px] px-4 py-2 rounded-xl border text-left flex items-center justify-between text-xs font-medium cursor-pointer ${
                settings.vsync
                  ? 'border-[#007AFF] dark:border-[#00E5FF] bg-[#007AFF]/10 text-slate-900 dark:text-white'
                  : 'border-slate-200 dark:border-white/10 text-slate-500'
              }`}
            >
              <span>Sincronização Vertical (V-Sync)</span>
              <span className="font-mono text-[#007AFF] dark:text-[#00E5FF]">
                {settings.vsync ? 'ON' : 'OFF'}
              </span>
            </button>

            <button
              onClick={() => onUpdateSettings({ showFpsOverlay: !settings.showFpsOverlay })}
              className={`min-h-[44px] px-4 py-2 rounded-xl border text-left flex items-center justify-between text-xs font-medium cursor-pointer ${
                settings.showFpsOverlay
                  ? 'border-[#007AFF] dark:border-[#00E5FF] bg-[#007AFF]/10 text-slate-900 dark:text-white'
                  : 'border-slate-200 dark:border-white/10 text-slate-500'
              }`}
            >
              <span>Contador FPS no Topo</span>
              <span className="font-mono text-[#007AFF] dark:text-[#00E5FF]">
                {settings.showFpsOverlay ? 'ON' : 'OFF'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* System Operation Logs Console */}
      <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/65 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#007AFF] dark:text-[#00E5FF]" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Logs de Funcionamento do Sistema
            </h3>
          </div>

          <button
            onClick={onClearLogs}
            className="min-h-[38px] px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-xs font-medium text-slate-600 dark:text-slate-300 flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Limpar Logs</span>
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-[#050811] border border-white/10 max-h-64 overflow-y-auto font-mono text-xs space-y-2">
          {logs.length === 0 ? (
            <div className="text-slate-500 py-4 text-center">
              Nenhum registro de log no momento. Interaja com os módulos para registrar eventos.
            </div>
          ) : (
            logs.map((entry) => (
              <div key={entry.id} className="flex items-start gap-2.5 leading-relaxed">
                <span className="text-slate-500 shrink-0 tabular-nums">[{entry.timestamp}]</span>
                <span
                  className={`shrink-0 font-semibold ${
                    entry.level === 'SYS'
                      ? 'text-[#00E5FF]'
                      : entry.level === 'WARN'
                      ? 'text-amber-400'
                      : 'text-blue-400'
                  }`}
                >
                  {entry.level}
                </span>
                <span className="text-slate-400 shrink-0">[{entry.module}]:</span>
                <span className="text-slate-200">{entry.message}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
