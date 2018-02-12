import {FilesComponent} from "./content/medias/files/files.component";
import {LoginComponent} from "./content/auth/login/login.component";
import {HomeComponent} from "./content/home/home.component";
import {RegisterComponent} from "./content/auth/register/register.component";
import {EPermission} from "../../commons/core/core.enums";
import {CronComponent} from "./content/admin-panel/cron/cron.component";
import {UsersComponent} from "./content/admin-panel/users/users.component";

export const routes: [IRouteItem] = [
  {
    path: '',
    component: HomeComponent,
    translate: 'HOME.TITLE',
    icon: 'home',
    access: EPermission.SeeHome,
    exactMatch: true
  },

  // Medias
  // {
  //   path: 'movies',
  //   component: HomeComponent,
  //   translate: 'MOVIES.TITLE',
  //   icon: 'movie',
  //   access: EPermission.SeeMovies,
  //   category: 'MEDIAS'
  // },
  // {
  //   path: 'tv-shows',
  //   component: HomeComponent,
  //   translate: 'TV_SHOWS.TITLE',
  //   icon: 'tv',
  //   access: EPermission.SeeTVShows,
  //   category: 'MEDIAS'
  // },
  {
    path: 'files',
    component: FilesComponent,
    translate: 'FILES.TITLE',
    icon: 'perm_media',
    access: EPermission.SeeFiles,
    category: 'MEDIAS'
  },

  // Profile
  // {
  //   path: 'account',
  //   component: HomeComponent,
  //   translate: 'ACCOUNT.TITLE',
  //   icon: 'account_circle',
  //   access: EPermission.SeeAccount,
  //   category: 'PROFILE'
  // },
  // {
  //   path: 'settings',
  //   component: HomeComponent,
  //   translate: 'SETTINGS.TITLE',
  //   icon: 'settings',
  //   access: EPermission.SeeSettings,
  //   category: 'PROFILE'
  // },

  // Admin panel
  {
    path: 'admin/users',
    component: UsersComponent,
    translate: 'ADMIN_PANEL.USERS.TITLE',
    icon: 'supervisor_account',
    access: EPermission.SeeUsers,
    category: 'ADMIN_PANEL'
  },
  {
    path: 'admin/cron',
    component: CronComponent,
    translate: 'ADMIN_PANEL.CRON.TITLE',
    icon: 'schedule',
    access: EPermission.ManageCron,
    category: 'ADMIN_PANEL'
  },

  // Auth
  {path: 'auth/login', component: LoginComponent},
  {path: 'auth/register', component: RegisterComponent},
];

export interface IRouteItem {
  path: string;
  component: any;

  translate?: string;
  icon?: string;
  category?: string;
  access?: EPermission;
  exactMatch?: boolean;
  url?: string;
}
