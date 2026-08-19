import { Product } from '../../core/domain/entities/Product';
import { productImageUris } from '../../data/mock/productImages';

export function getProductImageUri(product: Product): string | undefined {
  if (product.customImageUri) {
    return product.customImageUri;
  }

  return productImageUris[product.id];
}
