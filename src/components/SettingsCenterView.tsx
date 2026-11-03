import React from 'react';
import {
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Monitor,
  Sliders,
  Cpu,
  HardDrive,
  RotateCcw,
} from 'lucide-react';
import { EmulatorSettings } from '../types';
import { DEFAULT_SETTINGS } from '../initialData';

interface SettingsCenterViewProps {
  settings: EmulatorSettings;
  onUpdateSettings: (partial: Partial<EmulatorSettings>) => void;
  onAddLog: (module: string, message: string, level?: 'INFO' | 'WARN' | 'SYS') => void;
}

export const SettingsCenterView: React.FC<SettingsCenterViewProps> = ({
  settings,
  onUpdateSettings,
  onAddLog,
}) => {
  const handleReset = () => {
    onUpdateSettings(DEFAULT_SETTINGS);
    onAddLog('SettingsCenter', 'Configurações restauradas para o perfil recomendado do Galaxy A34.', 'SYS');
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Central de Configurações
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Ajuste aparência, tema claro/escuro, resolução, áudio, controles, desempenho e armazenamento
          </p>
        </div>

        <button
          onClick={handleReset}
          className="min-h-[44px] px-4 py-2 rounded-xl bg-white/80 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-xs font-medium text-slate-700 dark:text-slate-200 flex items-center gap-2 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 text-[#007AFF] dark:text-[#00E5FF]" />
          <span>Redefinir Padrões</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* 1. Aparência & Tema Claro/Escuro */}
        <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/65 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-200/70 dark:border-white/10 pb-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              1. Aparência &amp; Tema
            </h3>
            <span className="text-xs font-mono text-[#007AFF] dark:text-[#00E5FF]">
              GLASSMORPHISM UI
            </span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-semibold text-slate-900 dark:text-white">
                Modo de Cor do Sistema
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Alterne entre o modo Preto/Azul Neon (OLED) e Claro (macOS Light)
              </div>
            </div>

            <div className="flex items-center p-1 rounded-xl bg-slate-200 dark:bg-slate-950 border border-slate-300 dark:border-white/10">
              <button
                onClick={() => {
                  onUpdateSettings({ theme: 'light' });
                  onAddLog('Settings', 'Tema Claro ativado.', 'INFO');
                }}
                className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                  settings.theme === 'light'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>Claro</span>
              </button>
              <button
                onClick={() => {
                  onUpdateSettings({ theme: 'dark' });
                  onAddLog('Settings', 'Tema Escuro Neon ativado.', 'INFO');
                }}
                className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                  settings.theme === 'dark'
                    ? 'bg-slate-800 text-[#00E5FF] shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>Escuro</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
              Intensidade do Efeito Glassmorphism
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['high', 'medium', 'minimal'] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => onUpdateSettings({ glassIntensity: level })}
                  className={`min-h-[40px] px-3 py-2 rounded-xl text-xs font-medium capitalize border transition-colors cursor-pointer ${
                    settings.glassIntensity === level
                      ? 'bg-[#007AFF]/15 border-[#007AFF] dark:border-[#00E5FF] text-[#007AFF] dark:text-[#00E5FF]'
                      : 'bg-slate-100 dark:bg-white/5 border-transparent text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {level === 'high' ? 'Alta (Blur XL)' : level === 'medium' ? 'Média' : 'Mínima'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 2. Resolução & Display */}
        <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/65 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-200/70 dark:border-white/10 pb-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              2. Resolução &amp; Tela A34
            </h3>
            <Monitor className="w-4 h-4 text-[#007AFF] dark:text-[#00E5FF]" />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Escala de Renderização da Viewport
            </label>
            <select
              value={settings.resolutionScale}
              onChange={(e) =>
                onUpdateSettings({
                  resolutionScale: e.target.value as EmulatorSettings['resolutionScale'],
                })
              }
              className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-white/15 text-sm text-slate-900 dark:text-white"
            >
              <option value="1.0x (1080x2340 Nativo A34)">1.0x (1080x2340 Nativo Galaxy A34)</option>
              <option value="0.75x (Modo Desempenho)">0.75x (Economia de Energia)</option>
              <option value="1.25x (Super Sampling)">1.25x (Super Retina Nitidez)</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-slate-900 dark:text-white">
                Taxa de Quadros Alvo
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Sincronizado com o painel Super AMOLED de 120Hz
              </div>
            </div>
            <div className="flex gap-2">
              {([60, 120] as const).map((fps) => (
                <button
                  key={fps}
                  onClick={() => onUpdateSettings({ targetFps: fps })}
                  className={`min-h-[40px] px-4 py-1.5 rounded-xl font-mono text-xs font-semibold cursor-pointer ${
                    settings.targetFps === fps
                      ? 'bg-gradient-to-r from-[#007AFF] to-[#00E5FF] text-white'
                      : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {fps} Hz
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Áudio & Controles */}
        <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/65 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-200/70 dark:border-white/10 pb-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              3. Áudio &amp; Controles
            </h3>
            {settings.audioEnabled ? (
              <Volume2 className="w-4 h-4 text-[#007AFF] dark:text-[#00E5FF]" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" />
            )}
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium mb-1.5">
              <span className="text-slate-700 dark:text-slate-300">Volume Mestre do Emulador</span>
              <span className="font-mono text-[#007AFF] dark:text-[#00E5FF]">
                {settings.audioEnabled ? `${settings.audioVolume}%` : 'Mudo'}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={settings.audioEnabled ? settings.audioVolume : 0}
              onChange={(e) =>
                onUpdateSettings({
                  audioVolume: Number(e.target.value),
                  audioEnabled: Number(e.target.value) > 0,
                })
              }
              className="w-full accent-[#00E5FF] cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <button
              onClick={() => onUpdateSettings({ lowLatencyAudio: !settings.lowLatencyAudio })}
              className={`min-h-[44px] px-3.5 py-2 rounded-xl border text-left flex items-center justify-between text-xs font-medium cursor-pointer ${
                settings.lowLatencyAudio
                  ? 'border-[#007AFF] dark:border-[#00E5FF] bg-[#007AFF]/10 text-slate-900 dark:text-white'
                  : 'border-slate-200 dark:border-white/10 text-slate-500'
              }`}
            >
              <span>Áudio Baixa Latência</span>
              <span className="font-mono text-[#007AFF] dark:text-[#00E5FF]">
                {settings.lowLatencyAudio ? 'ON' : 'OFF'}
              </span>
            </button>

            <button
              onClick={() => onUpdateSettings({ hapticFeedback: !settings.hapticFeedback })}
              className={`min-h-[44px] px-3.5 py-2 rounded-xl border text-left flex items-center justify-between text-xs font-medium cursor-pointer ${
                settings.hapticFeedback
                  ? 'border-[#007AFF] dark:border-[#00E5FF] bg-[#007AFF]/10 text-slate-900 dark:text-white'
                  : 'border-slate-200 dark:border-white/10 text-slate-500'
              }`}
            >
              <span>Vibração Tátil A34</span>
              <span className="font-mono text-[#007AFF] dark:text-[#00E5FF]">
                {settings.hapticFeedback ? 'ON' : 'OFF'}
              </span>
            </button>
          </div>
        </div>

        {/* 4. Desempenho & Armazenamento */}
        <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/65 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-200/70 dark:border-white/10 pb-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              4. Desempenho &amp; Armazenamento
            </h3>
            <Cpu className="w-4 h-4 text-[#007AFF] dark:text-[#00E5FF]" />
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium mb-1.5">
              <span className="text-slate-700 dark:text-slate-300">Limite de Memória Alocada</span>
              <span className="font-mono text-[#007AFF] dark:text-[#00E5FF]">
                {settings.allocatedRamMB} MB
              </span>
            </div>
            <input
              type="range"
              min={2048}
              max={8192}
              step={1024}
              value={settings.allocatedRamMB}
              onChange={(e) => onUpdateSettings({ allocatedRamMB: Number(e.target.value) })}
              className="w-full accent-[#00E5FF] cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium mb-1.5">
              <span className="text-slate-700 dark:text-slate-300">
                Quota Máxima de Armazenamento Virtual
              </span>
              <span className="font-mono text-[#007AFF] dark:text-[#00E5FF]">
                {settings.storageLimitGB} GB
              </span>
            </div>
            <input
              type="range"
              min={32}
              max={256}
              step={32}
              value={settings.storageLimitGB}
              onChange={(e) => onUpdateSettings({ storageLimitGB: Number(e.target.value) })}
              className="w-full accent-[#00E5FF] cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
