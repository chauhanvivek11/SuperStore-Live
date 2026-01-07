import { Component, inject, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ShopService } from '../../services/shop';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header implements OnInit {
  
  shopService = inject(ShopService);
  cd = inject(ChangeDetectorRef);

  cartCount = 0;
  user: any = null;
  isClerkReady = false; 

  ngOnInit() {
    // 1. Cart update logic
    this.shopService.getCartItems().subscribe(); 
    this.shopService.cartCount.subscribe((count) => {
      this.cartCount = count;
      this.cd.detectChanges();
    });

    // 2. 👇 Clerk Start Logic (Robust Version)
    const clerk = (window as any).Clerk;

    if (clerk) {
      // Case A: Agar Clerk pehle se maujood hai -> Turant load karo
      this.initializeClerk(clerk);
    } else {
      // Case B: Agar abhi nahi aaya -> Load hone ka wait karo
      const script = document.querySelector('script[data-clerk-publishable-key]');
      script?.addEventListener('load', () => {
        this.initializeClerk((window as any).Clerk);
      });
    }
  }

  // 👇 Yeh Function Clerk ko force-start karega
  async initializeClerk(clerk: any) {
    if (!clerk) return;

    try {
      if (!clerk.loaded) {
        await clerk.load(); // 🛑 Yahan Clerk start hoga
      }
      
      this.isClerkReady = true;
      this.user = clerk.user;
      console.log("✅ Clerk Loaded Successfully!");
      this.cd.detectChanges();
    } catch (err) {
      console.error("❌ Clerk Load Failed:", err);
    }
  }

  login() {
    if (!this.isClerkReady) {
      // Agar button jaldi daba diya, toh ab try karo
      const clerk = (window as any).Clerk;
      if (clerk && !clerk.loaded) {
         this.initializeClerk(clerk).then(() => clerk.openSignIn());
      } else {
         console.log("⏳ Clerk loading... please wait.");
      }
      return;
    }
    
    (window as any).Clerk.openSignIn();
  }

  logout() {
    const clerk = (window as any).Clerk;
    if (clerk) {
      clerk.signOut(() => {
        this.user = null;
        this.cd.detectChanges();
      });
    }
  }
}