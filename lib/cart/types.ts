export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  priceCents: number;
  quantity: number;
  imageUrl: string | null;
  stock: number;
};

export type CartState = {
  items: CartItem[];
};
