import {Injectable, ModuleWithProviders} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {root} from 'rxjs/internal-compatibility';
import {AppModule} from './app.module';

export interface Position {
  ticker: string;
  cnt: number;
}

@Injectable({
  providedIn: root
})
export class PortfolioService {
  private portfolio: Position[] = [];
  private freeMoney = 0;
  private price;

  loadingPriceStocks = false;

  constructor(private http: HttpClient) {}

  init() {
    this.readFullPriceStocks();
    this.readFreeMoney();
    this.readPortfolio();
  }

  readFullPriceStocks() {
    this.http.get('assets/data/price.json').subscribe((data) => {
      this.price = data;
      this.loadingPriceStocks = true;
    });
  }

  getFullPriceStocks() {
    return this.price;
  }

  getCostStock(ticker: string, date: Date) {
    let key: string = date.getFullYear() + '-';

    if (date.getMonth() < 10) {
      key += '0' + date.getMonth();
    } else {
      key += date.getMonth();
    }
    key += '-';
    if (date.getDate() < 10) {
      key += '0' + date.getDate();
    } else {
      key += date.getDate();
    }
    console.log(key);
    return this.price[ticker][key];
  }

  readFreeMoney() {
    if (localStorage.getItem('freeMoney') == null) {
      this.freeMoney = 0;
    } else {
      this.freeMoney = Number(localStorage.freeMoney);
    }
    return;
  }

  readPortfolio() {
    if (localStorage.getItem('portfolio') == null) {
      return;
    }

    this.portfolio = JSON.parse(localStorage.portfolio);
    return;
  }

  addFreeMoney(delta: number) {
    this.freeMoney += delta;
    this.setFreeMoney();
  }

  setFreeMoney() {
    localStorage.setItem('freeMoney', JSON.stringify(this.freeMoney));
  }

  getFreeMoney(): number{
    console.log(this.freeMoney);
    return this.freeMoney;
  }

  setPortfolio() {
    localStorage.setItem('portfolio', JSON.stringify(this.portfolio));
  }

  getBalance(): number {
    let ans = this.freeMoney;

    for (const e of this.portfolio) {
      ans += e.cnt;
    }
    return ans;
  }

  getPortfolio(): Position[] {
    this.readPortfolio();
    return this.portfolio;
  }

  changePortfolio(ticker: string, cnt: number) {
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.portfolio.length; i++) {
      if (this.portfolio[i].ticker === ticker) {
        this.portfolio[i].cnt += cnt;
        if (this.portfolio[i].cnt === 0) {
          this.portfolio.splice(i, 1);
        }
        this.setPortfolio();
        return;
      }
    }
    this.portfolio.push({ticker, cnt});
    this.setPortfolio();
    return;
  }
}
