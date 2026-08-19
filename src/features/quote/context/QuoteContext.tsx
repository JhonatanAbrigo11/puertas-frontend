import React, { createContext, useContext, useState, useMemo } from 'react';
import { Product } from '../../../core/domain/entities/Product';
import { QuoteItem } from '../../../core/domain/entities/QuoteItem';
import {
  ConsolidatedMaterial,
  QuoteCustomer,
} from '../../../core/domain/entities/Quote';
import { calculateRecipe } from '../../../core/domain/services/recipeCalculator';
import { consolidateMaterials } from '../../../core/domain/services/materialConsolidator';
import {
  calculateQuoteTotals,
  QuoteTotals,
} from '../../../core/domain/services/quoteCalculator';

interface ToastInfo {
  visible: boolean;
  message: string;
  subMessage?: string;
  type?: 'success' | 'info' | 'warning' | 'error';
}

export interface ClientRecord extends QuoteCustomer {
  id: string;
}

interface QuoteContextType {
  items: QuoteItem[];
  addItem: (
    product: Product,
    widthCm: number,
    heightCm: number,
    quantity: number,
    notes?: string
  ) => void;
  removeItem: (id: string) => void;
  updateItemQuantity: (id: string, quantity: number) => void;
  updateItemDimensions: (
    id: string,
    widthCm: number,
    heightCm: number
  ) => void;
  clearQuote: () => void;
  consolidatedMaterials: ConsolidatedMaterial[];
  totals: QuoteTotals;
  customer: QuoteCustomer;
  updateCustomer: (customerData: Partial<QuoteCustomer>) => void;
  clients: ClientRecord[];
  selectedClientId: string;
  selectClient: (clientId: string) => void;
  addClient: (clientData: QuoteCustomer) => void;
  updateClient: (clientId: string, clientData: QuoteCustomer) => void;
  deleteClient: (clientId: string) => void;
  quoteNumber: string;
  toast: ToastInfo;
  showToast: (
    message: string,
    subMessage?: string,
    type?: 'success' | 'info' | 'warning' | 'error'
  ) => void;
  hideToast: () => void;
}

const QuoteContext = createContext<QuoteContextType | undefined>(undefined);

export const QuoteProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [quoteNumber] = useState<string>(
    `PRO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
  );
  const [customer, setCustomer] = useState<QuoteCustomer>({
    name: 'Constructora & Proyectos Civiles S.A.',
    phone: '+593 99 123 4567',
    email: 'contacto@constructora.com',
    address: 'Av. Arquitectura y Los Alamos #450',
    notes: 'Entrega en obra, incluye pre-instalación de tacos y anclajes.',
  });
  const [selectedClientId, setSelectedClientId] = useState<string>('current-client');
  const [clients, setClients] = useState<ClientRecord[]>([
    {
      id: 'current-client',
      name: 'Constructora & Proyectos Civiles S.A.',
      phone: '+593 99 123 4567',
      email: 'contacto@constructora.com',
      address: 'Av. Arquitectura y Los Alamos #450',
      notes: 'Entrega en obra, incluye pre-instalación de tacos y anclajes.',
    },
  ]);

  const [toast, setToast] = useState<ToastInfo>({
    visible: false,
    message: '',
    subMessage: '',
    type: 'success',
  });

  const showToast = (
    message: string,
    subMessage?: string,
    type: ToastInfo['type'] = 'success'
  ) => {
    setToast({
      visible: true,
      message,
      subMessage,
      type,
    });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, visible: false }));
  };

  // Add Item to Quote
  const addItem = (
    product: Product,
    widthCm: number,
    heightCm: number,
    quantity: number,
    notes?: string
  ) => {
    const calculatedMaterials = calculateRecipe(
      product,
      widthCm,
      heightCm,
      quantity
    );

    const subtotalDemo = calculatedMaterials.reduce(
      (sum, m) => sum + m.subtotalDemo,
      0
    );
    const unitPriceDemo =
      quantity > 0 ? Math.round((subtotalDemo / quantity) * 100) / 100 : 0;

    const newItem: QuoteItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      product,
      widthCm,
      heightCm,
      quantity,
      calculatedMaterials,
      unitPriceDemo,
      subtotalDemo: Math.round(subtotalDemo * 100) / 100,
      notes,
      createdAt: new Date().toISOString(),
    };

    setItems((prev) => [...prev, newItem]);

    showToast(
      'Producto agregado al carrito',
      `${product.name} (${widthCm} × ${heightCm} cm - Cant: ${quantity})`,
      'success'
    );
  };

  // Remove Item
  const removeItem = (id: string) => {
    const itemToRemove = items.find((i) => i.id === id);
    setItems((prev) => prev.filter((i) => i.id !== id));

    if (itemToRemove) {
      showToast(
        'Producto eliminado',
        `${itemToRemove.product.name} fue quitado del carrito.`,
        'info'
      );
    }
  };

  // Update Quantity
  const updateItemQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }

    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const calculatedMaterials = calculateRecipe(
            item.product,
            item.widthCm,
            item.heightCm,
            quantity
          );
          const subtotalDemo = calculatedMaterials.reduce(
            (sum, m) => sum + m.subtotalDemo,
            0
          );
          const unitPriceDemo =
            quantity > 0 ? Math.round((subtotalDemo / quantity) * 100) / 100 : 0;

          return {
            ...item,
            quantity,
            calculatedMaterials,
            unitPriceDemo,
            subtotalDemo: Math.round(subtotalDemo * 100) / 100,
          };
        }
        return item;
      })
    );
  };

  // Update Dimensions
  const updateItemDimensions = (
    id: string,
    widthCm: number,
    heightCm: number
  ) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const calculatedMaterials = calculateRecipe(
            item.product,
            widthCm,
            heightCm,
            item.quantity
          );
          const subtotalDemo = calculatedMaterials.reduce(
            (sum, m) => sum + m.subtotalDemo,
            0
          );
          const unitPriceDemo =
            item.quantity > 0
              ? Math.round((subtotalDemo / item.quantity) * 100) / 100
              : 0;

          return {
            ...item,
            widthCm,
            heightCm,
            calculatedMaterials,
            unitPriceDemo,
            subtotalDemo: Math.round(subtotalDemo * 100) / 100,
          };
        }
        return item;
      })
    );
  };

  // Clear Cart
  const clearQuote = () => {
    setItems([]);
    showToast('Carrito vaciado', 'Se han eliminado todos los productos.', 'info');
  };

  // Update Customer Info
  const updateCustomer = (customerData: Partial<QuoteCustomer>) => {
    setCustomer((prev) => ({ ...prev, ...customerData }));
  };

  const selectClient = (clientId: string) => {
    const client = clients.find((item) => item.id === clientId);
    if (!client) return;

    setSelectedClientId(clientId);
    setCustomer({
      name: client.name,
      phone: client.phone,
      email: client.email,
      address: client.address,
      notes: client.notes,
    });
  };

  const addClient = (clientData: QuoteCustomer) => {
    const newClient: ClientRecord = {
      id: `client-${Date.now()}`,
      name: clientData.name.trim(),
      phone: clientData.phone.trim(),
      email: clientData.email.trim(),
      address: clientData.address.trim(),
      notes: clientData.notes.trim(),
    };

    setClients((prev) => [newClient, ...prev]);
    setSelectedClientId(newClient.id);
    setCustomer({
      name: newClient.name,
      phone: newClient.phone,
      email: newClient.email,
      address: newClient.address,
      notes: newClient.notes,
    });
  };

  const updateClient = (clientId: string, clientData: QuoteCustomer) => {
    const normalizedClient: ClientRecord = {
      id: clientId,
      name: clientData.name.trim(),
      phone: clientData.phone.trim(),
      email: clientData.email.trim(),
      address: clientData.address.trim(),
      notes: clientData.notes.trim(),
    };

    setClients((prev) =>
      prev.map((client) => (client.id === clientId ? normalizedClient : client))
    );

    if (selectedClientId === clientId) {
      setCustomer({
        name: normalizedClient.name,
        phone: normalizedClient.phone,
        email: normalizedClient.email,
        address: normalizedClient.address,
        notes: normalizedClient.notes,
      });
    }
  };

  const deleteClient = (clientId: string) => {
    setClients((prev) => {
      const nextClients = prev.filter((client) => client.id !== clientId);
      if (nextClients.length === 0) {
        const fallbackClient: ClientRecord = {
          id: 'current-client',
          name: '',
          phone: '',
          email: '',
          address: '',
          notes: '',
        };
        setSelectedClientId(fallbackClient.id);
        setCustomer({
          name: fallbackClient.name,
          phone: fallbackClient.phone,
          email: fallbackClient.email,
          address: fallbackClient.address,
          notes: fallbackClient.notes,
        });
        return [fallbackClient];
      }

      if (selectedClientId === clientId) {
        const fallbackClient = nextClients[0];
        setSelectedClientId(fallbackClient.id);
        setCustomer({
          name: fallbackClient.name,
          phone: fallbackClient.phone,
          email: fallbackClient.email,
          address: fallbackClient.address,
          notes: fallbackClient.notes,
        });
      }

      return nextClients;
    });
  };

  // Memoized Consolidated Materials & Totals
  const consolidatedMaterials = useMemo(() => {
    return consolidateMaterials(items);
  }, [items]);

  const totals = useMemo(() => {
    return calculateQuoteTotals(items);
  }, [items]);

  return (
    <QuoteContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateItemQuantity,
        updateItemDimensions,
        clearQuote,
        consolidatedMaterials,
        totals,
        customer,
        updateCustomer,
        clients,
        selectedClientId,
        selectClient,
        addClient,
        updateClient,
        deleteClient,
        quoteNumber,
        toast,
        showToast,
        hideToast,
      }}
    >
      {children}
    </QuoteContext.Provider>
  );
};

export const useQuote = () => {
  const context = useContext(QuoteContext);
  if (!context) {
    throw new Error('useQuote must be used within a QuoteProvider');
  }
  return context;
};
