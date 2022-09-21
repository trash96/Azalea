import { events } from "../../events.js";
events.on("AzaleaLogger:PlayerUsedCommand", (data, tellraw) => {
    tellraw(
        "@a[tag=playerlogger]",
        `§l§8[ §aPLAYER_CMD §r§l§8] §r${data.player} >> ${data.prefix}${data.command}`
    );
});
