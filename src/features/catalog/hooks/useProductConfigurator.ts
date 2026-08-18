import { useState, useMemo, useEffect } from 'react';
import { Product } from '../../../core/domain/entities/Product';
import { calculateRecipe } from '../../../core/domain/services/recipeCalculator';
import { CalculatedMaterialItem } from '../../../core/domain/entities/Recipe';

export function useProductConfigurator(product: Product) {
  const [widthCm, setWidthCm] = useState<number>(product.defaultWidthCm);
  const [heightCm, setHeightCm] = useState<number>(product.defaultHeightCm);
  const [quantity, setQuantity] = useState<number>(1);

  // Sync state when selected product changes
  useEffect(() => {
    setWidthCm(product.defaultWidthCm);
    setHeightCm(product.defaultHeightCm);
    setQuantity(1);
  }, [product.id]);

  // Validation
  const errors = useMemo(() => {
    const errs: { width?: string; height?: string; quantity?: string } = {};

    if (widthCm <= 0) {
      errs.width = 'El ancho debe ser mayor a 0 cm';
    } else if (widthCm < product.minWidthCm) {
      errs.width = `Mínimo sugerido: ${product.minWidthCm} cm`;
    } else if (widthCm > product.maxWidthCm) {
      errs.width = `Máximo técnico: ${product.maxWidthCm} cm`;
    }

    if (heightCm <= 0) {
      errs.height = 'El alto debe ser mayor a 0 cm';
    } else if (heightCm < product.minHeightCm) {
      errs.height = `Mínimo sugerido: ${product.minHeightCm} cm`;
    } else if (heightCm > product.maxHeightCm) {
      errs.height = `Máximo técnico: ${product.maxHeightCm} cm`;
    }

    if (quantity < 1) {
      errs.quantity = 'La cantidad mínima es 1';
    }

    return errs;
  }, [widthCm, heightCm, quantity, product]);

  const isValid = Object.keys(errors).length === 0;

  // Real-time calculated materials
  const calculatedMaterials = useMemo<CalculatedMaterialItem[]>(() => {
    if (!product) return [];
    return calculateRecipe(product, widthCm, heightCm, quantity);
  }, [product, widthCm, heightCm, quantity]);

  // Demo subtotal and unit price
  const subtotalDemo = useMemo(() => {
    return calculatedMaterials.reduce((sum, item) => sum + item.subtotalDemo, 0);
  }, [calculatedMaterials]);

  const unitPriceDemo = useMemo(() => {
    return quantity > 0 ? Math.round((subtotalDemo / quantity) * 100) / 100 : 0;
  }, [subtotalDemo, quantity]);

  return {
    widthCm,
    heightCm,
    quantity,
    setWidthCm,
    setHeightCm,
    setQuantity,
    errors,
    isValid,
    calculatedMaterials,
    subtotalDemo,
    unitPriceDemo,
  };
}
