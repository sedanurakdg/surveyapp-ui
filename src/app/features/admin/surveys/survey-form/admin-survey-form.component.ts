import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder,FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AppPageComponent } from '../../../../shared/ui/app-page/app-page.component';
import { AppCardComponent } from '../../../../shared/ui/app-card/app-card.component';
import { AppButtonComponent } from '../../../../shared/ui/app-button/app-button.component';
import { AdminSurveyService } from '../data-access/admin-survey.service';
import { AdminLookupsService } from '../looksup/admin-lookups.service';
import { AdminQuestionListDto, AdminUserDto } from '../looksup/admin-lookups.api';

@Component({
  selector: 'app-admin-survey-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    AppPageComponent,
    AppCardComponent,
    AppButtonComponent,
    MatSelectModule,
    MatCheckboxModule,
    FormsModule
  ],
  templateUrl: './admin-survey-form.component.html',
  styleUrls: ['./admin-survey-form.component.scss'],
})
export class AdminSurveyFormComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private srv = inject(AdminSurveyService);
  private lookups = inject(AdminLookupsService);

  questions: AdminQuestionListDto[] = [];
  users: AdminUserDto[] = [];

  userSearch = '';
  loadingLookups = false;

  idParam = this.route.snapshot.paramMap.get('id');
  isEdit = !!this.idParam;
  id = this.idParam ? Number(this.idParam) : null;

  loading = false;
  saving = false;
  error: string | null = null;

  form = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(200)]],
    description: [''],
    startsAtUtc: ['', Validators.required],
    endsAtUtc: ['', Validators.required],
    isActive: [true],
    questionIds: this.fb.control<number[]>([], { validators: [Validators.required] }),
    userIds: this.fb.control<number[]>([]),
  });

  async ngOnInit() {
    await this.loadLookups();
    if (this.isEdit && this.id) {
      await this.loadForEdit(this.id);
    } else {
      const now = new Date();
      const end = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

      this.form.patchValue({
        startsAtUtc: this.toLocalInput(now),
        endsAtUtc: this.toLocalInput(end),
      });
    }
  }
  async loadLookups(search?: string) {
    this.loadingLookups = true;
    try {
      const [qs, us] = await Promise.all([
        firstValueFrom(this.lookups.listQuestions()),
        firstValueFrom(this.lookups.listUsers(search)),
      ]);

      this.questions = qs.filter((x) => x.isActive);
      this.users = us;
    } finally {
      this.loadingLookups = false;
    }
  }
  private toLocalInput(d: Date): string {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  private toIsoFromLocalInput(v: string): string {
    return v;
  }

  async loadForEdit(id: number) {
    this.loading = true;
    this.error = null;
    try {
      const dto = await firstValueFrom(this.srv.get(id));

      const qIds = (dto.questions ?? [])
        .slice()
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((x) => x.questionId);

      this.form.patchValue({
        title: dto.title,
        description: dto.description ?? '',
        startsAtUtc: dto.startsAtUtc?.slice(0, 16) ?? '',
        endsAtUtc: dto.endsAtUtc?.slice(0, 16) ?? '',
        isActive: dto.isActive,

        questionIds: qIds,
        userIds: dto.assignedUserIds ?? [],
      });
    } catch (e: any) {
      this.error = e?.message ?? 'Kayıt yüklenemedi.';
    } finally {
      this.loading = false;
    }
  }

  private normalizeDateTimeLocal(v: string): string {
    // "2026-01-09T10:30" => "2026-01-09T10:30:00" (backend DateTime parse’ı için daha sağlam)
    if (!v) return v;
    return v.length === 16 ? `${v}:00` : v;
  }

  async save() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const raw = this.form.getRawValue();
    const base = {
      title: raw.title!,
      description: raw.description || null,
      startsAtUtc: this.normalizeDateTimeLocal(raw.startsAtUtc!),
      endsAtUtc: this.normalizeDateTimeLocal(raw.endsAtUtc!),
      questionIds: raw.questionIds ?? [],
      userIds: raw.userIds ?? [],
    };

    this.saving = true;
    this.error = null;

    try {
      if (!this.isEdit) {
        const created = await firstValueFrom(this.srv.create(base));
        await this.router.navigate(['/admin/surveys', created.id]);
      } else {
        await firstValueFrom(this.srv.update(this.id!, { ...base, isActive: !!raw.isActive }));
        await this.router.navigate(['/admin/surveys', this.id]);
      }
    } catch (e: any) {
      this.error = e?.message ?? 'Kaydedilemedi.';
    } finally {
      this.saving = false;
    }
  }
}
