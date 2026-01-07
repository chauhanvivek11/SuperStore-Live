import { Component } from '@angular/core';
import { RouterLink } from '@angular/router'; // 👈 1. Ye Line Import karo

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink], // 👈 2. Yahan 'RouterLink' likhna zaroori hai
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class Footer {
  // Logic ki zaroorat nahi hai, bas links chalne chahiye
}