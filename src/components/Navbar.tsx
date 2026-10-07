import React, { useState } from 'react';
import { useLumen, AppView } from '../context/LumenContext';
import { createGeneralWhatsAppUrl } from '../utils/whatsapp';
import { Sparkles, SlidersHorizontal, Menu, X, ArrowUpRight, Instagram, Linkedin, MessageCircle, Globe } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentView, navigate, language, setLanguage, t } = useLumen();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (view: AppView) => {
    navigate(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#070A17]/90 backdrop-blur-md border-b border-[rgba(243,241,234,0.12)]">
      {/* Top micro register bar */}
      <div className="h-[2px] w-full grid grid-cols-4">
        <div className="bg-[#19D3F3]" />
        <div className="bg-[#FF2E93]" />
        <div className="bg-[#FFD400]" />
        <div className="bg-[#F3F1EA]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <button
            onClick={() => handleNav('home')}
            className="flex items-center gap-3 group text-left transition-transform focus-visible:ring-2 focus-visible:ring-[#F6C453]"
            aria-label="Lumen - Página Inicial"
          >
            <div className="relative w-8 h-8 flex items-center justify-center">
              {/* Registration crosshair icon */}
              <div className="absolute inset-0 border border-[rgba(246,196,83,0.3)] rounded-full group-hover:scale-105 transition-transform" />
              <div className="w-2.5 h-2.5 bg-[#F6C453] rounded-full shadow-[0_0_12px_#F6C453]" />
              <span className="absolute -top-1 -right-1 text-[8px] font-mono text-[#19D3F3] leading-none">+</span>
            </div>
            <div>
              <span className="font-heading text-2xl font-bold tracking-tight text-[#F3F1EA] group-hover:text-[#F6C453] transition-colors">
                Lumen
              </span>
              <span className="hidden sm:inline-block ml-2.5 text-[11px] uppercase tracking-widest text-[#98A1BC] border-l border-[rgba(243,241,234,0.15)] pl-2.5">
                {language === 'en' ? 'Virtual Agency' : 'Agência Virtual'}
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#98A1BC]">
            <button
              onClick={() => handleNav('home')}
              className={`hover:text-[#F3F1EA] transition-colors py-2 ${
                currentView === 'home' ? 'text-[#F3F1EA] font-semibold' : ''
              }`}
            >
              {t('nav.home', 'Início')}
            </button>
            <button
              onClick={() => handleNav('produtos')}
              className={`hover:text-[#F3F1EA] transition-colors py-2 ${
                currentView === 'produtos' || currentView === 'produto-detalhe'
                  ? 'text-[#F3F1EA] font-semibold'
                  : ''
              }`}
            >
              {t('nav.products', 'Produtos & Preços')}
            </button>
            <button
              onClick={() => handleNav('diagnostico')}
              className={`hover:text-[#F6C453] transition-colors py-2 flex items-center gap-1.5 ${
                currentView === 'diagnostico' ? 'text-[#F6C453] font-semibold' : ''
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#F6C453]" />
              {t('nav.diagnosis', 'Diagnóstico Grátis')}
            </button>
            <button
              onClick={() => handleNav('metodo')}
              className={`hover:text-[#F3F1EA] transition-colors py-2 ${
                currentView === 'metodo' ? 'text-[#F3F1EA] font-semibold' : ''
              }`}
            >
              {t('nav.method', 'Método')}
            </button>
            <button
              onClick={() => handleNav('sobre')}
              className={`hover:text-[#F3F1EA] transition-colors py-2 ${
                currentView === 'sobre' ? 'text-[#F3F1EA] font-semibold' : ''
              }`}
            >
              {t('nav.about', 'Sobre')}
            </button>
          </nav>

          {/* Social Links, Language Selector & Action CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Language Switcher Button (PT / EN) */}
            <div className="flex items-center bg-[#0C1226] border border-white/10 rounded-full p-1 text-xs font-mono">
              <button
                type="button"
                onClick={() => setLanguage('pt')}
                className={`px-2.5 py-1 rounded-full font-bold transition-all flex items-center gap-1 ${
                  language === 'pt'
                    ? 'bg-[#F6C453] text-[#070A17] shadow-[0_0_10px_rgba(246,196,83,0.4)]'
                    : 'text-[#98A1BC] hover:text-[#F3F1EA]'
                }`}
                title="Versão em Português (Preços em R$)"
                aria-label="Mudar para Português"
              >
                <span>PT</span>
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded-full font-bold transition-all flex items-center gap-1 ${
                  language === 'en'
                    ? 'bg-[#19D3F3] text-[#070A17] shadow-[0_0_10px_rgba(25,211,243,0.4)]'
                    : 'text-[#98A1BC] hover:text-[#F3F1EA]'
                }`}
                title="English Version (Prices in USD)"
                aria-label="Switch to English"
              >
                <span>EN</span>
              </button>
            </div>

            {/* Quick Social Icons in Navbar */}
            <div className="flex items-center gap-1 pr-2 border-r border-white/10">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#98A1BC] hover:text-[#E1306C] hover:bg-white/5 transition-colors"
                title="Instagram @lumen.ag"
                aria-label="Instagram da Lumen"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#98A1BC] hover:text-[#0077B5] hover:bg-white/5 transition-colors"
                title="LinkedIn Lumen"
                aria-label="LinkedIn da Lumen"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/5511998421080?text=Ol%C3%A1!%20Vim%20pelo%20site%20da%20Lumen."
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#25D366] hover:bg-[#25D366]/10 transition-colors"
                title="WhatsApp Direto"
                aria-label="WhatsApp da Lumen"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>

            {/* WhatsApp VIP Concierge Action */}
            <a
              href={createGeneralWhatsAppUrl(language === 'en' ? 'Hello! I would like to speak with a Lumen senior curator.' : 'Olá! Gostaria de conversar com um curador da Lumen.')}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-[#25D366]/40 bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 transition-all"
              title={t('nav.whatsappCta', 'Falar no WhatsApp')}
            >
              <MessageCircle className="w-3.5 h-3.5 fill-[#25D366]" />
              <span>WhatsApp</span>
            </a>

            {/* Admin panel quick link */}
            <button
              onClick={() => handleNav('admin')}
              className={`p-2 rounded-lg text-xs font-medium border border-transparent transition-all ${
                currentView === 'admin'
                  ? 'text-[#F6C453] bg-[#F6C453]/10 border-[#F6C453]/30'
                  : 'text-[#98A1BC] hover:text-[#F6C453] hover:bg-[#F6C453]/5'
              }`}
              title={t('nav.admin', 'Painel de Curadoria')}
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>

            {/* Primary Action Button */}
            <button
              onClick={() => handleNav('produtos')}
              className="bg-[#FF3B30] hover:bg-[#e0342a] text-[#F3F1EA] px-4 py-2 rounded-full text-xs font-bold tracking-wide transition-all shadow-[0_4px_16px_rgba(255,59,48,0.3)] hover:shadow-[0_6px_20px_rgba(255,59,48,0.45)] hover:scale-[1.02] active:scale-[0.98] min-h-[40px] flex items-center gap-1.5"
            >
              <span>{language === 'en' ? 'View Plans' : 'Ver planos'}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Actions: Language toggle + menu trigger */}
          <div className="flex items-center gap-2 lg:hidden">
            {/* Mobile Language Switcher */}
            <div className="flex items-center bg-[#0C1226] border border-white/10 rounded-full p-0.5 text-[11px] font-mono mr-1">
              <button
                type="button"
                onClick={() => setLanguage('pt')}
                className={`px-2 py-0.5 rounded-full font-bold transition-all ${
                  language === 'pt' ? 'bg-[#F6C453] text-[#070A17]' : 'text-[#98A1BC]'
                }`}
              >
                PT
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2 py-0.5 rounded-full font-bold transition-all ${
                  language === 'en' ? 'bg-[#19D3F3] text-[#070A17]' : 'text-[#98A1BC]'
                }`}
              >
                EN
              </button>
            </div>

            <a
              href="https://wa.me/5511998421080?text=Ol%C3%A1!%20Vim%20pelo%20site%20da%20Lumen."
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-[#25D366] hover:text-white"
              aria-label="WhatsApp da Lumen"
            >
              <MessageCircle className="w-5 h-5 fill-[#25D366]" />
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#F3F1EA] hover:text-[#F6C453] focus-visible:ring-2 focus-visible:ring-[#F6C453]"
              aria-label="Abrir Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-[rgba(243,241,234,0.14)] bg-[#0C1226] px-4 pt-3 pb-6 space-y-3">
          <div className="flex flex-col space-y-2">
            <button
              onClick={() => handleNav('home')}
              className="text-left py-2.5 px-3 rounded-lg text-sm text-[#F3F1EA] hover:bg-white/5 font-medium"
            >
              {t('nav.home', 'Início')}
            </button>
            <button
              onClick={() => handleNav('produtos')}
              className="text-left py-2.5 px-3 rounded-lg text-sm text-[#F3F1EA] hover:bg-white/5 font-medium"
            >
              {t('nav.products', 'Produtos & Preços')}
            </button>
            <button
              onClick={() => handleNav('diagnostico')}
              className="text-left py-2.5 px-3 rounded-lg text-sm text-[#F6C453] hover:bg-white/5 font-medium flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> {t('nav.diagnosis', 'Diagnóstico Grátis')}
              </span>
              <span className="text-[10px] bg-[#F6C453]/20 px-2 py-0.5 rounded text-[#F6C453] font-bold">
                {language === 'en' ? 'AUDIT' : 'IA'}
              </span>
            </button>
            <button
              onClick={() => handleNav('metodo')}
              className="text-left py-2.5 px-3 rounded-lg text-sm text-[#98A1BC] hover:bg-white/5 font-medium"
            >
              {t('nav.method', 'Método Híbrido')}
            </button>
            <button
              onClick={() => handleNav('sobre')}
              className="text-left py-2.5 px-3 rounded-lg text-sm text-[#98A1BC] hover:bg-white/5 font-medium"
            >
              {t('nav.about', 'Sobre a Lumen')}
            </button>
            <button
              onClick={() => handleNav('admin')}
              className="text-left py-2.5 px-3 rounded-lg text-sm text-[#F6C453] hover:bg-[#F6C453]/10 font-medium flex items-center gap-2"
            >
              <SlidersHorizontal className="w-4 h-4" /> {t('nav.admin', 'Painel de Curadoria')}
            </button>
          </div>

          {/* Social Links inside Mobile Drawer */}
          <div className="pt-3 border-t border-white/10">
            <div className="text-[11px] font-mono text-[#98A1BC] mb-2 uppercase tracking-wider">
              {language === 'en' ? 'Official Channels:' : 'Nossos Canais Oficiais:'}
            </div>
            <div className="flex items-center gap-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center gap-1.5 text-xs text-[#E1306C] font-semibold"
              >
                <Instagram className="w-3.5 h-3.5" />
                <span>Instagram</span>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center gap-1.5 text-xs text-[#0077B5] font-semibold"
              >
                <Linkedin className="w-3.5 h-3.5" />
                <span>LinkedIn</span>
              </a>
              <a
                href="https://wa.me/5511998421080"
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 px-3 rounded-lg bg-[#25D366]/20 border border-[#25D366]/40 flex items-center justify-center text-xs text-[#25D366] font-bold"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="pt-2 border-t border-[rgba(243,241,234,0.1)]">
            <button
              onClick={() => handleNav('produtos')}
              className="w-full bg-[#FF3B30] text-[#F3F1EA] py-3 rounded-full text-center text-sm font-bold tracking-wide shadow-lg"
            >
              {language === 'en' ? 'Start a Project' : 'Iniciar um projeto'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
