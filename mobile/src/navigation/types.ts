export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type RootStackParamList = {
  HomeScreen: undefined;
  ProductScreen: { productId: number };
};
