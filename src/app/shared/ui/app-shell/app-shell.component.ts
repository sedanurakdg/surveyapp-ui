import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../core/auth/auth.service';

export type AppShellNavItem = {
  label: string;
  icon?: string;
  route: string;
  exact?: boolean;
  roles?: string[]; // <-- EKLE
};
@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './app-shell.component.html',
  styleUrls: ['./app-shell.component.scss'],
})
export class AppShellComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  @Input({ required: true }) title!: string;
  @Input({ required: true }) items!: AppShellNavItem[];
  
  canShow(it: AppShellNavItem): boolean {
    const roles = it.roles ?? [];
    return this.auth.hasAnyRole(roles);
  }
  logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
