import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {PortfolioService} from './portfolio.service';


@Injectable()
export class PriceResolver implements Resolve<any> {
  constructor(private portfolioService: PortfolioService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<void> {
    return new Observable(observer => {
      this.portfolioService.readFullPriceStocks().subscribe((data) => {
        this.portfolioService.price = data;
        observer.next();
        observer.complete();
      });
    });
  }
}

@Injectable()
export class PredictResolver implements Resolve<any> {
  constructor(private portfolioService: PortfolioService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<void> {
    return new Observable(observer => {
      this.portfolioService.readFullPredicts().subscribe((data) => {
        this.portfolioService.predicts = data;
        observer.next();
        observer.complete();
      });
    });
  }
}
