import { tempStorage } from "../memoryMap.js";
import * as mc from "mojang-minecraft";
mc.world.events.tick.subscribe(() => {
    // if(tempStorage.get('toggleAntiCheat') && tempStorage.get('antiNamespoofEnabled')) {
    for (const player of mc.world.getPlayers()) {
        if (player.nameTag.replace(/[^0-9a-zA-Z_-]/gi, "") != player.nameTag) {
            player.triggerEvent("binocraft:kick");
        }
    }
    // }
});
