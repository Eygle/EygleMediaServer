import {Component} from '@angular/core';
import {ConfigService} from '../../services/config.service';
import {AuthService} from '../../services/auth.service';
import {User} from '../../../../commons/models/user';

@Component({
  selector: 'ems-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  /**
   * User name input
   */
  username: string;

  /**
   * Password input
   */
  password: string;

  constructor(private config: ConfigService, private auth: AuthService) {
    this.config.setSettings({
      layout: {
        navbar: false,
        toolbar: false
      }
    });
  }

  /**
   * Login action
   */
  public logIn(event: Event) {
    event.preventDefault();
    this.auth.logIn(this.username, this.password)
      .subscribe((user: User) => {
        console.log(user);
      });
  }
}
