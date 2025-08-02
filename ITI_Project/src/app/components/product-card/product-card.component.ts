// Angular imports
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';     // Required for built-in Angular directives and pipes (e.g., number pipe)
import { RouterLink } from '@angular/router';       // To use [routerLink] in the template

// Service imports
import { ProductService } from '../../service/product.service';
import { CartService } from '../../service/cart.service';

// Component metadata
@Component({
  selector: 'app-product-card',                      // Component selector (used as <app-product-card>)
  standalone: true,                                  // Indicates this is a standalone component
  imports: [CommonModule, RouterLink],               // Import CommonModule for ngIf, ngFor, pipes, etc. + RouterLink for navigation
  templateUrl: './product-card.component.html',      // Template file
  styleUrls: ['./product-card.component.css']        // Styles for this component
})
export class ProductCardComponent {
  // Accepts a product object from the parent component
  @Input() product: any;

  // Emits an event to the parent when a product is deleted
  @Output() deleted = new EventEmitter<number>();

  constructor(
    public service: ProductService,      // Product service for delete operation
    private cartService: CartService     // Cart service for add-to-cart functionality
  ) {}

  // Triggered when user clicks "Add to Cart"
  onAddToCart(): void {
    console.log('Add to cart clicked for product:', this.product);
    this.cartService.addToCart({
      productId: this.product.id,
      productImage: this.product.image,
      name: this.product.name,
      price: this.product.price,
      quantity: 1
    });
  }

  // Triggered when user clicks "Edit" (currently just an alert)
  onEditProduct(): void {
    alert(`Edit "${this.product.name}" button clicked!`);
    // You could redirect to edit page using Router here
    // this.router.navigate(['/edit', this.product.id]);
  }

  // Triggered when user clicks "Delete"
  onDeleteProduct(id: any): void {
    this.service.deleteProduct(id).subscribe({
      next: () => {
        alert(`Product "${this.product.name}" deleted successfully!`);
        this.deleted.emit(id); // Notify parent to remove the product from the list
      },
      error: err => {
        alert('Error deleting product: ' + err.message);
      }
    });
  }
}
