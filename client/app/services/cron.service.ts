import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import {CronJob} from "../../../commons/core/models/CronJob";
import {ECronJobAction} from "../../../commons/core/core.enums";

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json;charset=UTF-8'}),
  responseType: 'text'
};

@Injectable()
export class CronService {
  /**
   * Api url
   */
  private _api: string;

  constructor(private http: HttpClient) {
    this._api = '/api/admin/cron'
  }

  getAll(): Observable<[CronJob]> {
    return this.http.get<[CronJob]>(this._api);
  }

  run(job: CronJob): Observable<void> {
    return this.http.post<void>(this._api, {
      action: ECronJobAction.Run,
      job: job.name
    }, <{}>httpOptions);
  }

  schedule(job: CronJob): Observable<void> {
    return this.http.post<void>(this._api, {
      action: ECronJobAction.Schedule,
      job: job.name
    }, <{}>httpOptions);
  }

  unSchedule(job: CronJob): Observable<void> {
    return this.http.post<void>(this._api, {
      action: ECronJobAction.UnSchedule,
      job: job.name
    }, <{}>httpOptions);
  }
}
