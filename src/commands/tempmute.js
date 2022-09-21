import { azalea } from "../azalea.js";
import { AAPI } from "../important/api.js";
import MS from '../important/ms.js';

azalea.registerCommand({
    name: "tempmute",
    category: "Moderation"
}, class extends AAPI {
    constructor() {
        super();
    }
    isNum(val){
        return !isNaN(val)
    }
    call(vars, fns) {
        if(!vars.player.hasTag('admin'))
            return this.tellraw(vars.username, `§cYou can't use this command without admin!`);
        let args = vars.args
            .join(" ")
            .trim()
            .match(/"[^"]+"|[^\s]+/g)
            .map(e => e.replace(/"(.+)"/, "$1"));
        let player;
        let timeMS;
        let reason;
        if(args.length) {
            if(args.length >= 2) {
                if(this.fetchPlayer(args[0])) player = this.fetchPlayer(args[0]);
                else return this.tellraw(vars.username,`§c${args[0]} is not online`);

                // if(player.hasTag('admin')) return this.tellraw(vars.username, `§cYou cannot mute a staff member`);

                let ms = MS(args[1]);
                if(!ms) return this.tellraw(vars.username, `§c${args1} is not a valid time!`);

                timeMS = ms;
                if(args.length > 2) {
                    reason = args[2];
                }
            }
        }
        if(player) {
            player.addTag(`tempmuted:${Date.now()+timeMS}`)
            return this.tellraw(vars.username, `§aMuted ${player.nameTag}`);
        } else return this.tellraw(vars.username, `§cAn error occurred`);
    }
});