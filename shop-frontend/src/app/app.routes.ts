import { Routes } from '@angular/router';
import { Shop } from './pages/shop/shop';
import { ProductDetails } from './pages/product-details/product-details';
import { Cart } from './pages/cart/cart'; // 👈 Import Zaroori hai
import { Checkout } from './pages/checkout/checkout';
import { MyOrdersComponent } from './pages/my-orders/my-orders'; // Check path



export const routes: Routes = [
{path: '', component: Shop, pathMatch: 'full'}, //Home page
{path: 'product/:id', component: ProductDetails}  //Dynamic page (:id badalta rahega )

// 👇 Cart ka route add karo
  ,{ path: 'cart', component: Cart },

  //checkout route 
  {path:'checkout', component: Checkout},
  { path: 'my-orders', component: MyOrdersComponent }, // 👈 Ye line add karein
 
];
