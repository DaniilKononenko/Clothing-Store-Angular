import { Component } from '@angular/core';
import { CartService } from './cart.service';
import { CurrencyPipe, NgFor, NgIf } from '@angular/common';

import { CartItem } from './cartItem';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [NgFor, NgIf, CurrencyPipe],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {
  cartItems: CartItem[] = []
  totalPrice: number = 0

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.loadCart()
  }

  getProducts(): CartItem[] {
    return this.cartService.getItems()
  }

  increaseQuantity(item: CartItem): void {
    this.cartService.updateQuantity(item.id, item.quantity + 1)
    this.loadCart()
  }

  decreaseQuantity(item: CartItem): void {
    this.cartService.updateQuantity(item.id, item.quantity - 1)
    this.loadCart()
  }

  removeFromCart(id: number): void {
    this.cartService.removeFromCart(id)
    this.loadCart()
  }

  updateTotalPrice(): void {
    this.totalPrice = this.cartService.getTotalPrice()
  }

  loadCart(): void {
    this.cartItems = this.cartService.getItems()
    this.updateTotalPrice()
  }
}
