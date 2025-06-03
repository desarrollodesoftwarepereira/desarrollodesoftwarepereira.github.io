export interface Product {
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
};

export interface Category {
  name: string;
  products: Product[];
};
