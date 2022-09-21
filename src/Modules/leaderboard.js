import * as mc from "mojang-minecraft";
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
export function writeLeaderboard([x, y, z], objective, name, limit=10, offline=true) {
    let dimension = mc.world.getDimension("overworld");
    let entities = dimension.getEntitiesAtBlockLocation(
        new mc.BlockLocation(Math.trunc(x), Math.trunc(y), Math.trunc(z))
    );
    let leaderboardScoreText = [];
    let header = `§c<<§3${name}§r§c>>`;
    if (entities && entities.length) {
        let entity = entities[0];
        let rabbits = entities.filter(_=>_.id == "minecraft:rabbit");
        if(rabbits.length > 1) {
            for(let i = 0;i < rabbits.length;i++) {
                if(i > 0) rabbits[i].kill();
            }
        }
        if (entity.id != "minecraft:rabbit") return;
        let scores = [];
        let playerNames = [];
        for (const p of mc.world.getPlayers()) {
            let score = getScore(`@a[name="${p.name}"]`, objective)
                ? getScore(`@a[name="${p.name}"]`, objective)
                : 0;
            scores.push(score);
            playerNames.push(p.name);
        }
        // runCmd(`scoreboard objectives add LBD${objective}`);
        // for(const p of mc.world.getPlayers()) {
        //     // let LBPID = getScore(p.nameTag,`LBplayers`);
        //     // runCmd(`scoreboard players set "${LBPID ? LBPID : 0}: ${p.nameTag}" LBplayers 0`);
        //     runCmd(`scoreboard players set ${LBPID}`)
        // }
        scores = scores.sort((a, b) => b - a);
        for (let i = 0; i < scores.length; i++) {
            leaderboardScoreText.push(`§6${playerNames[i]} §7| §r${scores[i]}`);
        }
        let finalText = `${header}\n§r${leaderboardScoreText.join("§r\n§r")}`;
        entity.nameTag = finalText;
    } else {
        try {
            let entity = dimension.spawnEntity(
                "minecraft:rabbit",
                new mc.Location(Math.trunc(x), Math.trunc(y), Math.trunc(z))
            );
            entity.addTag("leaderboard");
            entity.addTag("leaderboard-objective:" + objective);
            entity.addTag(`LeaderboardName:${name}`);
        } catch (e) {}
    }
}
mc.world.events.tick.subscribe(()=>{
    runCmd(`scoreboard objectives add LBplayers dummy`);
    for(const p of mc.world.getPlayers()) {
        if(!getScore(p.nameTag, `LBplayers`)) runCmd(`scoreboard players set "${p.nameTag}" LBplayers ${rand(-2147483648, 2147483647)}`);
    }
})
const rand = (Low,High)=> Math.floor(Math.random() * 1 - Low + High) + Low;