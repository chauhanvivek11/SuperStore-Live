import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // 👈 Form ke liye zaroori
import { ShopService } from '../../services/shop';
import { Router } from '@angular/router';
import { Toast } from '../../services/toast';


@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule], // FormsModule add karna mat bhoolna
  templateUrl: './checkout.html',
  styleUrl: './checkout.css'
})
export class Checkout {
  shopService = inject(ShopService);
  router = inject(Router);

toastService = inject(Toast);

  cartItems: any[] = [];
  totalAmount: number = 0;

  // Form Data
  checkoutObj = {
    name: '',
    email: '',
    address: '',
    card: ''
  };

  ngOnInit() {
    // Cart ka data layenge taaki Total dikha sakein
    this.shopService.getCartItems().subscribe({
      next: (data: any) => {
        this.cartItems = data.items || [];
        this.calculateTotal();
      }
    });
  }

  calculateTotal() {
    this.totalAmount = this.cartItems.reduce((acc, item) => acc + item.price, 0);
  }

  placeOrder() {
    if(this.checkoutObj.name && this.checkoutObj.address && this.checkoutObj.card) {
      // Yahan hum Backend API call kar sakte hain (Order Save karne ke liye)
           
    //1. Alert hataya , toast lgaya 
    this.toastService.showToast(`Order Placed! Thank You , ${this.checkoutObj.name}`,`success`);

      // Order ke baad wapis Home page bhej do
      this.router.navigateByUrl('/'); 
    } else {
     this.toastService.showToast("Please Fill All The Details! ❌" , 'error');
    }
  }
}