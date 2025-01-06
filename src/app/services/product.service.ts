import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable, of } from 'rxjs';

import { Product } from '../common/product';
import { ProductCreate } from '../common/productCreate';
import { formatCurrency } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private serverUrl = "http://127.0.0.1:8000"
  private apiUrl = this.serverUrl + "/api/v1/products"

  constructor(private http: HttpClient) { }

  getProducts() {
    return this.http.get<Product[]>(`${this.apiUrl}/?offset=0&limit=10`).pipe(
      map(products => products.map(product => ({
        ...product,
        image_url: `${this.serverUrl}/${product.image_url}` 
      })))
    )
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`)
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
  }

  addProduct(product: Product, imageFile?: File): Observable<any> {
    const formData = new FormData();

    // Добавляем изображение
    if(imageFile)
      formData.append('image', imageFile);

    // Генерация параметров запроса из объекта ProductCreate
    const params = new HttpParams()
      .set('name', product.name)
      .set('description', product.description || '')
      .set('price', product.price.toString())
      .set('brand', product.brand)
      .set('color', product.color)
      .set('size', product.size || '')
      .set('count', product.count.toString())
      .set('category_id', product.category_id.toString());

    return this.http.post(this.apiUrl, formData, { params });
  }

  updateProduct(id: number, product: Partial<ProductCreate>, imageFile?: File): Observable<Product> {
    const formData = new FormData();
    (Object.keys(product) as (keyof ProductCreate)[]).forEach((key) => {
      if(product[key] != null) {
        formData.append(key, (product as any)[key])
      }
    });

    if(imageFile) {
      formData.append('image', imageFile)
    }
    return this.http.patch<Product>(`${this.apiUrl}/${id}`, formData)
  }
}
