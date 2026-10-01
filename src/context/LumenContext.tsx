import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, ProductTier, TierLevel, INITIAL_CATALOG } from '../data/catalog';
import {
  Order,
  OrderStatus,
  DeliverableItem,
  CustomerData,
  PaymentData,
  ClientProfile,
  InteractionMessage,
} from '../types';
import { SEED_ORDERS } from '../data/seedOrders';
import { INITIAL_CLIENT_PROFILES } from '../data/seedClients';

export type AppView =
  | 'home'
  | 'dashboard'
  | 'produtos'
  | 'produto-detalhe'
  | 'diagnostico'
  | 'checkout'
  | 'briefing'
  | 'conta'
  | 'login'
  | 'cadastro'
  | 'admin'
  | 'sobre'
  | 'metodo'
  | 'contato'
  | 'termos'
  | 'privacidade';

export type UserRole = 'client' | 'admin' | 'curator';

interface LumenContextType {
  products: Product[];
  orders: Order[];
  clients: ClientProfile[];
  currentView: AppView;
  selectedProductSlug: string | null;
  selectedTier: TierLevel;
  activeOrderId: string | null;
  
  // Authentication & Session
  isAuthenticated: boolean;
  currentUser: ClientProfile | null;
  currentUserEmail: string;
  activeRole: UserRole; // 'client' | 'admin' | 'curator'
  redirectAfterLogin: AppView | null;
  
  // Auth methods
  login: (email: string, password?: string) => { success: boolean; error?: string };
  register: (data: {
    name: string;
    email: string;
    password?: string;
    phone: string;
    document: string;
    companyName: string;
    segment: string;
    city?: string;
  }) => { success: boolean; error?: string };
  logout: () => void;
  setActiveRole: (role: UserRole) => void;
  setCurrentUserEmail: (email: string) => void;
  setRedirectAfterLogin: (view: AppView | null) => void;

  // Navigation
  navigate: (view: AppView, params?: { slug?: string; tier?: TierLevel; orderId?: string }) => void;
  
  // Catalog actions
  getProduct: (slug: string) => Product | undefined;
  updateProduct: (updated: Product) => void;
  updateTierPrice: (slug: string, level: TierLevel, newPrice: number) => void;
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
  
  // Client & Interaction actions
  getClientProfile: (email: string) => ClientProfile | undefined;
  updateClientProfile: (updated: ClientProfile) => void;
  addOrderInteraction: (orderId: string, message: { text: string; role?: 'client' | 'admin' | 'curator'; authorName?: string }) => void;
}

const LumenContext = createContext<LumenContextType | undefined>(undefined);

const CATALOG_STORAGE_KEY = 'lumen_catalog_v4';
const ORDERS_STORAGE_KEY = 'lumen_orders_v4';
const CLIENTS_STORAGE_KEY = 'lumen_clients_v4';
const AUTH_STORAGE_KEY = 'lumen_auth_session_v4';

export const LumenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load catalog
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(CATALOG_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
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

  // Load client profiles
  const [clients, setClients] = useState<ClientProfile[]>(() => {
    try {
      const saved = localStorage.getItem(CLIENTS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse clients from storage', e);
    }
    return INITIAL_CLIENT_PROFILES;
  });

  // Authentication State
  const [currentUser, setCurrentUser] = useState<ClientProfile | null>(() => {
    try {
      const savedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
      if (savedAuth) {
        return JSON.parse(savedAuth);
      }
    } catch (e) {
      console.error('Failed to parse auth session', e);
    }
    return null; // By default user is NOT logged in initially for privacy!
  });

  const isAuthenticated = Boolean(currentUser);
  const currentUserEmail = currentUser?.email || '';
  const activeRole: UserRole = currentUser?.role || 'client';

  // Navigation & session state
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [selectedProductSlug, setSelectedProductSlug] = useState<string | null>('diagnostico-plano-estrategico');
  const [selectedTier, setSelectedTier] = useState<TierLevel>('pro');
  const [activeOrderId, setActiveOrderId] = useState<string | null>('LUM-94812');
  const [redirectAfterLogin, setRedirectAfterLogin] = useState<AppView | null>(null);

  // Persistence
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

  useEffect(() => {
    try {
      localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(clients));
    } catch (e) {
      console.error('Error saving clients', e);
    }
  }, [clients]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Error saving auth session', e);
    }
  }, [currentUser]);

  // Auth Methods
  const login = (email: string, password?: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const found = clients.find((c) => c.email.toLowerCase() === cleanEmail);

    if (!found) {
      return { success: false, error: 'E-mail não cadastrado. Crie sua conta para acessar.' };
    }

    if (password && found.password && found.password !== password) {
      return { success: false, error: 'Senha incorreta para esta conta.' };
    }

    setCurrentUser(found);

    // Redirect to destination or default
    const nextView = redirectAfterLogin || (found.role === 'admin' ? 'admin' : 'dashboard');
    setRedirectAfterLogin(null);
    setCurrentView(nextView);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    return { success: true };
  };

  const register = (data: {
    name: string;
    email: string;
    password?: string;
    phone: string;
    document: string;
    companyName: string;
    segment: string;
    city?: string;
  }) => {
    const cleanEmail = data.email.trim().toLowerCase();
    const existing = clients.find((c) => c.email.toLowerCase() === cleanEmail);
    if (existing) {
      return { success: false, error: 'Este e-mail já possui uma conta cadastrada. Faça login.' };
    }

    const newProfile: ClientProfile = {
      id: `cli-${Date.now()}`,
      name: data.name.trim(),
      email: cleanEmail,
      password: data.password || 'lumen@2026',
      phone: data.phone.trim(),
      document: data.document.trim(),
      companyName: data.companyName.trim() || data.name.trim(),
      segment: data.segment.trim() || 'Serviços & Negócios',
      city: data.city || 'Brasil',
      joinedAt: new Date().toISOString(),
      role: 'client',
      accountManager: 'Renato Cunha (Diretor Estratégico)',
      notesFromTeam: 'Novo cliente cadastrado na plataforma.',
    };

    setClients((prev) => [newProfile, ...prev]);
    setCurrentUser(newProfile);

    const nextView = redirectAfterLogin || 'dashboard';
    setRedirectAfterLogin(null);
    setCurrentView(nextView);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const setActiveRole = (role: UserRole) => {
    if (currentUser) {
      const updated = { ...currentUser, role };
      setCurrentUser(updated);
      setClients((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    }
  };

  const setCurrentUserEmail = (email: string) => {
    const target = clients.find((c) => c.email.toLowerCase() === email.toLowerCase());
    if (target) {
      setCurrentUser(target);
    }
  };

  const navigate = (
    view: AppView,
    params?: { slug?: string; tier?: TierLevel; orderId?: string }
  ) => {
    // PROTECT INTRANET & PRIVATE DATA:
    // If user tries to access 'conta', 'dashboard', 'briefing' without login, redirect to login
    if (['conta', 'dashboard', 'briefing'].includes(view) && !currentUser) {
      setRedirectAfterLogin(view);
      setCurrentView('login');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // If user tries to access admin without admin role
    if (view === 'admin' && currentUser?.role !== 'admin') {
      // If logged in as client, notify or switch view
      if (!currentUser) {
        setRedirectAfterLogin('admin');
        setCurrentView('login');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }

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

  const updateTierPrice = (slug: string, level: TierLevel, newPrice: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.slug !== slug) return p;
        return {
          ...p,
          tiers: {
            ...p.tiers,
            [level]: {
              ...p.tiers[level],
              price: Number(newPrice),
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
    const contractNumber = `CTR-2026-10-${randomNum}`;
    const now = new Date().toISOString();

    const newOrder: Order = {
      id: orderId,
      contractNumber,
      receiptUrl: `#recibo-${randomNum}`,
      createdAt: now,
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
          timestamp: now,
          title: `Pagamento recebido (${data.payment.method === 'pix' ? 'Pix Instantâneo' : 'Cartão de Crédito'})`,
          description: `Valor de R$ ${tier.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} confirmado no sistema com Recibo e Contrato ${contractNumber}.`,
          status: 'aguardando_briefing',
        },
      ],
      revisionRoundsTotal: tier.revisionsCount,
      revisionRoundsUsed: 0,
      adjustments: [],
      interactions: [
        {
          id: `msg-${Date.now()}`,
          senderRole: 'admin',
          senderName: 'Lumen Agência Virtual',
          text: `Pedido registrado com sucesso! O próximo passo para a produção de ${product.title} é preencher o seu Briefing Guiado.`,
          timestamp: now,
        },
      ],
    };

    // Ensure client profile exists or is registered
    setClients((prev) => {
      const exists = prev.find((c) => c.email.toLowerCase() === data.customer.email.toLowerCase());
      if (exists) return prev;
      const newProfile: ClientProfile = {
        id: `cli-${Date.now()}`,
        name: data.customer.name,
        email: data.customer.email,
        phone: data.customer.phone,
        document: data.customer.document,
        companyName: data.customer.name,
        segment: 'Não especificado',
        joinedAt: now,
        accountManager: 'Renato Cunha (Diretor Estratégico)',
        notesFromTeam: 'Novo cliente via contratação direta na plataforma.',
      };
      return [newProfile, ...prev];
    });

    setOrders((prev) => [newOrder, ...prev]);
    setActiveOrderId(orderId);
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

  const getClientProfile = (email: string) => {
    return clients.find((c) => c.email.toLowerCase() === email.toLowerCase()) || clients[0];
  };

  const updateClientProfile = (updated: ClientProfile) => {
    setClients((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    if (currentUser && currentUser.id === updated.id) {
      setCurrentUser(updated);
    }
  };

  const addOrderInteraction = (
    orderId: string,
    message: { text: string; role?: 'client' | 'admin' | 'curator'; authorName?: string }
  ) => {
    const now = new Date().toISOString();
    const newMsg: InteractionMessage = {
      id: `msg-${Date.now()}`,
      senderRole: message.role || activeRole,
      senderName:
        message.authorName ||
        (activeRole === 'client'
          ? currentUser?.name || 'Cliente'
          : activeRole === 'admin'
          ? 'Diretoria Lumen (Admin)'
          : 'Curadoria Lumen'),
      text: message.text,
      timestamp: now,
    };

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        return {
          ...o,
          interactions: [...(o.interactions || []), newMsg],
        };
      })
    );
  };

  return (
    <LumenContext.Provider
      value={{
        products,
        orders,
        clients,
        currentView,
        selectedProductSlug,
        selectedTier,
        activeOrderId,
        isAuthenticated,
        currentUser,
        currentUserEmail,
        activeRole,
        redirectAfterLogin,
        login,
        register,
        logout,
        setActiveRole,
        setCurrentUserEmail,
        setRedirectAfterLogin,
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
        getClientProfile,
        updateClientProfile,
        addOrderInteraction,
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
