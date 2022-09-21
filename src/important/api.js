import * as mc from "mojang-minecraft";
export class AAPI {
    constructor() {}
    getRanks(player) {
        return player.getTags().filter(tag=>tag.startsWith('rank:')).map(rank=>rank.substring(5));
    }
    parseChatRanks(msg) {
        let varsRegex = /\{\$([\s\S]*?)\}/g;
        let template = `{$if-ranks §7[§r}{$ranks §r, }{$if-ranks §r§7]§r }{$nametag} > {$message}`;
        let vars = template.match(varsRegex);
        let msg2 = template;
        if(!vars.length) return template;
        for(const variable of vars) {
            let data = this.parseStringVariable(variable);
            let ranks = this.getRanks(msg.sender)
            if(data.name == "ranks") {
                msg2 = msg2.replace(variable, ranks.join(data.args.join(' ')))                                
            } else if(data.name == "if-ranks") {
                if(ranks.length) msg2 = msg2.replace(variable, data.args.join(' '));
                else msg2 = msg2.replace(variable, '');
            } else if(data.name == "nametag") {
                msg2 = msg2.replace(variable, msg.sender.nameTag)
            } else if (data.name == "message") {
                msg2 = msg2.replace(variable, msg.message)
            }
        }
        return msg2
    }
    between(x, min, max) {
        return x >= min && x <= max;
      }
      intInRange(...args) {
        return this.between(...args);
      }
      getRandomByPercentageProbability(rarity) {
        const rnd = Math.random() * 100000;
    
        const percent = rnd / 1000;
        
        let result = null, acc = 0;
        
        Object.keys(rarity).forEach(key => {
          if (result === null && percent > 100 - rarity[key] - acc)
            result = key;
          acc += rarity[key];
        });
        
        return result;
    
      }
    parseStringVariable(str) {
        return {
            name: str.slice(0,-1).substring(2).split(" ")[0],
            args: str.slice(0,-1).substring(2).split(" ").slice(1)
        }
    }
    runCmd(command, dimension = `overworld`) {
        try {
            return {
                error: false,
                ...mc.world.getDimension(dimension).runCommand(command),
            };
        } catch (e) {
            return { error: true, errorText: e };
        }
    }
    fetchPlayer(username) {
        for (const player of mc.world.getPlayers()) {
            if (player.nameTag.toLowerCase() == username.toLowerCase())
                return player;
        }
        return;
    }
    tellraw(selector, text) {
        this.runCmd(
            `tellraw ${
                selector.startsWith("@") ? selector : `"${selector}"`
            } {"rawtext":[{"text":${JSON.stringify(text)}}]}`
        );
    }
    getScoreQ(objective, player, { minimum, maximum } = {}) {
        const data = this.runCmd(
            `scoreboard players test "${player}" "${objective}" ${
                minimum ? minimum : "*"
            } ${maximum ? maximum : "*"}`
        );
        if (data.error) return;
        return parseInt(data.statusMessage.match(/-?\d+/)[0]);
    }
    getScore(...args) {
        this.getScoreQ(...args);
    }
    set(key, val, table = null) {
        const len = val.length,
            _table = table ? table : "default";
        this.runCmd(`scoreboard objectives add DB_${_table} dummy`);
        this.delete(key, _table);
        this.runCmd(`scoreboard players set "Len${key}" DB_${_table} ${len}`);
        for (let i = 0; i < len; i++) {
            this.runCmd(
                `scoreboard players set "${key}${i}" DB_${_table} ${val[
                    i
                ].charCodeAt()}`
            );
        }
    }
    get(key, table = null) {
        const _table = table ? table : "default",
            len = this.getScoreQ(`DB_${_table}`, `Len${key}`);
        if (!len) return;
        let result = "";
        for (let i = 0; i < len; i++) {
            let char = this.getScoreQ(`DB_${_table}`, `${key}${i}`);
            if (char) {
                result += String.fromCharCode(char);
            }
        }
        return result;
    }
    getv1(key, table = null) {
        const _table = table ? table : "default",
            len = this.getScoreQ(`DB_${_table}`, `Len${key}`);
        if (!len) return;
        let result = "";
        for (let i = 0; i < len; i++) {
            let char = this.getScoreQ(`DB_${_table}`, `${key}${i}`);
            if (char) {
                result += String.fromCharCode(char);
            }
        }
        return result;
    }

    delete(key, table = null) {
        const _table = table ? table : "default",
            len = this.getScoreQ(`DB_${_table}`, `Len${key}`);
        if (!len) return;
        for (let i = 0; i < len; i++) {
            this.runCmd(`scoreboard players reset "${key}${i}" DB_${_table}`);
        }
        this.runCmd(`scoreboard players reset "Len${key}"`);
    }

    parseTags(str, player) {
        let r1 = /\{([\s\S]*?)\}/g;
        let matches = str.match(r1);
        let newstr = str;
        if (matches && matches.length) {
            for (let i = 0; i < matches.length; i++) {
                let match = matches[i].substring(1).slice(0, -1);
                let type = match.split(":")[0];
                let sub =
                    match.split(":").length > 1 ? match.split(":")[1] : null;
                let subsub =
                    match.split(":").length > 2 ? match.split(":")[2] : null;
                if (type == "score") {
                    if (sub) {
                        newstr = newstr.replace(
                            matches[i],
                            (this.getScoreQ(sub, player.nameTag)
                                ? this.getScoreQ(sub, player.nameTag)
                                : 0
                            ).toString()
                        );
                    } else {
                        newstr = newstr.replace(matches[i], "0");
                    }
                } else if (type == "nametag") {
                    newstr = newstr.replace(matches[i], player.nameTag);
                } else if (type == "membercount") {
                    newstr = newstr.replace(
                        matches[i],
                        (this.getScoreQ("AzaleaData", "membersJoined")
                            ? this.getScoreQ("AzaleaData", "membersJoined")
                            : 0
                        ).toString()
                    );
                } else if(type == "ranks") {
                    let ranks = player.getTags().filter(_=>_.startsWith('rank:')).map(_=>_.substring(5));
                    newstr = newstr.replace(matches[i], ranks.join('§r§7,\n§r'))
                }
            }
        }
        newstr = newstr.replace(/\\n/g, "\n");
        return newstr;
    }
}
