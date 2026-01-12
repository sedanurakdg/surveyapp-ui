import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { AppPageComponent } from '../../../../shared/ui/app-page/app-page.component';
import { AppCardComponent } from '../../../../shared/ui/app-card/app-card.component';
import { AppButtonComponent } from '../../../../shared/ui/app-button/app-button.component';
import { AnswerTemplateService } from '../data-access/answer-template.service';
import { AnswerTemplateListDto } from '../models/answer-template.models';

@Component({
  selector: 'app-answer-template-list',
  standalone: true,
  imports: [CommonModule, RouterModule, AppPageComponent, AppCardComponent, AppButtonComponent],
  templateUrl: './template-list.component.html',
  styleUrls: ['./template-list.component.scss'],
})
export class TemplateListComponent {
  private srv = inject(AnswerTemplateService);
  private cdr = inject(ChangeDetectorRef);
  loading = false;
  error: string | null = null;
  items: AnswerTemplateListDto[] = [];

  async ngOnInit() {
    await this.load();
  }

  async load() {
  this.loading = true;
  this.error = null;
  try {
    this.items = await firstValueFrom(this.srv.list());
  } catch (e: any) {
    this.error = e?.message ?? 'Şablonlar yüklenemedi.';
  } finally {
    this.loading = false;
  }
}

  async remove(id: number) {
    if (!confirm('Silmek istediğine emin misin?')) return;

    this.loading = true; // ✅ operasyon sırasında spinner göster
    this.error = null;

    try {
      await firstValueFrom(this.srv.delete(id));
      await this.load(); // ✅ listeyi yenile
      this.cdr.detectChanges();
    } catch (e: any) {
      this.error = e?.message ?? 'Silme işlemi başarısız oldu.';
    } finally {
      this.loading = false; // ✅ ne olursa olsun kapat
    }
  }
}
