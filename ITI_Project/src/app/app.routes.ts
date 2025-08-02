import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { AddProductComponent } from './components/add-product/add-product.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { CartComponent } from './components/cart/cart.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'products', component: ProductListComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {path:'products/:id', component: AddProductComponent},
  {path:'cart', component:CartComponent},
  {path:'**', component: NotFoundComponent}
];
