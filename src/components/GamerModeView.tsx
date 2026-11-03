import React, { useState, useRef, useEffect } from 'react';
import {
  Gamepad2,
  Maximize2,
  Minimize2,
  Sliders,
  RotateCcw,
  Zap,
  Crosshair,
} from 'lucide-react';
import { EmulatorSettings } from '../types';

interface GamerModeViewProps {
  settings: EmulatorSettings;
  onUpdateSettings: (partial: Partial<EmulatorSettings>) => void;
  onAddLog: (module: string, message: string, level?: 'INFO' | 'WARN' | 'SYS') => void;
}

export const GamerModeView: React.FC<GamerModeViewProps> = ({
  settings,
  onUpdateSettings,
  onAddLog,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [joystickPos, setJoystickPos] = useState({ x: 0, y: 0 });
  const [isDraggingStick, setIsDraggingStick] = useState(false);
  const [activeButtons, setActiveButtons] = useState<string[]>([]);
  const [buttonLayoutPreset, setButtonLayoutPreset] = useState<'padrao' | 'ergonomico' | 'compacto'>('padrao');
  const [buttonOpacity, setButtonOpacity] = useState(85);
  const [buttonScale, setButtonScale] = useState(100);

  // Simulated ship/cursor inside the viewport driven by the virtual joystick
  const [shipCoords, setShipCoords] = useState({ x: 50, y: 55 });
  const [score, setScore] = useState(1240);
  const [orbCoords, setOrbCoords] = useState({ x: 72, y: 35 });

  const arenaRef = useRef<HTMLDivElement | null>(null);
  const stickBaseRef = useRef<HTMLDivElement | null>(null);

  // Move ship according to joystick vector & sensitivity
  useEffect(() => {
    if (joystickPos.x === 0 && joystickPos.y === 0) return;

    const speedFactor = (settings.touchSensitivity / 100) * 1.6;
    const interval = setInterval(() => {
      setShipCoords((prev) => {
        const nextX = Math.max(8, Math.min(92, prev.x + (joystickPos.x / 40) * speedFactor));
        const nextY = Math.max(12, Math.min(86, prev.y + (joystickPos.y / 40) * speedFactor));

        // Check orb collection
        const dist = Math.hypot(nextX - orbCoords.x, nextY - orbCoords.y);
        if (dist < 8) {
          setScore((s) => s + 150);
          setOrbCoords({
            x: Math.floor(15 + Math.random() * 70),
            y: Math.floor(20 + Math.random() * 55),
          });
        }

        return { x: nextX, y: nextY };
      });
    }, 16);

    return () => clearInterval(interval);
  }, [joystickPos, settings.touchSensitivity, orbCoords]);

  const handleStickMove = (clientX: number, clientY: number) => {
    if (!stickBaseRef.current) return;
    const rect = stickBaseRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = clientX - centerX;
    const dy = clientY - centerY;
    const maxRadius = 42;
    const distance = Math.min(maxRadius, Math.hypot(dx, dy));
    const angle = Math.atan2(dy, dx);

    setJoystickPos({
      x: Math.round(Math.cos(angle) * distance),
      y: Math.round(Math.sin(angle) * distance),
    });
  };

  const handlePressButton = (btn: string) => {
    setActiveButtons((prev) => (prev.includes(btn) ? prev : [...prev, btn]));
    if (btn === 'A') {
      setScore((s) => s + 25);
    }
  };

  const handleReleaseButton = (btn: string) => {
    setActiveButtons((prev) => prev.filter((item) => item !== btn));
  };

  const toggleFullScreenArena = () => {
    const nextState = !isFullscreen;
    setIsFullscreen(nextState);
    onAddLog(
      'GamerHUD',
      nextState
        ? 'Modo Tela Cheia 120Hz ativado para o controle virtual.'
        : 'Modo Tela Cheia encerrado.',
      'INFO'
    );
  };

  const resetCustomization = () => {
    setButtonLayoutPreset('padrao');
    setButtonOpacity(85);
    setButtonScale(100);
    onUpdateSettings({ touchSensitivity: 75 });
    onAddLog('GamerHUD', 'Layout do controle virtual restaurado para o padrão Galaxy A34.', 'INFO');
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Modo Gamer &amp; Controle Virtual A34
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Joystick analógico virtual, botões personalizáveis, ajuste de sensibilidade e modo tela cheia
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={resetCustomization}
            className="min-h-[44px] px-3.5 py-2 rounded-xl bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-medium text-slate-700 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-[#007AFF] dark:text-[#00E5FF]" />
            <span>Restaurar Padrão</span>
          </button>

          <button
            onClick={toggleFullScreenArena}
            className="min-h-[44px] px-4 py-2 rounded-xl bg-gradient-to-r from-[#007AFF] to-[#00E5FF] text-white text-xs font-semibold flex items-center gap-2 shadow-[0_0_20px_rgba(0,229,255,0.3)] cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            <span>{isFullscreen ? 'Sair da Tela Cheia' : 'Modo Tela Cheia'}</span>
          </button>
        </div>
      </div>

      {/* Interactive Virtual Gamepad Viewport */}
      <div
        ref={arenaRef}
        className={`${
          isFullscreen
            ? 'fixed inset-0 z-50 rounded-none p-4 sm:p-8'
            : 'relative rounded-3xl min-h-[440px] sm:min-h-[480px] p-5 sm:p-7'
        } bg-[#04070F] border border-cyan-500/30 shadow-[0_0_40px_rgba(0,229,255,0.12)] flex flex-col justify-between overflow-hidden select-none`}
      >
        {/* Subtle grid background */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 50% 40%, rgba(0, 229, 255, 0.25), transparent 65%), linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '100% 100%, 36px 36px, 36px 36px',
          }}
        />

        {/* Top HUD Telemetry Bar */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 bg-slate-900/75 backdrop-blur-md border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-slate-300">
          <div className="flex items-center gap-3 font-mono tabular-nums">
            <span className="text-[#00E5FF] font-semibold">HUD A34 GAMER</span>
            <span>·</span>
            <span>{settings.targetFps} FPS</span>
            <span>·</span>
            <span>SENS: {settings.touchSensitivity}%</span>
          </div>

          <div className="flex items-center gap-3 font-mono tabular-nums">
            <span className="text-cyan-300">SCORE: {score}</span>
            {isFullscreen && (
              <button
                onClick={toggleFullScreenArena}
                className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-sans font-medium cursor-pointer"
              >
                Fechar Tela Cheia
              </button>
            )}
          </div>
        </div>

        {/* Interactive Canvas Simulation Area (Controlled by Virtual Stick & Buttons) */}
        <div className="relative z-10 flex-1 my-4 flex items-center justify-center">
          {/* Target Energy Orb */}
          <div
            className="absolute w-7 h-7 -ml-3.5 -mt-3.5 rounded-full bg-[#00E5FF]/30 border border-[#00E5FF] flex items-center justify-center shadow-[0_0_20px_#00E5FF] transition-all duration-150"
            style={{ left: `${orbCoords.x}%`, top: `${orbCoords.y}%` }}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-white" />
          </div>

          {/* Player Controlled Vector Probe */}
          <div
            className="absolute w-11 h-11 -ml-5.5 -mt-5.5 rounded-2xl bg-gradient-to-br from-[#007AFF] to-[#00E5FF] border border-white/60 flex items-center justify-center text-white shadow-[0_0_28px_rgba(0,229,255,0.65)] transition-transform duration-75"
            style={{
              left: `${shipCoords.x}%`,
              top: `${shipCoords.y}%`,
              transform: activeButtons.includes('A') ? 'scale(1.2)' : 'scale(1)',
            }}
          >
            <Crosshair className="w-5 h-5" />
          </div>

          <div className="pointer-events-none text-center px-4">
            <p className="text-xs font-mono text-slate-400/80">
              Arraste o Joystick Virtual à esquerda para mover o cursor neon até o alvo
            </p>
            {activeButtons.length > 0 && (
              <p className="text-xs font-mono text-[#00E5FF] mt-1">
                COMANDO ATIVO: [{activeButtons.join(' + ')}]
              </p>
            )}
          </div>
        </div>

        {/* Bottom On-Screen Touch Controls (Virtual Joystick + Customizable Action Pad) */}
        <div
          className="relative z-20 flex items-end justify-between gap-4 pt-2"
          style={{ opacity: buttonOpacity / 100 }}
        >
          {/* Left Analog Virtual Joystick */}
          <div className="flex flex-col items-center gap-2">
            <div
              ref={stickBaseRef}
              onPointerDown={(e) => {
                e.currentTarget.setPointerCapture(e.pointerId);
                setIsDraggingStick(true);
                handleStickMove(e.clientX, e.clientY);
              }}
              onPointerMove={(e) => {
                if (!isDraggingStick) return;
                handleStickMove(e.clientX, e.clientY);
              }}
              onPointerUp={() => {
                setIsDraggingStick(false);
                setJoystickPos({ x: 0, y: 0 });
              }}
              onPointerCancel={() => {
                setIsDraggingStick(false);
                setJoystickPos({ x: 0, y: 0 });
              }}
              style={{ transform: `scale(${buttonScale / 100})` }}
              className="w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-slate-900/80 backdrop-blur-xl border-2 border-[#00E5FF]/40 shadow-[0_0_25px_rgba(0,229,255,0.18)] flex items-center justify-center relative touch-none cursor-grab active:cursor-grabbing"
            >
              <div className="w-16 h-16 rounded-full border border-white/10 pointer-events-none" />
              <div
                style={{
                  transform: `translate(${joystickPos.x}px, ${joystickPos.y}px)`,
                }}
                className="w-14 h-14 rounded-full bg-gradient-to-b from-[#00E5FF] to-[#007AFF] border-2 border-white/70 shadow-[0_0_20px_rgba(0,229,255,0.6)] flex items-center justify-center text-slate-950 font-mono text-[10px] font-bold pointer-events-none"
              >
                L3
              </div>
            </div>
            <span className="text-[11px] font-mono text-slate-400 tabular-nums">
              X:{joystickPos.x} Y:{joystickPos.y}
            </span>
          </div>

          {/* Center L1 / R1 / Start / Select Shoulder Bar */}
          <div className="hidden sm:flex items-center gap-2 mb-4">
            {['L1', 'SELECT', 'START', 'R1'].map((shoulder) => (
              <button
                key={shoulder}
                onPointerDown={() => handlePressButton(shoulder)}
                onPointerUp={() => handleReleaseButton(shoulder)}
                onPointerLeave={() => handleReleaseButton(shoulder)}
                className={`min-h-[40px] px-3.5 py-1.5 rounded-xl font-mono text-xs font-semibold border transition-all cursor-pointer ${
                  activeButtons.includes(shoulder)
                    ? 'bg-[#00E5FF] text-slate-950 border-white shadow-[0_0_15px_#00E5FF]'
                    : 'bg-slate-900/80 text-slate-300 border-white/15 hover:border-[#00E5FF]/50'
                }`}
              >
                {shoulder}
              </button>
            ))}
          </div>

          {/* Right Customizable Diamond Action Buttons (Y, X, B, A) */}
          <div
            style={{ transform: `scale(${buttonScale / 100})` }}
            className={`relative w-36 h-36 sm:w-40 sm:h-40 ${
              buttonLayoutPreset === 'ergonomico'
                ? '-translate-y-3'
                : buttonLayoutPreset === 'compacto'
                ? 'scale-90'
                : ''
            }`}
          >
            {/* Top Button: Y */}
            <button
              onPointerDown={() => handlePressButton('Y')}
              onPointerUp={() => handleReleaseButton('Y')}
              onPointerLeave={() => handleReleaseButton('Y')}
              className={`absolute top-0 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full font-mono text-sm font-bold border-2 flex items-center justify-center transition-transform cursor-pointer ${
                activeButtons.includes('Y')
                  ? 'bg-[#00E5FF] text-slate-950 border-white scale-95 shadow-[0_0_20px_#00E5FF]'
                  : 'bg-slate-900/85 text-white border-[#00E5FF]/50'
              }`}
            >
              Y
            </button>

            {/* Left Button: X */}
            <button
              onPointerDown={() => handlePressButton('X')}
              onPointerUp={() => handleReleaseButton('X')}
              onPointerLeave={() => handleReleaseButton('X')}
              className={`absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full font-mono text-sm font-bold border-2 flex items-center justify-center transition-transform cursor-pointer ${
                activeButtons.includes('X')
                  ? 'bg-[#00E5FF] text-slate-950 border-white scale-95 shadow-[0_0_20px_#00E5FF]'
                  : 'bg-slate-900/85 text-white border-[#007AFF]/60'
              }`}
            >
              X
            </button>

            {/* Right Button: B */}
            <button
              onPointerDown={() => handlePressButton('B')}
              onPointerUp={() => handleReleaseButton('B')}
              onPointerLeave={() => handleReleaseButton('B')}
              className={`absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full font-mono text-sm font-bold border-2 flex items-center justify-center transition-transform cursor-pointer ${
                activeButtons.includes('B')
                  ? 'bg-[#00E5FF] text-slate-950 border-white scale-95 shadow-[0_0_20px_#00E5FF]'
                  : 'bg-slate-900/85 text-white border-[#007AFF]/60'
              }`}
            >
              B
            </button>

            {/* Bottom Button: A */}
            <button
              onPointerDown={() => handlePressButton('A')}
              onPointerUp={() => handleReleaseButton('A')}
              onPointerLeave={() => handleReleaseButton('A')}
              className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full font-mono text-sm font-bold border-2 flex items-center justify-center transition-transform cursor-pointer ${
                activeButtons.includes('A')
                  ? 'bg-[#00E5FF] text-slate-950 border-white scale-95 shadow-[0_0_20px_#00E5FF]'
                  : 'bg-gradient-to-b from-[#007AFF] to-blue-700 text-white border-[#00E5FF]'
              }`}
            >
              A
            </button>
          </div>
        </div>
      </div>

      {/* Control Customization & Sensitivity Panel */}
      <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/65 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div>
          <div className="flex justify-between text-xs font-medium mb-2">
            <span className="text-slate-700 dark:text-slate-300">Sensibilidade do Joystick</span>
            <span className="font-mono text-[#007AFF] dark:text-[#00E5FF]">
              {settings.touchSensitivity}%
            </span>
          </div>
          <input
            type="range"
            min={25}
            max={150}
            value={settings.touchSensitivity}
            onChange={(e) => onUpdateSettings({ touchSensitivity: Number(e.target.value) })}
            className="w-full accent-[#00E5FF] cursor-pointer"
          />
          <span className="text-[11px] text-slate-400 block mt-1">
            Taxa de resposta de toque (240Hz Touch Sampling A34)
          </span>
        </div>

        <div>
          <div className="flex justify-between text-xs font-medium mb-2">
            <span className="text-slate-700 dark:text-slate-300">Tamanho dos Botões</span>
            <span className="font-mono text-[#007AFF] dark:text-[#00E5FF]">{buttonScale}%</span>
          </div>
          <input
            type="range"
            min={80}
            max={125}
            value={buttonScale}
            onChange={(e) => setButtonScale(Number(e.target.value))}
            className="w-full accent-[#00E5FF] cursor-pointer"
          />
          <span className="text-[11px] text-slate-400 block mt-1">
            Escala ergonômica para tela de 6.6 polegadas
          </span>
        </div>

        <div>
          <div className="flex justify-between text-xs font-medium mb-2">
            <span className="text-slate-700 dark:text-slate-300">Opacidade do HUD</span>
            <span className="font-mono text-[#007AFF] dark:text-[#00E5FF]">{buttonOpacity}%</span>
          </div>
          <input
            type="range"
            min={35}
            max={100}
            value={buttonOpacity}
            onChange={(e) => setButtonOpacity(Number(e.target.value))}
            className="w-full accent-[#00E5FF] cursor-pointer"
          />
          <span className="text-[11px] text-slate-400 block mt-1">
            Transparência Glassmorphism sobre a tela
          </span>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
            Disposição dos Botões
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {(['padrao', 'ergonomico', 'compacto'] as const).map((preset) => (
              <button
                key={preset}
                onClick={() => setButtonLayoutPreset(preset)}
                className={`min-h-[38px] px-2 py-1.5 rounded-xl text-xs font-medium capitalize transition-colors cursor-pointer ${
                  buttonLayoutPreset === preset
                    ? 'bg-[#007AFF] text-white dark:bg-[#00E5FF] dark:text-slate-950'
                    : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
