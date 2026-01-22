import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { MissionFilter } from '../_models/mission-filter';
import { firstValueFrom } from 'rxjs';
import { Mission } from '../_models/mission';

@Injectable({
  providedIn: 'root',
})
export class MissionService {
  private _api_url = environment.baseUrl + '/view/filter';
  private _http = inject(HttpClient)

  filter: MissionFilter = {  }

  async get_all(filter: MissionFilter): Promise<Mission[]> {
    const queryString = this.createQueryString(filter);
    const url = this._api_url + (queryString ? '?' + queryString : '');
    console.log('Fetching missions from:', url);
    return await firstValueFrom(this._http.get<Mission[]>(url));
  }

  async getByFilter(filter: MissionFilter): Promise<Mission[]> {
    return await this.get_all(filter);
  }
  private createQueryString(filter: MissionFilter) {
    this.filter = filter
    const params: string[] = []

    if (filter.name && filter.name.trim()) {
      params.push(`name=${encodeURIComponent(filter.name.trim())}`)
    }
    if (filter.status) {
      params.push(`status=${encodeURIComponent(filter.status)}`)
    }

    return params.join('&');
  }
}
