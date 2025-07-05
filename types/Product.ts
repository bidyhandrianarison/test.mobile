export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  vendeurs: string;
  isActive: boolean;
  image?: string;
  createdAt?: string; // ISO date string
  updatedAt?: string; 
  createdBy?: string;
  userId?: string; // ✅ ADD this property
}

// ... rest of the code remains unchanged

export interface ProductFormData {
  name: string;
  description: string;
  price: string;
  category: string;
  vendeurs: string;
  image: string;
  stock: string;
}

export interface UserStats {
  totalCount: number;
  activeCount: number;
  inactiveCount: number;
  averagePrice: number;
  totalValue: number;
  categories: string[];
  userProducts?: Product[];
}

// Type pour la création d'un nouveau produit
export type CreateProductData = Omit<Product, 'id' | 'createdAt' | 'userId'>;

// Type pour la mise à jour d'un produit
export type UpdateProductData = Partial<Omit<Product, 'id' | 'createdBy' | 'createdAt'>>;
