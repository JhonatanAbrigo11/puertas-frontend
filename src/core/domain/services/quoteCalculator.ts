import { QuoteItem } from '../entities/QuoteItem';

export interface QuoteTotals {
  itemCount: number;
  totalProductsCount: number;
  subtotalMaterialsDemo: number;
  estimatedLaborDemo: number;
  totalDemo: number;
}

export function calculateQuoteTotals(items: QuoteItem[]): QuoteTotals {
  if (!items || items.length === 0) {
    return {
      itemCount: 0,
      totalProductsCount: 0,
      subtotalMaterialsDemo: 0,
      estimatedLaborDemo: 0,
      totalDemo: 0,
    };
  }

  const itemCount = items.length;
  const totalProductsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotalMaterialsDemo = items.reduce(
    (sum, item) => sum + (item.subtotalDemo || 0),
    0
  );

  // Demo estimation: ~25% fabrication & installation labor
  const estimatedLaborDemo = Math.round(subtotalMaterialsDemo * 0.25 * 100) / 100;
  const totalDemo = Math.round((subtotalMaterialsDemo + estimatedLaborDemo) * 100) / 100;

  return {
    itemCount,
    totalProductsCount,
    subtotalMaterialsDemo: Math.round(subtotalMaterialsDemo * 100) / 100,
    estimatedLaborDemo,
    totalDemo,
  };
}
