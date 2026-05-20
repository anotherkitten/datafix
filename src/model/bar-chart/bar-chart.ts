import { Observable, Subject } from "rxjs";
import { Bar } from "./bar";

export class BarChart {
	bars: Bar[] = [];
	size: number = 5;
	sorted: boolean = false;
	hide: boolean = false;
	$finished: Subject<null> = new Subject();

	initChart() {
		this.sorted = false;
		this.bars = [];

		for (let i = 0; i < this.size; i++) {
			this.bars.push(new Bar(i, this.size));
		}

		this.bars.forEach((bar, index) => bar.expected_position = index);
		this.bars.sort((a, b) => a.random - b.random);
		this.bars.forEach((bar, index) => bar.position = index);

		if (this.validateSorted()) {
			const first = this.getBar(0);
			const last = this.getBar(this.size - 1);
			last!.position = 0;
			first!.position = this.size - 1;
		}
	}

	getBar(position: number) {
		return this.bars.find(b => b.position === position);
	}

	findBestSwap(): Bar | null {
		let check_position = this.size - 1;

		while (check_position > 0) {
			const check_bar = this.getBar(check_position);

			if (check_bar && check_bar.expected_position !== check_position) {
				return this.bars.find(b => b.expected_position === check_position)!;
			}

			check_position -= 1;
		}

		return null;
	}

	swapBar(bar: Bar, max_distance: number = 1) {
		const optimal_distance = max_distance === 1 ? 1 : Math.min(max_distance, bar.expected_position - bar.position)
		const current_pos = bar.position;
		const top_bar = current_pos === this.size - 1;
		const target_pos = Math.min(current_pos + (top_bar ? -1 : optimal_distance), this.size - 1);
		const target_bar = this.getBar(target_pos);

		if (!target_bar) return;

		target_bar.position = current_pos;
		bar.position = target_pos;

		if (this.validateSorted()) {
			this.$finished.next(null);
			this.sorted = true;
		}
	}

	validateSorted() {
		return this.bars.every(bar => bar.position === bar.expected_position);
	}
}