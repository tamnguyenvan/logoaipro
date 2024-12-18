export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  isPopular: boolean;
}