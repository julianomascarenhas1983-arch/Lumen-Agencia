import React from 'react';
import { LumenProvider, useLumen } from './context/LumenContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AtmosphericCanvas } from './components/AtmosphericCanvas';
import { FloatingSocialDock } from './components/FloatingSocialDock';
import { HomeView } from './views/HomeView';
import { ProductsView } from './views/ProductsView';
import { ProductDetailView } from './views/ProductDetailView';
import { DiagnosticoView } from './views/DiagnosticoView';
import { CheckoutView } from './views/CheckoutView';
import { BriefingView } from './views/BriefingView';
import { CustomerPortalView } from './views/CustomerPortalView';
import { DashboardView } from './views/DashboardView';
import { AuthView } from './views/AuthView';
import { AdminPanelView } from './views/AdminPanelView';
import { InstitutionalView } from './views/InstitutionalView';

const AppContent: React.FC = () => {
  const { currentView } = useLumen();

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView />;
      case 'dashboard':
        return <DashboardView />;
      case 'produtos':
        return <ProductsView />;
      case 'produto-detalhe':
        return <ProductDetailView />;
      case 'diagnostico':
        return <DiagnosticoView />;
      case 'checkout':
        return <CheckoutView />;
      case 'briefing':
        return <BriefingView />;
      case 'conta':
        return <CustomerPortalView />;
      case 'login':
        return <AuthView initialMode="login" />;
      case 'cadastro':
        return <AuthView initialMode="register" />;
      case 'admin':
        return <AdminPanelView />;
      case 'sobre':
        return <InstitutionalView initialTab="sobre" />;
      case 'metodo':
        return <InstitutionalView initialTab="metodo" />;
      case 'contato':
        return <InstitutionalView initialTab="contato" />;
      case 'termos':
        return <InstitutionalView initialTab="termos" />;
      case 'privacidade':
        return <InstitutionalView initialTab="privacidade" />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#070A17] text-[#F3F1EA] relative selection:bg-[#F6C453] selection:text-[#070A17]">
      {/* Seductive Ambient Light Atmosphere */}
      <AtmosphericCanvas />

      {/* Primary Navigation */}
      <div className="relative z-50">
        <Navbar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative z-10">{renderCurrentView()}</div>

      {/* Global Footer */}
      <div className="relative z-20">
        <Footer />
      </div>

      {/* Floating Seductive Social Dock & Harmonic Audio */}
      <FloatingSocialDock />
    </div>
  );
};


export default function App() {
  return (
    <LumenProvider>
      <AppContent />
    </LumenProvider>
  );
}
