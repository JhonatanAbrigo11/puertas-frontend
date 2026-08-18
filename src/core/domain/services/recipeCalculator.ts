import { Product } from '../entities/Product';
import { CalculatedMaterialItem } from '../entities/Recipe';
import { materialsMap } from '../../../data/mock/materials';

export function calculateRecipe(
  product: Product,
  widthCm: number,
  heightCm: number,
  quantity: number
): CalculatedMaterialItem[] {
  if (!product || !product.recipe || !product.recipe.items) {
    return [];
  }

  // Ensure positive values
  const safeW = Math.max(0, widthCm);
  const safeH = Math.max(0, heightCm);
  const safeQ = Math.max(1, Math.round(quantity));

  return product.recipe.items.map((item) => {
    const rawQty = item.calculate({
      widthCm: safeW,
      heightCm: safeH,
      quantity: safeQ,
    });

    const materialDef = materialsMap[item.materialId];
    const unit = materialDef ? materialDef.unit : 'und';
    const unitPriceDemo = materialDef ? materialDef.unitPriceDemo : 0;
    const materialName = materialDef ? materialDef.name : item.materialId;
    const materialCategory = materialDef ? materialDef.category : 'accesorios';

    // Rounding: m and m² to 2 decimals, units/screws to whole numbers or integers
    const roundedQty =
      unit === 'und' || unit === 'juego'
        ? Math.ceil(rawQty)
        : Math.round(rawQty * 100) / 100;

    const subtotalDemo = Math.round(roundedQty * unitPriceDemo * 100) / 100;

    return {
      materialId: item.materialId,
      materialName,
      materialCategory,
      quantity: roundedQty,
      unit,
      unitPriceDemo,
      subtotalDemo,
      notes: item.notes || item.formulaDescription,
    };
  });
}
