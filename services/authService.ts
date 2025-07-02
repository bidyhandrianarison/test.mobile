import AsyncStorage from "@react-native-async-storage/async-storage";
import { mockUsers } from "@/constants/users";


const USERS_KEY = 'USERS';

// Initialise AsyncStorage avec les mockUsers si vide
const seedUsers = async () => {
  const usersJson = await AsyncStorage.getItem(USERS_KEY);
  if (!usersJson) {
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(mockUsers));
  }
};

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