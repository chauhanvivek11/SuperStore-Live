import { Component,inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Toast } from '../../services/toast';

@Component({
  selector: 'app-toast',
  imports: [CommonModule],
  standalone:true,
  templateUrl: './toast.html',
  styleUrl: './toast.css',
})
export class ToastC {
     toastService = inject(Toast);
     cd=inject(ChangeDetectorRef);

 // HTML mein use karne ke liye variable
  toastData: any = { msg: '', show: false, type: 'success' };

  ngOnInit() {
    // Service ki baat suno (Subscribe)
    this.toastService.toastState.subscribe((data) => {
      this.toastData = data;

      // 👇 3. YEH HAI JADOO KI CHHADI (Magic Line)
      // Iska matlab: "Angular, abhi ke abhi screen update karo!"
      this.cd.detectChanges();
    });
  }
  
  close() {
    this.toastData.show = false;
    this.cd.detectChanges(); // Yahan bhi laga do taaki close karte hi gayab ho jaye
  }
}
