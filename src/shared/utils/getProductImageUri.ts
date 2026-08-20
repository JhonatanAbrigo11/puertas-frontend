import { Product } from '../../core/domain/entities/Product';
import {
  productImageUris,
  productGalleryUris,
} from '../../data/mock/productImages';

export function getProductImageUri(product: Product): string | undefined {
  if (product.customImageUri) {
    return product.customImageUri;
  }

  return productImageUris[product.id];
}

export function getProductGalleryUris(product: Product): string[] {
  if (product.customImageUri) {
    return [product.customImageUri];
  }

  const gallery = productGalleryUris[product.id];
  if (gallery && gallery.length > 0) {
    return gallery;
  }

  const primary = productImageUris[product.id];
  return primary ? [primary] : [];
}

