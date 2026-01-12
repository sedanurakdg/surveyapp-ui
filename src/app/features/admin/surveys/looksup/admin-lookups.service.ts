import { Injectable, inject } from '@angular/core';

import { AdminLookupsApi } from './admin-lookups.api';
import { ApiClient } from '../../../../core/http/api-client';

@Injectable({ providedIn: 'root' })
export class AdminLookupsService {
  private api = inject(ApiClient);

  listQuestions() {
    return this.api.call(AdminLookupsApi.questions);
  }

  listUsers(search?: string) {
    return this.api.call(AdminLookupsApi.users, undefined, { search });
  }
}
