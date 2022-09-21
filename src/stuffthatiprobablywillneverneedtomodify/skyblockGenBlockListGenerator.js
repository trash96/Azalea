export class SkyblockGenList {
    constructor() {}
    getData() {
        let data = {
            redstone_ore: 20,
            stone: 201,
            iron_ore: 25,
            gold_ore: 11,
            coal_ore: 61,
        };
        let list = [];
        for (const key of Object.keys(data)) {
            let str = (key + ", ").repeat(data[key]).slice(0, -2).split(", ");
            list.push(...str);
        }
        return list;
    }
}
