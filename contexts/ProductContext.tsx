import React, { createContext, useReducer, useContext, useEffect, ReactNode } from 'react';
import mockProducts from '../constants/products.json';
import { useAuth } from './AuthContext';
import { searchProducts } from '@/services/productService';

// Définir le type Product selon le JSON
export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  vendeurs: string;
  image: string;
  isActive: boolean;
  userId?: string;
};

type ProductsState = {
  products: Product[];
  isLoading: boolean;
  error: string | null;
};

type ProductsAction =
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'UPDATE_PRODUCT'; payload: Product }
  | { type: 'DELETE_PRODUCT'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string };

type ProductsContextType = ProductsState & {
  fetchProducts: () => Promise<void>;
  addProduct: (productData: Omit<Product, 'id' | 'userId'>) => Promise<void>;
  updateProduct: (productId: string, productData: Partial<Product>) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  searchProducts: (query: string) => Promise<Product[]>;
};

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

/**
 * Reducer pour la gestion de l'état des produits
 */
const productsReducer = (state: ProductsState, action: ProductsAction): ProductsState => {
  switch (action.type) {
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload, isLoading: false };
    case 'ADD_PRODUCT':
      return { ...state, products: [...state.products, action.payload] };
    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map((p) =>
          p.id === action.payload.id ? action.payload : p
        ),
      };
    case 'DELETE_PRODUCT':
      return {
        ...state,
        products: state.products.filter((p) => p.id !== action.payload),
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    default:
      return state;
  }
};

let productsDB: Product[] = [...mockProducts]; // Copie pour simuler une BDD modifiable

/**
 * Fournit le contexte produit à l'application
 * @param children - Sous-arbre React
 */
export const ProductsProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(productsReducer, {
    products: [],
    isLoading: true,
    error: null,
  });

  const { user } = useAuth();

  // Recharge les produits à chaque changement d'utilisateur (ex: login/logout)
  useEffect(() => {
    if (user) {
      fetchProducts();
    }
  }, [user]);

  /**
   * Charge les produits depuis la "base de données" (mock ou storage)
   */
  const fetchProducts = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      // Simule un appel API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      dispatch({ type: 'SET_PRODUCTS', payload: productsDB });
    } catch (e) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch products.' });
    }
  };

  const productsContext: ProductsContextType = {
    ...state,
    fetchProducts,
    addProduct: async (productData) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const newProduct: Product = {
        ...productData,
        id: String(Date.now()),
        userId: user?.id ?? '', // user peut être null
      };
      productsDB.push(newProduct);
      dispatch({ type: 'ADD_PRODUCT', payload: newProduct });
    },
    updateProduct: async (productId, productData) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const existing = productsDB.find((p) => p.id === productId);
      if (!existing) return;
      const updatedProduct: Product = { ...existing, ...productData, id: productId };
      const productIndex = productsDB.findIndex((p) => p.id === productId);
      if (productIndex !== -1) {
        productsDB[productIndex] = updatedProduct;
      }
      dispatch({ type: 'UPDATE_PRODUCT', payload: updatedProduct });
    },
    deleteProduct: async (productId) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      productsDB = productsDB.filter((p) => p.id !== productId);
      dispatch({ type: 'DELETE_PRODUCT', payload: productId });
    },
    /**
     * Recherche des produits selon une query (nom, description, catégorie, vendeur)
     */
    searchProducts: async (query: string) => {
      return await searchProducts(query);
    },
  };

  return (
    <ProductsContext.Provider value={productsContext}>
      {children}
    </ProductsContext.Provider>
  );
};

/**
 * Hook pour accéder au contexte produit
 */
export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) throw new Error('useProducts must be used within a ProductsProvider');
  return context;
};