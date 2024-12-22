export interface ProductAttributes {
  name: string;
  description: string;
  price: number;
  image: string;
}

export interface Product {
  id: string;
  attributes: ProductAttributes;
}