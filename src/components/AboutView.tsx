import React, { useState } from 'react';
import {
  Smartphone,
  ShieldCheck,
  Download,
  CheckCircle2,
  Info,
} from 'lucide-react';

export const AboutView: React.FC = () => {
  const [exportedManifest, setExportedManifest] = useState(false);

  const handleDownloadApkConfig = () => {
    const manifestJson = JSON.stringify(
      {
        appName: 'Apple Emulator A34',
        appId: 'io.independent.appleemulator.a34',
        versionName: '1.0',
        versionCode: 100,
        developer: 'Projeto independente',
        targetDevice: 'Samsung Galaxy A34 5G (SM-A346M)',
        webDir: 'dist',
        androidScheme: 'https',
        orientation: 'sensor',
        fullScreen: true,
        simulationDisclaimer:
          'Ambiente funcional de simulação visual. Não executa iOS ou binários proprietários Apple sem motor de virtualização compatível e autorizado.',
      },
      null,
      2
    );

    const blob = new Blob([manifestJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'capacitor.config.a34.json';
    a.click();
    URL.revokeObjectURL(url);
    setExportedManifest(true);
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Main Brand Identity Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-slate-900/65 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#007AFF] to-[#00E5FF] flex items-center justify-center text-white shadow-[0_0_30px_rgba(0,229,255,0.35)] shrink-0">
            <Smartphone className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Apple Emulator <span className="text-[#007AFF] dark:text-[#00E5FF]">A34</span>
            </h2>
            <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-2 mt-1">
              <span>Versão: 1.0</span>
              <span aria-hidden="true">·</span>
              <span>Desenvolvedor: Projeto independente</span>
              <span aria-hidden="true">·</span>
              <span>Alvo: Samsung Galaxy A34</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleDownloadApkConfig}
          className="min-h-[44px] px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#007AFF] to-[#00E5FF] text-white text-xs font-semibold flex items-center gap-2 shadow-[0_0_20px_rgba(0,229,255,0.25)] cursor-pointer shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>
            {exportedManifest
              ? 'Manifesto APK Exportado!'
              : 'Exportar Manifesto Android APK'}
          </span>
        </button>
      </div>

      {/* Information & Transparency Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Application Information */}
        <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/65 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200/70 dark:border-white/10 pb-3">
            <Info className="w-4 h-4 text-[#007AFF] dark:text-[#00E5FF]" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Informações do Aplicativo
            </h3>
          </div>

          <div className="divide-y divide-slate-200/60 dark:divide-white/10 text-xs">
            <div className="py-2.5 flex justify-between">
              <span className="text-slate-500">Nome Oficial</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                Apple Emulator A34
              </span>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-slate-500">Versão de Lançamento</span>
              <span className="font-mono text-slate-900 dark:text-white">1.0 (Build 2026.11)</span>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-slate-500">Desenvolvedor</span>
              <span className="font-medium text-slate-900 dark:text-white">
                Projeto independente
              </span>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-slate-500">Dispositivo Principal</span>
              <span className="font-medium text-slate-900 dark:text-white">
                Samsung Galaxy A34 (1080x2340)
              </span>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-slate-500">Tecnologias Base</span>
              <span className="font-mono text-slate-900 dark:text-white">
                HTML5 · CSS3 · JavaScript / TypeScript
              </span>
            </div>
          </div>
        </div>

        {/* Legal & Technical Simulation Notice */}
        <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/65 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200/70 dark:border-white/10 pb-3">
            <ShieldCheck className="w-4 h-4 text-[#007AFF] dark:text-[#00E5FF]" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Nota Técnica de Simulação &amp; Conformidade
            </h3>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            O <strong>Apple Emulator A34</strong> fornece uma interface funcional de simulação
            visual inspirada no design do macOS e do iOS, projetada especificamente para a
            ergonomia e proporção de tela de smartphones Android como o{' '}
            <strong>Samsung Galaxy A34</strong>.
          </p>

          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            <strong>Importante:</strong> Este projeto opera como um ambiente de simulação de
            interface e contêiner de pacotes web/HTML5. Ele não afirma executar sistemas
            operacionais iOS/macOS nativos ou aplicativos proprietários da Apple sem um motor de
            virtualização ou emulação compatível e devidamente autorizado.
          </p>

          <div className="pt-2 flex items-center gap-2 text-xs text-[#007AFF] dark:text-[#00E5FF] font-medium">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Arquitetura modular preparada para empacotamento em APK Android (WebView/Capacitor).</span>
          </div>
        </div>
      </div>
    </div>
  );
};
