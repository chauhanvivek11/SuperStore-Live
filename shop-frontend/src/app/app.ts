import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Shop } from './pages/shop/shop';
import { Header } from './components/header/header';
import { Footer } from "./components/footer/footer";
import { ToastC } from './components/toast/toast';

// 👇 1. Clerk ko pehchanne ke liye yeh line likho
declare global {
  interface Window {
    Clerk: any;
  }
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Shop, Header, Footer ,ToastC],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('shop-frontend');
  // 👇 2. App start hote hi Clerk load karo
  async ngOnInit() {
    const script = document.querySelector('script[data-clerk-publishable-key]');
    
    if (script) {
      script.addEventListener('load', async () => {
        await window.Clerk.load();
        console.log('Clerk Loaded via CDN! 🚀');
      });
    }
  }

}
