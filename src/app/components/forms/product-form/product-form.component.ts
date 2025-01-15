import { Component, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product';


@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss'
})
export class ProductFormComponent implements OnChanges{
  @Input() product: Product | null = null;
  @Output() formClosed = new EventEmitter<void>();
  @Output() productSaved = new EventEmitter<void>();

  form: FormGroup;
  selectedFile: File | undefined = undefined;
  imagePreview: string | null = null;


  constructor(private fb: FormBuilder, private productService: ProductService) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      brand: ['', Validators.required],
      color: ['', Validators.required],
      size: [''],
      count: [0, [Validators.required, Validators.min(0)]],
      category_id: [0, Validators.required],
      image: []
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['product'] && this.product) {
      this.form.patchValue(this.product);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  submit() {
    if(!this.form.valid) {
      alert("Неправильно заполнена форма")
      return
    }

    console.log(this.form.value)
    const formData = new FormData();
    Object.entries(this.form.value).forEach(([key, value]) => formData.append(key, String(value)));
    if (this.selectedFile) {
      formData.append('image', this.selectedFile, this.selectedFile.name);
    }

    const request = this.product
      ? this.productService.updateProduct(this.product.id, this.product, this.selectedFile)
      : this.productService.addProduct(this.form.value as Product, this.selectedFile);

    request.subscribe(
      () => {
        this.productSaved.emit();
        this.formClosed.emit();
      },
      (error) => console.error('Failed to save product', error)
    );
  }
}
