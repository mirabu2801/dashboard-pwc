import { BrowserModule } from '@angular/platform-browser';
import {ModuleWithProviders, NgModule} from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LeftMenuComponent } from './left-menu/left-menu.component';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { RightMenuComponent } from './right-menu/right-menu.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MaterialModule} from './material-module';
import {ReactiveFormsModule} from '@angular/forms';
import {PortfolioModule} from './portfolio/portfolio.module';

@NgModule({
  declarations: [
    AppComponent,
    LeftMenuComponent,
    MainLayoutComponent,
    RightMenuComponent,
  ],
  imports: [
    MaterialModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    PortfolioModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {

}
