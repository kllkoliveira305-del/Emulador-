import React, { useState, useRef } from 'react';
import {
  Grid,
  Plus,
  Upload,
  Pin,
  Trash2,
  FolderOpen,
  Smartphone,
  Gamepad2,
  Activity,
  FileText,
  Calculator,
  Sparkles,
  Play,
} from 'lucide-react';
import { AppShortcut } from '../types';

interface AppLibraryViewProps {
  apps: AppShortcut[];
  onAddApp: (app: Omit<AppShortcut, 'id'>) => void;
  onTogglePin: (id: string) => void;
  onDeleteApp: (id: string) => void;
  onLaunchAppModal: (app: AppShortcut) => void;
  onAddLog: (module: string, message: string, level?: 'INFO' | 'WARN' | 'SYS') => void;
}

export const AppLibraryView: React.FC<AppLibraryViewProps> = ({
  apps,
  onAddApp,
  onTogglePin,
  onDeleteApp,
  onLaunchAppModal,
  onAddLog,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [showAddForm, setShowAddForm] = useState(false);

  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<AppShortcut['category']>('Utilitários');
  const [newFormat, setNewFormat] = useState<AppShortcut['packageFormat']>('.html5');
  const [newDesc, setNewDesc] = useState('');

  const importInputRef = useRef<HTMLInputElement | null>(null);

  const categories = ['Todos', 'Fixados', 'Sistema', 'Jogos', 'Utilitários', 'Produtividade', 'Importado'];

  const filteredApps = apps.filter((app) => {
    if (selectedCategory === 'Todos') return true;
    if (selectedCategory === 'Fixados') return app.isPinned;
    return app.category === selectedCategory;
  });

  const handleCreateShortcut = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    onAddApp({
      name: newName.trim(),
      category: newCategory,
      version: '1.0.0',
      sizeMB: 5.4,
      iconName: 'Sparkles',
      accentColor: '#00E5FF',
      isPinned: true,
      packageFormat: newFormat,
      description:
        newDesc.trim() || 'Atalho personalizado criado para execução no container visual A34.',
    });

    onAddLog('AppLibrary', `Atalho de aplicativo "${newName.trim()}" adicionado à biblioteca.`, 'INFO');
    setNewName('');
    setNewDesc('');
    setShowAddForm(false);
  };

  const handleImportPackage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const cleanName = file.name.replace(/\.[^/.]+$/, '');
    onAddApp({
      name: cleanName,
      category: 'Importado',
      version: '1.0-imp',
      sizeMB: Number(Math.max(1.2, file.size / (1024 * 1024)).toFixed(1)),
      iconName: 'Gamepad2',
      accentColor: '#007AFF',
      isPinned: true,
      packageFormat: '.simpkg',
      description: `Pacote compatível importado (${file.name}) pronto para simulação.`,
    });

    onAddLog('AppLibrary', `Pacote compatível "${file.name}" importado para a biblioteca.`, 'INFO');
    e.target.value = '';
  };

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'FolderOpen':
        return <FolderOpen className="w-6 h-6" />;
      case 'Smartphone':
        return <Smartphone className="w-6 h-6" />;
      case 'Gamepad2':
        return <Gamepad2 className="w-6 h-6" />;
      case 'Activity':
        return <Activity className="w-6 h-6" />;
      case 'FileText':
        return <FileText className="w-6 h-6" />;
      case 'Calculator':
        return <Calculator className="w-6 h-6" />;
      default:
        return <Sparkles className="w-6 h-6" />;
    }
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Biblioteca de Aplicativos &amp; Atalhos
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Adicione aplicativos web, importe pacotes compatíveis, crie atalhos e organize por categorias
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <input
            ref={importInputRef}
            type="file"
            accept=".html,.htm,.zip,.json,.js,.simpkg,.webbundle"
            onChange={handleImportPackage}
            className="hidden"
          />

          <button
            onClick={() => importInputRef.current?.click()}
            className="min-h-[44px] px-4 py-2 rounded-xl bg-white/80 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-xs font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2 cursor-pointer"
          >
            <Upload className="w-4 h-4 text-[#007AFF] dark:text-[#00E5FF]" />
            <span>Importar Pacote Compatível</span>
          </button>

          <button
            onClick={() => setShowAddForm((prev) => !prev)}
            className="min-h-[44px] px-4 py-2 rounded-xl bg-gradient-to-r from-[#007AFF] to-[#00E5FF] text-white text-xs font-semibold flex items-center gap-2 shadow-[0_0_20px_rgba(0,229,255,0.25)] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Criar Atalho / App</span>
          </button>
        </div>
      </div>

      {/* Add Shortcut Form */}
      {showAddForm && (
        <form
          onSubmit={handleCreateShortcut}
          className="p-6 rounded-3xl bg-white/90 dark:bg-slate-900/80 backdrop-blur-xl border border-[#00E5FF]/40 space-y-4 shadow-xl"
        >
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Adicionar Aplicativo ou Criar Atalho
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Nome do Aplicativo
              </label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Ex: Safari Web Container"
                className="w-full min-h-[42px] px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-white/15 text-sm text-slate-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Categoria
              </label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as AppShortcut['category'])}
                className="w-full min-h-[42px] px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-white/15 text-sm text-slate-900 dark:text-white"
              >
                <option value="Utilitários">Utilitários</option>
                <option value="Jogos">Jogos</option>
                <option value="Produtividade">Produtividade</option>
                <option value="Sistema">Sistema</option>
                <option value="Importado">Importado</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Formato do Container
              </label>
              <select
                value={newFormat}
                onChange={(e) => setNewFormat(e.target.value as AppShortcut['packageFormat'])}
                className="w-full min-h-[42px] px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-white/15 text-sm font-mono text-slate-900 dark:text-white"
              >
                <option value=".html5">.html5 (Web App)</option>
                <option value=".webbundle">.webbundle (macOS Sim)</option>
                <option value=".simpkg">.simpkg (Gamer Container)</option>
                <option value=".Shortcut">.Shortcut (Atalho Rápido)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Descrição do Atalho
            </label>
            <input
              type="text"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Breve descrição da funcionalidade simulada..."
              className="w-full min-h-[42px] px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-white/15 text-sm text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="min-h-[42px] px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/5 text-xs font-medium text-slate-600 dark:text-slate-300 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="min-h-[42px] px-5 py-2 rounded-xl bg-gradient-to-r from-[#007AFF] to-[#00E5FF] text-white text-xs font-semibold cursor-pointer"
            >
              Salvar na Biblioteca
            </button>
          </div>
        </form>
      )}

      {/* Interactive Filter Control Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto p-1.5 rounded-2xl bg-slate-200/70 dark:bg-slate-900/80 border border-slate-300/60 dark:border-white/10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              selectedCategory === cat
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-[#00E5FF] shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* App Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredApps.map((app) => (
          <div
            key={app.id}
            className="p-5 rounded-3xl bg-white/80 dark:bg-slate-900/65 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 flex flex-col justify-between gap-4 shadow-sm"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${app.accentColor}, #020617)`,
                    }}
                  >
                    {renderIcon(app.iconName)}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {app.name}
                    </h3>
                    <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <span>{app.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">v{app.version}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">{app.sizeMB} MB</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onTogglePin(app.id)}
                    className={`min-h-[38px] min-w-[38px] rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
                      app.isPinned
                        ? 'text-[#007AFF] dark:text-[#00E5FF] bg-[#007AFF]/10 dark:bg-[#00E5FF]/10'
                        : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
                    }`}
                    title={app.isPinned ? 'Desafixar do início' : 'Fixar no início'}
                  >
                    <Pin className="w-4 h-4" />
                  </button>
                  {app.category !== 'Sistema' && (
                    <button
                      onClick={() => onDeleteApp(app.id)}
                      className="min-h-[38px] min-w-[38px] rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-500/10 flex items-center justify-center transition-colors cursor-pointer"
                      title="Remover atalho"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 mt-3.5 leading-relaxed">
                {app.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-200/70 dark:border-white/10 flex items-center justify-between gap-2">
              <span className="text-[11px] font-mono text-slate-400">{app.packageFormat}</span>
              <button
                onClick={() => onLaunchAppModal(app)}
                className="min-h-[40px] px-4 py-2 rounded-xl bg-gradient-to-r from-[#007AFF] to-[#00E5FF] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Simular Execução</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
