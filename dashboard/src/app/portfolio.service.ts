import {Injectable, ModuleWithProviders} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {root} from 'rxjs/internal-compatibility';
import {AppModule} from './app.module';

export interface Position {
  ticker: string;
  cnt: number;
  closeDate: string;
}

export interface Recommendation {
  type: number;
  ticker: string;
  cnt: number;
  confidence?: number;
  closeDate?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  private portfolio: Position[] = [];
  private freeMoney = 0;
  public price;
  public predicts;

  loadingPriceStocks = false;

  constructor(private http: HttpClient) {}

  init() {
    this.readFreeMoney();
    this.readPortfolio();
  }

  destroyFreeMoney() {
    this.freeMoney = 0;
    this.setFreeMoney();
  }

  getRecommendationsForDate(date: string): Recommendation[]{
    console.log(this.predicts);

    const risk = 'high';
    const interval = 30;
    const dateStr  = date;

    const data = this.predicts[risk][interval][dateStr];
    console.log(data);

    if (!data) {
      return [];
    }

    const rec: Recommendation[] = [];

    for (const e of data) {
      let type, ticker, cnt, confidence, closeDate;

      if (e[0] === 'BUY') {
        type = 1;
      }

      ticker = e[1];
      confidence = e[2];
      cnt = e[3] * 1 / 30;
      closeDate = e[5];

      rec.push({type, ticker, cnt, confidence, closeDate});
    }

    return rec;
  }

  dateToString(date: Date): string{
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
    return key;
  }

  readFullPriceStocks() {
    return this.http.get('assets/data/price.json');
  }

  readFullPredicts() {
    return this.http.get('assets/data/predicts.json');
  }

  getFullPriceStocks() {
    return this.price;
  }

  getCostStock(ticker: string, date: Date) {
    const key: string = this.dateToString(date);
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
    this.readFreeMoney();
    return this.freeMoney;
  }

  setPortfolio() {
    localStorage.setItem('portfolio', JSON.stringify(this.portfolio));
  }

  getBalance(date: Date): number {
    this.init();
    const dateStr = this.dateToString(date);
    let ans = this.freeMoney;

    for (const e of this.portfolio) {
      ans += e.cnt * this.getCostStock(e.ticker, date);
    }
    return ans;
  }

  getPortfolio(): Position[] {
    this.readPortfolio();
    return this.portfolio;
  }

  sellAllPortfolio(date: Date) {
    for (let i = 0; i < this.portfolio.length; i++) {
      const elem = this.portfolio[i];
      this.addFreeMoney(elem.cnt * this.getCostStock(elem.ticker, date));
    }

    while (this.portfolio.length > 0) {
      this.portfolio.splice(0, 1);
      this.setPortfolio();
    }

    return;
  }

  applyRecommendationToPortfolio(rec: Recommendation, date: Date) {
    console.log(rec);
    if (rec.type === 1) {
      const tmp: Position = {
        closeDate: rec.closeDate,
        ticker: rec.ticker,
        cnt: rec.cnt
      };
      const cost = rec.cnt * this.getCostStock(rec.ticker, date);
      this.addFreeMoney(-1 * cost);

      console.log('tmp = ', tmp);
      this.portfolio.push(tmp);
      console.log(this.portfolio);
      this.setPortfolio();
      console.log('\n');
    }

    if (rec.type === 2) {
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.portfolio.length; i++) {
        const elem = this.portfolio[i];
        if (elem.ticker === rec.ticker &&
          elem.ticker === rec.ticker) {

          this.addFreeMoney(elem.cnt * this.getCostStock(elem.ticker, date));
          this.portfolio.splice(i, 1);

          this.setPortfolio();
          return;
        }
      }
    }
  }
}
