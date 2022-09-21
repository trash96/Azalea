import { events } from "./events.js";
import { commandsData } from "./important/commandsData.js";
export const client = null;
// Actually an ok system, will use it later, probably in v0.3.0.4

const AZALEA_TIMESTAMP = 1658527540; // in seconds, not milliseconds

class Azalea {
    constructor() {
        this._cmds = commandsData;
        this.getCommands;
        this.events = events;
        this.loops = [];
    }
    /**
     * @param {Object} options
     * @param {Function} callback
     * @returns {Object} Command registration object
     */
    registerCommand(options, callback) {
        let cmdOptions = {
            name: options.name,
            description: options.description ? options.description : null,
            tags: options.tags ? options.tags : null,
            aliases: options.aliases ? options.aliases : [],
            ranks: options.ranks ? options.ranks : null,
            usage: options.usage ? options.usage : null,
            credits: options.credits ? options.credits : null,
            category: options.category ? options.category : null,
            color: options.color ? options.color : null,
            v2: true,
            callback,
        };
        if(this._cmds.find(_=>_.name==cmdOptions.name)) return;
        this._cmds.push(cmdOptions);
        return {
            commandDetails: {
                name: cmdOptions.name,
            },
        };
    }
    registerLoop(name, fn) {
        this.loops.push({
            name,
            callback: fn,
            enabled: true
        })
    }
    toRegularTimestamp(azaleaTime=this.now()) {
        return new Date((azaleaTime + AZALEA_TIMESTAMP) * 1000)
    }
    now() {
        return Math.floor(Date.now()/1000) - AZALEA_TIMESTAMP;
    }
    subCommand(commandReg, name, callback) {
        let cmd = this._cmds.find(
            v => v.name == commandReg.commandDetails.name
        );
        if (cmd) {
        }
    }
    /**
     * @getCommands
     * @example
     * let commands = getCommands()
     * @returns {Array} Returns all the commands registered in the new azalea command registration thing
     */
    getCommands(options, callback) {
        return this._cmds;
    }
}
export const azalea = new Azalea();