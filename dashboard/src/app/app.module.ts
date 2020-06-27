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
import { MainComponent } from './main/main.component';
import {PredictResolver, PriceResolver} from './resolvers';
import { NgxEchartsModule } from 'ngx-echarts';

/**
 * This will import all modules from echarts.
 * If you only need custom modules,
 * please refer to [Custom Build] section.
 */
import * as echarts from 'echarts';

@NgModule({
  declarations: [
    AppComponent,
    LeftMenuComponent,
    MainLayoutComponent,
    RightMenuComponent,
    MainComponent,
  ],
  imports: [
    NgxEchartsModule.forRoot({
      echarts,
    }),
    MaterialModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    PortfolioModule.forRoot(),
  ],
  providers: [
    PriceResolver,
    PredictResolver
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

}
