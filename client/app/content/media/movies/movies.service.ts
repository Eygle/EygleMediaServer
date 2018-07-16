import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import {HttpClient} from '@angular/common/http';
import {ApiService} from 'eygle-core/client/services/api.service';

@Injectable()
export class MoviesService extends ApiService {

  constructor(http: HttpClient) {
    super('/api/movies/:id', http);
  }
}
