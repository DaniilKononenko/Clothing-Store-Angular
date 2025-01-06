import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

import { CartItem } from './cartItem';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartKey = "cart_items"

  constructor(private cookieService: CookieService) { }

  getItems(): CartItem[] {
    const cookie = this.cookieService.get(this.cartKey)
    return cookie ? JSON.parse(cookie) : []
  }

  private saveItems(items: CartItem[]): void {
    this.cookieService.set(this.cartKey, JSON.stringify(items));
  }

  addToCart(item: CartItem): void {
    const items = this.getItems();
    const index = items.findIndex((i) => i.id === item.id);
  
    if (index !== -1) {
      items[index].quantity += item.quantity;
    } else {
      items.push(item);
    }
  
    this.saveItems(items);
  }

  removeFromCart(id: number): void {
    let items = this.getItems();
    items = items.filter((item) => item.id !== id);
    this.saveItems(items);
  }

  clearCart(): void {
    this.cookieService.delete(this.cartKey);
  }
  
  getTotalPrice(): number {
    return this.getItems().reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }

  updateQuantity(id: number, quantity: number): void {
    const items = this.getItems();
    const index = items.findIndex((i) => i.id === id);
    items[index].quantity = quantity;
    this.saveItems(items);
  }
}
