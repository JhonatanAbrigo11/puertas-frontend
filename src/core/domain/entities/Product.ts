import { CategoryId } from './Category';
import { Recipe } from './Recipe';

export interface Product {
  id: string;
  categoryId: CategoryId;
  name: string;
  code: string;
  shortDescription: string;
  fullDescription: string;
  fabricationType: string; // e.g. "Fabricación a medida"
  applications: string[]; // e.g. ["Residencial", "Comercial", "Oficinas"]
  mainMaterial: string; // e.g. "Aluminio Serie 25 + Vidrio 6mm"
  glassType: string; // e.g. "Vidrio Templado 6mm / Incoloro"
  aluminumSeries: string; // e.g. "Línea Europea 25mm"
  defaultWidthCm: number;
  defaultHeightCm: number;
  minWidthCm: number;
  maxWidthCm: number;
  minHeightCm: number;
  maxHeightCm: number;
  illustrationType: string;
  customImageUri?: string;
  features: string[];
  recipe: Recipe;
}
