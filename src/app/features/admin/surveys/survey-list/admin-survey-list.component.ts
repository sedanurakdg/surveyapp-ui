import { Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { AppPageComponent } from '../../../../shared/ui/app-page/app-page.component';
import { AppCardComponent } from '../../../../shared/ui/app-card/app-card.component';
import { AppButtonComponent } from '../../../../shared/ui/app-button/app-button.component';
import { AdminSurveyService } from '../data-access/admin-survey.service';
import { AdminSurveyListItemDto } from '../models/admin-survey.models';

@Component({
  selector: 'app-admin-survey-list',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe, AppPageComponent, AppCardComponent, AppButtonComponent],
  templateUrl: './admin-survey-list.component.html',
  styleUrls: ['./admin-survey-list.component.scss'],
})
export class AdminSurveyListComponent {
  private srv = inject(AdminSurveyService);

  loading = false;
  error: string | null = null;
  items: AdminSurveyListItemDto[] = [];

  async ngOnInit() {
    await this.load();
  }

  async load() {
    this.loading = true;
    this.error = null;

    try {
      this.items = await firstValueFrom(this.srv.list());
    } catch (e: any) {
      this.error = e?.message ?? 'Anket listesi yüklenemedi.';
    } finally {
      this.loading = false;
    }
  }
}
