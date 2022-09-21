import { azalea } from "../azalea.js";
import { AAPI } from "../important/api.js";
import * as mc from 'mojang-minecraft';
import {tempStorage} from '../memoryMap.js';
let scoreboardText;
let _init = false;
let what = new AAPI();
export function setScoreboardText(text) {
    tempStorage.set(`scoreboardtext`, text)
}
mc.world.events.worldInitialize.subscribe(()=>{
    tempStorage.set('scoreboardtext', what.get(`screb`, `misc`) ? what.get(`screb`, `misc`) : null);
})
let ticks = 0;
mc.world.events.tick.subscribe(()=>{
    ticks++;
    if(!_init || (ticks % 120 == 0 && !tempStorage.get('scoreboardtext'))) {
        tempStorage.set('scoreboardtext', what.get(`screb`, `misc`) ? what.get(`screb`, `misc`) : null);
        _init = true;
        return;
    }
    if(!tempStorage.get('scoreboardtext')) return;
    let players = mc.world.getPlayers();
    for(const player of players) {
        let newText = what.parseTags(tempStorage.get('scoreboardtext'), player);
        player.onScreenDisplay.setTitle(newText);
    }
})
azalea.registerCommand({
    name: "scoreboard",
    aliases: ["sc","score"],
    description: "The azalea scoreboard resource pack is VERY recommended for this command!"
}, class extends AAPI {
    constructor() {
        super();
    }
    isNum(val){
        return !isNaN(val)
    }
    call(vars, fns) {
        if(!vars.player.hasTag('admin')) return this.tellraw(vars.username, `§cNo admin, no server management commands.`);
        if(vars.args.length) {
            this.set(`screb`, vars.args.join(' '), `misc`);
            tempStorage.set('scoreboardtext', vars.args.join(' '));
            return this.tellraw(vars.username, `§aSuccessfully edited scoreboard!`);
        } else {
            return this.tellraw(vars.username, `§cYou need to add text! This also includes formatting, heres some examples!\n§r\\scoreboard Money: {score:money}`)
        }
    }
});