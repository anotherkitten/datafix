import { VERSION } from "../../VERSION";

interface DataStruct {
	[key: string]: any;
}

export class GameData implements DataStruct {
	version: number = VERSION;
	money: number = 0;
	upgrades: { [key: string]: number } = {}

	constructor(data?: GameData) {
		if (!data) return;
		const old_ver = data.version;

		// automatically cull old data
		for (let key of Object.keys(this)) {
			Object.assign(this, {[key]: data[key as keyof GameData]});
		}

		// explicit version migrations here
	}
}