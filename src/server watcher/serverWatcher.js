import { AAPI } from "../important/api.js";
import { serverWatcherConfig } from "./config.js";
import { blockBreakHandler } from "./events/BlockBreakHandler.js";
import { blockPlaceHandler } from "./events/BlockPlaceHandler.js";
import { commandUsageHandler } from "./events/CommandUsageHandler.js";
import { playerJoinHandler, playerLeaveHandler } from "./events/JoinLeaveHandler.js";

export function addToData(id, player=null) {
    if(player && player.id !== "minecraft:player") return;
    let date = new Date(),
        month = date.getMonth(),
        day = date.getDate(),
        year = date.getUTCFullYear();
    const api = new AAPI();
    const { scoreboardFormat } = serverWatcherConfig;
    console.warn(id);
    const formattedScoreboard = scoreboardFormat.replace(/<id>/g,id).replace(/<month>/g,month).replace(/<day>/g,day).replace(/<year>/g,year);
    api.runCmd(`scoreboard objectives add "${formattedScoreboard}" dummy`);
    if(player) api.runCmd(`scoreboard players add "DATA.${player.name}" "${formattedScoreboard}" 1`);
    api.runCmd(`scoreboard players add "TOTAL" "${formattedScoreboard}" 1`);
}

export function getData(id, player) {
    if(player && player.id !== "minecraft:player") return;
    let date = new Date(),
        month = date.getMonth(),
        day = date.getDate(),
        year = date.getUTCFullYear();
    const api = new AAPI();
    const { scoreboardFormat } = serverWatcherConfig;
    console.warn(id);
    const formattedScoreboard = scoreboardFormat.replace(/<id>/g,id).replace(/<month>/g,month).replace(/<day>/g,day).replace(/<year>/g,year);
    if(player) return api.getScoreQ(`DATA.${player.name}`, `${formattedScoreboard}`) ?? 0;
}

export const serverWatcherHandlers = [blockBreakHandler, blockPlaceHandler, playerJoinHandler, playerLeaveHandler, commandUsageHandler];