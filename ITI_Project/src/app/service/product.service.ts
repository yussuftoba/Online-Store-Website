import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  products:any[] = [];

  apiUrl: string="http://localhost:3000/products";

  constructor(public http:HttpClient) { }

  getAll(){
    return this.http.get(this.apiUrl);
  }

  getById(id:any){
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  addProduct(product:any){
    return this.http.post(this.apiUrl, product);
  }

  editProduct(product:any, id:any){
    return this.http.put(`${this.apiUrl}/${id}`, product); 
  }

  deleteProduct(id:any){
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
