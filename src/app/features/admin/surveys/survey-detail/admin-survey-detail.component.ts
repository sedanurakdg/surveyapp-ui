import { Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { firstValueFrom } from 'rxjs';


import { AppPageComponent } from '../../../../shared/ui/app-page/app-page.component';
import { AppCardComponent } from '../../../../shared/ui/app-card/app-card.component';
import { AppButtonComponent } from '../../../../shared/ui/app-button/app-button.component';
import { AdminSurveyService } from '../data-access/admin-survey.service';
import { AdminSurveyDetailDto } from '../models/admin-survey.models';

@Component({
  selector: 'app-admin-survey-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe, AppPageComponent, AppCardComponent, AppButtonComponent],
  templateUrl: './admin-survey-detail.component.html',
  styleUrls: ['./admin-survey-detail.component.scss'],
})
export class AdminSurveyDetailComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private srv = inject(AdminSurveyService);

  id = Number(this.route.snapshot.paramMap.get('id'));

  loading = false;
  error: string | null = null;
  survey: AdminSurveyDetailDto | null = null;

  async ngOnInit() {
    await this.load();
  }

  async load() {
    this.loading = true;
    this.error = null;
    try {
      this.survey = await firstValueFrom(this.srv.get(this.id));
    } catch (e: any) {
      this.error = e?.message ?? 'Detay yüklenemedi.';
    } finally {
      this.loading = false;
    }
  }

  async delete() {
    if (!this.survey) return;

    const ok = confirm(`"${this.survey.title}" anketini silmek istiyor musunuz?`);
    if (!ok) return;

    try {
      await firstValueFrom(this.srv.delete(this.survey.id));
      await this.router.navigateByUrl('/admin/surveys');
    } catch (e: any) {
      alert(e?.message ?? 'Silme işlemi başarısız.');
    }
  }
}
