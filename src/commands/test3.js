import { ActionForm, ModalForm } from "../API/Forms.js";
import { azalea } from "../azalea.js";
import { AAPI } from "../important/api.js";
import { itemToJson, jsonToItem } from "../important/itemConverters.js";
import * as mc from 'mojang-minecraft';
import { LZString } from "../lib/lzstring.js";
import { momentjs } from "../lib/moment.js";



azalea.registerCommand({
    name: "db",
    category: "Database Management",
    color: 0xc0
}, class extends AAPI {
    constructor() {
        super();
    }
    call(vars,fns,{subcommand}) {
        if(!vars.player.hasTag('admin')) return this.tellraw(vars.username, `§cYou need admin to run this command!`);
        try {
            if(subcommand) {
                if(subcommand == "reset-all") {
                    try {
                        mc.world.setDynamicProperty("db", LZString.compress(JSON.stringify({})));
                        this.tellraw(vars.username, `§aDatabase reset!`);
                    } catch(e) {
                        this.tellraw(vars.username, `§cAn error ocurred!\n${e}`);
                    }
                    return;
                }
                if(subcommand == "reset-table") {
                    if(vars.args.length <= 1) return this.tellraw(vars.username, `§cYou need to add a table name!`);
                    let table = vars.args[1];
                    try {
                        let content = JSON.parse(LZString.decompress(mc.world.getDynamicProperty("db")));
                        if(content[table]) delete content[table];
                        mc.world.setDynamicProperty("db", LZString.compress(JSON.stringify(content)));
                        this.tellraw(vars.username, `§aDatabase table ${table} reset!`);
                    } catch(e) {
                        this.tellraw(vars.username, `§cAn error ocurred!\n${e}`);
                    }
                    return;
                }
                return this.tellraw(vars.username, `§cInvalid subcommand!`);
            }
            let len = mc.world.getDynamicProperty("db").length;
            // let len = 1000;
            let progressBar = (len / 9996) * 10;
            
            this.tellraw(`${vars.username}`, `§d§lSTORAGE\n §r§7${len}/9996 §rcharacters\n§a[${"█".repeat(progressBar)}${"░".repeat(10-progressBar)}]\n\n§a§lMANAGE§r\n\n§d${this.get('prefix', 'config')}db reset-all\n§d${this.get('prefix', 'config')}db reset-table §e<table>`);
            // console.warn(`${mc.world.getDynamicProperty("db")}`);
        } catch(e) {
            // console.error(e);
            this.tellraw(`${vars.username}`, `Database Storage: 0/9996 characters`);
        }
    }
})

// azalea.registerCommand({
//     name: "test2",
//     category: "Database Management",
//     color: 0xc0
// }, class extends AAPI {
//     constructor() {
//         super();
//     }

//     call(vars, fns) {
//         this.tellraw(vars.username, );
//     }
// });