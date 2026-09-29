import React, { useState } from 'react';
import { useLumen } from '../context/LumenContext';
import {
  Instagram,
  Linkedin,
  MessageCircle,
  ExternalLink,
  Heart,
  MessageSquare,
  Share2,
  Sparkles,
  ArrowUpRight,
  Eye,
  CheckCircle2,
  Bookmark,
  Play
} from 'lucide-react';

interface SocialPost {
  id: string;
  platform: 'instagram' | 'linkedin' | 'behance';
  type: 'image' | 'video' | 'carousel';
  tag: string;
  title: string;
  imageAlt: string;
  gradient: string;
  accentColor: string;
  likes: number;
  comments: number;
  date: string;
  caption: string;
  authorHandle: string;
  externalUrl: string;
}

const SOCIAL_POSTS: SocialPost[] = [
  {
    id: 'post-1',
    platform: 'instagram',
    type: 'carousel',
    tag: 'Design System & Branding',
    title: 'Por que 90% das marcas parecem cópias em 2026 e como a luz autoral quebra esse padrão.',
    imageAlt: 'Paleta de cores CMYK e amostra de hot-stamping dourado',
    gradient: 'from-[#1A120B] via-[#2A1E11] to-[#070A17]',
    accentColor: '#F6C453',
    likes: 1420,
    comments: 89,
    date: 'Há 2 dias',
    caption: 'Quando todo mundo usa as mesmas ferramentas generativas sem direção de arte sênior, a estética média do mercado converge para o cinza. Na Lumen, tratamos a luz como arquitetura: contraste intencional, tipografia esculpida e acabamentos táteis que despertam desejo imediato. Veja o carrossel completo passando para o lado.',
    authorHandle: '@lumen.ag',
    externalUrl: 'https://instagram.com/lumen.ag',
  },
  {
    id: 'post-2',
    platform: 'instagram',
    type: 'video',
    tag: 'Reels dos Bastidores',
    title: 'Prompt + Olhar Humano: O processo de 60 segundos que economiza 3 semanas de reuniões.',
    imageAlt: 'Vídeo da tela do diretor de arte refinando vetor',
    gradient: 'from-[#0B1528] via-[#102447] to-[#070A17]',
    accentColor: '#19D3F3',
    likes: 3180,
    comments: 214,
    date: 'Há 4 dias',
    caption: 'A IA gera 40 variações visuais em 3 minutos. O diretor de arte descarta 38, combina as duas melhores e injeta o elemento humano que nenhuma máquina calcula: a intuição cultural brasileira. É assim que entregamos projetos em dias, não meses.',
    authorHandle: '@lumen.ag',
    externalUrl: 'https://instagram.com/lumen.ag',
  },
  {
    id: 'post-3',
    platform: 'linkedin',
    type: 'image',
    tag: 'Artigo Estratégico',
    title: 'Case Aurora Saúde: Como o rebranding e a clareza de posicionamento elevaram o ticket em 3.2x.',
    imageAlt: 'Gráfico de evolução de ticket e foto do espaço físico da clínica',
    gradient: 'from-[#0C1D18] via-[#15342C] to-[#070A17]',
    accentColor: '#52B788',
    likes: 870,
    comments: 63,
    date: 'Há 1 semana',
    caption: 'Guerra de preços é sintoma de marca invisível. Quando a Dra. Helena nos procurou, sua clínica de longevidade competia com convênios populares. Criamos uma nova identidade em Verde Botânico e Ouro Nobre, unificamos a narrativa dos protocolos e em 60 dias a clínica passou a atender com fila de espera.',
    authorHandle: 'Lumen Agência Virtual',
    externalUrl: 'https://linkedin.com/company/lumen-agencia',
  },
  {
    id: 'post-4',
    platform: 'instagram',
    type: 'carousel',
    tag: 'Guia de Impressão CMYK',
    title: 'O que a tela do computador esconde da sua gráfica: o guia de sobreposição de tintas.',
    imageAlt: 'Amostras de tintas Cyan, Magenta, Yellow e Black',
    gradient: 'from-[#290E1E] via-[#431430] to-[#070A17]',
    accentColor: '#FF2E93',
    likes: 2450,
    comments: 142,
    date: 'Há 1 semana',
    caption: 'RGB é luz aditiva emitida. CMYK é pigmento subtrativo absorvido. Se o seu designer não calibra o perfil de cores com curvas de ganho de ponto, seu cartão de visita azul vira roxo na impressora. Entenda por que todos os nossos entregáveis já saem com perfil de prova de cor certificado.',
    authorHandle: '@lumen.ag',
    externalUrl: 'https://instagram.com/lumen.ag',
  },
  {
    id: 'post-5',
    platform: 'behance',
    type: 'image',
    tag: 'Behance Curated Case',
    title: 'Origens Café: Identidade Visual, Embalagens de Microlotes e E-commerce Sensorial.',
    imageAlt: 'Embalagem de café em papel kraft mineral com hot stamping',
    gradient: 'from-[#24170A] via-[#3B2510] to-[#070A17]',
    accentColor: '#FFD400',
    likes: 4120,
    comments: 188,
    date: 'Destaque Behance',
    caption: 'Projeto selecionado para a curadoria global do Behance Graphic Design. Sistema visual que traduz a mineralidade do solo vulcânico do sul de Minas em relevo seco e tipografia autoral.',
    authorHandle: 'lumen-agency',
    externalUrl: 'https://behance.net/lumen-agency',
  },
  {
    id: 'post-6',
    platform: 'instagram',
    type: 'video',
    tag: 'Manifesto da Luz',
    title: '"Marcas que se fazem ver não gritam no escuro; elas acendem a própria frequência."',
    imageAlt: 'Fotografia cinematográfica com prisma refratando luz dourada',
    gradient: 'from-[#141226] via-[#1E1C3D] to-[#070A17]',
    accentColor: '#F6C453',
    likes: 5390,
    comments: 310,
    date: 'Vídeo Fixado',
    caption: 'Existe uma diferença brutal entre ser barulhento e ser inesquecível. Em um feed saturado de dancinhas e clichês, o que para o olhar é a elegância do silêncio bem desenhado e da proposta de valor inegável.',
    authorHandle: '@lumen.ag',
    externalUrl: 'https://instagram.com/lumen.ag',
  },
];

export const SocialShowcaseSection: React.FC = () => {
  const { navigate } = useLumen();
  const [activeTab, setActiveTab] = useState<'all' | 'instagram' | 'linkedin' | 'behance'>('all');
  const [selectedPost, setSelectedPost] = useState<SocialPost | null>(null);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});

  const filteredPosts = activeTab === 'all'
    ? SOCIAL_POSTS
    : SOCIAL_POSTS.filter((p) => p.platform === activeTab);

  const toggleLike = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  return (
    <section className="py-20 md:py-28 bg-[#060814] border-b border-[rgba(243,241,234,0.1)] relative overflow-hidden">
      {/* Background ambient light */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] opacity-15 blur-[120px]"
        style={{
          background: 'radial-gradient(circle, #F6C453 0%, #FF2E93 40%, rgba(7,10,23,0) 75%)',
        }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F6C453]/10 border border-[#F6C453]/30 text-[#F6C453] text-xs font-mono tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>CANAIS OFICIAIS & BASTIDORES CRIATIVOS</span>
            </div>
            
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#F3F1EA]">
              Siga a Lumen onde a luz é criada todos os dias.
            </h2>
            
            <p className="mt-3 text-base sm:text-lg text-[#98A1BC] leading-relaxed">
              Compartilhamos abertamente nossos processos, diretrizes de arte, análises de mercado e cases reais. Faça parte da nossa comunidade e converse com nossos curadores.
            </p>
          </div>

          {/* WhatsApp Direct Concierge Card */}
          <div className="shrink-0">
            <a
              href="https://wa.me/5511998421080?text=Ol%C3%A1!%20Conheci%20a%20Lumen%20e%20gostaria%20de%20conversar%20sobre%20um%20projeto%20para%20minha%20marca."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-5 py-3.5 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] transition-all shadow-[0_4px_20px_rgba(37,211,102,0.15)] hover:scale-[1.02] group"
            >
              <div className="relative">
                <MessageCircle className="w-5 h-5 text-[#25D366]" />
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#25D366] animate-ping" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold uppercase tracking-wider text-[#F3F1EA] group-hover:text-[#25D366] transition-colors">
                  WhatsApp VIP da Agência
                </div>
                <div className="text-[11px] text-[#98A1BC]">
                  Curador sênior disponível agora
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 ml-1" />
            </a>
          </div>
        </div>

        {/* The 4 Major Social Networks Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          
          {/* Instagram */}
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-5 rounded-xl bg-[#090E20] border border-[rgba(243,241,234,0.1)] hover:border-[#E1306C]/60 transition-all group flex flex-col justify-between hover:-translate-y-1 shadow-lg"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-[#FD1D1D] via-[#E1306C] to-[#405DE6] flex items-center justify-center text-white shadow-md">
                  <Instagram className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-mono text-[#F6C453] bg-[#F6C453]/10 px-2 py-0.5 rounded">
                  38.4k seguidores
                </span>
              </div>
              <div className="font-heading text-lg font-bold text-[#F3F1EA] group-hover:text-[#E1306C] transition-colors flex items-center gap-1.5">
                <span>@lumen.ag</span>
                <ArrowUpRight className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-xs text-[#98A1BC] mt-1.5 leading-relaxed">
                Carrosséis visuais, bastidores de criação, reels com direção de arte e enquetes de novos lançamentos.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 text-xs text-[#E1306C] font-semibold flex items-center gap-1">
              <span>Seguir no Instagram</span>
              <span>→</span>
            </div>
          </a>

          {/* LinkedIn */}
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-5 rounded-xl bg-[#090E20] border border-[rgba(243,241,234,0.1)] hover:border-[#0077B5]/60 transition-all group flex flex-col justify-between hover:-translate-y-1 shadow-lg"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#0077B5] flex items-center justify-center text-white shadow-md">
                  <Linkedin className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-mono text-[#19D3F3] bg-[#19D3F3]/10 px-2 py-0.5 rounded">
                  19.2k conexões
                </span>
              </div>
              <div className="font-heading text-lg font-bold text-[#F3F1EA] group-hover:text-[#0077B5] transition-colors flex items-center gap-1.5">
                <span>Lumen Agência Virtual</span>
                <ArrowUpRight className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-xs text-[#98A1BC] mt-1.5 leading-relaxed">
                Artigos estratégicos dos fundadores sobre maturidade de marca, governança com IA e retorno sobre investimento.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 text-xs text-[#0077B5] font-semibold flex items-center gap-1">
              <span>Conectar no LinkedIn</span>
              <span>→</span>
            </div>
          </a>

          {/* Behance */}
          <a
            href="https://behance.net"
            target="_blank"
            rel="noopener noreferrer"
            className="p-5 rounded-xl bg-[#090E20] border border-[rgba(243,241,234,0.1)] hover:border-[#1769FF]/60 transition-all group flex flex-col justify-between hover:-translate-y-1 shadow-lg"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#1769FF] flex items-center justify-center text-white font-heading font-black text-sm shadow-md">
                  Bē
                </div>
                <span className="text-[11px] font-mono text-[#FFD400] bg-[#FFD400]/10 px-2 py-0.5 rounded">
                  45k visualizações
                </span>
              </div>
              <div className="font-heading text-lg font-bold text-[#F3F1EA] group-hover:text-[#1769FF] transition-colors flex items-center gap-1.5">
                <span>lumen-agency</span>
                <ArrowUpRight className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-xs text-[#98A1BC] mt-1.5 leading-relaxed">
                Portfólio integral com identidades visuais completas, marcas autorais, protótipos de embalagens e design editorial.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 text-xs text-[#1769FF] font-semibold flex items-center gap-1">
              <span>Ver no Behance</span>
              <span>→</span>
            </div>
          </a>

          {/* YouTube & Conteúdo */}
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-5 rounded-xl bg-[#090E20] border border-[rgba(243,241,234,0.1)] hover:border-[#FF0000]/60 transition-all group flex flex-col justify-between hover:-translate-y-1 shadow-lg"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#FF0000] flex items-center justify-center text-white shadow-md">
                  <Play className="w-5 h-5 fill-white" />
                </div>
                <span className="text-[11px] font-mono text-[#FF2E93] bg-[#FF2E93]/10 px-2 py-0.5 rounded">
                  Lumen Sessions
                </span>
              </div>
              <div className="font-heading text-lg font-bold text-[#F3F1EA] group-hover:text-[#FF3B30] transition-colors flex items-center gap-1.5">
                <span>Lumen Creative Studio</span>
                <ArrowUpRight className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-xs text-[#98A1BC] mt-1.5 leading-relaxed">
                Vídeos de campanha, breakdowns de direção de arte e entrevistas com nossos especialistas seniores.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 text-xs text-[#FF3B30] font-semibold flex items-center gap-1">
              <span>Assistir Vídeos</span>
              <span>→</span>
            </div>
          </a>

        </div>

        {/* Filter Segmented Bar */}
        <div className="flex items-center justify-between border-b border-[rgba(243,241,234,0.1)] pb-4 mb-8">
          <div className="flex items-center gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === 'all'
                  ? 'bg-[#F3F1EA] text-[#070A17] font-bold'
                  : 'text-[#98A1BC] hover:text-[#F3F1EA] bg-[#090E20]'
              }`}
            >
              Todos os Destaques (6)
            </button>
            <button
              onClick={() => setActiveTab('instagram')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'instagram'
                  ? 'bg-[#E1306C] text-white font-bold'
                  : 'text-[#98A1BC] hover:text-[#F3F1EA] bg-[#090E20]'
              }`}
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>Instagram (@lumen.ag)</span>
            </button>
            <button
              onClick={() => setActiveTab('linkedin')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'linkedin'
                  ? 'bg-[#0077B5] text-white font-bold'
                  : 'text-[#98A1BC] hover:text-[#F3F1EA] bg-[#090E20]'
              }`}
            >
              <Linkedin className="w-3.5 h-3.5" />
              <span>LinkedIn</span>
            </button>
            <button
              onClick={() => setActiveTab('behance')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'behance'
                  ? 'bg-[#1769FF] text-white font-bold'
                  : 'text-[#98A1BC] hover:text-[#F3F1EA] bg-[#090E20]'
              }`}
            >
              <span>Behance Cases</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-[#98A1BC]">
            <span className="w-2 h-2 rounded-full bg-[#F6C453] animate-pulse" />
            <span>Feed atualizado diariamente</span>
          </div>
        </div>

        {/* Interactive Post Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => {
            const isLiked = Boolean(likedPosts[post.id]);
            const currentLikes = post.likes + (isLiked ? 1 : 0);

            return (
              <div
                key={post.id}
                onClick={() => setSelectedPost(post)}
                className="group cursor-pointer rounded-2xl bg-[#090E20] border border-[rgba(243,241,234,0.12)] hover:border-[rgba(246,196,83,0.4)] overflow-hidden transition-all duration-300 hover:-translate-y-1.5 shadow-xl flex flex-col justify-between"
              >
                {/* Visual Header / Cover */}
                <div
                  className={`h-56 p-6 bg-gradient-to-br ${post.gradient} relative flex flex-col justify-between overflow-hidden`}
                >
                  {/* Decorative background glow */}
                  <div
                    className="absolute top-0 right-0 w-44 h-44 rounded-full opacity-20 blur-2xl pointer-events-none"
                    style={{ background: post.accentColor }}
                  />

                  {/* Top Bar inside image */}
                  <div className="flex items-center justify-between relative z-10">
                    <span
                      className="text-[10px] font-mono tracking-wider px-2.5 py-1 rounded-full bg-black/40 border border-white/10 backdrop-blur-sm"
                      style={{ color: post.accentColor }}
                    >
                      {post.tag}
                    </span>
                    <div className="w-7 h-7 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white/80 group-hover:text-white transition-colors">
                      {post.platform === 'instagram' && <Instagram className="w-3.5 h-3.5" />}
                      {post.platform === 'linkedin' && <Linkedin className="w-3.5 h-3.5" />}
                      {post.platform === 'behance' && <span className="font-bold text-xs">Bē</span>}
                    </div>
                  </div>

                  {/* Central Text on Card */}
                  <div className="relative z-10">
                    <h3 className="font-heading text-lg font-bold text-[#F3F1EA] group-hover:text-[#F6C453] transition-colors line-clamp-3 leading-snug drop-shadow-md">
                      {post.title}
                    </h3>
                  </div>

                  {/* Bottom bar inside image */}
                  <div className="flex items-center justify-between text-[11px] text-white/70 relative z-10 pt-2 border-t border-white/10">
                    <span className="font-mono">{post.authorHandle}</span>
                    <span className="flex items-center gap-1 text-[10px] bg-white/10 px-2 py-0.5 rounded">
                      <Eye className="w-3 h-3" />
                      Clique para ler
                    </span>
                  </div>
                </div>

                {/* Card Caption Excerpt & Engagement Bar */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-[#98A1BC] line-clamp-2 leading-relaxed mb-4">
                    {post.caption}
                  </p>

                  <div className="pt-3 border-t border-[rgba(243,241,234,0.08)] flex items-center justify-between text-xs text-[#98A1BC]">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={(e) => toggleLike(post.id, e)}
                        className={`flex items-center gap-1.5 transition-colors ${
                          isLiked ? 'text-[#FF2E93]' : 'hover:text-[#FF2E93]'
                        }`}
                        title="Curtir publicação"
                      >
                        <Heart className={`w-4 h-4 ${isLiked ? 'fill-[#FF2E93]' : ''}`} />
                        <span>{currentLikes.toLocaleString('pt-BR')}</span>
                      </button>

                      <div className="flex items-center gap-1.5">
                        <MessageSquare className="w-4 h-4" />
                        <span>{post.comments}</span>
                      </div>
                    </div>

                    <span className="text-[11px] font-mono text-[#98A1BC]/70">{post.date}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Global CTA under feed */}
        <div className="mt-14 p-8 rounded-2xl bg-gradient-to-r from-[#0C1226] via-[#0E1738] to-[#0C1226] border border-[rgba(246,196,83,0.3)] text-center relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-left max-w-xl">
            <h3 className="font-heading text-2xl font-bold text-[#F3F1EA]">
              Quer ver a sua marca com esse nível de acabamento?
            </h3>
            <p className="text-sm text-[#98A1BC] mt-1">
              Contrate produtos individuais com preço fixo garantido ou faça o diagnóstico gratuito para receber a rota ideal.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => navigate('produtos')}
              className="px-6 py-3 rounded-full bg-[#FF3B30] hover:bg-[#e0342a] text-[#F3F1EA] font-bold text-sm transition-all shadow-[0_4px_20px_rgba(255,59,48,0.3)] hover:scale-[1.02]"
            >
              Explorar Catálogo & Preços
            </button>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-full bg-[#080B18] border border-[#F6C453]/40 text-[#F6C453] hover:border-[#F6C453] font-semibold text-sm transition-all flex items-center gap-1.5"
            >
              <Instagram className="w-4 h-4" />
              <span>Seguir @lumen.ag</span>
            </a>
          </div>
        </div>

      </div>

      {/* Interactive Post Modal / Lightbox */}
      {selectedPost && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in"
          onClick={() => setSelectedPost(null)}
        >
          <div
            className="bg-[#0A0E22] border border-[rgba(246,196,83,0.3)] rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-[rgba(243,241,234,0.1)] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#F6C453] text-[#070A17] font-bold flex items-center justify-center text-xs">
                  L
                </div>
                <div>
                  <div className="font-heading text-sm font-bold text-[#F3F1EA] flex items-center gap-1.5">
                    <span>{selectedPost.authorHandle}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#19D3F3]" />
                  </div>
                  <div className="text-[11px] text-[#98A1BC]">{selectedPost.tag} · {selectedPost.date}</div>
                </div>
              </div>

              <button
                onClick={() => setSelectedPost(null)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-[#98A1BC] hover:text-[#F3F1EA] flex items-center justify-center text-sm font-bold transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 sm:p-8 max-h-[70vh] overflow-y-auto">
              <div
                className={`p-6 rounded-xl bg-gradient-to-br ${selectedPost.gradient} border border-white/10 mb-6 relative overflow-hidden`}
              >
                <div
                  className="absolute top-0 right-0 w-44 h-44 rounded-full opacity-30 blur-2xl pointer-events-none"
                  style={{ background: selectedPost.accentColor }}
                />
                <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#F3F1EA] relative z-10 leading-snug">
                  {selectedPost.title}
                </h3>
              </div>

              <div className="text-sm text-[#F3F1EA] leading-relaxed space-y-4">
                <p>{selectedPost.caption}</p>
                <div className="pt-2 text-xs text-[#F6C453] font-mono flex flex-wrap gap-2">
                  <span>#BrandingAutoral</span>
                  <span>#LumenAgencia</span>
                  <span>#DesignSystem</span>
                  <span>#MarketingDePrecisao</span>
                </div>
              </div>

              {/* Action Buttons inside modal */}
              <div className="mt-8 pt-6 border-t border-[rgba(243,241,234,0.1)] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4 text-xs text-[#98A1BC]">
                  <button
                    onClick={(e) => toggleLike(selectedPost.id, e)}
                    className={`flex items-center gap-1.5 transition-colors ${
                      likedPosts[selectedPost.id] ? 'text-[#FF2E93]' : 'hover:text-[#FF2E93]'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${likedPosts[selectedPost.id] ? 'fill-[#FF2E93]' : ''}`} />
                    <span>
                      {(selectedPost.likes + (likedPosts[selectedPost.id] ? 1 : 0)).toLocaleString('pt-BR')} curtidas
                    </span>
                  </button>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    <span>{selectedPost.comments} comentários</span>
                  </span>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <a
                    href={selectedPost.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-[#F6C453] hover:bg-[#e0af43] text-[#070A17] font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    <span>Ver no {selectedPost.platform === 'instagram' ? 'Instagram' : selectedPost.platform === 'linkedin' ? 'LinkedIn' : 'Behance'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
