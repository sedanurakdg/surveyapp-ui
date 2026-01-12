import { ChangeDetectorRef, Component, inject, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

import { AppPageComponent } from '../../../../shared/ui/app-page/app-page.component';
import { AppCardComponent } from '../../../../shared/ui/app-card/app-card.component';
import { AppButtonComponent } from '../../../../shared/ui/app-button/app-button.component';
import { QuestionService } from '../data-access/question.service';
import { AnswerTemplateService } from '../../answer-templates/data-access/answer-template.service';
import { AnswerTemplateListDto } from '../../answer-templates/models/answer-template.models';
import {
  CreateQuestionRequestDto,
  QuestionDetailDto,
  UpdateQuestionRequestDto,
} from '../models/question.models';

@Component({
  selector: 'app-question-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    AppPageComponent,
    AppCardComponent,
    AppButtonComponent,
  ],
  templateUrl: './question-form.component.html',
  styleUrls: ['./question-form.component.scss'],
})
export class QuestionFormComponent {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private qSrv = inject(QuestionService);
  private tSrv = inject(AnswerTemplateService);
  private zone = inject(NgZone);
  id: number | null = null;
  isEdit = false;

  loading = false;
  saving = false;
  error: string | null = null;

  templates: AnswerTemplateListDto[] = [];

  form = this.fb.group({
    text: ['', [Validators.required, Validators.maxLength(500)]],
    answerTemplateId: [0, [Validators.required, Validators.min(1)]],
    isActive: [true], // sadece edit'te göster
  });

  async ngOnInit() {
    const idRaw = this.route.snapshot.paramMap.get('id');
    this.id = idRaw ? Number(idRaw) : null;
    if (this.id && Number.isNaN(this.id)) this.id = null;
    this.isEdit = this.id !== null;

    // ✅ ilk yükleme
    this.zone.run(() => {
      this.loading = true;
      this.error = null;
    });

    try {
      const list = await firstValueFrom(this.tSrv.list());
      const templates = list ?? [];

      let dto: any = null;
      if (this.isEdit) {
        dto = await firstValueFrom(this.qSrv.get(this.id!));
      }

      // ✅ view update'lerini zone içinde yap
      this.zone.run(() => {
        this.templates = templates;

        if (dto) {
          this.form.patchValue({
            text: dto.text,
            answerTemplateId: dto.answerTemplateId,
            isActive: dto.isActive,
          });
        }
      });
    } catch (e: any) {
      this.zone.run(() => {
        this.error = e?.message ?? 'Veriler yüklenemedi.';
      });
    } finally {
      // ✅ mutlaka kapat + CD tetikle
      this.zone.run(() => {
        this.loading = false;
        this.cdr.detectChanges();
      });
    }
  }

  async loadLookups() {
    this.loading = true;
    this.error = null;

    try {
      this.templates = await firstValueFrom(this.tSrv.list());
    } catch (e: any) {
      this.error = e?.message ?? 'Cevap şablonları yüklenemedi.';
    } finally {
      this.loading = false;
    }
  }

  async loadForEdit(id: number) {
    this.loading = true;
    this.error = null;

    try {
      const dto = (await firstValueFrom(this.qSrv.get(id))) as QuestionDetailDto;
      this.form.patchValue({
        text: dto.text,
        answerTemplateId: dto.answerTemplateId,
        isActive: dto.isActive,
      });
      this.cdr.detectChanges();
    } catch (e: any) {
      this.error = e?.message ?? 'Soru yüklenemedi.';
    } finally {
      this.loading = false;
    }
  }

  async save() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const raw = this.form.getRawValue();
    const text = (raw.text ?? '').trim();
    const answerTemplateId = Number(raw.answerTemplateId);

    if (!text) {
      alert('Soru metni zorunludur.');
      return;
    }

    this.saving = true;
    this.error = null;

    try {
      if (!this.isEdit) {
        const req: CreateQuestionRequestDto = { text, answerTemplateId };
        await firstValueFrom(this.qSrv.create(req));
        alert('Soru oluşturuldu.');
      } else {
        const req: UpdateQuestionRequestDto = {
          text,
          answerTemplateId,
          isActive: !!raw.isActive,
        };
        await firstValueFrom(this.qSrv.update(this.id!, req));
        alert('Soru güncellendi.');
      }

      await this.router.navigate(['/admin/questions']);
    } catch (e: any) {
      this.error = e?.message ?? 'Kaydedilemedi.';
    } finally {
      this.saving = false;
    }
  }

  cancel() {
    this.router.navigate(['/admin/questions']);
  }
}
