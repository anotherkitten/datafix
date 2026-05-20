import { Component } from '@angular/core';
import { GameData } from '../model/game-data/game-data';
import { PopupShelfComponent } from "../component/popup-shelf/popup-shelf.component";
import { BarChartComponent } from "../component/bar-chart/bar-chart.component";
import { MoneyDisplayComponent } from '../component/money-display/money-display.component';
import { UpgradeShelfComponent } from "../component/upgrade-shelf/upgrade-shelf.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [PopupShelfComponent, BarChartComponent, MoneyDisplayComponent, UpgradeShelfComponent]
})
export class AppComponent {
  title = 'increment';
}
