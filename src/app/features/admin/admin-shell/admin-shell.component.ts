import { Component } from '@angular/core';
import {
  AppShellComponent,
  AppShellNavItem,
} from '../../../shared/ui/app-shell/app-shell.component';

@Component({
  selector: 'app-admin-shell',
  standalone: true,
  imports: [AppShellComponent],
  templateUrl: './admin-shell.component.html',
})
export class AdminShellComponent {
  title = 'Admin Panel';

  items: AppShellNavItem[] = [
    { label: 'Anketler', icon: 'assignment', route: '/admin/surveys', exact: true },
    { label: 'Raporlar', icon: 'analytics', route: '/admin/reports/surveys', exact: true },
  ];
}
