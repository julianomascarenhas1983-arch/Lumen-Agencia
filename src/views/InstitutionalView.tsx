import React, { useState } from 'react';
import { useLumen, AppView } from '../context/LumenContext';
import { Shield, Mail, CheckCircle2, Lock, FileText, Send, Sparkles } from 'lucide-react';

interface Props {
  initialTab?: 'sobre' | 'metodo' | 'contato' | 'termos' | 'privacidade';
}

export const InstitutionalView: React.FC<Props> = ({ initialTab = 'sobre' }) => {
  const { currentView, navigate } = useLumen();
  const [activeTab, setActiveTab] = useState<'sobre' | 'metodo' | 'contato' | 'termos' | 'privacidade'>(
    (currentView as any) || initialTab
  );

  const [contactSent, setContactSent] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: 'Dúvida sobre produtos e curadoria',
    message: '',
  });

  const handleSendContact = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSent(true);
  };

  return (
    <div className="py-12 md:py-20 bg-[#070A17] min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 border-b border-[rgba(243,241,234,0.1)] scrollbar-none">
          <button
            onClick={() => setActiveTab('sobre')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'sobre'
                ? 'bg-[#F6C453] text-[#070A17]'
                : 'text-[#98A1BC] hover:text-[#F3F1EA]'
            }`}
          >
            Sobre a Lumen
          </button>
          <button
            onClick={() => setActiveTab('metodo')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'metodo'
                ? 'bg-[#F6C453] text-[#070A17]'
                : 'text-[#98A1BC] hover:text-[#F3F1EA]'
            }`}
          >
            Nosso Método Híbrido
          </button>
          <button
            onClick={() => setActiveTab('contato')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'contato'
                ? 'bg-[#F6C453] text-[#070A17]'
                : 'text-[#98A1BC] hover:text-[#F3F1EA]'
            }`}
          >
            Contato & DPO
          </button>
          <button
            onClick={() => setActiveTab('privacidade')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'privacidade'
                ? 'bg-[#F6C453] text-[#070A17]'
                : 'text-[#98A1BC] hover:text-[#F3F1EA]'
            }`}
          >
            Privacidade & LGPD
          </button>
          <button
            onClick={() => setActiveTab('termos')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'termos'
                ? 'bg-[#F6C453] text-[#070A17]'
                : 'text-[#98A1BC] hover:text-[#F3F1EA]'
            }`}
          >
            Termos de Uso
          </button>
        </div>

        {/* TAB 1: SOBRE */}
        {activeTab === 'sobre' && (
          <div className="space-y-10 animate-in fade-in duration-300">
            <div>
              <div className="font-mono text-xs uppercase tracking-widest text-[#F6C453] mb-2">
                MANIFESTO DA LUZ // IDENTIDADE
              </div>
              <h1 className="font-heading text-4xl sm:text-5xl font-extrabold text-[#F3F1EA] tracking-tight">
                Marcas que se fazem ver.
              </h1>
              <p className="mt-4 text-base sm:text-lg text-[#98A1BC] leading-relaxed">
                A palavra <em>Lumen</em> vem da unidade que mede o fluxo luminoso. Criamos a Lumen a partir de uma constatação dura: a grande maioria dos negócios morre não pela qualidade do que faz, mas pela mais pura invisibilidade.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-[#98A1BC] leading-relaxed">
              <div className="bg-[#0C1226] p-6 rounded-2xl border border-[rgba(243,241,234,0.1)] space-y-4">
                <h3 className="font-heading text-xl font-bold text-[#F3F1EA]">
                  O que quebramos no mercado tradicional
                </h3>
                <p>
                  Agências tradicionais operam com estruturas obsoletas: dezenas de reuniões de alinhamento, orçamentos imprevisíveis que mudam a cada conversa e prazos dilatados por burocracias de atendimento.
                </p>
                <p>
                  Por outro lado, plataformas puramente automatizadas entregam rascunhos rasos, alucinações de modelos e designs genéricos sem alma publicitária.
                </p>
              </div>

              <div className="bg-[#0C1226] p-6 rounded-2xl border border-[rgba(243,241,234,0.1)] space-y-4">
                <h3 className="font-heading text-xl font-bold text-[#F3F1EA]">
                  A resposta Lumen
                </h3>
                <p>
                  Unimos o melhor de dois mundos: inteligência artificial de última geração para acelerar rascunhos, variações e processamento de dados em minutos; e diretores de arte, estrategistas e redatores seniores para a curadoria, o refino estético e a tomada de decisão crítica.
                </p>
                <p>
                  O resultado são produtos de marketing com preço fixo, prazo garantido em contrato e nível de execução comparável às melhores agências do país.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MÉTODO */}
        {activeTab === 'metodo' && (
          <div className="space-y-10 animate-in fade-in duration-300">
            <div>
              <div className="font-mono text-xs uppercase tracking-widest text-[#19D3F3] mb-2">
                ENGENHARIA CRIATIVA // FLUXO HÍBRIDO
              </div>
              <h1 className="font-heading text-4xl sm:text-5xl font-extrabold text-[#F3F1EA] tracking-tight">
                O Ciclo Híbrido Lumen em 4 Passos
              </h1>
              <p className="mt-4 text-base sm:text-lg text-[#98A1BC] leading-relaxed">
                Como garantimos velocidade de computação sem abrir mão da sensibilidade humana.
              </p>
            </div>

            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-[#0C1226] border border-[#19D3F3]/20">
                <span className="font-mono text-xs text-[#19D3F3] uppercase">Etapa 1</span>
                <h3 className="font-heading text-xl font-bold text-[#F3F1EA] mt-1 mb-2">
                  Diagnóstico Estruturado
                </h3>
                <p className="text-sm text-[#98A1BC]">
                  Coleta de dados da categoria, segmentação do público e identificação dos gargalos do funil com auxílio de modelos de linguagem treinados em dados comerciais.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#0C1226] border border-[#FF2E93]/20">
                <span className="font-mono text-xs text-[#FF2E93] uppercase">Etapa 2</span>
                <h3 className="font-heading text-xl font-bold text-[#F3F1EA] mt-1 mb-2">
                  Briefing Guiado por IA
                </h3>
                <p className="text-sm text-[#98A1BC]">
                  Entrevista conversacional que extrai requisitos estratégicos sem formulários massacrantes de 30 páginas. Sintetiza na hora o documento executivo do projeto.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#0C1226] border border-[#FFD400]/20">
                <span className="font-mono text-xs text-[#FFD400] uppercase">Etapa 3</span>
                <h3 className="font-heading text-xl font-bold text-[#F3F1EA] mt-1 mb-2">
                  Geração Assistida & Curadoria Sênior
                </h3>
                <p className="text-sm text-[#98A1BC]">
                  A IA explora dezenas de variações conceituais. O curador humano seleciona as melhores rotas, corrige imperfeições, ajusta a hierarquia visual e redige a mensagem final com autoridade.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#0C1226] border border-[#F6C453]/20">
                <span className="font-mono text-xs text-[#F6C453] uppercase">Etapa 4</span>
                <h3 className="font-heading text-xl font-bold text-[#F3F1EA] mt-1 mb-2">
                  Entrega Auditada na Plataforma
                </h3>
                <p className="text-sm text-[#98A1BC]">
                  Disponibilização imediata com arquivos em alta resolução, código limpo ou relatórios executivos. Você tem rodadas contratuais de revisão asseguradas.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CONTATO */}
        {activeTab === 'contato' && (
          <div className="space-y-10 animate-in fade-in duration-300">
            <div>
              <div className="font-mono text-xs uppercase tracking-widest text-[#F6C453] mb-2">
                FALE COM OS ESPECIALISTAS // ATENDIMENTO
              </div>
              <h1 className="font-heading text-4xl sm:text-5xl font-extrabold text-[#F3F1EA] tracking-tight">
                Canal Direto Lumen
              </h1>
              <p className="mt-4 text-base text-[#98A1BC]">
                Precisa de um projeto sob medida para grande porte ou tem dúvidas sobre a curadoria?
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-[#0C1226] p-8 rounded-2xl border border-[rgba(243,241,234,0.1)] space-y-6">
                <div>
                  <h4 className="font-heading text-lg font-bold text-[#F3F1EA] mb-2">
                    Canais de Atendimento
                  </h4>
                  <p className="text-xs text-[#98A1BC] leading-relaxed">
                    Atendimento de segunda a sexta-feira, das 09h às 18h (Horário de Brasília).
                  </p>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center gap-3 text-[#F3F1EA]">
                    <Mail className="w-4 h-4 text-[#F6C453]" />
                    <span>contato@lumen.ag</span>
                  </div>
                  <div className="flex items-center gap-3 text-[#F3F1EA]">
                    <Shield className="w-4 h-4 text-[#19D3F3]" />
                    <span>Encarregado de Dados (DPO): dpo@lumen.ag</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-[rgba(243,241,234,0.08)] text-xs text-[#98A1BC]">
                  Projetos corporativos e contas anuais contam com canal exclusivo de curadoria e SLA reduzido.
                </div>
              </div>

              {contactSent ? (
                <div className="bg-[#0C1226] p-8 rounded-2xl border border-green-500/40 text-center flex flex-col items-center justify-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-green-400" />
                  <h3 className="font-heading text-xl font-bold text-[#F3F1EA]">
                    Mensagem Recebida com Sucesso!
                  </h3>
                  <p className="text-xs text-[#98A1BC]">
                    Nossa equipe responderá para seu e-mail em até 1 dia útil.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleSendContact}
                  className="bg-[#0C1226] p-8 rounded-2xl border border-[rgba(243,241,234,0.1)] space-y-4"
                >
                  <div>
                    <label className="block text-xs font-semibold text-[#98A1BC] uppercase mb-1">
                      Seu Nome *
                    </label>
                    <input
                      type="text"
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      className="w-full bg-[#070A17] border border-[rgba(243,241,234,0.15)] rounded-xl px-4 py-2.5 text-xs text-[#F3F1EA] focus:border-[#F6C453]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#98A1BC] uppercase mb-1">
                      Seu E-mail *
                    </label>
                    <input
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="w-full bg-[#070A17] border border-[rgba(243,241,234,0.15)] rounded-xl px-4 py-2.5 text-xs text-[#F3F1EA] focus:border-[#F6C453]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#98A1BC] uppercase mb-1">
                      Mensagem *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      className="w-full bg-[#070A17] border border-[rgba(243,241,234,0.15)] rounded-xl p-3 text-xs text-[#F3F1EA] focus:border-[#F6C453] resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#FF3B30] hover:bg-[#e0342a] text-[#F3F1EA] py-3 rounded-xl text-xs font-bold transition-all shadow-md"
                  >
                    Enviar Mensagem
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: PRIVACIDADE & LGPD */}
        {activeTab === 'privacidade' && (
          <div className="space-y-8 animate-in fade-in duration-300 text-xs sm:text-sm text-[#98A1BC] leading-relaxed">
            <div>
              <div className="font-mono text-xs uppercase tracking-widest text-[#FF2E93] mb-2">
                GOVERNANÇA DE DADOS // LEI 13.709/2018
              </div>
              <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#F3F1EA] tracking-tight">
                Política de Privacidade & Conformidade LGPD
              </h1>
              <p className="mt-2 text-xs text-[#98A1BC]">
                Última atualização: Setembro de 2026
              </p>
            </div>

            <div className="bg-[#0C1226] p-6 sm:p-8 rounded-2xl border border-[rgba(243,241,234,0.1)] space-y-6">
              <div>
                <h3 className="font-heading text-base font-bold text-[#F3F1EA] mb-2">
                  1. Nosso Compromisso com a Confidencialidade
                </h3>
                <p>
                  A Lumen trata os dados dos seus clientes com os mais altos padrões de segurança da informação. Seus dados de briefing, mercado e finanças são utilizados exclusivamente para a execução do serviço contratado e nunca são vendidos ou compartilhados com terceiros para fins de publicidade não solicitada.
                </p>
              </div>

              <div>
                <h3 className="font-heading text-base font-bold text-[#F3F1EA] mb-2">
                  2. Não Utilização para Treinamento Público de IA
                </h3>
                <p>
                  Os dados inseridos nos formulários de diagnóstico e nos briefings conversacionais são processados através de APIs corporativas seguras que não utilizam seus segredos comerciais ou textos de marca para alimentar modelos públicos de inteligência artificial.
                </p>
              </div>

              <div>
                <h3 className="font-heading text-base font-bold text-[#F3F1EA] mb-2">
                  3. Direitos do Titular (Art. 18 da LGPD)
                </h3>
                <p>
                  Você pode a qualquer momento solicitar: (a) confirmação da existência de tratamento; (b) acesso aos dados; (c) correção de dados incompletos ou inexatos; (d) exclusão total da conta e dados armazenados, bastando enviar um e-mail para <strong>dpo@lumen.ag</strong>.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: TERMOS DE USO */}
        {activeTab === 'termos' && (
          <div className="space-y-8 animate-in fade-in duration-300 text-xs sm:text-sm text-[#98A1BC] leading-relaxed">
            <div>
              <div className="font-mono text-xs uppercase tracking-widest text-[#F6C453] mb-2">
                REGRAS DO SERVIÇO // CONTRATO DE PRESTAÇÃO
              </div>
              <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#F3F1EA] tracking-tight">
                Termos de Uso e Garantia de Entrega
              </h1>
              <p className="mt-2 text-xs text-[#98A1BC]">
                Regras claras e prazos tabelados para proteção de ambas as partes.
              </p>
            </div>

            <div className="bg-[#0C1226] p-6 sm:p-8 rounded-2xl border border-[rgba(243,241,234,0.1)] space-y-6">
              <div>
                <h3 className="font-heading text-base font-bold text-[#F3F1EA] mb-2">
                  1. Escopo Fixo e Prazos Contratuais
                </h3>
                <p>
                  Cada produto contratado possui sua lista exata de entregáveis descrita no catálogo. O prazo de entrega tem início imediato após a confirmação do briefing pelo cliente na plataforma.
                </p>
              </div>

              <div>
                <h3 className="font-heading text-base font-bold text-[#F3F1EA] mb-2">
                  2. Rodadas de Ajuste e Revisão
                </h3>
                <p>
                  Cada nível prevê uma quantidade contratual de rodadas de revisão (1 a 4 rodadas). Os ajustes devem ser solicitados via Área do Cliente dentro do prazo de até 7 dias corridos após a entrega do material.
                </p>
              </div>

              <div>
                <h3 className="font-heading text-base font-bold text-[#F3F1EA] mb-2">
                  3. Propriedade Intelectual
                </h3>
                <p>
                  Após a liquidação do pagamento e a aprovação formal da entrega, todos os direitos patrimoniais de uso comercial dos logotipos, artes, textos e códigos pertencem integralmente ao cliente contratante.
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
