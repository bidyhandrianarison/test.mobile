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
  createdBy?: string; // Nouvel champ pour identifier le créateur
  createdAt?: string; // Date de création
}
  
  export interface ProductFormData {
    name: string;
    description: string;
    price: string;
    category: string;
    brand: string;
    image: string;
    stock: string;
  }