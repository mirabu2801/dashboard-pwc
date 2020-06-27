import { Component, OnInit } from '@angular/core';
import {PortfolioService} from '../portfolio.service';

@Component({
  selector: 'app-right-menu',
  templateUrl: './right-menu.component.html',
  styleUrls: ['./right-menu.component.scss']
})
export class RightMenuComponent implements OnInit {

  constructor(private portfolioService: PortfolioService) { }

  balance = 0;

  updateInfo() {
    this.portfolioService.readFreeMoney();
    this.balance = this.portfolioService.getFreeMoney();
  }

  ngOnInit(): void {
    this.updateInfo();
  }

  addBalance(delta: number) {
    this.portfolioService.addFreeMoney(100);
    this.balance = this.portfolioService.getFreeMoney();
  }
}
