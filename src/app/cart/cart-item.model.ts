import { Donut } from '../donuts/donut.model';

export interface CartItem {
  donut: Donut;
  quantity: number;
}
