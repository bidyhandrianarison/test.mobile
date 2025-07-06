import React, { createContext, useReducer, useContext, useEffect, ReactNode } from 'react';
import mockProducts from '../constants/products.json';
import { useAuth } from './AuthContext';
import { Product, CreateProductData, UpdateProductData, UserStats } from '../types/Product';

/**
 * State interface for the products context
 */
type ProductsState = {
  products: Product[];
  isLoading: boolean;
  error: string | null;
};

/**
 * Action types for the products reducer
 */
type ProductsAction =
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'UPDATE_PRODUCT'; payload: Product }
  | { type: 'DELETE_PRODUCT'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string };

/**
 * Context interface providing product management functionality
 */
type ProductsContextType = ProductsState & {
  fetchProducts: () => Promise<void>;
  addProduct: (productData: CreateProductData, userEmail?: string, userId?: string) => Promise<void>;
  updateProduct: (productId: string, productData: UpdateProductData) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  getUserProducts: (userEmail?: string, userId?: string) => Product[];
  searchProducts: (query: string) => Promise<Product[]>;
  getUserStats: (userEmail: string, userName?: string, userId?: string) => UserStats;
};

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

/**
 * Reducer for managing products state
 * @param state - Current products state
 * @param action - Action to perform
 * @returns Updated products state
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

// Simulated database
let productsDB: Product[] = [...mockProducts];

/**
 * ProductsProvider component provides product management context
 * 
 * Features:
 * - Product CRUD operations
 * - User-specific product filtering
 * - Search functionality
 * - User statistics calculation
 * - Loading and error state management
 */
export const ProductsProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(productsReducer, {
    products: [],
    isLoading: true,
    error: null,
  });

  /**
   * Fetch all products from the simulated database
   */
  const fetchProducts = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      // Normalize products to ensure all have correct properties
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

  /**
   * Add a new product to the database
   * @param productData - Product data to create
   * @param userEmail - User's email address
   * @param userId - User's ID
   */
  const addProduct = async (productData: CreateProductData, userEmail?: string, userId?: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const newProduct: Product = {
      ...productData,
      id: String(Date.now()),
      createdBy: userEmail || undefined,
      createdAt: new Date().toISOString(),
      userId: userId || undefined,
    };
    
    productsDB.push(newProduct);
    dispatch({ type: 'ADD_PRODUCT', payload: newProduct });
    
    console.log('Product added:', newProduct.name, 'Total products:', productsDB.length);
  };

  /**
   * Update an existing product
   * @param productId - ID of the product to update
   * @param productData - Updated product data
   */
  const updateProduct = async (productId: string, productData: UpdateProductData) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const existingIndex = productsDB.findIndex((p) => p.id === productId);
    
    if (existingIndex === -1) throw new Error('Product not found');
    
      const updatedProduct: Product = {
      ...productsDB[existingIndex],
        ...productData,
      id: productId,
    };
    
    productsDB[existingIndex] = updatedProduct;
    dispatch({ type: 'UPDATE_PRODUCT', payload: updatedProduct });
    
    console.log('Product updated:', updatedProduct.name);
  };

  /**
   * Delete a product from the database
   * @param productId - ID of the product to delete
   */
  const deleteProduct = async (productId: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    productsDB = productsDB.filter((p) => p.id !== productId);
    dispatch({ type: 'DELETE_PRODUCT', payload: productId });
    
    console.log('Product deleted, remaining products:', productsDB.length);
  };

  /**
   * Get products created by the current user
   * @param userEmail - User's email address
   * @param userId - User's ID
   * @returns Array of user's products
   */
  const getUserProducts = (userEmail?: string, userId?: string): Product[] => {
    if (!userEmail && !userId) return [];
    return state.products.filter(p => 
      p.createdBy === userEmail || p.userId === userId
    );
  };

  /**
   * Search products by query string
   * @param query - Search query
   * @returns Array of matching products
   */
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
   * Get detailed statistics for a user's products
   * @param userEmail - User's email address
   * @param userName - Optional user's name for fallback matching
   * @param userId - Optional user's ID
   * @returns User statistics object
   */
  const getUserStats = (userEmail: string, userName?: string, userId?: string): UserStats => {
    const userProducts = state.products.filter(p => {
      // Check by creation email (most reliable)
      if (p.createdBy === userEmail) return true;
      
      // Check by user ID (backward compatibility)
      if (p.userId === userId) return true;
      
      // Check by seller name (fallback)
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
    getUserStats,
  };

  return (
    <ProductsContext.Provider value={productsContext}>
      {children}
    </ProductsContext.Provider>
  );
};

/**
 * Hook to access the products context
 * @returns Products context with all methods and state
 * @throws Error if used outside of ProductsProvider
 */
export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) throw new Error('useProducts must be used within a ProductsProvider');
  return context;
};

export type { Product };