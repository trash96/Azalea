import { AAPI } from "../important/api.js";

export class Skyblock extends AAPI {
    constructor() {
        super();
    }
    calculateGeneratorLevels(player) {
        if(!player) return;
        let levels = this.getScoreQ("SGenLevels", player.nameTag) ? this.getScoreQ("SGenLevels", player.nameTag) : 0;
        let xp = this.getScoreQ("SGenXP", player.nameTag) ? this.getScoreQ("SGenXP", player.nameTag) : 0;
        this.runCmd(`scoreboard objectives add SGenXP dummy`)
        this.runCmd(`scoreboard objectives add SGenLevels dummy`)
        this.runCmd(`scoreboard players add "${player.nameTag}" SGenXP ${Math.floor(Math.random() * 5 + 1)}`)
        if(xp >= Math.floor(1.84 * (Math.pow(2, levels + 1) - 1))) {
            // this.runCmd(`scoreboard players  "${player.nameTag}" SGenXP 0`)
            this.runCmd(`scoreboard players add "${player.nameTag}" SGenLevels 1`)
            levels = this.getScoreQ("SGenLevels", player.nameTag);
            this.tellraw(player.nameTag,`§aYour generator upgraded to level ${levels}`);
        }
    }
    getRandomBlock(player) {
        try {
            let levels = this.getScoreQ("SGenLevels", player.nameTag) ? this.getScoreQ("SGenLevels", player.nameTag) : 0;
            console.warn(levels);
            let xp = this.getScoreQ("SGenXP", player.nameTag) ? this.getScoreQ("SGenXP", player.nameTag) : 0;
            let blockMap = {};
            
            blockMap.stone = 60;
            if(this.intInRange(levels, 5, 2e8)) blockMap.coal_ore = 45;
            if(this.intInRange(levels, 6, 2e8)) blockMap.iron_ore = 33;
            if(this.intInRange(levels, 8, 2e8)) {
                blockMap.redstone_ore = 23;
                blockMap.iron_ore = 40;
            }
            if(this.intInRange(levels, 11, 2e8)) blockMap.diamond_ore = 17;
            if(this.intInRange(levels, 15, 2e8)) blockMap.ancient_debris = 10;
            if(this.intInRange(levels, 100, 2e8)) blockMap.diamond_block = 1;
            console.warn(JSON.stringify(blockMap));
            return this.getRandomByPercentageProbability(blockMap) ?? "stone";
    
        } catch(e) {
            console.warn(e);
        }
    }
}