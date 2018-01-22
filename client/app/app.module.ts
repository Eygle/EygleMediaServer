import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {
  MatButtonModule,
  MatCheckboxModule,
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
import {FilesComponent} from './files/files.component';
import {AppRoutingModule} from './app-routing.module';
import {SidenavComponent} from './sidenav/sidenav.component';
import {LoginComponent} from './auth/login/login.component';
import {ConfigService} from './services/config.service';
import {AuthService} from './services/auth.service';
import {FilesService} from './services/files.service';
import {FormatSizePipe} from './pipes/format-size.pipe';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  declarations: [
    AppComponent,
    SidenavComponent,
    FilesComponent,
    LoginComponent,
    FormatSizePipe
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
    MatProgressSpinnerModule
  ],
  providers: [
    ConfigService,
    AuthService,
    FilesService,
    CookieService,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
