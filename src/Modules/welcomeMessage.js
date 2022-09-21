import { world } from "mojang-minecraft";
function runCmd(command) {
    try {
        return {
            error: false,
            ...world.getDimension(`overworld`).runCommand(command),
        };
    } catch (e) {
        return { error: true };
    }
}
export function welcomeMessage(player, prefix) {
    let name = player.nameTag;
    let ticks = 0;
    let tickEvent = world.events.tick.subscribe(e => {
        if (!runCmd(`testfor @a[name="${name}"]`).error) {
            ticks++;
            if (ticks % 40 == 0) {
                let text = `${
                    player.hasTag("old")
                        ? `§c<< §3Welcome Back! §c>>\n§r`
                        : `§c<< §3Welcome! §c>>\n§r`
                }§rPlease read the announcements using ${prefix}announcements\n§rAlso read the rules using ${prefix}rules`;
                runCmd(
                    `tellraw "${name}" {"rawtext":[{"text":${JSON.stringify(
                        text
                    )}}]}`
                );
                if (!player.hasTag("old")) {
                    let welcomeText = `§c-=-=-=-=-\n§b${name} §ais new here!\n§dPlease say hi!\n§c-=-=-=-=-`;
                    runCmd(
                        `tellraw @a[name=!"${name}"] {"rawtext":[{"text":${JSON.stringify(
                            welcomeText
                        )}}]}`
                    );
                    runCmd(`scoreboard objectives add AzaleaData dummy`);
                    runCmd(`scoreboard players add membersJoined AzaleaData 1`);
                    player.addTag("old");
                }
                world.events.tick.unsubscribe(tickEvent);
            }
        }
    });
}
