import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private adminEndpoint = 'admin/products';
  private userEndpoint = 'products';

  constructor(private apiService: ApiService) {}

  getAllProductsAdmin(): Observable<Product[]> {
    return this.apiService.get<Product[]>(this.adminEndpoint);
  }

  getUserProducts(): Observable<Product[]> {
    return this.apiService.get<Product[]>(this.userEndpoint);
  }

  addProduct(product: Product): Observable<any> {
    return this.apiService.post(this.userEndpoint, product);
  }

  updateProduct(product: Product): Observable<any> {
    return this.apiService.put(`${this.userEndpoint}/${product.id}`, product);
  }

  deleteProduct(productId: number): Observable<any> {
    return this.apiService.delete(`${this.userEndpoint}/${productId}`);
  }
}
