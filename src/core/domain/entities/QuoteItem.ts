import { Product } from './Product';
import { CalculatedMaterialItem } from './Recipe';

export interface QuoteItem {
  id: string;
  product: Product;
  widthCm: number;
  heightCm: number;
  quantity: number;
  calculatedMaterials: CalculatedMaterialItem[];
  unitPriceDemo: number;
  subtotalDemo: number;
  notes?: string;
  createdAt: string;
}
