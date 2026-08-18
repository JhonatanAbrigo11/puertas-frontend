export type MaterialUnit =
  | 'm'
  | 'm²'
  | 'und'
  | 'juego'
  | 'plancha'
  | 'ml'
  | 'tubo'
  | 'rollo'
  | 'barra';

export type MaterialCategory =
  | 'aluminio'
  | 'vidrio'
  | 'accesorios'
  | 'policarbonato'
  | 'acm'
  | 'sellantes'
  | 'tornilleria';

export interface Material {
  id: string;
  name: string;
  category: MaterialCategory;
  unit: MaterialUnit;
  unitPriceDemo: number;
  description?: string;
  code?: string;
  stockQuantity?: number;
  stockDetailLabel?: string;
  minStockAlert?: number;
}
