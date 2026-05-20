import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { GameDataService } from '../../service/game-data/game-data.service';
import { interval, Subscription } from 'rxjs';
import { NgForOf } from "../../../node_modules/@angular/common";

class IncomeDisplay {
  amount: number;
  created: number = Date.now()

  constructor(amount: number) {
    this.amount = amount;
  }
}

@Component({
  selector: 'app-money-display',
  imports: [NgForOf],
  templateUrl: './money-display.component.html',
  styleUrl: './money-display.component.css'
})
export class MoneyDisplayComponent implements OnInit, OnDestroy {
  game_data: GameDataService = inject(GameDataService);
  income_displays: IncomeDisplay[] = [];
  $purge: Subscription = interval(1e3).subscribe(() => this.purgeDisplays());
  $income: Subscription | null = null;
  $money: Subscription | null = null;

  current_money: number = 0;
  target_money: number = 0;
  money_updated: number = 0;
  display_money: number = 0;

  ngOnInit() {
    this.$income = this.game_data.$income.subscribe(amount => this.displayIncome(amount));
    this.$money = this.game_data.$money.subscribe(new_money => this.updateMoney(new_money));

    this.current_money = this.game_data.data.money;
    this.target_money = this.current_money;
    this.display_money = this.current_money;

    interval(100).subscribe(() => this.display_money = this.moneyDisplayVal());
  }

  ngOnDestroy() {
    this.$purge.unsubscribe();
    this.$income?.unsubscribe();
    this.$money?.unsubscribe();
  }

  moneyDisplayVal() {
    const delta = this.target_money - this.current_money;
    const easedTime = 1 - Math.pow(1 - this.timeSinceUpdate(), 2);
    return Math.ceil(this.current_money + delta * easedTime);
  }

  updateMoney(new_money: number) {
    this.current_money = this.moneyDisplayVal();
    this.target_money = new_money;
    this.money_updated = Date.now();
  }

  displayIncome(amount: number) {
    this.income_displays.push(new IncomeDisplay(amount));
  }

  purgeDisplays() {
    this.income_displays = this.income_displays.filter(i => Date.now() - i.created < 4e3);
  }

  timeSinceUpdate() {
    return Math.max(Math.min((Date.now() - this.money_updated)/1e3, 1), 0);
  }
}
