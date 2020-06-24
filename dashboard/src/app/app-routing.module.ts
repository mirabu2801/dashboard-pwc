import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MainComponent} from './main/main.component';
import {PriceResolver} from './resolvers';


const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    resolve: {
      data: PriceResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
