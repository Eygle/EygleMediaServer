import {Injectable} from '@angular/core';
import {AuthService} from "./auth.service";
import {EPermission} from "../../../commons/core/core.enums";

@Injectable()
export class UsersService {

  constructor(private auth: AuthService) {
  }

  /**
   * Get users list as admin
   * @returns {null}
   */
  getAllAsAdmin() {
    if (!this.auth.authorize(EPermission.SeeUsers)) {
      return null;
    }


  }
}
