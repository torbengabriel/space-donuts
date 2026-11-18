import { Injectable } from '@angular/core';
import { CartItem } from '../models/cart-item.model';
import { Product } from '../../products/models/product.model';

@Injectable({ providedIn: 'root' })
export class GuestCartService {
  private readonly STORAGE_KEY = 'guest-cart';

  getCart(): CartItem[] {
    const savedCart = localStorage.getItem(this.STORAGE_KEY);

    return savedCart ? JSON.parse(savedCart) : [];
  }

  addItem(product: Product): CartItem[] {
    const items = this.getCart();

    const existingItem = items.find((item) => item.product.id === product.id);

    let updatedItems: CartItem[];

    if (existingItem) {
      updatedItems = items.map((item) =>
        item.product.id === product.id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item,
      );
    } else {
      updatedItems = [
        ...items,
        {
          product,
          quantity: 1,
        },
      ];
    }

    this.saveCart(updatedItems);
    return updatedItems;
  }

  updateQuantity(itemId: number, quantity: number): CartItem[] {
    const updatedItems = this.getCart().map((item) =>
      item.product.id === itemId
        ? {
            ...item,
            quantity,
          }
        : item,
    );
    this.saveCart(updatedItems);
    return updatedItems;
  }

  removeItem(productId: number): CartItem[] {
    const updatedItems = this.getCart().filter((item) => item.product.id !== productId);

    this.saveCart(updatedItems);
    return updatedItems;
  }

  clearCart(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  private saveCart(items: CartItem[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
  }
}
