import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject , tap } from 'rxjs'; // 👈 'tap' aur 'BehaviorSubject' zaroori hain

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  http = inject(HttpClient); 

  //ye varialbe ginti rkhega ki count mei cart mei kitne item hai 
  cartCount = new BehaviorSubject<number>(0);


  //ab hum seprate user k liye alag se cart bnega , ek user ko dusre ka cart nhi dikhega , cart seprate hoga ab 
  public getUserId():string {
    const clerk=(window as any).Clerk;

    //agar user login hai toh uski id return kro 
    if(clerk && clerk.user){
      return clerk.user.id;
    }

    // agar login nhi hai toh filhal guest return kro 
    return 'guest';
  }

  


  // 1. FakeStore API se saare products lana
  getProducts() {
    return this.http.get<any[]>('https://fakestoreapi.com/products');
  }

  // 2. Apne .NET Backend par Cart item bhejna  // 3. Jab Item Add hoga, toh ginti +1 kar denge
  addToCart(product: any) { 
    const userId = this.getUserId(); //ab humne function use kr lia , jo user id kechega 
    
    // YAHAN APNA PORT NUMBER DALEIN 👇 (e.g., 5166)
    const backendUrl = `http://localhost:5164/api/cart/add/${userId}`;

    const cartItem = {
      productId: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: 1
    };

    return this.http.post(backendUrl, cartItem).pipe(tap(()=>{
      // Agar success hua, toh purani ginti mein +1 kar do
      const currentCount = this.cartCount.value;
     this.getCartItems().subscribe();
    }));
  }

  //3. Id ke base par sirf ek product lana
  getProductById(id:number){
    return this.http.get<any>(`https://fakestoreapi.com/products/${id}`)
  }

  
   // . Jab Cart mangwayenge, toh ginti bhi update karenge
  // 4. Cart ke items lana (GET)
  getCartItems() {
    const userId = this.getUserId();  // yha bhi real id hogi ab 
    return this.http.get<any>(`http://localhost:5164/api/cart/${userId}`).pipe(tap((data)=>{
          //data aate he ginti start krdo 
          if(data && data.items){ 
              this.cartCount.next(data.items.length);
          }
          else{
            this.cartCount.next(0);
          }
       
    }));

    
  }

  // 5. Cart se item delete karna (DELETE)
  removeFromCart(productId: number) {
    const userId = this.getUserId();  // an delete bhi apne he cart se hoga , jiski id hai
    return this.http.delete(`http://localhost:5164/api/cart/remove/${userId}/${productId}`).pipe(tap(()=>{
      this.getCartItems().subscribe();
    }));
  }


  // 6. Naya Order Place karna (Backend Port 5164)
  placeOrder(orderData: any) {
    return this.http.post('http://localhost:5164/api/order/place', orderData);
  }

  // 7. My Orders lana
  getMyOrders(userId: string) {
    return this.http.get(`http://localhost:5164/api/order/myorders/${userId}`);
  }
  
}
