import * as mc from "mojang-minecraft";
let yOffset = 2.12;
function runCmd(command, dimension = mc.world.getDimension("overworld")) {
    try {
        return {
            error: false,
            ...mc.world.getDimension(`overworld`).runCommand(command),
        };
    } catch (e) {
        return { error: true, errorText: e };
    }
}
function getScore(
    player,
    objective,
    customRunCmdFunction = null,
    { minimum, maximum } = {}
) {
    let RCmd = customRunCmdFunction ? customRunCmdFunction : runCmd;
    const data = RCmd(
        `scoreboard players test ${
            player.startsWith("@") ? player : `"${player}"`
        } ${objective} ${minimum ? minimum : "*"} ${maximum ? maximum : "*"}`
    );
    if (data.error) return;
    return parseInt(data.statusMessage.match(/-?\d+/)[0]);
}
mc.world.events.playerJoin.subscribe(player => {
    let p = player.player;
    try {
        mc.world
            .getDimension("overworld")
            .runCommand(`scoreboard objectives add SessionIDs dummy`);
    } catch (e) {}
    try {
        mc.world
            .getDimension("overworld")
            .runCommand(
                `scoreboard players set "ID:${
                    p.nameTag
                }" SessionIDs ${Math.floor(Math.random() * 2000000000)}`
            );
    } catch (e) {}
    if (getScore("Rank-Above-Name-Tag", "Toggles")) {
        let dim = p.dimension;
        runCmd(
            `execute "${p.nameTag}" ~ ~ ~ kill @e[type=rabbit,r=10,tag=fakenametag]`
        );
        runCmd(`kill @e[type=rabbit,r=10,tag=fakenametag]`);
        let entity = dim.spawnEntity(
            "minecraft:rabbit",
            new mc.Location(p.location.x, p.location.y + yOffset, p.location.z)
        );
        entity.nameTag = "§9Test";
        entity.addTag(
            (getScore("ID:" + p.nameTag, `SessionIDs`)
                ? getScore("ID:" + p.nameTag, `SessionIDs`)
                : -1
            ).toString()
        );
        entity.addTag("fakenametag");
    }
});
mc.world.events.tick.subscribe(() => {
    let sessionIDs = [];
    for (const p of mc.world.getPlayers()) {
        let sessionID = (
            getScore("ID:" + p.nameTag, `SessionIDs`)
                ? getScore("ID:" + p.nameTag, `SessionIDs`)
                : -1
        ).toString();
        sessionIDs.push(sessionID);
        if (getScore("Rank-Above-Name-Tag", "Toggles")) {
            let a = runCmd(
                `teleport @e[type=rabbit,tag=fakenametag,tag="${sessionID}"] ${
                    p.location.x
                } ${p.location.y + yOffset} ${p.location.z}`
            );
            let loc = new mc.BlockLocation(
                p.location.x,
                p.location.y + yOffset,
                p.location.z
            );
            let query = new mc.EntityQueryOptions();
            query.tags = [`${sessionID}`, `fakenametag`];
            query.type = "minecraft:rabbit";
            query.location = new mc.Location(
                p.location.x,
                p.location.y + yOffset,
                p.location.z
            );
            let entities = p.dimension.getEntities(query);
            if (entities) {
                entities = Array.from(entities);
                try {
                    let entity = entities[0];
                    if (entity) {
                        let tags = p
                            .getTags()
                            .filter(tag => tag.startsWith("rank:"));
                        entity.nameTag = tags
                            .map(rank => rank.substring(5))
                            .join("§r, ");
                    }
                } catch (e) {}
            }
            // if(a.error) console.warn(a.errorText)
        } else {
            runCmd(
                `execute "${p.nameTag}" ~ ~ ~ kill @e[type=rabbit,r=80,tag=fakenametag]`
            );
        }
    }
    let selector = `@e[r=50,type=rabbit,tag=fakenametag,${`tag=!"${sessionIDs.join(
        `",tag=!"`
    )}"`}]`;
    runCmd(`execute @a ~ ~ ~ kill ${selector}`);
});
