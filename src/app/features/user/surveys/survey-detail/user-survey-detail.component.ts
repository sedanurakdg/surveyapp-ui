import { Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  ReactiveFormsModule,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AppPageComponent } from '../../../../shared/ui/app-page/app-page.component';
import { AppCardComponent } from '../../../../shared/ui/app-card/app-card.component';
import { AppButtonComponent } from '../../../../shared/ui/app-button/app-button.component';
import { UserSurveyService } from '../data-access/user-survey.service';

type SurveyDetailDto = {
  id: number;
  title: string;
  description: string;
  startsAtUtc: string;
  endsAtUtc: string;
  isSubmitted: boolean;
  questions: Array<{
    questionId: number;
    text: string;
    choices: Array<{ index: number; text: string }>;
  }>;
};

type SubmitSurveyRequest = {
  answers: Array<{ questionId: number; selectedOptionIndex: number }>;
};

@Component({
  selector: 'app-user-survey-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatRadioModule,
    DatePipe,
    AppPageComponent,
    AppCardComponent,
    AppButtonComponent,
    MatSnackBarModule,
  ],
  templateUrl: './user-survey-detail.component.html',
  styleUrls: ['./user-survey-detail.component.scss'],
})
export class UserSurveyDetailComponent {
  private route = inject(ActivatedRoute);
  private srv = inject(UserSurveyService);
  private fb = inject(FormBuilder);
  private snack = inject(MatSnackBar);
  private router = inject(Router);

  id = Number(this.route.snapshot.paramMap.get('id'));

  loading = true;
  saving = false;
  error: string | null = null;

  survey: SurveyDetailDto | null = null;

  form = this.fb.group({
    answers: this.fb.array<FormGroup>([]),
  });

  get answers(): FormArray<FormGroup> {
    return this.form.get('answers') as FormArray<FormGroup>;
  }
  get isSubmitted(): boolean {
    return !!this.survey?.isSubmitted;
  }
  async ngOnInit() {
    await this.load();
  }

  private buildForm(dto: SurveyDetailDto) {
    this.answers.clear();

    for (const q of dto.questions) {
      this.answers.push(
        this.fb.group({
          questionId: new FormControl(q.questionId, { nonNullable: true }),
          selectedOptionIndex: new FormControl<number | null>(
            (q as any).selectedOptionIndex ?? null,
            { validators: [Validators.required] },
          ),
        }),
      );
    }
  }

  async load() {
    this.loading = true;
    this.error = null;

    try {
      const dto = (await firstValueFrom(this.srv.get(this.id))) as SurveyDetailDto;

      this.survey = dto;
      this.buildForm(dto);
      if (dto.isSubmitted) {
        this.form.disable({ emitEvent: false });
      } else {
        this.form.enable({ emitEvent: false });
      }
    } catch (e: any) {
      this.error = e?.message ?? 'Anket detayı yüklenemedi.';
    } finally {
      this.loading = false;
    }
  }

  async submit() {
    if (!this.survey || this.isSubmitted) return;
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      this.error = 'Lütfen tüm soruları yanıtlayın.';
      return;
    }

    this.saving = true;
    this.error = null;

    try {
      const body: SubmitSurveyRequest = {
        answers: this.answers.controls.map((g) => ({
          questionId: g.get('questionId')!.value,
          selectedOptionIndex: g.get('selectedOptionIndex')!.value,
        })) as any,
      };

      await firstValueFrom(this.srv.submit(this.survey.id, body as any));

      this.snack.open('Anket başarıyla gönderildi.', 'Tamam', {
        duration: 2500,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });

      await this.router.navigateByUrl('/user/surveys');
      // submit sonrası listeye dönmek daha iyi UX
      // (istersen burada tekrar load da yapabiliriz)
    } catch (e: any) {
      this.error = e?.message ?? 'Gönderilemedi.';
    } finally {
      this.saving = false;
    }
  }
}
