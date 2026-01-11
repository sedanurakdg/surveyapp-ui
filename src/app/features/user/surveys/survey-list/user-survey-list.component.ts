import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { Observable } from 'rxjs';
import { AppPageComponent } from '../../../../shared/ui/app-page/app-page.component';
import { AppCardComponent } from '../../../../shared/ui/app-card/app-card.component';
import { AppButtonComponent } from '../../../../shared/ui/app-button/app-button.component';
import { UserSurveyService } from '../data-access/user-survey.service';
import { UserSurveyListDto } from '../models/user-survey.models';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-user-survey-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    AppPageComponent,
    AppCardComponent,
    AppButtonComponent,
    DatePipe
  ],
  templateUrl: './user-survey-list.component.html',
  styleUrls: ['./user-survey-list.component.scss'],
})
export class UserSurveyListComponent {
  private srv = inject(UserSurveyService);

  surveys$: Observable<UserSurveyListDto[]> = this.srv.list();
}
