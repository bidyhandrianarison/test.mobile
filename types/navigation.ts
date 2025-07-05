import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NavigatorScreenParams } from '@react-navigation/native';

// Stack d'authentification
export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
};

// Stack des onglets principaux
export type TabStackParamList = {
  Home: undefined;
  Profile: undefined;
};

// Stack principal de l'application
export type RootStackParamList = {
  // Navigation principale
  MainTabs: NavigatorScreenParams<TabStackParamList>;

  // Écrans modaux/pages
  AddProduct: undefined;
  EditProfile: undefined;
  ProductDetail: { productId: string };
  ProductEdit: { productId: string }; // ✅ Route déjà définie
};

// Types d'union pour la navigation
export type AllStackParamList = RootStackParamList & AuthStackParamList;

// Props pour les écrans avec navigation typée
export type RootScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;

export type AuthScreenProps<T extends keyof AuthStackParamList> = NativeStackScreenProps<
  AuthStackParamList,
  T
>;

export type TabScreenProps<T extends keyof TabStackParamList> = CompositeScreenProps<
  BottomTabScreenProps<TabStackParamList, T>,
  NativeStackScreenProps<RootStackParamList>
>;

// Types de navigation unifiés
declare global {
  namespace ReactNavigation {
    interface RootParamList extends AllStackParamList {}
  }
}
