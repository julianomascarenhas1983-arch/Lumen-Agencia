import React, { useState } from 'react';
import { useLumen } from '../context/LumenContext';
import {
  Lock,
  Mail,
  Key,
  ShieldCheck,
  ArrowRight,
  User,
  Building,
  Phone,
  FileText,
  AlertCircle,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export const AuthView: React.FC<{ initialMode?: 'login' | 'register' }> = ({
  initialMode = 'login',
}) => {
  const { login, register, navigate, redirectAfterLogin } = useLumen();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    document: '',
    companyName: '',
    segment: '',
    city: '',
    termsAccepted: true,
  });

  const [errorMessage, setErrorMessage] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!loginEmail.trim()) {
      setErrorMessage('Por favor, informe seu e-mail.');
      return;
    }

    const res = login(loginEmail, loginPassword);
    if (!res.success) {
      setErrorMessage(res.error || 'Erro ao realizar login.');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (
      !registerData.name.trim() ||
      !registerData.email.trim() ||
      !registerData.phone.trim() ||
      !registerData.document.trim()
    ) {
      setErrorMessage('Preencha os campos obrigatórios para ativar seu cadastro seguro.');
      return;
    }

    const res = register(registerData);
    if (!res.success) {
      setErrorMessage(res.error || 'Erro ao criar conta.');
    }
  };

  // Demo accounts helper for effortless evaluation
  const handleQuickDemoLogin = (email: string, pass: string) => {
    setLoginEmail(email);
    setLoginPassword(pass);
    login(email, pass);
  };

  return (
    <div className="py-12 md:py-20 bg-[#070A17] min-h-screen flex items-center justify-center px-4 relative selection:bg-[#F6C453] selection:text-[#070A17]">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#19D3F3]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#FF2E93]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full relative z-10 space-y-6">

        {/* Security Header Badge */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>INTRANET PROTEGIDA // CRIPTOGRAFIA & SIGILO</span>
          </div>
          <h1 className="font-heading text-3xl font-extrabold text-[#F3F1EA] tracking-tight">
            {mode === 'login' ? 'Acesso Seguro à Conta' : 'Criar Perfil Corporativo'}
          </h1>
          <p className="text-xs text-[#98A1BC]">
            {mode === 'login'
              ? 'Área restrita e sigilosa. Seus contratos, entregas e dados estão protegidos.'
              : 'Cadastre sua empresa para contratar serviços e gerenciar entregas com garantia contratual.'}
          </p>
        </div>

        {/* Auth Mode Toggle Tabs */}
        <div className="grid grid-cols-2 p-1 bg-[#0C1226] border border-[rgba(243,241,234,0.12)] rounded-xl text-xs font-semibold">
          <button
            onClick={() => {
              setMode('login');
              setErrorMessage('');
            }}
            className={`py-2 rounded-lg transition-all ${
              mode === 'login'
                ? 'bg-[#F6C453] text-[#070A17] shadow-md font-bold'
                : 'text-[#98A1BC] hover:text-[#F3F1EA]'
            }`}
          >
            Já tenho acesso (Login)
          </button>
          <button
            onClick={() => {
              setMode('register');
              setErrorMessage('');
            }}
            className={`py-2 rounded-lg transition-all ${
              mode === 'register'
                ? 'bg-[#19D3F3] text-[#070A17] shadow-md font-bold'
                : 'text-[#98A1BC] hover:text-[#F3F1EA]'
            }`}
          >
            Cadastrar minha Empresa
          </button>
        </div>

        {/* Notification / Error alert */}
        {errorMessage && (
          <div className="bg-red-500/10 border border-red-500/30 p-3.5 rounded-xl text-xs text-red-300 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* LOGIN FORM */}
        {mode === 'login' ? (
          <form
            onSubmit={handleLoginSubmit}
            className="bg-[#0C1226] border border-[rgba(243,241,234,0.12)] rounded-2xl p-6 sm:p-8 space-y-4 shadow-2xl"
          >
            <div>
              <label className="block text-[11px] font-mono uppercase text-[#98A1BC] mb-1.5 flex items-center justify-between">
                <span>E-mail Corporativo</span>
                <Mail className="w-3.5 h-3.5 text-[#F6C453]" />
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="seuemail@empresa.com.br"
                className="w-full bg-[#070A17] border border-[rgba(243,241,234,0.15)] rounded-xl px-4 py-2.5 text-xs text-[#F3F1EA] placeholder-[#98A1BC]/40 focus:border-[#F6C453]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-[#98A1BC] mb-1.5 flex items-center justify-between">
                <span>Senha de Acesso</span>
                <Key className="w-3.5 h-3.5 text-[#F6C453]" />
              </label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#070A17] border border-[rgba(243,241,234,0.15)] rounded-xl px-4 py-2.5 text-xs text-[#F3F1EA] placeholder-[#98A1BC]/40 focus:border-[#F6C453]"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#F6C453] hover:bg-[#ffd875] text-[#070A17] py-3 rounded-xl font-bold text-xs transition-all shadow-[0_4px_16px_rgba(246,196,83,0.3)] hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 mt-2"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Acessar Ambiente Restrito</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Quick demo accounts for testing */}
            <div className="pt-4 border-t border-white/5 space-y-2 text-[11px]">
              <span className="text-[#98A1BC] font-mono uppercase text-[10px] block">
                Contas Pré-configuradas para Teste Imediato:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() =>
                    handleQuickDemoLogin(
                      'camila.v@aurorasaude.com.br',
                      'lumen@aurora2026'
                    )
                  }
                  className="p-2 rounded-lg bg-[#070A17] border border-white/10 hover:border-[#F6C453] text-left transition-colors"
                >
                  <strong className="text-[#F3F1EA] block text-[10px]">Cliente Demo (Aurora)</strong>
                  <span className="text-[#98A1BC] text-[9px] block">Dra. Camila Vasconcelos</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleQuickDemoLogin(
                      'julianomascarenhas1983@gmail.com',
                      'admin@lumen2026'
                    )
                  }
                  className="p-2 rounded-lg bg-[#070A17] border border-white/10 hover:border-[#19D3F3] text-left transition-colors"
                >
                  <strong className="text-[#19D3F3] block text-[10px]">Diretoria Lumen (Admin)</strong>
                  <span className="text-[#98A1BC] text-[9px] block">Juliano Mascarenhas</span>
                </button>
              </div>
            </div>
          </form>
        ) : (
          /* REGISTER FORM */
          <form
            onSubmit={handleRegisterSubmit}
            className="bg-[#0C1226] border border-[rgba(243,241,234,0.12)] rounded-2xl p-6 sm:p-8 space-y-4 shadow-2xl"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-mono uppercase text-[#98A1BC] mb-1">
                  Nome do Responsável *
                </label>
                <input
                  type="text"
                  required
                  value={registerData.name}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, name: e.target.value })
                  }
                  placeholder="Ex: Carlos Mendes"
                  className="w-full bg-[#070A17] border border-[rgba(243,241,234,0.15)] rounded-xl px-3 py-2 text-xs text-[#F3F1EA] focus:border-[#19D3F3]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-[#98A1BC] mb-1">
                  Empresa / Razão Social *
                </label>
                <input
                  type="text"
                  required
                  value={registerData.companyName}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      companyName: e.target.value,
                    })
                  }
                  placeholder="Nome da sua marca"
                  className="w-full bg-[#070A17] border border-[rgba(243,241,234,0.15)] rounded-xl px-3 py-2 text-xs text-[#F3F1EA] focus:border-[#19D3F3]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-mono uppercase text-[#98A1BC] mb-1">
                  E-mail Corporativo *
                </label>
                <input
                  type="email"
                  required
                  value={registerData.email}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, email: e.target.value })
                  }
                  placeholder="seu@empresa.com"
                  className="w-full bg-[#070A17] border border-[rgba(243,241,234,0.15)] rounded-xl px-3 py-2 text-xs text-[#F3F1EA] focus:border-[#19D3F3]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-[#98A1BC] mb-1">
                  Senha Segura *
                </label>
                <input
                  type="password"
                  required
                  value={registerData.password}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      password: e.target.value,
                    })
                  }
                  placeholder="Crie sua senha"
                  className="w-full bg-[#070A17] border border-[rgba(243,241,234,0.15)] rounded-xl px-3 py-2 text-xs text-[#F3F1EA] focus:border-[#19D3F3]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-mono uppercase text-[#98A1BC] mb-1">
                  CNPJ ou CPF *
                </label>
                <input
                  type="text"
                  required
                  value={registerData.document}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      document: e.target.value,
                    })
                  }
                  placeholder="00.000.000/0001-00"
                  className="w-full bg-[#070A17] border border-[rgba(243,241,234,0.15)] rounded-xl px-3 py-2 text-xs text-[#F3F1EA] focus:border-[#19D3F3]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-[#98A1BC] mb-1">
                  WhatsApp / Telefone *
                </label>
                <input
                  type="tel"
                  required
                  value={registerData.phone}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, phone: e.target.value })
                  }
                  placeholder="(11) 99999-9999"
                  className="w-full bg-[#070A17] border border-[rgba(243,241,234,0.15)] rounded-xl px-3 py-2 text-xs text-[#F3F1EA] focus:border-[#19D3F3]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase text-[#98A1BC] mb-1">
                Segmento / Nicho
              </label>
              <input
                type="text"
                value={registerData.segment}
                onChange={(e) =>
                  setRegisterData({ ...registerData, segment: e.target.value })
                }
                placeholder="Ex: Medicina, Arquitetura, Varejo, Software..."
                className="w-full bg-[#070A17] border border-[rgba(243,241,234,0.15)] rounded-xl px-3 py-2 text-xs text-[#F3F1EA] focus:border-[#19D3F3]"
              />
            </div>

            <div className="flex items-start gap-2 pt-2">
              <input
                type="checkbox"
                id="terms"
                checked={registerData.termsAccepted}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    termsAccepted: e.target.checked,
                  })
                }
                className="mt-1 accent-[#19D3F3] rounded"
              />
              <label htmlFor="terms" className="text-[11px] text-[#98A1BC]">
                Concordo com os{' '}
                <button
                  type="button"
                  onClick={() => navigate('termos')}
                  className="text-[#19D3F3] hover:underline"
                >
                  Termos de Contratação
                </button>{' '}
                e a política de sigilo de dados (LGPD) da Lumen.
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-[#19D3F3] hover:bg-[#15b7d3] text-[#070A17] py-3 rounded-xl font-bold text-xs transition-all shadow-[0_4px_16px_rgba(25,211,243,0.3)] hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 mt-2"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Criar Conta & Liberar Contratações</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
