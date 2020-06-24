import {Component, ModuleWithProviders, OnInit} from '@angular/core';
import { HttpClient} from '@angular/common/http';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import { EChartOption } from 'echarts';

import {FormControl} from '@angular/forms';
import {PortfolioService, Position} from '../portfolio.service';
import {AppModule} from '../app.module';

export interface Recommendation {
  type: number;
  ticker: string;
  cnt: number;
}

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent implements OnInit {
  constructor(private portfolioService: PortfolioService){}

  date = new FormControl(new Date(2020, 3, 19));

  get graphData() {
    console.log(Object.values(this.portfolioService.price.APA));
    const data = {
      data: Object.values(this.portfolioService.price.APA).reverse(),
      days: Object.keys(this.portfolioService.price.APA).reverse(),
    };
    return data;
  }
  get chartOption(): EChartOption {
    const data = this.graphData;
    console.log(data.days[data.days.length - 1]);
    let min;
    for (const x of data.days) {
      if (x.split('-')[0] === '2019') {
        console.log(x);
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
      cnt: 0
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

  convertCnt(ticker: string, cnt: number): number {
    const dd = new Date(this.date.value);
    return this.portfolioService.getCostStock(ticker, dd);
  }

  ngOnInit(){
    this.portfolioService.init();
    setTimeout(() => {
      const dd = new Date(2020, 3, 19);
      const arr = this.portfolioService.getCostStock('APA', dd);

      this.portfolio = this.portfolioService.getPortfolio();
      console.log(this.portfolioService.getPortfolio());
    }, 10000);
  }
}
