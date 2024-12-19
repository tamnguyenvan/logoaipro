import { Plan } from "@/types/plan";

interface ProductAttributes {
  name: string;
  description: string;
  price: number;
  image: string;
}

interface Product {
  id: string;
  attributes: ProductAttributes;
}

export const fetchPlans = async (): Promise<Plan[]> => {
  try {
    const response = await fetch('https://api.lemonsqueezy.com/v1/products', {
      headers: {
        'Authorization': `Bearer ${process.env.LEMON_SQUEEZY_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }

    const data = await response.json();
    const products = data.data.map((product: Product) => ({
      id: product.id,
      attributes: {
        name: product.attributes.name,
        description: product.attributes.description,
        price: product.attributes.price,
        image: product.attributes.image
      }
    }));

    const plans = products.map((product: Product) => ({
      id: product.id,
      name: product.attributes.name,
      price: product.attributes.price,
      image: product.attributes.image
    }));
    return plans;
  } catch (error) {
    console.error('Error fetching products:', error);
    return []
  }
}