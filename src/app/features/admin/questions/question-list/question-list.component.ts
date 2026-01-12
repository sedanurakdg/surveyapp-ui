import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { AppPageComponent } from '../../../../shared/ui/app-page/app-page.component';
import { AppCardComponent } from '../../../../shared/ui/app-card/app-card.component';
import { AppButtonComponent } from '../../../../shared/ui/app-button/app-button.component';
import { QuestionService } from '../data-access/question.service';
import { QuestionListDto } from '../models/question.models';

@Component({
  selector: 'app-question-list',
  standalone: true,
  imports: [CommonModule, RouterModule, AppPageComponent, AppCardComponent, AppButtonComponent],
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.scss'],
})
export class QuestionListComponent {
  private srv = inject(QuestionService);
  private cdr = inject(ChangeDetectorRef);

  loading = false;
  error: string | null = null;
  items: QuestionListDto[] = [];

  async ngOnInit() {
    await this.load();
  }

  async load() {
    this.loading = true;
    this.error = null;

    try {
      this.items = await firstValueFrom(this.srv.list());
    } catch (e: any) {
      this.error = e?.message ?? 'Sorular yüklenemedi.';
    } finally {
      this.loading = false;
    }
    this.cdr.detectChanges();
  }

  async remove(id: number) {
    if (!confirm('Silmek istediğine emin misin?')) return;

    this.loading = true;
    this.error = null;

    try {
      await firstValueFrom(this.srv.delete(id));
      await this.load();
    } catch (e: any) {
      this.error = e?.message ?? 'Silme işlemi başarısız oldu.';
    } finally {
      this.loading = false;
    }
  }
}
