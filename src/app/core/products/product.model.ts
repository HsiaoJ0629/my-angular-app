/** Product as returned by the DummyJSON API. */
export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand: string;
  sku: string;
  thumbnail: string;
  images: string[];
}

/** One page of products plus the total available, used to drive the paginator. */
export interface ProductPage {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

/** The subset of fields the edit dialog can change. */
export interface ProductDraft {
  id: number;
  title: string;
  price: number;
  stock: number;
}

/** Fields the table can sort on, mapped straight onto the API's `sortBy` parameter. */
export type ProductSortField = 'title' | 'price' | 'stock';

export interface ProductQuery {
  readonly search: string;
  readonly limit: number;
  readonly skip: number;
  readonly sortBy?: ProductSortField;
  readonly sortOrder?: 'asc' | 'desc';
}

/** A draft for a product that does not exist server-side yet. */
export function emptyProductDraft(): ProductDraft {
  return { id: 0, title: '', price: 1, stock: 1 };
}

export function toDraft(product: Product): ProductDraft {
  const { id, title, price, stock } = product;
  return { id, title, price, stock };
}
