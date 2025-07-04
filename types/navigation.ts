import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';

// Types pour la navigation principale
export type RootStackParamList = {
  MainTabs: undefined;
  AddProduct: undefined;
  EditProfile: undefined;
  ProductDetail: { productId: string };
  ProductEdit: { productId: string };
};

// Types pour les onglets
export type TabParamList = {
  Home: undefined;
  Profile: undefined;
};

// Types pour l'authentification
export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
};

// Props types pour les écrans
export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;

export type TabScreenProps<T extends keyof TabParamList> = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, T>,
  RootStackScreenProps<keyof RootStackParamList>
>;

export type AuthScreenProps<T extends keyof AuthStackParamList> = NativeStackScreenProps<
  AuthStackParamList,
  T
>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
