import { Component } from '@angular/core';
import {
  AppShellComponent,
  AppShellNavItem,
} from '../../../shared/ui/app-shell/app-shell.component';

@Component({
  selector: 'app-user-shell',
  standalone: true,
  imports: [AppShellComponent],
  templateUrl: './user-shell.component.html',
})
export class UserShellComponent {
  title = 'Kullanıcı';

  items: AppShellNavItem[] = [
    { label: 'Anketlerim', icon: 'assignment', route: '/user/surveys', exact: true },
    // sadece Admin görsün (istersen)
    { label: 'Admin Panel', icon: 'admin_panel_settings', route: '/admin', roles: ['Admin'] },
  ];
}
