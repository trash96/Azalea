import * as mc from "mojang-minecraft";
mc.world.events.tick.subscribe(() => {
    try {
        mc.world.getDimension("overworld").runCommand(`function anticbe`);
    } catch (e) {}
});
