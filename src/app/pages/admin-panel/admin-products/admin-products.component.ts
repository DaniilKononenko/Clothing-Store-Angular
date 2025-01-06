import { Component } from '@angular/core';
import { FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { ProductCreate } from '../../../common/productCreate';
import { Product } from '../../../common/product';
import { ProductService } from '../../../services/product.service';
import { ProductFormComponent } from '../../../components/forms/product-form/product-form.component';

@Component({
  standalone: true,
  selector: 'app-admin-panel',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.scss'],
  imports: [FormsModule, NgIf, NgFor, ProductFormComponent],
})
export class AdminProductsComponent {
  products: Product[] = [];
  showForm = false;
  selectedProduct: any = null;

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.fetchProducts();
  }

  fetchProducts() {
    this.productService.getProducts()
      .subscribe(
        data => this.products = data
      )
  }

  addProduct() {
    this.selectedProduct = null;
    this.showForm = true;
  }

  editProduct(product: any) {
    this.selectedProduct = product;
    this.showForm = true;
  }

  deleteProduct(id: number) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe(
        () => this.fetchProducts(),
      );
    }
  }

  closeForm() {
    this.showForm = false;
  }
}
