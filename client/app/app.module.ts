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

import {AppComponent} from './app.component';
import {FilesComponent} from './content/medias/files/files.component';
import {AppRoutingModule} from './app-routing.module';
import {SidenavComponent} from './content/sidenav/sidenav.component';
import {LoginComponent} from './content/auth/login/login.component';
import {ConfigService} from './services/config.service';
import {CronService} from './content/admin-panel/cron/cron.service';
import {AuthService} from './services/auth.service';
import {FilesService} from './content/medias/files/files.service';
import {FormatSizePipe} from './pipes/format-size.pipe';
import {UrlsModalComponent} from './content/medias/files/modals/urls-modal/urls-modal.component';
import {KeyEventsDirective} from './directives/key-events.directive';
import {RegisterComponent} from './content/auth/register/register.component';
import {HomeComponent} from './content/home/home.component';
import {CronComponent} from './content/admin-panel/cron/cron.component';
import {UsersComponent} from './content/admin-panel/users/users.component';
import {UsersService} from './services/users.service';
import {MoviesComponent} from './content/medias/movies/movies.component';
import {MoviesService} from './content/medias/movies/movies.service';
import {TvShowsComponent} from './content/medias/tv-shows/tv-shows.component';
import {TvShowsService} from "./content/medias/tv-shows/tv-shows.service";
import {MovieComponent} from './content/medias/movies/movie/movie.component';
import {MediaListComponent} from './components/media-list/media-list.component';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  declarations: [
    AppComponent,
    SidenavComponent,
    FilesComponent,
    MoviesComponent,
    LoginComponent,
    UrlsModalComponent,
    FormatSizePipe,
    KeyEventsDirective,
    RegisterComponent,
    HomeComponent,
    CronComponent,
    UsersComponent,
    TvShowsComponent,
    MovieComponent,
    MediaListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    TranslateModule.forRoot(),
    FormsModule,
    PerfectScrollbarModule,

    MatToolbarModule, MatSidenavModule,
    MatButtonModule, MatCheckboxModule, MatInputModule, MatFormFieldModule,
    MatIconModule, MatTooltipModule,
    MatTableModule, MatSortModule,
    MatProgressSpinnerModule,
    MatDialogModule
  ],
  entryComponents: [UrlsModalComponent],
  providers: [
    AuthService,
    ConfigService,
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
