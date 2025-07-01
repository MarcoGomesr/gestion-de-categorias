export type Product = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
};

export type Alignment = "left" | "center" | "right";

export type Row = {
  id: string;
  alignment: Alignment;
  products: Product[];
};
