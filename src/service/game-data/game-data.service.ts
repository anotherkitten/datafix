import { inject, Injectable } from '@angular/core';
import { GameData } from '../../model/game-data/game-data';
import { PopupService } from '../popup/popup.service';
import { interval, Subscription, Subject } from 'rxjs';
import { PopupMessage } from '../../model/popup-message/popup-message';
import { UpgradeService } from '../upgrade/upgrade.service';

const PROFILE_LOCATION: string = "save_profile";

@Injectable({
  providedIn: 'root'
})
export class GameDataService {
  $autosave: Subscription = interval(1e3 * 60 * 2).subscribe(() => this.saveData());
  $income: Subject<number> = new Subject();
  $money: Subject<number> = new Subject();
  popups: PopupService = inject(PopupService);
  upgrades: UpgradeService = inject(UpgradeService);
  
  data: GameData = new GameData();
  save_profile: String = "default";

  constructor() {
    this.loadProfile();
    this.loadData();
  }

  loadProfile() {
    this.save_profile = localStorage.getItem(PROFILE_LOCATION) || "default";
    localStorage.setItem(PROFILE_LOCATION, this.save_profile.toString());
  }

  changeProfile(profile: String) {
    this.save_profile = profile;
    this.loadData();
  }

  renameProfile(new_name: String): String | null {
    if (localStorage.getItem(`save_${new_name}`) != null) {
      console.error(`Profile with name ${new_name} already exists!`);
      return `Profile with name ${new_name} already exists!`;
    }

    localStorage.setItem(`save_${new_name}`, JSON.stringify(this.data));
    localStorage.removeItem(`save_${this.save_profile}`);

    localStorage.setItem(PROFILE_LOCATION, new_name.toString());
    this.save_profile = new_name;

    return null;
  }

  loadData() {
    const save_data = localStorage.getItem(`save_${this.save_profile}`);

    if (save_data != null) {
      try {
        const parsed_data = JSON.parse(save_data);
        this.data = new GameData(parsed_data as GameData);
        this.upgrades.purchases = this.data.upgrades;
      } catch (e) {
        console.error(e);
        console.error(`Save data corrupted! Stored bad data in corrupted_${this.save_profile}, creating new save on current profile.`);
        localStorage.setItem(`corrupted_${this.save_profile}`, save_data);
        this.data = new GameData();
      }
    } else {
      console.info(`Could not find data for profile ${this.save_profile}, creating new save.`);
      this.data = new GameData();
    }
  }

  saveData() {
    this.data.upgrades = this.upgrades._purchases;
    const save_data = JSON.stringify(this.data);

    console.info("Game saved!");
    this.popups.add(new PopupMessage('info', "Game has been saved."));
    localStorage.setItem(`save_${this.save_profile}`, save_data);
  }

  addMoney(amount: number) {
    this.data.money += amount;
    this.$income.next(amount);
    this.$money.next(this.data.money);
  }

  canSpend(amount: number) {
    return this.data.money >= amount;
  }

  spendMoney(amount: number) {
    if (this.canSpend(amount)) {
      this.data.money -= amount;
      this.$money.next(this.data.money);
    } else {
      this.popups.add(new PopupMessage('error', "Not enough money! (Shouldn't display)"));
      console.error("Money is being spent without checking first!");
    }
  }

  purchaseUpgrade(id: string) {
    const upgrade = this.upgrades.getUpgrade(id);
    const level = this.upgrades.upgradeLevel(id);

    if (!upgrade) {
      this.popups.add(new PopupMessage('error', `Upgrade with id (${id}) not found.`));
      return;
    }

    const cost = upgrade.cost(level);

    if (upgrade.atLimit(level)) {
      this.popups.add(new PopupMessage('error', `Upgrade already at limit!`));
      return;
    }

    if (!this.canSpend(cost)) {
      this.popups.add(new PopupMessage('error', `Insufficient funds!`));
      return;
    }

    this.spendMoney(cost);
    this.upgrades.buyUpgrade(upgrade);
  }
}
