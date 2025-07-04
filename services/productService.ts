import AsyncStorage from "@react-native-async-storage/async-storage";
import mockData from '@/constants/products.json'
const PRODUCTS_KEY = 'PRODUCTS'

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
};

/**
 * Initialise les produits dans AsyncStorage si vide (seed)
 */
const seedProducts = async () => {
    const productsJson = await AsyncStorage.getItem(PRODUCTS_KEY);
    if (!productsJson) {
        await AsyncStorage.setItem(PRODUCTS_KEY, JSON.stringify(mockData))
    }
}

/**
 * Sélectionne un produit par son id
 * @throws si le produit n'existe pas
 */
export const selectProduct = async (id: string) => {
    await seedProducts();
    const productsJson = await AsyncStorage.getItem(PRODUCTS_KEY);
    const products = productsJson ? JSON.parse(productsJson) : [];
    const prod = products.find((p: Product) => p.id === id);
    if (!prod) {
        throw new Error('Produits introuvables');
    }
    return prod;
}

/**
 * Ajoute un produit à AsyncStorage
 * @returns le produit ajouté
 */
export const addProduct = async (p: Product) => {
    await seedProducts();
    const productsJson = await AsyncStorage.getItem(PRODUCTS_KEY);
    const products = productsJson ? JSON.parse(productsJson) : [];
    const newProduct = { ...p, id: String(Date.now()) };
    products.push(newProduct);
    await AsyncStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    return newProduct;
};

/**
 * Met à jour un produit existant
 * @throws si le produit n'existe pas
 */
export const updateProduct = async (id: string, updates: Partial<Product>) => {
    await seedProducts();
    const productsJson = await AsyncStorage.getItem(PRODUCTS_KEY);
    let products = productsJson ? JSON.parse(productsJson) : [];
    const index = products.findIndex((p: Product) => p.id === id);
    if (index === -1) throw new Error('Produit introuvable');
    products[index] = { ...products[index], ...updates };
    await AsyncStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    return products[index];
};

/**
 * Supprime un produit par son id
 */
export const deleteProduct = async (id: string) => {
    await seedProducts();
    const productsJson = await AsyncStorage.getItem(PRODUCTS_KEY);
    let products = productsJson ? JSON.parse(productsJson) : [];
    products = products.filter((p: Product) => p.id !== id);
    await AsyncStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
};

/**
 * Retourne tous les produits
 */
export const getAllProducts = async () => {
    await seedProducts();
    const productsJson = await AsyncStorage.getItem(PRODUCTS_KEY);
    return productsJson ? JSON.parse(productsJson) : [];
};

/**
 * Recherche des produits selon une query (nom, description, catégorie, vendeurs)
 */
export const searchProducts = async (query: string) => {
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
