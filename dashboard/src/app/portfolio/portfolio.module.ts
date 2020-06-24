import {ModuleWithProviders, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {PortfolioService} from '../portfolio.service';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [],
})
export class PortfolioModule {
  static forRoot(): ModuleWithProviders{
    return {
      ngModule: PortfolioModule,
      providers: [
        PortfolioService
      ]
    };
  }
}
