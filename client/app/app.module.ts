import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from "@angular/common/http";
import {
  MatButtonModule,
  MatCheckboxModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatSidenavModule,
  MatToolbarModule,
  MatTooltipModule
} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TranslateModule} from '@ngx-translate/core';
import {FlexLayoutModule} from '@angular/flex-layout';

import {AppComponent} from './app.component';
import {FilesComponent} from './files/files.component';
import {AppRoutingModule} from './app-routing.module';
import {SidenavComponent} from './sidenav/sidenav.component';
import {LoginComponent} from './auth/login/login.component';
import {ConfigService} from "./services/config.service";
import {AuthService} from "./services/auth.service";

@NgModule({
  declarations: [
    AppComponent,
    SidenavComponent,
    FilesComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    TranslateModule.forRoot(),
    FormsModule,

    MatToolbarModule, MatSidenavModule,
    MatButtonModule, MatCheckboxModule, MatInputModule, MatFormFieldModule,
    MatIconModule, MatTooltipModule
  ],
  providers: [
    ConfigService,
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
