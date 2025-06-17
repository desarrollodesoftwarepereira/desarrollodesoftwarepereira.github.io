export interface Product {
  name: string;
  description: string;
  price: number;
  unit?: string;
  imageUrl?: string;
};

export interface Category {
  name: string;
  products: Product[];
};

export interface StoredCartItem {
  name: string;
  quantity: number;
}

export interface StoredCart {
  items: StoredCartItem[];
  timestamp: number;
}

export interface ShoppingCartItem {
  product: Product;
  quantity: number
}