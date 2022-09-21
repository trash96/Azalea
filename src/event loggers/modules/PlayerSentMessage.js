import { events } from "../../events.js";
events.on("AzaleaLogger:PlayerSentMessage", (data, tellraw) => {
    tellraw(
        "@a[tag=playerlogger]",
        `§l§8[ §aPLAYER_MESSAGE §r§l§8] §r${data.sender.nameTag} >> ${data.message}`
    );
});
