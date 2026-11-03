import React, { useState } from 'react';
import {
  Smartphone,
  Plus,
  Play,
  Square,
  Trash2,
  Sliders,
  Monitor,
  Cpu,
  HardDrive,
  Check,
} from 'lucide-react';
import { VirtualDevice } from '../types';

interface DeviceManagerViewProps {
  devices: VirtualDevice[];
  onAddDevice: (device: Omit<VirtualDevice, 'id' | 'createdAt' | 'usedStorageGB'>) => void;
  onUpdateDevice: (id: string, updated: Partial<VirtualDevice>) => void;
  onDeleteDevice: (id: string) => void;
  onAddLog: (module: string, message: string, level?: 'INFO' | 'WARN' | 'SYS') => void;
}

export const DeviceManagerView: React.FC<DeviceManagerViewProps> = ({
  devices,
  onAddDevice,
  onUpdateDevice,
  onDeleteDevice,
  onAddLog,
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [name, setName] = useState('Novo Container A34');
  const [model, setModel] = useState<VirtualDevice['model']>('iPhone 15 Pro Sim');
  const [resolution, setResolution] =
    useState<VirtualDevice['resolution']>('1080x2340 (A34 Nativo)');
  const [memoryMB, setMemoryMB] = useState<VirtualDevice['memoryMB']>(4096);
  const [storageGB, setStorageGB] = useState<VirtualDevice['storageGB']>(64);
  const [refreshRate, setRefreshRate] = useState<VirtualDevice['refreshRate']>(120);

  const inferOsFamily = (m: VirtualDevice['model']): VirtualDevice['osFamily'] => {
    if (m.includes('macOS')) return 'macOS Visual';
    if (m.includes('iPad')) return 'iPadOS Visual';
    return 'iOS Visual';
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddDevice({
      name: name.trim(),
      model,
      osFamily: inferOsFamily(model),
      resolution,
      memoryMB,
      storageGB,
      status: 'Parado',
      refreshRate,
    });

    onAddLog(
      'DeviceManager',
      `Dispositivo virtual "${name.trim()}" (${model}, ${memoryMB}MB RAM, ${storageGB}GB) criado.`,
      'INFO'
    );
    setName('Container Custom A34');
    setShowCreateForm(false);
  };

  const handleToggleRun = (device: VirtualDevice) => {
    const nextStatus = device.status === 'Em Execução' ? 'Parado' : 'Em Execução';
    onUpdateDevice(device.id, { status: nextStatus });
    onAddLog(
      'DeviceManager',
      `Container "${device.name}" alterado para estado: ${nextStatus}.`,
      'SYS'
    );
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Gerenciador de Dispositivos Virtuais
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Crie e configure perfis visuais com resolução, memória simulada e armazenamento para o Galaxy A34
          </p>
        </div>

        <button
          onClick={() => setShowCreateForm((prev) => !prev)}
          className="min-h-[44px] px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#007AFF] to-[#00E5FF] text-white text-xs font-semibold flex items-center gap-2 shadow-[0_0_20px_rgba(0,229,255,0.25)] cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{showCreateForm ? 'Fechar Formulário' : 'Novo Dispositivo Virtual'}</span>
        </button>
      </div>

      {/* Create New Virtual Device Form */}
      {showCreateForm && (
        <form
          onSubmit={handleCreate}
          className="p-6 rounded-3xl bg-white/90 dark:bg-slate-900/80 backdrop-blur-xl border border-[#007AFF]/40 dark:border-[#00E5FF]/40 shadow-xl space-y-5"
        >
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Configurar Novo Dispositivo Virtual
            </h3>
            <span className="text-xs font-mono text-[#007AFF] dark:text-[#00E5FF]">
              PERFIL A34 COMPATÍVEL
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Nome do Container
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-white/15 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#00E5FF]"
                placeholder="Ex: iOS 17 Pro Max Sim"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Modelo Virtual
              </label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value as VirtualDevice['model'])}
                className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-white/15 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#00E5FF]"
              >
                <option value="iPhone 15 Pro Sim">iPhone 15 Pro Sim (iOS Visual)</option>
                <option value="iPad Pro M2 Sim">iPad Pro M2 Sim (iPadOS Visual)</option>
                <option value="macOS Sonoma Container">macOS Sonoma Container (Desktop)</option>
                <option value="iPhone SE Compact Sim">iPhone SE Compact Sim (Leve)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Resolução de Renderização
              </label>
              <select
                value={resolution}
                onChange={(e) => setResolution(e.target.value as VirtualDevice['resolution'])}
                className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-white/15 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#00E5FF]"
              >
                <option value="1080x2340 (A34 Nativo)">1080x2340 (A34 Nativo 19.5:9)</option>
                <option value="1179x2556 (Retina)">1179x2556 (Super Retina Sim)</option>
                <option value="1920x1080 (FHD)">1920x1080 (Full HD Landscape)</option>
                <option value="2560x1440 (QHD)">2560x1440 (Quad HD macOS)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Memória RAM Simulada
              </label>
              <select
                value={memoryMB}
                onChange={(e) => setMemoryMB(Number(e.target.value) as VirtualDevice['memoryMB'])}
                className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-white/15 text-sm text-slate-900 dark:text-white font-mono focus:outline-none focus:border-[#00E5FF]"
              >
                <option value={2048}>2048 MB (2 GB - Econômico)</option>
                <option value={4096}>4096 MB (4 GB - Recomendado A34)</option>
                <option value={6144}>6144 MB (6 GB - Avançado)</option>
                <option value={8192}>8192 MB (8 GB - Máximo)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Armazenamento Virtual Alocado
              </label>
              <select
                value={storageGB}
                onChange={(e) => setStorageGB(Number(e.target.value) as VirtualDevice['storageGB'])}
                className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-white/15 text-sm text-slate-900 dark:text-white font-mono focus:outline-none focus:border-[#00E5FF]"
              >
                <option value={32}>32 GB Sandbox</option>
                <option value={64}>64 GB Sandbox</option>
                <option value={128}>128 GB Sandbox</option>
                <option value={256}>256 GB Sandbox</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Taxa de Atualização
              </label>
              <select
                value={refreshRate}
                onChange={(e) =>
                  setRefreshRate(Number(e.target.value) as VirtualDevice['refreshRate'])
                }
                className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-white/15 text-sm text-slate-900 dark:text-white font-mono focus:outline-none focus:border-[#00E5FF]"
              >
                <option value={60}>60 Hz Padrão</option>
                <option value={120}>120 Hz ProMotion / A34 AMOLED</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowCreateForm(false)}
              className="min-h-[44px] px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/5 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="min-h-[44px] px-5 py-2 rounded-xl bg-gradient-to-r from-[#007AFF] to-[#00E5FF] text-white text-xs font-semibold cursor-pointer"
            >
              Criar Dispositivo Virtual
            </button>
          </div>
        </form>
      )}

      {/* Virtual Devices List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {devices.map((dev) => {
          const isEditing = editingId === dev.id;
          return (
            <div
              key={dev.id}
              className="p-5 sm:p-6 rounded-3xl bg-white/80 dark:bg-slate-900/65 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 flex flex-col justify-between gap-4 shadow-sm"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#007AFF]/20 to-[#00E5FF]/20 border border-[#007AFF]/30 dark:border-[#00E5FF]/30 flex items-center justify-center text-[#007AFF] dark:text-[#00E5FF] shrink-0">
                      <Smartphone className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {dev.name}
                      </h3>
                      <div className="text-xs text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-1.5 mt-0.5">
                        <span>{dev.model}</span>
                        <span aria-hidden="true">·</span>
                        <span>{dev.osFamily}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono text-[#007AFF] dark:text-[#00E5FF] font-medium">
                          {dev.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {devices.length > 1 && (
                    <button
                      onClick={() => onDeleteDevice(dev.id)}
                      className="min-h-[40px] min-w-[40px] rounded-xl hover:bg-red-500/10 text-slate-400 hover:text-red-500 flex items-center justify-center transition-colors cursor-pointer"
                      title="Remover dispositivo virtual"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Spec Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5 pt-4 border-t border-slate-200/70 dark:border-white/10 text-xs">
                  <div>
                    <span className="text-slate-400 block">Resolução</span>
                    <span className="font-mono tabular-nums font-medium text-slate-800 dark:text-slate-200">
                      {dev.resolution.split(' ')[0]}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Memória</span>
                    <span className="font-mono tabular-nums font-medium text-slate-800 dark:text-slate-200">
                      {dev.memoryMB} MB
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Armazenamento</span>
                    <span className="font-mono tabular-nums font-medium text-slate-800 dark:text-slate-200">
                      {dev.usedStorageGB} / {dev.storageGB} GB
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Display</span>
                    <span className="font-mono tabular-nums font-medium text-slate-800 dark:text-slate-200">
                      {dev.refreshRate} Hz
                    </span>
                  </div>
                </div>

                {/* Inline Configuration Drawer */}
                {isEditing && (
                  <div className="mt-4 pt-4 border-t border-slate-200/70 dark:border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                        Resolução
                      </label>
                      <select
                        value={dev.resolution}
                        onChange={(e) =>
                          onUpdateDevice(dev.id, {
                            resolution: e.target.value as VirtualDevice['resolution'],
                          })
                        }
                        className="w-full min-h-[40px] px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-white/15 text-xs text-slate-900 dark:text-white"
                      >
                        <option value="1080x2340 (A34 Nativo)">1080x2340 (A34)</option>
                        <option value="1179x2556 (Retina)">1179x2556 (Retina)</option>
                        <option value="1920x1080 (FHD)">1920x1080 (FHD)</option>
                        <option value="2560x1440 (QHD)">2560x1440 (QHD)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                        RAM Simulada
                      </label>
                      <select
                        value={dev.memoryMB}
                        onChange={(e) =>
                          onUpdateDevice(dev.id, {
                            memoryMB: Number(e.target.value) as VirtualDevice['memoryMB'],
                          })
                        }
                        className="w-full min-h-[40px] px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-white/15 text-xs font-mono text-slate-900 dark:text-white"
                      >
                        <option value={2048}>2048 MB</option>
                        <option value={4096}>4096 MB</option>
                        <option value={6144}>6144 MB</option>
                        <option value={8192}>8192 MB</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                        Armazenamento
                      </label>
                      <select
                        value={dev.storageGB}
                        onChange={(e) =>
                          onUpdateDevice(dev.id, {
                            storageGB: Number(e.target.value) as VirtualDevice['storageGB'],
                          })
                        }
                        className="w-full min-h-[40px] px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-white/15 text-xs font-mono text-slate-900 dark:text-white"
                      >
                        <option value={32}>32 GB</option>
                        <option value={64}>64 GB</option>
                        <option value={128}>128 GB</option>
                        <option value={256}>256 GB</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Controls */}
              <div className="flex items-center gap-2.5 pt-2">
                <button
                  onClick={() => handleToggleRun(dev)}
                  className={`flex-1 min-h-[44px] px-4 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    dev.status === 'Em Execução'
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950'
                      : 'bg-gradient-to-r from-[#007AFF] to-[#00E5FF] text-white'
                  }`}
                >
                  {dev.status === 'Em Execução' ? (
                    <>
                      <Square className="w-3.5 h-3.5 fill-current" />
                      <span>Parar Simulação</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Executar Perfil</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setEditingId(isEditing ? null : dev.id)}
                  className="min-h-[44px] px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-xs font-medium text-slate-700 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer"
                >
                  {isEditing ? (
                    <>
                      <Check className="w-4 h-4 text-[#00E5FF]" />
                      <span>Concluir</span>
                    </>
                  ) : (
                    <>
                      <Sliders className="w-4 h-4" />
                      <span>Ajustar</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
