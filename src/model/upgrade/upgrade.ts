export class Upgrade {
	id: string;
	name: string;
	description: string;
	level_limit: number;
	costs: number[] = [];
	description_function: (level: number) => String = (a) => this.description;

	constructor(
		id: string,
		name: string,
		description: string,
		level_limit: number,
		costs: number | number[],
		description_function?: (level: number) => String
	) {
		this.id = id;
		this.name = name;
		this.description = description;
		this.level_limit = level_limit;
		this.costs = Array.isArray(costs) ? costs : [costs];
		if (description_function) this.description_function = description_function;
	}

	atLimit(level: number) {
		return level >= this.level_limit;
	}

	desc(level?: number) {
		return this.description_function(level ? level + 1 : 1);
	}

	cost(level?: number) {
		return this.costs[Math.max(Math.min(level ? level : 0, this.costs.length - 1), 0)]
	}
}