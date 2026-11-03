export type SectionId =
  | 'home'
  | 'devices'
  | 'files'
  | 'apps'
  | 'gamer'
  | 'settings'
  | 'system'
  | 'about';

export interface VirtualDevice {
  id: string;
  name: string;
  model: 'iPhone 15 Pro Sim' | 'iPad Pro M2 Sim' | 'macOS Sonoma Container' | 'iPhone SE Compact Sim';
  osFamily: 'iOS Visual' | 'iPadOS Visual' | 'macOS Visual';
  resolution: '1080x2340 (A34 Nativo)' | '1179x2556 (Retina)' | '1920x1080 (FHD)' | '2560x1440 (QHD)';
  memoryMB: 2048 | 4096 | 6144 | 8192;
  storageGB: 32 | 64 | 128 | 256;
  usedStorageGB: number;
  status: 'Parado' | 'Em Execução' | 'Suspenso';
  refreshRate: 60 | 120;
  createdAt: string;
}

export interface FileItem {
  id: string;
  name: string;
  type: 'folder' | 'image' | 'document' | 'package' | 'config';
  parentId: string | null;
  sizeBytes: number;
  modifiedAt: string;
  content?: string;
  previewGradient?: string;
  selected?: boolean;
}

export interface AppShortcut {
  id: string;
  name: string;
  category: 'Sistema' | 'Produtividade' | 'Jogos' | 'Utilitários' | 'Importado';
  version: string;
  sizeMB: number;
  iconName: string;
  accentColor: string;
  isPinned: boolean;
  packageFormat: '.webbundle' | '.simpkg' | '.html5' | '.Shortcut';
  description: string;
}

export interface EmulatorSettings {
  theme: 'dark' | 'light';
  glassIntensity: 'high' | 'medium' | 'minimal';
  neonAccent: '#007AFF' | '#00E5FF' | '#38BDF8';
  resolutionScale: '1.0x (1080x2340 Nativo A34)' | '0.75x (Modo Desempenho)' | '1.25x (Super Sampling)';
  targetFps: 60 | 120;
  audioEnabled: boolean;
  audioVolume: number;
  lowLatencyAudio: boolean;
  hapticFeedback: boolean;
  touchSensitivity: number;
  allocatedRamMB: number;
  storageLimitGB: number;
  graphicsBackend: 'WebGL 2.0 (Mali-G68 MP4)' | 'Vulkan Sim Wrapper' | 'Canvas 2D Acelerado';
  vsync: boolean;
  showFpsOverlay: boolean;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'SYS';
  module: string;
  message: string;
}

export interface GamepadButtonPos {
  id: string;
  label: string;
  x: number; // percentage
  y: number; // percentage
  size: number; // px
}
