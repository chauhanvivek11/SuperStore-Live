import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink , Router} from '@angular/router'; // 👈 RouterLink add kiya
import { ShopService } from '../../services/shop';
import { ChangeDetectorRef } from '@angular/core';
import { Toast } from '../../services/toast';



@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterLink], // 👈 Yahan bhi RouterLink add karein
  templateUrl: './product-details.html', // Note: Aapne file name .html rakha hai
  styleUrl: './product-details.css'
})
export class ProductDetails {
  private route = inject(ActivatedRoute);
  private shopService = inject(ShopService);
  private cd = inject(ChangeDetectorRef); 
  private router = inject(Router); //Router inject krdia taki buy now vala button chl ske 
  private toastService = inject(Toast);


  product: any = null;
  loading: boolean = true;

  ngOnInit() {
    // Product ID URL se nikalo aur data mangwao
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.shopService.getProductById(Number(id)).subscribe((data) => {
        this.product = data;
        this.loading = false;
        this.cd.detectChanges(); 
      });
    }
  }

  addToCart(){
    if(this.product){
      this.shopService.addToCart(this.product).subscribe({
        next: () =>{
            //ye alert vali line hai 
            this.toastService.showToast(`${this.product.title} is added to cart `, `success`);
        },
        error: () =>{
          this.toastService.showToast("Error Adding To Cart",`error`)
        }
      });
    }
  }

  // 👇 YEH HAI BUY NOW FUNCTION
  buyNow() {
    //ab hum buy now k button se pehle bhi login krvayegi taki logined user he buy now kr ske
    //1. phelle clerk check kro
    const clerk = (window as any).Clerk;

    if(!clerk || !clerk.user){
      //agar login nhi hai toh , popup dikhao
      this.toastService.showToast('Please Login To Buy Products !','error');
      clerk?.openSignIn();
    }

    //agar login hai toh cart mei dalke buy now kro , cart vale page mei jake 

    if(this.product) {
      // 1. Pehle Cart mein add karo
      this.shopService.addToCart(this.product).subscribe({
        next: () => {
          // 2. Success hote hi Checkout page par bhejo
          this.router.navigateByUrl('/checkout'); 
        },
        error: () => alert("Error processing request ❌")
      });
    }
  }


}