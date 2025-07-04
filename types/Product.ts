export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  vendeurs: string;
  image: string;
  isActive: boolean;
  createdBy?: string; // Email de l'utilisateur qui a créé le produit
  createdAt?: string; // Date de création au format ISO
  userId?: string; // ID utilisateur pour compatibilité backward
}

export interface ProductFormData {
  name: string;
  description: string;
  price: string;
  category: string;
  vendeurs: string; // Changé de 'brand' à 'vendeurs' pour cohérence
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
