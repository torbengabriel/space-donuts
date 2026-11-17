import { CartItem } from './cart-item.model';

export interface CartResponse {
  id: number;
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}
