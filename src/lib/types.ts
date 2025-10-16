import type { Timestamp } from "firebase/firestore";

export interface Product {
  id: string;
  name: string;
  quantityBought: number;
  purchasePrice: number;
  salePrice: number;
  quantitySold: number;
  lastSaleDate?: Timestamp;
  userId: string;
}
