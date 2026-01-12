import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { AppPageComponent } from '../../../../shared/ui/app-page/app-page.component';
import { AppCardComponent } from '../../../../shared/ui/app-card/app-card.component';
import { AppButtonComponent } from '../../../../shared/ui/app-button/app-button.component';
import { SurveyReportsService } from '../data-access/survey-reports.service';
import { SurveyReportUserDetailDto } from '../models/survey-report.models';

@Component({
  selector: 'app-report-user-answers',
  standalone: true,
  imports: [CommonModule, RouterModule, AppPageComponent, AppCardComponent, AppButtonComponent],
  templateUrl: './report-user-answers.component.html',
  styleUrls: ['./report-user-answers.component.scss'],
})
export class ReportUserAnswersComponent {
  private route = inject(ActivatedRoute);
  private srv = inject(SurveyReportsService);

  surveyId = Number(this.route.snapshot.paramMap.get('surveyId'));
  userId = Number(this.route.snapshot.paramMap.get('userId'));

  loading = false;
  error: string | null = null;
  dto: SurveyReportUserDetailDto | null = null;

  async ngOnInit() {
    await this.load();
  }

  async load() {
    this.loading = true;
    this.error = null;

    try {
      this.dto = await firstValueFrom(this.srv.userDetail(this.surveyId, this.userId));
    } catch (e: any) {
      this.error = e?.message ?? 'Cevap detayları yüklenemedi.';
    } finally {
      this.loading = false;
    }
  }

  trackByQuestionId(_: number, x: any) {
    return x.questionId;
  }
}
