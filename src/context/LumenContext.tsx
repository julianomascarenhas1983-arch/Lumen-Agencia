import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, ProductTier, TierLevel, INITIAL_CATALOG } from '../data/catalog';
import { Order, OrderStatus, DeliverableItem, CustomerData, PaymentData, ClientProfile, InteractionMessage } from '../types';
import { SEED_ORDERS } from '../data/seedOrders';
import { INITIAL_CLIENT_PROFILES } from '../data/seedClients';
import { Language, getTranslation, formatCurrencyPrice } from '../i18n';

export type AppView =
  | 'home'
  | 'produtos'
  | 'produto-detalhe'
  | 'diagnostico'
  | 'admin'
  | 'dashboard'
  | 'conta'
  | 'sobre'
  | 'metodo'
  | 'contato'
  | 'termos'
  | 'privacidade';

interface LumenContextType {
  products: Product[];
  orders: Order[];
  currentView: AppView;
  selectedProductSlug: string | null;
  selectedTier: TierLevel;
  activeOrderId: string | null;
  currentUserEmail: string;
  // i18n & Currency
  language: Language;
  setLanguage: (lang: Language, manual?: boolean) => void;
  t: (key: string, fallback?: string) => string;
  formatPrice: (priceBRL: number, priceUSD?: number) => string;
  currency: 'BRL' | 'USD';
  // Navigation
  navigate: (view: AppView, params?: { slug?: string; tier?: TierLevel; orderId?: string }) => void;
  // Catalog actions
  getProduct: (slug: string) => Product | undefined;
  updateProduct: (updated: Product) => void;
  updateTierPrice: (slug: string, level: TierLevel, newPriceBRL: number, newPriceUSD?: number) => void;
  updateTierDays: (slug: string, level: TierLevel, newDays: number) => void;
  resetCatalog: () => void;
  // Order actions
  createOrder: (data: {
    productSlug: string;
    tierLevel: TierLevel;
    customer: CustomerData;
    payment: PaymentData;
  }) => Order;
  getOrder: (orderId: string) => Order | undefined;
  updateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => void;
  saveOrderBriefing: (orderId: string, briefingData: any) => void;
  addDeliverable: (orderId: string, deliverable: DeliverableItem) => void;
  requestAdjustment: (orderId: string, feedback: string) => boolean;
  approveOrderDelivery: (orderId: string) => void;
  setCurrentUserEmail: (email: string) => void;
  // Admin & Dashboard helpers
  clients: ClientProfile[];
  activeRole: 'client' | 'admin';
  setActiveRole: (role: 'client' | 'admin') => void;
  currentUser: ClientProfile | null;
  getClientProfile: (idOrEmail: string) => ClientProfile | undefined;
  updateClientProfile: (profileOrId: any, updates?: any) => void;
  addOrderInteraction: (orderId: string, message: any) => void;
  login: (email: string, pass?: string) => { success: boolean; error?: string };
  register: (data: any) => { success: boolean; error?: string };
  logout: () => void;
  redirectAfterLogin: () => void;
}

const LumenContext = createContext<LumenContextType | undefined>(undefined);

const CATALOG_STORAGE_KEY = 'lumen_catalog_v2';
const ORDERS_STORAGE_KEY = 'lumen_orders_v2';
const LANGUAGE_STORAGE_KEY = 'lumen_language';

// Initial language detection
const getInitialLanguage = (): Language => {
  try {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (saved === 'pt' || saved === 'en') {
      return saved;
    }
  } catch {}

  // Fallback to browser language
  if (typeof navigator !== 'undefined' && navigator.language) {
    if (navigator.language.toLowerCase().startsWith('pt')) {
      return 'pt';
    }
    return 'en';
  }

  return 'pt';
};

export const LumenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Language & i18n
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  // Automatic geolocation detection via Netlify Functions or server /api/geo
  useEffect(() => {
    // Only detect if user has NOT made an explicit manual choice
    try {
      const explicitChoice = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (explicitChoice === 'pt' || explicitChoice === 'en') {
        return; // Manual choice always has priority
      }
    } catch {}

    const detectGeo = async () => {
      try {
        let res = await fetch('/.netlify/functions/geo');
        if (!res.ok) {
          res = await fetch('/api/geo');
        }
        if (res.ok) {
          const data = await res.json();
          if (data && data.country) {
            const detectedLang: Language = data.country === 'BR' ? 'pt' : 'en';
            setLanguageState(detectedLang);
          }
        }
      } catch {
        // Fallback to browser language already active
      }
    };

    detectGeo();
  }, []);

  const setLanguage = (newLang: Language, manual: boolean = true) => {
    setLanguageState(newLang);
    if (manual) {
      try {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, newLang);
      } catch {}
    }
  };

  const t = (key: string, fallback?: string): string => {
    return getTranslation(language, key, fallback);
  };

  const formatPrice = (priceBRL: number, priceUSD?: number): string => {
    return formatCurrencyPrice(language, priceBRL, priceUSD);
  };

  const currency: 'BRL' | 'USD' = language === 'en' ? 'USD' : 'BRL';

  // Load catalog
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(CATALOG_STORAGE_KEY);
      if (saved) {
        const parsed: Product[] = JSON.parse(saved);
        return parsed.map((p) => {
          const initP = INITIAL_CATALOG.find((ip) => ip.slug === p.slug);
          if (!initP) return p;
          const updatedTiers: any = { ...p.tiers };
          for (const lvl of ['essencial', 'pro', 'premium'] as TierLevel[]) {
            if (updatedTiers[lvl]) {
              const initTier = initP.tiers[lvl];
              if (typeof updatedTiers[lvl].priceUSD !== 'number' && initTier) {
                updatedTiers[lvl].priceUSD = initTier.priceUSD;
              }
              if (!updatedTiers[lvl].summaryEn && initTier) {
                updatedTiers[lvl].nameEn = initTier.nameEn;
                updatedTiers[lvl].summaryEn = initTier.summaryEn;
                updatedTiers[lvl].deliverablesEn = initTier.deliverablesEn;
                updatedTiers[lvl].notIncludedEn = initTier.notIncludedEn;
              }
            }
          }
          return {
            ...p,
            titleEn: p.titleEn || initP.titleEn,
            shortDescriptionEn: p.shortDescriptionEn || initP.shortDescriptionEn,
            fullDescriptionEn: p.fullDescriptionEn || initP.fullDescriptionEn,
            badgeEn: p.badgeEn || initP.badgeEn,
            tiers: updatedTiers,
          };
        });
      }
    } catch (e) {
      console.error('Failed to parse catalog from storage', e);
    }
    return INITIAL_CATALOG;
  });

  // Load orders
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse orders from storage', e);
    }
    return SEED_ORDERS;
  });

  // Navigation & route params
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [selectedProductSlug, setSelectedProductSlug] = useState<string | null>('diagnostico-plano-estrategico');
  const [selectedTier, setSelectedTier] = useState<TierLevel>('pro');
  const [activeOrderId, setActiveOrderId] = useState<string | null>('LUM-94812');
  const [currentUserEmail, setCurrentUserEmail] = useState<string>('camila.v@aurorasaude.com.br');

  // Save changes
  useEffect(() => {
    try {
      localStorage.setItem(CATALOG_STORAGE_KEY, JSON.stringify(products));
    } catch (e) {
      console.error('Error saving catalog', e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error('Error saving orders', e);
    }
  }, [orders]);

  const navigate = (
    view: AppView,
    params?: { slug?: string; tier?: TierLevel; orderId?: string }
  ) => {
    if (params?.slug) setSelectedProductSlug(params.slug);
    if (params?.tier) setSelectedTier(params.tier);
    if (params?.orderId) setActiveOrderId(params.orderId);
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getProduct = (slug: string) => {
    return products.find((p) => p.slug === slug);
  };

  const updateProduct = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.slug === updated.slug ? updated : p)));
  };

  const updateTierPrice = (slug: string, level: TierLevel, newPriceBRL: number, newPriceUSD?: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.slug !== slug) return p;
        const currentTier = p.tiers[level];
        return {
          ...p,
          tiers: {
            ...p.tiers,
            [level]: {
              ...currentTier,
              price: Number(newPriceBRL),
              priceUSD: typeof newPriceUSD === 'number' ? Number(newPriceUSD) : currentTier.priceUSD,
            },
          },
        };
      })
    );
  };

  const updateTierDays = (slug: string, level: TierLevel, newDays: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.slug !== slug) return p;
        return {
          ...p,
          tiers: {
            ...p.tiers,
            [level]: {
              ...p.tiers[level],
              deliveryDays: Number(newDays),
            },
          },
        };
      })
    );
  };

  const resetCatalog = () => {
    setProducts(INITIAL_CATALOG);
    localStorage.removeItem(CATALOG_STORAGE_KEY);
  };

  const createOrder = (data: {
    productSlug: string;
    tierLevel: TierLevel;
    customer: CustomerData;
    payment: PaymentData;
  }): Order => {
    const product = getProduct(data.productSlug) || products[0];
    const tier = product.tiers[data.tierLevel];

    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const orderId = `LUM-${randomNum}`;

    const newOrder: Order = {
      id: orderId,
      createdAt: new Date().toISOString(),
      productSlug: product.slug,
      tierLevel: data.tierLevel,
      productTitle: product.title,
      tierName: tier.name,
      price: tier.price,
      deliveryDays: tier.deliveryDays,
      customer: data.customer,
      payment: data.payment,
      status: 'aguardando_briefing',
      timeline: [
        {
          timestamp: new Date().toISOString(),
          title: `Pagamento recebido (${data.payment.method === 'pix' ? 'Pix Instantâneo' : 'Cartão de Crédito'})`,
          description: `Valor de R$ ${tier.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} confirmado no sistema.`,
          status: 'aguardando_briefing',
        },
      ],
      revisionRoundsTotal: tier.revisionsCount,
      revisionRoundsUsed: 0,
      adjustments: [],
    };

    setOrders((prev) => [newOrder, ...prev]);
    setActiveOrderId(orderId);
    setCurrentUserEmail(data.customer.email);
    return newOrder;
  };

  const getOrder = (orderId: string) => {
    return orders.find((o) => o.id === orderId);
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, note?: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;

        const statusTitles: Record<OrderStatus, string> = {
          aguardando_briefing: 'Aguardando Briefing',
          em_producao: 'Em Produção (IA + Curadoria)',
          em_revisao: 'Em Revisão por Especialista',
          entregue: 'Material Entregue',
          aprovado: 'Entrega Aprovada pelo Cliente',
        };

        const newTimelineEvent = {
          timestamp: new Date().toISOString(),
          title: statusTitles[status],
          description: note || `Status do pedido atualizado para ${statusTitles[status]}.`,
          status,
        };

        return {
          ...o,
          status,
          timeline: [...o.timeline, newTimelineEvent],
        };
      })
    );
  };

  const saveOrderBriefing = (orderId: string, briefingData: any) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        const now = new Date().toISOString();
        return {
          ...o,
          status: 'em_producao',
          briefing: {
            ...briefingData,
            confirmedAt: now,
          },
          timeline: [
            ...o.timeline,
            {
              timestamp: now,
              title: 'Briefing estratégico finalizado',
              description: 'Resumo estruturado validado pelo cliente e encaminhado para os especialistas.',
              status: 'em_producao',
            },
          ],
        };
      })
    );
  };

  const addDeliverable = (orderId: string, deliverable: DeliverableItem) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        const deliverables = o.deliverables ? [...o.deliverables, deliverable] : [deliverable];
        return {
          ...o,
          status: 'entregue',
          deliverables,
          timeline: [
            ...o.timeline,
            {
              timestamp: new Date().toISOString(),
              title: `Entregável disponibilizado: ${deliverable.title}`,
              description: `Revisado e assinado por ${deliverable.approvedByCuratorName}.`,
              status: 'entregue',
            },
          ],
        };
      })
    );
  };

  const requestAdjustment = (orderId: string, feedback: string): boolean => {
    const order = getOrder(orderId);
    if (!order) return false;
    if (order.revisionRoundsUsed >= order.revisionRoundsTotal) return false;

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        const newUsed = o.revisionRoundsUsed + 1;
        return {
          ...o,
          status: 'em_producao',
          revisionRoundsUsed: newUsed,
          adjustments: [
            ...o.adjustments,
            {
              id: `adj-${Date.now()}`,
              requestedAt: new Date().toISOString(),
              notes: feedback,
              status: 'pending',
            },
          ],
          timeline: [
            ...o.timeline,
            {
              timestamp: new Date().toISOString(),
              title: `Solicitação de ajuste (${newUsed}/${o.revisionRoundsTotal})`,
              description: `O cliente solicitou apontamentos: "${feedback.slice(0, 100)}${feedback.length > 100 ? '...' : ''}"`,
              status: 'em_producao',
            },
          ],
        };
      })
    );
    return true;
  };

  const approveOrderDelivery = (orderId: string) => {
    updateOrderStatus(
      orderId,
      'aprovado',
      'O cliente conferiu os arquivos e formalizou o aceite integral do projeto.'
    );
  };

  const [clients, setClients] = useState<ClientProfile[]>(() => {
    try {
      const saved = localStorage.getItem('lumen_clients_v2');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_CLIENT_PROFILES;
  });

  const [activeRole, setActiveRole] = useState<'client' | 'admin'>('admin');
  const [currentUser, setCurrentUser] = useState<ClientProfile | null>(() => {
    return INITIAL_CLIENT_PROFILES[0] || null;
  });

  useEffect(() => {
    try {
      localStorage.setItem('lumen_clients_v2', JSON.stringify(clients));
    } catch {
      // ignore
    }
  }, [clients]);

  const getClientProfile = (idOrEmail: string) => {
    return clients.find(
      (c) => c.id === idOrEmail || c.email.toLowerCase() === idOrEmail.toLowerCase()
    );
  };

  const updateClientProfile = (profileOrId: any, updates?: any) => {
    setClients((prev) =>
      prev.map((c) => {
        if (typeof profileOrId === 'object' && profileOrId.id === c.id) {
          return { ...c, ...profileOrId };
        }
        if (typeof profileOrId === 'string' && c.id === profileOrId) {
          return { ...c, ...(updates || {}) };
        }
        return c;
      })
    );
  };

  const addOrderInteraction = (orderId: string, message: any) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        const msg: InteractionMessage = {
          id: `msg-${Date.now()}`,
          timestamp: new Date().toISOString(),
          sender: message.sender || 'agency',
          senderName: message.senderName || 'Lumen',
          text: message.text || '',
          ...message,
        };
        return {
          ...o,
          interactions: [...(o.interactions || []), msg],
        };
      })
    );
  };

  const login = (email: string, pass?: string) => {
    const found = clients.find((c) => c.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setCurrentUser(found);
      setCurrentUserEmail(found.email);
      setActiveRole(found.role || 'client');
      return { success: true };
    }
    return { success: false, error: 'Usuário não encontrado.' };
  };

  const register = (data: any) => {
    const newProfile: ClientProfile = {
      id: `cli-${Date.now()}`,
      name: data.name,
      email: data.email,
      companyName: data.companyName || data.name,
      segment: data.segment || 'Serviços',
      phone: data.phone || '',
      joinedAt: new Date().toISOString(),
      role: 'client',
      document: data.document || '',
    };
    setClients((prev) => [...prev, newProfile]);
    setCurrentUser(newProfile);
    setCurrentUserEmail(newProfile.email);
    setActiveRole('client');
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentUserEmail('');
    setActiveRole('client');
    navigate('home');
  };

  const redirectAfterLogin = () => {
    navigate('dashboard');
  };

  return (
    <LumenContext.Provider
      value={{
        products,
        orders,
        currentView,
        selectedProductSlug,
        selectedTier,
        activeOrderId,
        currentUserEmail,
        // i18n
        language,
        setLanguage,
        t,
        formatPrice,
        currency,
        navigate,
        getProduct,
        updateProduct,
        updateTierPrice,
        updateTierDays,
        resetCatalog,
        createOrder,
        getOrder,
        updateOrderStatus,
        saveOrderBriefing,
        addDeliverable,
        requestAdjustment,
        approveOrderDelivery,
        setCurrentUserEmail,
        clients,
        activeRole,
        setActiveRole,
        currentUser,
        getClientProfile,
        updateClientProfile,
        addOrderInteraction,
        login,
        register,
        logout,
        redirectAfterLogin,
      }}
    >
      {children}
    </LumenContext.Provider>
  );
};

export const useLumen = () => {
  const context = useContext(LumenContext);
  if (!context) {
    throw new Error('useLumen must be used within a LumenProvider');
  }
  return context;
};
