// Import necessary Angular core modules and libraries
import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../service/product.service'; // Service to handle product operations
import { ActivatedRoute, Router } from '@angular/router'; // To get route parameters and navigate between routes
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'; // For reactive forms and validation
import { CommonModule } from '@angular/common'; // Common Angular directives like ngIf, ngFor, etc.

@Component({
  selector: 'app-add-product', // Component selector
  standalone: true, // Indicates this is a standalone component
  imports: [ReactiveFormsModule, CommonModule], // Import necessary modules for this component
  templateUrl: './add-product.component.html', // HTML template
  styleUrl: './add-product.component.css' // CSS styling
})
export class AddProductComponent implements OnInit {
  productId: any; // Holds the product ID from the URL (used for editing)
  product: any; // Holds the product data fetched from backend

  // List of product categories
  categories: string[] = ['All', 'Electronics', 'Fashion', 'Accessories', 'Home'];

  // Injecting services: product service, activated route, and router
  constructor(
    public service: ProductService,
    public activatedRoute: ActivatedRoute,
    public router: Router
  ) {
    // Get the product ID from the URL parameters
    this.productId = this.activatedRoute.snapshot.params['id'];
  }

  // Reactive form group with form controls and validations
  myForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    description: new FormControl('', [Validators.required]),
    price: new FormControl('', [Validators.required, Validators.min(1)]),
    image: new FormControl('', [Validators.required]),
    category: new FormControl('', [Validators.required]),
    stock: new FormControl('', [Validators.required, Validators.min(0)]),
    rating: new FormControl('', [Validators.required, Validators.min(0), Validators.max(5)])
  });

  // Lifecycle hook called when component is initialized
  ngOnInit(): void {
    // If productId is not 0, then it's an edit action
    if (this.productId != 0) {
      this.service.getById(this.productId).subscribe({
        next: (data: any) => {
          // Assign fetched product to the variable
          this.product = data;

          // Populate form with existing product data
          this.getName.setValue(this.product.name);
          this.getDescription.setValue(this.product.description);
          this.getprice.setValue(this.product.price);
          this.getImage.setValue(this.product.image);
          this.getCategory.setValue(this.product.category);
          this.getStock.setValue(this.product.stock);
          this.getRating.setValue(this.product.rating);
        },
        error: (err: any) => {
          console.error('Error fetching product:', err);
        },
        complete: () => {
          console.log('Product data fetched successfully');
        }
      });
    }
  }

  // Getters for form controls (for easy access in template)
  get getName() {
    return this.myForm.controls['name'];
  }

  get getDescription() {
    return this.myForm.controls['description'];
  }

  get getprice() {
    return this.myForm.controls['price'];
  }

  get getImage() {
    return this.myForm.controls['image'];
  }

  get getCategory() {
    return this.myForm.controls['category'];
  }

  get getStock() {
    return this.myForm.controls['stock'];
  }

  get getRating() {
    return this.myForm.controls['rating'];
  }

  // Method called when form is submitted
  onSubmit(form: any) {
    // Check if form is valid
    if (form.valid) {
      // If productId is 0, it's a new product
      if (this.productId == 0) {
        this.service.addProduct(form.value).subscribe({
          next: (data: any) => {
            alert("Product added successfully!");
            this.router.navigate(['/products']); // Navigate to products list
          },
          error: (err: any) => {
            alert('Error adding product: ' + err.message);
          }
        });
      } else {
        // Otherwise, it's an update to an existing product
        this.service.editProduct(form.value, this.productId).subscribe({
          next: (data: any) => {
            alert("Product Updated successfully!");
            this.router.navigate(['/products']); // Navigate back to products list
          },
          error: (err: any) => {
            alert('Error updating product: ' + err.message);
          }
        });
      }
    }
  }
}
