import * as mc from "mojang-minecraft";
import Database from "./database.js";
class CommandMaker {
    constructor() {
        this.registeredCommands = [];
    }
    register(name, description, callback) {
        this.registeredCommands.push({
            name,
            description,
            callback,
        });
    }
    get(name) {
        return this.registeredCommands.find(cmd => cmd.name === name);
    }
    getIndex(name) {
        return this.registeredCommands.indexOf(this.get(name));
    }
    getAll() {
        return this.registeredCommands;
    }
    setCategory(name) {
        let cmd = this.get(name);
        let index = this.getIndex(name);
        if (cmd) {
            cmd.category = category;
            this.registeredCommands[index] = cmd;
        }
    }
    call(name) {
        let command = this.registeredCommands.find(cmd => cmd.name === name);
        if (command) {
            let results = command.callback(
                msg,
                msg.message.split(" "),
                msg.sender
            );
            if (results && results.output) {
                mc.world
                    .getDimension("overworld")
                    .runCommand(
                        `tellraw "${msg.sender.nameTag}" {"rawtext":[{"text":"${results.output}"}]}`
                    );
            }
        }
    }
}
