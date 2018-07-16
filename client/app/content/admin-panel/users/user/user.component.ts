import {Component, OnInit} from '@angular/core';
import {UsersService} from "../../../../services/users.service";
import {ActivatedRoute} from "@angular/router";
import {User} from "eygle-core/commons/models/User";
import {ConfigService} from "eygle-core/client/services/config.service";
import {AuthService} from "eygle-core/client/services/auth.service";
import Utils from "eygle-core/commons/utils/Utils";
import {FormControl} from "@angular/forms";

@Component({
  selector: 'ems-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  /**
   * User instance
   */
  public user: User;

  /**
   * Is loading
   */
  public isLoading: boolean;

  /**
   * List of roles
   */
  public roles: string[];

  public selectedRoles: FormControl;

  constructor(private users: UsersService, private auth: AuthService, private config: ConfigService, private route: ActivatedRoute) {
    this.config.setSettings({
      layout: {
        navbar: true,
        toolbar: false
      }
    });
    this.isLoading = true;
    this.roles = Utils.roles;
    this.selectedRoles = new FormControl();
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.users.getById(id)
      .subscribe((res: User) => {
        this.isLoading = false;
        this.user = res;
      });
  }
}
