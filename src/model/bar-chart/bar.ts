export class Bar {
	expected_position: number;
	position: number;
	random: number;
	height: number;

	constructor(position: number, total_size: number) {
		this.position = position;
		this.expected_position = position;
		this.height = ((position / (total_size - 1)) * .8) + .2;
		this.random = Math.random();
	}
}