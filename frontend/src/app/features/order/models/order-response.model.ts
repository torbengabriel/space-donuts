import { OrderStatus } from './order-status.model';

export interface OrderResponse {
  id: number;
  orderNumber: string;
  status: OrderStatus;
  totalPrice: number;
  createdAt: string;
}
