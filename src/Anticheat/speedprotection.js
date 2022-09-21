import { world } from "mojang-minecraft";

export function SpeedProtection() {
    world.events.tick.subscribe(() => {
        for (const player of world.getPlayers()) {
            const movement = player.getComponent("minecraft:movement");
            movement.setCurrent(movement.current);
        }
    });
}
