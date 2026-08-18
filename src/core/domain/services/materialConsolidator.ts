import { QuoteItem } from '../entities/QuoteItem';
import { ConsolidatedMaterial } from '../entities/Quote';

export function consolidateMaterials(
  items: QuoteItem[]
): ConsolidatedMaterial[] {
  if (!items || items.length === 0) {
    return [];
  }

  const map: Record<
    string,
    {
      materialId: string;
      materialName: string;
      category: string;
      totalQuantity: number;
      unit: ConsolidatedMaterial['unit'];
      unitPriceDemo: number;
      totalPriceDemo: number;
      productNamesSet: Set<string>;
    }
  > = {};

  items.forEach((quoteItem) => {
    quoteItem.calculatedMaterials.forEach((mat) => {
      if (!map[mat.materialId]) {
        map[mat.materialId] = {
          materialId: mat.materialId,
          materialName: mat.materialName,
          category: mat.materialCategory,
          totalQuantity: 0,
          unit: mat.unit,
          unitPriceDemo: mat.unitPriceDemo,
          totalPriceDemo: 0,
          productNamesSet: new Set<string>(),
        };
      }

      map[mat.materialId].totalQuantity += mat.quantity;
      map[mat.materialId].totalPriceDemo += mat.subtotalDemo;
      map[mat.materialId].productNamesSet.add(quoteItem.product.name);
    });
  });

  return Object.values(map)
    .map((entry) => ({
      materialId: entry.materialId,
      materialName: entry.materialName,
      category: entry.category,
      totalQuantity:
        entry.unit === 'und' || entry.unit === 'juego'
          ? Math.ceil(entry.totalQuantity)
          : Math.round(entry.totalQuantity * 100) / 100,
      unit: entry.unit,
      unitPriceDemo: entry.unitPriceDemo,
      totalPriceDemo: Math.round(entry.totalPriceDemo * 100) / 100,
      usedInProductsCount: entry.productNamesSet.size,
      productNames: Array.from(entry.productNamesSet),
    }))
    .sort((a, b) => {
      // Sort by category first, then by name
      if (a.category !== b.category) {
        return a.category.localeCompare(b.category);
      }
      return a.materialName.localeCompare(b.materialName);
    });
}
