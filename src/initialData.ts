import { VirtualDevice, FileItem, AppShortcut, EmulatorSettings, LogEntry } from './types';

export const INITIAL_DEVICES: VirtualDevice[] = [
  {
    id: 'dev-a34-ios',
    name: 'Container iOS 17 Visual (A34)',
    model: 'iPhone 15 Pro Sim',
    osFamily: 'iOS Visual',
    resolution: '1080x2340 (A34 Nativo)',
    memoryMB: 4096,
    storageGB: 64,
    usedStorageGB: 14.2,
    status: 'Em Execução',
    refreshRate: 120,
    createdAt: '2026-10-15',
  },
  {
    id: 'dev-macos-desk',
    name: 'macOS Sonoma Workspace',
    model: 'macOS Sonoma Container',
    osFamily: 'macOS Visual',
    resolution: '1920x1080 (FHD)',
    memoryMB: 6144,
    storageGB: 128,
    usedStorageGB: 28.6,
    status: 'Parado',
    refreshRate: 60,
    createdAt: '2026-10-20',
  },
  {
    id: 'dev-ipad-pro',
    name: 'iPadOS Stage Manager Sim',
    model: 'iPad Pro M2 Sim',
    osFamily: 'iPadOS Visual',
    resolution: '2560x1440 (QHD)',
    memoryMB: 8192,
    storageGB: 128,
    usedStorageGB: 19.4,
    status: 'Suspenso',
    refreshRate: 120,
    createdAt: '2026-10-28',
  },
];

export const INITIAL_FILES: FileItem[] = [
  {
    id: 'folder-system',
    name: 'Sistema & Perfis A34',
    type: 'folder',
    parentId: null,
    sizeBytes: 0,
    modifiedAt: '02 Nov 2026, 10:15',
  },
  {
    id: 'folder-apps',
    name: 'Pacotes Compatíveis',
    type: 'folder',
    parentId: null,
    sizeBytes: 0,
    modifiedAt: '02 Nov 2026, 11:02',
  },
  {
    id: 'folder-media',
    name: 'Capturas & Wallpapers',
    type: 'folder',
    parentId: null,
    sizeBytes: 0,
    modifiedAt: '01 Nov 2026, 18:40',
  },
  {
    id: 'file-readme',
    name: 'Manual_Arquitetura_A34.txt',
    type: 'document',
    parentId: null,
    sizeBytes: 4280,
    modifiedAt: '02 Nov 2026, 09:30',
    content: `APPLE EMULATOR A34 — DOCUMENTAÇÃO DE ARQUITETURA (v1.0)
=========================================================
Dispositivo Alvo: Samsung Galaxy A34 5G (SM-A346M)
SoC de Referência: MediaTek Dimensity 1080 (2x Cortex-A78 @ 2.6GHz + 6x Cortex-A55 @ 2.0GHz)
GPU: Mali-G68 MC4 | Display: Super AMOLED 1080x2340 (120Hz)

AVISO TÉCNICO IMPORTANTE:
Este aplicativo é um ambiente de simulação visual e organizador de containers web/HTML5 inspirado nas diretrizes visuais do macOS e iOS.
Ele NÃO executa binários proprietários da Apple (.ipa criptografados ou kernel XNU) sem um motor de virtualização/emulação compatível e devidamente autorizado.

ESTRUTURA PREPARADA PARA APK ANDROID:
- Camada WebView Bridge: Pronta para comunicação via window.AndroidBridge
- Armazenamento Virtual: Isolado em sandbox local e persistente
- Modo Gamer: Mapeamento de eventos Touch e Gamepad API com suporte a 120Hz`,
  },
  {
    id: 'file-config-a34',
    name: 'galaxy_a34_display_profile.json',
    type: 'config',
    parentId: 'folder-system',
    sizeBytes: 1840,
    modifiedAt: '02 Nov 2026, 10:15',
    content: `{
  "device": "Samsung Galaxy A34 5G",
  "modelCode": "SM-A346B/DSN",
  "display": {
    "width": 1080,
    "height": 2340,
    "aspectRatio": "19.5:9",
    "refreshRateHz": 120,
    "safeAreaInsetTop": 32,
    "safeAreaInsetBottom": 24
  },
  "simulationEngine": "HTML5-GlassCore-v1.0",
  "authorizedModeOnly": true
}`,
  },
  {
    id: 'file-wall-1',
    name: 'Sonoma_Neon_A34_Wallpaper.png',
    type: 'image',
    parentId: 'folder-media',
    sizeBytes: 2458000,
    modifiedAt: '01 Nov 2026, 18:40',
    previewGradient: 'linear-gradient(135deg, #020617 0%, #004080 50%, #00E5FF 100%)',
    content: 'Wallpaper oficial em alta definição 1080x2340 com ondas em preto profundo e azul neon para telas Super AMOLED.',
  },
  {
    id: 'file-wall-2',
    name: 'iOS_Glass_Dark_Mesh.png',
    type: 'image',
    parentId: 'folder-media',
    sizeBytes: 1920000,
    modifiedAt: '01 Nov 2026, 19:12',
    previewGradient: 'linear-gradient(135deg, #090D16 0%, #1E293B 45%, #007AFF 100%)',
    content: 'Textura translúcida inspirada no efeito Glassmorphism com contraste otimizado para economia de bateria em telas OLED.',
  },
  {
    id: 'file-pkg-1',
    name: 'Arcade_Racer_Neon.simpkg',
    type: 'package',
    parentId: 'folder-apps',
    sizeBytes: 15400000,
    modifiedAt: '02 Nov 2026, 11:02',
    content: 'Pacote de simulação HTML5 compatível com o Modo Gamer e controles virtuais.',
  },
];

export const INITIAL_APPS: AppShortcut[] = [
  {
    id: 'app-finder',
    name: 'Arquivos Finder',
    category: 'Sistema',
    version: '1.0.4',
    sizeMB: 12.4,
    iconName: 'FolderOpen',
    accentColor: '#007AFF',
    isPinned: true,
    packageFormat: '.webbundle',
    description: 'Gerenciador de diretórios virtuais, documentos e imagens com suporte a importação local.',
  },
  {
    id: 'app-devices',
    name: 'Containers Virtuais',
    category: 'Sistema',
    version: '1.0.2',
    sizeMB: 18.0,
    iconName: 'Smartphone',
    accentColor: '#00E5FF',
    isPinned: true,
    packageFormat: '.webbundle',
    description: 'Configuração de perfis visuais iOS e macOS ajustados para a tela 19.5:9 do Galaxy A34.',
  },
  {
    id: 'app-gamer',
    name: 'Neon Arcade Hub',
    category: 'Jogos',
    version: '2.1.0',
    sizeMB: 45.8,
    iconName: 'Gamepad2',
    accentColor: '#38BDF8',
    isPinned: true,
    packageFormat: '.simpkg',
    description: 'Ambiente de simulação interativa com joystick analógico virtual, botões customizáveis e telemetria 120Hz.',
  },
  {
    id: 'app-monitor',
    name: 'Monitor Activity',
    category: 'Utilitários',
    version: '1.1.0',
    sizeMB: 8.6,
    iconName: 'Activity',
    accentColor: '#00E5FF',
    isPinned: true,
    packageFormat: '.webbundle',
    description: 'Inspeção de memória simulada, uso de GPU Mali-G68 e logs do sistema em tempo real.',
  },
  {
    id: 'app-notes',
    name: 'Notas Studio',
    category: 'Produtividade',
    version: '1.0.0',
    sizeMB: 6.2,
    iconName: 'FileText',
    accentColor: '#007AFF',
    isPinned: false,
    packageFormat: '.html5',
    description: 'Editor rápido de textos e scripts de configuração para perfis de simulação.',
  },
  {
    id: 'app-calc',
    name: 'Calc Científica',
    category: 'Utilitários',
    version: '1.0.1',
    sizeMB: 4.1,
    iconName: 'Calculator',
    accentColor: '#64748B',
    isPinned: false,
    packageFormat: '.html5',
    description: 'Calculadora de precisão com layout inspirado no macOS.',
  },
];

export const DEFAULT_SETTINGS: EmulatorSettings = {
  theme: 'dark',
  glassIntensity: 'high',
  neonAccent: '#00E5FF',
  resolutionScale: '1.0x (1080x2340 Nativo A34)',
  targetFps: 120,
  audioEnabled: true,
  audioVolume: 80,
  lowLatencyAudio: true,
  hapticFeedback: true,
  touchSensitivity: 75,
  allocatedRamMB: 4096,
  storageLimitGB: 64,
  graphicsBackend: 'WebGL 2.0 (Mali-G68 MP4)',
  vsync: true,
  showFpsOverlay: true,
};

export const INITIAL_LOGS: LogEntry[] = [
  {
    id: 'log-1',
    timestamp: '11:55:01',
    level: 'SYS',
    module: 'BootLoader',
    message: 'Apple Emulator A34 v1.0 inicializado no perfil Samsung Galaxy A34 (1080x2340 @ 120Hz).',
  },
  {
    id: 'log-2',
    timestamp: '11:55:02',
    level: 'INFO',
    module: 'GraphicsCore',
    message: 'Compositor Glassmorphism ativo via WebGL 2.0 (Mali-G68 MP4 Sim).',
  },
  {
    id: 'log-3',
    timestamp: '11:55:04',
    level: 'INFO',
    module: 'StorageVFS',
    message: 'Sistema de arquivos virtual montado com sucesso (64 GB alocados).',
  },
  {
    id: 'log-4',
    timestamp: '11:55:06',
    level: 'WARN',
    module: 'Compliance',
    message: 'Modo de simulação visual ativo. Execução restrita a pacotes autorizados e web containers.',
  },
];
