// import * as this.LangEn from './languages/en_us/dialog.js';
import {
    Dimension,
    Player,
    BeforeChatEvent,
    MinecraftItemTypes,
    Enchantment,
    world,
    Location,
    InventoryComponentContainer,
    ItemStack,
    TickEvent,
    MinecraftEnchantmentTypes,
    ExplosionOptions,
    EntityQueryOptions,
    BlockLocation,
    Block,
} from "mojang-minecraft";
import * as mc from 'mojang-minecraft';
import { events } from "../events.js";
import { getTheme } from "../themes.js";
import {
    MessageFormData,
    ModalFormData,
    ActionFormData,
} from "mojang-minecraft-ui";
import { azalea as azalea2 } from "../azalea.js";
import {
    spawnPlayerInventoryOnGround,
    rainItems,
    giveUnobtainableItems,
} from "../misc.js";
// import { WiseDataFish } from "./theWiseDataFish.js";
// import { transferItem } from "./API/vault/vault.js";
import { tempStorage } from "../memoryMap.js";
import { chunkify } from "../trashlibazalea/utils.js";
import { writeLeaderboard } from "../Modules/leaderboard.js";
import { ModalForm } from "../API/Forms.js";
import { betweenXYZ } from "../trashlibazalea/betweenxyz.js";
import { errorSound, successSound } from "../sounds.js";
import { DateFormat } from "../utils/datetime.js";
import { loadCommands } from "./commands.js";
import "../event loggers/main.js";
import { commandsData } from "./commandsData.js";
import { SkyblockGenList } from "../stuffthatiprobablywillneverneedtomodify/skyblockGenBlockListGenerator.js";
import { azalea } from "../azalea.js";
import { sendChatMessage } from "../utils/functions/chat.js";
import { similarity } from "../utils/functions/similarity.js";
import { AAPI } from "./api.js";
import { Skyblock } from "../skyblock/calculate generator.js";
import { serverWatcherHandlers } from "../server watcher/serverWatcher.js";
import { getAnalytics } from "../server watcher/analytics.js";
import { LZString } from "../lib/lzstring.js";
import { momentjs } from "../lib/moment.js";
// function en(c){var x='charCodeAt',b,e={},f=c.split(""),d=[],a=f[0],g=256;for(b=1;b<f.length;b++)c=f[b],null!=e[a+c]?a+=c:(d.push(1<a.length?e[a]:a[x](0)),e[a+c]=g,g++,a=c);d.push(1<a.length?e[a]:a[x](0));for(b=0;b<d.length;b++)d[b]=String.fromCharCode(d[b]);return d.join("")}

// function de(b){var a,e={},d=b.split(""),c=f=d[0],g=[c],h=o=256;for(b=1;b<d.length;b++)a=d[b].charCodeAt(0),a=h>a?d[b]:e[a]?e[a]:f+c,g.push(a),c=a.charAt(0),e[o]=f+c,o++,f=a;return g.join("")}

    const en = text=> LZString.compress(text);
    const de = text=> LZString.decompress(text);

export class Features {
    constructor(loaderOptions) {
        this.pendingAzaleaStringMessageRequestsFromBerpBot = [];
        this.tables = new Map();
        this.skyblock = new Skyblock();
        this.textGuiTest = {
            options: [
                {
                    type: "Submenu",
                    load: "+WARPS",
                    text: "Warps",
                },
                {
                    type: "Submenu",
                    load: "Submenu 2",
                    text: "More Commands",
                },
            ],
            submenus: [
                {
                    name: "Submenu 1",
                    title: "Warps",
                    options: [
                        {
                            type: "Command",
                            command: "tp @s ~ ~10 ~",
                            text: "Test Command",
                        },
                    ],
                },
                {
                    name: "Submenu 2",
                    title: "Other Commands",
                    options: [
                        {
                            type: "Command",
                            command:
                                'tellraw @a {"rawtext":[{"text":"§aTest"}]}',
                            text: "Other Command",
                        },
                    ],
                },
            ],
        };
        this.adminPanelFeatures = [
            {
                sections: [
                    {
                        id: "test1",
                        text: "Testing Section",
                        icon: "textures/blocks/glass",
                    },
                ],
            },
        ];
        // Dont copy this, its a bad practice as most JS developers would say

        // Define a function to get the score
        this.tpMap = new Map();
        Player.prototype.getScore = function (
            objective,
            { minimum = null, maximum = null }
        ) {
            function runCmd() {
                try {
                    return {
                        error: false,
                        ...world.getDimension(`overworld`).runCommand(command),
                    };
                } catch (e) {
                    return { error: true, errorText: e };
                }
            }
            const data = this.runCmd(
                `scoreboard players test "${this.nameTag}" "${objective}" ${
                    minimum ? minimum : "*"
                } ${maximum ? maximum : "*"}`
            );
            if (data.error) return;
            return parseInt(data.statusMessage.match(/-?\d+/)[0]);
        };
        // Define a function to get the player team using azalea teams
        Player.prototype.getTeam = function () {
            let team = this.getTags().find((tag) => tag.startsWith("team:"));
            if (team) return team.replace("team:", "");
            else return;
        };
        // Define a function to get all tags from a player with a prefix
        Player.prototype.getTagPrefix = function (prefix) {
            let tags = this.getTags().filter((tag) => tag.startsWith(prefix));
            return tags && tags.length ? tags : null;
        };
        // Define a function to easily kick a player using /kick
        Player.prototype.kick = function (reason = null) {
            function runCmd() {
                try {
                    return {
                        error: false,
                        ...world.getDimension(`overworld`).runCommand(command),
                    };
                } catch (e) {
                    return { error: true, errorText: e };
                }
            }
            runCmd(`kick "${this.nameTag}"${reason ? ` ${reason}` : ""}`);
        };
        // Define a function to send an unexpected packet to a player to force them to get kicked
        Player.prototype.forceKick = function () {
            this.triggerEvent("binocraft:kick");
        };

        // Define a function to set a warp
        Dimension.prototype.setWarp = function (name, x, y, z) {
            function runCmd() {
                try {
                    return {
                        error: false,
                        ...world.getDimension(`overworld`).runCommand(command),
                    };
                } catch (e) {
                    return { error: true, errorText: e };
                }
            }
            let id = [
                world.getDimension("overworld").id,
                world.getDimension("nether").id,
                world.getDimension("the end").id,
            ].indexOf(this.id);
            runCmd(`scoreboard objectives add "WARP${name}" dummy`);
            runCmd(`scoreboard players set x "WARP${name}" ${Math.trunc(x)}`);
            runCmd(`scoreboard players set y "WARP${name}" ${Math.trunc(y)}`);
            runCmd(`scoreboard players set z "WARP${name}" ${Math.trunc(z)}`);
            runCmd(`scoreboard players set dimension "WARP${name}" ${id}`);
        };

        // Define a function to set spawn
        Dimension.prototype.setSpawn = function (x, y, z) {
            this.setWarp("spawn", x, y, z);
        };
        this.loaderOptions = {};
        this.broadcastop = { formatText: true };
        this.LangEn = loaderOptions.language;
        this.utils = loaderOptions.lib.utils;
        this.loaded = false;
        this._namespace = "Hi";
        this.chatMap = new Map();
        this.name =
            "Azalea Update 0.3.0.2-Alpha (Last modified April 10, 2022)";
        /*
            case "set-admin-only":
                this.qtAdminOnly(apiVars, apiFunctions);
                break;
            case "cancel-explosion-toggle":
                this.cancelExplosionToggle(apiVars, apiFunctions);
                break;
            case "warn-on-cancel-explosion-toggle":
                this.warnOnCancelExplosionToggle(apiVars, apiFunctions);
                break;
            case "jobs-beta":
                this.toggleJobsBeta(apiVars, apiFunctions);
                break;
        */
        // Help Page Test
        //    let cmds = [];
        //    for(let i = 0;i < 40;i++) {
        //        cmds.push({
        //            name: i + 1
        //        })
        //    }
        //    this._cmds = cmds;
        this.plugins = [
            {
                name: "Azalea Base",
                color: "bright-magenta",
                description: "The main code for azalea",
            },
        ];
        this.tagBackupMap = new Map();
        this._cmds = azalea._cmds;
        /*
? qa
! aa
* aa
            case "pay":
                this.pay(apiVars, apiFunctions);
                break;
            case "permban":
                this.permban(apiVars, apiFunctions);
                break;
            case "unpermban":
                this.unpermban(apiVars, apiFunctions);
                break;
            case "fly":
                this.fly(apiVars, apiFunctions);
                break;
            case "ranks":
                this.rank(apiVars, apiFunctions);
                break;

        */
        // this._cmds = this._cmds.sort(function (a, b) {
        //     var textA = a.category ? a.category.toUpperCase() : "UNCATEGORIZED";
        //     var textB = b.category ? b.category.toUpperCase() : "UNCATEGORIZED";
        //     return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        // });

        // this.warps

        this.ready();
        this.listenForEvents();
        this.test1();
        this.textGuiSessionMap = new Map();
        loadCommands();
        this.refreshSomeData();
    }
    getLanguageEntry(a) {
        let { args } = a;
        return { error: true, response: 1 };
    }
    on_item_use(eventData) {
        if (eventData.item.id == "pain:aaaaaaaaaaaaaaaaaaaa") {
            const textGuiTest = this.textGuiTest;
            if (!this.textGuiSessionMap.has(eventData.source.nameTag))
                this.textGuiSessionMap.set(eventData.source.nameTag, {
                    gui: textGuiTest,
                    player: eventData.source,
                    optionSelected: -1,
                    menu: "+MAIN",
                });
            let session = this.textGuiSessionMap.get(eventData.source.nameTag);
            const { gui, player } = session;
            if (!player.isSneaking) {
                session.optionSelected++;
                if (session.optionSelected > gui.options.length)
                    session.optionSelected = 0;
            }
            let gui_options =
                session.menu == "+MAIN"
                    ? JSON.parse(JSON.stringify(gui.options))
                    : JSON.parse(
                          JSON.stringify(
                              gui.submenus.find(
                                  (submenu) => submenu.name == session.menu
                              ).options
                          )
                      );
            if (session.optionSelected > gui_options.length)
                session.optionSelected = 0;

            if (player.isSneaking) {
                let menu1 =
                    session.menu == "+MAIN"
                        ? JSON.parse(JSON.stringify(gui.options))
                        : JSON.parse(
                              JSON.stringify(
                                  gui.submenus.find(
                                      (submenu) => submenu.name == session.menu
                                  ).options
                              )
                          );
                menu1.push({
                    text: "§cExit",
                    type: "Main",
                });
                let selectedOption = menu1[session.optionSelected];
                if (selectedOption.type == "Submenu") {
                    session.menu = selectedOption.load;
                    session.optionSelected = 0;
                    gui_options =
                        session.menu == "+MAIN"
                            ? JSON.parse(JSON.stringify(gui.options))
                            : JSON.parse(
                                  JSON.stringify(
                                      gui.submenus.find(
                                          (submenu) =>
                                              submenu.name == session.menu
                                      ).options
                                  )
                              );
                } else if (selectedOption.type == "Command") {
                    player.runCommand(selectedOption.command);
                } else if (selectedOption.type == "Main") {
                    if (session.menu == "+MAIN") {
                        this.textGuiSessionMap.delete(eventData.source.nameTag);
                        eventData.source.onScreenDisplay.setActionBar(
                            "§cExiting"
                        );
                        eventData.source.onScreenDisplay.clearTitle();
                        return;
                    }
                    session.menu = "+MAIN";
                    session.optionSelected = 0;
                    gui_options = JSON.parse(JSON.stringify(gui.options));
                } else if (selectedOption.type == "Tag") {
                    player.addTag(selectedOption.tag);
                }
            }
            // if(session.menu == "+MAIN") {
            let options = [];
            for (const option of gui_options) {
                options.push([
                    option.text,
                    gui_options.indexOf(option) == session.optionSelected,
                ]);
            }
            options.push([
                "§cExit",
                gui_options.length == session.optionSelected,
            ]);
            let text = [];
            // text.push(`§3${session.menu == "+MAIN" ? "Main" : gui.submenus.find(submenu=>submenu.name==session.menu).title}`)
            text.push(
                `${this.LangEn.header1.replace(
                    "$HEADERTEXT",
                    `${
                        session.menu == "+MAIN"
                            ? "Main"
                            : gui.submenus.find(
                                  (submenu) => submenu.name == session.menu
                              ).title
                    }`
                )}`
            );
            for (const option of options) {
                text.push(
                    option[1]
                        ? `§l> ${option[0]} §r§l<`
                        : `§r> ${option[0]} §r<`
                );
            }
            text.push(
                "\n§rShift + Right Click §bSelect Option\n§rRight Click §bScroll"
            );
            player.onScreenDisplay.setActionBar(text.join("§r\n§r"));
            // }
        }
    }
    show_text_gui() {
        for (const player1 of world.getPlayers()) {
            const textGuiTest = this.textGuiTest;
            if (!this.textGuiSessionMap.has(player1.nameTag)) return;
            let session = this.textGuiSessionMap.get(player1.nameTag);
            const { gui, player } = session;
            let gui_options = gui.options;
            gui_options =
                session.menu == "+MAIN"
                    ? JSON.parse(JSON.stringify(gui.options))
                    : JSON.parse(
                          JSON.stringify(
                              gui.submenus.find(
                                  (submenu) => submenu.name == session.menu
                              ).options
                          )
                      );
            if (session.optionSelected > gui_options.length)
                session.optionSelected = 0;
            let options = [];
            for (const option of gui_options) {
                options.push([
                    option.text,
                    gui_options.indexOf(option) == session.optionSelected,
                ]);
            }
            options.push([
                "§cExit",
                gui_options.length == session.optionSelected,
            ]);
            let text = [];
            text.push(
                `${this.LangEn.header1.replace(
                    "$HEADERTEXT",
                    `${
                        session.menu == "+MAIN"
                            ? "Main"
                            : gui.submenus.find(
                                  (submenu) => submenu.name == session.menu
                              ).title
                    }`
                )}`
            );
            for (const option of options) {
                text.push(
                    option[1]
                        ? `§l> ${option[0]} §r§l<`
                        : `§r> ${option[0]} §r<`
                );
            }
            text.push(
                "\n§rShift + Right Click §bSelect Option\n§rRight Click §bScroll"
            );
            player.onScreenDisplay.setActionBar(text.join("§r\n§r"));
        }
    }
    tagExecution(player) {
        let commandTags = player
            .getTags()
            .filter((tag) => tag.startsWith("command:"));
        if (commandTags && commandTags.length) {
            for (const tag of commandTags) {
                let args = tag.split(" ");
                args[0] = args[0].substring(8);
                if (args[0] == "WARP_TP") {
                    args.shift();
                    this.teleportPlayerToWarp(args.join(" "), player.nameTag);
                }
                player.removeTag(tag);
            }
        }
    }
    loreTextManager(apiVars, apiFns) {}
    getObjective() {
        // let objective = world.scoreboard.getObjective("test1");
        // return objective;
    }
    getConfig() {}
    keys(table = "default") {
        let objective = world.scoreboard.getObjective(`DB_${table}`);
    }
    debugCmd(apiVars, apiFns) {
        if (apiVars.args.length) {
            let test = apiVars.args[0];
            switch (test) {
                case "date-format-1":
                    let date = new Date(),
                        dateFormat = new DateFormat(date),
                        text = dateFormat.format1();
                    return this.tellraw(
                        apiVars.username,
                        `§c--- Result ---\n§r${text}\n\n§aSuccessfully ran ${test} at §2${text}`
                    );
                case "test-1":
                    apiVars.player.onScreenDisplay.setTitle("Test Title");
                    apiVars.player.onScreenDisplay.updateSubtitle(
                        "Test Subtitle"
                    );
                    break;
                // case "fly":
                //     apiVars.player.triggerEvent("azalea:set_can_fly");
                //     break;
                // case "unfly":
                //     apiVars.player.triggerEvent("azalea:set_cannot_fly");
                //     break;
            }
        }
    }
    fly(apiVars, apiFns) {
        const { player, username } = apiVars;
        if (!this.isAdmin(username))
            return this.dialog_no_admin(
                "fly",
                apiFns.tellraw,
                apiVars.username
            );
        if (player.hasTag("IsFlying")) {
            player.removeTag("IsFlying");
            this.runCmd(`ability "${username}" mayfly false`);
            this.tellraw(username, `§cYou cant fly anymore`);
        } else {
            player.addTag("IsFlying");
            this.runCmd(`ability "${username}" mayfly true`);
            this.tellraw(
                username,
                `§aYou can fly now (Unless education edition is disabled)`
            );
        }
    }
    test1() {
        // world.setDynamicProperty("test1","test property");
        // // console.warn(world.getDynamicProperty("test1"))
        // return;
        // let objective = this.getObjective("test1");
        // let participants = objective.getParticipants();
        // for(let i = 0;i < participants.length;i++) {
        //     if(participants[i].displayName == "commands.scoreboard.players.offlinePlayerName") {
        //         // console.warn(participants[i].getEntity().nameTag);
        //     } else {
        //         // console.warn(participants[i].displayName)
        //     }
        // }
    }
    setv2(key, val, table) {}
    runCmd(command, dimension = world.getDimension("overworld")) {
        try {
            return {
                error: false,
                ...world.getDimension(`overworld`).runCommand(command),
            };
        } catch (e) {
            return { error: true, errorText: e };
        }
    }
    // set(key,val) {
    //     try {
    //     let overworld = world.getDimension('overworld');
    //     let query = new EntityQueryOptions();
    //     query.type = 'azalea:data';
    //     let entities = overworld.getEntitiesAtBlockLoaction(new BlockLocation(0,2,0));
    //     let res = this.runCmd(`testfor @e[type=azalea:data]`);
    //     if(res.error) {
    //         overworld.runCommand(`summon azalea:data 0 2 0`);
    //         overworld.runCommand(`tickingarea add circle 0 2 0 4 azalea_tickingarea_dont_delete`);
    //         entities = overworld.getEntities(query);
    //     }
    //     let dataEntity = entities[0];
    //     // // console.warn(`DATAENTITIES.LENGTH:${entities.length}`);
    //     let tags = dataEntity.getTags();
    //     if(tags && tags.length) {
    //         let data = tags[0];
    //         dataEntity.removeTag(data);
    //         let json = JSON.parse(data);
    //         if(typeof val !== "function") json[key] = val;
    //         dataEntity.addTag(JSON.stringify(json));
    //     } else {
    //         let json = {};
    //         if(typeof val !== "function") json[key] = val;
    //         dataEntity.addTag(JSON.stringify(json));
    //     }
    //     } catch(e) {
    //         // // console.warn(e);
    //     }
    // }
    // get(key) {
    //     let overworld = world.getDimension('overworld');
    //     let query = new EntityQueryOptions();
    //     query.type = 'azalea:data';
    //     let entities = overworld.getEntitiesAtBlockLoaction(new BlockLocation(0.5,2,0.5));
    //     let res = this.runCmd(`testfor @e[type=azalea:data]`);
    //     if(res.error) {
    //         overworld.runCommand(`summon azalea:data 0 2 0`);
    //         overworld.runCommand(`tickingarea add circle 0 2 0 4 azalea_tickingarea_dont_delete`);
    //         entities = overworld.getEntities(query);
    //     }
    //     let dataEntity = entities[0];
    //     let tags = dataEntity.getTags();
    //     if(tags && tags.length) {
    //         let data = tags[0];
    //         dataEntity.removeTag(data);
    //         let json = JSON.parse(data);
    //         if(Object.keys(json).indexOf(key) > -1) {
    //             return json[key];
    //         } else {
    //             return null;
    //         }
    //     } else {
    //         return null;
    //     }
    // }
    set(key, val, table = null) {
        const len = val.length,
            _table = table ? table : "default";
        // if (!this.runCmd(`testfor @a[tag=berpUser,tag=azaleaSmartDb]`).error) {
        //     let BERP_EVENT_DATA = {
        //         berp: {
        //             event: "AzaleaDBSet",
        //             key,
        //             value: val,
        //             table: _table,
        //         },
        //     };
        //     this.runCmd(
        //         `tellraw @a[tag=berpUser,tag=azaleaSmartDb] {"rawtext":[{"text":${JSON.stringify(
        //             JSON.stringify(BERP_EVENT_DATA)
        //         )}}]}`
        //     );
        //     return;
        // }
        // if (_table == "offline") return;
        // this.runCmd(`scoreboard objectives add DB_${_table} dummy`);
        // this.delete(key, _table);
        // this.runCmd(`scoreboard players set "Len${key}" DB_${_table} ${len}`);
        // for (let i = 0; i < len; i++) {
        //     this.runCmd(
        //         `scoreboard players set "${key}${i}" DB_${_table} ${val[
        //             i
        //         ].charCodeAt()}`
        //     );
        // }
        // WAYPOINT1
        
        // Database V2
        // Written by TRASH
        try {
            try {
                
                let text = JSON.parse(de(mc.world.getDynamicProperty("db")));
                if(!text[_table]) text[_table] = {};
                text[_table][key] = val;
                mc.world.setDynamicProperty("db", en(JSON.stringify(text)));
            } catch(e1) {
                this.tellraw("@a[tag=admin]", `§c§lDatabase ${_table} is full!`);
                console.warn("e1", e1);
                try {
                    // new mc.DynamicPropertiesDefinition().defineString("db", 10000);
                    mc.world.setDynamicProperty("db", en(JSON.stringify({[_table]: {[key]: val}})));    
                } catch(e3) {
                    console.warn("e3", e3);
                    this.tellraw("@a[tag=admin]", `§c§lDatabase ${"db"} is full!`);
                }
            }
        } catch(e2) {
            console.warn("e2", e2);
            try {
                new mc.DynamicPropertiesDefinition().defineString(_table, 10000);
                mc.world.setDynamicProperty("db", en(JSON.stringify({[_table]: {[key]: val}})));    
            } catch(e3) {
                console.warn("e3", e3);
                this.tellraw("@a[tag=admin]", `§c§lDatabase ${"db"} is full!`);
            }
        }
    }
    setv1(key, val, table = null) {
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

    get(key, table = null) {
        const _table = table ? table : "default",
            len = this.getScore(`DB_${_table}`, `Len${key}`);
        // if (!this.runCmd(`testfor @a[tag=berpUser,tag=azaleaSmartDb]`).error) {
            // let BERP_EVENT_DATA = {
            //     berp: {
            //         event: "AzaleaDBGet",
            //         key,
            //         table: _table,
            //     },
            // };
            // this.runCmd(
            //     `tellraw @a[tag=berpUser,tag=azaleaSmartDb] {"rawtext":[{"text":${JSON.stringify(
            //         JSON.stringify(BERP_EVENT_DATA)
            //     )}}]}`
            // );
            // while (
            //     !this.pendingAzaleaStringMessageRequestsFromBerpBot.length
            // ) {}

            // let response =
            //     this.pendingAzaleaStringMessageRequestsFromBerpBot[0];
            // this.pendingAzaleaStringMessageRequestsFromBerpBot = [];
        // }
        // return result;
        try {
            let text = JSON.parse(de(mc.world.getDynamicProperty("db")));
            return text[_table][key];
        } catch(e) {
            return "";
        }
    }

    delete(key, table = null) {
        const _table = table ? table : "default",
            len = this.getScore(`DB_${_table}`, `Len${key}`);
        if (!len) return;
        for (let i = 0; i < len; i++) {
            this.runCmd(`scoreboard players reset "${key}${i}" DB_${_table}`);
        }
        this.runCmd(`scoreboard players reset "Len${key}"`);
    }
    top(player, commandMode = false) {
        console.warn('topping')
        if(commandMode) player = player.player;
        // const buildHeight = 320,
        //     isHighest = (currentY, p) => this.runCmd(`testforblock ${Math.trunc(p.location.x)} ${currentY - 1} ${Math.trunc(p.location.z)} air`).error;
        player.runCommand(`spreadplayers ~ ~ 1 2 @s`);
    }
    tellraw(selector, text) {
        // return this.runCmd(`tellraw ${selector.startsWith('@') ? selector : `"${selector}"`} {"rawtext":[{"text":"TRASH"}]}`);
        // text += "§¥";
        if (selector == "@a") {
            this.runCmd(
                `tellraw @a[tag=detailed_font] {"rawtext":[{"text":${JSON.stringify(
                    "§¥" + text
                )}}]}`
            );
            this.runCmd(
                `tellraw @a[tag=!detailed_font] {"rawtext":[{"text":${JSON.stringify(
                    text
                )}}]}`
            );
        } else {
            if (selector.startsWith("@"))
                this.runCmd(
                    `tellraw ${
                        selector.startsWith("@") ? selector : `"${selector}"`
                    } {"rawtext":[{"text":${JSON.stringify(text)}}]}`
                );
            else
                this.runCmd(
                    `tellraw ${
                        selector.startsWith("@") ? selector : `"${selector}"`
                    } {"rawtext":[{"text":${JSON.stringify(
                        `${
                            this.hasTag(selector, "detailed_font") ? `§¥` : ``
                        }` + text
                    )}}]}`
                );
        }
    }
    hasTag(player, tag) {
        const allTags = this.getTags(player, this.runCmd);
        if (!allTags) return false;
        for (const Tag of allTags)
            if (
                Tag.replace(/§./g, "").match(
                    new RegExp(`^${tag.replace(/§./g, "")}$`)
                )
            )
                return true;
        return false;
    }
    getScore(
        objective,
        player,
        customRunCmdFunction = null,
        { minimum, maximum } = {}
    ) {
        let RCmd = customRunCmdFunction ? customRunCmdFunction : this.runCmd;
        const data = RCmd(
            `scoreboard players test "${player}" ${objective} ${
                minimum ? minimum : "*"
            } ${maximum ? maximum : "*"}`
        );
        if (data.error) return;
        return parseInt(data.statusMessage.match(/-?\d+/)[0]);
    }
    tpsend(apiVars, apiFns) {
        let args = apiVars.msg.message.split(" ");
        args.shift();
        let code = this.randDigits(5);
        if (args.length) {
            if (args[0] == "send") {
                args.shift();
                let player = args.join(" ");
                this.tellraw(
                    player,
                    `§e${
                        apiVars.username
                    } §ahas invited you to teleport to them! Type §d${this.getPrefix()}tp to ${code}`
                );
                this.tpMap.set(code.toString(), [
                    apiVars.player.location.x,
                    apiVars.player.location.y,
                    apiVars.player.location.z,
                    apiVars.player.dimension.id,
                ]);
                this.tellraw(apiVars.username, `§aSent!`);
            } else if (args[0] == "to") {
                args.shift();
                if (this.tpMap.has(args.join(" "))) {
                    let data = this.tpMap.get(args.join(" "));
                    let loc = new Location(data[0], data[1], data[2]);
                    apiVars.player.teleport(
                        loc,
                        world.getDimension(data[3]),
                        0,
                        0
                    );
                    this.tellraw(apiVars.username, `§aTeleported!`);
                } else {
                    this.tellraw(apiVars.username, `§aInvalid.`);
                }
            }
        }
    }
    pwarp(apiVars, apiFns) {
        let player = apiVars.player;
        let args = apiVars.args;
        if (args.length) {
            if (args[0] == "set") {
                args.shift();
                let tag = player
                    .getTags()
                    .find((tagName) =>
                        tagName.startsWith(
                            `PersonalWarp:[name:${args.join(" ")}`
                        )
                    );
                if (tag) {
                    player.removeTag(tag);
                }
                player.addTag(
                    `PersonalWarp:[name:${args.join(" ")}] [x:${
                        player.location.x
                    }] [y:${player.location.y}] [z:${
                        player.location.z
                    }] [dimension:${player.dimension.id}]`
                );
                this.tellraw(
                    player.nameTag,
                    `§aSuccessfully added personal warp!`
                );
            } else if (args[0] == "delete") {
                args.shift();
                let tag = player
                    .getTags()
                    .find((tagName) =>
                        tagName.startsWith(
                            `PersonalWarp:[name:${args.join(" ")}`
                        )
                    );
                if (tag) player.removeTag(tag);
                this.tellraw(
                    player.nameTag,
                    `§aSuccessfully removed personal warp!`
                );
            } else if (args[0] == "tp") {
                args.shift();
                let tag = player
                    .getTags()
                    .find((tagName) =>
                        tagName.startsWith(
                            `PersonalWarp:[name:${args.join(" ")}`
                        )
                    );
                let r = /\[([\s\S]*?)\]/g;
                if (tag) {
                    let values = tag.match(r);
                    if (values.length) {
                        let name = values.find((val) =>
                            val.startsWith("[name:")
                        );
                        let x = values.find((val) => val.startsWith("[x:"));
                        let y = values.find((val) => val.startsWith("[y:"));
                        let z = values.find((val) => val.startsWith("[z:"));
                        let dimension = values.find((val) =>
                            val.startsWith("[dimension:")
                        );
                        if (name && x && y && z && dimension) {
                            player.teleport(
                                new Location(
                                    parseFloat(x.substring(3).slice(0, -1)),
                                    parseFloat(y.substring(3).slice(0, -1)),
                                    parseFloat(z.substring(3).slice(0, -1))
                                ),
                                world.getDimension(
                                    dimension.substring(11).slice(0, -1)
                                ),
                                0,
                                0
                            );
                        }
                    }
                }
            }
        } else {
            const warps = player
                .getTags()
                .filter((tag) => tag.startsWith("PersonalWarp:"))
                .map((tag) => tag.replace("PersonalWarp:", ""))
                .map((tagName) => {
                    let matchedString = tagName.match(/\[([\s\S]*?)\]/g);
                    if (matchedString && matchedString.length) {
                        let name = matchedString.find((val) =>
                            val.startsWith("[name:", "")
                        );
                        if (name && name.length) {
                            return name.substring(6).slice(0, -1);
                        } else {
                            return "Name Not Found";
                        }
                    } else {
                        return "Name Not Found";
                    }
                });
            if (warps && warps.length) {
                this.tellraw(
                    player.nameTag,
                    `§d--- Personal Warps---\n§b${warps.join("§r§7,\n§b")}`
                );
            } else {
                this.tellraw(player.nameTag, `§cYou have no warps!`);
            }
        }
    }

    pwarpSilent(apiVars, apiFns) {
        let player = apiVars.player;
        let args = apiVars.msg.message.split(" ");
        args.shift();
        if (args.length) {
            if (args[0] == "set") {
                args.shift();
                let tag = player
                    .getTags()
                    .find((tagName) =>
                        tagName.startsWith(
                            `PersonalWarp:[name:${args.join(" ")}`
                        )
                    );
                if (tag) {
                    player.removeTag(tag);
                }
                player.addTag(
                    `PersonalWarp:[name:${args.join(" ")}] [x:${
                        player.location.x
                    }] [y:${player.location.y}] [z:${
                        player.location.z
                    }] [dimension:${player.dimension.id}]`
                );
                // this.tellraw(
                //     player.nameTag,
                //     `§aSuccessfully added personal warp!`
                // );
            } else if (args[0] == "delete") {
                args.shift();
                let tag = player
                    .getTags()
                    .find((tagName) =>
                        tagName.startsWith(
                            `PersonalWarp:[name:${args.join(" ")}`
                        )
                    );
                if (tag) player.removeTag(tag);
                // this.tellraw(
                //     player.nameTag,
                //     `§aSuccessfully removed personal warp!`
                // );
            } else if (args[0] == "tp") {
                args.shift();
                let tag = player
                    .getTags()
                    .find((tagName) =>
                        tagName.startsWith(
                            `PersonalWarp:[name:${args.join(" ")}`
                        )
                    );
                let r = /\[([\s\S]*?)\]/g;
                if (tag) {
                    let values = tag.match(r);
                    if (values.length) {
                        let name = values.find((val) =>
                            val.startsWith("[name:")
                        );
                        let x = values.find((val) => val.startsWith("[x:"));
                        let y = values.find((val) => val.startsWith("[y:"));
                        let z = values.find((val) => val.startsWith("[z:"));
                        let dimension = values.find((val) =>
                            val.startsWith("[dimension:")
                        );
                        if (name && x && y && z && dimension) {
                            player.teleport(
                                new Location(
                                    parseFloat(x.substring(3).slice(0, -1)),
                                    parseFloat(y.substring(3).slice(0, -1)),
                                    parseFloat(z.substring(3).slice(0, -1))
                                ),
                                world.getDimension(
                                    dimension.substring(11).slice(0, -1)
                                ),
                                0,
                                0
                            );
                        }
                    }
                }
            }
        } else {
            const warps = player
                .getTags()
                .filter((tag) => tag.startsWith("PersonalWarp:"))
                .map((tag) => tag.replace("PersonalWarp:", ""))
                .map((tagName) => {
                    let matchedString = tagName.match(/\[([\s\S]*?)\]/g);
                    if (matchedString && matchedString.length) {
                        let name = matchedString.find((val) =>
                            val.startsWith("[name:", "")
                        );
                        if (name && name.length) {
                            return name.substring(6).slice(0, -1);
                        } else {
                            return "Name Not Found";
                        }
                    } else {
                        return "Name Not Found";
                    }
                });
            if (warps && warps.length) {
                // this.tellraw(
                //     player.nameTag,
                //     `§d--- Personal Warps---\n§b${warps.join("§r§7,\n§b")}`
                // );
            } else {
                // this.tellraw(player.nameTag, `§cYou have no warps!`);
            }
        }
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
    addBasicConfigScoreboard() {
        this.runCmd(`scoreboard objectives add basicConfig dummy`);
    }
    balance(apiVars, apiFns) {
        const { username } = apiVars;

        const playerBalance = this.getScore("money", username)
            ? this.getScore("money", username)
            : 0;

        if (playerBalance > 0) {
            this.tellraw(
                username,
                `§4<-=-=- §3§lYour Balance and Job§r  §r§4-=-=->`
            );
            this.tellraw(username, `§6§oBalance §r§f${playerBalance}$`);
            this.tellraw(username, "§6§oJob §r§cComing Soon");
        } else {
            this.tellraw(
                username,
                `§4<-=-=- §3§lYour Balance and Job§r  §r§4-=-=->`
            );
            this.tellraw(username, `§6§oBalance §r§c${playerBalance}$`);
            this.tellraw(username, "§6§oJob §r§cComing Soon");
            this.tellraw(
                username,
                "§cYou are so poor that the people at mcdonalds wouldn't hire you. Go ask for money on the streets first."
            );
        }
    }
    qtNoRain(apiVars, apiFns) {
        const { username, msg } = apiVars;
        const { tellraw } = apiFns;
        if (
            !this.hasTag(username, "v") &&
            !this.hasTag(username, "staff") &&
            !this.hasTag(username, "admin")
        )
            return this.dialog_no_admin("qt-no-rain", tellraw, username);
        let toggleString = "noRain";
        let toggleText = "No Rain";
        let currentToggle = this.getScore("basicConfig", toggleString)
            ? this.getScore("basicConfig", toggleString)
            : 0;
        if (currentToggle) {
            this.tellraw(username, `§4Disabled ${toggleText}`);
            this.runCmd(`scoreboard players set ${toggleString} basicConfig 0`);
        } else {
            this.tellraw(username, `§2Enabled ${toggleText}`);
            this.runCmd(`scoreboard players set ${toggleString} basicConfig 1`);
        }
    }
    qtAlwaysDay(apiVars, apiFns) {
        const { username, msg } = apiVars;
        const { tellraw } = apiFns;
        if (
            !this.hasTag(username, "v") &&
            !this.hasTag(username, "staff") &&
            !this.hasTag(username, "admin")
        )
            return this.dialog_no_admin("qt-day", tellraw, username);
        let toggleString = "alwaysDay";
        let toggleText = "Always Day";
        let currentToggle = this.getScore("basicConfig", toggleString)
            ? this.getScore("basicConfig", toggleString)
            : 0;
        if (currentToggle) {
            this.tellraw(username, `§4Disabled ${toggleText}`);
            this.runCmd(`scoreboard players set ${toggleString} basicConfig 0`);
        } else {
            this.tellraw(username, `§2Enabled ${toggleText}`);
            this.runCmd(`scoreboard players set ${toggleString} basicConfig 1`);
        }
    }
    qtGamemode(apiVars, apiFns) {
        const { username, msg } = apiVars;
        const { tellraw } = apiFns;
        if (
            !this.hasTag(username, "v") &&
            !this.hasTag(username, "staff") &&
            !this.hasTag(username, "admin")
        )
            return this.dialog_no_admin("qt-gm", tellraw, username);
        this.tellraw(
            `@a[name="${username}",m=c]`,
            `§4You are now in survival mode`
        );
        let survivalCommandResults = this.runCmd(
            `gamemode s @a[name="${username}",m=c]`
        );
        if (!survivalCommandResults.error) return;
        this.tellraw(
            `@a[name="${username}",m=s]`,
            `§2You are now in creative mode`
        );
        this.runCmd(`gamemode c @a[name="${username}",m=s]`);
    }
    mute(apiVars, apiFns) {
        const { username, msg } = apiVars;
        const { tellraw } = apiFns;
        let args = msg.message.split(" ");
        args.shift();
        const player = args.join(" ");
        if (
            !this.hasTag(username, "v") &&
            !this.hasTag(username, "staff") &&
            !this.hasTag(username, "admin")
        )
            return this.dialog_no_admin("mute", tellraw, username);
        let results = this.runCmd(`tag @a[name="${player}"] add muted`);
        if (results.error)
            this.tellraw(
                username,
                "§4I couldn't find §e@" +
                    player +
                    " §r§4or they were already muted."
            );
        else this.tellraw(username, "§9You muted §e@" + player);
    }
    unmute(apiVars, apiFns) {
        const { username, msg } = apiVars;
        const { tellraw } = apiFns;
        let args = msg.message.split(" ");
        args.shift();
        const player = args.join(" ");
        if (
            !this.hasTag(username, "v") &&
            !this.hasTag(username, "staff") &&
            !this.hasTag(username, "admin")
        )
            return this.dialog_no_admin("unmute", tellraw, username);
        let results = this.runCmd(`tag @a[name="${player}"] remove muted`);
        if (results.error)
            this.tellraw(
                username,
                "§4I couldn't find §e@" +
                    player +
                    " §r§4or they were not muted."
            );
        else this.tellraw(username, "§9You unmuted §e@" + player);
    }
    toggleWorldBorder(apiVars, apiFns) {
        const { username } = apiVars;
        const { tellraw } = apiFns;
        if (
            !this.hasTag(username, "v") &&
            !this.hasTag(username, "staff") &&
            !this.hasTag(username, "admin")
        )
            return this.dialog_no_admin(
                "worldborder-toggle",
                tellraw,
                username
            );
        this.addBasicConfigScoreboard();
        let worldBorderEnabledNumber = this.getScore(
            "basicConfig",
            "WorldBorderEnabled"
        )
            ? this.getScore("basicConfig", "WorldBorderEnabled")
            : 0;
        let newNumber = worldBorderEnabledNumber == 0 ? 1 : 0;
        this.runCmd(
            `scoreboard players set WorldBorderEnabled basicConfig ${newNumber}`
        );
        if (newNumber)
            this.tellraw(
                username,
                "§6Enabled world border. Now set the size using §d!worldborder-size <number>"
            );
        else this.tellraw(username, "§4Disabled world border.");
    }
    azaleaVersion(apiVars, apiFns) {
        const { username } = apiVars;
        let major = this.getScore("AzlVersion", "major")
                ? this.getScore("AzlVersion", "major")
                : 0,
            minor = this.getScore("AzlVersion", "minor")
                ? this.getScore("AzlVersion", "minor")
                : 0,
            micro = this.getScore("AzlVersion", "minor")
                ? this.getScore("AzlVersion", "micro")
                : 0,
            nano = this.getScore("AzlVersion", "minor")
                ? this.getScore("AzlVersion", "nano")
                : 0,
            beta = this.getScore("AzlVersion", "minor")
                ? this.getScore("AzlVersion", "beta")
                : 0;
        let version = `${major}.${minor}.${micro}.${nano}${
            beta ? `b${beta}` : ``
        }`;
        this.tellraw(
            username,
            `§4<-=-=- §3§lAzalea Version Info §r§4-=-=->\n§6Version: §r§f${version} (Beta)\n§r§6API Version: §r§f1.0.1\n§r§6Plugin Support: §r§aYes`
        );
    }
    credits(apiVars, apiFns) {
        const { username } = apiVars;
        this.tellraw(
            username,
            `§4<-=-=- §3§lIdea People §r§4-=-=->\n§6ComicalDino §r§fPerson who suggested a lot of ideas here\n§6ImOnFnatik §r!pay, !fly\n§6Zumori §rA lot more ideas (secondary idea maker)\n§6TRASH §rI have a list of a lot of ideas that I forget about\n§6Blurred §rSlappers\n§6Emukettu §r!ban, §c!kick\n§6DarkHunter §ra skills addon, shopgui addon, custom commands addon and a land claim addon\n§r§4<-=-=- §3§lTrial Developers §r§4-=-=->\n§6CastAlmania\n§6Zumori\n§6mister art43`
        );
    }
    randomTip(apiVars, apiFns) {
        const { username } = apiVars;
        let tips = [
            "Use $PREFIXlore to add lore text to items",
            "Use $PREFIXhacked-items to get unobtainable items",
            "Create a book and name it notebook and it works as the new notes command",
            "I cant think of more",
        ];
        this.tellraw(
            username,
            `§d${tips[Math.floor(Math.random() * tips.length)].replace(
                /\$PREFIX/g,
                this.getPrefix()
            )}`
        );
    }
    chatCooldown(apiVars, apiFns) {
        const { username, msg } = apiVars;
        const { tellraw } = apiFns;
        if (
            !this.hasTag(username, "v") &&
            !this.hasTag(username, "staff") &&
            !this.hasTag(username, "admin")
        )
            return this.dialog_no_admin(
                "worldborder-toggle",
                tellraw,
                username
            );
        this.addBasicConfigScoreboard();
        const message = msg.message;
        let args = message.split(" ");
        args.shift();
        let number = args[0];
        let results = this.runCmd(
            `scoreboard players set ChatCooldown basicConfig ${number}`
        );
        if (results.error)
            return this.tellraw(
                username,
                "§4" +
                    number +
                    " is not a number, even I paid more attention to math than you."
            );
        this.tellraw(
            username,
            "§6Set chat cooldown to " + args[0] + " seconds."
        );
    }
    setWorldBorderSize(apiVars, apiFns) {
        const { username, msg } = apiVars;
        const { tellraw } = apiFns;
        if (
            !this.hasTag(username, "v") &&
            !this.hasTag(username, "staff") &&
            !this.hasTag(username, "admin")
        )
            return this.dialog_no_admin("worldborder-size", tellraw, username);
        const message = msg.message;

        let args = message.split(" ");
        args.shift();

        this.addBasicConfigScoreboard();
        if (args.length) {
            let number = args[0];
            if (this.stringOnlyContainsNumbers(number)) {
                this.tellraw(
                    username,
                    `§6Set world border size to §d§o${number}§r§6. This will not affect anything if the world border is disabled.`
                );
                return this.runCmd(
                    `scoreboard players set WorldBorderSize basicConfig ${number}`
                );
            } else {
                return this.tellraw(
                    username,
                    `§4${args.join(
                        " "
                    )} is not a number, even I paid more attention to math than you.`
                );
            }
        } else {
            this.tellraw(username, "§4Please include a number.");
        }
    }
    wild(apiVars, apiFns) {
        const { username, msg } = apiVars;
        const { tellraw } = apiFns;
        const message = msg.message;
        let args = message.split(" ");
        args.shift();
        let isAdmin =
            this.hasTag(username, "v") ||
            this.hasTag(username, "staff") ||
            this.hasTag(username, "admin");
        let minCoord = this.getScore("basicConfig", "WildMinCoord")
            ? this.getScore("basicConfig", "WildMinCoord")
            : 500;
        let maxCoord = this.getScore("basicConfig", "WildMaxCoord")
            ? this.getScore("basicConfig", "WildMaxCoord")
            : 10000;
        if (args.length && args[0] == "min-coord") {
            if (!isAdmin)
                return this.dialog_no_admin(
                    "wild min-coord",
                    tellraw,
                    username
                );
            if (!this.stringOnlyContainsNumbers(args[1]))
                return this.tellraw(username, `§c${args[1]} is not a number!`);
            let num = args[1];
            this.runCmd(`scoreboard objectives add basicConfig dummy`);
            this.runCmd(
                `scoreboard players set WildMinCoord basicConfig ${num}`
            );
            this.tellraw(
                username,
                "§6Set the minimum !wild coordinate to " + num
            );
            return;
        }
        if (args.length && args[0] == "max-coord") {
            if (!isAdmin)
                return this.dialog_no_admin(
                    "wild max-coord",
                    tellraw,
                    username
                );
            if (!this.stringOnlyContainsNumbers(args[1]))
                return this.tellraw(username, `§c${args[1]} is not a number!`);
            let num = args[1];
            this.runCmd(`scoreboard objectives add basicConfig dummy`);
            this.runCmd(
                `scoreboard players set WildMaxCoord basicConfig ${num}`
            );
            this.tellraw(
                username,
                "§6Set the maximum !wild coordinate to " + num
            );
            return;
        }
        const random = (min, max) =>
            Math.floor(Math.random() * (max - min)) + min;
        let rCoordX = random(minCoord, maxCoord);
        let rCoordZ = random(minCoord, maxCoord);
        let y = 325;
        this.runCmd(`tp "${username}" ${rCoordX} ${y} ${rCoordZ}`);
        this.runCmd(`effect "${username}" resistance 15 255 true`);
        this.top(apiVars, true);
    }
    home(apiVars, apiFns) {
        const { username, msg } = apiVars;
        const { tellraw } = apiFns;
        let args = msg.message.split(" ");
        args.shift();
        this.runCmd(`scoreboard objectives add HomeX dummy`);
        this.runCmd(`scoreboard objectives add HomeY dummy`);
        this.runCmd(`scoreboard objectives add HomeZ dummy`);
        if (args.length && args[0] == "set") {
            if (!this.getScore(`HomeX`, username))
                this.tellraw(username, "§aYou are not homeless anymore!");
            if (this.getScore(`HomeX`, username))
                this.tellraw(
                    username,
                    "§6I see you are trying to move out. Enjoy your new home!"
                );
            this.runCmd(
                `scoreboard players set "${username}" HomeX ${Math.trunc(
                    msg.sender.location.x
                )}`
            );
            this.runCmd(
                `scoreboard players set "${username}" HomeY ${Math.trunc(
                    msg.sender.location.y
                )}`
            );
            this.runCmd(
                `scoreboard players set "${username}" HomeZ ${Math.trunc(
                    msg.sender.location.z
                )}`
            );
            return;
        }
        let x = this.getScore(`HomeX`, username);
        let y = this.getScore(`HomeY`, username);
        let z = this.getScore(`HomeZ`, username);
        if (x != null && y != null && z != null) {
            x += 0.5;
            z += 0.5;
            if (y == 0) y += 0.01;
        }
        if (x && y && z) {
            this.runCmd(`tp "${username}" ${x} ${y} ${z}`);
            return this.tellraw(username, "§aI teleported you to your home!");
        } else {
            return this.tellraw(
                username,
                "§cImagine being homeless when all you have to do is type §o!home set"
            );
        }
    }
    commandTagCheck(name, apiVars, apiFns) {
        try {
            let cmdTags = JSON.parse(
                this.get(`cmdtags`, `cmdtags`)
                    ? this.get(`cmdtags`, `cmdtags`)
                    : "[]"
            );
            let commandTag = cmdTags.find((cmdTag) => cmdTag.cmd === name);
            if (commandTag) {
                if (!apiVars.args.length) {
                    let data = JSON.parse(
                        this.get(`cmdtag:${commandTag.cmd}`, `config2`)
                            ? this.get(`cmdtag:${commandTag.cmd}`, `config2`)
                            : "{}"
                    );
                    if (data && data.warp)
                        return this.teleportPlayerToWarp(
                            data.warp,
                            apiVars.player
                        );
                    if (
                        (data &&
                            data.requiredTag &&
                            apiVars.player.hasTag(data.requiredTag)) ||
                        !data.requiredTag
                    )
                        apiVars.player.addTag(commandTag.tag);

                    if (
                        data &&
                        data.requiredTag &&
                        !apiVars.player.hasTag(data.requiredTag)
                    ) {
                        this.tellraw(
                            apiVars.username,
                            `§cSorry, you cannot use this command. You require the ${data.requiredTag} tag to use it. If you are an admin, please type §4/tag @s add "${data.requiredTag}"§c`
                        );
                        return true;
                    }
                    return true;
                } else if (apiVars.args[0] == "/debug") {
                    this.tellraw(apiVars.username, `§a-- Main Info --`);
                    this.tellraw(
                        apiVars.username,
                        JSON.stringify(commandTag, null, 2)
                    );
                    let data = JSON.parse(
                        this.get(`cmdtag:${commandTag.cmd}`, `config2`)
                            ? this.get(`cmdtag:${commandTag.cmd}`, `config2`)
                            : "{}"
                    );
                    this.tellraw(apiVars.username, `§a-- Config --`);
                    this.tellraw(
                        apiVars.username,
                        JSON.stringify(data, null, 2)
                    );
                } else if (apiVars.args[0] == "/manage") {
                    // TAGCMD /MANAGE
                    if (!apiVars.player.hasTag("admin")) {
                        this.tellraw(
                            apiVars.username,
                            `§cYou need admin to manage custom commands!`
                        );
                        return false;
                    }
                    if (apiVars.args.length > 2) {
                        if (apiVars.args[1] == "set-warp") {
                            let data = JSON.parse(
                                this.get(`cmdtag:${commandTag.cmd}`, `config2`)
                                    ? this.get(
                                          `cmdtag:${commandTag.cmd}`,
                                          `config2`
                                      )
                                    : "{}"
                            );
                            data.warp = apiVars.args[2];
                            this.set(
                                `cmdtag:${commandTag.cmd}`,
                                JSON.stringify(data),
                                "config2"
                            );
                        }
                        if (apiVars.args[1] == "set-user-tag") {
                            let data = JSON.parse(
                                this.get(`cmdtag:${commandTag.cmd}`, `config2`)
                                    ? this.get(
                                          `cmdtag:${commandTag.cmd}`,
                                          `config2`
                                      )
                                    : "{}"
                            );
                            data.requiredTag = apiVars.args[2];
                            this.set(
                                `cmdtag:${commandTag.cmd}`,
                                JSON.stringify(data),
                                "config2"
                            );
                            this.tellraw(
                                apiVars.username,
                                `§aSet the required tag for ${this.getPrefix()}${
                                    commandTag.cmd
                                } to ${apiVars.args[2]}`
                            );
                        } else if (apiVars.args[1] == "set-description") {
                            let data = JSON.parse(
                                this.get(`cmdtag:${commandTag.cmd}`, `config2`)
                                    ? this.get(
                                          `cmdtag:${commandTag.cmd}`,
                                          `config2`
                                      )
                                    : "{}"
                            );
                            let args = JSON.parse(JSON.stringify(apiVars.args));
                            args.shift();
                            args.shift();
                            let description = args.join(" ");
                            data.description = description;
                            this.set(
                                `cmdtag:${commandTag.cmd}`,
                                JSON.stringify(data),
                                "config2"
                            );
                            this.tellraw(
                                apiVars.username,
                                `§aSet the description for ${this.getPrefix()}${
                                    commandTag.cmd
                                } to §r${description}`
                            );
                            let _cmd = this._cmds.find(
                                (_command) => _command.name == commandTag.cmd
                            );
                            if (_cmd) {
                                _cmd.description = description;
                            }
                        } else if (apiVars.args[1] == "set-category") {
                            let data = JSON.parse(
                                this.get(`cmdtag:${commandTag.cmd}`, `config2`)
                                    ? this.get(
                                          `cmdtag:${commandTag.cmd}`,
                                          `config2`
                                      )
                                    : "{}"
                            );
                            let args = JSON.parse(JSON.stringify(apiVars.args));
                            args.shift();
                            args.shift();
                            let description = args.join(" ");
                            data.category = description;
                            this.set(
                                `cmdtag:${commandTag.cmd}`,
                                JSON.stringify(data),
                                "config2"
                            );
                            this.tellraw(
                                apiVars.username,
                                `§aSet the category for ${this.getPrefix()}${
                                    commandTag.cmd
                                } to §r${description}`
                            );
                            let _cmd = this._cmds.find(
                                (_command) => _command.name == commandTag.cmd
                            );
                            if (_cmd) {
                                _cmd.category = description;
                            }
                        }
                    } else if (apiVars.args.length > 1) {
                        if (apiVars.args[1] == "selector-argument-toggle") {
                            let data = JSON.parse(
                                this.get(`cmdtag:${commandTag.cmd}`, `config2`)
                                    ? this.get(
                                          `cmdtag:${commandTag.cmd}`,
                                          `config2`
                                      )
                                    : "{}"
                            );
                            if (data && data.selectorArgument)
                                data.selectorArgument = false;
                            else data.selectorArgument = true;
                            this.set(
                                `cmdtag:${commandTag.cmd}`,
                                JSON.stringify(data),
                                "config2"
                            );
                            this.tellraw(
                                apiVars.username,
                                `§${
                                    data.selectorArgument
                                        ? "aEnabled"
                                        : "cDisabled"
                                }`
                            );
                        }
                    }
                } else {
                    let player = apiVars.args.join(" ");
                    let data = JSON.parse(
                        this.get(`cmdtag:${commandTag.cmd}`, `config2`)
                            ? this.get(`cmdtag:${commandTag.cmd}`, `config2`)
                            : "{}"
                    );
                    if (data && data.selectorArgument) {
                        if (
                            (data &&
                                data.requiredTag &&
                                apiVars.player.hasTag(data.requiredTag)) ||
                            !data.requiredTag
                        ) {
                            let otherPlayer = this.fetchPlayer(player);
                            if (otherPlayer) {
                                otherPlayer.addTag(commandTag.tag);
                                this.tellraw(
                                    apiVars.username,
                                    `§aExecuted command on §r${otherPlayer.nameTag}`
                                );
                            } else {
                                this.tellraw(
                                    apiVars.username,
                                    `§cCannot find §r${player}`
                                );
                            }
                        }

                        if (
                            data &&
                            data.requiredTag &&
                            !apiVars.player.hasTag(data.requiredTag)
                        ) {
                            this.tellraw(
                                apiVars.username,
                                `§cSorry, you cannot use this command. You require the ${data.requiredTag} tag to use it. If you are an admin, please type §4/tag @s add "${data.requiredTag}"§c`
                            );
                            return true;
                        }
                        return true;
                    }
                }
                return true;
            }
            return false;
        } catch (e) {
            return false;
        }
    }

    // <-=-=- Tag Command -=-=->
    // Made by TRASH
    tagcmd(apiVars, apiFns) {
        const { username, msg } = apiVars;
        const { tellraw } = apiFns;
        let isAdmin =
            this.hasTag(username, "v") ||
            this.hasTag(username, "staff") ||
            this.hasTag(username, "admin");
        if (!isAdmin) return this.dialog_no_admin("tagcmd", tellraw, username);
        let args = msg.message.split(" ");
        args.shift();
        if (!args.length)
            return this.tellraw(username, "§cPlease include an argument!");
        let cmdTags = JSON.parse(
            this.get(`cmdtags`, `cmdtags`)
                ? this.get(`cmdtags`, `cmdtags`)
                : "[]"
        );
        if (args[0] == "create") {
            let cmd = args[1];
            let tag = args[2];
            let cmdExists = this._cmds.find((e) => e.name == cmd)
                ? true
                : false;
            if (cmdExists)
                return this.tellraw(
                    username,
                    `§c${this.getPrefix()}${cmd} already exists!`
                );
            cmdTags.push({
                cmd,
                tag,
            });
            this._cmds.push({
                name: cmd,
                description: " ",
                category: "Command Tags (user-made)",
            });
            this.set(`cmdtags`, JSON.stringify(cmdTags), `cmdtags`);
            this.tellraw(
                username,
                `§aCreated ${this.getPrefix()}${cmd} and it will give you tag: ${tag}`
            );
        }
        if (args[0] == "view") {
            if (cmdTags.length) {
                for (let i = 0; i < cmdTags.length; i++) {
                    this.tellraw(
                        username,
                        `§9Command §f${cmdTags[i].cmd} §9Tag §f${cmdTags[i].tag} §dID §f${i}`
                    );
                }
            } else {
                this.tellraw(
                    username,
                    `§cThere are no command tags! Create one using §a!tagcmd §bcreate §d<Command> <Tag>`
                );
            }
        }
        if (args[0] == "remove") {
            // if (!this.stringOnlyContainsNumbers(args[1])) return this.tellraw(username, `§c"${args[1]}" is not a number!`);
            let cmdTag = cmdTags.find((t) => t.cmd == args[1]);
            if (cmdTag) {
                cmdTags.splice(cmdTags.indexOf(cmdTag), 1);
                this.tellraw(username, "§aSuccessfully removed command tag!");
                this.set(`cmdtags`, JSON.stringify(cmdTags), `cmdtags`);
                let _cmd = this._cmds.find((cmd) => cmd.name == cmdTag.cmd);
                if (_cmd) {
                    this._cmds.splice(this._cmds.indexOf(_cmd), 1);
                }
            }
        }
    }
    // <-=-=- View Logs Command -=-=->
    // Made by TRASH
    viewLogs(apiVars, apiFns) {
        const { username, msg } = apiVars;
        const { tellraw } = apiFns;

        let args = msg.message.split(" ");
        args.shift();

        if (args.length) {
            if (args[0] == "delete-all") {
                this.set(`activitylogs`, `[]`, `logs`);
                return this.tellraw(username, `§aDeleted logs`);
            }
            return this.tellraw(username, `§cInvalid subcommand!`);
        }

        let isAdmin =
            this.hasTag(username, "v") ||
            this.hasTag(username, "staff") ||
            this.hasTag(username, "admin");
        if (!isAdmin) return this.dialog_no_admin("logs", tellraw, username);
        let activityLogs = JSON.parse(
            this.get(`activitylogs`, `logs`)
                ? this.get(`activitylogs`, `logs`)
                : `[]`
        );
        // log.player-leave
        // log.player-join
        this.tellraw(
            username,
            this.LangEn.helpCategory.replace("$CategoryName", "Activity Logs")
        );
        let date, month, day, year, hours, minutes, seconds, playerName;
        if (activityLogs.length) {
            for (let i = 0; i < activityLogs.length; i++) {
                switch (activityLogs[i].type) {
                    case "log.player-join":
                        date = new Date(activityLogs[i].date);
                        month = date.getMonth() + 1;
                        day = date.getDate();
                        year = date.getUTCFullYear();
                        hours = date.getHours();
                        minutes = date.getMinutes();
                        seconds = date.getSeconds();
                        playerName = activityLogs[i].playerName
                            ? activityLogs[i].playerName
                            : activityLogs[i].name;
                        this.tellraw(
                            username,
                            `§r§f${playerName} joined at ${month}/${day}/${year} ${hours}:${minutes}:${seconds} UTC`
                        );
                        break;
                    case "log.player-leave":
                        date = new Date(activityLogs[i].date);
                        month = date.getMonth() + 1;
                        day = date.getDate();
                        year = date.getUTCFullYear();
                        hours = date.getHours();
                        minutes = date.getMinutes();
                        seconds = date.getSeconds();
                        playerName = activityLogs[i].playerName
                            ? activityLogs[i].playerName
                            : activityLogs[i].name;
                        this.tellraw(
                            username,
                            `§r§f${playerName} left at ${month}/${day}/${year} ${hours}:${minutes}:${seconds} UTC`
                        );
                        break;
                }
            }
        } else {
            this.tellraw(
                username,
                `§cThere are no activity logs right now. It's just sad how dead your realm/world is.`
            );
        }
    }
    friends(apiVars, apiFns) {
        const { username, msg } = apiVars;
        const { tellraw } = apiFns;
        let args = msg.message.split(" ");
        args.shift();
        let friends = JSON.parse(
            this.get(`friends:${username.toLowerCase()}`, `friends`)
                ? this.get(`friends:${username.toLowerCase()}`, `friends`)
                : "[]"
        );
        if (args.length && args[0] == "request") {
            args.shift();
            let otherFriends = JSON.parse(
                this.get(`friends:${args.join(" ").toLowerCase()}`)
                    ? this.get(`friends:${args.join(" ").toLowerCase()}`)
                    : "[]"
            );
            friends.push(args.join(" ").toLowerCase());
            this.set(
                `friends:${username.toLowerCase()}`,
                JSON.stringify(friends),
                `friends`
            );
            this.tellraw(
                username,
                "§r§aAdded §r§d" +
                    args.join(" ") +
                    " §r§aas a friend. Now wait for them to accept it, you can check with " +
                    this.getPrefix() +
                    "friends"
            );
            return;
        }
        if (args.length && args[0] == "accept") {
            args.shift();
            let player = args.join(" ");
            let otherFriends = JSON.parse(
                this.get(`friends:${args.join(" ").toLowerCase()}`)
                    ? this.get(`friends:${args.join(" ").toLowerCase()}`)
                    : "[]"
            );
            if (otherFriends.indexOf(username.toLowerCase()) > -1) {
                if (friends.indexOf(player.toLowerCase()) > -1)
                    return this.tellraw(
                        username,
                        "§cThis player is already in your friends list!"
                    );
                else friends.push(player.toLowerCase());
                this.tellraw(
                    username,
                    `§6Successfully accepted §e@${player}'s §afriend request!`
                );
                return;
            } else {
                this.tellraw(
                    username,
                    `§e${player} §r§cdoes not have you in their friends list`
                );
                return;
            }
            return;
        }
        if (friends.length) {
            this.tellraw(
                username,
                this.LangEn.helpCategory.replace("$CategoryName", "Friends")
            );
            for (let i = 0; i < friends.length; i++) {
                let otherFriends = JSON.parse(
                    this.get(`friends:${friends[i].toLowerCase()}`, `friends`)
                        ? this.get(
                              `friends:${friends[i].toLowerCase()}`,
                              `friends`
                          )
                        : "[]"
                );
                let pending = false;
                if (otherFriends.length) {
                    if (otherFriends.indexOf(username.toLowerCase()) > -1)
                        pending = false;
                    else pending = true;
                } else {
                    pending = true;
                }
                this.tellraw(
                    username,
                    this.LangEn.basicText.replace(
                        "$Text",
                        `${pending ? `§6§o(Pending) §r§f` : ``}${friends[i]}`
                    )
                );
            }
        } else {
            this.tellraw(username, "§cSorry, but you have no friends!");
        }
    }
    onWorldInitialize() {
        this.runCmd(`scoreboard objectives remove TMPnocmderr`);
        this.runCmd(`scoreboard objectives add TMPnocmderr dummy`);
    }
    announcements(apiVars, apiFns) {
        ///b
        const { username, msg } = apiVars;
        const { tellraw } = apiFns;
        let args = msg.message.split(" ");
        args.shift();
        let isAdmin =
            this.hasTag(username, "v") ||
            this.hasTag(username, "staff") ||
            this.hasTag(username, "admin");
        let announcements = JSON.parse(
            this.get(`serverannouncements`, `announce`)
                ? this.get(`serverannouncements`, `announce`)
                : "[]"
        );
        if (args.length && args[0] == "create") {
            if (!isAdmin)
                return this.dialog_no_admin(
                    "announcements create",
                    tellraw,
                    username
                );
            args.shift();
            announcements.push(args.join(" "));
            this.set(
                `serverannouncements`,
                JSON.stringify(announcements),
                `announce`
            );
            this.tellraw(username, "§aSuccessfully announced announcement!");
            this.tellraw(`@a`, `§l§d<§6Announcement§d> §a${args.join(" ")}`);
            return;
        }
        if (args.length && args[0] == "removelast") {
            if (!isAdmin)
                return this.dialog_no_admin(
                    "announcements removelast",
                    tellraw,
                    username
                );
            announcements.pop();
            this.set(
                `serverannouncements`,
                JSON.stringify(announcements),
                `announce`
            );
            this.tellraw(username, "§aSuccessfully removed announcement!");
            return;
        }
        this.tellraw(
            username,
            this.LangEn.helpCategory.replace("$CategoryName", "Announcements")
        );
        if (announcements.length) {
            announcements = announcements.reverse();
            for (let i = 0; i < announcements.length; i++) {
                let announcement = announcements[i];
                this.tellraw(username, "§6- §r§f" + announcement);
            }
        } else {
            this.tellraw(username, "§cThere are no announcements yet!");
        }
    }
    notes(apiVars, apiFns) {
        const { username, msg } = apiVars;
        const { tellraw } = apiFns;
        let notes = this.get(`notes:${username}`, `notes`)
            ? this.get(`notes:${username}`, `notes`)
            : "[]";
        notes = JSON.parse(notes);
        let args = msg.message.split(" ");
        args.shift();
        if (args.length) {
            if (args[0] == "add") {
                return this.tellraw(
                    apiVars.username,
                    `§cSorry, but as of azalea v0.3.0.4, you cannot add notes. Learn more at https://azalea.darealnill.com/deprecated/notes`
                );
                args.shift();
                let note = args.join(" ");
                if (note.length > 150)
                    return this.tellraw(
                        username,
                        "§cNote length cannot be over 150!"
                    );
                if (notes.length >= 45)
                    return this.tellraw(
                        username,
                        "§cYou cannot have over 45 notes!"
                    );
                notes.push(note);
                this.tellraw(username, "§aYou added a note!");
                this.set(`notes:${username}`, JSON.stringify(notes), "notes");
                return;
            }
            if (args[0] == "remove") {
                return this.tellraw(
                    apiVars.username,
                    `§cSorry, but as of azalea v0.3.0.4, you cannot remove notes. Learn more at https://azalea.darealnill.com/deprecated/notes`
                );
                let id = args[1];
                if (!this.stringOnlyContainsNumbers(id))
                    return this.tellraw(username, `§c${id} is not a number!`);
                notes.splice(parseInt(id), 1);
                this.set(`notes:${username}`, JSON.stringify(notes), "notes");
                return this.tellraw(username, "§6You removed a note!");
            }
        }
        this.tellraw(username, `< §aNotes §c(Deprecated) §r>`);
        if (notes.length) {
            for (let i = 0; i < notes.length; i++) {
                this.tellraw(username, `§d- ${notes[i]}`);
            }
        } else {
            this.tellraw(
                username,
                `§cNo notes have been added. Use §l§o!notes add <text> §r§cto add one.`
            );
        }
        // let player = msg.sender;
        // let args = msg.message.split(' ');
        // args.shift();
        // let notes = player.getDynamicProperty('notes') ? player.getDynamicProperty('notes') : [];
        // if(args.length && args[0] == "add") {
        //     args.shift();
        //     notes.push({
        //         text: args.join(' '),
        //         date: new Date().getTime()
        //     });
        //     player.setDynamicProperty('notes', notes);
        //     return this.tellraw(username,"§aAdded note!");
        // }
        // if(args.length && args[0] == "remove") {
        //     if(!this.stringOnlyContainsNumbers(args[1])) return this.tellraw(username, `§c${args[1]} is not a number!`);
        //     notes.splice(parseInt(args[1]), 1);
        //     player.setDynamicProperty('notes', notes);
        //     this.tellraw(username,`§cRemoved note!`);
        // }
        // if(notes.length) {
        //     for(let i = 0;i < notes.length;i++) {
        //         this.tellraw(username,`§d${notes[i].text} §a(ID: ${i})`);
        //     }
        // } else {
        //     this.tellraw(username,`§cYou have no notes!`);
        // }
    }
    clearChat(apiVars, apiFns) {
        const { username, msg } = apiVars;
        const { tellraw } = apiFns;
        const message = msg.message;
        let isAdmin =
            this.hasTag(username, "v") ||
            this.hasTag(username, "staff") ||
            this.hasTag(username, "admin");
        if (!isAdmin)
            return this.dialog_no_admin("clear-chat", tellraw, username);
        let messageContentTellraw =
            "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n§cChat cleared by §3" +
            username;
        this.runCmd(
            `tellraw @a {"rawtext":[{"text":${JSON.stringify(
                messageContentTellraw
            )}}]}`
        );
    }
    staffChat(apiVars, apiFns) {
        const { username, msg } = apiVars;
        const { tellraw } = apiFns;
        const message = msg.message;
        let args = message.split(" ");
        args.shift();
        let isAdmin =
            this.hasTag(username, "v") ||
            this.hasTag(username, "staff") ||
            this.hasTag(username, "admin");
        if (!isAdmin)
            return this.dialog_no_admin("staff-chat", tellraw, username);
        let isInStaffChat = this.hasTag(username, "staffchat");
        if (isInStaffChat) {
            this.runCmd(`tag "${username}" remove staffchat`);
            this.tellraw(username, `§cYou left staff chat`);
        } else {
            this.runCmd(`tag "${username}" add staffchat`);
            this.tellraw(username, `§aYou joined staff chat`);
        }
    }
    rules(apiVars, apiFns) {
        const { username, msg } = apiVars;
        const { tellraw } = apiFns;
        const message = msg.message;
        let args = message.split(" ");
        args.shift();
        let isAdmin =
            this.hasTag(username, "v") ||
            this.hasTag(username, "staff") ||
            this.hasTag(username, "admin");
        if (args.length && args[0] == "add-rule") {
            if (!isAdmin)
                return this.dialog_no_admin(
                    "rules add-rule",
                    tellraw,
                    username
                );
            let rules = this.get("rules", "rules")
                ? this.get("rules", "rules")
                : "[]";
            rules = JSON.parse(rules);
            args.shift();
            rules.push(args.join(" "));
            this.tellraw(
                username,
                "§6Added rule: §a" + rules[rules.length - 1] + " §6successfully"
            );
            this.set("rules", JSON.stringify(rules), "rules");
            return;
        }
        if (args.length && args[0] == "remove-rule") {
            if (!isAdmin)
                return this.dialog_no_admin(
                    "rules remove-rule",
                    tellraw,
                    username
                );
            let rules = this.get("rules", "rules")
                ? this.get("rules", "rules")
                : "[]";
            rules = JSON.parse(rules);
            let rulesC = JSON.parse(JSON.stringify(rules));
            this.tellraw(username, "§6Removed rule successfully");
            rules.splice(parseInt(args[1]), 1);
            this.set("rules", JSON.stringify(rules), "rules");
            return;
        }
        try {
            let rules = this.get("rules", "rules")
                ? this.get("rules", "rules")
                : "[]";
            rules = JSON.parse(rules);
            if (rules.length) {
                let rules2 = rules;
                rules2 = rules2.map((e) => {
                    return `${
                        isAdmin
                            ? `§aID: ${rules2.indexOf(e)} `
                            : `§6§o${rules2.indexOf(e) + 1}. `
                    }§r§f${e}`;
                });
                if (isAdmin)
                    this.tellraw(
                        username,
                        `§aUse §d§o!rules remove-rule <ID> §r§ato remove a rule!`
                    );
                this.tellraw(
                    username,
                    "§c<-=-=- §3§lRules§r  §r§c-=-=->\n§r§f" + rules2.join(`\n`)
                );
            }
        } catch (e) {
            this.tellraw(
                username,
                "§cThe admins didn't set the rules. Please contact an admin/owner to tell them to add all the rules here"
            );
        }
    }
    sinfo(apiVars, apiFns) {
        const { username, msg } = apiVars;
        const { tellraw } = apiFns;
        const message = msg.message;
        let args = message.split(" ");
        args.shift();
        if (args.length && args[0] == "set-name") {
            if (
                !this.hasTag(username, "v") &&
                !this.hasTag(username, "staff") &&
                !this.hasTag(username, "admin")
            )
                return this.dialog_no_admin(
                    "server set-name",
                    tellraw,
                    username
                );
            args.shift();
            let serverName = args.join(" ");
            this.set("servername", serverName, "sinfo");
            return this.tellraw(
                username,
                "§6Successfully set the server name to " + serverName
            );
        }
        if (args.length && args[0] == "set-description") {
            if (
                !this.hasTag(username, "v") &&
                !this.hasTag(username, "staff") &&
                !this.hasTag(username, "admin")
            )
                return this.dialog_no_admin(
                    "server set-description",
                    tellraw,
                    username
                );
            args.shift();
            let serverName = args.join(" ");
            this.set("serverdesc", serverName, "sinfo");
            return this.tellraw(
                username,
                "§6Successfully set the server description to " + serverName
            );
        }
        if (args.length && args[0] == "add-realm") {
            if (
                !this.hasTag(username, "v") &&
                !this.hasTag(username, "staff") &&
                !this.hasTag(username, "admin")
            )
                return this.dialog_no_admin(
                    "server add-realm",
                    tellraw,
                    username
                );
            args.shift();
            if (args.length) {
                let realmCode = args[0];
                // this.set("serverdesc", serverName, "sinfo");
                let realms = JSON.parse(
                    this.get("realms", "sinfo")
                        ? this.get("realms", "sinfo")
                        : "[]"
                );
                realms.push(realmCode);
                this.set("realms", JSON.stringify(realms), "sinfo");
                return this.tellraw(
                    username,
                    "§6Successfully added realm with code: " + realmCode
                );
            }
            return;
        }
        if (args.length && args[0] == "delete-realms") {
            if (
                !this.hasTag(username, "v") &&
                !this.hasTag(username, "staff") &&
                !this.hasTag(username, "admin")
            )
                return this.dialog_no_admin(
                    "server delete-realms",
                    tellraw,
                    username
                );
            this.set("realms", "[]", "sinfo");
            return;
        }
        let serverName = this.get("servername", "sinfo")
            ? "§6§oServer Name §r§f" + this.get("servername", "sinfo")
            : "§6§oServer Name §r§cNot set";
        let serverDesc = this.get("serverdesc", "sinfo")
            ? "§6§oServer Description §r§f" + this.get("serverdesc", "sinfo")
            : "§6§oServer Description §r§cNot set";
        this.tellraw(username, "§c<-=-=- §3§lServer Info§r  §r§c-=-=->");
        this.tellraw(username, serverName);
        this.tellraw(username, serverDesc);
        let realms = JSON.parse(
            this.get("realms", "sinfo") ? this.get("realms", "sinfo") : "[]"
        );
        if (realms.length) {
            this.tellraw(username, "§c<-=-=- §3§lOther Realms§r  §r§c-=-=->");
            this.tellraw(username, `§r§d${realms.join("\n§r§d")}`);
        }
    }
    warn(apiVars, apiFns) {
        const { username, msg } = apiVars;
        const { tellraw } = apiFns;
        const message = msg.message;
        if (
            !this.hasTag(username, "v") &&
            !this.hasTag(username, "staff") &&
            !this.hasTag(username, "admin")
        )
            return this.dialog_no_admin("warn", tellraw, username);

        let args = message.split(" ");
        args.shift();

        const otherPlayer = args.join(" ");
        this.logAppend({
            type: "log.warned",
            date: new Date().getTime(),
            warnedPerson: otherPlayer,
            warner: username,
        });
        this.runCmd(`scoreboard objectives add warns dummy`);
        let warnResults = this.runCmd(
            `scoreboard players add @a[name="${otherPlayer}"] warns 1`
        );
        if (warnResults.error)
            return this.tellraw(
                username,
                "§4Couldn't find §e@" + otherPlayer + "."
            );
        else
            return this.tellraw(
                username,
                "§dSuccessfully warned §e@" + otherPlayer + "§d."
            );
    }
    warns(apiVars, apiFns) {
        const { username, msg } = apiVars;
        const message = msg.message;
        const { tellraw } = apiFns;
        if (
            !this.hasTag(username, "v") &&
            !this.hasTag(username, "staff") &&
            !this.hasTag(username, "admin")
        )
            return this.dialog_no_admin("warns", tellraw, username);

        let args = message.split(" ");
        args.shift();

        const otherPlayer = args.join(" ");
        let warns = this.getScore("warns", otherPlayer)
            ? this.getScore("warns", otherPlayer)
            : 0;
        this.tellraw(username, "§e@" + otherPlayer + ` §dhas ${warns} warns`);
    }
    killEntity(apiVars, apiFns) {
        let entities = apiVars.player.dimension.getEntitiesAtBlockLocation(
            new BlockLocation(
                Math.trunc(apiVars.player.location.x),
                Math.trunc(apiVars.player.location.y),
                Math.trunc(apiVars.player.location.z)
            )
        );
        if (entities && entities.length) {
            for (const entity of entities) {
                if (entity.id !== "minecraft:player") entity.kill();
            }
        }
    }
    parseEnchants(item) {
        let itemEnchantments = item.getComponent("enchantments").enchantments;
        // let allEnchantments2 = Array.from(allEnchantments);
        let allEnchantments = Object.values(MinecraftEnchantmentTypes);
        let enchants = [];
        for (let ench of allEnchantments) {
            // let enchantment = allEnchantments.getEnchantment(ench);
            // let enchantment = ench;
            if (itemEnchantments.hasEnchantment(ench)) {
                let enchantment = itemEnchantments.getEnchantment(ench);
                // // console.warn(`${enchantment.level}, ${enchantment.type.id}`);
                enchants.push({
                    level: enchantment.level,
                    type: enchantment.type.id,
                });
            }
        }
        return enchants.length ? enchants : null;
    }
    addShopItem(item) {
        if (!item) return "ITEM-NOT-DEFINED";
        let enchants = this.parseEnchants(item);
        let lore = item.getLore();
        let itemLore = lore && lore.length ? lore : null;
        let nameTag = item.nameTag ? item.nameTag : null;
        let type = item.id;
        let amount = item.amount ? item.amount : 1;
        let itemData = item.data ? item.data : 0;
        let data = {};
        if (enchants && enchants.length) data.enchants = enchants;
        if (itemLore && itemLore.length) data.lore = itemLore;
        if (nameTag) data.nameTag = nameTag;
        data.type = type;
        data.data = itemData;
        data.count = amount;
        this.set("test", JSON.stringify(data), "shop");
    }
    getShopItem() {
        if (!this.get("test", "shop")) return;
        let data = JSON.parse(this.get("test", "shop"));
        let type;
        for (const itemType of Object.values(MinecraftItemTypes)) {
            if (itemType.id == data.type) {
                type = itemType;
            }
        }
        let item = new ItemStack(data.type, data.count, data.data);
        item.nameTag = data.nameTag;
        if (data.lore) item.setLore(data.lore);
        if (data.enchantments) {
            let allEnchantments = Object.values(MinecraftEnchantmentTypes);
            let itemEnchantments =
                item.getComponent("enchantments").enchantments;
            for (let ench of allEnchantments) {
                if (data.enchantments.find((aa) => aa.type == ench.id)) {
                    let enchantment = data.enchantments.find(
                        (aa) => aa.type == ench.id
                    );
                    let level = enchantment.level;
                    itemEnchantments.addEnchantment(
                        new enchantment(ench, level)
                    );
                }
            }
        }
        return item;
    }
    on_weather_change(weather) {
        let rainingVal = weather.raining ? 1 : 0;
        let lightningVal = weather.lightning ? 1 : 0;
        if (rainingVal) this.runCmd(`tag @a add is_raining`);
        else this.runCmd(`tag @a remove is_raining`);

        if (lightningVal) this.runCmd(`tag @a add is_lightning`);
        else this.runCmd(`tag @a remove is_lightning`);

        this.runCmd(`scoreboard players set Raining WorldEnv ${rainingVal}`);
        this.runCmd(
            `scoreboard players set Lightning WorldEnv ${lightningVal}`
        );
    }
    command_toggle(apiVars, apiFns) {
        const { tellraw, runCmd } = apiFns;
        const { username, msg } = apiVars;
        if (!apiVars.player.hasTag("admin"))
            return this.dialog_no_admin(
                "toggle",
                apiFns.tellraw,
                apiVars.username
            );
        let args = msg.message.split(" ");
        args.shift();
        let restrictedCommands = [
            "help",
            "toggle",
            "mute",
            "warn",
            "unmute",
            "warns",
            "rules",
            "tempmute",
            "permban",
            "unpermban",
            "credits",
            "azalea-version",
        ];
        if (restrictedCommands.indexOf(args[0]) > -1)
            return this.tellraw(
                username,
                `§cYou cannot toggle ${this.getPrefix()}${args[0]}`
            );
        if ("CMD" + args[0].length > 13) {
            args[0] = args[0].slice(0, 13 - args[0].length);
        }
        let currentOption = this.getScoreQ("CMD" + args[0], "toggle_number");
        if (currentOption == null) currentOption = 0;
        currentOption++;
        let dialog = [
            `§aEnabled ${this.getPrefix()}${args[0]}`,
            `§e${this.getPrefix()}${args[0]} is now admin only!`,
            `§cDisabled ${this.getPrefix()}${args[0]}`,
            `§d${this.getPrefix()}${
                args[0]
            } is now only usable by people with the "§a§ocmd_${
                args[0]
            }§r§d" tag. This can be changed to ranks or tags\n§1Ranks:\n§a${this.getPrefix()}cmd §drank §e${
                args[0]
            } §e"Rank Name"\n§1Tags:\n§a${this.getPrefix()}cmd §dtag §e${
                args[0]
            } §e"Tag"`,
            `§d${this.getPrefix()}${
                args[0]
            } is now in command block only mode! (Request by shardokon)`,
        ];
        if (currentOption > 4) currentOption = 0;
        this.runCmd(`scoreboard objectives add "CMD${args[0]}" dummy`);
        this.runCmd(
            `scoreboard players set toggle_number "CMD${args[0]}" ${currentOption}`
        );
        this.tellraw(username, dialog[currentOption]);
    }
    dialog_no_admin(cmdname, tellraw, username) {
        let dialogMsg = `§cHello, @${username.replace(
            / /g,
            "_"
        )}. It seems like you don't have the admin tag, but you need it to use ${this.getPrefix()}${cmdname}. If you think this is an error, please contact the admins/owner for help.`;
        tellraw(username, dialogMsg);
        this.createSuccessSound(username);
    }
    dialog_disabled(cmdname, tellraw, username) {
        let dialogMsg = `§cHello, @${username.replace(
            / /g,
            "_"
        )}. I see that ${this.getPrefix()}${cmdname} is disabled. Please contact the admins/owner for help.`;
        tellraw(username, dialogMsg);
    }
    dialog_no_cmd_tag(cmdname, tellraw, username) {
        let dialogMsg = `§cHello, @${username.replace(
            / /g,
            "_"
        )}. You require a specific tag to use this command, but you do not have it. If you want to give the permission to use it to people then use "§4/tag <selector> add cmd_${cmdname}§c".`;
        tellraw(username, dialogMsg);
    }
    command_toggle_test(azaleaVars, azaleaFunctions) {
        const { tellraw, runCmd } = azaleaFunctions;
        const { username, msg } = azaleaVars;
        if (
            this.hasTag(username, "v") ||
            this.hasTag(username, "staff") ||
            this.hasTag(username, "admin")
        )
            return this.command_toggle(azaleaVars, azaleaFunctions);
        this.dialog_no_admin("toggle", tellraw, username);
    }
    set_warp(apiVars, apiFns, warpName, loc, fns) {
        const { tellraw, runCmd } = apiFns;
        const { username, msg } = apiVars;
        runCmd(`scoreboard objectives add "warp_${warpName}" dummy`);
        runCmd(
            `scoreboard players set x "warp_${warpName}" ${Math.trunc(loc[0])}`
        );
        runCmd(
            `scoreboard players set y "warp_${warpName}" ${Math.trunc(loc[1])}`
        );
        runCmd(
            `scoreboard players set z "warp_${warpName}" ${Math.trunc(loc[2])}`
        );
        try {
            fns.success(warpName, loc, tellraw, username);
        } catch (e) {
            tellraw("@a", `§c<§oDEBUG§r§c> §r§4§oError§r§f: §r§c§o${e}`);
        }
    }
    spawn(apiVars, apiFns) {
        const { username, msg } = apiVars;
        const { tellraw, runCmd } = apiFns;

        let args = msg.message.split(" ");
        args.shift();

        if (args.length && args[0] == "set") {
            if (
                this.hasTag(username, "v") ||
                this.hasTag(username, "staff") ||
                this.hasTag(username, "admin")
            ) {
                let loc = [
                    parseInt(msg.sender.location.x.toString().split(".")[0]),
                    parseInt(msg.sender.location.y.toString().split(".")[0]),
                    parseInt(msg.sender.location.z.toString().split(".")[0]),
                ];
                this.runCmd(`scoreboard objectives add WARPspawn dummy`);
                this.runCmd(`scoreboard players set x WARPspawn ${loc[0]}`);
                this.runCmd(`scoreboard players set y WARPspawn ${loc[1]}`);
                this.runCmd(`scoreboard players set z WARPspawn ${loc[2]}`);
                this.runCmd(`scoreboard players set dimension WARPspawn 0`);
                tellraw(
                    username,
                    `§6Spawn has been set at §c${loc[0]}, §a${loc[1]}, §b${loc[2]}§6!`
                );
            } else {
                this.dialog_no_admin("spawn set", tellraw, username);
            }
            return;
        }

        if (this.teleportPlayerToWarp("spawn", apiVars.msg.sender).error)
            return this.tellraw(username, `§cCannot find spawn!`);
        else
            return this.tellraw(
                username,
                `§aYou have been teleported to spawn!`
            );
    }
    teleportPlayer(playername, [x, y, z]) {
        this.runCmd(`tp "${playername}" ${x} ${y} ${z}`);
    }
    dialog_warp_tp_success(warpName, tellraw, username) {
        let dialogMsg = `§aSuccessfully teleported to §2${warpName}`;
        tellraw(username, dialogMsg);
    }
    dialog_warp_tp_404(tellraw, username) {
        let dialogMsg = `§c404 - warp not found.`;
        tellraw(username, dialogMsg);
    }
    tp_warp(warpName, apiVars, apiFns) {
        const { tellraw, runCmd } = apiFns;
        const { username, msg } = apiVars;
        this.azaleaOnWarpTeleport(username, warpName);
        let x = this.getScoreQ(`warp_${warpName}`, `x`);
        let y = this.getScoreQ(`warp_${warpName}`, `y`);
        let z = this.getScoreQ(`warp_${warpName}`, `z`);
        x += 0.5;
        y += 0.5;
        z += 0.5;
        if (x && y && z) {
            let loc = [x, y, z];
            this.teleportPlayer(username, loc);
            this.dialog_warp_tp_success(warpName, tellraw, username);
        } else {
            this.dialog_warp_tp_404(tellraw, username);
        }
    }
    dialog_warp_success(warpName, loc, tellraw, username) {
        let dialogMsg = `§aSuccessfully set warp: ${warpName} at §cX: §4${Math.trunc(
            loc[0]
        )}§7, §aY: §2${Math.trunc(loc[1])}§7, §9Z: §1${Math.trunc(loc[2])}`;
        tellraw(username, dialogMsg);
    }
    dialog_warp_sorry(tellraw, username) {
        tellraw(
            username,
            `§cSorry, player, but ${this.getPrefix()}warp requires arguments. Example: §4${this.getPrefix()}warp set hi`
        );
    }
    no_warps_message(tellraw, username) {
        tellraw(
            username,
            "§cSorry, but the server admins were too lazy to set warps."
        );
    }
    listWarps(apiVars, apiFns) {
        const { tellraw, runCmd } = apiFns;
        const { username, msg } = apiVars;
        let results = runCmd(`scoreboard objectives list`);
        let objectives = results.statusMessage.match(
            /\- ([\s\S]*?)\: ([\s\S]*?)/g
        );
        if (objectives) {
            objectives = objectives
                .map((objective) => {
                    return objective.replace("- ", "").slice(0, -2);
                })
                .filter((objective) => objective.startsWith("WARP"))
                .map((objective) => objective.replace("WARP", ""));
        } else {
        }
        if (!objectives.length) return this.no_warps_message(tellraw, username);
        let location = [
            apiVars.player.location.x,
            apiVars.player.location.y,
            apiVars.player.location.z,
        ];
        this.tellraw(apiVars.username, `§aMove to open the UI!`);
        let tickEvent = world.events.tick.subscribe(() => {
            if (
                apiVars.player.location.x != location[0] ||
                apiVars.player.location.y != location[1] ||
                apiVars.player.location.z != location[2]
            ) {
                world.events.tick.unsubscribe(tickEvent);
                let formData = new ActionFormData();
                formData
                    .title(`Warps (${objectives.length} total)`)
                    .body("Welcome to the warps UI!");
                for (let i = 0; i < objectives.length; i++) {
                    formData.button(objectives[i]);
                }
                formData.show(apiVars.player).then((res) => {
                    if (!res.isCanceled) {
                        let ticks = 0;
                        let tickEvent2 = world.events.tick.subscribe(() => {
                            ticks++;
                            if (ticks % 10 == 0) {
                                world.events.tick.unsubscribe(tickEvent2);
                                this.teleportPlayerToWarp(
                                    objectives[res.selection],
                                    apiVars.username
                                );
                            }
                        });
                    }
                });
            }
        });
    }
    command_warp_test(apiVars, apiFns) {
        const { tellraw, runCmd } = apiFns;
        const { username, msg } = apiVars;
        let args = msg.message.split(" ");
        args.shift();
        if (!args.length) return this.dialog_warp_no_args(tellraw, username);
        switch (args[0]) {
            case "set":
                if (
                    this.hasTag(username, "v") ||
                    this.hasTag(username, "staff") ||
                    this.hasTag(username, "admin")
                ) {
                    let argsNew = JSON.parse(JSON.stringify(args));
                    argsNew.shift();
                    let loc = msg.sender.location;
                    let overworld = world.getDimension("overworld");
                    let nether = world.getDimension("nether");
                    let theEnd = world.getDimension("the end");
                    let dimensions = [overworld, nether, theEnd];
                    let dim = dimensions.indexOf(apiVars.msg.sender.dimension);
                    let dimension = dimensions[dim];
                    this.runCmd(
                        `scoreboard objectives add "WARP${argsNew.join(
                            " "
                        )}" dummy`,
                        dimension
                    );
                    let x = this.runCmd(
                        `scoreboard players set x "WARP${argsNew.join(
                            " "
                        )}" ${parseInt(
                            msg.sender.location.x.toString().split(".")[0]
                        )}`,
                        dimension
                    );
                    let y = this.runCmd(
                        `scoreboard players set y "WARP${argsNew.join(
                            " "
                        )}" ${parseInt(
                            msg.sender.location.y.toString().split(".")[0]
                        )}`,
                        dimension
                    );
                    let z = this.runCmd(
                        `scoreboard players set z "WARP${argsNew.join(
                            " "
                        )}" ${parseInt(
                            msg.sender.location.z.toString().split(".")[0]
                        )}`,
                        dimension
                    );
                    let dimensionPlayer = this.runCmd(
                        `scoreboard players set dimension "WARP${argsNew.join(
                            " "
                        )}" ${dim}`,
                        dimension
                    );
                    if (dimensionPlayer.error)
                        // // console.warn(dimensionPlayer.errorText);
                        this.tellraw(
                            username,
                            `§dI set a warp named §5${argsNew.join(" ")}`
                        );
                    this.tellraw(
                        username,
                        `§bX §3${Math.trunc(msg.sender.location.x)}`
                    );
                    this.tellraw(
                        username,
                        `§bY §3${Math.trunc(msg.sender.location.y)}`
                    );
                    this.tellraw(
                        username,
                        `§bZ §3${Math.trunc(msg.sender.location.z)}`
                    );
                    this.tellraw(
                        username,
                        `§9Dimension §1${
                            dim == 0
                                ? "Overworld"
                                : dim == 1
                                ? "Nether"
                                : dim == 2
                                ? "The End"
                                : "Overworld"
                        }`
                    );
                } else {
                    this.dialog_no_admin("warp set", tellraw, username);
                }
                break;
            case "list":
                this.listWarps(apiVars, apiFns);
                break;
            default:
                if (
                    this.teleportPlayerToWarp(
                        args.join(" "),
                        apiVars.msg.sender
                    ).error
                )
                    return this.tellraw(
                        username,
                        `§cCannot find warp: ${args.join(" ")}`
                    );
                else
                    return this.tellraw(
                        username,
                        `§aYou have been teleported to the warp!`
                    );
        }
    }
    hasWarpPermission(player, warp) {
        if (!this.getScore(`WARP${warp}`, `restrictedMode`)) return true;
        return player.hasTag(`permissions.warps.${warp}`);
    }
    help(apiVars, apiFunctions) {
        const { plugins, username } = apiVars;
        const { tellraw } = apiFunctions;
        let args = apiVars.msg.message.split(" ");
        args.shift();
        if (args.length && !this.stringOnlyContainsNumbers(args[0])) {
            let cmd = this._cmds.find((cmd) => cmd.name == args[0]);
            if (cmd) {
                const { name, description } = cmd;
                const documentation = cmd.documentation
                    ? cmd.documentation
                    : {};
                const usage = cmd.usage ? cmd.usage : [];
                this.tellraw(
                    username,
                    this.LangEn.helpCategory.replace("$CategoryName", "Info")
                );
                this.tellraw(
                    username,
                    this.LangEn.keyValText
                        .replace("$Key", "Name")
                        .replace("$Val", name)
                );
                this.tellraw(
                    username,
                    this.LangEn.keyValText
                        .replace("$Key", "Description")
                        .replace("$Val", description)
                );
                let exampleUsage = [
                    [
                        {
                            arguments: [
                                {
                                    name: "Command",
                                    type: "str",
                                },
                            ],
                        },
                    ],
                ];
                this.tellraw(
                    username,
                    this.LangEn.helpCategory.replace("$CategoryName", "Usage")
                );
                this.tellraw(username, `§e${this.getPrefix()}${name}`);
                this.helpDocumentationText = "";
                if (usage.length) {
                    usage.forEach((item) => {
                        item.forEach((subItem) => {
                            this.helpDocumentationText = `§e${this.getPrefix()}${name}`;
                            let subcommand = subItem.subcommand
                                ? subItem.subcommand
                                : null;
                            let cmdarguments = subItem.arguments
                                ? subItem.arguments
                                : null;
                            if (subcommand)
                                this.helpDocumentationText +=
                                    " " + subItem.subcommand;
                            if (cmdarguments) {
                                subItem.arguments.forEach((subSubItem) => {
                                    let tmpText = "§d<§6";
                                    tmpText += subSubItem.name;
                                    if (subSubItem.type == "str") {
                                        tmpText += "§7: §aString";
                                    } else if (subSubItem.type == "number") {
                                        tmpText += "§7: §aNumber";
                                    }
                                    tmpText += "§d>";
                                    this.helpDocumentationText += ` ${tmpText}`;
                                });
                            }
                            this.tellraw(username, this.helpDocumentationText);
                        });
                    });
                }
                this.tellraw(
                    username,
                    this.LangEn.helpCategory.replace(
                        "$CategoryName",
                        "Extra Info"
                    )
                );
                let extraInfo = cmd.extraInfo ? cmd.extraInfo : {};
                this.tellraw(
                    username,
                    this.LangEn.keyValText
                        .replace("$Key", "Developers")
                        .replace(
                            "$Val",
                            extraInfo.developers
                                ? extraInfo.developers.join("§7, §r§f")
                                : ["TRASH"].join("§7, §r§f")
                        )
                );
                this.tellraw(
                    username,
                    this.LangEn.keyValText
                        .replace("$Key", "Contributors")
                        .replace(
                            "$Val",
                            extraInfo.contributors
                                ? extraInfo.contributors.join("§7, §r§f")
                                : ["§cNone Listed"].join("§7, §r§f")
                        )
                );
                this.createSuccessSound(apiVars.username);

                return;
            }
        }
        if (args.length && args[0] == "cmd-count") {
            this.createSuccessSound(apiVars.username);
            return this.tellraw(
                username,
                `§aThe current amount of commands is §d${this._cmds.length}`
            );
        }
        let commands = [];
        let page = 0;
        for (let i = 0; i < plugins.length; i++) {
            try {
                commands.push(...plugins[i]._cmds);
            } catch (e) {}
        }
        if (args.length && this.stringOnlyContainsNumbers(args[0])) {
            page = parseInt(args[0]) - 1;
        }
        let pages = commands
            .sort(function (a, b) {
                var textA = a.category
                    ? a.category.toUpperCase()
                    : "UNCATEGORIZED";
                var textB = b.category
                    ? b.category.toUpperCase()
                    : "UNCATEGORIZED";
                return textA < textB ? -1 : textA > textB ? 1 : 0;
            })
            .reduce(
                (memo, value, index) => {
                    if (index % 15 === 0 && index !== 0) memo.push([]);
                    memo[memo.length - 1].push(value);
                    return memo;
                },
                [[]]
            );
        commands = pages[page].filter((_) => {
            // let perms = this.hasPermissions(_.name, apiVars.username);
            // console.warn(perms);
            // return perms;
            return true;
        });
        let pageDisplay = [page + 1, pages.length];
        commands = commands;
        let categories = {};
        for (let i = 0; i < commands.length; i++) {
            let category = commands[i].category
                ? commands[i].category
                : "Uncategorized";
            if (Object.keys(categories).indexOf(category) > -1) {
                categories[category].push(commands[i]);
            } else {
                categories[category] = [commands[i]];
            }
        }
        let categoryKeys = Object.keys(categories);
        let themeIndex = this.getScore("theme", apiVars.username)
            ? this.getScore("theme", apiVars.username)
            : 1;
        let theme = getTheme(themeIndex);
        for (let i = 0; i < categoryKeys.length; i++) {
            this.tellraw(
                username,
                this.LangEn.helpCategory
                    .replace(
                        /\$colorHeader1/g,
                        this.parseColor(theme.colorHeader1)
                    )
                    .replace(
                        /\$colorHeader2/g,
                        this.parseColor(theme.colorHeader2)
                    )
                    .replace(/\$CategoryName/g, categoryKeys[i])
            );
            for (let i2 = 0; i2 < categories[categoryKeys[i]].length; i2++) {
                let command = categories[categoryKeys[i]][i2];
                let color = "a";
                if (command.type) {
                    switch (command.type) {
                        case "moderation":
                            color = "c";
                            break;
                        case "utility":
                            color = "d";
                            break;
                        case "economy":
                            color = "6";
                            break;
                        case "fun":
                            color = "b";
                            break;
                    }
                }
                // tellraw(username,`§${color}!${command.name}${command.description ? `${i2 % 2 == 0 ? "§8" : "§7"}${command.description}` : ``}`);

                this.tellraw(
                    username,
                    this.LangEn.helpCommand
                        .replace(/\$key/g, this.parseColor(theme.key))
                        .replace(/\$val/g, this.parseColor(theme.val))
                        .replace(/\$Prefix/g, this.getPrefix())
                        .replace(/\$CommandName/g, command.name)
                        .replace(
                            /\$Description/g,
                            command.description ? command.description : ""
                        )
                        .replace(
                            /\$Aliases/g,
                            `${
                                command.aliases
                                    ? `§9§oaliases §r§7${command.aliases.join(
                                          "§r§8, §r§7"
                                      )}`
                                    : ``
                            }`
                        )
                );
            }
        }
        this.tellraw(
            username,
            `§7Page §r${pageDisplay[0]}§7/§r${pageDisplay[1]}`
        ); //${pageDisplay[1]}
        this.createSuccessSound(apiVars.username);
    }
    formatText(text, ...args) {
        let text2 = text;
        for (let i = 0; i < args.length; i++) {
            if (typeof args[i] === "string")
                text2 = text2.replace("/%", args[i]);
        }
    }
    ban(apiVars, apiFns) {
        if (!this.isAdmin(apiVars.player.nameTag))
            return this.dialog_no_admin(
                "ban",
                apiFns.tellraw,
                apiVars.username
            );
        let loc = apiVars.player.location;
        let loc2 = [loc.x, loc.y, loc.z];
        const { set, get, listPlayerNames } = this;
        world.events.tick.subscribe(() => {
            if (
                apiVars.player.location.x != loc2[0] ||
                apiVars.player.location.y != loc2[1] ||
                apiVars.player.location.z != loc2[2]
            ) {
                let modalForm = new ModalForm();
                modalForm.dropdown("Player", this.listPlayerNames(), 0);
                modalForm.slider("Minutes", 0, 59, 1, 0);
                modalForm.slider("Hours", 0, 59, 1, 0);
                modalForm.slider("Days", 0, 100, 1, 0);
                modalForm.show(apiVars.player, (res) => {
                    let player = listPlayerNames()[res.formValues[0]],
                        minutes = res.formValues[1],
                        hours = res.formValues[2],
                        days = res.formValues[3];
                    // console.warn(`${player} ${minutes} ${hours} ${days}`);
                });
            }
        });
    }
    listPlayerNames() {
        let names = [];
        for (const player of world.getPlayers()) {
            names.push(player.nameTag);
        }
        return names;
    }
    broadcastT(text, soundID = 1, player = null, { formatText }) {
        let sounds = [
            `playsound random.toast @a[name="$player"] ~~~ 1 0.5`,
            `playsound random.glass @a[name="$player"]`,
        ];
        if (player) this.runCmd(sounds[soundID].replace("$player", player));
        let formattedText = text;
        if (formatText) {
            if (player && this.hasTag(player, "detailed_font")) {
                formattedText = `§¥${formattedText}`;
            }
            let theme = getTheme(
                this.getScore("theme", "player")
                    ? this.getScore("theme", "player")
                    : 0
            );
            let keys = Object.keys(theme);
            for (let i = 0; i < keys.length; i++) {
                let key = keys[i];
                theme[key] = this.parseColor(theme[key]);
                let regex = RegExp(`\\#\\(${key}\\)`, `g`);
                formattedText = formattedText.replace(regex, theme[key]);
            }
        }
        this.runCmd(
            `tellraw @a[name="${
                player ? player : "@a"
            }"] {"rawtext":[{"text":${JSON.stringify(formattedText)}}]}`
        );
    }
    on_player_join(player2) {
        serverWatcherHandlers[2]();
        this.onPlayerJoin(player2.player);
        let player = player2.player;
        let joinLogs = this.get(`activitylogs`, `logs`)
            ? this.get(`activitylogs`, `logs`)
            : `[]`;
        joinLogs = JSON.parse(joinLogs);
        if (joinLogs.length && joinLogs.length > 300) joinLogs.shift();
        joinLogs.push({
            type: "log.player-join",
            date: new Date().getTime(),
            playerName: player.name,
        });
        this.set(`activitylogs`, JSON.stringify(joinLogs), `logs`);
        let offlinePlayers = JSON.parse(
            this.get("offlinePlayers", "offline")
                ? this.get("offlinePlayers", "offline")
                : "[]"
        );
        if (!offlinePlayers.includes(player2.player.nameTag))
            offlinePlayers.push(player2.player.nameTag);
        this.set(`offlinePlayers`, JSON.stringify(offlinePlayers), `offline`);
        let local = this;
        let onPlayerEntered = world.events.tick.subscribe(() => {
            let cmd = local.runCmd(`testfor "${player.nameTag}"`);
            if (!cmd.error) {
                world.events.tick.unsubscribe(onPlayerEntered);
                if (local.isToggleOn("Spawn-On-Join"))
                    local.teleportPlayerToWarp("spawn", player.nameTag);
            }
        });
    }
    eightball(apiVars, apiFns) {
        if (!apiVars.args.length)
            return this.tellraw(apiVars.username, `§cPlease ask a question.`);
        let question = apiVars.args.join("");
        if (question.includes("girlfriend") && !question.includes("not"))
            return this.tellraw(apiVars.username, `§cNo`);
        let options = [
            `§cNo`,
            `§cNo`,
            `§aYes`,
            `§cNo`,
            `§cNo`,
            `§cNo`,
            `§aYes`,
        ];
        this.tellraw(
            apiVars.username,
            options[Math.floor(Math.random() * options.length)]
        );
    }
    discordServer(apiVars, apiFns) {
        return this.tellraw(
            apiVars.username,
            `Discord Server: §9https://discord.gg/tyMQEAbUwa`
        );
    }
    logAppend(val) {
        let joinLogs = this.get(`activitylogs`, `logs`)
            ? this.get(`activitylogs`, `logs`)
            : `[]`;
        joinLogs = JSON.parse(joinLogs);
        if (joinLogs.length && joinLogs.length > 300) joinLogs.shift();
        joinLogs.push(val);
        this.set(`activitylogs`, JSON.stringify(joinLogs), `logs`);
    }
    on_player_leave(playerName) {
        serverWatcherHandlers[3]();

        let joinLogs = this.get(`activitylogs`, `logs`)
            ? this.get(`activitylogs`, `logs`)
            : `[]`;
        joinLogs = JSON.parse(joinLogs);
        if (joinLogs.length && joinLogs.length > 300) joinLogs.shift();
        joinLogs.push({
            type: "log.player-leave",
            date: new Date().getTime(),
            name: playerName.player,
        });
        this.set(`activitylogs`, JSON.stringify(joinLogs), `logs`);
    }
    debug1(apiVars, apiFns) {
        const { tellraw, runCmd } = apiFns;
        const { username, msg } = apiVars;
    }
    hasPermissions(name, player) {
        let username = player;
        let cmdPermData = JSON.parse(
            this.get(`permsv1:${name}`, `perms`)
                ? this.get(`permsv1:${name}`, `perms`)
                : "{}"
        );
        let nameToggleText = name;
        if (nameToggleText.length > 13) {
            nameToggleText = nameToggleText.slice(
                0,
                13 - nameToggleText.length
            );
        }
        let toggle = this.getScoreQ(`CMD${nameToggleText}`, `toggle_number`);
        let hasAdmin = false;
        if (
            this.hasTag(username, "v") ||
            this.hasTag(username, "staff") ||
            this.hasTag(username, "admin")
        )
            hasAdmin = true;
        if (toggle) {
            if (toggle == 1 && !hasAdmin) return false;

            if (toggle == 2) return false;

            if (toggle == 3) {
                let requiredTag =
                    cmdPermData &&
                    cmdPermData.requiredTags &&
                    cmdPermData.requiredTags.length
                        ? cmdPermData.requiredTags[0]
                        : `cmd_${name}`;
                if (!apiVars.player.hasTag(requiredTag)) return false;
                // return this.dialog_no_cmd_tag(name, apiFunctions.tellraw, apiVars.username);
            }
        }
        let cmd = this._cmds.find((_) => _.name == name);
        if (cmd && cmd.requiresAdmin && !this.isAdmin(username)) return false;
        return true;
    }
    on_command(name, { apiVars, apiFunctions }, isCmdBlock = false) {
        serverWatcherHandlers[4](apiVars.player);
        let prefix = this.getPrefix();
        events.emit(
            `AzaleaLogger:PlayerUsedCommand`,
            {
                prefix,
                player: apiVars.username,
                command: name,
            },
            apiFunctions.tellraw
        );
        let cmdPermData = JSON.parse(
            this.get(`permsv1:${name}`, `perms`)
                ? this.get(`permsv1:${name}`, `perms`)
                : "{}"
        );
        let nameToggleText = name;
        if (nameToggleText.length > 13) {
            nameToggleText = nameToggleText.slice(
                0,
                13 - nameToggleText.length
            );
        }

        // apiVars.themeID = this.getScore(`theme`,apiVars.username) ? this.getScore(`theme`,apiVars.username) : 0;
        // apiVars.rawTheme = getTheme(apiVars.themeID);

        // let parsedTheme = JSON.parse(JSON.stringify(apiVars.rawTheme));
        // let keys = Object.keys(parsedTheme);
        // for(let i = 0;i < keys.length;i++) {
        //     parsedTheme[keys[i]] = this.parseColor(parsedTheme[keys[i]]);
        // }
        // apiVars.theme = parsedTheme;

        let theme = {
            success: "§a",
            error: "§c",
        };
        if (!this.isAdmin(apiVars.username)) {
            let defaultCmdCooldown = this.getScore(
                `_cmdcooldown`,
                `CMD-COOLDOWN:!default`
            )
                ? this.getScore(`_cmdcooldown`, `CMD-COOLDOWN:!default`)
                : 0;
            if (defaultCmdCooldown > 16) defaultCmdCooldown = 16;
            let playerCommandCooldown = this.getScore(
                `_cmdcooldown`,
                apiVars.username
            )
                ? this.getScore(`_cmdcooldown`, apiVars.username)
                : 0;
            let cmdCooldown = this.getScore(
                `_cmdcooldown`,
                `CMD-COOLDOWN:!${name}`
            )
                ? this.getScore(`_cmdcooldown`, `CMD-COOLDOWN:!${name}`)
                : defaultCmdCooldown;
            if (cmdCooldown > 16) cmdCooldown = 16;
            if (playerCommandCooldown > 0)
                return this.tellraw(
                    apiVars.username,
                    `${theme.error}You need to wait ${playerCommandCooldown} before using another command.`
                );
            this.runCmd(
                `scoreboard players set "${apiVars.username}" _cmdcooldown ${cmdCooldown}`
            );
        }
        let toggle = this.getScoreQ(`CMD${nameToggleText}`, `toggle_number`);
        let hasAdmin = false;
        const { username } = apiVars;
        if (
            this.hasTag(username, "v") ||
            this.hasTag(username, "staff") ||
            this.hasTag(username, "admin")
        )
            hasAdmin = true;
        if (toggle) {
            if (toggle == 1 && !hasAdmin)
                return this.dialog_no_admin(
                    name,
                    apiFunctions.tellraw,
                    apiVars.username
                );

            if (toggle == 2)
                return this.dialog_disabled(
                    name,
                    apiFunctions.tellraw,
                    apiVars.username
                );

            if (toggle == 3) {
                let requiredTag =
                    cmdPermData &&
                    cmdPermData.requiredTags &&
                    cmdPermData.requiredTags.length
                        ? cmdPermData.requiredTags[0]
                        : `cmd_${name}`;
                if (!apiVars.player.hasTag(requiredTag))
                    return this.tellraw(
                        apiVars.username,
                        `§cSorry, but you don't have the required tag for this. If you have command permissions, type §4/tag @s add "${requiredTag}"`
                    );
                // return this.dialog_no_cmd_tag(name, apiFunctions.tellraw, apiVars.username);
            }

            if (toggle == 4) {
                if (!isCmdBlock)
                    return this.tellraw(
                        apiVars.username,
                        `§cYou can only use this command in a command block!`
                    );
            }
        }
        if (this.commandTagCheck(name, apiVars, apiFunctions)) return;
        if (this.mcCmdCheck(name, apiVars, apiFunctions)) return;
        if (name.startsWith("w-")) {
            this.tp_warp(name.replace("w-", ""), apiVars, apiFunctions);
            return;
        }
        let sender = apiVars.msg.sender;
        switch (name) {
            case "tpw":
                let tpargs = apiVars.msg.message.split(" ");
                tpargs.shift();
                if (this.teleportPlayerToWarp(tpargs.join(" "), sender).error)
                    return this.tellraw(
                        username,
                        `§cCannot find warp: ${tpargs.join(" ")}`
                    );
                else
                    return this.tellraw(
                        username,
                        `§aYou have been teleported to the warp!`
                    );
                break;
            case "teleport":
                let teleportargs = apiVars.msg.message.split(" ");
                teleportargs.shift();
                if (
                    this.teleportPlayerToWarp(teleportargs.join(" "), sender)
                        .error
                ) {
                    this.createErrorSound(apiVars.player);
                    return this.tellraw(
                        username,
                        `§cCannot find warp: ${teleportargs.join(" ")}`
                    );
                } else {
                    this.createSuccessSound(apiVars.username);
                    return this.tellraw(
                        username,
                        `§aYou have been teleported to the warp!`
                    );
                }

                break;
            case "toggle":
                this.command_toggle_test(apiVars, apiFunctions);
                break;
            case "warp":
                this.command_warp_test(apiVars, apiFunctions);
                break;
            case "help":
                this.help(apiVars, apiFunctions);
                break;
            case "warps":
                this.listWarps(apiVars, apiFunctions);
                break;
            case "debug1":
                this.debug1(apiVars, apiFunctions);
                break;
            case "chat":
                this.createChat(apiVars, apiFunctions);
                break;
            case "chat-invite":
                this.inviteToChat(apiVars, apiFunctions);
                break;
            case "chat-join":
                this.joinChat(apiVars, apiFunctions);
                break;
            case "chat-leave":
                this.leaveChat(apiVars, apiFunctions);
                break;
            case "chat-online":
                this.chatOnline(apiVars, apiFunctions);
                break;
            case "credits":
                this.credits(apiVars, apiFunctions);
                break;
            case "chat-cooldown":
                this.chatCooldown(apiVars, apiFunctions);
                break;
            case "azalea-version":
                this.azaleaVersion(apiVars, apiFunctions);
                break;
            case "warn":
                this.warn(apiVars, apiFunctions);
                break;
            case "warns":
                this.warns(apiVars, apiFunctions);
                break;
            case "worldborder-toggle":
                this.toggleWorldBorder(apiVars, apiFunctions);
                break;
            case "worldborder-size":
                this.setWorldBorderSize(apiVars, apiFunctions);
                break;
            case "random-tip":
                this.randomTip(apiVars, apiFunctions);
                break;
            case "balance":
                this.balance(apiVars, apiFunctions);
                break;
            case "mute":
                this.mute(apiVars, apiFunctions);
                break;
            case "unmute":
                this.unmute(apiVars, apiFunctions);
                break;
            case "qt-gm":
                this.qtGamemode(apiVars, apiFunctions);
                break;
            case "qt-day":
                this.qtAlwaysDay(apiVars, apiFunctions);
                break;
            case "qt-no-rain":
                this.qtNoRain(apiVars, apiFunctions);
                break;
            case "rickroll":
                this.rickroll(apiVars, apiFunctions);
                break;
            case "nothing":
                this.nothing(apiVars, apiFunctions);
                break;
            case "smite":
                this.smite(apiVars, apiFunctions);
                break;
            case "manage":
                this.toggleAdvanced(apiVars, apiFunctions);
                break;
            case "broadcast":
                this.broadcast(apiVars, apiFunctions);
                break;
            case "hack":
                this.hack(apiVars, apiFunctions);
                break;
            case "locate-your-dad":
                this.locateYourDad(apiVars, apiFunctions);
                break;
            case "spawn":
                this.spawn(apiVars, apiFunctions);
                break;
            case "s":
                this.spawn(apiVars, apiFunctions);
                break;
            case "lobby":
                this.spawn(apiVars, apiFunctions);
                break;
            case "hub":
                this.spawn(apiVars, apiFunctions);
                break;
            case "server":
                this.sinfo(apiVars, apiFunctions);
                break;
            case "sinfo":
                this.sinfo(apiVars, apiFunctions);
                break;
            case "si":
                this.sinfo(apiVars, apiFunctions);
                break;
            case "serverinfo":
                this.sinfo(apiVars, apiFunctions);
                break;
            case "rules":
                this.rules(apiVars, apiFunctions);
                break;
            case "r":
                this.rules(apiVars, apiFunctions);
                break;
            case "wild":
                this.wild(apiVars, apiFunctions);
                break;
            case "clear-chat":
                this.clearChat(apiVars, apiFunctions);
                break;
            case "notes":
                this.notes(apiVars, apiFunctions);
                break;
            case "pwarp":
                this.pwarp(apiVars, apiFunctions);
                break;
            case "pwarp-silent":
                this.pwarpSilent(apiVars, apiFunctions);
                break;
            case "tp":
                this.tpsend(apiVars, apiFunctions);
                break;
            case "home":
                this.home(apiVars, apiFunctions);
                break;
            case "logs":
                this.viewLogs(apiVars, apiFunctions);
                break;
            case "staff-chat":
                this.staffChat(apiVars, apiFunctions);
                break;
            case "friends":
                this.friends(apiVars, apiFunctions);
                break;
            case "tagcmd":
                this.tagcmd(apiVars, apiFunctions);
                break;
            case "announcements":
                this.announcements(apiVars, apiFunctions);
                break;
            case "set-admin-only":
                this.qtAdminOnly(apiVars, apiFunctions);
                break;
            case "cancel-explosion-toggle":
                this.cancelExplosionToggle(apiVars, apiFunctions);
                break;
            case "warn-on-cancel-explosion-toggle":
                this.warnOnCancelExplosionToggle(apiVars, apiFunctions);
                break;
            case "jobs-beta":
                this.toggleJobsBeta(apiVars, apiFunctions);
                break;
            case "explode":
                this.explodeTest(apiVars, apiFunctions);
                break;
            case "modmail":
                this.modmail(apiVars, apiFunctions);
                break;
            case "dim":
                this.dimension(apiVars, apiFunctions);
                break;
            case "lore":
                this.lore(apiVars, apiFunctions);
                break;
            case "send-review":
                this.rateServerMenu(apiVars, apiFunctions);
                break;
            case "leaderboard-add":
                this.leaderboardAdder(apiVars, apiFunctions);
                break;
            case "leaderboard-del":
                this.leaderboardRemove(apiVars, apiFunctions);
                break;
            case "region-add":
                this.regionBuilder(apiVars, apiFunctions);
                break;
            case "create-guild":
                this.createGuildCMD(apiVars, apiFunctions);
                break;
            case "join-guild":
                this.joinGuild(apiVars, apiFunctions);
                break;
            case "add-guild":
                this.addGuildToList(apiVars, apiFunctions);
                break;
            case "view-guilds":
                this.viewGuildList(apiVars, apiFunctions);
                break;
            case "leave-guild":
                this.leaveGuild(apiVars, apiFunctions);
                break;
            case "plugins":
                this.pluginsList(apiVars, apiFunctions);
                break;
            case "cmd":
                this.commandPermissions(apiVars, apiFunctions);
                break;
            case "pay":
                this.pay(apiVars, apiFunctions);
                break;
            case "permban":
                this.permban(apiVars, apiFunctions);
                break;
            case "unpermban":
                this.unpermban(apiVars, apiFunctions);
                break;
            case "fly":
                this.fly(apiVars, apiFunctions);
                break;
            case "ranks":
                this.rank(apiVars, apiFunctions);
                break;
            case "channels":
                this.channels(apiVars, apiFunctions);
                break;
            case "reload-some-data":
                this.refreshSomeData(apiVars);
                break;
            case "print-analytics":
                this.printAnalytics(apiVars, apiFunctions);
                break;
            case "report":
                this.report(apiVars, apiFunctions);
                break;
            case "convert-v1-dbs":
                this.convertV1Databases(apiVars,apiFunctions);
                break;
            // case "top-test":
            //     this.top(apiVars, true);
            //     break;
            default:
                let cmdName = name;
                let results = events.emit(
                    "onInvalidCommand",
                    cmdName,
                    apiVars,
                    apiFunctions
                );
                if (results) return;
                let cmd = this._cmds.find(
                    (command) => command.name === cmdName
                );
                let similarcmd = this.getMostSimilarStringOutOfCMDArray(name);
                if (!cmd) {
                    if (!similarcmd) {
                        return this.tellraw(
                            apiVars.msg.sender.nameTag,
                            `§c404, Command Not Found. Please try using !help for a list of available commands.`
                        );
                    } else {
                        return this.tellraw(
                            apiVars.username,
                            `§cCommand not found! Did you mean §r${similarcmd}§c?`
                        );
                    }
                }
        }
    }
    convertV1Databases(apiVars, apiFns) {
        let v1tables = this.listObjectives().filter(objective=>objective.startsWith('DB_'));
        console.warn(Array.isArray(v1tables))
        v1tables.forEach(table=>{
            apiFns.tellraw(apiVars.username,`Converting table ${table.substring(3)}`);
            // console.warn(world.scoreboard.getObjective(table))
            // console.warn(world.scoreboard.getObjective(table).getParticipants())
            let participants = [...world.scoreboard.getObjective(table).getParticipants()];
            let keys = participants.filter(participant=>participant.displayName.startsWith('Len')).map(key=>key.displayName).map(key=>key.substring(3));
            apiFns.tellraw(apiVars.username, JSON.stringify(keys))
            let tableName = `${table.substring(3)}`;
            console.warn('1')
            keys.forEach(key=>{
                console.warn('2')
                // console.warn(apiFns.getv1)
                let api = new AAPI();
                let value = api.getv1(key, tableName);
            console.warn('3')

                console.warn(value)
                apiFns.set(key, value, tableName);
            console.warn('4')

            })
        })
    }
    createErrorSound(player) {
        this.runCmd(errorSound.replace("$SELECTOR", `"${player}"`));
    }
    createSuccessSound(player) {
        this.runCmd(successSound.replace("$SELECTOR", `"${player}"`));
    }
    prefix(apiVars, apiFns, local) {
        const { msg, username } = apiVars;
        const { tellraw } = apiFns;

        if (!local.isAdmin(username))
            return local.dialog_no_admin("prefix", tellraw, username);

        let args = msg.message.split(" ");
        args.shift();

        let prefix = args.length ? args.join("_") : "\\";
        if (prefix.startsWith("/")) {
            local.tellraw(
                username,
                `§cThe prefix cannot start with /, it breaks azalea`
            );
        }
        local.setPrefix(prefix);
        local.tellraw(username, `§aSet the prefix to §d${prefix}`);
        this.createSuccessSound(apiVars.username);
    }
    isAdmin(player) {
        return (
            this.hasTag(player, "v") ||
            this.hasTag(player, "staff") ||
            this.hasTag(player, "admin") ||
            this.hasTag(player, "mod") ||
            this.hasTag(player, "moderator")
        );
    }
    registerToggleCommands() {}
    regCMD(reg, callback) {
        this.registerCommand(reg, callback);
        return this.regCMD;
    }
    rank(apiVars, apiFns) {
        let args = apiVars.args
            .join(" ")
            .trim()
            .match(/"[^"]+"|[^\s]+/g)
            .map((e) => e.replace(/"(.+)"/, "$1"));
        if (!this.isAdmin(apiVars.username))
            return this.dialog_no_admin(
                "rank",
                apiFns.tellraw,
                apiVars.username
            );
        if (args[0] == "add") {
            let player = args[1],
                rank = args[2];
            let plyer = this.fetchPlayer(player);
            if (!plyer)
                return this.tellraw(
                    apiVars.username,
                    `§cPlayer does not exist and/or cant be found`
                );
            plyer.addTag(`rank:${rank}`);
            this.tellraw(
                apiVars.username,
                `§aAdded rank §r${rank} §ato ${plyer.nameTag}`
            );
        } else if (args[0] == "remove") {
            let player = args[1],
                rank = args[2];
            let plyer = this.fetchPlayer(player);
            if (!plyer)
                return this.tellraw(
                    apiVars.username,
                    `§cPlayer does not exist and/or cant be found`
                );
            if (plyer.hasTag(`rank:${rank}`)) {
                plyer.removeTag(`rank:${rank}`);
                this.tellraw(
                    apiVars.username,
                    `§aRemoved rank §r${rank} §afrom ${plyer.nameTag}`
                );
            } else {
                this.tellraw(apiVars.username, `§cPlayer does not have rank!`);
            }
        } else if (args[0] == "view") {
            let player = args[1];
            let plyer = this.fetchPlayer(player);
            if (!plyer)
                return this.tellraw(
                    apiVars.username,
                    `§cPlayer does not exist and/or cant be found`
                );
            let ranks = plyer
                .getTags()
                .filter((_tag) => _tag.startsWith("rank:"))
                .map((_rank) => _rank.substring(5));
            if (ranks.length)
                this.tellraw(apiVars.username, `${ranks.join("§r, ")}`);
            else this.tellraw(apiVars.username, `§cThis player has no ranks`);
        }
    }
    commandPermissions(apiVars, apiFns) {
        let args = apiVars.args
            .join(" ")
            .trim()
            .match(/"[^"]+"|[^\s]+/g)
            .map((e) => e.replace(/"(.+)"/, "$1"));
        if (args.length) {
            if (args[0] == "rank") {
                let data = JSON.parse(
                    this.get(`permsv1:${args[1]}`, `perms`)
                        ? this.get(`permsv1:${args[1]}`, `perms`)
                        : "{}"
                );
                data.requiredTags = [
                    `rank:${args[2].replace(/\&/g, "§").replace(/\\§/g, "&")}`,
                ];
                this.set(`permsv1:${args[1]}`, JSON.stringify(data), `perms`);
            } else if (args[0] == "tag") {
                let data = JSON.parse(
                    this.get(`permsv1:${args[1]}`, `perms`)
                        ? this.get(`permsv1:${args[1]}`, `perms`)
                        : "{}"
                );
                data.requiredTags = [`${args[2]}`];
                this.set(`permsv1:${args[1]}`, JSON.stringify(data), `perms`);
            }
        }
    }
    runCmdPlayer(command, player) {
        try {
            return { error: false, ...player.runCommand(command) };
        } catch (e) {
            return { error: true, errorText: e };
        }
    }
    channels(apiVars, apiFns) {
        let channels = JSON.parse(
            this.get("channels", "misc")
                ? this.get("channels", "misc")
                : '["general"]'
        );
        if (apiVars.args.length) {
            if (apiVars.args[0] == "create") {
                if (!this.isAdmin(apiVars.username))
                    return this.dialog_no_admin(
                        "channels create",
                        apiFns.tellraw,
                        apiVars.username
                    );
                channels.push(apiVars.args[1].toLowerCase());
                this.tellraw(apiVars.username, `§aCreated channel!`);
            } else if (apiVars.args[0] == "remove") {
                if (!this.isAdmin(apiVars.username))
                    return this.dialog_no_admin(
                        "channels remove",
                        apiFns.tellraw,
                        apiVars.username
                    );
                let channel = channels.find(
                    (_channel) => _channel == apiVars.args[1].toLowerCase()
                );
                if (channel) {
                    channels.splice(channels.indexOf(channel), 1);
                    return this.tellraw(apiVars.username, `§aRemoved channel!`);
                } else {
                    return this.tellraw(
                        apiVars.username,
                        `§cCould not find channel`
                    );
                }
            } else if (apiVars.args[0] == "join") {
                let channel = channels.find(
                    (_channel) => _channel == apiVars.args[1].toLowerCase()
                );
                if (channel) {
                    // i almost created a very bad bug
                    for (const tag of apiVars.player.getTags()) {
                        if (tag.startsWith("joinedChannel:"))
                            apiVars.player.removeTag(tag);
                    }
                    apiVars.player.addTag(`joinedChannel:${channel}`);
                    return this.tellraw(apiVars.username, `§aJoined channel!`);
                } else {
                    return this.tellraw(
                        apiVars.username,
                        `§cCould not find channel`
                    );
                }
            }
        } else {
            for (const channel of channels) {
                this.tellraw(apiVars.username, `§7#${channel}`);
            }
        }
        this.set("channels", JSON.stringify(channels), "misc");
    }
    executeMinecraftCommand(name, apiVars, apiFunctions) {
        let cmd = name.substring(1);
        let msg = apiVars.msg;
        let messageText = msg.message;
        let args = messageText.split(" ");
        args.shift();
        args = args.join(" ");
        let commandResults = this.runCmdPlayer(
            `${cmd} ${args}`,
            apiVars.player
        );
        let username = apiVars.username;
        if (commandResults.error) {
            this.tellraw(
                username,
                `§c${JSON.parse(commandResults.errorText).statusMessage}`
            );
        } else {
            let statusMessage = commandResults.statusMessage
                ? commandResults.statusMessage
                : "";
            if (statusMessage) {
                this.tellraw(username, `${commandResults.statusMessage}`);
            }
        }
    }
    mcCmdCheck(name, apiVars, apiFunctions) {
        const { msg } = apiVars;
        const { tellraw } = apiFunctions;
        if (name.startsWith("/")) {
            if (
                !this.hasTag(msg.sender.nameTag, "admin") &&
                !this.hasTag(msg.sender.nameTag, "staff") &&
                !this.hasTag(msg.sender.nameTag, "v")
            ) {
                this.dialog_no_admin(name, tellraw, msg.sender.nameTag);
                return true;
            } else {
                this.executeMinecraftCommand(name, apiVars, apiFunctions);
                return true;
            }
        }
        return false;
    }
    parseColor(color, number = false) {
        let colorNames = [
            "black",
            "blue",
            "green",
            "aqua",
            "red",
            "magenta",
            "gold",
            "light-gray",
            "dark-gray",
            "bright-blue",
            "bright-green",
            "bright-aqua",
            "bright-red",
            "bright-magenta",
            "yellow",
            "white",
        ];
        let colorCodes = [
            "0",
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "a",
            "b",
            "c",
            "d",
            "e",
            "f",
        ];
        let colorNumberCodes = [
            0,
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15
        ]
        let colorIndex = colorNames.indexOf(color.replace(/[^0-9a-z\-]/gi, ""));
        // // // console.warn(color);
        if(number) {
            if (colorIndex > -1) return "§" + colorNumberCodes[colorIndex];
            else return 16;
        } else {
            if (colorIndex > -1) return "§" + colorCodes[colorIndex];
            else return "§g";    
        }
    }
    numberToColor(num = 0) {
        let number = num.toString(16);
        if(num > 15) return "§g"
        else return `§${number}`;
    }
    getSavedColor(nameTag) {
        let num = this.getScoreQ("Misc000002", `NAME_COLOR:${nameTag}`) ? this.getScoreQ("Misc000002", `NAME_COLOR:${nameTag}`) : 7;
        return this.numberToColor(num);
    }
    smite(apiVars, apiFns) {
        const { msg } = apiVars;
        const { tellraw } = apiFns;
        if (
            !this.hasTag(msg.sender.nameTag, "admin") &&
            !this.hasTag(msg.sender.nameTag, "staff") &&
            !this.hasTag(msg.sender.nameTag, "v")
        )
            return this.dialog_no_admin("manage", tellraw, msg.sender.nameTag);
        let args = msg.message.split(" ");
        args.shift();
        if (!args.length)
            return tellraw(msg.sender.nameTag, "§cPlease add a player name.");
        this.runCmd(`execute "${args.join(" ")}" ~ ~ ~ summon lightning_bolt`);
        this.runCmd(`effect "${args.join(" ")}" levitation 1 20 true`);
        this.tellraw(
            msg.sender.nameTag,
            "§6Smited §e@" + args.join(" ") + "§r§6."
        );
        return;
    }
    nothing(apiVars, apiFns) {
        const { msg } = apiVars;
        const { tellraw } = apiFns;
        let nothingText = [
            "Nothing",
            "Nothing.",
            "Nothing..",
            "Nothing...",
            "Nothing....",
            "Nothing.....",
            "Nothing......",
            "Nothing.......",
            "Nothing........",
            "Nothing.........",
            "Nothing..........",
            "Nothing?",
            "Nothing??",
            "Nothing???",
            "Nothing????",
            "Nothing?????",
            "Nothing??????",
            "Nothing???????",
            "Nothing?????????",
            "Nothing??????????",
            "Nothing!",
            "Nothing!!",
            "Nothing!!!",
            "Nothing!!!!",
            "Nothing!!!!!",
            "Nothing!!!!!!",
            "Nothing!!!!!!!",
            "Nothing!!!!!!!!",
            "Nothing!!!!!!!!!",
            "Nothing!!!!!!!!!!",
            "NOTHING",
            "NOTHING.",
            "NOTHING, I like stabbing people its ok im not doing anything illegal anymore ok",
        ];
        // nothingText.forEach(text=>{
        //     apiVars.player.addTag(`${colors[Math.floor(Math.random() * colors.length)]}`)
        // })
        this.tellraw(
            msg.sender.nameTag,
            nothingText[Math.floor(Math.random() * nothingText.length)]
        );
    }
    checkBans() {
        // return;
        let bannedUsers = JSON.parse(
            this.get("bannedUsers", "permbans")
                ? this.get("bannedUsers", "permbans")
                : "{}"
        );
        for (const player of world.getPlayers()) {
            if (
                Object.keys(bannedUsers).includes(
                    player.nameTag.toLowerCase()
                ) &&
                bannedUsers[player.nameTag.toLowerCase()] &&
                !this.isAdmin(player.nameTag)
            ) {
                player.triggerEvent("binocraft:kick");
            }
        }
    }
    permban(apiVars, apiFns) {
        const { args, username } = apiVars;
        if (!this.isAdmin(apiVars.username))
            return this.dialog_no_admin(
                "permban",
                apiFns.tellraw,
                apiVars.username
            );
        let bannedUsers = JSON.parse(
            this.get("bannedUsers", "permbans")
                ? this.get("bannedUsers", "permbans")
                : "{}"
        );
        bannedUsers[args.join(" ").toLowerCase()] = true;
        this.tellraw(username, `§aBanned ${args.join(" ").toLowerCase()}`);
        this.set("bannedUsers", JSON.stringify(bannedUsers), "permbans");
    }
    unpermban(apiVars, apiFns) {
        const { args, username } = apiVars;
        if (!this.isAdmin(apiVars.username))
            return this.dialog_no_admin(
                "unpermban",
                apiFns.tellraw,
                apiVars.username
            );
        let bannedUsers = JSON.parse(
            this.get("bannedUsers", "permbans")
                ? this.get("bannedUsers", "permbans")
                : "{}"
        );
        if (bannedUsers[args.join(" ").toLowerCase()])
            bannedUsers[args.join(" ").toLowerCase()] = false;
        this.tellraw(username, `§aUnbanned ${args.join(" ").toLowerCase()}`);
        this.set("bannedUsers", JSON.stringify(bannedUsers), "permbans");
    }
    pay(apiVars, apiFns) {
        const { args, username } = apiVars;
        this.runCmd(`scoreboard objectives add money dummy`);
        let amount = JSON.parse(JSON.stringify(args))[0];
        args.shift();
        let player = args.join(" ");
        let money = this.getScore("money", username)
            ? this.getScore("money", username)
            : [];
        if (!this.stringOnlyContainsNumbers(amount))
            return this.tellraw(username, `§c${amount} is not a number!`);
        if (money >= parseInt(amount)) {
            if (!this.fetchPlayer(player))
                return this.tellraw(
                    username,
                    `§cSorry, I cannot find ${player}.`
                );
            this.runCmd(
                `scoreboard players add "${
                    this.fetchPlayer(player).nameTag
                }" money ${amount}`
            );
            this.runCmd(
                `scoreboard players add "${username}" money -${amount}`
            );
            return this.tellraw(username, `§aPaid ${amount} to ${player}`);
        }
    }
    locateYourDad(apiVars, apiFns) {
        const { msg } = apiVars;
        const { tellraw } = apiFns;
        if (
            !this.hasTag(msg.sender.nameTag, "admin") &&
            !this.hasTag(msg.sender.nameTag, "staff") &&
            !this.hasTag(msg.sender.nameTag, "v")
        )
            return this.dialog_no_admin("manage", tellraw, msg.sender.nameTag);
        this.tellraw(
            msg.sender.nameTag,
            "Your dad is in the milk store on mars about 3 billion miles away."
        );
    }
    hack(apiVars, apiFns) {
        const { msg } = apiVars;
        const { tellraw } = apiFns;
        let ip =
            Math.floor(Math.random() * 255) +
            1 +
            "." +
            Math.floor(Math.random() * 255) +
            "." +
            Math.floor(Math.random() * 255) +
            "." +
            Math.floor(Math.random() * 255);
        let args = msg.message.split(" ");
        args.shift();
        if (!args.length)
            return tellraw(
                msg.sender.nameTag,
                "§cI need to have the name of the player you want to hack."
            );
        this.tellraw(
            msg.sender.nameTag,
            `§6The IP address for §e@${args.join(" ")} §6is ${ip}`
        );
        this.createSuccessSound(apiVars.username);
    }
    getMostSimilarStringOutOfCMDArray(str) {
        let numArr = [];
        this._cmds.forEach((_) => {
            numArr.push([_.name, similarity(_.name, str)]);
        });
        numArr = numArr.sort((a, b) => b[1] - a[1]);
        if (numArr[0][1] > 0.598) return numArr[0][0];
        else return;
    }
    broadcast(apiVars, apiFns) {
        const { msg } = apiVars;
        const { tellraw } = apiFns;
        if (
            !this.hasTag(msg.sender.nameTag, "admin") &&
            !this.hasTag(msg.sender.nameTag, "staff") &&
            !this.hasTag(msg.sender.nameTag, "v")
        )
            return this.dialog_no_admin("manage", tellraw, msg.sender.nameTag);
        let args = msg.message.split(" ");
        args.shift();
        let msgBroadcast = args.join(" ");
        let broadcast = `§4<§6§lBroadcast§r§4> §e${
            msg.sender.nameTag
        } §7>> §r${msgBroadcast.replace(/\&/g, "§")}`;
        this.tellraw("@a", broadcast);
        this.createSuccessSound(apiVars.username);
    }
    rickroll(apiVars, apiFns) {
        const { msg } = apiVars;
        const { tellraw } = apiFns;
        if (
            !this.hasTag(msg.sender.nameTag, "admin") &&
            !this.hasTag(msg.sender.nameTag, "staff") &&
            !this.hasTag(msg.sender.nameTag, "v")
        )
            return this.dialog_no_admin("manage", tellraw, msg.sender.nameTag);
        this.tellraw(
            `@a[name=!"${msg.sender.nameTag}"]`,
            `§4Never gonna give you up\n§4Never gonna let you down\n§4Never gonna run around and desert you\n§4Never gonna make you cry\n§4Never gonna say goodbye\n§4Never gonna tell a lie and hurt you\n§6You have been rickrolled by §e@${msg.sender.nametag}§6. Go laugh at them for using a command this bad.`
        );
        this.tellraw(
            msg.sender.nameTag,
            "§6I rickrolled everyone else in this server."
        );
        this.createSuccessSound(apiVars.username);
    }
    toggleAdvanced(apiVars, apiFns) {
        const { msg } = apiVars;
        const { tellraw } = apiFns;
        if (
            !this.hasTag(msg.sender.nameTag, "admin") &&
            !this.hasTag(msg.sender.nameTag, "staff") &&
            !this.hasTag(msg.sender.nameTag, "v")
        )
            return this.dialog_no_admin("manage", tellraw, msg.sender.nameTag);
        let args = msg.message.split(" ");
        args.shift();
        if (!args.length)
            return tellraw(
                msg.sender.nameTag,
                "§cPlease read the documentation to include an argument"
            );
        this.runCmd(`scoreboard objectives add advConfig dummy`);
        switch (args[0]) {
            case "player-join-date-tracking":
                if (args[1] === "on") {
                    this.runCmd(
                        `scoreboard players set PlayerJoinDateTrack advConfig 1`
                    );
                    this.tellraw(
                        msg.sender.nameTag,
                        `§aEnabled player join date tracking. Azalea will now track the last time any player has joined.`
                    );
                    return;
                }
                this.runCmd(
                    `scoreboard players set PlayerJoinDateTrack advConfig 0`
                );
                this.tellraw(
                    msg.sender.nameTag,
                    `§4Disabled player join date tracking. Azalea will not track the last time any player has joined anymore.`
                );
                break;
        }
        this.createSuccessSound(apiVars.username);
    }
    explodeTest(apiVars, apiFns) {
        const { username, msg } = apiVars;
        let explosionSize = msg.message.split(" ")[1];
        let explosionOptions = new ExplosionOptions();
        explosionOptions.breaksBlocks = true;
        msg.sender.dimension.createExplosion(
            msg.sender.location,
            parseInt(explosionSize),
            explosionOptions
        );
    }
    veryUselessTestCommand(apiVars, apiFns) {
        const { username } = apiVars;
    }
    dbset(apiVars, apiFns) {
        let db = new Database("test");
        db.set("test", "abcdefghijklmnopqrstuvwxyzyxwvutsrqponmlkjihgfedcba");
    }
    dbget(apiVars, apiFns) {
        const { username } = apiVars;
        let db = new Database("test");
        this.tellraw(username, db.get("test"));
    }
    getTags(player, runCmd) {
        const data = runCmd(`tag "${player}" list`);
        if (data.error) return null;
        let tags = data.statusMessage.match(/(?<=: ).*$/);
        if (tags) return tags[0].split("§r, §a");
    }
    negative(num) {
        if (num > 0) return -num;
        else return num;
    }
    positive(num) {
        if (num < 0) return -num;
        else return num;
    }
    // on_loop() {
    //     this.runCmd(`scoreboard players set gmt tz 0`)
    //         (`scoreboard players set eat tz 3`)
    //         (`scoreboard players set cet tz 1`)
    //         (`scoreboard players set wat tz 1`)
    //         (`scoreboard players set cat tz 2`)
    //         (`scoreboard players set sast tz 2`)
    //         (`scoreboard players set ast tz -4`)
    //         (`scoreboard players set hst -10`)
    // }
    getTimezoneOffset(d, timeZone, tellraw) {
        try {
            const a = d
                .toLocaleString("ja", {
                    timeZone,
                })
                .split(/[/s:]/);
            a[1]--;
            const t1 = Date.UTC(...a);
            const t2 = new Date(d).setMilliseconds(0);
            tellraw("@a", `${a.join(", ")}`);
            return (t2 - t1) / 60 / 1000;
        } catch (e) {
            tellraw("@a", "§cTimezone Error: " + e);
        }
    }
    basicOnOffToggle(name, cl) {
        let getScore = this.getScore;
        let runCmd = this.runCmd;
        let LangEn = this.LangEn;
        return {
            initialize() {
                runCmd(`scoreboard objectives add Toggles dummy`);
            },
            getValue() {
                return getScore(`Toggles`, `${name}`, runCmd)
                    ? getScore(`Toggles`, `${name}`, runCmd)
                    : 0;
            },
            toggle() {
                let score = getScore(`Toggles`, `${name}`, runCmd)
                    ? getScore(`Toggles`, `${name}`, runCmd)
                    : 0;
                let newScore = score == 0 ? 1 : 0;
                runCmd(`scoreboard players set "${name}" Toggles ${newScore}`);
            },
            getToggleText() {
                let score = getScore(`Toggles`, `${name}`, runCmd)
                    ? getScore(`Toggles`, `${name}`, runCmd)
                    : 0;
                if (score)
                    return LangEn.basicOnOffToggleTextOn.replace(
                        "$ToggleName",
                        name
                    );
                else
                    return LangEn.basicOnOffToggleTextOff.replace(
                        "$ToggleName",
                        name
                    );
            },
        };
    }
    timeSet(preset) {
        this.runCmd(`time set ${preset}`);
    }
    qtAdminOnly(apiVars, apiFns) {
        if (
            !this.hasTag(apiVars.username, "v") &&
            !this.hasTag(apiVars.username, "staff") &&
            !this.hasTag(apiVars.username, "admin")
        )
            return this.dialog_no_admin(
                "set-admin-only",
                apiFns.tellraw,
                apiVars.username
            );

        let adminOnly = this.basicOnOffToggle("Admin-Only-Server");
        adminOnly.initialize();
        adminOnly.toggle();
        this.tellraw(apiVars.username, adminOnly.getToggleText());
    }
    pluginsList(apiVars, apiFns) {
        this.tellraw(
            apiVars.username,
            `§c--- §3${this.plugins.length} plugin${
                this.plugins.length == 1 ? `` : `s`
            } §c---`
        );
        for (const plugin of this.plugins) {
            this.tellraw(
                apiVars.username,
                `${this.parseColor(
                    plugin.color ? plugin.color : "light-gray"
                )}${
                    plugin.name
                        ? plugin.name
                        : "NO NAME PLUGIN (PLEASE ADD A NAME)"
                }${plugin.description ? ` §r${plugin.description}` : ``}`
            );
        }
        this.createSuccessSound(apiVars.username);
    }
    // 1.19+ ONLY
    // what am i doing here
    getOfflinePlayers() {
        let objective = world.scoreboard.getObjective("OfflinePlayers");
        let participants = objective.getParticipants();
        let offlinePlayers = [];
        for (const participant of participants) {
            offlinePlayers.push(participant.displayName.replace("PLAYER:", ""));
        }
    }
    azalea_on_5tick(azalea) {
        this.reoccurringMessagesCheck();
        this.createObjective("AzaleaData");
        this.setScore("AzaleaData", "Seconds", azalea2.now());
        if ((Math.floor(Date.now() / 1000) - 1640099048) % 34214400 == 0) {
            let years = Math.floor(Date.now() / 1000) - 1640099048;
            this.tellraw(
                `@a`,
                `§aThe ${years} birthday of azalea will be celebrated on the discord server soon! (Maybe)`
            );
        }
        // let warpsSubmenu = this.textGuiTest.submenus.find(
        //     _ => _.name == "+WARPS"
        // );
        // let warpsSubmenuOptions = [];
        // let warpsInvisible2 = this.listWarpsInvisible2();
        // for (const warp of warpsInvisible2) {
        //     warpsSubmenuOptions.push({
        //         type: "Tag",
        //         text: warp,
        //         tag: `command:WARP_TP ${warp}`,
        //     });
        // }
        // if (warpsSubmenu)
        //     this.textGuiTest[this.textGuiTest.submenus.indexOf(warpsSubmenu)] =
        //         {
        //             options: warpsSubmenuOptions,
        //             name: "+WARPS",
        //             title: "Server Warps",
        //         };
        // if (!warpsSubmenu)
        //     this.textGuiTest.submenus.push({
        //         options: warpsSubmenuOptions,
        //         name: "+WARPS",
        //         title: "Server Warps",
        //     });
        // this.show_text_gui();
        this.checkBans();
        if (this.getScore("events", "RegisterToHelpEvent")) {
            let obj = JSON.parse(
                this.get("cmds1", "azalea") ? this.get("cmds1", "azalea") : "[]"
            );
            for (let i = 0; i < obj.length; i++) {
                let cmd = obj[i];
                let _cmd = this._cmds.find((__cmd) => __cmd.name == cmd.name);
                if (!_cmd) this._cmds.push(cmd);
            }
            this.setScore("events", "RegisterToHelpEvent", 0);
            this.delete("cmds1", "azalea");
        }
        if (this.getScore("events", "RegisterAdminPanelFeatureEvent")) {
            let obj = JSON.parse(
                this.get("admin_panel_features", "azalea")
                    ? this.get("admin_panel_features", "azalea")
                    : "[]"
            );
            for (let i = 0; i < obj.length; i++) {
                let feature = obj[i];
                this.adminPanelFeatures.push(feature);
            }
            this.delete("admin_panel_features", "azalea");
            this.setScore("events", "RegisterAdminPanelFeatureEvent", 0);
        }
        0;
        if (this.getScore("events", "RegisterPluginEvent")) {
            let obj = JSON.parse(
                this.get("plug1", "azalea") ? this.get("plug1", "azalea") : "[]"
            );
            this.delete("plug1", "azalea");
            events.emit("raw", "registerPluginEvent", this.plugins, obj);
            this.setScore("events", "RegisterPluginEvent", 0);
        }
        this.checkRegions();
        let plugins = this.plugins,
            parseColor = this.parseColor;
        let TickCallback = world.events.tick.subscribe((tickEvent) => {
            try {
                world.getDimension("overworld").runCommand(`testfor @a`);
                world.events.tick.unsubscribe(TickCallback);
                this.canWriteLeaderboards = true;
                let tick2s = 0;
                // let tickEvent22 = world.events.tick.subscribe(()=>{
                //     tick2s++;
                //     if(tick2s % 35 == 0) {
                //         world.events.tick.unsubscribe(tickEvent22);
                //         for(let i = 0;i < plugins.length;i++) {
                //             if(plugins[i].name.toLowerCase() !== "azalea base") {
                //                 let text = `§aPlugin ${plugins[i].color ? parseColor(plugins[i].color) : '§7'}${plugins[i].name ? plugins[i].name : 'Not Defined'} §r§aloaded!`;
                //                 world.getDimension('overworld').runCommand(`tellraw @a {"rawtext":[{"text":${JSON.stringify(text)}}]}`)
                //             }
                //         }
                //     }
                // })
            } catch (error) {}
        });
        if (this.canWriteLeaderboards) {
            let leaderboards = JSON.parse(
                this.get("leaderboards", "lb")
                    ? this.get("leaderboards", "lb")
                    : "[]"
            );
            for (const lb of leaderboards) {
                writeLeaderboard([lb.x, lb.y, lb.z], lb.objective, lb.name);
            }
        }
        tempStorage.set("toggleAntiCheat", this.isToggleOn("Anticheat"));
        tempStorage.set("anti32kEnabled", this.isToggleOn("Anti-32k-Enabled"));
        tempStorage.set(
            "antiNukerEnabled",
            this.isToggleOn("Anti-Nuker-Enabled")
        );
        // this.checkForRegisteredPlugins();
        if (this.isToggleOn("Tag-Backups")) {
            for (const player of world.getPlayers()) {
                let tags = player.getTags();
                let tags2 = this.tagBackupMap.has(player.name)
                    ? this.tagBackupMap.get(player.name)
                    : [];
                // console.warn(tags2.length);
                // console.warn(tags.length);
                // console.warn(tags.length - tags2.length);
                let pwarpCount1, pwarpCount2;
                try {
                    pwarpCount1 = tags.filter((t) =>
                        t.startsWith("PersonalWarp")
                    ).length;
                    pwarpCount2 = tags2.filter((t) =>
                        t.startsWith("PersonalWarp")
                    ).length;
                } catch (e) {}
                if (
                    (tags2.length >= tags.length &&
                        tags.length - tags2.length <= -4) ||
                    pwarpCount1 - pwarpCount2 <= -2
                ) {
                    for (const tag of tags2) {
                        player.addTag(tag);
                    }
                }
                if (tags.length) this.tagBackupMap.set(player.name, tags);
            }
        }
        if (!this.loaded) {
            let TickCallback2 = world.events.tick.subscribe((tickEvent) => {
                try {
                    world.getDimension("overworld").runCommand(`testfor @a`);
                    world.events.tick.unsubscribe(TickCallback2);
                    this.canWriteLeaderboards = true;
                    let tick2s = 0;
                    let tickEvent22 = world.events.tick.subscribe(() => {
                        tick2s++;
                        if (tick2s % 35 == 0) {
                            world.events.tick.unsubscribe(tickEvent22);
                            for (let i = 0; i < plugins.length; i++) {
                                if (
                                    plugins[i].name.toLowerCase() !==
                                    "azalea base"
                                ) {
                                    let text = `§aPlugin ${
                                        plugins[i].color
                                            ? parseColor(plugins[i].color)
                                            : "§7"
                                    }${
                                        plugins[i].name
                                            ? plugins[i].name
                                            : "Not Defined"
                                    } §r§aloaded!`;
                                    world
                                        .getDimension("overworld")
                                        .runCommand(
                                            `tellraw @a {"rawtext":[{"text":${JSON.stringify(
                                                text
                                            )}}]}`
                                        );
                                }
                            }
                        }
                    });
                } catch (error) {}
            });

            let cmdTags = JSON.parse(
                this.get(`cmdtags`, `cmdtags`)
                    ? this.get(`cmdtags`, `cmdtags`)
                    : "[]"
            );
            if (cmdTags.length) {
                for (let i = 0; i < cmdTags.length; i++) {
                    let commandTag = cmdTags[i];
                    let data = JSON.parse(
                        this.get(`cmdtag:${commandTag.cmd}`, `config2`)
                            ? this.get(`cmdtag:${commandTag.cmd}`, `config2`)
                            : "{}"
                    );
                    this._cmds.push({
                        name: cmdTags[i].cmd,
                        description:
                            data && data.description ? data.description : " ",
                        category:
                            data && data.category
                                ? data.category
                                : "Custom Commands",
                    });
                }
            }
            this.loaded = true;
        }
        // this._5ticks += 1;
        // let date = new Date();
        // let hours = "00".slice(0,this.negative(date.getHours().toString().length))+date.getHours().toString();
        // let minutes = "00".slice(0,this.negative(date.getMinutes().toString().length))+date.getMinutes().toString();
        // let seconds = "00".slice(0,this.negative(date.getSeconds().toString().length))+date.getSeconds().toString();
        // let monthNumber = date.getMonth();
        // let months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
        // let month = months[monthNumber];
        // let day = date.getDate();
        // let year = date.getUTCFullYear();
        // // // console.warn('5tick loop!');
        let allPlayers = [...world.getPlayers()];
        let eventList = ["using_item"];
        // Read the code below this to get 50 strokes
        function getHash(input) {
            var hash = 0,
                len = input.length;
            for (var i = 0; i < len; i++) {
                hash = (hash << 5) - hash + input.charCodeAt(i);
                hash |= 0; // to 32bit integer
            }
            return hash;
        }
        this.runCmd(`scoreboard objectives add PIDs dummy`);
        this.runCmd(`scoreboard objectives add WorldEnv dummy`);
        this.runCmd(`scoreboard players add Ticks WorldEnv 5`);
        this.runCmd(
            `scoreboard players set PlayersOnline WorldEnv ${allPlayers.length}`
        );
        this.runCmd(`scoreboard objectives add AzlVersion dummy`);
        this.runCmd(`scoreboard players set major AzlVersion 0`);
        this.runCmd(`scoreboard players set minor AzlVersion 3`);
        this.runCmd(`scoreboard players set micro AzlVersion 0`);
        this.runCmd(`scoreboard players set nano AzlVersion 4`);
        this.runCmd(`scoreboard players set beta AzlVersion 4`);
        this.runCmd(`function azaleaon5tick`);
        for (const player of allPlayers) {
            let id = getHash(player.nameTag);
            this.runCmd(
                `scoreboard players set "${player.nameTag}" PIDs ${id}`
            );
            const inventory = player.getComponent("inventory");
            let itemHeld = inventory.container.getItem(player.selectedSlot);
            this.runCmd(
                `scoreboard players set @a[name="${player.nameTag}"] playerX ${player.location.x}`
            );
            this.runCmd(
                `scoreboard players set @a[name="${player.nameTag}"] playerY ${player.location.y}`
            );
            this.runCmd(
                `scoreboard players set @a[name="${player.nameTag}"] playerZ ${player.location.z}`
            );
            let worldBorderEnabled = this.getScore(
                "basicConfig",
                "WorldBorderEnabled"
            );
            let orgPlayerX = parseInt(player.location.x.toString());
            let orgPlayerY = parseInt(player.location.y.toString());
            let orgPlayerZ = parseInt(player.location.z.toString());
            let playerX = player.location.x;
            let playerY = player.location.y;
            let playerZ = player.location.z;
            let adminOnly = this.basicOnOffToggle("Admin-Only-Server");
            if (adminOnly.getValue()) {
                if (
                    !this.hasTag(player.nameTag, "v") &&
                    !this.hasTag(player.nameTag, "staff") &&
                    !this.hasTag(player.nameTag, "admin")
                ) {
                    if (player.location.y < 850) {
                        this.runCmd(
                            `scoreboard objectives add "Misc000000-X" dummy`
                        );
                        this.runCmd(
                            `scoreboard objectives add "Misc000000-Y" dummy`
                        );
                        this.runCmd(
                            `scoreboard objectives add "Misc000000-Z" dummy`
                        );
                        this.runCmd(
                            `scoreboard players set "${
                                player.nameTag
                            }" "Misc000000-X" ${Math.trunc(player.location.x)}`
                        );
                        this.runCmd(
                            `scoreboard players set "${
                                player.nameTag
                            }" "Misc000000-Y" ${Math.trunc(player.location.y)}`
                        );
                        this.runCmd(
                            `scoreboard players set "${
                                player.nameTag
                            }" "Misc000000-Z" ${Math.trunc(player.location.z)}`
                        );
                    }
                    this.runCmd(`tp "${player.nameTag}" 0 1000 0`);
                    this.tellraw(
                        player.nameTag,
                        `§cThis server is only open to admins! §6Please join again later.`
                    );
                } else if (playerY > 850) {
                    let spawnX = this.getScoreQ(`Misc000000-X`, player.nameTag)
                        ? this.getScoreQ(`Misc000000-X`, player.nameTag)
                        : this.getScore(`warp_spawn`, `x`)
                        ? this.getScore(`warp_spawn`, `x`)
                        : 0;
                    let spawnY = this.getScoreQ(`Misc000000-Y`, player.nameTag)
                        ? this.getScoreQ(`Misc000000-Y`, player.nameTag)
                        : this.getScore(`warp_spawn`, `y`)
                        ? this.getScore(`warp_spawn`, `y`)
                        : -60;
                    let spawnZ = this.getScoreQ(`Misc000000-Z`, player.nameTag)
                        ? this.getScoreQ(`Misc000000-Z`, player.nameTag)
                        : this.getScore(`warp_spawn`, `z`)
                        ? this.getScore(`warp_spawn`, `z`)
                        : 0;
                    this.runCmd(
                        `tp "${player.nameTag}" ${spawnX} ${spawnY} ${spawnZ}`
                    );
                }
            } else if (playerY > 850) {
                let spawnX = this.getScoreQ(`Misc000000-X`, player.nameTag)
                    ? this.getScoreQ(`Misc000000-X`, player.nameTag)
                    : this.getScore(`warp_spawn`, `x`)
                    ? this.getScore(`warp_spawn`, `x`)
                    : 0;
                let spawnY = this.getScoreQ(`Misc000000-Y`, player.nameTag)
                    ? this.getScoreQ(`Misc000000-Y`, player.nameTag)
                    : this.getScore(`warp_spawn`, `y`)
                    ? this.getScore(`warp_spawn`, `y`)
                    : -60;
                let spawnZ = this.getScoreQ(`Misc000000-Z`, player.nameTag)
                    ? this.getScoreQ(`Misc000000-Z`, player.nameTag)
                    : this.getScore(`warp_spawn`, `z`)
                    ? this.getScore(`warp_spawn`, `z`)
                    : 0;
                this.runCmd(
                    `tp "${player.nameTag}" ${spawnX} ${spawnY} ${spawnZ}`
                );
            }
            if (worldBorderEnabled) {
                let worldBorderSize = this.getScore(
                    "basicConfig",
                    "WorldBorderSize"
                )
                    ? this.getScore("basicConfig", "WorldBorderSize")
                    : 500;
                if (!this.hasTag(player.nameTag, "godmode")) {
                    if (Math.trunc(playerX) > worldBorderSize) {
                        playerX = worldBorderSize - 1;
                        this.runCmd(
                            `tp "${player.nameTag}" ${playerX} ${playerY} ${playerZ}`
                        );
                    }
                    if (Math.trunc(playerX) < -worldBorderSize) {
                        playerX = -(worldBorderSize - 1);
                        this.runCmd(
                            `tp "${player.nameTag}" ${playerX} ${playerY} ${playerZ}`
                        );
                    }
                    if (Math.trunc(playerZ) > worldBorderSize) {
                        playerZ = worldBorderSize - 1;
                        this.runCmd(
                            `tp "${player.nameTag}" ${playerX} ${playerY} ${playerZ}`
                        );
                    }
                    if (Math.trunc(playerZ) < -worldBorderSize) {
                        playerZ = -(worldBorderSize - 1);
                        this.runCmd(
                            `tp "${player.nameTag}" ${playerX} ${playerY} ${playerZ}`
                        );
                    }
                }
            } else {
                let worldBorderSize = 10000000;
                if (Math.trunc(playerX) > worldBorderSize) {
                    playerX = worldBorderSize - 1;
                    this.runCmd(
                        `tp "${player.nameTag}" ${playerX} ${playerY} ${playerZ}`
                    );
                }
                if (Math.trunc(playerX) < -worldBorderSize) {
                    playerX = -(worldBorderSize - 1);
                    this.runCmd(
                        `tp "${player.nameTag}" ${playerX} ${playerY} ${playerZ}`
                    );
                }
                if (Math.trunc(playerZ) > worldBorderSize) {
                    playerZ = worldBorderSize - 1;
                    this.runCmd(
                        `tp "${player.nameTag}" ${playerX} ${playerY} ${playerZ}`
                    );
                }
                if (Math.trunc(playerZ) < -worldBorderSize) {
                    playerZ = -(worldBorderSize - 1);
                    this.runCmd(
                        `tp "${player.nameTag}" ${playerX} ${playerY} ${playerZ}`
                    );
                }
            }
            // if(playerX != orgPlayerX || playerY != orgPlayerY || playerZ != orgPlayerZ) this.runCmd(`tp "${player.nameTag}" ${playerX} ${playerY} ${playerZ}`);
            // let tags = this.getTags(player.nameTag,this.runCmd);
            let tags = player.getTags();
            for (const tag of tags) {
                // this.tellraw(player.nameTag,tags[i]);
                // if(tags[i].startsWith('holding_')) this.runCmd(`tag "${player.nameTag}" remove "${tags[i]}"`)
                if (tag.startsWith("holding_")) player.removeTag(tag);
                if (eventList.includes(tag)) player.removeTag(tag);
            }
            if (itemHeld && itemHeld.id) {
                // this.runCmd(`tag "${player.nameTag}" add "${'holding_'+itemHeld.id}.${itemHeld.data ? itemHeld.data.toString: "0"}"`);
                player.addTag(
                    `${"holding_" + itemHeld.id}.D${
                        itemHeld.data ? itemHeld.data.toString() : "0"
                    }`
                );
                player.addTag(
                    `${"holding_" + itemHeld.id}.D${
                        itemHeld.data ? itemHeld.data.toString() : "0"
                    }C${itemHeld.amount ? itemHeld.amount.toString() : "1"}`
                );
                player.addTag(
                    `${"holding_" + itemHeld.id}.C${
                        itemHeld.amount ? itemHeld.amount.toString() : "1"
                    }`
                );
                player.addTag(`${"holding_" + itemHeld.id}`);
                if (itemHeld && itemHeld.nameTag)
                    player.addTag(`${"holding_name_" + itemHeld.nameTag}`);
            } else {
                // this.runCmd(`tag "${player.nameTag}" add "holding_nothing"`)
                player.addTag(`holding_nothing`);
            }
        }
        // for(let i = 0;i < players.length;i++) {
        //     let hoursPlayed = this.getScore('TimeHours',players[i].nameTag);
        //     let minutesPlayed = this.getScore('TimeMinutes',players[i].nameTag);
        //     let secondsPlayed = this.getScore('TimeSeconds',players[i].nameTag);
        //     let actionbar = `§e§o${hours}:${minutes}:${seconds} §r§l§6UTC §r§7@ §r§o§9${month} ${day}, ${year}\n§a${money}§2$ §3Played §d${hoursPlayed}§ah §e${minutesPlayed}§6m §b${secondsPlayed}§3s`;
        //     azalea.runCmd(`titleraw @a[name="${players[i].nameTag}",tag=!actionbar.disabled] actionbar {"rawtext":[{"text":${JSON.stringify(actionbar)}}]}`)
        // }
    }
    randString(length = 3) {
        let validChars = "abcdefghijklmnopqrstuvwxyz1234567890";
        let str = "";
        for (let i = 0; i < length; i++) {
            str += validChars[Math.floor(Math.random() * validChars.length)];
        }
        return str;
    }
    createChat(apiVars, apiFns) {
        // let itemHeld = apiVars.player.getComponent("inventory").container.getItem(apiVars.player.selectedSlot);
        // this.addShopItem(itemHeld);
        // apiVars.player.getComponent('inventory').container.addItem(this.getShopItem());
        // return;
        // Get variables
        const { msg, username } = apiVars;
        const player = msg.sender;

        // Get and set scores
        // let previousSessionID = this.getScore("chatVars", "Session") ? this.getScore("chatVars", "Session") : 0;
        // let currentSessionID = previousSessionID + 1;
        let currentSessionID = -1;
        this.runCmd(`scoreboard objectives add chatVars dummy`);
        this.runCmd(
            `scoreboard players set Session chatVars ${currentSessionID}`
        );

        // Set player score and tag
        let chatID = this.randString(5);
        player.addTag("in_chatv2" + chatID);
        this.chatMap.set(username, chatID);
        // this.runCmd(`scoreboard objectives add chats dummy`);
        // this.runCmd(`scoreboard players set @a[name="${username}"] chats ${currentSessionID}`);

        // Give message to player
        this.tellraw(
            username,
            `§4Successfully joined chat. §6Session §7#${chatID}`
        );
        this.tellraw(
            username,
            `§aInvite people using the session number. You can tell them with §6${this.getPrefix()}chat-invite <Player Name>`
        );
    }
    // getPlayerData(player) {

    // }
    inviteToChat(apiVars, apiFns) {
        // Get variables
        const { msg, username } = apiVars;
        const player = msg.sender;
        const message = msg.message;

        // Get player name argument
        let args = message.split(" ");
        args.shift();
        const otherPlayer = args.join(" ");

        // Get the session id from the player who sent the invite
        let sessionID = this.chatMap.get(username);
        if (!sessionID)
            return this.tellraw(
                player.nameTag,
                `§4You can't use ${this.getPrefix()}chat-invite if you're not in a chat!`
            );

        // Tell the other player
        this.tellraw(
            otherPlayer,
            `§e@${
                player.nameTag
            } §4invited you to join a chat. Use §6${this.getPrefix()}chat-join ${sessionID} §4to join.`
        );

        // Tell the player who sent the invite
        this.tellraw(
            username,
            `§4You invited §e@${otherPlayer} §4to join your chat! Now, all you do is wait.`
        );
        this.createSuccessSound(apiVars.username);
    }
    stringOnlyContainsNumbers(str) {
        return /^\d+$/.test(str);
    }
    joinChat(apiVars, apiFns) {
        // Get Variables
        const { msg, username } = apiVars;
        const player = msg.sender;
        const message = msg.message;

        // Get session ID argument
        let args = message.split(" ");
        args.shift();
        const sessionID = args.join(" ");

        // Do some tests
        // if (!this.stringOnlyContainsNumbers(sessionID))
        //     return this.tellraw(player.nameTag, "§4Invalid session ID");

        // Join the chat
        player.addTag("in_chatv2" + sessionID);
        this.runCmd(`scoreboard objectives add chats dummy`);
        this.chatMap.set(username, sessionID);

        // Send the player a message
        this.tellraw(
            username,
            "§4You joined a chat with the session ID of #" + sessionID
        );
        this.createSuccessSound(apiVars.username);
    }
    chatOnline(apiVars, apiFns) {
        let chatID = this.chatMap.get(username);
        let num = 0;
        let players = [];
        for (const player of world.getPlayers()) {
            if (player.hasTag(`in_chatv2` + chatID)) {
                num++;
                players.push(player.name);
            }
        }
        this.tellraw(
            apiVars.username,
            `There are ${num} players online and in the chat §7${chatID}\n§r${players.join(
                "\n§r"
            )}`
        );
    }
    leaveChat(apiVars, apiFns) {
        // Get Variables
        const { msg, username } = apiVars;
        const player = msg.sender;
        const message = msg.message;

        // Check if the player was even in a chat
        const wasPlayerInChat = this.chatMap.has(username) ? true : false;

        // Remove tags and reset player session id
        let chatID = this.chatMap.get(username);
        try {
            player.removeTag("in_chatv2" + chatID);
        } catch (e) {}
        this.chatMap.delete(username);

        // Tell message to player
        if (wasPlayerInChat)
            return this.tellraw(username, "§2Successfully left the chat!");
        else
            return this.tellraw(
                username,
                "§4You were not even in a chat. How do you expect to leave anything?"
            );

        this.createSuccessSound(apiVars.username);
    }
    startsWithColorCode(str) {
        if (!str.startsWith("§")) return false;
        let char2 = str[1];
        let num = char2.charCodeAt();
        if ((num >= 48 && num <= 57) || (num >= 97 && num <= 103)) {
            return true;
        }
    }
    gen64bitnum() {
        return Math.floor(Math.random() * (9223372036854775807 - 1 + 1) + 1);
    }
    // broadcast(apiVars,apiFns) {
    //     const {username,apiFns} = apiVars;
    // }
    removeNumberE(num) {
        return num.toLocaleString().split(",").join("");
    }
    setNum(key, num, table = "default") {
        if (typeof num === "string") num = parseInt(num);
        this.set(key, this.removeNumberE(num), table);
    }
    getNum(key, table = "default") {
        let num = this.get(key, table) ? this.get(key, table) : null;
        if (num) {
            if (!this.stringOnlyContainsNumbers(num)) return;
            num = parseInt(num);
        } else {
            return;
        }
    }
    msToHMS(ms) {
        // 1- Convert to seconds:
        let seconds = ms / 1000;
        // 2- Extract hours:
        const hours = parseInt(seconds / 3600); // 3,600 seconds in 1 hour
        seconds = seconds % 3600; // seconds remaining after extracting hours
        // 3- Extract minutes:
        const minutes = parseInt(seconds / 60); // 60 seconds in 1 minute
        // 4- Keep only seconds not extracted to minutes:
        seconds = seconds % 60;
        return hours + ":" + minutes + ":" + seconds;
    }
    padTo2Digits(num) {
        return num.toString().padStart(2, "0");
    }

    convertMsToTime(milliseconds) {
        let seconds = Math.floor(milliseconds / 1000);
        let minutes = Math.floor(seconds / 60);
        let hours = Math.floor(minutes / 60);

        seconds = seconds % 60;
        minutes = minutes % 60;

        // 👇️ If you don't want to roll hours over, e.g. 24 to 00
        // 👇️ comment (or remove) the line below
        // commenting next line gets you `24:00:00` instead of `00:00:00`
        // or `36:15:31` instead of `12:15:31`, etc.
        hours = hours % 24;

        return `${this.padTo2Digits(hours)}:${this.padTo2Digits(
            minutes
        )}:${this.padTo2Digits(seconds)}`;
    }
    dbGet(vars, fns) {
        let args = vars.args;
        let key = args[0], table = args[1];
        let result = this.get(key, table) ? this.get(key, table) : "Null";
        this.tellraw(vars.username, `-=-=-\nKEY: ${key}\nTABLE: ${table}\nVALUE: ${result}\n-=-=-`);
    }
    // OVERHAULED IN V0.3B1
    azalea_on_msg(msg, { tellraw, runCmd }) {
        if(msg.sender.hasTag('berpUser') || msg.sender.hasTag('azaleaSmartDb')) {
            msg.cancel = true;
        }
        if(msg.sender.hasTag('azaleaSmartDb') && msg.sender.hasTag('berpUser')) {
            msg.cancel = true;
            return;
        }
    try {
            if(msg.sender.hasTag('azaleaSmartDb') && msg.sender.hasTag('berpUser') && JSON.parse(msg.message).startsWith("AZALEA-DB-PACKET ")) {
                //"AZALEA-STRING-REQUEST value"
                msg.cancel = true;
                msg.message = JSON.parse(msg.message);
                let text = msg.message.substring("AZALEA-DB-PACKET ".length).split(' ');
                let table = text[0];
                let tableData = JSON.parse(text.slice(1).join(' '));
                this.tables.set(table, new Map(Object.entries(tableData)))
                // this.pendingAzaleaStringMessageRequestsFromBerpBot.push(msg.message.substring("AZALEA-DB-PACKET ".length).slice(0,-1));
                return;
            }
        }catch(e) {

        }
        try {
            if(msg.sender.hasTag('azaleaSmartDb') && msg.sender.hasTag('berpUser')) {
                msg.cancel = true;
                return;
            }
        } catch(e) {}

        // if(msg.message.startsWith(this.getPrefix())) return;
        // let api = new AAPI();
        // msg.cancel = true;
        // this.tellraw('@a', `${api.parseChatRanks(msg)}`)
        // return;
        let newName = msg.sender.nameTag;
        if (this.stringOnlyContainsNumbers(newName.slice(-4)))
            newName = newName.slice(0, -4);
        let tempMuted = msg.sender
            .getTags()
            .find((_) => _.startsWith("tempmuted:"));
        if (tempMuted) {
            let duration = parseInt(tempMuted.replace("tempmuted:", ""));
            let now = Date.now();
            if (now > duration) msg.sender.removeTag(tempMuted);
            else {
                msg.cancel = true;
                return this.tellraw(
                    msg.sender.nameTag,
                    `§cYou are muted! §dTime left: §c${this.convertMsToTime(
                        duration - now
                    )}`
                );
            }
        }
        // if()
        let commonPrefixes = [
            "\\",
            "-",
            ".",
            ";",
            "!",
            "$",
            "&",
            "=",
            "+",
            ">",
            "<",
            "?",
        ];
        if (!tempStorage.has("onlychatranks")) {
            if (
                commonPrefixes.some(
                    (element, index) =>
                        this.getPrefix() != element &&
                        msg.message.startsWith(element)
                )
            )
                this.tellraw(
                    msg.sender.nameTag,
                    sendChatMessage({
                        ranks: ["§a§lAzalea"],
                        nameTag: "§b§lHelper+",
                        message: `If you\'re trying to find the prefix, it is §6${this.getPrefix()}`,
                    })
                );
        }
        if (
            !tempStorage.has("onlychatranks") &&
            msg.message.startsWith(this.getPrefix())
        )
            return;
        if (this.isToggleOn("Filter-Bypass")) {
            msg.message = msg.message
                .replace(/i/g, "≡")
                .replace(/c/g, "±")
                .replace(/o/g, "≥")
                .replace(/I/g, "≡")
                .replace(/C/g, "±")
                .replace(/O/g, "≥")
                .replace(/a/g, "≤")
                .replace(/A/g, "≤");
        }
        let prefix = this.getPrefix();
        events.emit(`AzaleaLogger:PlayerSentMessage`, msg, tellraw);
        let chatCooldown = this.getScore("basicConfig", "ChatCooldown")
            ? this.getScore("basicConfig", "ChatCooldown")
            : 0;
        let userChatcooldown = this.getScore("chatCooldown", msg.sender.nameTag)
            ? this.getScore("chatCooldown", msg.sender.nameTag)
            : 0;
        if (this.hasTag(msg.sender.nameTag, "staffchat")) {
            msg.cancel = true;
            this.tellraw(
                `@a[tag=staffchat,tag=detailed_font]`,
                `§¥§6<§eStaff Chat§6> §d${msg.sender.nameTag}§a: §7${msg.message}`
            );
            this.tellraw(
                `@a[tag=staffchat,tag=!detailed_font]`,
                `§6<§eStaff Chat§6> §d${msg.sender.nameTag}§a: §7${msg.message}`
            );
            return;
        }
        if (this.hasTag(msg.sender.nameTag, "muted")) {
            msg.cancel = true;
            return this.tellraw(
                msg.sender.nameTag,
                `§4You were muted. Please contact an admin or mod for help.`
            );
        }
        if (userChatcooldown > 0) {
            msg.cancel = true;
            return this.tellraw(
                msg.sender.nameTag,
                `§6You need to wait ${userChatcooldown} seconds to send a message`
            );
        } else {
            this.runCmd(
                `scoreboard players set @a[name="${msg.sender.nameTag}"] chatCooldown ${chatCooldown}`
            );
        }
        msg.cancel = true;
        let tags = this.getTags(msg.sender.nameTag, runCmd);
        tags = tags.map((tag) => {
            return tag.startsWith("§a") ? tag.replace("§a", "") : tag;
        });
        let ranks = [];
        let color;
        color = tags.find((e) => e.startsWith("name-color:"));
        if (color) {
            color = color.replace("name-color:", "");
            if (color.endsWith("§r")) {
                color = color.slice(0, -2);
            }
        }
        // this.tellraw('@a',color ? color.replace(/§0/g).replace(/[^0-9a-z\-]/gi,'') : 'undefined');
        if (typeof tags == "null")
            return tellraw(msg.sender.nameTag, "tags no defined");
        ranks = tags
            .filter((e) => e.startsWith("rank:"))
            .map((rank) => rank.replace("rank:", ""));
        let date = new Date();
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let seconds = date.getSeconds();
        let messageText = msg.message;
        // messageText = messageText.replace(/§/g,"&");
        let boldItalicRegex = /\*\*\*([\s\S]*?)\*\*\*/g;
        let boldRegex = /\*\*([\s\S]*?)\*\*/g;
        let italicRegex = /\*([\s\S]*?)\*/g;
        let boldItalicMatch = messageText.match(boldItalicRegex);
        let boldMatch = messageText.match(boldRegex);
        let italicMatch = messageText.match(italicRegex);
        if (boldItalicMatch) {
            for (let i = 0; i < boldItalicMatch.length; i++) {
                let boldItalicText = boldItalicMatch[i];
                messageText = messageText.replace(
                    boldItalicText,
                    `§r§l§o${boldItalicText.replace("***", "").slice(0, -3)}§r`
                );
            }
        }
        if (boldMatch) {
            for (let i = 0; i < boldMatch.length; i++) {
                let boldText = boldMatch[i];
                messageText = messageText.replace(
                    boldText,
                    `§r§l${boldText.replace("**", "").slice(0, -2)}§r`
                );
            }
        }
        if (italicMatch) {
            for (let i = 0; i < italicMatch.length; i++) {
                let italicText = italicMatch[i];
                messageText = messageText.replace(
                    italicText,
                    `§r§o${italicText.replace("*", "").slice(0, -1)}§r`
                );
            }
        }
        try {
            let channel = msg.sender
                .getTags()
                .find((e) => e.startsWith("joinedChannel:"))
                ?.substring(14);

            // let sessionID = this.getScore("chats", msg.sender.nameTag);
            let timeToggle = this.isToggleOn("Chat-Time");
            ranks = ranks.map((rank) =>
                rank.endsWith("§r") ? rank.slice(0, -2) : rank
            );
            let sessionID = this.chatMap.get(msg.sender.nameTag);
            let chatVersion = this.getScore("basicConfig", "chatVersion")
                ? this.getScore("basicConfig", "chatVersion") == 0
                    ? 0
                    : this.getScore("basicConfig", "chatVersion")
                : 4;
            // if (chatVersion > 4) chatVersion = 4;
            let message = `§r<${msg.sender.nameTag}§r> §r${msg.message}`;
            // -1 Is the Azalea Lite version
            if (!ranks.length)
                ranks.push(
                    this.get("default-rank", "chat")
                        ? this.get("default-rank", "chat")
                        : "§bMember"
                );
            if (this.getCurrentGuild(msg.sender)) {
                this.sendGuildMessage(msg, this.getCurrentGuild(msg.sender));
                return;
            }
            if (chatVersion == 1)
                message = `${
                    ranks && ranks.length
                        ? `§r§8[§r§7${ranks.join("§r§8, §r§7")}§r§8]`
                        : ``
                }${sessionID ? ` §dChat #${sessionID} ` : ` `}§r§8§o${
                    "00".slice(0, this.negative(hours.toString().length)) +
                    hours.toString()
                }:${
                    "00".slice(0, this.negative(minutes.toString().length)) +
                    minutes.toString()
                }:${
                    "00".slice(0, this.negative(seconds.toString().length)) +
                    seconds.toString()
                } §r§6UTC §r${
                    color
                        ? this.parseColor(color.replace("name-color:", ""))
                        : "§a"
                }${msg.sender.nameTag}§r§7: §r${messageText}`;
            else if (chatVersion == 2)
                message = `${
                    ranks && ranks.length
                        ? `§r§7${ranks
                              .map((rank) => {
                                  let char1 = rank[0],
                                      char2 = rank[1];
                                  return `§${
                                      char1 == "§" ? `${char2}` : `r`
                                  }[${rank}§r§${
                                      char1 == "§" ? `${char2}` : `r`
                                  }]`;
                              })
                              .join(" ")}`
                        : ``
                }${sessionID ? ` §cChat #${sessionID} ` : ` `}${
                    timeToggle
                        ? `§r§6§o${
                              "00".slice(
                                  0,
                                  this.negative(hours.toString().length)
                              ) + hours.toString()
                          }:${
                              "00".slice(
                                  0,
                                  this.negative(minutes.toString().length)
                              ) + minutes.toString()
                          }:${
                              "00".slice(
                                  0,
                                  this.negative(seconds.toString().length)
                              ) + seconds.toString()
                          } §r§eUTC `
                        : ``
                }§r${
                    color
                        ? this.parseColor(color.replace("name-color:", ""))
                        : "§a"
                }${msg.sender.nameTag}§r§7: §r${messageText}`;
            else if (chatVersion == -1)
                message = `${
                    ranks && ranks.length
                        ? `[§r${ranks.join("§r, §r")}§r]§r `
                        : ``
                }<${msg.sender.nameTag}> ${msg.message}`;
            else if (chatVersion == 3)
                message = `${
                    ranks && ranks.length
                        ? `§8[§r${ranks.join("§r§7, §r")}§r§8]`
                        : ``
                }${
                    this.getTeam(msg.sender.nameTag)
                        ? ` §1Team §r${this.getTeam(msg.sender.nameTag)}§r `
                        : ` `
                }${sessionID ? `§cChat #${sessionID} ` : ``}§r${
                    color
                        ? this.parseColor(color.replace("name-color:", ""))
                        : "§a"
                }${msg.sender.nameTag}§r§7: §r${messageText}`;
            else if (chatVersion == 4) {
                let team = this.getTeam(msg.sender.nameTag);
                let teamText = ``;
                let bracketColor = msg.sender
                    .getTags()
                    .find((tag) => tag.startsWith("bracket-color:"));
                if (bracketColor)
                    bracketColor = this.parseColor(
                        bracketColor.substring("bracket-color:".length)
                    );
                let sessionIdText = `${sessionID ? `§7CHAT-${sessionID}` : ``}`;
                if (team) {
                    let teamColorCode = this.startsWithColorCode(team)
                        ? `${team[0]}${team[1]}`
                        : `§r`;
                    teamText = `${teamColorCode}Team ${
                        this.startsWithColorCode(team) ? team : `§r${team}`
                    }`;
                }
                let firstRankColor = "§7";
                for (const rank of ranks) {
                    if (this.startsWithColorCode(rank)) {
                        firstRankColor = `${rank[0]}${rank[1]}`;
                    }
                }
                let colorValue = color
                ? this.parseColor(color.replace("name-color:", ""), true)
                : parseInt(firstRankColor.substring(1), 16);
                this.runCmd(`scoreboard objectives add Misc000002 dummy`);
                this.runCmd(`scoreboard players set "NAME_COLOR:${msg.sender.nameTag}" Misc000002 ${colorValue ? colorValue : 7}`);
                message = `${sessionID ? `` : channel !== "general" ? `§7#${channel} ` : ``}${
                    bracketColor ? bracketColor : `§8`
                }${
                    msg.sender.hasTag("bracket-normal") ? "" : "§l"
                }[§r${ranks.join("§r§7, ")}§r${
                    bracketColor ? bracketColor : `§8`
                }${msg.sender.hasTag("bracket-normal") ? "" : "§l"}]§r${
                    sessionIdText ? ` ${sessionIdText} ` : ``
                }§r${teamText ? ` ${teamText} ` : ``}§r ${
                    color
                        ? this.parseColor(color.replace("name-color:", ""))
                        : `${firstRankColor}`
                }${msg.sender.hasTag("bold-name") ? "§l" : ""}${
                    msg.sender.hasTag("truncate-name")
                        ? newName
                        : msg.sender.nameTag
                } > §r${msg.message}`;
            } else if (chatVersion == -2)
                message = `${
                    color
                        ? this.parseColor(color.replace("name-color:", ""))
                        : "§a"
                }${msg.sender.nameTag}§r§7: §r${messageText}`;
            else if (chatVersion == -10)
                message = `§r§8[§r§7${ranks.join("§r§f, §r§7")}§r§8] §r§9${
                    msg.sender.nameTag
                }§r§8: §r§7${msg.message}`;
            else if (chatVersion == -3) {
                msg.cancel = false;
                return;
            }
            if (chatVersion != -1) {
                tellraw(
                    `@a${
                        sessionID
                            ? `[tag="in_chatv2${sessionID}",tag=detailed_font]`
                            : `[tag=detailed_font,tag="joinedChannel:${channel}"]`
                    }`,
                    `§¥` + message
                );
                tellraw(
                    `@a${
                        sessionID
                            ? `[tag="in_chatv2${sessionID}",tag=!detailed_font]`
                            : `[tag=!detailed_font,tag="joinedChannel:${channel}"]`
                    }`,
                    message
                );
            } else {
                tellraw(
                    `@a${sessionID ? `[tag="in_chatv2${sessionID}"]` : ``}`,
                    message
                );
            }
        } catch (e) {
            tellraw("@a", "§c<DEBUG> Message Error: " + e);
        }
    }
    azalea_on_minute() {
        // const players = world.getPlayers();
        // if(!this.isToggleOn('Tag-Backups')) return;
        // for(const player of players) {
        //     let tags = player.getTags();
        //     if(tags && tags.length)
        //         this.set(player.name, JSON.stringify(tags), 'tagbackups');
        //     else {
        //         let backup = this.get(player.name, 'tagbackups') ? this.get(player.name, 'tagbackups') : [];
        //         for(const tag of backup) {
        //             player.addTag(backup);
        //         }
        //     }
        // }
    }
    invBool(bool) {
        if (bool) return false;
        return true;
    }
    // <-=-=- API Wrapper -=-=->
    toggleOnOffCmd(apiVars, apiFns, name) {
        const { username } = apiVars;
        if (
            !this.hasTag(username, "v") &&
            !this.hasTag(username, "staff") &&
            !this.hasTag(username, "admin")
        )
            return this.tellraw(
                username,
                "§cSorry, you need admin to toggle this."
            );
        let toggle = this.basicOnOffToggle(name);
        toggle.initialize();
        toggle.toggle();
        this.tellraw(username, toggle.getToggleText());
    }
    isToggleOn(name) {
        let toggle = this.basicOnOffToggle(name);
        return toggle.getValue() > 0 ? true : false;
    }
    toggleOff(name) {
        let toggle = this.basicOnOffToggle(name);
        let val = toggle.getValue();
        if (val >= 1) {
            toggle.initialize();
            toggle.toggle();
        }
    }
    toggleOff(name) {
        let toggle = this.basicOnOffToggle(name);
        let val = toggle.getValue();
        if (val <= 0) {
            toggle.initialize();
            toggle.toggle();
        }
    }
    // <-=-=- Toggles -=-=->
    cancelExplosionToggle(apiVars, apiFns) {
        this.toggleOnOffCmd(apiVars, apiFns, "Cancel-Explosions");
    }
    warnOnCancelExplosionToggle(apiVars, apiFns) {
        this.toggleOnOffCmd(apiVars, apiFns, "Warn-On-Cancel-Explosions");
    }
    toggleJobsBeta(apiVars, apiFns) {
        this.toggleOnOffCmd(apiVars, apiFns, "Jobs-Beta");
    }
    goToJob(apiVars, apiFns) {
        if (this.hasTag(apiVars.username, "is_working")) {
            this.runCmd(`tag "${apiVars.username}" remove is_working`);
            this.tellraw(apiVars.username, "§cYou are not working anymore");
        } else {
            this.runCmd(`tag "${apiVars.username}" add is_working`);
            this.tellraw(apiVars.username, "§aYou are now working");
        }
    }
    // <-=-=- Management Commands -=-=->
    commandCooldown(apiVars, apiFns, local) {
        const { username, msg } = apiVars;
        const { tellraw } = apiFns;
        if (!local.isAdmin(username))
            return local.dialog_no_admin("command-cooldown", tellraw, username);

        let args = msg.message.split(" ");
        args.shift();

        if (!args.length)
            return local.tellraw(
                username,
                "§cPlease put a command name and a cooldown"
            );
        if (args.length == 1)
            return local.tellraw(
                username,
                "§cPlease put a command cooldown (in seconds)"
            );

        let command = args[0],
            cooldown = args[1];

        if (!local.stringOnlyContainsNumbers(cooldown))
            return local.tellraw(username, `§c${cooldown} is not a number!`);
        cooldown = parseInt(cooldown);

        if (cooldown > 16)
            return local.tellraw(
                username,
                `§cCommand cooldown cannot be over 16. Your number is ${cooldown}.`
            );

        local.runCmd(`scoreboard objectives add _cmdcooldown dummy`);
        local.runCmd(
            `scoreboard players set "CMD-COOLDOWN:!${command}" _cmdcooldown ${cooldown}`
        );
        local.tellraw(
            username,
            `§aSet command cooldown for !${command} to ${cooldown} seconds!`
        );
    }
    // <-=-=- New API features after April 9, 2022 11:24 PM CST -=-=->
    setWeather(raining = false, lightning = false) {
        if (raining && lightning) this.runCmd(`weather thunder`);
        else if (raining && !lightning) this.runCmd(`weather rain`);
        else this.runCmd(`weather clear`);
    }
    // <-=-=- Very Weird And Obscure Toggles -=-=->
    warpSoundToggle(apiVars, apiFns, local) {
        local.toggleOnOffCmd(apiVars, apiFns, "Warp-Sound");
    }
    // <-=-=- Events -=-=->
    warpTeleportSoundEvent(player, warp) {
        if (!this.isToggleOn("Warp-Sound")) return;
        this.runCmd(
            `execute "${player}" ~~~ playsound portal.travel @s ~~~ 100 1`
        );
    }
    azaleaOnWarpTeleport(player, warp) {
        this.warpTeleportSoundEvent(player, warp);
    }
    beforeExplosion(e) {
        if (
            this.isToggleOn("Warn-On-Cancel-Explosions") &&
            this.isToggleOn("Cancel-Explosions")
        ) {
            this.runCmd(`scoreboard objectives add warns dummy`);
            this.runCmd(
                `execute @e[type=tnt] ~ ~ ~ scoreboard players add @a[r=7] warns 1`
            );
            this.runCmd(
                `execute @e[type=tnt] ~ ~ ~ tellraw @a {"rawtext":[{"text":"§cYou got warned for lighting TNT. Please contact an admin or the owner if you think this is a mistake."}]}`
            );
        }
        if (this.isToggleOn("Cancel-Explosions")) e.cancel = true;
    }
    onPlayerJoin(player) {
        // serverWatcherHandlers[2]();

        let name = player.nameTag,
            locX = player.location.x,
            locY = player.location.y,
            locZ = player.location.z;
        this.convertWarps();
        this.addUnsetDataToWarps();
        this.broadcastT(
            `#(key)Welcome to the Server, #(val)@${name}`,
            0,
            name,
            this.broadcastop
        );
        this.runCmd(`title "${name}" title §dWelcome back, §b@${name}`);
        this.runCmd(`title "${name}" subtitle §aEnjoy your stay!`);
    }
    addUnsetDataToWarps() {
        let warps = this.listObjectives().filter((objective) =>
            objective.startsWith("WARP")
        );
        for (let warp of warps) {
            if (this.getScore(warp, "id")) {
                this.setScore(
                    warp,
                    "id",
                    Math.floor(Math.random() * 2147483647)
                );
            }
        }
    }
    getWarpByID(id) {
        let warps = this.listObjectives().filter((objective) =>
            objective.startsWith("WARP")
        );
        for (let warp of warps) {
            if (this.getScore(warp, "id") && this.getScore(warp, "id") == id)
                return warp.substring(4);
        }
        return;
    }
    setRequiredTagForWarp(warp, tag) {
        if (this.getScore(`WARP${warp}`, "id")) {
            let newConfig = JSON.parse(
                this.get(`warp-config`, `//WARP${warp}`)
                    ? this.get(`warp-config`, `//WARP${warp}`)
                    : "{}"
            );
            newConfig["requiredTagForWarp"] = tag;
            this.set(`warp-config`, JSON.stringify(newConfig), `//WARP${warp}`);
        }
    }
    playerJoined(e) {}
    tick(e) {
        // if (this.isToggleOn('QuickToggle-No-Rain')) this.setWeather();
        // if (this.isToggleOn('QuickToggle-Is-Always-Day')) this.timeSet('0');
        if (this.getScore(`pluginCMD`, `$ReadyForCommand`)) {
            let commands = JSON.parse(
                this.get(`commands`, `plug`)
                    ? this.get(`commands`, `plug`)
                    : "[]"
            );
            this.runCmd(`scoreboard players set $ReadyForCommand pluginCMD 0`);
        }
    }
    entityCreate(e) {
        let entity = e.entity;
        if (entity.id === "minecraft:player") {
            this.playerJoined(e);
        }
    }
    beforePistonActivate(e) {}
    placeBlock(e) {
        serverWatcherHandlers[1](e);
        let player = e.player;
        let worldBlock = e.dimension.getBlock(e.block.location);
        if (player.hasTag("cannotuse") && !player.hasTag("admin"))
            return this.runCmd(
                `setblock ${Math.trunc(worldBlock.location.x)} ${Math.trunc(
                    worldBlock.location.y
                )} ${Math.trunc(worldBlock.location.z)} air`
            );
        // let regionTag = player.getTags().find(tag => tag.startsWith("region:"));
        // let regionOwner = -1;
        // let playerID = this.getScore("PIDs", player.nameTag);
        // if (regionTag) {
        //     regionOwner = this.getScore(
        //         `REGION${regionTag.substring(7)}`,
        //         `owner`
        //     );
        // }
        // if (
        //     this.isInRegion(e.block.location) &&
        //     !this.isAdmin(player.nameTag) &&
        //     regionOwner != playerID
        // ) {
        //     this.runCmd(
        //         `setblock ${Math.trunc(worldBlock.location.x)} ${Math.trunc(
        //             worldBlock.location.y
        //         )} ${Math.trunc(worldBlock.location.z)} air`
        //     );
        // }
    }
    breakBlock(e) {
        serverWatcherHandlers[0](e)
        let worldBlock = e.dimension.getBlock(e.block.location);
        let block12 = e.dimension.getBlock(
            new BlockLocation(
                e.block.location.x,
                e.block.location.y - 1,
                e.block.location.z
            )
        );
        // i didnt remove the old if statement because im lazy
        if (true) {
            if (block12.id == "azalea:skyblock_gen_marker") {
                // let blocks = new SkyblockGenList().getData();
                // let num = Math.floor(Math.random() * blocks.length);
                // let num2 = Math.floor(Math.random() * 525);
                // let num3 = Math.floor(Math.random() * 1080);
                // let block;
                let x = Math.trunc(e.block.location.x),
                    y = Math.trunc(e.block.location.y),
                    z = Math.trunc(e.block.location.z);
                // if (
                //     num2 == 100 ||
                //     num2 == 108 ||
                //     num2 == 224 ||
                //     num2 == 121 ||
                //     num2 == 100 ||
                //     num2 == 510 ||
                //     num2 == 96
                // ) {
                //     block = `diamond_ore`;
                // } else if (
                //     num3 == 7 ||
                //     num3 == 10 ||
                //     num3 == 156 ||
                //     num3 == 184 ||
                //     num3 == 194 ||
                //     num3 == 121 ||
                //     num3 == 157 ||
                //     num3 == 159 ||
                //     num3 == 500 ||
                //     num3 == 521 ||
                //     num3 == 512 ||
                //     num3 == 256 ||
                //     num3 == 128 ||
                //     num3 == 64 ||
                //     num3 == 32 ||
                //     num3 == 16 ||
                //     num3 == 8 ||
                //     num3 == 4 ||
                //     num3 == 2 ||
                //     num3 == 1
                // ) {
                //     block = `ancient_debris`;
                // } else {
                //     block = blocks[num];
                // }
                let block = this.skyblock.getRandomBlock(e.player);
                console.warn(block);
                this.skyblock.calculateGeneratorLevels(e.player);
                let ticks = 0;
                let runCmd = this.runCmd;
                let delay = world.events.tick.subscribe(() => {
                    ticks++;
                    if (ticks % 10 == 0) {
                        world.events.tick.unsubscribe(delay);
                        runCmd(`setblock ${x} ${y} ${z} ${block}`);
                    }
                });
                return;
            }
        }
        // let player = e.player;
        // let regionTag = player.getTags().find(tag => tag.startsWith("region:"));
        // let regionOwner = -1;
        // let playerID = this.getScore("PIDs", player.nameTag);
        // if (regionTag) {
        //     regionOwner = this.getScore(
        //         `REGION${regionTag.substring(7)}`,
        //         `owner`
        //     );
        // }
        // if (
        //     this.isInRegion(e.block.location) &&
        //     !this.isAdmin(player.nameTag) &&
        //     regionOwner != playerID
        // ) {
        //     worldBlock.setPermutation(e.brokenBlockPermutation.clone());
        // }
        this.runCmd(`scoreboard objectives add jobXp dummy`);
        this.runCmd(`scoreboard objectives add jobLevel dummy`);
        this.runCmd(`scoreboard objectives add money dummy`);
        let block = e.brokenBlockPermutation;
        let blockID = block.type.id.startsWith("minecraft:", "")
            ? block.type.id.replace("minecraft:", "")
            : block.id;
        let mining_blocks = [
            "iron_ore",
            "stone",
            "diamond_ore",
            "gold_ore",
            "coal_ore",
            "emerald_ore",
            "mob_spawner",
            "obsidian",
        ];
        let xp_amounts = [10, 1, 5, 5, 20, 15, 7, 26, 35, 16];
        if (!this.isToggleOn("Jobs-Beta")) return;
        if (!this.hasTag(player.nameTag, "is_working")) return;
        if (mining_blocks.indexOf(blockID) > -1) {
            let xpAmount = 0;
            xpAmount = xp_amounts[mining_blocks.indexOf(blockID)];
            this.runCmd(
                `scoreboard players add "${player.nameTag}" jobXp ${xpAmount}`
            );
            let jobLevel = this.getScore(`jobLevel`, player.nameTag)
                ? this.getScore(`jobLevel`, player.nameTag)
                : 1;
            let jobXp = this.getScore(`jobXp`, player.nameTag);
            let jobXpMax = 100 + Math.floor(jobLevel * 23.67);
            if (jobXp > jobXpMax) {
                let levelUp = Math.trunc(jobXp / jobXpMax);
                this.runCmd(
                    `scoreboard players add "${player.nameTag}" jobLevel ${levelUp}`
                );
                this.runCmd(
                    `scoreboard players set "${player.nameTag}" jobXp 0`
                );
                this.runCmd(
                    `scoreboard players add "${player.nameTag}" money ${
                        100 * Math.trunc((jobLevel + 1) / 2)
                    }`
                );
                this.runCmd(
                    `execute "${player.nameTag}" ~ ~ ~ kill @e[type=item,r=10]`
                );
                this.tellraw(
                    player.nameTag,
                    `You are now at level ${
                        jobLevel == 1 ? 1 : jobLevel + 1
                    }. You earned ${100 * Math.trunc((jobLevel + 1) / 2)}$`
                );
            }
        }
    }
    // <-=-=- New Commands -=-=->
    registerCommand(reg, callback) {
        reg.callback = callback;
        this._cmds.push(reg);
    }
    readyForCommandRegistration() {
        this.registerCommand(
            {
                name: "prefix",
                description: "Set the command prefix",
                category: "Server Management and Utilities",
            },
            this.prefix
        );
        this.registerCommand(
            {
                name: "lore",
                description: "Set the lore text on items",
                category: "Misc",
            },
            this.loreTextManagerCMD
        );
        this.registerCommand(
            {
                name: "command-cooldown",
                description: "Set the cooldown for any command",
                category: "Server Management and Utilities",
            },
            this.commandCooldown
        );
        this.registerCommand(
            {
                name: "warp-portal-sound-toggle",
                description:
                    "Toggle a portal sound that happens when a player goes to a warp.",
                category: "Toggles",
            },
            this.warpSoundToggle
        );
        this.registerCommand(
            {
                name: "teams",
                description: "Set the command prefix",
                category: "Server Management and Utilities",
            },
            this.teamMgr
        );
        this.registerCommand(
            {
                name: "floating-text",
                description: "Create floating text",
                category: "Server Management and Utilities",
            },
            this.textCmd
        );
    }
    readyForCommandRegistrationEvents() {
        let thisClass = this;
        events.on("onInvalidCommand", (name, apiVars, apiFns) => {
            let cmd = this._cmds.find(
                (command) =>
                    command.name == name || command.aliases?.includes(name)
            );
            if (cmd) {
                let callback = cmd.callback ? cmd.callback : null;
                let _isClass = cmd.v2 ? true : false;
                if (callback) {
                    if (_isClass) {
                        let classResults = new callback();
                        classResults.call(apiVars, apiFns, {
                            subcommand: apiVars.args.length
                                ? apiVars.args[0]
                                : null,
                            subargs: apiVars.args.length
                                ? apiVars.args.slice(1)
                                : null,
                        });
                        return true;
                    } else {
                        callback(apiVars, apiFns, thisClass);
                        return true;
                    }
                }
                return false;
            } else {
                return false;
            }
        });
    }
    // <-=-=- Events -=-=->
    ready() {
        events.emit("ready");
        this.readyForCommandRegistration();
        this.readyForCommandRegistrationEvents();
    }
    // <-=-=- Customization -=-=->
    getPrefix(defaultPrefix = "\\") {
        return this.get(`prefix`, `config`)
            ? this.get(`prefix`, `config`)
            : defaultPrefix;
    }
    setPrefix(prefix = "\\") {
        this.set(`prefix`, prefix, `config`);
        return prefix;
    }
    // <-=-=- TRASHLIB -=-=->
    randTo(num = 9) {
        return Math.floor(Math.random() * num + 1);
    }
    randRange(min = 5, max = 10) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    randDigits(count = 5) {
        let str = "";
        for (let i = 0; i < count; i++) {
            str += this.randTo();
        }
        return parseInt(str);
    }
    // <-=-=- Commands Everywhere API -=-=->
    commandsEverywhereCreateChat(maxDigits = 5, player) {
        let digits = this.randDigits(maxDigits);
        this.chatMap.set(player, digits);
        return {
            error: false,
            id: digits,
        };
    }
    viewLogsInvisible() {
        let activityLogs = JSON.parse(
            this.get(`activitylogs`, `logs`)
                ? this.get(`activitylogs`, `logs`)
                : `[]`
        );
        // log.player-leave
        // log.player-join
        let date, month, day, year, hours, minutes, seconds, playerName;
        let logText = ["§b<-=-=- LOGS -=-=->"];
        if (activityLogs.length) {
            for (let i = 0; i < activityLogs.length; i++) {
                switch (activityLogs[i].type) {
                    case "log.player-join":
                        date = new Date(activityLogs[i].date);
                        month = date.getMonth() + 1;
                        day = date.getDate();
                        year = date.getUTCFullYear();
                        hours = date.getHours();
                        minutes = date.getMinutes();
                        seconds = date.getSeconds();
                        playerName = activityLogs[i].playerName
                            ? activityLogs[i].playerName
                            : activityLogs[i].name;
                        logText.push(
                            `§r§f${playerName} joined at ${month}/${day}/${year} ${hours}:${minutes}:${seconds} UTC`
                        );
                        break;
                    case "log.player-leave":
                        date = new Date(activityLogs[i].date);
                        month = date.getMonth() + 1;
                        day = date.getDate();
                        year = date.getUTCFullYear();
                        hours = date.getHours();
                        minutes = date.getMinutes();
                        seconds = date.getSeconds();
                        playerName = activityLogs[i].playerName
                            ? activityLogs[i].playerName
                            : activityLogs[i].name;
                        logText.push(
                            `§r§f${playerName} left at ${month}/${day}/${year} ${hours}:${minutes}:${seconds} UTC`
                        );
                        break;
                    case "log.warned":
                        let warnedPerson = activityLogs[i].warnedPerson;
                        let warner = activityLogs[i].warner;
                        date = new Date(activityLogs[i].date);
                        month = date.getMonth() + 1;
                        day = date.getDate();
                        year = date.getUTCFullYear();
                        hours = date.getHours();
                        minutes = date.getMinutes();
                        seconds = date.getSeconds();
                        logText.push(
                            `§r§f§o${warnedPerson}§r was warned by §o${warner}§r (${month}/${day}/${year} ${hours}:${minutes}:${seconds} UTC)`
                        );
                        break;
                    case "log.server-settings-updated":
                        let settingsUpdater = activityLogs[i].playerName;
                        date = new Date(activityLogs[i].date);
                        month = date.getMonth() + 1;
                        day = date.getDate();
                        year = date.getUTCFullYear();
                        hours = date.getHours();
                        minutes = date.getMinutes();
                        seconds = date.getSeconds();
                        logText.push(
                            `§r§f§o${settingsUpdater} §r§fupdated the server settings at ${month}/${day}/${year} ${hours}:${minutes}:${seconds} UTC`
                        );
                }
            }
        } else {
            logText.push("§cNo logs are available right now.");
        }
        return logText;
    }

    commandsEverywhereJoinChat(id, player) {
        if (!this.stringOnlyContainsNumbers(id))
            return { error: true, error_id: "ERROR_ID_IS_NAN" };
        if (typeof id === "string") id = parseInt(id);
        this.chatMap.set(player, id);
        return {
            error: false,
        };
    }
    listWarpsInvisible() {
        let results = this.runCmd(`scoreboard objectives list`);
        let objectives = results.statusMessage.match(
            /\- ([\s\S]*?)\: ([\s\S]*?)/g
        );
        if (objectives && objectives.length) {
            objectives = objectives
                .map((objective) => {
                    return objective.replace("- ", "").slice(0, -2);
                })
                .filter((objective) => objective.startsWith("warp_"))
                .map((objective) => objective.replace("warp_", ""));
        } else {
            return [];
        }
        if (!objectives.length) return [];
        return objectives;
    }
    listWarpsInvisible2() {
        let results = this.runCmd(`scoreboard objectives list`);
        let objectives = results.statusMessage.match(
            /\- ([\s\S]*?)\: ([\s\S]*?)/g
        );
        if (objectives && objectives.length) {
            objectives = objectives
                .map((objective) => {
                    return objective.replace("- ", "").slice(0, -2);
                })
                .filter((objective) => objective.startsWith("WARP"))
                .map((objective) => objective.replace("WARP", ""));
        } else {
            return [];
        }
        if (!objectives.length) return [];
        return objectives;
    }
    teleportPlayerToWarp(warp, player, cl) {
        if (typeof player === "string") player = this.fetchPlayer(player);
        let local = cl ? cl : this;
        if (!local.hasWarpPermission(player, warp))
            return local.tellraw(
                player.nameTag,
                `§cYou cannot teleport to this warp right now.`
            );
        let warpX = local.getScoreQ(`WARP${warp}`, `x`),
            warpY = local.getScoreQ(`WARP${warp}`, `y`),
            warpZ = local.getScoreQ(`WARP${warp}`, `z`),
            warpDim = local.getScoreQ(`WARP${warp}`, `dimension`),
            warpXFloat = local.getScoreQ(`WARP${warp}`, `xFloat`)
                ? local.getScoreQ(`WARP${warp}`, `xFloat`)
                : 5,
            warpYFloat = local.getScoreQ(`WARP${warp}`, `yFloat`)
                ? local.getScoreQ(`WARP${warp}`, `yFloat`)
                : 5,
            warpZFloat = local.getScoreQ(`WARP${warp}`, `zFloat`)
                ? local.getScoreQ(`WARP${warp}`, `zFloat`)
                : 5;
        // warpX = parseFloat(`${warpX.toString()}.${warpXFloat.toString()}`);
        // warpY = parseFloat(`${warpY.toString()}.${warpYFloat.toString()}`);
        // warpZ = parseFloat(`${warpZ.toString()}.${warpZFloat.toString()}`);
        if (warpX >= 0) warpX += 0.5;
        if (warpX < 0) warpX -= 0.5;
        if (warpZ >= 0) warpZ += 0.5;
        if (warpZ < 0) warpZ -= 0.5;
        warpY += 0.01;
        if (typeof player === "string") player = this.fetchPlayer(player);
        if (warpX && warpY && warpZ) {
            let overworld = world.getDimension("overworld");
            let nether = world.getDimension("nether");
            let theEnd = world.getDimension("the end");
            let dimensions = [overworld, nether, theEnd];
            warpDim = warpDim ? warpDim : 0;
            if (warpDim > 2) warpDim = 2;
            if (warpDim < 0) warpDim = 0;
            let dimension = dimensions[warpDim];
            let loc = new Location(warpX, warpY, warpZ);
            player.teleport(
                loc,
                dimension,
                player.rotation.x,
                player.rotation.y
            );
            local.azaleaOnWarpTeleport(player.nameTag, warp);
            return {
                error: false,
                warp: warp,
            };
        }
        return {
            error: true,
            error_id: "404_NOT_FOUND",
        };
    }
    // <-=-=- Conversions -=-=->
    convertWarps() {
        let warps = this.listWarpsInvisible();
        for (let i = 0; i < warps.length; i++) {
            let x = this.getScoreQ(`warp_${warps[i]}`, `x`),
                y = this.getScoreQ(`warp_${warps[i]}`, `y`),
                z = this.getScoreQ(`warp_${warps[i]}`, `z`),
                dim = 0;
            this.runCmd(`scoreboard objectives add "WARP${warps[i]}" dummy`);
            this.runCmd(`scoreboard players set x "WARP${warps[i]}" ${x}`);
            this.runCmd(`scoreboard players set y "WARP${warps[i]}" ${y}`);
            this.runCmd(`scoreboard players set z "WARP${warps[i]}" ${z}`);
            this.runCmd(
                `scoreboard players set dimension "WARP${warps[i]}" ${dim}`
            );
            this.runCmd(`scoreboard objectives remove "warp_${warps[i]}"`);
        }
    }
    // <-=-=- Command Shortcuts -=-=->
    setScore(objective, player, number) {
        this.runCmd(
            `scoreboard players set ${
                player.startsWith("@") ? player : `"${player}"`
            } "${objective}" ${number}`
        );
    }
    createObjective(objectiveName, type = 0) {
        this.runCmd(`scoreboard objectives add "${objectiveName}" dummy`);
        this.runCmd(
            `scoreboard players set $AzaleaScoreboardType "${objectiveName}" ${type}`
        );
    }
    listObjectives() {
        let results = this.runCmd(`scoreboard objectives list`);
        let objectives = results.statusMessage.match(
            /\- ([\s\S]*?)\: ([\s\S]*?)/g
        );
        if (objectives && objectives.length) {
            objectives = objectives.map((objective) => {
                return objective.replace("- ", "").slice(0, -2);
            });
        } else {
            return [];
        }
        if (!objectives.length) return [];
        return objectives;
    }
    runFunction(...args) {
        this.runCmd(`function ${args.join(" ")}`);
    }
    // <-=-=- Player API -=-=->
    fetchPlayer(name) {
        let players = world.getPlayers();
        for (const player of players) {
            if (player.nameTag.toLowerCase() == name.toLowerCase())
                return player;
        }
        return;
    }
    getLocation(player) {
        let playerObj = this.fetchPlayer(player);
        if (!playerObj) return;
        return playerObj.location;
    }
    getTeam(player) {
        let playerObj = this.fetchPlayer(player);
        if (!playerObj) return;
        let tags = playerObj.getTags();
        for (let i = 0; i < tags.length; i++) {
            if (tags[i].startsWith("team:")) {
                let team = JSON.parse(
                    this.get(`teams`, `teams`)
                        ? this.get(`teams`, `teams`)
                        : `[]`
                ).find((teamName) => `team:${teamName}` == tags[i]);
                if (team) return tags[i].substring(5).replace(/\&/g, "§");
            }
        }
        return;
    }
    removeTag(player, tag) {
        let playerObj = this.fetchPlayer(player);
        if (!playerObj) return;
        playerObj.removeTag(tag);
    }
    addTag(player, tag) {
        let playerObj = this.fetchPlayer(player);
        if (!playerObj) return;
        playerObj.addTag(tag);
    }
    getTagsV2(player) {
        let playerObj = this.fetchPlayer(player);
        if (!playerObj) return [];
        return playerObj.getTags();
    }
    // <-=-=- Team Command -=-=->
    teamMgr(apiVars, apiFns, local) {
        const { username } = apiVars;
        let args = apiVars.msg.message.split(" ");
        args.shift();
        if (
            args.length &&
            args[0] != "join" &&
            !local.isAdmin(apiVars.username)
        )
            return local.dialog_no_admin(
                "teams",
                apiFns.tellraw,
                apiVars.username
            );
        let teams = JSON.parse(
            local.get(`teams`, `teams`) ? local.get(`teams`, `teams`) : `[]`
        );
        if (args.length && args[0] == "create") {
            args.shift();
            teams.push(args.join(" "));
            local.set("teams", JSON.stringify(teams), "teams");
            local.tellraw(
                username,
                "§aCreated team: §r§f" + args.join(" ").replace(/\&/g, "§")
            );
            return;
        }
        if (args.length && args[0] == "remove") {
            if (!local.stringOnlyContainsNumbers(args[1]))
                return local.tellraw(username, `§c${args[1]} is not a number!`);
            teams.splice(parseInt(args[1]), 1);
            local.set("teams", JSON.stringify(teams), "teams");
            local.tellraw(apiVars.username, "§6Removed team!");
            return;
        }
        if (args.length && args[0] == "join") {
            if (!local.stringOnlyContainsNumbers(args[1]))
                return local.tellraw(username, `§c${args[1]} is not a number!`);
            let tags = local.getTagsV2(apiVars.username);
            for (let i = 0; i < tags.length; i++) {
                if (tags[i].startsWith("team:")) {
                    local.removeTag(apiVars.username, tags[i]);
                }
            }
            local.addTag(apiVars.username, `team:${teams[parseInt(args[1])]}`);
            local.tellraw(
                username,
                "§6Joined team: " + teams[parseInt(args[1])].replace(/\&/g, "§")
            );
            return;
        }
        if (args.length && args[0] == "leave") {
            let tags = local.getTagsV2(apiVars.username);
            let team = local.getTeam(username)
                ? local.getTeam(username)
                : `§k§c|/ §r§cNone §r§c§k^#`;
            for (let i = 0; i < tags.length; i++) {
                if (tags[i].startsWith("team:")) {
                    local.removeTag(apiVars.username, tags[i]);
                }
            }
            local.tellraw(username, "§aLeft Team: " + team);
            return;
        }
        if (teams.length) {
            local.tellraw(
                username,
                `§aUse §a§o§l!team join <ID> §r§aor §a§o§l!team remove <ID>`
            );
            for (let i = 0; i < teams.length; i++) {
                local.tellraw(
                    username,
                    `§r§f${teams[i].replace(/\&/g, "§")} §aID: ${i}`
                );
            }
            local.tellraw(
                username,
                `§6Your team is §r§f${
                    local.getTeam(username)
                        ? local.getTeam(username)
                        : `§6nothing because you're no in a team`
                }`
            );
        } else {
            local.tellraw(
                username,
                "§cThere are no available teams right now!"
            );
        }
    }
    getPlayerList() {
        let list = [];
        for(const player of world.getPlayers()) {
            list.push(player.nameTag);
        }
        return list;
    }
    report(apiVars, apiFns) {
        try {
            let loc = [apiVars.player.location.x, apiVars.player.location.y, apiVars.player.location.z];
            let ticksPassed = 0;
            var players = this.getPlayerList();
            this.tellraw(apiVars.username,`§aMove to open the UI!`)
            let tickEvent1 = world.events.tick.subscribe(()=>{
                ticksPassed++;
                if(apiVars.player.location.x != loc[0] || apiVars.player.location.y != loc[1] || apiVars.player.location.z != loc[2]) {
                    world.events.tick.unsubscribe(tickEvent1);
                    let form = new ModalForm();
                    form.setTitle('Report Player');
                    form.dropdown("Player", players, 0);
                    let reasons = ["Toxicity", "Hacking", "Spamming"];
                    form.dropdown("Reason", reasons, 0);
                    form.show(apiVars.player, res=>{
                        try {
                            if(res.isCanceled) return;
                            let player = players[res.formValues[0]];
                            let reason = reasons[res.formValues[1]];
                            const {get, set} = apiFns;
                            // this.get
                            let reportedPlayers = JSON.parse(this.get("reportedPlayers") ? this.get("reportedPlayers") : "[]");
                            reportedPlayers.push({
                                sender: apiVars.username,
                                reportedUser: player,
                                reason
                            })
                            this.set("reportedPlayers", JSON.stringify(reportedPlayers));
    
                        } catch(e) {
                            console.error(e);
                        }
                    })
                    return;
                }
                if(ticksPassed > 1000) {
                    world.events.tick.unsubscribe(tickEvent1);
                    return;
                }
            })
                
        } catch(e) {
            this.tellraw(apiVars.username, `§cAn error ocurred.\n${e}`);
        }
    }
    modmail(apiVars, apiFns, local) {
        // let player = apiVars.msg.sender;
        // let inven = player.getComponent("inventory");
        // let item = inven.getItem(player.selectedSlot);
        // item.setLore(['§r§6Hello, world!']);
        // inven.setItem(player.selectedSlot, item);
        let args = apiVars.msg.message.split(" ");
        args.shift();
        let modmail = JSON.parse(
            this.get(`modmail`, `mail`) ? this.get(`modmail`, `mail`) : `[]`
        );
        if (args && args.length && args[0] == "send") {
            args.shift();
            let yourModmail = modmail.find(
                (message) => message.creator == apiVars.msg.sender.nameTag
            );
            if (yourModmail) {
                let modmailIndex = modmail.indexOf(yourModmail);
                if (yourModmail.messages.length > 45) {
                    yourModmail.messages.shift();
                }
                yourModmail.messages.push({
                    creator: apiVars.msg.sender.nameTag,
                    msg: args.join(" "),
                    sent: Date.now()
                });
                modmail[modmailIndex] = yourModmail;
                this.set(`modmail`, JSON.stringify(modmail), `mail`);
            } else {
                let data = {
                    creator: apiVars.msg.sender.nameTag,
                    messages: [
                        {
                            creator: apiVars.msg.sender.nameTag,
                            msg: args.join(" "),
                            sent: Date.now()
                        },
                    ],
                };
                modmail.push(data);
            }
            this.set(`modmail`, JSON.stringify(modmail), `mail`);
            return;
        }
        if (modmail.length) {
            let yourmail = modmail.find(
                (message) => message.creator == apiVars.msg.sender.nameTag
            );
            if (yourmail) {
                for (let i = 0; i < yourmail.messages.length; i++) {
                    this.tellraw(
                        apiVars.msg.sender.nameTag,
                        `§6${
                            yourmail.messages[i].creator ==
                            apiVars.msg.sender.nameTag
                                ? `§a${yourmail.messages[i].creator}`
                                : `§c${yourmail.messages[i].creator}`
                        } §r§f${yourmail.messages[i].msg}`
                    );
                }
            } else {
                this.tellraw(apiVars.username, `§cYou have no mail!`);
            }
        } else {
            this.tellraw(apiVars.username, `§cYou have no mail!`);
        }
        return;
    }
    dimension(apiVars, apiFns) {
        let player = apiVars.msg.sender;
        let args = apiVars.msg.message.split(" ");
        if (!this.isAdmin(player.nameTag))
            return this.dialog_no_admin("dim", apiFns.tellraw, player.nameTag);
        args.shift();
        let dimension, x, y, z;
        if (args.length) {
            switch (args[0]) {
                case "overworld":
                    dimension = world.getDimension("overworld");
                    break;
                case "nether":
                    dimension = world.getDimension("nether");
                    break;
                case "end":
                    dimension = world.getDimension("the end");
                    break;
                default:
                    dimension = world.getDimension("overworld");
            }
        }
        if (args.length == 4) {
            if (this.stringOnlyContainsNumbers(args[1])) x = parseInt(args[1]);
            else x = 0;

            if (this.stringOnlyContainsNumbers(args[2])) y = parseInt(args[2]);
            else y = 0;

            if (this.stringOnlyContainsNumbers(args[3])) z = parseInt(args[3]);
            else z = 0;
        } else {
            x = player.location.x;
            y = player.location.y;
            z = player.location.z;
        }
        player.teleport(new Location(x, y, z), dimension, 0, 0);
    }
    lore(apiVars, apiFns) {
        let player = apiVars.msg.sender,
            args = apiVars.msg.message.split(" ");
        if (!this.isAdmin(player.nameTag))
            return this.dialog_no_admin("lore", apiFns.tellraw, player.nameTag);
        args.shift();
        let inventory = player.getComponent("inventory");
        let holding = inventory.container.getItem(player.selectedSlot);
        let currentLore =
            holding.getLore() && holding.getLore().length
                ? [...holding.getLore()]
                : [];
        if (args.length) {
            if (args[0] == "add") {
                args.shift();
                if (currentLore.length >= 1 && currentLore[0])
                    currentLore.push(args.join(" ").replace(/\\n/g, "\n"));
                else currentLore[0] = args.join(" ").replace(/\\n/g, "\n");
            }
            if (args[0] == "remove") {
                if (!this.stringOnlyContainsNumbers(args[1]))
                    return this.tellraw(
                        player.nameTag,
                        `§c${args[1]} is not a number!`
                    );
                if (currentLore.length > 1)
                    currentLore.splice(parseInt(args[1]), 1);
                else currentLore = [""];
            }
            holding.setLore(currentLore);
            inventory.container.setItem(player.selectedSlot, holding);
            return;
        } else {
            if (currentLore.length) {
                for (let i = 0; i < currentLore.length; i++) {
                    this.tellraw(
                        player.nameTag,
                        `§r§f(ID: ${i}) ${currentLore[i]}`
                    );
                }
            } else {
                this.tellraw(
                    player.nameTag,
                    `§cThere is no lore on this item!`
                );
            }
        }
    }
    rateServerMenu(apiVars, apiFns) {
        // let res = this.runCmd(`gamemode s @a[name="${apiVars.username}",m=c]`)
        // this.runCmd(`damage "${apiVars.username}" 1`);
        // if(!res.error) this.runCmd(`gamemode c "${apiVars.username}"`);
        this.tellraw(
            apiVars.username,
            `§aPlease move around to open the menu!`
        );
        let ticks = 0;
        let playerLocation = [apiVars.player.location.x,apiVars.player.location.y,apiVars.player.location.z];
        let delay = world.events.tick.subscribe((e) => {
            if (apiVars.player.location.x != playerLocation[0] || apiVars.player.location.y != playerLocation[1] || apiVars.player.location.z != playerLocation[2]) {
                world.events.tick.unsubscribe(delay);
                this.runCmd(
                    `tag "${apiVars.username}" add AzaleaAPI:RateServerMenu`
                );
            }
        });
    }
    textCmd(apiVars, apiFns) {
        let player = apiVars.msg.sender;
        let args = apiVars.msg.message.split(" ");
        args.shift();
        let text = args.join(" ").replace(/\\n/g, "\n");
        let textEntity = player.dimension.spawnEntity(
            "minecraft:rabbit",
            player.location
        );
        textEntity.nameTag = text;
    }
    leaderboardAdder(apiVars, apiFns) {
        if (!this.isAdmin(apiVars.username))
            return this.dialog_no_admin(
                "leaderboard-add",
                apiFns.tellraw,
                apiVars.username
            );
        // if (this.canWriteLeaderboards) {
        let leaderboards = JSON.parse(
            this.get("leaderboards", "lb")
                ? this.get("leaderboards", "lb")
                : "[]"
        );
        //     for(const lb of leaderboards) {
        //         writeLeaderboard([lb.x,lb.y,lb.z], lb.objective, lb.name);
        //     }
        // }
        this.tellraw(
            apiVars.username,
            `§aPlease move around to open the menu!`
        );
        let ticks = 0;
        let delay = world.events.tick.subscribe((e) => {
            if (apiVars.player.hasTag("is_moving")) {
                world.events.tick.unsubscribe(delay);
                let form = new ModalForm();
                form.textField("Leaderboard Name", "Please type a name here!");
                form.textField("Objective", "Use a scoreboard objective here!");
                form.setTitle("Add Leaderboard");
                form.show(apiVars.player, (result) => {
                    if (
                        result &&
                        result.formValues &&
                        result.formValues.length &&
                        result.formValues[0] &&
                        result.formValues[1]
                    ) {
                        try {
                            leaderboards.push({
                                x: Math.trunc(apiVars.player.location.x),
                                y: Math.trunc(apiVars.player.location.y),
                                z: Math.trunc(apiVars.player.location.z),
                                name: result.formValues[0],
                                objective: result.formValues[1],
                            });
                            apiVars.plugins[0].set(
                                "leaderboards",
                                JSON.stringify(leaderboards),
                                "lb"
                            );
                        } catch (e) {
                            // // console.warn(e);
                        }
                    }
                });
            }
        });
    }
    leaderboardRemove(apiVars, apiFns) {
        if (!this.isAdmin(apiVars.username))
            return this.dialog_no_admin(
                "leaderboard-del",
                apiFns.tellraw,
                apiVars.username
            );
        // if (this.canWriteLeaderboards) {
        let leaderboards = JSON.parse(
            this.get("leaderboards", "lb")
                ? this.get("leaderboards", "lb")
                : "[]"
        );

        this.tellraw(
            apiVars.username,
            `§aPlease move around to open the menu!`
        );
        let ticks = 0;
        let delay = world.events.tick.subscribe((e) => {
            if (apiVars.player.hasTag("is_moving")) {
                world.events.tick.unsubscribe(delay);
                let form = new ModalForm();
                let names = ["Exit"];
                for (const lb of leaderboards) {
                    names.push(lb.name);
                }
                form.dropdown("Leaderboard to Remove", names);
                form.setTitle("Delete Leaderboard");
                form.show(apiVars.player, (results) => {
                    if (
                        results &&
                        results.formValues &&
                        results.formValues[0]
                    ) {
                        let value = results.formValues[0] - 1;
                        leaderboards.splice(value, 1);
                        apiVars.plugins[0].set(
                            "leaderboards",
                            JSON.stringify(leaderboards),
                            "lb"
                        );
                        let query = new EntityQueryOptions();
                        query.tags = [`LeaderboardName:${names[value + 1]}`];
                        query.type = "minecraft:rabbit";
                        let leaderboardEntities = world
                            .getDimension("overworld")
                            .getEntities(query);
                        if (leaderboardEntities) {
                            try {
                                leaderboardEntities =
                                    Array.from(leaderboardEntities);
                                if (leaderboardEntities.length) {
                                    leaderboardEntities[0].kill();
                                }
                            } catch (e) {}
                        }
                    }
                });
            }
        });
    }
    regionBuilder(apiVars, apiFns) {
        if (!this.isAdmin(apiVars.username))
            return this.dialog_no_admin(
                "region-add",
                apiFns.tellraw,
                apiVars.username
            );
        let args = apiVars.msg.message.split(" ");
        args.shift();
        let name = args[0];
        let x1 = parseInt(args[1]);
        let y1 = parseInt(args[2]);
        let z1 = parseInt(args[3]);
        let x2 = parseInt(args[4]);
        let y2 = parseInt(args[5]);
        let z2 = parseInt(args[6]);
        this.createRegion(name, x1, y1, z1, x2, y2, z2, apiVars.username);
    }
    // Commands Everywhere API (Again)
    createRegion(name, x1, y1, z1, x2, y2, z2) {
        this.runCmd(`scoreboard objectives add REGION${name} dummy`);
        this.runCmd(`scoreboard players set x1 REGION${name} ${x1}`);
        this.runCmd(`scoreboard players set y1 REGION${name} ${y1}`);
        this.runCmd(`scoreboard players set z1 REGION${name} ${z1}`);
        this.runCmd(`scoreboard players set x2 REGION${name} ${x2}`);
        this.runCmd(`scoreboard players set y2 REGION${name} ${y2}`);
        this.runCmd(`scoreboard players set z2 REGION${name} ${z2}`);
        this.runCmd(
            `scoreboard players set owner REGION${name} ${
                this.getScoreQ("PIDs", owner)
                    ? this.getScoreQ("PIDs", owner)
                    : -1
            }`
        );
    }
    listRegions() {
        let regions = this.listObjectives().filter((r) =>
            r.startsWith("REGION")
        );
        return regions;
    }
    checkRegions() {
        let regions = this.listRegions();
        let players = world.getPlayers();
        for (const player of players) {
            for (const tag of player.getTags()) {
                if (tag.startsWith("region:")) player.removeTag(tag);
            }
            for (const region of regions) {
                let x1 = this.getScore(region, "x1");
                let y1 = this.getScore(region, "y1");
                let z1 = this.getScore(region, "z1");
                let x2 = this.getScore(region, "x2");
                let y2 = this.getScore(region, "y2");
                let z2 = this.getScore(region, "z2");
                // // // console.warn([x1, y1, z1, x2, y2, z2].join(', '))
                if (
                    betweenXYZ(
                        [x2, y2, z2],
                        [x1, y1, z1],
                        [
                            Math.trunc(player.location.x),
                            Math.trunc(player.location.y),
                            Math.trunc(player.location.z),
                        ]
                    )
                ) {
                    // // // console.warn('hi')
                    player.addTag(`region:${region.substring(6)}`);
                }
            }
        }
    }
    isInRegion(location) {
        let regions = this.listRegions();
        for (const region of regions) {
            let x1 = this.getScore(region, "x1");
            let y1 = this.getScore(region, "y1");
            let z1 = this.getScore(region, "z1");
            let x2 = this.getScore(region, "x2");
            let y2 = this.getScore(region, "y2");
            let z2 = this.getScore(region, "z2");
            // // // console.warn([x1, y1, z1, x2, y2, z2].join(', '))
            if (
                betweenXYZ(
                    [x2, y2, z2],
                    [x1, y1, z1],
                    [location.x, location.y, location.z]
                )
            ) {
                // // // console.warn('hi')
                return true;
            }
        }
        return false;
    }
    createGuild(name, player) {
        if (typeof player === "string") player = this.fetchPlayer(player);
        let guilds = JSON.parse(
            this.get(`GuildList`, `Guilds`)
                ? this.get(`GuildList`, `Guilds`)
                : "[]"
        );
        let code = `${Math.floor(Math.random() * 9 + 1)}${Math.floor(
            Math.random() * 9 + 1
        )}${Math.floor(Math.random() * 9 + 1)}${Math.floor(
            Math.random() * 9 + 1
        )}${Math.floor(Math.random() * 9 + 1)}`;
        if (
            !player.hasTag("permissions.guilds.create") &&
            !this.isAdmin(player.nameTag)
        )
            return;
        if (guilds.find((guild) => guild.owner == player.nameTag)) return;
        let guildData = {
            created: new Date().getTime(),
            owner: player.nameTag,
            code: code,
            name,
            channels: ["general"],
        };
        guilds.push(guildData);
        this.set(`GuildList`, JSON.stringify(guilds), `Guilds`);
        return guildData;
    }
    getGuild(code) {
        // // console.warn(code)
        let guilds = JSON.parse(
            this.get(`GuildList`, `Guilds`)
                ? this.get(`GuildList`, `Guilds`)
                : "[]"
        );
        if (guilds && guilds.length) {
            // // console.warn(JSON.stringify(guilds, null, 2))
            let guild = guilds.find((guildData) => guildData.code == code);
            // // console.warn(guild)
            if (guild) return guild;
        }
        // // console.warn('Hi')
        return;
    }
    addGuild(player, code) {
        if (typeof player === "string") player = this.fetchPlayer(player);
        let guild = this.getGuild(code);
        if (guild) {
            player.addTag(`GuildList:${code}`);
        }
    }
    enterGuild(player, code) {
        if (typeof player === "string") player = this.fetchPlayer(player);
        let guild = this.getGuild(code);
        if (guild) {
            for (const tag of player.getTags()) {
                if (tag.startsWith("CurrentGuild:")) player.removeTag(tag);
            }
            player.addTag(`CurrentGuild:${code}`);
        }
    }
    getCurrentGuild(player) {
        if (typeof player === "string") player = this.fetchPlayer(player);
        for (const tag of player.getTags()) {
            if (tag.startsWith("CurrentGuild:"))
                return tag.substring("CurrentGuild:".length);
        }
        return;
    }
    // <-=-=- Guild Commands -=-=->
    createGuildCMD(apiVars, apiFns) {
        let args = apiVars.msg.message.split(" ");
        args.shift();
        let guild = this.createGuild(
            args.join(" ") ? args.join(" ") : `${apiVars.username}'s Server`,
            apiVars.player
        );
        if (!guild || !guild.code)
            return this.tellraw(apiVars.username, `§cYou already have a guild`);
        this.addGuild(apiVars.player, guild.code);
        this.tellraw(apiVars.username, `§aCode: ${guild.code}`);
    }
    addGuildToList(apiVars, apiFns) {
        let args = apiVars.msg.message.split(" ");
        args.shift();
        // // console.warn(args[0])
        let isError = this.addGuild(apiVars.player, args[0]);
        if (isError)
            return this.tellraw(
                apiVars.username,
                `§cCannot join guild: Doesnt exist`
            );
        return this.tellraw(
            apiVars.username,
            `§aJoined guild with code of ${args[0]}`
        );
    }
    viewGuildList(apiVars, apiFns) {
        let guilds = apiVars.player
            .getTags()
            .filter((e) => e.startsWith(`GuildList:`));
        for (const guild of guilds) {
            this.tellraw(
                apiVars.username,
                `§d${guilds.indexOf(guild) + 1} §a${
                    this.getGuild(guild.replace(`GuildList:`, ``)).name
                } §b${this.getGuild(guild.replace(`GuildList:`, ``)).code}`
            );
        }
        if (!guilds.length)
            this.tellraw(apiVars.username, `§cThat guild doesnt exist!`);
    }
    joinGuild(apiVars, apiFns) {
        let args = apiVars.msg.message.split(" ");
        args.shift();
        let guilds = apiVars.player
            .getTags()
            .filter((e) => e.startsWith(`GuildList:`));
        let guild = guilds[parseInt(args[0]) - 1];
        apiVars.player.addTag(
            `CurrentGuild:${guild.replace(`GuildList:`, ``)}`
        );
        this.tellraw(
            apiVars.username,
            `§aWelcome to §d@${
                this.getGuild(`${guild.replace(`GuildList:`, ``)}`).name
            }§a, §e@${apiVars.username}`
        );
        if (guild) {
            for (const player of world.getPlayers()) {
                if (
                    player.hasTag(
                        `CurrentGuild:${guild.replace(`GuildList:`, ``)}`
                    )
                ) {
                    this.tellraw(
                        player.nameTag,
                        `§e@${apiVars.username} §ajoined!`
                    );
                }
            }
        }
    }
    sendGuildMessage(msg, guildCode) {
        for (const player of world.getPlayers()) {
            if (player.hasTag(`CurrentGuild:${guildCode}`)) {
                this.tellraw(
                    player.nameTag,
                    `§6<§e@${this.getGuild(guildCode).name} §c${
                        msg.sender.nameTag
                    }§6> §7${msg.message}`
                );
            }
        }
    }
    leaveGuild(apiVars, apiFns) {
        for (const tag of apiVars.player.getTags()) {
            if (tag.startsWith("CurrentGuild:")) apiVars.player.removeTag(tag);
        }
    }
    // <-=-=- Skyblock -=-=->
    createOrTeleportToIsland(player) {
        if (this.getScore("IsX", player.nameTag)) {
            let x = this.getScore(`IsX`, player.nameTag);
            let y = this.getScore(`IsY`, player.nameTag);
            let z = this.getScore(`IsZ`, player.nameTag);
            player.teleport(
                new Location(x, y, z),
                world.getDimension("overworld"),
                0,
                0
            );
            return;
        }
        let dSkyX = this.getScore("DSkyX", "coord")
            ? this.getScore("DSkyX", "coord")
            : 0;
        let dSkyY = this.getScore("DSkyY", "coord")
            ? this.getScore("DSkyY", "coord")
            : 0;
        let dSkyZ = this.getScore("DSkyZ", "coord")
            ? this.getScore("DSkyZ", "coord")
            : 0;
        dSkyX += 1;
        dSkyY += 1;
        if (dSkyX % 20 == 0) {
            dSkyZ += 1;
            dSkyX = 1;
        }
        this.createObjective("DSkyX");
        this.createObjective("DSkyY");
        this.createObjective("DSkyZ");
        this.createObjective("IsX");
        this.createObjective("IsY");
        this.createObjective("IsZ");

        this.setScore("DSkyX", "coord", dSkyX);
        this.setScore("DSkyY", "coord", dSkyY);
        this.setScore("DSkyZ", "coord", dSkyZ);
        let newX = 45000 + 250 * dSkyX;
        let newZ = 45000 + 250 * dSkyZ;
        let newY = 264;
        this.setScore(`IsX`, player.nameTag, newX + 3);
        this.setScore(`IsY`, player.nameTag, newY + 9);
        this.setScore(`IsZ`, player.nameTag, newZ + 11);
        let tickEvent = world.events.tick.subscribe((e) => {
            player.teleport(
                new Location(newX + 3, newY + 9, newZ + 11),
                world.getDimension("overworld"),
                0,
                0
            );
            if (
                !this.runCmd(
                    `execute "${player.nameTag}" ~ ~ ~ testforblock ~ ~-32 ~ barrier`
                ).error
            ) {
                world.events.tick.unsubscribe(tickEvent);
            }
            this.runCmd(
                `execute "${player.nameTag}" ~ ~ ~ fill ~-32 ~-32 ~-32 ~32 ~-32 ~32 barrier`
            );
            this.runCmd(
                `execute "${player.nameTag}" ~ ~ ~ fill ~-32 ~-32 ~-32 ~-32 ~32 ~32 barrier`
            );
            this.runCmd(
                `execute "${player.nameTag}" ~ ~ ~ fill ~-32 ~-32 ~-32 ~32 ~32 ~-32 barrier`
            );
            this.runCmd(
                `execute "${player.nameTag}" ~ ~ ~ fill ~32 ~-32 ~32 ~32 ~32 ~-32 barrier`
            );
            this.runCmd(
                `execute "${player.nameTag}" ~ ~ ~ fill ~32 ~-32 ~32 ~-32 ~32 ~32 barrier`
            );
            this.runCmd(
                `execute "${player.nameTag}" ~ ~ ~ fill ~-32 ~32 ~-32 ~32 ~32 ~32 barrier`
            );
            let islands = ["large_island3", "large_island_snow2"];
            this.runCmd(
                `execute "${
                    player.nameTag
                }" ~-3 ~-9 ~-11 structure load mystructure:${
                    Math.floor(Math.random() * 80) == 42
                        ? islands[Math.floor(Math.random() * islands.length)]
                        : islands[0]
                } ~ ~ ~`
            );
        });
    }
    listenForEvents() {
        events.on("raw", (type, ...args) => {
            if (type == "beforeAzaleaCommand") {
                let apiVars = args[0];
                return;
            }
            if (type == "registerPluginEvent") {
                // console.warn(args);
                args[0].push(...args[1]);
                return;
            }
        });
    }
    getCfgPassword(defaultPassword = "trash") {
        return this.get("password", "private")
            ? this.get("password", "private")
            : defaultPassword;
    }
    on_azalea_loader_msg(msg) {
        msg.cancel = true;
        let cmd = msg.message.split(" ")[0];

        let args = msg.message.split(" ");
        args.shift();

        let hpassword = tempStorage.has(`loaderUser_${msg.sender.nameTag}`);
        let lpassword = tempStorage.get(`loaderUser_${msg.sender.nameTag}`);
        let password = this.getCfgPassword();

        if (hpassword) {
            if (lpassword == password) {
                this.tellraw(msg.sender.nameTag, `... §d${cmd} ....`);
                if (cmd == "help") {
                    this.tellraw(
                        msg.sender.nameTag,
                        `§9exit\n§9help\n§9set-password <old> <new>\ntemp-storage <key> <val>\n\n§cPlease do not modify anything if you do not know what it is.`
                    );
                } else if (cmd == "exit") {
                    msg.sender.removeTag("cfgmode:test");
                } else if (cmd == "set-password") {
                    if (args[0] == password) {
                        this.set("password", args[1], "private");
                        this.tellraw(
                            msg.sender.nameTag,
                            `§aPassword changed to ${args[1]}. Please login again`
                        );
                    }
                } else if (cmd == "temp-storage") {
                    let key = args[0];
                    let val = args.join(" ").split(" ");
                    val.shift();
                    val = val.join(" ");
                    tempStorage.set(key, val);
                    return this.tellraw(
                        msg.sender.nameTag,
                        `§9Set §aTEMP §9value\n§aKey §r${key}\n§aValue §r${val}`
                    );
                }
            } else {
                if (cmd === "login") {
                    if (args.join(" ") == password) {
                        tempStorage.set(
                            `loaderUser_${msg.sender.nameTag}`,
                            args.join(" ")
                        );
                        this.tellraw(
                            msg.sender.nameTag,
                            `§aSuccessfully logged in!`
                        );
                    } else {
                        this.tellraw(
                            msg.sender.nameTag,
                            `§cSuccessfully failed to log in!`
                        );
                    }
                } else {
                    this.tellraw(
                        msg.sender.nameTag,
                        `§cThe password was changed, please login again`
                    );
                }
            }
        } else {
            if (cmd === "login") {
                if (args.join(" ") == password) {
                    tempStorage.set(
                        `loaderUser_${msg.sender.nameTag}`,
                        args.join(" ")
                    );
                    this.tellraw(
                        msg.sender.nameTag,
                        `§aSuccessfully logged in!`
                    );
                } else {
                    this.tellraw(
                        msg.sender.nameTag,
                        `§cSuccessfully failed to log in!`
                    );
                }
            }
        }
    }
    reoccurringMessagesCheck(object) {
        tempStorage.set("reoccuringMessagesInterval", (tempStorage.has("reoccuringMessagesInterval") ? tempStorage.get("reoccuringMessagesInterval") : 0)+1);
        if((tempStorage.has("reoccuringMessagesInterval") ? tempStorage.get("reoccuringMessagesInterval") : 0) % 4 != 0) return;
        let range = 1,
            reoccurringMessages = tempStorage.has('ReoccuringMessages') ? tempStorage.get('ReoccuringMessages') : [];
        for(let i = 0;i < reoccurringMessages.length;i++) {
            let secondsInterval = reoccurringMessages[i].secondsInterval,
                secondsDistance = azalea.now() % secondsInterval;
            if(secondsDistance == 0) this.tellraw('@a', reoccurringMessages[i].message);
        }
    }
    refreshSomeData(apiVars = null) {
        if(apiVars && !this.isAdmin(apiVars.username)) return this.tellraw(apiVars.username, `§cYou found the secret no admin message!`);

        /*

        ! For testing purposes only

        this.set("ReocccuringMessages", JSON.stringify([
            {
                secondsInterval: 5,
                message: "§dReoccurring message"
            }
        ]), "misc")

        */
        tempStorage.set('ReoccuringMessages', JSON.parse(this.get("ReocccuringMessages","misc") ? this.get("ReocccuringMessages","misc") : "[]"));
        if(apiVars) this.tellraw(apiVars.username, `§dReloaded (some) data`);
    }
    parseAnalyticsID(id) {
        switch(id) {
            case "0":
                return "Total Blocks Mined";
            case "1":
                return "Total Blocks Placed";
            case "2":
                return "Joins";
            case "3":
                return "Leaves";
            case "4":
                return "Commands Used";
            default:
                return "Broken Value";
        }
    }
    printAnalytics(apiVars, apiFns) {
        let analytics = getAnalytics();
        console.warn(analytics);
        let keys = Array.from(analytics.keys());
        console.warn(keys)
        for(let i = 0;i < keys.length;i++) {
            let date1 = keys[i].replace(/_/g,"/").split('/');
            let date2 = new Date(Date.now());
            date2.setFullYear(date1[2], date1[0], date1[1]);
            let date = momentjs(date2.getTime()).format("MMMM Do YYYY");
            this.tellraw(apiVars.username, `§8[§d+§8] §7${date}`);
            let more = analytics.get(keys[i]);
            for(let i2 = 0;i2 < more.length;i2++) {
                let id = this.parseAnalyticsID(more[i2].id);
                let value = more[i2].value;
                this.tellraw(apiVars.username, `${id}: §a${value}`);
            }

        }
    }
}
