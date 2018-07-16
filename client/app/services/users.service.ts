import {Injectable} from '@angular/core';
import {EPermission} from 'eygle-core/commons/core.enums';
import {Observable} from 'rxjs/Observable';
import {HttpClient} from '@angular/common/http';
import {AuthService} from 'eygle-core/client/services/auth.service';
import {ApiService} from 'eygle-core/client/services/api.service';
import {ApiRoute} from 'eygle-core/client/utils/api-route';

@Injectable()
export class UsersService extends ApiService {

  /**
   * Admin api
   */
  private _adminApi: ApiRoute;

  constructor(private auth: AuthService, http: HttpClient) {
    super('/api/users/:id', http);
    this._adminApi = new ApiRoute(http, '/api/admin/users/:id');
  }

  /**
   * Get users list as admin
   * @returns {null}
   */
  getAllAsAdmin() {
    if (!this.auth.authorize(EPermission.SeeUsers)) {
      return new Observable();
    }

    return this._adminApi.get();
  }
}
