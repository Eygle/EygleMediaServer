import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatProgressSpinnerModule,
  MatSelectModule,
  MatSidenavModule,
  MatSortModule,
  MatTableModule,
  MatToolbarModule,
  MatTooltipModule
} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TranslateModule} from '@ngx-translate/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {CookieService} from 'ngx-cookie-service';
import {PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
import {SlickModule} from 'ngx-slick';

import {AppComponent} from './app.component';
import {FilesComponent} from './content/media/files/files.component';
import {AppRoutingModule} from './app-routing.module';
import {CronService} from './content/admin-panel/cron/cron.service';
import {FilesService} from './content/media/files/files.service';
import {FormatSizePipe} from './pipes/format-size.pipe';
import {UrlsModalComponent} from './content/media/files/modals/urls-modal/urls-modal.component';
import {KeyEventsDirective} from './directives/key-events.directive';
import {HomeComponent} from './content/home/home.component';
import {CronComponent} from './content/admin-panel/cron/cron.component';
import {UsersComponent} from './content/admin-panel/users/users.component';
import {UsersService} from './services/users.service';
import {MoviesComponent} from './content/media/movies/movies.component';
import {MoviesService} from './content/media/movies/movies.service';
import {TvShowsComponent} from './content/media/tv-shows/tv-shows.component';
import {TvShowsService} from './content/media/tv-shows/tv-shows.service';
import {MovieComponent} from './content/media/movies/movie/movie.component';
import {MediaComponent} from './components/media/media.component';
import {EygleCoreModule} from 'eygle-core/client/core.module';
import {AuthService} from 'eygle-core/client/services/auth.service';
import {UserComponent} from './content/admin-panel/users/user/user.component';
import {SlickPaginatorComponent} from './components/slick-paginator/slick-paginator.component';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  declarations: [
    AppComponent,
    FilesComponent,
    MoviesComponent,
    UrlsModalComponent,
    FormatSizePipe,
    KeyEventsDirective,
    HomeComponent,
    CronComponent,
    UsersComponent,
    TvShowsComponent,
    MovieComponent,
    MediaComponent,
    UserComponent,
    // SlickComponent,
    SlickPaginatorComponent
  ],
  imports: [
    BrowserModule,
    EygleCoreModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    TranslateModule.forRoot(),
    FormsModule,
    PerfectScrollbarModule,
    SlickModule.forRoot(),

    MatToolbarModule, MatSidenavModule,
    MatButtonModule, MatCheckboxModule, MatInputModule, MatFormFieldModule, MatSelectModule,
    MatIconModule, MatTooltipModule,
    MatTableModule, MatSortModule,
    MatProgressSpinnerModule,
    MatDialogModule
  ],
  entryComponents: [UrlsModalComponent],
  providers: [
    AuthService,
    CookieService,
    CronService,
    FilesService,
    MoviesService,
    TvShowsService,
    UsersService,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
