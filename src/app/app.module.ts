import { NgModule } from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import {
  HTTP_INTERCEPTORS,
  HttpClientModule,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { PublicModule } from './public/public.module';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {NgxSpinnerModule} from 'ngx-spinner';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    HttpClientModule,
    PaginationModule.forRoot(),
    PublicModule,
    NgxSpinnerModule
  ],
  providers: [
    provideClientHydration(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
