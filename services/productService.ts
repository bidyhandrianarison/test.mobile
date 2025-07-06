import AsyncStorage from "@react-native-async-storage/async-storage";
import mockData from '../data/products.json';
import { Product } from '../types/Product';

const PRODUCTS_KEY = 'PRODUCTS';

/**
 * Initialise les produits dans AsyncStorage si vide (seed)
 */
const seedProducts = async () => {
    const productsJson = await AsyncStorage.getItem(PRODUCTS_KEY);
    if (!productsJson) {
        // Normaliser les données mock pour inclure les nouveaux champs
        const normalizedMockData = mockData.map(product => ({
            ...product,
            createdBy: undefined,
            createdAt: undefined,
            userId: undefined,
        }));
        await AsyncStorage.setItem(PRODUCTS_KEY, JSON.stringify(normalizedMockData));
    }
};

/**
 * Sélectionne un produit par son id
 */
export const selectProduct = async (id: string): Promise<Product> => {
    await seedProducts();
    const productsJson = await AsyncStorage.getItem(PRODUCTS_KEY);
    const products: Product[] = productsJson ? JSON.parse(productsJson) : [];
    const prod = products.find((p: Product) => p.id === id);
    if (!prod) {
        throw new Error('Produit introuvable');
    }
    return prod;
};

/**
 * Ajoute un produit à AsyncStorage
 */
export const addProduct = async (p: Omit<Product, 'id'>): Promise<Product> => {
    await seedProducts();
    const productsJson = await AsyncStorage.getItem(PRODUCTS_KEY);
    const products: Product[] = productsJson ? JSON.parse(productsJson) : [];
    const newProduct: Product = { 
        ...p, 
        id: String(Date.now()),
        createdAt: p.createdAt || new Date().toISOString(),
    };
    products.push(newProduct);
    await AsyncStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    return newProduct;
};

/**
 * Met à jour un produit existant
 */
export const updateProduct = async (id: string, updates: Partial<Product>): Promise<Product> => {
    await seedProducts();
    const productsJson = await AsyncStorage.getItem(PRODUCTS_KEY);
    let products: Product[] = productsJson ? JSON.parse(productsJson) : [];
    const index = products.findIndex((p: Product) => p.id === id);
    if (index === -1) throw new Error('Produit introuvable');
    
    products[index] = { ...products[index], ...updates };
    await AsyncStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    return products[index];
};

/**
 * Supprime un produit par son id
 */
export const deleteProduct = async (id: string): Promise<void> => {
    await seedProducts();
    const productsJson = await AsyncStorage.getItem(PRODUCTS_KEY);
    let products: Product[] = productsJson ? JSON.parse(productsJson) : [];
    products = products.filter((p: Product) => p.id !== id);
    await AsyncStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
};

/**
 * Retourne tous les produits
 */
export const getAllProducts = async (): Promise<Product[]> => {
    await seedProducts();
    const productsJson = await AsyncStorage.getItem(PRODUCTS_KEY);
    return productsJson ? JSON.parse(productsJson) : [];
};

/**
 * Recherche des produits selon une query
 */
export const searchProducts = async (query: string): Promise<Product[]> => {
    await seedProducts();
    const productsJson = await AsyncStorage.getItem(PRODUCTS_KEY);
    const products: Product[] = productsJson ? JSON.parse(productsJson) : [];
    const lowerQuery = query.toLowerCase();
    return products.filter(p =>
        p.name.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery) ||
        p.category.toLowerCase().includes(lowerQuery) ||
        p.vendeurs.toLowerCase().includes(lowerQuery)
    );
};
