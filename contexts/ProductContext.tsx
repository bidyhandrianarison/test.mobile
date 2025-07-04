import React, { createContext, useReducer, useContext, useEffect, ReactNode } from 'react';
import mockProducts from '../constants/products.json';
import { useAuth } from './AuthContext';
import { Product, CreateProductData, UpdateProductData, UserStats } from '../types/Product';

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
  addProduct: (productData: CreateProductData) => Promise<void>;
  updateProduct: (productId: string, productData: UpdateProductData) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  getUserProducts: () => Product[];
  searchProducts: (query: string) => Promise<Product[]>;
  getUserStats: (userEmail: string, userName?: string) => UserStats;
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

// Base de données simulée
let productsDB: Product[] = [...mockProducts];

/**
 * Fournit le contexte produit à l'application
 */
export const ProductsProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(productsReducer, {
    products: [],
    isLoading: true,
    error: null,
  });

  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchProducts();
    }
  }, [user]);

  /**
   * Charge les produits depuis la "base de données"
   */
  const fetchProducts = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      // Normaliser les produits pour s'assurer que tous ont les bonnes propriétés
      const normalizedProducts = productsDB.map(product => ({
        ...product,
        createdBy: product.createdBy || undefined,
        createdAt: product.createdAt || undefined,
        userId: product.userId || undefined,
      }));
      
      dispatch({ type: 'SET_PRODUCTS', payload: normalizedProducts });
    } catch (e) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch products.' });
    }
  };

  const addProduct = async (productData: CreateProductData) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const newProduct: Product = {
      ...productData,
      id: String(Date.now()),
      createdBy: user?.email || undefined,
      createdAt: new Date().toISOString(),
      userId: user?.id || undefined,
    };
    
    // ✅ CORRECTION : Mise à jour immédiate de la base de données ET du state
    productsDB.push(newProduct);
    dispatch({ type: 'ADD_PRODUCT', payload: newProduct });
    
    // ✅ DEBUG : Log pour vérifier l'ajout
    console.log('✅ Product added:', newProduct.name, 'Total products:', productsDB.length);
  };

  const updateProduct = async (productId: string, productData: UpdateProductData) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const existingIndex = productsDB.findIndex((p) => p.id === productId);
    
    if (existingIndex === -1) throw new Error('Produit introuvable');
    
    const updatedProduct: Product = {
      ...productsDB[existingIndex],
      ...productData,
      id: productId,
    };
    
    // ✅ CORRECTION : Mise à jour immédiate de la base de données ET du state
    productsDB[existingIndex] = updatedProduct;
    dispatch({ type: 'UPDATE_PRODUCT', payload: updatedProduct });
    
    // ✅ DEBUG : Log pour vérifier la mise à jour
    console.log('✅ Product updated:', updatedProduct.name);
  };

  const deleteProduct = async (productId: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    // ✅ CORRECTION : Mise à jour immédiate de la base de données ET du state
    productsDB = productsDB.filter((p) => p.id !== productId);
    dispatch({ type: 'DELETE_PRODUCT', payload: productId });
    
    // ✅ DEBUG : Log pour vérifier la suppression
    console.log('✅ Product deleted, remaining products:', productsDB.length);
  };

  /**
   * Obtient les produits créés par l'utilisateur connecté
   */
  const getUserProducts = (): Product[] => {
    if (!user) return [];
    return state.products.filter(p => 
      p.createdBy === user.email || p.userId === user.id
    );
  };

  const searchProducts = async (query: string): Promise<Product[]> => {
    const lowerQuery = query.toLowerCase();
    return state.products.filter(p =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery) ||
      p.category.toLowerCase().includes(lowerQuery) ||
      p.vendeurs.toLowerCase().includes(lowerQuery)
    );
  };

  /**
   * ✅ AMÉLIORATION : Statistiques détaillées des produits d'un utilisateur
   */
  const getUserStats = (userEmail: string, userName?: string): UserStats => {
    const userProducts = state.products.filter(p => {
      // Vérifier par email de création (le plus fiable)
      if (p.createdBy === userEmail) return true;
      
      // Vérifier par ID utilisateur (compatibilité backward)
      if (p.userId === user?.id) return true;
      
      // Vérifier par nom de vendeur (fallback)
      if (p.vendeurs && userName) {
        const vendeurNormalized = p.vendeurs.toLowerCase().trim();
        const userNameNormalized = userName.toLowerCase().trim();
        const userEmailNormalized = userEmail.toLowerCase().trim();
        
        return vendeurNormalized === userNameNormalized || 
               vendeurNormalized === userEmailNormalized;
      }
      
      return false;
    });

    const totalCount = userProducts.length;
    const activeCount = userProducts.filter(p => p.isActive).length;
    const inactiveCount = totalCount - activeCount;
    const totalPrice = userProducts.reduce((sum, p) => sum + p.price, 0);
    const averagePrice = totalCount > 0 ? totalPrice / totalCount : 0;
    const totalValue = userProducts.reduce((sum, p) => sum + (p.price * p.stock), 0);
    const categories = Array.from(new Set(userProducts.map(p => p.category)));

    return {
      userProducts,
      totalCount,
      activeCount,
      inactiveCount,
      averagePrice,
      totalValue,
      categories,
    };
  };

  const productsContext: ProductsContextType = {
    ...state,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    getUserProducts,
    searchProducts,
    getUserStats, // ✅ Méthode exposée
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

// Export du type Product pour usage externe
export type { Product };