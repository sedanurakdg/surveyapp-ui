import { Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

import { AppPageComponent } from '../../../../shared/ui/app-page/app-page.component';
import { AppCardComponent } from '../../../../shared/ui/app-card/app-card.component';
import { AppButtonComponent } from '../../../../shared/ui/app-button/app-button.component';
import { SurveyReportsService } from '../data-access/survey-reports.service';
import {
  SurveyReportUserListItemDto,
  SurveyReportUsersResponseDto,
} from '../models/survey-report.models';

@Component({
  selector: 'app-report-survey-users',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    DatePipe,
    AppPageComponent,
    AppCardComponent,
    AppButtonComponent,
  ],
  templateUrl: './report-survey-users.component.html',
  styleUrls: ['./report-survey-users.component.scss'],
})
export class ReportSurveyUsersComponent {
  private route = inject(ActivatedRoute);
  private srv = inject(SurveyReportsService);

  surveyId = Number(this.route.snapshot.paramMap.get('surveyId'));

  searchCtrl = new FormControl<string>('', { nonNullable: true });

  loading = false;
  error: string | null = null;
  dto: SurveyReportUsersResponseDto | null = null;
  items: SurveyReportUserListItemDto[] = [];

  async ngOnInit() {
    await this.load();
  }

  async load() {
    this.loading = true;
    this.error = null;

    try {
      const res = await firstValueFrom(this.srv.users(this.surveyId, this.searchCtrl.value));
      this.dto = res;
      this.items = res.users ?? [];
    } catch (e: any) {
      this.error = e?.message ?? 'Kullanıcı listesi yüklenemedi.';
    } finally {
      this.loading = false;
    }
  }

  clear() {
    this.searchCtrl.setValue('');
    this.load();
  }

  trackByUserId(_: number, x: SurveyReportUserListItemDto) {
    return x.userId;
  }
}
