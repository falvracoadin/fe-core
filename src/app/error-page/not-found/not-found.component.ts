import { Component } from '@angular/core';

@Component({
  selector: 'app-not-found',
  template: `
    <div class="d-flex align-items-center justify-content-center" style="width: 100%; height: 100%;">
      <p style="color: #0d0d0d; font-size: 24px; font-weight: 500; padding-right: 23px; margin-right: 20px; border-right: 1px solid #0d0d0d">404</p>
      <p style="color: #0d0d0d; font-size: 14px; font-weight: 400">Halaman ini tidak dapat ditemukan atau belum tersedia.</p>
    </div>
  `
})
export class NotFoundComponent {

}
