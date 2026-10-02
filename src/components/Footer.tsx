import React from 'react';
import { useLumen, AppView } from '../context/LumenContext';
import { Shield, Sparkles, Instagram, Linkedin, MessageCircle, ArrowUpRight, Play } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigate } = useLumen();

  return (
    <footer className="bg-[#050711] border-t border-[rgba(243,241,234,0.12)] pt-16 pb-12 text-sm text-[#98A1BC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Social Showcase Banner in Footer */}
        <div className="mb-14 p-6 sm:p-8 rounded-2xl bg-[#090D1E] border border-[rgba(246,196,83,0.25)] flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#F6C453] uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Conecte-se com o nosso estúdio</span>
            </div>
            <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#F3F1EA]">
              Siga os bastidores, paletas e novos cases da Lumen.
            </h3>
            <p className="text-xs sm:text-sm text-[#98A1BC] mt-1">
              Publicamos estudos de arte, insights de mercado e tutoriais de direção criativa todas as semanas.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-[#E1306C]/10 hover:bg-[#E1306C]/20 border border-[#E1306C]/30 text-[#F3F1EA] text-xs font-semibold flex items-center gap-2 transition-all hover:scale-105"
            >
              <Instagram className="w-4 h-4 text-[#E1306C]" />
              <span>@lumen.ag</span>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-[#0077B5]/10 hover:bg-[#0077B5]/20 border border-[#0077B5]/30 text-[#F3F1EA] text-xs font-semibold flex items-center gap-2 transition-all hover:scale-105"
            >
              <Linkedin className="w-4 h-4 text-[#0077B5]" />
              <span>LinkedIn</span>
            </a>
            <a
              href="https://behance.net"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-[#1769FF]/10 hover:bg-[#1769FF]/20 border border-[#1769FF]/30 text-[#F3F1EA] text-xs font-semibold flex items-center gap-2 transition-all hover:scale-105"
            >
              <span className="font-black text-xs text-[#1769FF]">Bē</span>
              <span>Behance</span>
            </a>
            <a
              href="https://wa.me/5511998421080?text=Ol%C3%A1!%20Gostaria%20de%20falar%20com%20um%20curador%20da%20Lumen."
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#25D366] text-xs font-semibold flex items-center gap-2 transition-all hover:scale-105"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[rgba(243,241,234,0.08)]">
          
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-6 rounded-full border border-[rgba(246,196,83,0.4)] flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-[#F6C453]" />
              </div>
              <span className="font-heading text-xl font-bold text-[#F3F1EA] tracking-tight">
                Lumen
              </span>
            </div>
            
            <p className="text-[#F6C453] text-sm font-semibold mb-2">
              Marcas que se fazem ver.
            </p>
            <p className="text-xs text-[#98A1BC] max-w-sm leading-relaxed mb-6">
              Agência virtual de marketing estratégico, marketing digital, publicidade e comunicação. Inteligência artificial para velocidade e escala, com curadoria de especialistas seniores.
            </p>

            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="px-2 py-0.5 rounded bg-[#19D3F3]/10 text-[#19D3F3]">C 100</span>
              <span className="px-2 py-0.5 rounded bg-[#FF2E93]/10 text-[#FF2E93]">M 100</span>
              <span className="px-2 py-0.5 rounded bg-[#FFD400]/10 text-[#FFD400]">Y 100</span>
              <span className="px-2 py-0.5 rounded bg-white/10 text-[#F3F1EA]">K 0</span>
            </div>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="font-heading text-xs uppercase tracking-wider text-[#F3F1EA] font-semibold mb-4">
              Soluções
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => navigate('produto-detalhe', { slug: 'diagnostico-plano-estrategico' })}
                  className="hover:text-[#F3F1EA] transition-colors"
                >
                  Plano Estratégico
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('produto-detalhe', { slug: 'identidade-visual' })}
                  className="hover:text-[#F3F1EA] transition-colors"
                >
                  Identidade Visual & Branding
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('produto-detalhe', { slug: 'pack-artes-redes-sociais' })}
                  className="hover:text-[#F3F1EA] transition-colors"
                >
                  Pack de Artes para Redes
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('produto-detalhe', { slug: 'video-de-campanha' })}
                  className="hover:text-[#F3F1EA] transition-colors"
                >
                  Vídeo de Campanha
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('produto-detalhe', { slug: 'landing-page' })}
                  className="hover:text-[#F3F1EA] transition-colors"
                >
                  Landing Page
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('produto-detalhe', { slug: 'lumen-continuo' })}
                  className="hover:text-[#F3F1EA] transition-colors"
                >
                  Lumen Contínuo (Mensal)
                </button>
              </li>
            </ul>
          </div>

          {/* Plataforma */}
          <div>
            <h4 className="font-heading text-xs uppercase tracking-wider text-[#F3F1EA] font-semibold mb-4">
              Plataforma
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => navigate('produtos')} className="hover:text-[#F3F1EA] transition-colors">
                  Catálogo com Preço Fixo
                </button>
              </li>
              <li>
                <button onClick={() => navigate('diagnostico')} className="hover:text-[#F6C453] transition-colors flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#F6C453]" />
                  Diagnóstico Gratuito
                </button>
              </li>
              <li>
                <a
                  href="https://wa.me/5511998421080?text=Ol%C3%A1!%20Gostaria%20de%20falar%20com%20um%20curador%20da%20Lumen."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#25D366] transition-colors flex items-center gap-1.5 text-[#25D366]"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Atendimento via WhatsApp</span>
                </a>
              </li>
              <li>
                <button onClick={() => navigate('admin')} className="hover:text-[#F6C453] transition-colors">
                  Painel Interno de Curadoria
                </button>
              </li>
              <li>
                <button onClick={() => navigate('metodo')} className="hover:text-[#F3F1EA] transition-colors">
                  Nosso Método Híbrido
                </button>
              </li>
            </ul>
          </div>

          {/* Institucional & Legal */}
          <div>
            <h4 className="font-heading text-xs uppercase tracking-wider text-[#F3F1EA] font-semibold mb-4">
              Institucional & LGPD
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => navigate('sobre')} className="hover:text-[#F3F1EA] transition-colors">
                  Sobre a Lumen
                </button>
              </li>
              <li>
                <button onClick={() => navigate('contato')} className="hover:text-[#F3F1EA] transition-colors">
                  Fale com a Equipe
                </button>
              </li>
              <li>
                <button onClick={() => navigate('privacidade')} className="hover:text-[#F3F1EA] transition-colors">
                  Política de Privacidade (LGPD)
                </button>
              </li>
              <li>
                <button onClick={() => navigate('termos')} className="hover:text-[#F3F1EA] transition-colors">
                  Termos de Uso do Serviço
                </button>
              </li>
              <li className="pt-2 text-[11px] text-[#98A1BC]/70">
                Canal do DPO: <span className="text-[#F3F1EA]">privacidade@lumen.ag</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F6C453]" />
            <span>© {new Date().getFullYear()} Lumen Agência Virtual. Todos os direitos reservados.</span>
          </div>

          <div className="flex items-center gap-4 text-xs text-[#98A1BC]">
            <span>Ambiente Seguro com Criptografia SSL</span>
            <span className="text-[#F6C453]">Instagram: @lumen.ag</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
