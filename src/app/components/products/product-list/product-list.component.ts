import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Product } from '../../../models/product';
import { ProductService } from '../../../services/product.service';
import { AddEditProductDialogComponent } from '../add-edit-product-dialog/add-edit-product-dialog.component';
import { MaterialModule } from '../../../material.module';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { MatPaginator } from '@angular/material/paginator';
import { PageEvent } from '@angular/material/paginator';
import { ConfirmDialogService } from '../../../services/confirm-dialog.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  standalone: true,
  imports: [CommonModule, MaterialModule],
})
export class ProductListComponent implements OnInit {
  allProducts: Product[] = [];
  displayedProducts: Product[] = [];
  displayedColumns: string[] = [
    'id',
    'name',
    'description',
    'price',
    'actions',
  ];

  loading: boolean = true;
  error: string | null = null;

  pageSize: number = 5;
  pageIndex: number = 0;
  totalProducts: number = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private productService: ProductService,
    private dialog: MatDialog,
    private authService: AuthService,
    private confirmDialogService: ConfirmDialogService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    if (this.authService.isAdmin()) {
      this.productService.getAllProductsAdmin().subscribe({
        next: (data) => {
          this.allProducts = data;
          this.totalProducts = this.allProducts.length;
          this.updateTable();
          this.loading = false; // Nascondi il caricamento
        },
        error: (err) =>
          console.error('Errore nel caricamento dei prodotti admin:', err),
      });
    } else if (this.authService.isUser()) {
      this.productService.getUserProducts().subscribe({
        next: (data) => {
          this.allProducts = data;
          this.totalProducts = this.allProducts.length;
          this.updateTable();
          this.loading = false; // Nascondi il caricamento
        },
        error: (err) => {
          console.error('Errore nel caricamento dei prodotti utente:', err);
          this.error = 'Failed to load users'; // Imposta il messaggio di errore
          this.loading = false; // Nascondi il caricamento
        },
      });
    } else {
      console.log('Utente non autenticato o ruolo non valido');
    }
  }

  updateTable(): void {
    const startIndex = this.pageIndex * this.pageSize;
    this.displayedProducts = this.allProducts.slice(
      startIndex,
      startIndex + this.pageSize
    );
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updateTable();
  }

  openProductDialog(): void {
    const dialogRef = this.dialog.open(AddEditProductDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) this.loadProducts();
    });
  }

  editProduct(product: Product): void {
    const dialogRef = this.dialog.open(AddEditProductDialogComponent, {
      data: product,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) this.loadProducts();
    });
  }

  deleteProduct(productId: number): void {
    this.confirmDialogService
      .confirm(
        'Conferma Eliminazione',
        'Sei sicuro di voler eliminare questo prodotto?'
      )
      .subscribe((confirmed) => {
        if (confirmed) {
          this.productService.deleteProduct(productId).subscribe({
            next: () => this.loadProducts(),
            error: (err) => console.error(err),
          });
        }
      });
  }
}
