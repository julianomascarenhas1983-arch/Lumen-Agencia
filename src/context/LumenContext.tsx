import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, ProductTier, TierLevel, INITIAL_CATALOG } from '../data/catalog';
import { Order, OrderStatus, DeliverableItem, CustomerData, PaymentData } from '../types';
import { SEED_ORDERS } from '../data/seedOrders';

export type AppView =
  | 'home'
  | 'produtos'
  | 'produto-detalhe'
  | 'diagnostico'
  | 'admin'
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
  setCurrentUserEmail: (email: string) => void;
}

const LumenContext = createContext<LumenContextType | undefined>(undefined);

const CATALOG_STORAGE_KEY = 'lumen_catalog_v2';
const ORDERS_STORAGE_KEY = 'lumen_orders_v2';

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
