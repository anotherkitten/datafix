import { inject, Injectable } from '@angular/core';
import { Upgrade } from '../../model/upgrade/upgrade';
import { Subject } from 'rxjs';

const UPGRADES: Upgrade[] = [
    new Upgrade('chart-refresh', 'Faster Charts', 'New chart assignments come in faster', 10,
      [50, 75, 100, 150, 250, 400, 650, 1000, 2000, 5000],
      (level) => level == 11 ? `New chart assignments arrive 10 seconds faster.` :
        `New chart assignments arrive ${level - 1} (${level}) second${level !== 1 ? 's' : ''} faster.`
    ),
    new Upgrade('chart-expansion', 'More Bars', 'More bars on each chart', 15,
      [150, 250, 450, 700, 1200, 1750, 2500, 4000, 7500, 15000, 30000, 80000, 200000, 1000000, 5000000],
      (level) => level == 16 ? `Charts have 15 extra bars of data, making them worth more money.` :
        `Charts have ${level - 1} (${level}) extra bar${level !== 1 ? 's' : ''} of data, making them worth more money.`
    ),
    new Upgrade('automation', 'Automation', 'Run a script to sort the bars for you', 10,
      [1000, 1250, 1500, 1750, 2000, 2500, 3000, 4000, 6500, 10000],
      (level) => level == 1 ? `Automatically move the tallest unsorted bar right every 3 seconds.` :
        level == 11 ? `Automatically move the tallest unsorted bar right every .3 seconds.` :
        `Automatically move the tallest unsorted bar right every ${(36 - level * 3) / 10} (${(33 - level * 3) / 10}) seconds.`
    ),
    new Upgrade('better-swap', 'Improved Algorithms', 'Automatic swaps ', 4,
      [2000, 3000, 5000, 10000],
      (level) => level == 1 ? `Your automatic swaps can span across an additional bar.` :
        level == 11 ? `Your automatic swaps can span across ${level} (${level + 1}) bars.` :
        `Your automatic swaps can span across 5 bars.`
    ),
]

type PurchaseDict = { [key: string]: number }

@Injectable({
  providedIn: 'root'
})
export class UpgradeService {
  _purchases: PurchaseDict = Object.fromEntries(UPGRADES.map(u => [u.id, 0]));
  $purchase: Subject<[string, number]> = new Subject();

  set purchases(purchases: PurchaseDict) {
    for (let key of Object.keys(purchases)) {
      const purchase_upgrade = this.getUpgrade(key);

      if (purchase_upgrade) {
        this._purchases[key] = Math.max(Math.min(purchases[key], purchase_upgrade.level_limit), 0);
      }
    }
  }

  constructor() { }

  getUpgrades(): Upgrade[] {
    return UPGRADES;
  }

  getUpgrade(id: string): Upgrade | undefined {
    return UPGRADES.find(u => u.id === id);
  }

  upgradeLevel(id: string): number {
    return this._purchases[id] || 0;
  }

  buyUpgrade(upgrade: Upgrade) {
    const level = this.upgradeLevel(upgrade.id);
    const new_level = Math.min(level + 1, upgrade!.level_limit);

    this._purchases[upgrade.id] = new_level;
    this.$purchase.next([upgrade.id, new_level]);
  }


  // Upgrade-dependent value gets
  getChartTimer() {
    return 1e3 * (12 - this.upgradeLevel('chart-refresh'));
  }

  getChartSize() {
    return 5 + this.upgradeLevel('chart-expansion');
  }

  getBarSwapDistance() {
    return 1 + this.upgradeLevel('better-swap');
  }
}
