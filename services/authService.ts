import AsyncStorage from "@react-native-async-storage/async-storage";
import { mockUsers } from "@/constants/users";

const USERS_KEY = 'USERS';

/**
 * Initialise les utilisateurs dans AsyncStorage si vide (seed)
 */
const seedUsers = async () => {
  const usersJson = await AsyncStorage.getItem(USERS_KEY);
  if (!usersJson) {
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(mockUsers));
  }
};

/**
 * Enregistre un nouvel utilisateur dans AsyncStorage
 * @throws si l'email existe déjà
 */
export const registerUser = async (email: string, username: string, password: string) => {
  await seedUsers();
  const usersJson = await AsyncStorage.getItem(USERS_KEY);
  const users = usersJson ? JSON.parse(usersJson) : [];
  if (users.find((u: any) => u.email === email)) {
    throw new Error('Cet email existe déjà');
  }
  users.push({ email, username, password });
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
};

/**
 * Authentifie un utilisateur par email et mot de passe
 * @returns l'utilisateur trouvé
 * @throws si l'utilisateur n'existe pas ou mot de passe incorrect
 */
export const loginUser = async (email: string, password: string) => {
  await seedUsers();
  const usersJson = await AsyncStorage.getItem(USERS_KEY);
  const users = usersJson ? JSON.parse(usersJson) : [];
  const user = users.find((u: any) => u.email === email && u.password === password);
  if (!user) {
    throw new Error('Email ou mot de passe incorrect');
  }
  return user;
};

/**
 * Met à jour un utilisateur existant dans AsyncStorage
 * @param email Email de l'utilisateur à mettre à jour
 * @param updatedData Données à mettre à jour
 * @returns L'utilisateur mis à jour
 * @throws si l'utilisateur n'existe pas
 */
export const updateUser = async (
  email: string,
  updatedData: Partial<{ username: string; password: string; name?: string }>
) => {
  await seedUsers();
  const usersJson = await AsyncStorage.getItem(USERS_KEY);
  const users = usersJson ? JSON.parse(usersJson) : [];
  const userIndex = users.findIndex((u: any) => u.email === email);
  if (userIndex === -1) {
    throw new Error('Utilisateur introuvable');
  }
  users[userIndex] = { ...users[userIndex], ...updatedData };
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
  return users[userIndex];
};