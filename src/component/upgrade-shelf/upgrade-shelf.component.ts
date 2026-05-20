import { Component, inject } from '@angular/core';
import { UpgradeService } from '../../service/upgrade/upgrade.service';
import { NgForOf } from "../../../node_modules/@angular/common";
import { GameDataService } from '../../service/game-data/game-data.service';
import { Upgrade } from '../../model/upgrade/upgrade';

@Component({
  selector: 'app-upgrade-shelf',
  imports: [NgForOf],
  templateUrl: './upgrade-shelf.component.html',
  styleUrl: './upgrade-shelf.component.css'
})
export class UpgradeShelfComponent {
  upgrade_service: UpgradeService = inject(UpgradeService);
  game: GameDataService = inject(GameDataService);

  canBuy(upgrade: Upgrade) {
    const level = this.upgrade_service.upgradeLevel(upgrade.id);
    return !upgrade.atLimit(level) && this.game.canSpend(upgrade.cost(level));
  }
}
