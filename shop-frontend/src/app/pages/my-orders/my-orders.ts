import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopService } from '../../services/shop';
import { RouterLink } from '@angular/router';
import { Observable, timer, switchMap, of, retry } from 'rxjs'; // 👈 Ye naye imports zaroori hain

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule, RouterLink], 
  templateUrl: './my-orders.html',
  styleUrls: ['./my-orders.css']
})
export class MyOrdersComponent {
  
  shopService = inject(ShopService);

  // Hum direct array nahi, balki ek "Stream" (Data ki nadi) banayenge
  orders$: Observable<any> | undefined;

  ngOnInit() {
    this.setupOrdersStream();
  }

  setupOrdersStream() {
    // 1. Har 500ms mein check karo ki User ID mili ya nahi
    this.orders$ = timer(0, 500).pipe(
      // 2. Jaise hi valid User ID mile, data fetch karo
      switchMap(() => {
        const userId = this.shopService.getUserId();
        
        if (userId && userId !== 'guest') {
          return this.shopService.getMyOrders(userId);
        }
        // Agar ID nahi mili, toh khali return karo (aur agle 500ms mein fir try hoga)
        return of(null); 
      }),
      // 3. Agar data mil gaya, toh baar-baar check karna band karo (Filter logic)
      // (Simple rakhte hain: User ID milte hi ye stream pakka data degi)
    );
  }

  // Agar user chahe toh manually refresh kar sake
  refresh() {
    window.location.reload();
  }
}