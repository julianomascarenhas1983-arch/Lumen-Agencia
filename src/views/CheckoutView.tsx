import React, { useState } from 'react';
import { useLumen } from '../context/LumenContext';
import { TierLevel } from '../data/catalog';
import {
  CreditCard,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  ArrowRight,
  AlertTriangle,
  Lock,
  Clock,
  RefreshCw,
  UserCheck,
} from 'lucide-react';

export const CheckoutView: React.FC = () => {
  const {
    products,
    selectedProductSlug,
    selectedTier,
    createOrder,
    navigate,
    currentUser,
    isAuthenticated,
    setRedirectAfterLogin,
  } = useLumen();

  const product =
    products.find((p) => p.slug === selectedProductSlug) || products[0];
  const tier = product.tiers[selectedTier || 'pro'];

  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit_card'>('pix');
  const [customer, setCustomer] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    document: currentUser?.document || '',
    acceptedTerms: true,
  });

  // Sync customer data if currentUser updates
  React.useEffect(() => {
    if (currentUser) {
      setCustomer({
        name: currentUser.name,
        email: currentUser.email,
        phone: currentUser.phone,
        document: currentUser.document,
        acceptedTerms: true,
      });
    }
  }, [currentUser]);

  const [cardData, setCardData] = useState({
    number: '•••• •••• •••• 4242',
    holder: 'CAMILA VASCONCELOS',
    expiry: '12/28',
    cvv: '•••',
    installments: 1,
  });

  const [isCopiedPix, setIsCopiedPix] = useState(false);
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const mockPixKey = `00020126580014br.gov.bcb.pix0136lumen-pay-${product.slug}-${Date.now()}520400005303986540${tier.price}.005802BR5920LUMEN AGENCIA VIRTUAL6009SAO PAULO62070503***6304`;

  const handleCopyPix = () => {
    navigator.clipboard?.writeText(mockPixKey);
    setIsCopiedPix(true);
    setTimeout(() => setIsCopiedPix(false), 3000);
  };

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      setErrorMessage(
        'Você precisa estar logado para contratar. Por favor, clique em "Já Tenho Conta" ou "Cadastrar Empresa" acima.'
      );
      setRedirectAfterLogin('checkout');
      return;
    }

    if (!customer.name || !customer.email || !customer.phone || !customer.document) {
      setErrorMessage('Preencha todos os dados cadastrais.');
      return;
    }

    if (!customer.acceptedTerms) {
      setErrorMessage('É necessário aceitar os termos de serviço e a política de privacidade.');
      return;
    }

    setErrorMessage('');
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);

      if (simulateFailure) {
        setErrorMessage(
          'Simulação de falha: Transação recusada pela operadora de teste. Desmarque o teste de falha para aprovar.'
        );
        return;
      }

      // Create new Order
      const newOrder = createOrder({
        productSlug: product.slug,
        tierLevel: selectedTier || 'pro',
        customer,
        payment: {
          method: paymentMethod,
          status: 'approved',
          txId:
            paymentMethod === 'pix'
              ? `PIX-${Math.floor(1000000 + Math.random() * 9000000)}`
              : `CC-${Math.floor(1000000 + Math.random() * 9000000)}`,
          amount: tier.price,
          installments: paymentMethod === 'credit_card' ? cardData.installments : 1,
          paidAt: new Date().toISOString(),
        },
      });

      // Redirect directly to briefing
      navigate('briefing', { orderId: newOrder.id });
    }, 1200);
  };

  return (
    <div className="py-12 md:py-20 bg-[#070A17] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-10">
          <div className="font-mono text-xs uppercase tracking-widest text-[#F6C453] mb-2">
            CHECKOUT SEGURO // CAMADA DE PAGAMENTO
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#F3F1EA] tracking-tight">
            Finalize a contratação e inicie o briefing.
          </h1>
        </div>

        {/* AUTHENTICATION GATEWAY BANNER IF NOT LOGGED IN */}
        {!isAuthenticated && (
          <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-[#0C1226] via-[#161f3d] to-[#0C1226] border border-[#19D3F3]/40 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-[#19D3F3]/15 text-[#19D3F3] shrink-0 border border-[#19D3F3]/30">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-[#19D3F3] tracking-widest font-bold block mb-1">
                  ETAPA OBRIGATÓRIA // CADASTRO E IDENTIFICAÇÃO SEGURA
                </span>
                <h3 className="font-heading text-lg font-bold text-[#F3F1EA]">
                  Você precisa estar logado para contratar
                </h3>
                <p className="text-xs text-[#98A1BC] max-w-xl mt-1 leading-relaxed">
                  Para garantir o sigilo dos seus briefings, notas fiscais, contratos e entregáveis na intranet da sua empresa, faça login ou cadastre sua conta antes de efetuar o pagamento.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => {
                  setRedirectAfterLogin('checkout');
                  navigate('login');
                }}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-[#F3F1EA] border border-white/20 transition-all"
              >
                Já Tenho Conta
              </button>
              <button
                type="button"
                onClick={() => {
                  setRedirectAfterLogin('checkout');
                  navigate('cadastro');
                }}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-[#19D3F3] hover:bg-[#15b7d3] text-xs font-bold text-[#070A17] shadow-lg transition-all"
              >
                Cadastrar Empresa
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Form & Payment Methods */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Customer Details */}
            <div className="bg-[#0C1226] border border-[rgba(243,241,234,0.12)] rounded-2xl p-6 sm:p-8">
              <h3 className="font-heading text-lg font-bold text-[#F3F1EA] mb-6 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-white/10 text-xs font-mono flex items-center justify-center text-[#F6C453]">
                  1
                </span>
                <span>Dados de Faturamento & Notificação</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#98A1BC] uppercase mb-1.5">
                    Nome Completo ou Razão Social *
                  </label>
                  <input
                    type="text"
                    required
                    value={customer.name}
                    onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                    className="w-full bg-[#070A17] border border-[rgba(243,241,234,0.15)] rounded-xl px-4 py-2.5 text-sm text-[#F3F1EA] focus:border-[#F6C453]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#98A1BC] uppercase mb-1.5">
                    E-mail para Entrega *
                  </label>
                  <input
                    type="email"
                    required
                    value={customer.email}
                    onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                    className="w-full bg-[#070A17] border border-[rgba(243,241,234,0.15)] rounded-xl px-4 py-2.5 text-sm text-[#F3F1EA] focus:border-[#F6C453]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#98A1BC] uppercase mb-1.5">
                    WhatsApp para Avisos de Status *
                  </label>
                  <input
                    type="text"
                    required
                    value={customer.phone}
                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                    className="w-full bg-[#070A17] border border-[rgba(243,241,234,0.15)] rounded-xl px-4 py-2.5 text-sm text-[#F3F1EA] focus:border-[#F6C453]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#98A1BC] uppercase mb-1.5">
                    CNPJ ou CPF para Nota Fiscal *
                  </label>
                  <input
                    type="text"
                    required
                    value={customer.document}
                    onChange={(e) => setCustomer({ ...customer, document: e.target.value })}
                    className="w-full bg-[#070A17] border border-[rgba(243,241,234,0.15)] rounded-xl px-4 py-2.5 text-sm text-[#F3F1EA] focus:border-[#F6C453]"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="bg-[#0C1226] border border-[rgba(243,241,234,0.12)] rounded-2xl p-6 sm:p-8">
              <h3 className="font-heading text-lg font-bold text-[#F3F1EA] mb-6 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-white/10 text-xs font-mono flex items-center justify-center text-[#F6C453]">
                  2
                </span>
                <span>Forma de Pagamento (Camada Segura)</span>
              </h3>

              {/* Method Switcher */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('pix')}
                  className={`p-4 rounded-xl border text-left transition-all flex items-center justify-between ${
                    paymentMethod === 'pix'
                      ? 'bg-[#19D3F3]/10 border-[#19D3F3] text-[#F3F1EA]'
                      : 'bg-[#070A17] border-[rgba(243,241,234,0.1)] text-[#98A1BC]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <QrCode className="w-5 h-5 text-[#19D3F3]" />
                    <div>
                      <span className="font-bold block text-sm">Pix Instantâneo</span>
                      <span className="text-[11px] text-[#19D3F3]">Aprovação imediata</span>
                    </div>
                  </div>
                  {paymentMethod === 'pix' && <CheckCircle2 className="w-4 h-4 text-[#19D3F3]" />}
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('credit_card')}
                  className={`p-4 rounded-xl border text-left transition-all flex items-center justify-between ${
                    paymentMethod === 'credit_card'
                      ? 'bg-[#FF2E93]/10 border-[#FF2E93] text-[#F3F1EA]'
                      : 'bg-[#070A17] border-[rgba(243,241,234,0.1)] text-[#98A1BC]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-[#FF2E93]" />
                    <div>
                      <span className="font-bold block text-sm">Cartão de Crédito</span>
                      <span className="text-[11px] text-[#98A1BC]">Até 12 parcelas</span>
                    </div>
                  </div>
                  {paymentMethod === 'credit_card' && (
                    <CheckCircle2 className="w-4 h-4 text-[#FF2E93]" />
                  )}
                </button>
              </div>

              {/* PIX DETAILS */}
              {paymentMethod === 'pix' && (
                <div className="p-6 rounded-xl bg-[#070A17] border border-[rgba(243,241,234,0.1)] space-y-4">
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    {/* Simulated QR Code */}
                    <div className="w-32 h-32 bg-white p-2 rounded-xl flex items-center justify-center shrink-0">
                      <div className="w-full h-full border-2 border-black grid grid-cols-4 grid-rows-4 p-1 gap-1">
                        <div className="bg-black col-span-2 row-span-2" />
                        <div className="bg-black col-span-1" />
                        <div className="bg-black" />
                        <div className="bg-black col-span-2" />
                        <div className="bg-black col-span-2 row-span-2" />
                        <div className="bg-black" />
                        <div className="bg-black col-span-2" />
                      </div>
                    </div>

                    <div className="space-y-2 text-center sm:text-left">
                      <div className="text-xs font-semibold text-[#19D3F3]">
                        Pix Gerado para Simulação de Checkout
                      </div>
                      <p className="text-xs text-[#98A1BC]">
                        Abra o app do seu banco ou copie a chave Pix abaixo. Neste ambiente de demonstração, o botão de confirmação simulará a webhook de liquidação instantânea.
                      </p>
                      <button
                        type="button"
                        onClick={handleCopyPix}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-[#F3F1EA] transition-colors border border-white/10"
                      >
                        {isCopiedPix ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{isCopiedPix ? 'Chave copiada!' : 'Copiar código Pix'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* CREDIT CARD DETAILS */}
              {paymentMethod === 'credit_card' && (
                <div className="p-6 rounded-xl bg-[#070A17] border border-[rgba(243,241,234,0.1)] space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-[#98A1BC] uppercase mb-1">
                        Número do Cartão
                      </label>
                      <input
                        type="text"
                        value={cardData.number}
                        onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                        className="w-full bg-[#0C1226] border border-[rgba(243,241,234,0.15)] rounded-xl px-4 py-2 text-sm text-[#F3F1EA]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#98A1BC] uppercase mb-1">
                        Titular do Cartão
                      </label>
                      <input
                        type="text"
                        value={cardData.holder}
                        onChange={(e) => setCardData({ ...cardData, holder: e.target.value })}
                        className="w-full bg-[#0C1226] border border-[rgba(243,241,234,0.15)] rounded-xl px-4 py-2 text-sm text-[#F3F1EA]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-semibold text-[#98A1BC] uppercase mb-1">
                          Validade
                        </label>
                        <input
                          type="text"
                          value={cardData.expiry}
                          onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                          className="w-full bg-[#0C1226] border border-[rgba(243,241,234,0.15)] rounded-xl px-4 py-2 text-sm text-[#F3F1EA]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#98A1BC] uppercase mb-1">
                          CVV
                        </label>
                        <input
                          type="text"
                          value={cardData.cvv}
                          onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                          className="w-full bg-[#0C1226] border border-[rgba(243,241,234,0.15)] rounded-xl px-4 py-2 text-sm text-[#F3F1EA]"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-[#98A1BC] uppercase mb-1">
                        Parcelamento
                      </label>
                      <select
                        value={cardData.installments}
                        onChange={(e) =>
                          setCardData({ ...cardData, installments: Number(e.target.value) })
                        }
                        className="w-full bg-[#0C1226] border border-[rgba(243,241,234,0.15)] rounded-xl px-4 py-2 text-sm text-[#F3F1EA]"
                      >
                        <option value={1}>
                          1x de R$ {tier.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} (à vista)
                        </option>
                        <option value={3}>
                          3x de R$ {(tier.price / 3).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} sem juros
                        </option>
                        <option value={6}>
                          6x de R$ {(tier.price / 6).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} sem juros
                        </option>
                        <option value={12}>
                          12x de R$ {((tier.price * 1.08) / 12).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </option>
                      </select>
                    </div>
                  </div>
                  <div className="text-[11px] text-[#98A1BC] flex items-center gap-1.5 pt-2">
                    <Lock className="w-3.5 h-3.5 text-[#FF2E93]" />
                    <span>Dados de cartão não são salvos em nossos servidores. Tokenização em conformidade com PCI-DSS.</span>
                  </div>
                </div>
              )}

              {/* Developer Test Simulator Control */}
              <div className="mt-4 pt-4 border-t border-[rgba(243,241,234,0.06)] flex items-center justify-between text-xs text-[#98A1BC]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={simulateFailure}
                    onChange={(e) => setSimulateFailure(e.target.checked)}
                    className="rounded bg-[#070A17] border-white/20 text-[#FF3B30]"
                  />
                  <span>Simular cenário de teste: Pagamento Recusado</span>
                </label>
                <span className="font-mono text-[10px] text-[#F6C453]">MOCK_PROVIDER</span>
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* LGPD Consent & Terms */}
            <div className="space-y-3 text-xs text-[#98A1BC]">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={customer.acceptedTerms}
                  onChange={(e) => setCustomer({ ...customer, acceptedTerms: e.target.checked })}
                  className="mt-0.5 rounded border-[rgba(243,241,234,0.2)] bg-[#070A17] text-[#FF3B30] focus:ring-[#F6C453]"
                />
                <span>
                  Declaro que li e concordo com os{' '}
                  <span className="text-[#F3F1EA] underline">Termos de Uso</span> e autorizo o tratamento dos dados do projeto para execução do serviço contratado em conformidade com a LGPD.
                </span>
              </label>
            </div>

            {/* Primary Action Button (Red token --r: #FF3B30) */}
            <button
              onClick={handleProcessPayment}
              disabled={isProcessing}
              className="w-full bg-[#FF3B30] hover:bg-[#e0342a] text-[#F3F1EA] py-4 rounded-xl text-sm font-bold tracking-wide transition-all shadow-[0_6px_24px_rgba(255,59,48,0.4)] hover:scale-[1.01] active:scale-[0.99] min-h-[48px] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{isProcessing ? 'Confirmando liquidação...' : 'Pagar e enviar briefing'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-[#0C1226] border border-[rgba(246,196,83,0.3)] rounded-2xl p-6 sm:p-8 sticky top-28 shadow-xl">
              
              <div className="font-mono text-xs text-[#F6C453] uppercase tracking-wider mb-2">
                Itens do Pedido
              </div>
              
              <h2 className="font-heading text-2xl font-bold text-[#F3F1EA] mb-1">
                {product.title}
              </h2>
              <div className="text-xs text-[#98A1BC] mb-6">
                Plano: <span className="text-[#F6C453] font-semibold">{tier.name}</span>
              </div>

              {/* Price Breakdown */}
              <div className="py-4 border-y border-[rgba(243,241,234,0.1)] space-y-2 mb-6 text-xs">
                <div className="flex items-center justify-between text-[#98A1BC]">
                  <span>Subtotal do serviço</span>
                  <span className="text-[#F3F1EA]">
                    R$ {tier.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[#98A1BC]">
                  <span>Curadoria e revisão executiva</span>
                  <span className="text-[#19D3F3]">Inclusa</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-[rgba(243,241,234,0.06)] text-sm font-bold">
                  <span className="text-[#F3F1EA]">Total Fixo</span>
                  <span className="font-heading text-xl text-[#F6C453]">
                    R$ {tier.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Deliverables snippet */}
              <div className="mb-6 space-y-2">
                <div className="text-[11px] font-mono uppercase text-[#98A1BC]">
                  Entregáveis garantidos:
                </div>
                {tier.deliverables.map((d, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-[#F3F1EA]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#F6C453] shrink-0 mt-0.5" />
                    <span>{d}</span>
                  </div>
                ))}
              </div>

              {/* Assurance Parameters */}
              <div className="space-y-3 pt-4 border-t border-[rgba(243,241,234,0.1)] text-xs text-[#98A1BC]">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#19D3F3]" />
                  <span>Prazo contratual: <strong>{tier.deliveryDays} dias úteis</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-[#FF2E93]" />
                  <span>Rodadas de ajuste: <strong>{tier.revisionsCount} inclusas</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-[#FFD400]" />
                  <span>Auditoria por diretor sênior antes do envio</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
