import { azalea } from "../azalea.js";
import { AAPI } from "../important/api.js";

azalea.registerCommand({
    name: "tz",
    aliases: ["timezone"]
}, class extends AAPI {
    constructor() {
        super();
    }
    isNum(val){
        return !isNaN(val)
    }
    call(vars, fns) {
        // 3600000
        if(!vars.args.length) return this.tellraw(vars.username, `§cPlease include a number`);
        if(!this.isNum(vars.args[0])) return this.tellraw(vars.username, `§c${args[0]} is not a number`);
        let timezone = parseInt(vars.args);
        this.runCmd(`scoreboard objectives add timeZ dummy`);
        this.runCmd(`scoreboard players set "${vars.username}" timeZ ${timezone}`);
        this.tellraw(vars.username,`§aSet timezone to ${args[0]}`)
    }
});