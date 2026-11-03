import React, { useState, useRef } from 'react';
import {
  Folder,
  FolderPlus,
  Upload,
  FileText,
  Image as ImageIcon,
  Package,
  Trash2,
  ArrowLeft,
  CheckSquare,
  Square,
  Eye,
  X,
  FolderInput,
} from 'lucide-react';
import { FileItem } from '../types';

interface FileManagerViewProps {
  files: FileItem[];
  onAddFile: (file: Omit<FileItem, 'id' | 'modifiedAt'>) => void;
  onDeleteFiles: (ids: string[]) => void;
  onMoveFiles: (ids: string[], targetFolderId: string | null) => void;
  onAddLog: (module: string, message: string, level?: 'INFO' | 'WARN' | 'SYS') => void;
}

export const FileManagerView: React.FC<FileManagerViewProps> = ({
  files,
  onAddFile,
  onDeleteFiles,
  onMoveFiles,
  onAddLog,
}) => {
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [previewItem, setPreviewItem] = useState<FileItem | null>(null);
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [showMoveMenu, setShowMoveMenu] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const currentFolder = files.find((f) => f.id === currentFolderId) || null;
  const visibleFiles = files.filter((f) => f.parentId === currentFolderId);
  const allFolders = files.filter((f) => f.type === 'folder');

  const formatSize = (bytes: number) => {
    if (bytes === 0) return 'Pasta';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    onAddFile({
      name: newFolderName.trim(),
      type: 'folder',
      parentId: currentFolderId,
      sizeBytes: 0,
    });
    onAddLog('FinderVFS', `Nova pasta criada: "${newFolderName.trim()}".`, 'INFO');
    setNewFolderName('');
    setShowNewFolderInput(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files;
    if (!uploaded || uploaded.length === 0) return;

    Array.from(uploaded).forEach((file) => {
      const isImage = file.type.startsWith('image/');
      const isText =
        file.type.startsWith('text/') ||
        file.name.endsWith('.json') ||
        file.name.endsWith('.md') ||
        file.name.endsWith('.txt');

      const reader = new FileReader();
      reader.onload = () => {
        onAddFile({
          name: file.name,
          type: isImage ? 'image' : isText ? 'document' : 'package',
          parentId: currentFolderId,
          sizeBytes: file.size || 2048,
          content: typeof reader.result === 'string' ? reader.result : 'Arquivo importado para a sandbox A34.',
        });
        onAddLog('FinderVFS', `Arquivo importado: "${file.name}" (${formatSize(file.size)}).`, 'INFO');
      };

      if (isImage || isText) {
        reader.readAsDataURL(file);
      } else {
        onAddFile({
          name: file.name,
          type: 'package',
          parentId: currentFolderId,
          sizeBytes: file.size || 10240,
          content: `Pacote compatível importado: ${file.name}`,
        });
        onAddLog('FinderVFS', `Pacote importado: "${file.name}".`, 'INFO');
      }
    });

    e.target.value = '';
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return;
    onDeleteFiles(selectedIds);
    onAddLog('FinderVFS', `${selectedIds.length} item(ns) removido(s) do diretório virtual.`, 'WARN');
    setSelectedIds([]);
  };

  const handleMoveSelected = (targetFolderId: string | null) => {
    if (selectedIds.length === 0) return;
    onMoveFiles(selectedIds, targetFolderId);
    onAddLog('FinderVFS', `${selectedIds.length} item(ns) organizado(s) em nova pasta.`, 'INFO');
    setSelectedIds([]);
    setShowMoveMenu(false);
  };

  return (
    <div className="space-y-5 pb-8">
      {/* Top Header & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Gerenciador de Arquivos Finder
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Selecione, importe, crie pastas e visualize imagens ou documentos no diretório virtual
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileUpload}
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="min-h-[44px] px-4 py-2 rounded-xl bg-gradient-to-r from-[#007AFF] to-[#00E5FF] text-white text-xs font-semibold flex items-center gap-2 shadow-[0_0_20px_rgba(0,229,255,0.2)] cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>Importar Arquivo</span>
          </button>

          <button
            onClick={() => setShowNewFolderInput((prev) => !prev)}
            className="min-h-[44px] px-3.5 py-2 rounded-xl bg-white/80 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-xs font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2 cursor-pointer"
          >
            <FolderPlus className="w-4 h-4 text-[#007AFF] dark:text-[#00E5FF]" />
            <span>Nova Pasta</span>
          </button>
        </div>
      </div>

      {/* Create Folder Inline Bar */}
      {showNewFolderInput && (
        <form
          onSubmit={handleCreateFolder}
          className="p-4 rounded-2xl bg-white/90 dark:bg-slate-900/80 border border-[#00E5FF]/40 flex flex-wrap items-center gap-3"
        >
          <input
            type="text"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="Nome da nova pasta..."
            className="flex-1 min-w-[200px] min-h-[42px] px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-white/15 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#00E5FF]"
            autoFocus
            required
          />
          <button
            type="submit"
            className="min-h-[42px] px-4 py-2 rounded-xl bg-[#007AFF] text-white text-xs font-semibold cursor-pointer"
          >
            Criar Pasta
          </button>
          <button
            type="button"
            onClick={() => setShowNewFolderInput(false)}
            className="min-h-[42px] px-3 py-2 rounded-xl text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white cursor-pointer"
          >
            Cancelar
          </button>
        </form>
      )}

      {/* Breadcrumb & Multi-Selection Toolbar */}
      <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/65 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200">
          {currentFolderId && (
            <button
              onClick={() => {
                setCurrentFolderId(null);
                setSelectedIds([]);
              }}
              className="min-h-[38px] px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-white/10 hover:bg-slate-200 flex items-center gap-1 text-xs cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Raiz A34</span>
            </button>
          )}
          <span className="text-slate-400">/</span>
          <span className="font-semibold text-slate-900 dark:text-white">
            {currentFolder ? currentFolder.name : 'Diretório Principal (Root)'}
          </span>
        </div>

        {/* Selection Organization Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {selectedIds.length > 0 ? (
            <>
              <span className="text-xs font-mono text-[#007AFF] dark:text-[#00E5FF] mr-1">
                {selectedIds.length} selecionado(s)
              </span>
              <div className="relative">
                <button
                  onClick={() => setShowMoveMenu((prev) => !prev)}
                  className="min-h-[38px] px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-white/10 text-xs font-medium text-slate-800 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer"
                >
                  <FolderInput className="w-3.5 h-3.5 text-[#00E5FF]" />
                  <span>Mover Para</span>
                </button>
                {showMoveMenu && (
                  <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/15 shadow-xl p-2 z-30 space-y-1">
                    <button
                      onClick={() => handleMoveSelected(null)}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 cursor-pointer"
                    >
                      / Diretório Raiz
                    </button>
                    {allFolders
                      .filter((f) => !selectedIds.includes(f.id))
                      .map((folder) => (
                        <button
                          key={folder.id}
                          onClick={() => handleMoveSelected(folder.id)}
                          className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 truncate cursor-pointer"
                        >
                          📁 {folder.name}
                        </button>
                      ))}
                  </div>
                )}
              </div>

              <button
                onClick={handleDeleteSelected}
                className="min-h-[38px] px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-medium flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Excluir</span>
              </button>
            </>
          ) : (
            <span className="text-xs text-slate-400">
              Toque na caixa de seleção para organizar arquivos
            </span>
          )}
        </div>
      </div>

      {/* Files & Folders Grid/List */}
      <div className="rounded-3xl bg-white/80 dark:bg-slate-900/65 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 divide-y divide-slate-200/60 dark:divide-white/10 overflow-hidden">
        {visibleFiles.length === 0 ? (
          <div className="p-12 text-center">
            <Folder className="w-10 h-10 text-slate-400 mx-auto mb-2 stroke-[1.5]" />
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Esta pasta está vazia
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Use o botão &ldquo;Importar Arquivo&rdquo; ou &ldquo;Nova Pasta&rdquo; acima.
            </p>
          </div>
        ) : (
          visibleFiles.map((item) => {
            const isSelected = selectedIds.includes(item.id);
            return (
              <div
                key={item.id}
                className={`p-4 flex items-center justify-between gap-3 transition-colors ${
                  isSelected
                    ? 'bg-[#007AFF]/10 dark:bg-[#00E5FF]/10'
                    : 'hover:bg-slate-50/80 dark:hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <button
                    onClick={() => toggleSelect(item.id)}
                    className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-400 hover:text-[#007AFF] dark:hover:text-[#00E5FF] cursor-pointer shrink-0"
                    title="Selecionar item"
                  >
                    {isSelected ? (
                      <CheckSquare className="w-5 h-5 text-[#007AFF] dark:text-[#00E5FF]" />
                    ) : (
                      <Square className="w-5 h-5" />
                    )}
                  </button>

                  <div
                    onClick={() => {
                      if (item.type === 'folder') {
                        setCurrentFolderId(item.id);
                        setSelectedIds([]);
                      } else {
                        setPreviewItem(item);
                      }
                    }}
                    className="flex items-center gap-3.5 min-w-0 flex-1 cursor-pointer"
                  >
                    <div className="w-11 h-11 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                      {item.type === 'folder' && (
                        <Folder className="w-5 h-5 text-[#007AFF] dark:text-[#00E5FF] fill-current" />
                      )}
                      {item.type === 'image' && (
                        <ImageIcon className="w-5 h-5 text-cyan-500" />
                      )}
                      {(item.type === 'document' || item.type === 'config') && (
                        <FileText className="w-5 h-5 text-blue-500" />
                      )}
                      {item.type === 'package' && (
                        <Package className="w-5 h-5 text-indigo-400" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                        {item.name}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <span className="font-mono tabular-nums">
                          {formatSize(item.sizeBytes)}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{item.modifiedAt}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => {
                    if (item.type === 'folder') {
                      setCurrentFolderId(item.id);
                      setSelectedIds([]);
                    } else {
                      setPreviewItem(item);
                    }
                  }}
                  className="min-h-[40px] px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-xs font-medium text-slate-700 dark:text-slate-200 flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-[#007AFF] dark:text-[#00E5FF]" />
                  <span>{item.type === 'folder' ? 'Abrir' : 'Visualizar'}</span>
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Preview Modal for Images & Documents */}
      {previewItem && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-2xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/15 shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
              <div className="min-w-0">
                <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                  {previewItem.name}
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  {formatSize(previewItem.sizeBytes)} · {previewItem.modifiedAt}
                </p>
              </div>
              <button
                onClick={() => setPreviewItem(null)}
                className="min-h-[40px] min-w-[40px] rounded-xl bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-600 dark:text-slate-300 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {previewItem.type === 'image' ? (
                <div className="space-y-4">
                  {previewItem.content?.startsWith('data:image') ? (
                    <img
                      src={previewItem.content}
                      alt={previewItem.name}
                      referrerPolicy="no-referrer"
                      className="w-full max-h-96 object-contain rounded-2xl border border-white/10"
                    />
                  ) : (
                    <div
                      className="w-full h-64 rounded-2xl flex flex-col items-center justify-center text-white p-6 text-center shadow-inner"
                      style={{
                        background:
                          previewItem.previewGradient ||
                          'linear-gradient(135deg, #020617 0%, #007AFF 100%)',
                      }}
                    >
                      <ImageIcon className="w-12 h-12 text-[#00E5FF] mb-2" />
                      <span className="text-sm font-semibold">{previewItem.name}</span>
                      <span className="text-xs text-slate-200 mt-1 max-w-md">
                        {previewItem.content}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <pre className="p-4 rounded-2xl bg-slate-950 text-slate-200 font-mono text-xs leading-relaxed overflow-x-auto whitespace-pre-wrap">
                  {previewItem.content || 'Sem conteúdo textual adicional.'}
                </pre>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
