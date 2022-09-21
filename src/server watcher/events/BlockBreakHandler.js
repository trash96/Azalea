import { AAPI } from "../../important/api.js";
import { tempStorage } from "../../memoryMap.js";
import { addToData, getData } from "../serverWatcher.js";
let api = new AAPI();
let flagStrictness = 1;

export function blockBreakHandler(event) {
    let lastBrokenBlockCount = tempStorage.has(`lastBlockBreakEvent_${event.player.name}`) ? tempStorage.get(`lastBlockBreakEvent_${event.player.name}`) : 0;
    let lastBrokenBlockTimestamp = tempStorage.has(`lastBlockBreakTimestamp_${event.player.name}`) ? tempStorage.get(`lastBlockBreakTimestamp_${event.player.name}`) : 0;
    if(Date.now() - lastBrokenBlockTimestamp <= flagStrictness) {
        event.player.addTag('flagged:nuker');
        api.tellraw(event.player.nameTag, `§cYou have been flagged for nuking the server!`);
    }
    tempStorage.set(`lastBlockBreakEvent_${event.player.name}`, getData(event.player));
    tempStorage.set(`lastBlockBreakTimestamp_${event.player.name}`, Date.now());
    addToData(0,event.player)
}