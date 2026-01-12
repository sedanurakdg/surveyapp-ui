import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  FormArray,
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { firstValueFrom } from 'rxjs';



import { AppPageComponent } from '../../../../shared/ui/app-page/app-page.component';
import { AppCardComponent } from '../../../../shared/ui/app-card/app-card.component';
import { AppButtonComponent } from '../../../../shared/ui/app-button/app-button.component';
import { AnswerTemplateService } from '../data-access/answer-template.service';
import { AnswerOptionDto, AnswerTemplateDetailDto, CreateAnswerTemplateRequestDto, UpdateAnswerTemplateRequestDto } from '../models/answer-template.models';

@Component({
  selector: 'app-template-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, AppPageComponent, AppCardComponent, AppButtonComponent],
  templateUrl: './template-form.component.html',
  styleUrls: ['./template-form.component.scss'],
})
export class TemplateFormComponent {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private srv = inject(AnswerTemplateService);

  id: number | null = null;
  isEdit = false;

  loading = false;
  saving = false;
  error: string | null = null;

  form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(120)]],
    isActive: [true], // create'te default true; edit'te backend'ten patch
    options: this.fb.array([] as any[]),
  });

  get options(): FormArray {
    return this.form.get('options') as FormArray;
  }

  async ngOnInit() {
    const idRaw = this.route.snapshot.paramMap.get('id');
    this.id = idRaw ? Number(idRaw) : null;
    this.isEdit = !!this.id;

    // Create ekranı default 2 option ile gelsin
    if (!this.isEdit) {
      this.addOption('Seçenek 1', 1);
      this.addOption('Seçenek 2', 2);
      return;
    }

    await this.loadForEdit(this.id!);
  }

  private optionGroup(text = '', sortOrder = 1, id?: number | null) {
    return this.fb.group({
      id: new FormControl<number | null>(id ?? null),
      text: new FormControl<string>(text, {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(200)],
      }),
      sortOrder: new FormControl<number>(sortOrder, {
        nonNullable: true,
        validators: [Validators.required, Validators.min(1), Validators.max(32767)],
      }),
    });
  }

  addOption(text = '', sortOrder?: number) {
    const nextSort = sortOrder ?? (this.options.length + 1);
    this.options.push(this.optionGroup(text, nextSort));
  }

  removeOption(i: number) {
    if (this.options.length <= 2) {
      alert('En az 2 seçenek olmalıdır.');
      return;
    }
    this.options.removeAt(i);
    this.renumberSortOrders();
  }

  moveUp(i: number) {
    if (i <= 0) return;
    const cur = this.options.at(i);
    this.options.removeAt(i);
    this.options.insert(i - 1, cur);
    this.renumberSortOrders();
  }

  moveDown(i: number) {
    if (i >= this.options.length - 1) return;
    const cur = this.options.at(i);
    this.options.removeAt(i);
    this.options.insert(i + 1, cur);
    this.renumberSortOrders();
  }

  private renumberSortOrders() {
    // UI sırasını sortOrder'a yansıt
    for (let i = 0; i < this.options.length; i++) {
      const g = this.options.at(i);
      g.get('sortOrder')?.setValue(i + 1, { emitEvent: false });
    }
  }

  private normalizeOptionsForRequest(): AnswerOptionDto[] {
    const raw = this.options.getRawValue() as any[];
    // aynı sortOrder gelmesini engellemek için UI sırasına göre tekrar numaralandır
    return raw.map((x, idx) => ({
      id: x.id ?? null,
      text: (x.text ?? '').trim(),
      sortOrder: idx + 1,
    }));
  }

  private validateBeforeSubmit(): string | null {
    const name = (this.form.get('name')?.value ?? '').trim();
    if (!name) return 'Şablon adı zorunludur.';

    const opts = this.normalizeOptionsForRequest();
    if (opts.length < 2) return 'En az 2 seçenek olmalıdır.';

    if (opts.some(o => !o.text)) return 'Tüm seçeneklerin metni doldurulmalıdır.';

    // aynı text kontrolü (case-insensitive)
    const set = new Set<string>();
    for (const o of opts) {
      const key = o.text.toLowerCase();
      if (set.has(key)) return 'Aynı seçenek metni tekrar edemez.';
      set.add(key);
    }

    return null;
  }

  async loadForEdit(id: number) {
    this.loading = true;
    this.error = null;

    try {
      const dto = (await firstValueFrom(this.srv.get(id))) as AnswerTemplateDetailDto;

      // form patch
      this.form.patchValue({
        name: dto.name,
        isActive: dto.isActive,
      });

      // options reset
      this.options.clear();

      const sorted = (dto.options ?? []).slice().sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
      for (const o of sorted) {
        this.options.push(this.optionGroup(o.text ?? '', o.sortOrder ?? 1, o.id ?? null));
      }

      // backend boş dönerse en az 2 verelim
      if (this.options.length === 0) {
        this.addOption('Seçenek 1', 1);
        this.addOption('Seçenek 2', 2);
      } else if (this.options.length === 1) {
        this.addOption('Seçenek 2', 2);
      }

      this.renumberSortOrders();
    } catch (e: any) {
      this.error = e?.message ?? 'Şablon yüklenemedi.';
    } finally {
      this.loading = false;
    }
  }

  async save() {
    this.form.markAllAsTouched();

    const preErr = this.validateBeforeSubmit();
    if (preErr) {
      alert(preErr);
      return;
    }
    if (this.form.invalid) return;

    const name = (this.form.get('name')!.value ?? '').trim();
    const options = this.normalizeOptionsForRequest();

    this.saving = true;
    this.error = null;

    try {
      if (!this.isEdit) {
        const req: CreateAnswerTemplateRequestDto = { name, options };
        const res = await firstValueFrom(this.srv.create(req));
        alert('Şablon oluşturuldu.');
        // create sonrası edit ekranına da götürebilirsin, ama listeye dönelim:
        await this.router.navigate(['/admin/answer-templates']);
      } else {
        const req: UpdateAnswerTemplateRequestDto = {
          name,
          isActive: !!this.form.get('isActive')!.value,
          options,
        };
        await firstValueFrom(this.srv.update(this.id!, req));
        alert('Şablon güncellendi.');
        await this.router.navigate(['/admin/answer-templates']);
      }
    } catch (e: any) {
      this.error = e?.message ?? 'Kaydetme sırasında hata oluştu.';
    } finally {
      this.saving = false;
    }
  }

  cancel() {
    this.router.navigate(['/admin/answer-templates']);
  }
}
