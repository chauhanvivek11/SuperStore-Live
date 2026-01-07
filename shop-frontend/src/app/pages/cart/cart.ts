import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopService } from '../../services/shop';
import { ChangeDetectorRef } from '@angular/core';
import { RouterLink , Router  } from "@angular/router";

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class Cart implements OnInit {
  shopService = inject(ShopService);
  cd = inject(ChangeDetectorRef);
  router = inject(Router); 

  cartItems: any[] = [];
  totalPrice: number = 0;

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.shopService.getCartItems().subscribe({
      next: (data: any) => {
        console.log("Cart Items:", data);
        // Data items assign karna
        this.cartItems = data.items || [];
        this.calculateTotal();
        this.cd.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  calculateTotal() {
    // Har item ka price add karna
    this.totalPrice = this.cartItems.reduce((acc, item) => acc + item.price, 0);
  }

  removeItem(productId: number) {
    if(confirm('Are you sure you want to remove this item?')) {
      this.shopService.removeFromCart(productId).subscribe(() => {
        // Item delete hone ke baad list refresh karna
        this.loadCart(); 
      });
    }
  }

  checkout(){
        if(this.cartItems.length === 0){
          alert("Cart Is Empty ");
          return;
        }

         const orderData = {
        userId: this.shopService.getUserId(),
        // Items ki list bana rahe hain taaki backend save kar sake
        items: this.cartItems, 
        totalAmount: this.totalPrice,
        status: "Pending",
        orderDate: new Date()
    };
    

    this.shopService.placeOrder(orderData).subscribe({
        next: (res) => {
            alert("Order Placed Successfully! 🎉");
            // Abhi ke liye Home page par bhej rahe hain
            this.router.navigate(['/']); 
        },
        error: (err) => {
            console.error("Order failed:", err);
            alert("Something went wrong while placing order.");
        }
    });
    
  }
}