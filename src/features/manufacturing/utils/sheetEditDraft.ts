import { Product } from '../../../core/domain/entities/Product';

export interface RecipeItemDraft {
  materialId: string;
  formulaDescription: string;
  manualQuantity: string;
  manualUnitPrice: string;
  notes: string;
}

export interface SheetEditDraft {
  code: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  fabricationType: string;
  aluminumSeries: string;
  glassType: string;
  mainMaterial: string;
  minWidthCm: string;
  maxWidthCm: string;
  minHeightCm: string;
  maxHeightCm: string;
  defaultWidthCm: string;
  defaultHeightCm: string;
  customImageUri: string;
  wastePercentage: string;
  recipeItems: RecipeItemDraft[];
}

export function buildSheetDraftFromProduct(product: Product): SheetEditDraft {
  return {
    code: product.code,
    name: product.name,
    shortDescription: product.shortDescription,
    fullDescription: product.fullDescription,
    fabricationType: product.fabricationType,
    aluminumSeries: product.aluminumSeries,
    glassType: product.glassType,
    mainMaterial: product.mainMaterial,
    minWidthCm: String(product.minWidthCm),
    maxWidthCm: String(product.maxWidthCm),
    minHeightCm: String(product.minHeightCm),
    maxHeightCm: String(product.maxHeightCm),
    defaultWidthCm: String(product.defaultWidthCm),
    defaultHeightCm: String(product.defaultHeightCm),
    customImageUri: product.customImageUri || '',
    wastePercentage:
      product.recipe?.wastePercentage !== undefined
        ? String(product.recipe.wastePercentage)
        : '',
    recipeItems: (product.recipe?.items || []).map((item) => ({
      materialId: item.materialId,
      formulaDescription: item.formulaDescription,
      manualQuantity:
        item.manualQuantityOverride !== undefined
          ? String(item.manualQuantityOverride)
          : '',
      manualUnitPrice:
        item.manualUnitPriceOverride !== undefined
          ? String(item.manualUnitPriceOverride)
          : '',
      notes: item.notes || '',
    })),
  };
}

function parseNum(value: string, fallback: number): number {
  const n = parseFloat(value.replace(',', '.'));
  return Number.isFinite(n) ? n : fallback;
}

export function applySheetDraftToProduct(
  product: Product,
  draft: SheetEditDraft
): Product {
  return {
    ...product,
    code: draft.code.trim(),
    name: draft.name.trim(),
    shortDescription: draft.shortDescription.trim(),
    fullDescription: draft.fullDescription.trim(),
    fabricationType: draft.fabricationType.trim(),
    aluminumSeries: draft.aluminumSeries.trim(),
    glassType: draft.glassType.trim(),
    mainMaterial: draft.mainMaterial.trim(),
    minWidthCm: parseNum(draft.minWidthCm, product.minWidthCm),
    maxWidthCm: parseNum(draft.maxWidthCm, product.maxWidthCm),
    minHeightCm: parseNum(draft.minHeightCm, product.minHeightCm),
    maxHeightCm: parseNum(draft.maxHeightCm, product.maxHeightCm),
    defaultWidthCm: parseNum(draft.defaultWidthCm, product.defaultWidthCm),
    defaultHeightCm: parseNum(draft.defaultHeightCm, product.defaultHeightCm),
    customImageUri: draft.customImageUri.trim() || undefined,
    recipe: {
      productId: product.id,
      wastePercentage: draft.wastePercentage.trim()
        ? parseNum(draft.wastePercentage, 0)
        : product.recipe?.wastePercentage,
      items: (product.recipe?.items || []).map((item, index) => {
        const row = draft.recipeItems[index];
        if (!row) return item;

        const manualQty = row.manualQuantity.trim();
        const manualPrice = row.manualUnitPrice.trim();

        return {
          ...item,
          formulaDescription: row.formulaDescription.trim(),
          notes: row.notes.trim() || undefined,
          manualQuantityOverride: manualQty
            ? parseNum(manualQty, item.manualQuantityOverride ?? 0)
            : undefined,
          manualUnitPriceOverride: manualPrice
            ? parseNum(manualPrice, item.manualUnitPriceOverride ?? 0)
            : undefined,
        };
      }),
    },
  };
}

export function draftToPreviewProduct(
  product: Product,
  draft: SheetEditDraft
): Product {
  return applySheetDraftToProduct(product, draft);
}
