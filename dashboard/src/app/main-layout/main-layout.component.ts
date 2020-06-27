import {Component, ModuleWithProviders, OnInit, ViewChild} from '@angular/core';
import { HttpClient} from '@angular/common/http';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import { EChartOption } from 'echarts';

import {FormControl} from '@angular/forms';
import {PortfolioService, Position, Recommendation} from '../portfolio.service';
import {AppModule} from '../app.module';


@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent implements OnInit {
  constructor(private portfolioService: PortfolioService){}

  date = new FormControl(new Date(2020, 3, 19));

  get graphData() {
    //console.log(Object.values(this.portfolioService.price.APA));
    const data = {
      data: Object.values(this.portfolioService.price.APA).reverse(),
      days: Object.keys(this.portfolioService.price.APA).reverse(),
    };
    return data;
  }
  get chartOption(): EChartOption {
    const data = this.graphData;
    //console.log(data.days[data.days.length - 1]);
    let min;
    for (const x of data.days) {
      if (x.split('-')[0] === '2019') {
        //console.log(x);
        min = x;
        break;
      }
    }
    console.log(min);
    return {
      xAxis: {
        type: 'category',
        data: data.days,
        min,
        max: data.days[data.days.length - 1],
        splitLine: {
          show: false
        },
        boundaryGap: ['0', '100%']
      },
      yAxis: {
        type: 'value',
      },
      series: [{
        type: 'line',
        data: data.data,
        areaStyle: {}
      }]
    } as EChartOption;
  }
  displayedColumns = ['ticker', 'cnt', 'cost'];
  portfolio: Position[] = [
    {
      ticker: 'Загрузка...',
      cnt: 0,
      closeDate: '123'
    },
  ];

  rec: Recommendation[] = [
     {
       type: 1,
       ticker: 'APL',
       cnt: 345
     },
     {
       type: 3,
       ticker: 'TTM',
       cnt: 234
     },
     {
       type: 2,
       ticker: 'FCB',
       cnt: 123
    },
  ];

  makingRecommendations() {
    this.rec = [];

    const myPortfolio = this.portfolioService.getPortfolio();
    console.log(myPortfolio);

    const todayStr = this.portfolioService.dateToString(this.date.value);
    console.log(todayStr);

    for (const elem of myPortfolio) {
      if (elem.closeDate === todayStr) {
        this.rec.push({
          type: 2,
          ticker: elem.ticker,
          cnt: elem.cnt,
        });
      }
    }

    const recDate = this.portfolioService.getRecommendationsForDate(todayStr);

    for (const elem of recDate) {
      const type = elem.type === 1 ? 1 : 3;

      let cnt = this.portfolioService.getBalance(this.date.value);
      console.log("Баланс :", cnt);
      cnt = cnt * elem.cnt / this.portfolioService.getCostStock(elem.ticker, this.date.value);

      let ok = 1;

      for (const myPos of this.portfolio) {
        console.log(elem, myPos);
        if (myPos.ticker === elem.ticker &&
        myPos.closeDate === elem.closeDate) {
          ok = 0;
          break;
        }
      }

      if (!ok) {
        continue;
      }

      this.rec.push({
        type,
        ticker: elem.ticker,
        cnt,
        confidence: elem.confidence,
        closeDate: elem.closeDate
      });
    }
    return;
  }

  @ViewChild('shoes') checkRecommendList;

  applySelectedRecommendations() {
    console.log(this.checkRecommendList._value);
    for (const idx of this.checkRecommendList._value) {
      console.log(idx);
      this.portfolioService.applyRecommendationToPortfolio(this.rec[idx], this.date.value);
    }
    this.portfolio = this.portfolioService.getPortfolio();
    this.makingRecommendations();
  }

  onChanged(increased: any){
    //console.log(increased);
    console.log(this.checkRecommendList);
  }

  convertCnt(ticker: string, cnt: number): number {
    const dd = new Date(this.date.value);
    return this.portfolioService.getCostStock(ticker, dd);
  }

  ngOnInit(){
    this.portfolioService.init();
    this.portfolio = this.portfolioService.getPortfolio();
    /*setTimeout(() => {
      const dd = new Date(2020, 3, 19);
      const arr = this.portfolioService.getCostStock('APA', dd);

      console.log(this.portfolioService.getPortfolio());
    }, 10000);*/
  }
}
