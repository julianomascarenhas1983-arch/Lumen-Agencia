import React, { useState } from 'react';
import { useLumen, AppView } from '../context/LumenContext';
import {
  Sparkles,
  Shield,
  User,
  SlidersHorizontal,
  Menu,
  X,
  ArrowUpRight,
  Instagram,
  Linkedin,
  MessageCircle,
  LayoutDashboard,
  Lock,
  LogIn,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentView, navigate, orders, isAuthenticated, currentUser } = useLumen();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeOrdersCount = orders.filter(
    (o) => o.status !== 'aprovado'
  ).length;

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
                Agência Virtual
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
              Início
            </button>
            <button
              onClick={() => handleNav('produtos')}
              className={`hover:text-[#F3F1EA] transition-colors py-2 ${
                currentView === 'produtos' || currentView === 'produto-detalhe'
                  ? 'text-[#F3F1EA] font-semibold'
                  : ''
              }`}
            >
              Produtos & Preços
            </button>
            <button
              onClick={() => handleNav('diagnostico')}
              className={`hover:text-[#F6C453] transition-colors py-2 flex items-center gap-1.5 ${
                currentView === 'diagnostico' ? 'text-[#F6C453] font-semibold' : ''
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#F6C453]" />
              Diagnóstico Grátis
            </button>
            <button
              onClick={() => handleNav('metodo')}
              className={`hover:text-[#F3F1EA] transition-colors py-2 ${
                currentView === 'metodo' ? 'text-[#F3F1EA] font-semibold' : ''
              }`}
            >
              Método
            </button>
            <button
              onClick={() => handleNav('sobre')}
              className={`hover:text-[#F3F1EA] transition-colors py-2 ${
                currentView === 'sobre' ? 'text-[#F3F1EA] font-semibold' : ''
              }`}
            >
              Sobre
            </button>
          </nav>

          {/* Social Links & Action CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Quick Social Icons in Navbar */}
            <div className="flex items-center gap-1 pr-2 border-r border-white/10">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#98A1BC] hover:text-[#E1306C] hover:bg-white/5 transition-colors"
                title="Instagram @lumen.ag (38.4k)"
                aria-label="Instagram da Lumen"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#98A1BC] hover:text-[#0077B5] hover:bg-white/5 transition-colors"
                title="LinkedIn Lumen Agência Virtual"
                aria-label="LinkedIn da Lumen"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://behance.net"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#98A1BC] hover:text-[#1769FF] hover:bg-white/5 transition-colors font-heading font-black text-xs"
                title="Portfólio no Behance"
                aria-label="Behance da Lumen"
              >
                Bē
              </a>
              <a
                href="https://wa.me/5511998421080?text=Ol%C3%A1!%20Vim%20pelo%20site%20da%20Lumen%20e%20gostaria%20de%20conversar."
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#25D366] hover:bg-[#25D366]/10 transition-colors"
                title="WhatsApp Direto"
                aria-label="WhatsApp da Lumen"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>

            {/* Dashboard button - accessible if logged in or takes to login */}
            <button
              onClick={() => handleNav('dashboard')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all ${
                currentView === 'dashboard'
                  ? 'bg-[#19D3F3]/15 border-[#19D3F3] text-[#19D3F3] shadow-[0_0_15px_rgba(25,211,243,0.25)]'
                  : 'border-[rgba(243,241,234,0.16)] text-[#F3F1EA] bg-white/5 hover:text-[#19D3F3] hover:border-[#19D3F3]/50'
              }`}
              title="Dashboard: Resumo Visual, Esteira e Feed de Interações"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-[#19D3F3]" />
              <span>Dashboard</span>
            </button>

            {/* Customer portal button or Login button */}
            {isAuthenticated ? (
              <button
                onClick={() => handleNav('conta')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all ${
                  currentView === 'conta'
                    ? 'bg-[#F6C453]/15 border-[#F6C453] text-[#F6C453] shadow-[0_0_15px_rgba(246,196,83,0.2)]'
                    : 'border-[rgba(243,241,234,0.16)] text-[#F3F1EA] bg-white/5 hover:text-[#F6C453] hover:border-[#F6C453]/50'
                }`}
                title="Área do Cliente: Projetos, Entregas, Recibos e Interação"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="truncate max-w-[120px]">{currentUser?.name.split(' ')[0]}</span>
                {activeOrdersCount > 0 && (
                  <span className="flex items-center gap-1 font-mono text-[10px] bg-[#19D3F3]/20 text-[#19D3F3] px-1.5 py-0.2 rounded-full border border-[#19D3F3]/40">
                    {activeOrdersCount}
                  </span>
                )}
              </button>
            ) : (
              <button
                onClick={() => handleNav('login')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all ${
                  currentView === 'login' || currentView === 'cadastro'
                    ? 'bg-[#F6C453] text-[#070A17] font-bold shadow'
                    : 'border-[rgba(243,241,234,0.16)] text-[#F3F1EA] bg-white/5 hover:text-[#F6C453] hover:border-[#F6C453]/50'
                }`}
                title="Acesso Seguro / Entrar na Conta"
              >
                <Lock className="w-3.5 h-3.5 text-[#F6C453]" />
                <span>Entrar / Cadastrar</span>
              </button>
            )}

            {/* Admin panel quick link */}
            <button
              onClick={() => handleNav('admin')}
              className={`p-2 rounded-lg text-xs font-medium border border-transparent transition-all ${
                currentView === 'admin'
                  ? 'text-[#F6C453] bg-[#F6C453]/10 border-[#F6C453]/30'
                  : 'text-[#98A1BC] hover:text-[#F6C453] hover:bg-[#F6C453]/5'
              }`}
              title="Painel Interno de Curadoria e Catálogo"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>

            {/* Primary Action Button (Red token --r: #FF3B30) */}
            <button
              onClick={() => handleNav('produtos')}
              className="bg-[#FF3B30] hover:bg-[#e0342a] text-[#F3F1EA] px-5 py-2.5 rounded-full text-xs font-bold tracking-wide transition-all shadow-[0_4px_16px_rgba(255,59,48,0.3)] hover:shadow-[0_6px_20px_rgba(255,59,48,0.45)] hover:scale-[1.02] active:scale-[0.98] min-h-[44px] flex items-center gap-1.5"
            >
              <span>Iniciar projeto</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => handleNav('conta')}
              className="p-2 text-[#98A1BC] hover:text-[#F3F1EA]"
              aria-label="Minha Conta"
            >
              <User className="w-5 h-5" />
            </button>
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
              Início
            </button>
            <button
              onClick={() => handleNav('produtos')}
              className="text-left py-2.5 px-3 rounded-lg text-sm text-[#F3F1EA] hover:bg-white/5 font-medium"
            >
              Produtos & Preços
            </button>
            <button
              onClick={() => handleNav('diagnostico')}
              className="text-left py-2.5 px-3 rounded-lg text-sm text-[#F6C453] hover:bg-white/5 font-medium flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Diagnóstico Grátis em 60s
              </span>
              <span className="text-[10px] bg-[#F6C453]/20 px-2 py-0.5 rounded text-[#F6C453] font-bold">IA</span>
            </button>
            <button
              onClick={() => handleNav('metodo')}
              className="text-left py-2.5 px-3 rounded-lg text-sm text-[#98A1BC] hover:bg-white/5 font-medium"
            >
              Método Híbrido
            </button>
            <button
              onClick={() => handleNav('sobre')}
              className="text-left py-2.5 px-3 rounded-lg text-sm text-[#98A1BC] hover:bg-white/5 font-medium"
            >
              Sobre a Lumen
            </button>
            <button
              onClick={() => handleNav('dashboard')}
              className="text-left py-2.5 px-3 rounded-lg text-sm text-[#19D3F3] hover:bg-[#19D3F3]/10 font-medium flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <LayoutDashboard className="w-4 h-4 text-[#19D3F3]" /> Dashboard Geral
              </span>
              <span className="text-[10px] bg-[#19D3F3]/20 px-2 py-0.5 rounded text-[#19D3F3] font-bold">NOVO</span>
            </button>
            <button
              onClick={() => handleNav('conta')}
              className="text-left py-2.5 px-3 rounded-lg text-sm text-[#98A1BC] hover:bg-white/5 font-medium flex items-center justify-between"
            >
              <span>Área do Cliente (Pedidos & Entregas)</span>
              {activeOrdersCount > 0 && (
                <span className="bg-[#19D3F3] text-[#070A17] text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {activeOrdersCount}
                </span>
              )}
            </button>
            <button
              onClick={() => handleNav('admin')}
              className="text-left py-2.5 px-3 rounded-lg text-sm text-[#F6C453] hover:bg-[#F6C453]/10 font-medium flex items-center gap-2"
            >
              <SlidersHorizontal className="w-4 h-4" /> Painel Interno / Admin
            </button>

            {!isAuthenticated ? (
              <button
                onClick={() => handleNav('login')}
                className="text-left py-2.5 px-3 rounded-lg text-sm text-[#F6C453] bg-[#F6C453]/10 border border-[#F6C453]/20 font-bold flex items-center gap-2"
              >
                <Lock className="w-4 h-4 text-[#F6C453]" /> Entrar na Conta / Cadastrar
              </button>
            ) : (
              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-[#98A1BC] px-3">
                <span>Logado como: <strong className="text-[#F3F1EA]">{currentUser?.name}</strong></span>
              </div>
            )}
          </div>

          {/* Social Links inside Mobile Drawer */}
          <div className="pt-3 border-t border-white/10">
            <div className="text-[11px] font-mono text-[#98A1BC] mb-2 uppercase tracking-wider">
              Nossos Canais Oficiais:
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
              Iniciar um projeto
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
