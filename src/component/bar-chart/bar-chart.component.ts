import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Bar } from '../../model/bar-chart/bar';
import { BarChart } from '../../model/bar-chart/bar-chart';
import { NgForOf } from "../../../node_modules/@angular/common";
import { filter, interval, Subscription, timer } from 'rxjs';
import { GameDataService } from '../../service/game-data/game-data.service';
import { UpgradeService } from '../../service/upgrade/upgrade.service';

const BAR_HOR_MARGIN = 16;
const MAX_BAR_WIDTH = 50;
const MAX_CHART_WIDTH = 800;

@Component({
	selector: 'app-bar-chart',
	imports: [NgForOf],
	templateUrl: './bar-chart.component.html',
	styleUrl: './bar-chart.component.css'
})
export class BarChartComponent implements OnInit, OnDestroy {
	chart: BarChart = new BarChart();
	game: GameDataService = inject(GameDataService);
	upgrades: UpgradeService = inject(UpgradeService);
	$finished: Subscription | null = null;
	$purchase_expansion: Subscription | null = null;
	$purchase_automation: Subscription | null = null;
	$automation: Subscription | null = null;
	timer_bar_speed: number = 13;

	ngOnInit() {
		this.chart.size = this.upgrades.getChartSize();
		this.chart.initChart();

		this.$finished = this.chart.$finished.subscribe(() => this.onChartFinished());
		this.$purchase_expansion = this.upgrades.$purchase.pipe(filter(p => p[0] === 'chart-expansion')).subscribe(() => { if (!this.chart.sorted) this.updateSizeAndInit() });
		this.$purchase_automation = this.upgrades.$purchase.pipe(filter(p => p[0] === 'automation')).subscribe(() => this.initAutomation());
		
		this.initAutomation();
	}

	ngOnDestroy() {
		this.$finished?.unsubscribe();
		this.$purchase_expansion?.unsubscribe();
		this.$purchase_automation?.unsubscribe();
	}

	chartWidth() {
		return Math.min((BAR_HOR_MARGIN + MAX_BAR_WIDTH) * this.chart.size, MAX_CHART_WIDTH);
	}

	barWidth() {
		if (this.chartWidth() < MAX_CHART_WIDTH) return MAX_BAR_WIDTH;
		return Math.max((MAX_CHART_WIDTH / this.chart.size) - BAR_HOR_MARGIN, 16);
	}

	barLeft(bar: Bar) {
		return bar.position * (BAR_HOR_MARGIN + this.barWidth());
	}

	clickBar(bar: Bar) {
		if (this.chart.sorted) return;

		this.chart.swapBar(bar);
	}

	updateSizeAndInit() {
		this.chart.size = this.upgrades.getChartSize();
		this.chart.initChart();
	}

	onChartFinished() {
		this.game.addMoney(this.chartPayout());
		timer(this.upgrades.getChartTimer()).subscribe(() => this.updateSizeAndInit());
		this.timer_bar_speed = this.upgrades.getChartTimer() / 1e3;
	}

	chartPayout() {
		return [25,40,75,120, 180,300,500,800, 1250,2000,3000,4500, 7500,15000,50000,250000][this.chart.size-5];
	}

	initAutomation() {
		const automation = this.upgrades.upgradeLevel('automation');

		if (this.$automation) {
			this.$automation.unsubscribe();
			this.$automation = null;
		}

		if (automation) {
			this.$automation = interval(3300 - automation * 300).subscribe(() => this.autoSort());
		}
	}

	autoSort() {
		if (this.chart.sorted) return;

		const bestSwap = this.chart.findBestSwap();
		if (bestSwap) this.chart.swapBar(bestSwap, this.upgrades.getBarSwapDistance());
	}
}
