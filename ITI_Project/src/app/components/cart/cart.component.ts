import { Component, OnInit } from '@angular/core'; // Angular core component and lifecycle hook
import { CartService, CartItem } from '../../service/cart.service'; // Importing the cart service and CartItem interface
import { CommonModule } from '@angular/common'; // Angular common module for directives like ngIf, ngFor
import { FormsModule } from '@angular/forms'; // Module to support two-way binding and forms

@Component({
  selector: 'app-cart', // Selector to use this component in HTML
  standalone: true, // Marks this as a standalone component
  imports: [CommonModule, FormsModule], // Modules required by the template
  templateUrl: '../cart/cart.component.html', // HTML template path
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = []; // Array to hold all items in the cart

  constructor(private cartService: CartService) {} // Injecting the CartService

  ngOnInit() {
    // On component initialization, fetch all cart items
    this.cartService.getAll().subscribe(items => {
      this.cartItems = items;
    });
  }

  updateQuantity(item: CartItem) {
    // Ensure quantity is not less than 1
    if (item.quantity < 1) {
      item.quantity = 1;
    }

    // Call service to update the item quantity in the cart
    this.cartService.updateQuantity(item.id!, item.productId, item.quantity).subscribe(
      {
        next: () => {
          // Refresh the cart items after update
          this.ngOnInit();
        },
        error: (err) => {
          // Log any error that occurs
          console.error('Error updating quantity:', err);
        }
      }
    );
  }

  removeItem(id: number) {
    // Remove a single item by ID
    this.cartService.removeFromCart(id).subscribe(() => {
      // Update the local array after deletion
      this.cartItems = this.cartItems.filter(item => item.id !== id);
    });
  }

  clearCart() {
    // Clear all items from the cart
    this.cartService.clearCart();
    // Reset the local array to empty
    this.cartItems = [];
  }

  getTotal() {
    // Calculate the total cost of all cart items
    return this.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }
}
