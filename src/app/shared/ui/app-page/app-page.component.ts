import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app-page.component.html',
  styleUrls: ['./app-page.component.scss'],
})
export class AppPageComponent {
  @Input() title?: string;
  @Input() subtitle?: string;
  @Input() maxWidth: 'md' | 'lg' | 'xl' = 'lg';
}
