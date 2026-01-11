import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-forbidden',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div style="min-height:70vh; display:flex; align-items:center; justify-content:center; padding:24px;">
      <div style="max-width:520px; width:100%; border:1px solid #eee; border-radius:12px; padding:24px;">
        <h2 style="margin:0 0 8px;">403 - Yetkisiz Erişim</h2>
        <p style="margin:0 0 16px; color:#555;">
          Bu sayfayı görüntülemek için yetkiniz yok.
        </p>

        <div style="display:flex; gap:12px;">
          <a routerLink="/login">Giriş sayfasına dön</a>
          <a routerLink="/user">Ana sayfaya dön</a>
        </div>
      </div>
    </div>
  `,
})
export class ForbiddenComponent {}
