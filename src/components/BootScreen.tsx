import React, { useEffect, useState } from 'react';
import { Cpu, Smartphone, ShieldCheck, Power } from 'lucide-react';

interface BootScreenProps {
  onComplete: () => void;
}

export const BootScreen: React.FC<BootScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [stageText, setStageText] = useState('Inicializando camada de interface Galaxy A34 (1080x2340 @ 120Hz)...');

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 4;
        if (next === 28) {
          setStageText('Carregando compositor Glassmorphism & shaders WebGL...');
        } else if (next === 56) {
          setStageText('Montando diretório virtual e perfis de simulação...');
        } else if (next === 84) {
          setStageText('Sincronizando controles táteis e ponte Android APK...');
        }
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 220);
          return 100;
        }
        return next;
      });
    }, 45);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-[#05070B] text-white p-6 select-none">
      {/* Top Hardware Specification Line */}
      <div className="w-full max-w-md flex items-center justify-between text-xs text-slate-400 font-mono pt-2">
        <span>TARGET: SM-A346M (GALAXY A34)</span>
        <span>120Hz AMOLED SIM</span>
      </div>

      {/* Center Apple-inspired & Neon A34 Emblem */}
      <div className="flex flex-col items-center max-w-sm w-full text-center my-auto">
        <div className="relative flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-b from-slate-800/80 to-slate-950/90 border border-cyan-400/30 shadow-[0_0_45px_rgba(0,229,255,0.2)] mb-6">
          <div className="absolute inset-0 rounded-3xl bg-cyan-500/10 blur-xl" />
          <div className="relative flex flex-col items-center">
            <Smartphone className="w-10 h-10 text-[#00E5FF] stroke-[1.75]" />
            <span className="text-[10px] font-mono font-semibold tracking-widest text-cyan-300 mt-1">
              A34 CORE
            </span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-1">
          Apple Emulator <span className="text-[#00E5FF]">A34</span>
        </h1>
        <p className="text-xs text-slate-400 mb-8">
          Ambiente de Simulação Visual macOS &amp; iOS para Android
        </p>

        {/* Smooth macOS/iOS style progress bar with Neon Blue glow */}
        <div className="w-64 sm:w-72 h-1.5 bg-slate-800/90 rounded-full overflow-hidden border border-white/10 mb-3">
          <div
            className="h-full bg-gradient-to-r from-[#007AFF] to-[#00E5FF] transition-all duration-75 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between w-64 sm:w-72 text-[11px] font-mono text-slate-400 tabular-nums">
          <span className="truncate pr-2">{stageText}</span>
          <span className="text-[#00E5FF] font-semibold shrink-0">{progress}%</span>
        </div>

        <button
          onClick={onComplete}
          className="mt-8 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-slate-300 transition-colors cursor-pointer"
        >
          Pular Inicialização
        </button>
      </div>

      {/* Bottom Legal & Technical Disclaimer */}
      <div className="w-full max-w-md border-t border-white/10 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400 text-center sm:text-left">
        <div className="flex items-center gap-1.5 text-slate-300">
          <ShieldCheck className="w-4 h-4 text-[#00E5FF] shrink-0" />
          <span>Interface Funcional de Simulação Independente</span>
        </div>
        <span className="font-mono text-[10px] text-slate-500">v1.0 · APK READY</span>
      </div>
    </div>
  );
};
