import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Product } from '../../../models/product';
import { ProductService } from '../../../services/product.service';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../material.module';

@Component({
  selector: 'app-add-edit-product-dialog',
  templateUrl: './add-edit-product-dialog.component.html',
  standalone: true,
  imports:[CommonModule,ReactiveFormsModule, MaterialModule]
})
export class AddEditProductDialogComponent implements OnInit {
  productForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddEditProductDialogComponent>,
    private productService: ProductService,
    @Inject(MAT_DIALOG_DATA) public data: Product | null
  ) {
    this.productForm = this.fb.group({
      name: [''],
      description: [''],
      price: [''],
    });
  }

  ngOnInit(): void {
    if (this.data) {
      this.productForm.patchValue(this.data);
    }
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const product: Product = this.productForm.value;
      if (this.data) {
        product.id = this.data.id;
        this.productService.updateProduct(product).subscribe(() => this.dialogRef.close(true));
      } else {
        this.productService.addProduct(product).subscribe(() => this.dialogRef.close(true));
      }
    }
  }
}
