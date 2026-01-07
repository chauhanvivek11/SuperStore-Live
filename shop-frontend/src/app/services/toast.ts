import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Toast {
  
  toastState = new BehaviorSubject<{msg: string, type: string, show: boolean}>({
    msg: '', type: 'success', show: false
  });

  constructor() { }

  showToast(message: string, type: 'success' | 'error' = 'success') {
    
    // 1. Console mein check karne ke liye (F12 dabake Console dekho)
    console.log("🟢 Toast OPEN kar raha hu...");

    // 2. Toast dikhao
    this.toastState.next({ msg: message, type: type, show: true });

    // 3. Timer (Yeh line bohot zaroori hai!)
    setTimeout(() => {
      
      console.log("🔴 3 Second ho gaye! Ab Toast BAND kar raha hu...");
      
      // 4. Toast chupao
      this.toastState.next({ msg: '', type: type, show: false });

    }, 5000); // 3000 matlab 3 second
  }
}