import { Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { AppPageComponent } from '../../../../shared/ui/app-page/app-page.component';
import { AppCardComponent } from '../../../../shared/ui/app-card/app-card.component';
import { AppButtonComponent } from '../../../../shared/ui/app-button/app-button.component';
import { SurveyReportsService } from '../data-access/survey-reports.service';
import { SurveyReportListItemDto } from '../models/survey-report.models';

@Component({
  selector: 'app-report-survey-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, DatePipe, AppPageComponent, AppCardComponent, AppButtonComponent],
  templateUrl: './report-survey-list.component.html',
  styleUrls: ['./report-survey-list.component.scss'],
})
export class ReportSurveyListComponent {
  private srv = inject(SurveyReportsService);

  searchCtrl = new FormControl<string>('', { nonNullable: true });

  loading = false;
  error: string | null = null;
  items: SurveyReportListItemDto[] = [];

  async ngOnInit() {
    await this.load();
  }

  async load() {
    this.loading = true;
    this.error = null;
    try {
      this.items = await firstValueFrom(this.srv.list(this.searchCtrl.value));
    } catch (e: any) {
      this.error = e?.message ?? 'Rapor listesi yüklenemedi.';
    } finally {
      this.loading = false;
    }
  }

  clear() {
    this.searchCtrl.setValue('');
    this.load();
  }
}
