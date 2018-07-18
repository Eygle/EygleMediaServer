import {FilesComponent} from './content/media/files/files.component';
import {HomeComponent} from './content/home/home.component';
import {CronComponent} from './content/admin-panel/cron/cron.component';
import {UsersComponent} from './content/admin-panel/users/users.component';
import {EPermission} from 'eygle-core/commons/core.enums';
import {MoviesComponent} from './content/media/movies/movies.component';
import {TvShowsComponent} from './content/media/tv-shows/tv-shows.component';
import {MovieComponent} from './content/media/movies/movie/movie.component';
import {eygleCoreRoutes, IRouteItem} from 'eygle-core/client/core-routes';
import {UserComponent} from './content/admin-panel/users/user/user.component';

let res: IRouteItem[] = [
  {
    path: '',
    component: HomeComponent,
    translate: 'HOME.TITLE',
    icon: 'home',
    access: EPermission.SeeHome,
    exactMatch: true
  },

  // Medias
  {
    path: 'movies',
    component: MoviesComponent,
    translate: 'MOVIES.TITLE',
    icon: 'movie',
    access: EPermission.SeeMovies,
    category: 'MEDIAS'
  },
  {
    path: 'movies/:id',
    component: MovieComponent,
    access: EPermission.SeeMovies
  },
  {
    path: 'tv-shows',
    component: TvShowsComponent,
    translate: 'TV_SHOWS.TITLE',
    icon: 'tv',
    access: EPermission.SeeTVShows,
    category: 'MEDIAS'
  },
  {
    path: 'files',
    component: FilesComponent,
    translate: 'FILES.TITLE',
    icon: 'perm_media',
    access: EPermission.SeeFiles,
    category: 'MEDIAS'
  },

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
    path: 'admin/users/:id',
    component: UserComponent,
    access: EPermission.SeeUsers
  },
  {
    path: 'admin/cron',
    component: CronComponent,
    translate: 'ADMIN_PANEL.CRON.TITLE',
    icon: 'schedule',
    access: EPermission.ManageCron,
    category: 'ADMIN_PANEL'
  }
];

res = res.concat(<any>eygleCoreRoutes);

export const routes = res;
