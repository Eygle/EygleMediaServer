import * as _ from 'underscore';
import {Component} from '@angular/core';

import {AuthService} from '../../services/auth.service';
import {IRouteItem, routes} from '../../routes';

@Component({
  selector: 'ems-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent {

  navItems: [{ label?: string, items: [IRouteItem] }];

  constructor(private Auth: AuthService) {
    this._generateMenu();
  }

  /**
   * Generate menu from routes list
   * @private
   */
  private _generateMenu() {
    this.navItems = [
      {
        label: undefined,
        items: <[IRouteItem]>[]
      }
    ];

    for (const item of routes) {
      if (item.icon && item.translate && this.Auth.authorize(item.access)) {
        item.url = `/${item.path}`;
        if (item.category) {
          const cat = _.find(this.navItems, (it) => {
            return it.label === item.category;
          });

          if (cat) {
            cat.items.push(item);
          } else {
            this.navItems.push({
              label: item.category,
              items: [item]
            });
          }

        } else {
          this.navItems[0].items.push(item);
        }
      }
    }
  }
}
