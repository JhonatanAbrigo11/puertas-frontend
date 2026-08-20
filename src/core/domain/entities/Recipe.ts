import { Material, MaterialUnit } from './Material';

export interface RecipeItemFormulaParams {
  widthCm: number;
  heightCm: number;
  quantity: number;
}

export interface RecipeItem {
  materialId: string;
  formulaDescription: string;
  calculate: (params: RecipeItemFormulaParams) => number;
  notes?: string;
  /** Si se define, reemplaza el consumo calculado por la fórmula */
  manualQuantityOverride?: number;
  /** Si se define, reemplaza el precio unitario del material */
  manualUnitPriceOverride?: number;
}

export interface Recipe {
  productId: string;
  items: RecipeItem[];
  wastePercentage?: number; // e.g. 5% desperdicio corte aluminio
}

export interface CalculatedMaterialItem {
  materialId: string;
  materialName: string;
  materialCategory: string;
  quantity: number;
  unit: MaterialUnit;
  unitPriceDemo: number;
  subtotalDemo: number;
  notes?: string;
}
