import type { Timestamp } from "firebase/firestore";

export interface Product {
  id: string;
  name: string;
  quantityPurchased: number;
  purchasePrice: number;
  salePrice: number;
  quantitySold: number;
  lastSaleDate?: Timestamp;
  userId: string;
}
