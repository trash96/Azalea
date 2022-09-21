import { world } from "mojang-minecraft";
import { tempStorage } from "../memoryMap.js";
const mines = {},
    adminTag = "v";
world.events.playerJoin.subscribe(data =>
    Object.assign(mines, { [data.player.name]: null })
);
world.events.blockBreak.subscribe(
    ({ block, brokenBlockPermutation, dimension, player }) => {
        if (
            tempStorage.get("toggleAntiCheat") &&
            tempStorage.get("antiNukerEnabled")
        ) {
            const mine = mines[player.name];
            Object.assign(mines, { [player.name]: Date.now() });
            if (mine < Date.now() - 50 || player.hasTag(adminTag)) return;
            dimension
                .getBlock(block.location)
                .setPermutation(brokenBlockPermutation.clone());
            dimension
                .getEntitiesAtBlockLocation(block.location)
                .filter(entity => entity.id === "minecraft:item")
                .forEach(item => item.kill());
        }
    }
);
world.events.playerLeave.subscribe(data => delete mines[data.playerName]);
