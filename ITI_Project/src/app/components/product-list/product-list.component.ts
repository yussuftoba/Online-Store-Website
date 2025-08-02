// Import core component features from Angular
import { Component, OnInit } from '@angular/core';

// Import common Angular directives like *ngIf, *ngFor
import { CommonModule } from '@angular/common';

// Import FormsModule for using ngModel in template forms
import { FormsModule } from '@angular/forms';

// Import reusable product card component
import { ProductCardComponent } from '../product-card/product-card.component';

// Import service to fetch products
import { ProductService } from '../../service/product.service';

// Import RouterLink directive to use routing in templates
import { RouterLink } from '@angular/router';

// Define the Product interface to type-check product objects
interface Product {
  id: number;
  image: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  rating: number;
}

// Decorator that marks this class as an Angular component
@Component({
  selector: 'app-product-list', // HTML tag used to include this component
  standalone: true,             // Marks component as standalone (doesn't need to be declared in a module)
  imports: [                    // Import necessary modules and components
    CommonModule,               // For structural directives like *ngFor and *ngIf
    FormsModule,                // For [(ngModel)] binding in forms
    ProductCardComponent,       // For displaying each product in a card
    RouterLink                  // For router link support in templates
  ],
  templateUrl: './product-list.component.html', // HTML file for this component's view
  styleUrls: ['./product-list.component.css']   // CSS file for styles
})
export class ProductListComponent implements OnInit {
  // Array to hold all fetched products
  products: Product[] = [];

  // Inject ProductService to fetch data
  constructor(public service: ProductService) {}

  // Array to hold products after filtering by search/category
  filteredProducts: Product[] = [];

  // Search input value
  searchTerm: string = '';

  // Currently selected category filter
  selectedCategory: string = 'All';

  // Available categories for filtering
  categories: string[] = ['All', 'Electronics', 'Fashion', 'Accessories', 'Home'];

  // ngOnInit runs once when component is initialized
  ngOnInit(): void {
    // Fetch all products from the service
    this.service.getAll().subscribe({
      next: (data: any) => {
        console.log(data);              // Log the fetched data
        this.products = data;          // Store the full product list
        this.filteredProducts = [...this.products]; // Initialize filtered list with all products
      },
      error: (err: any) => {
        console.error("Error fetching products:", err); // Log any errors
      },
      complete: () => {
        console.log('Product data fetched successfully'); // Log completion
      }
    });
  }

  // Called when user types in the search box
  onSearch(): void {
    // Filter products by name or category containing the search term
    this.filteredProducts = this.products.filter(product =>
      product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.applyCategoryFilter(); // Then apply category filter on top
  }

  // Called when user selects a category from dropdown
  onCategoryChange(): void {
    this.applyCategoryFilter(); // Refilter products based on new category
  }

  // Private method to apply category filtering on already searched results
  private applyCategoryFilter(): void {
    if (this.selectedCategory === 'All') {
      // If "All", just return the search-filtered list
      this.filteredProducts = this.products.filter(product =>
        product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      // If specific category selected, apply both search and category filter
      this.filteredProducts = this.products.filter(product =>
        (product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
         product.category.toLowerCase().includes(this.searchTerm.toLowerCase())) &&
         product.category === this.selectedCategory
      );
    }
  }

  // Called when a product is deleted from ProductCardComponent
  onProductDeleted(id: number): void {
    // Remove product from filtered view
    this.filteredProducts = this.filteredProducts.filter(p => p.id !== id);

    // Also remove from original full list
    this.products = this.products.filter(p => p.id !== id);
  }
}
