import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';   // Loop ke liye zaroori
import { ShopService } from '../../services/shop';
import { RouterLink } from '@angular/router';     // Link ke liye
import { ChangeDetectorRef } from '@angular/core';
import { Toast } from '../../services/toast';
import { FormsModule } from '@angular/forms'; // 👈 Ye naya (Search error hatane ke liye)

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule], // 👈 FormsModule add kiya
  templateUrl: './shop.html',
  styleUrl: './shop.css'
})
export class Shop implements OnInit {

  // Inject karo
  toastService = inject(Toast);
  shopService = inject(ShopService);
  cd = inject(ChangeDetectorRef);
  
  products: any[] = [];    // Master Data (Sab kuch yahan rahega)
  filteredProducts: any[] = []; // Display Data (Screen par ye dikhega)

  // 👇 Ye variable missing tha, isliye error aa raha tha
  searchKey: string = ''; 

  currentSlide = 0;
  banners = [
   {
      img: 'https://images.pexels.com/photos/974911/pexels-photo-974911.jpeg?auto=compress&cs=tinysrgb&w=1600',
      title: 'Super Sale 50% Off',
      text: 'Grab the best deals on fashion now!'
    },
    {
      img: 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=1600',
      title: 'New Electronics',
      text: 'Upgrade your tech game today.'
    },
    {
      img: 'https://images.pexels.com/photos/837140/pexels-photo-837140.jpeg?auto=compress&cs=tinysrgb&w=1600',
      title: 'Premium Collection',
      text: 'Exclusive styles just for you.'
    }
  ];

  ngOnInit() {
    // Page load hote hi products mangwao
    this.loadProducts(); // 👈 Logic ko function me daal diya taaki button se bhi call kar sako

    //auto slider settimeout har 3 second mei bdle ga
   // ✅ SMOOTH SLIDER LOGIC
    setInterval(() => {
      this.currentSlide = (this.currentSlide + 1) % this.banners.length;
      this.cd.detectChanges(); // Screen update karega
    }, 4000); // Har 4 second mein change hoga
  }

  // 👇 Ye naya function banaya hai (Code aapka hi hai, bas wrapper lagaya hai)
  loadProducts() {
    this.shopService.getProducts().subscribe({
      next: (data) => {
        console.log("🟢 Data aa gaya!", data);
        this.products = data;

        // ✅ IMP: Shuru mein Filtered list ko Full Data se bhar do
        this.filteredProducts = data;

        // 👇 Yeh line "Jadoo" karegi - Screen turant update hogi
        this.cd.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  //search function 
  onSearch(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.searchKey = searchTerm; // 👈 Ye add kiya taaki variable update rahe

    // Agar search khali hai , toh wapis sab dikhao
    if(!searchTerm){
      this.filteredProducts = this.products;
      return;
    }

    //filter logic 
    this.filteredProducts = this.products.filter(product => product.title.toLowerCase().includes(searchTerm));
  }

  addItemToCart(product: any) {
     //yaha hum security check lga rhe hai , jis se ki jab koi add to cart ya buy now krega toh , usko popup aayega ki pehle login kro,, 
     //1. clerk user check kro 
     const clerk = (window as any).Clerk;
     
     //check kregei ki login hai ya nahi 
     if(!clerk || !clerk.user){
        //agar user login nhi hai toh 
        this.toastService.showToast('Please Login To Add Items! 🔒 ','error');

        // login popup khol do ,, jiss se useer login kr chuke 
        clerk?.openSignIn();

        return; //login nhi hua toh vapas jao 
      }
      
    this.shopService.addToCart(product).subscribe({
      next: () => {
        // alert hataya, Toast lagaya 👇
        this.toastService.showToast(`${product.title} added to cart!`, 'success');
      },
      error: () => {
        this.toastService.showToast('Something went wrong!', 'error');
      }
    });
  }
}