import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiService} from 'eygle-core/client/services/api.service';

@Injectable()
export class TvShowsService extends ApiService {

  constructor(http: HttpClient) {
    super('/api/tv-shows/:id', http);
  }
}
