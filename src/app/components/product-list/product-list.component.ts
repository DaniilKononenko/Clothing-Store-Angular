import { Component } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../common/product';
import { CartItem } from '../../pages/cart/cartItem';
import { NgFor, CurrencyPipe } from '@angular/common';
import { CartService } from '../../pages/cart/cart.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [NgFor, CurrencyPipe],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent {

  products: Product[] = [];

  constructor(private productService: ProductService, private cartService: CartService) {}

  ngOnInit() {
    this.getProducts();
  }

  getProducts(): void {
    this.productService.getProducts().subscribe(data => this.products = data);
  }

  addToCart(product: Product): void {
    console.log(`Добавлен товар ${product.id} в корзину`)
    this.cartService.addToCart(new CartItem(product.id, product.name, product.image_url, product.price))
  }
}
