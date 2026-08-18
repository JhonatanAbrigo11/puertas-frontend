import { QuoteItem } from './QuoteItem';
import { MaterialUnit } from './Material';

export interface ConsolidatedMaterial {
  materialId: string;
  materialName: string;
  category: string;
  totalQuantity: number;
  unit: MaterialUnit;
  unitPriceDemo: number;
  totalPriceDemo: number;
  usedInProductsCount: number;
  productNames: string[];
}

export interface QuoteCustomer {
  name: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
}

export interface Quote {
  id: string;
  quoteNumber: string;
  customer: QuoteCustomer;
  items: QuoteItem[];
  totalItemCount: number;
  subtotalMaterialsDemo: number;
  estimatedLaborDemo: number;
  totalDemo: number;
  consolidatedMaterials: ConsolidatedMaterial[];
  createdAt: string;
  validUntil: string;
}
