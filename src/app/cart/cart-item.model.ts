import { Donut } from '../donuts/models/donut.model';

export interface CartItem {
  donut: Donut;
  quantity: number;
}
