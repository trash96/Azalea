import {
    Dimension,
    Player,
    BeforeItemUseEvent,
    BeforeChatEvent,
    world,
    InventoryComponentContainer,
    ItemStack,
    TickEvent,
    ExplosionOptions,
    Vector,
    Location
} from "mojang-minecraft";
// system.events.beforeWatchdogTerminate.subscribe(e=>{
//     e.cancel = true;
// })

import { events } from "../events.js";
import {
    MessageFormData,
    ModalFormData,
    ActionFormData,
} from "mojang-minecraft-ui";
// import { WiseDataFish } from "./theWiseDataFish.js";
import { ActionForm, MessageForm, ModalForm } from "../API/Forms.js";
// import { Features } from "./features.js";
import { environment } from "./environmentVariables.js";
const Modifier = environment.modifierFile;
import { warpAdded } from "../languages/en_us/dialog.js";
import { welcomeMessage } from "../Modules/welcomeMessage.js";
import { onWorldLoad } from "../events/worldLoaded.js";
import * as Minecraft from "mojang-minecraft";
import { tempStorage } from "../memoryMap.js";
import { setScoreboardText } from "../commands/scoreboard.js";
import { momentjs } from "../lib/moment.js";
let portalMap = new Map();
let portalGunsEnabled = false;
world.events.entityHit.subscribe(e=>{
    if(e.hitEntity) {
        e.hitEntity.addTag('azalea:hit');
    }
})
let rickroll = `We're no strangers to love
You know the rules and so do I (do I)
A full commitment's what I'm thinking of
You wouldn't get this from any other guy
I just wanna tell you how I'm feeling
Gotta make you understand
Never gonna give you up
Never gonna let you down
Never gonna run around and desert you
Never gonna make you cry
Never gonna say goodbye
Never gonna tell a lie and hurt you
We've known each other for so long
Your heart's been aching, but you're too shy to say it (say it)
Inside, we both know what's been going on (going on)
We know the game and we're gonna play it
And if you ask me how I'm feeling
Don't tell me you're too blind to see
Never gonna give you up
Never gonna let you down
Never gonna run around and desert you
Never gonna make you cry
Never gonna say goodbye
Never gonna tell a lie and hurt you
Never gonna give you up
Never gonna let you down
Never gonna run around and desert you
Never gonna make you cry
Never gonna say goodbye
Never gonna tell a lie and hurt you
We've known each other for so long
Your heart's been aching, but you're too shy to say it (to say it)
Inside, we both know what's been going on (going on)
We know the game and we're gonna play it
I just wanna tell you how I'm feeling
Gotta make you understand
Never gonna give you up
Never gonna let you down
Never gonna run around and desert you
Never gonna make you cry
Never gonna say goodbye
Never gonna tell a lie and hurt you
Never gonna give you up
Never gonna let you down
Never gonna run around and desert you
Never gonna make you cry
Never gonna say goodbye
Never gonna tell a lie and hurt you
Never gonna give you up
Never gonna let you down
Never gonna run around and desert you
Never gonna make you cry
Never gonna say goodbye
Never gonna tell a lie and hurt you`;
export function load(loaderOptions) {
    const adminTag = "admin";
    const prefix = "\\";
    const flags = ["DISABLE_GUI_NOT_NEW_VERSION"];
    let plugins = [];
    function loadPlugin(pluginClass, loaderOptions = {}) {
        plugins.push(new pluginClass(loaderOptions));
    }
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
    function tellraw(selector, text) {
        runCmd(
            `tellraw ${
                selector.startsWith("@") ? selector : `"${selector}"`
            } {"rawtext":[{"text":${JSON.stringify(text)}}]}`
        );
    }
    onWorldLoad(ticks => {
        tellraw("@a", `§cAzalea loaded in ${ticks} ticks`);
    });
    let AZALEAAPI = {
        tellraw,
        runCmd,
    };
    let ticks = 0;
    world.events.weatherChange.subscribe(weather => {
        for (let i = 0; i < plugins.length; i++) {
            try {
                plugins[i].on_weather_change(weather);
            } catch (e) {}
        }
    });
    // world.events.worldInitialize.subscribe(e=>{
    //     for (let i = 0; i < plugins.length; i++) {
    //         try {
    //             plugins[i].onWorldInitialize(e);
    //         } catch (e) { }
    //     }
    // })
    world.events.playerJoin.subscribe(player => {
        welcomeMessage(player.player, plugins[0].getPrefix());
        for (let i = 0; i < plugins.length; i++) {
            try {
                plugins[i].on_player_join(player);
            } catch (e) {}
        }
    });
    world.events.entityCreate.subscribe(e => {
        // world.events.blockBreak.subscribe(e => {
        //     for (let i = 0; i < plugins.length; i++) {
        //         try {
        //             plugins[i].entityCreate(e);
        //         } catch (e) { }
        //     }
        // })
    });
    world.events.beforePistonActivate.subscribe(e => {
        for (let i = 0; i < plugins.length; i++) {
            try {
                plugins[i].beforePistonActivate(e);
            } catch (e) {}
        }
    });
    world.events.blockBreak.subscribe(e => {
        for (let i = 0; i < plugins.length; i++) {
            try {
                plugins[i].breakBlock(e);
            } catch (e) {}
        }
    });
    world.events.blockPlace.subscribe(e => {
        for (let i = 0; i < plugins.length; i++) {
            try {
                plugins[i].placeBlock(e);
            } catch (e) {}
        }
    });
    world.events.playerLeave.subscribe(player => {
        for (let i = 0; i < plugins.length; i++) {
            try {
                plugins[i].on_player_leave(player);
            } catch (e) {}
        }
    });
    world.events.beforeExplosion.subscribe(e => {
        for (let i = 0; i < plugins.length; i++) {
            try {
                plugins[i].beforeExplosion(e);
            } catch (e) {}
        }
    });
    world.events.tick.subscribe(tick => {
        ticks++;
        if (ticks % 5 == 0) {
            for (let i = 0; i < plugins.length; i++) {
                try {
                    plugins[i].azalea_on_5tick(AZALEAAPI);
                } catch (e) {
                    tellraw("@a", `${e}`);
                }
            }
        }
        if (ticks % 20 == 0) {
            let players = world.getPlayers();
            runCmd(`scoreboard objectives add chatCooldown dummy`);
            for (const player of players) {
                runCmd(
                    `scoreboard players remove @a[name="${player.nameTag}"] chatCooldown 1`
                );
                runCmd(
                    `scoreboard players remove @a[name="${player.nameTag}"] _cmdcooldown 1`
                );
            }
        }
        if (ticks > 20) ticks = 0;
    });
    world.events.beforeItemUse.subscribe(eventData => {
        if(eventData.source.hasTag('cannotuse') && !eventData.source.hasTag('admin')) return eventData.cancel = true;
        for (let i = 0; i < plugins.length; i++) {
            try {
                plugins[i].on_item_use(eventData);
            } catch (e) {}
        }
        // Just a joke in a livestream
        // eventData.cancel = true;
        // let messageForm = new ActionForm();
        // messageForm.setTitle('Test');
        // messageForm.setBody(rickroll)
        // messageForm.addButton('Ok');
        // messageForm.show(eventData.source, res=>{

        // })
        // return;
        let item = eventData.item.id;
        item = item.startsWith("minecraft:")
            ? item.replace("minecraft:", "")
            : item;
        eventData.source.addTag(`using_item`);
        if (item == "dragon_breath") {
            // console.warn('yes');
            // world.setDynamicProperty('hi', 1);
            // console.warn(world.getDynamicProperty('hi'));
            // let data = new MessageFormData().body("Do you want to give your life savings to a random homeless guy?").title("UI Test").button1("Yes").button2("No").show(eventData.source).then(data2=>{
            //     if(!data2.isCanceled) {
            //         // if(data2.selection == 0) return tellraw(eventData.source.nameTag, "Ok, say goodbye to your life savings");
            //         // if(data2.selection == 1) return tellraw(eventData.source.nameTag, "But the homeless man wants money :(");
            //         console.warn(`${data2.selection}`)
            //     }
            // });
            // new ModalFormData().dropdown("Select an Option", ["Option 1", "Option 2", "Option 3"], 0).title("Hello, world!").textField("Enter text", "This is a text field").toggle("Default: On", true).toggle("Default: Off", false).toggle("Another Toggle", false).show(eventData.source).then(data2=>{
            //     if(!data2.isCanceled) {
            //         console.warn(JSON.stringify(data2.formValues))
            //     }
            // });
            // eventData.cancel = true;
            // let components = eventData.source.getComponents();
            // tellraw(eventData.source.nameTag, "§dComponent List");
            // for (let i = 0; i < components.length; i++) {
            //     tellraw(eventData.source.nameTag, "§r§f- §r§a§o" + components[i].id);
            // }
            // Help.
            //         let results = runCmd(`scoreboard objectives list`);
            //         let objectives = results.statusMessage.match(/\- ([\s\S]*?)\: ([\s\S]*?)/g)
            //         if (objectives) {
            //             objectives = objectives.map(objective => {
            //                 return objective.replace('- ', '').slice(0, -2);
            //             }).filter(objective => objective.startsWith('WARP')).map(objective => objective.replace('WARP', ''));
            //         } else {
            //             // return this.no_warps_message(tellraw, username);
            //         }
            //         if (!objectives.length) return this.no_warps_message(tellraw, username);
            // //         tellraw(username, `§4<-=-=-=- §6Warps §4-=-=-=->
            // // §r§7- §8§o${objectives.join('\n§r§7- §8§o')}`);
            //         let formData = new ActionFormData();
            //         formData.title(`Warps (${objectives.length} total)`).body("Welcome to the beta form UI");
            //         for(let i = 0;i < objectives.length;i++) {
            //             formData.button(objectives[i]);
            //         }
            //         formData.show(eventData.source).then(res=>{
            //             if(!res.isCanceled) {
            //                 plugins[0].teleportPlayerToWarp(objectives[res.selection], eventData.source.nameTag, plugins[0]);
            //             }
            //         })
            let components = eventData.source.getComponents();
            let actionForm = new ActionForm();
            let componentNames = [];
            for (let i = 0; i < components.length; i++) {
                componentNames.push(components[i].id);
            }
            actionForm.setBody(componentNames.join("\n"));
            actionForm.setTitle("Your components");
            actionForm.addButton("Ok");
            actionForm.show(eventData.source, e => {});
        }
        if (
            item == "totem_of_undying" &&
            eventData.item.nameTag &&
            eventData.item.nameTag == "me"
        ) {
            let form = new ModalForm();
            form.setTitle("Your Profile");
            let player = eventData.source;
            form.textField(
                "Your Nickname",
                "Type a nickname here!",
                player.nameTag
            );
            form.show(player, res => {
                if (res.formValues.length && res.formValues[0]) {
                    player.nameTag = res.formValues[0];
                }
            });
        }
        if (
            item == "book" &&
            eventData.item.nameTag &&
            eventData.item.nameTag == "notebook"
        ) {
            let form = new ActionForm();
            form.setTitle("Notebook");
            let player = eventData.source;
            let notes = eventData.item.getLore()
                ? eventData.item.getLore()
                : [];
            notes = notes.map(note => `§r§a- ${note}`);
            let item = eventData.item;
            form.setBody(
                `You have ${
                    notes.length
                } notes for this item.\n§r§a${notes.join("§r§a\n§r§a")}`
            );
            form.addButton("Add Note", "textures/items/paper");
            form.addButton("Remove Note", "textures/items/paper");
            form.addButton("Convert to Admin Book", "textures/items/paper");
            form.addButton("Exit");
            form.show(player, formResults => {
                if (formResults.selection == 0) {
                    // console.warn('== 0')
                    try {
                        let addNoteForm = new ModalForm();
                        addNoteForm.setTitle("Add Note");
                        addNoteForm.textField("Text", "Type your note here!");
                        addNoteForm.show(player, noteData => {
                            if (
                                noteData.formValues.length &&
                                noteData.formValues[0]
                            ) {
                                let lore = item.getLore() ? item.getLore() : [];
                                lore.push(noteData.formValues[0]);
                                item.setLore(lore);
                                let inventory = player.getComponent(
                                    "minecraft:inventory"
                                ).container;
                                inventory.setItem(player.selectedSlot, item);
                            }
                        });
                    } catch (e) {
                        console.warn(e);
                    }
                } else if (formResults.selection == 1) {
                    let removeNoteForm = new ActionForm();
                    removeNoteForm.addButton("Exit");
                    if (notes.length) {
                        for (let i = 0; i < notes.length; i++) {
                            removeNoteForm.addButton(
                                notes[i],
                                "textures/items/paper"
                            );
                        }
                    }
                    removeNoteForm.show(player, noteData => {
                        if (noteData && noteData.selection) {
                            let selection = noteData.selection - 1;
                            let lore = item.getLore() ? item.getLore() : [];
                            lore.splice(selection, 1);
                            item.setLore(lore);
                            let inventory = player.getComponent(
                                "minecraft:inventory"
                            ).container;
                            inventory.setItem(player.selectedSlot, item);
                        }
                    });
                } else if (formResults.selection == 2) {
                    if (plugins[0].isAdmin(player.nameTag)) {
                        let book = {
                            name: "<unset>",
                            notes: item.getLore() ? item.getLore() : [],
                        };
                        let adminBooks = JSON.parse(
                            plugins[0].get("adminBooks", "books")
                                ? plugins[0].get("adminBooks", "books")
                                : "[]"
                        );
                        adminBooks.push(book);
                        plugins[0].set(
                            "adminBooks",
                            JSON.stringify(adminBooks),
                            "books"
                        );
                    }
                }
            });
        }
        if (item == "azalea:warps_menu") {
            let warps = plugins[0].listWarpsInvisible2();
            let form = new ActionForm();
            form.addButton("Exit");
            for (const warp of warps) {
                form.addButton(`§5${warp}\n§8Click to Teleport`);
            }
            let player = eventData.source;
            form.show(eventData.source, selection => {
                if (selection && selection.selection) {
                    let ticks = 0;
                    let tickDelay = world.events.tick.subscribe(() => {
                        ticks++;
                        if (ticks % 8 == 0) {
                            world.events.tick.unsubscribe(tickDelay);
                            plugins[0].teleportPlayerToWarp(
                                warps[selection.selection - 1],
                                player.nameTag
                            );
                        }
                    });
                }
            });
        }
        if (
            item ==
            "verysecretitempleasedonotcheckthisokyoucangonow:comicaldino"
        ) {
            let ui = new MessageForm();
            ui.button1("Ok");
            ui.button2("Ok");
            ui.setTitle("...");
            ui.setBody(
                "Why even bother wasting your life using this item? Go touch grass."
            );
            let player = eventData.source;
            ui.show(player, res => {
                if (!res.isCanceled) {
                    if (res.selection == 1) {
                        let times = 0;
                        function test10104309o230() {
                            times++;
                            let ui2 = new MessageForm();
                            ui2.button1("Ok");
                            ui2.button2("Ok");
                            ui2.setTitle("...");
                            ui2.setBody(
                                `You clicked ok ${times} times! Click the second ok to exit.`
                            );
                            ui2.show(player, res => {
                                if (!res.isCanceled && res.selection == 1) {
                                    test10104309o230();
                                }
                            });
                        }
                        test10104309o230();
                    }
                }
            });
        }
        if (item == "test:azalea_1") {
            let raycastOptions = new Minecraft.BlockRaycastOptions();
            raycastOptions.maxDistance = 7;
            let isSneaking = eventData.source.isSneaking,
                player = eventData.source,
                blockFacing = player.getBlockFromViewVector(raycastOptions),
                block1 = blockFacing,
                block2 = player.dimension.getBlock(
                    new Minecraft.BlockLocation(
                        block1.location.x,
                        block1.location.y + 1,
                        block1.location.z
                    )
                );
            if (
                block1.id !== "minecraft:iron_block" ||
                block2.id !== "minecraft:iron_block"
            ) {
                if (
                    block1.id === "minecraft:netherreactor" &&
                    block2.id == "minecraft:netherreactor"
                ) {
                    if (portalMap.has(`portal_${player.nameTag}_blue`)) {
                        let portalLoc = portalMap.get(
                            `portal_${player.nameTag}_blue`
                        );
                        let block1_new = portalLoc.dimension.getBlock(
                            portalLoc.loc
                        );
                        let block2_new = portalLoc.dimension.getBlock(
                            new Minecraft.BlockLocation(
                                portalLoc.loc.x,
                                portalLoc.loc.y + 1,
                                portalLoc.loc.z
                            )
                        );
                        block1_new.setPermutation(
                            portalLoc.previousBlockPermutation[0]
                        );
                        block2_new.setPermutation(
                            portalLoc.previousBlockPermutation[0]
                        );
                        portalMap.delete(`portal_${player.nameTag}_blue`);
                    }
                    return;
                }
                if (
                    block1.id == "minecraft:glowingobsidian" &&
                    block2.id === "minecraft:glowingobsidian"
                ) {
                    if (portalMap.has(`portal_${player.nameTag}_red`)) {
                        let portalLoc = portalMap.get(
                            `portal_${player.nameTag}_red`
                        );
                        let block1_new = portalLoc.dimension.getBlock(
                            portalLoc.loc
                        );
                        let block2_new = portalLoc.dimension.getBlock(
                            new Minecraft.BlockLocation(
                                portalLoc.loc.x,
                                portalLoc.loc.y + 1,
                                portalLoc.loc.z
                            )
                        );
                        block1_new.setPermutation(
                            portalLoc.previousBlockPermutation[0]
                        );
                        block2_new.setPermutation(
                            portalLoc.previousBlockPermutation[0]
                        );
                        portalMap.delete(`portal_${player.nameTag}_red`);
                    }
                    return;
                }
                return;
            }
            let bluePortal =
                Minecraft.MinecraftBlockTypes.netherreactor.createDefaultBlockPermutation();
            let redPortal =
                Minecraft.MinecraftBlockTypes.glowingobsidian.createDefaultBlockPermutation();
            let portalBlock = isSneaking ? redPortal : bluePortal;
            if (isSneaking) {
                if (portalMap.has(`portal_${player.nameTag}_red`)) {
                    let portalLoc = portalMap.get(
                        `portal_${player.nameTag}_red`
                    );
                    let block1_new = portalLoc.dimension.getBlock(
                        portalLoc.loc
                    );
                    let block2_new = portalLoc.dimension.getBlock(
                        new Minecraft.BlockLocation(
                            portalLoc.loc.x,
                            portalLoc.loc.y + 1,
                            portalLoc.loc.z
                        )
                    );
                    block1_new.setPermutation(
                        portalLoc.previousBlockPermutation[0]
                    );
                    block2_new.setPermutation(
                        portalLoc.previousBlockPermutation[0]
                    );
                }
                portalMap.set(`portal_${player.nameTag}_red`, {
                    loc: block1.location,
                    playerLoc: player.location,
                    previousBlockPermutation: [
                        block1.permutation.clone(),
                        block2.permutation.clone(),
                    ],
                    dimension: player.dimension,
                });
            } else {
                if (portalMap.has(`portal_${player.nameTag}_blue`)) {
                    let portalLoc = portalMap.get(
                        `portal_${player.nameTag}_blue`
                    );
                    let block1_new = portalLoc.dimension.getBlock(
                        portalLoc.loc
                    );
                    let block2_new = portalLoc.dimension.getBlock(
                        new Minecraft.BlockLocation(
                            portalLoc.loc.x,
                            portalLoc.loc.y + 1,
                            portalLoc.loc.z
                        )
                    );
                    block1_new.setPermutation(
                        portalLoc.previousBlockPermutation[0]
                    );
                    block2_new.setPermutation(
                        portalLoc.previousBlockPermutation[0]
                    );
                }
                portalMap.set(`portal_${player.nameTag}_blue`, {
                    loc: block1.location,
                    playerLoc: player.location,
                    previousBlockPermutation: [
                        block1.permutation.clone(),
                        block2.permutation.clone(),
                    ],
                    dimension: player.dimension,
                });
            }
            block1.setPermutation(portalBlock.clone());
            block2.setPermutation(portalBlock.clone());
            return;
        }
        if (item == "azalea:admin_panel") {
            // let data = new MessageFormData().body("Do you want to give your life savings to a random homeless guy?").title("UI Test").button1("Yes").button2("No").show(eventData.source).then(data2=>{
            //     if(!data2.isCanceled) {
            //         // if(data2.selection == 0) return tellraw(eventData.source.nameTag, "Ok, say goodbye to your life savings");
            //         // if(data2.selection == 1) return tellraw(eventData.source.nameTag, "But the homeless man wants money :(");
            //         console.warn(`${data2.selection}`)
            //     }
            // });
            if (!plugins[0].isAdmin(eventData.source.nameTag))
                return tellraw(
                    eventData.source.nameTag,
                    "§cYou cannot use the admins menu without admin"
                );
            let selectionData = new ActionFormData();
            selectionData.button("Config", "textures/ui/dev_glyph_color"); // 0
            selectionData.button("Mod mail", "textures/ui/invite_base"); // 1
            selectionData.button("Logs", "textures/ui/infobulb"); // 2
            selectionData.button("Reviews", "textures/ui/filledStar"); // 3
            selectionData.button(
                "Create Announcement or Broadcast",
                "textures/ui/broadcast_glyph_color"
            ); // 4
            selectionData.button("Books", "textures/items/book_normal"); // 5
            selectionData.button("Members §b(New)", "textures/ui/deop"); // 6
            selectionData.button(
                "You §b(New)",
                "textures/ui/permissions_member_star"
            ); // 7
            selectionData.button("Warps §b(New)", "textures/items/ender_pearl"); // 8
            selectionData.button("Scoreboard", "textures/items/dev_glyph_color"); // 9
            selectionData.button("Reported Players");
            selectionData.button("Next -->"); // 11
            selectionData.title("§dAdmin UI §a[Page 1]");
            selectionData.body("Please select an option or exit the menu.");
            let player = eventData.source;
            let callback2 = selectionRes => {
                if (selectionRes.selection == 0) {
                    let prevPage = new ActionForm();
                    prevPage.actionForm = selectionData;
                    prevPage.show(player, callback);
                }
            };
            let callback = selectionRes => {
                if(selectionRes.selection == 10) {
                    // player.triggerEvent("binocraft:kick")
                    try {
                        let reportedPlayersMenu = new ActionForm();
                        let reportedPlayers = JSON.parse(plugins[0].get("reportedPlayers") ? plugins[0].get("reportedPlayers") : "[]");
                        reportedPlayersMenu.setTitle('Reported Players');
                        reportedPlayersMenu.setBody('Select One');
                        reportedPlayersMenu.addButton("Ok")
                        for(let i = 0;i < reportedPlayers.length;i++) {
                            reportedPlayersMenu.addButton(`${reportedPlayers[i].reportedUser}\n§3#${i+1}`);
                        }
                        reportedPlayersMenu.show(player, res2=>{
                            if(res2.selection) {
                                let selection = res2.selection-1;
                                let report = reportedPlayers[selection];
                                let newForm = new ActionForm();
                                newForm.setTitle(`Case #${selection+1}`);
                                newForm.setBody(`§6Sender §r${report.sender}\n§6Reported User §r${report.reportedUser}\n§6Reason §r${report.reason}`);
                                newForm.addButton('Ok');
                                newForm.show(player, res=>{
    
                                })
                            }
                        })
    
                    } catch(e) {
                        console.error(e)
                    }
                    return;
                }
                if (selectionRes.selection == 11) {
                    let nextPage = new ActionForm();
                    nextPage.setTitle("§dAdmin UI §a[Page 2]");
                    let panelSections = [];
                    for (const adminPanelFeature of plugins[0]
                        .adminPanelFeatures) {
                        let { sections } = adminPanelFeature;
                        for (const section of sections) {
                            panelSections.push({
                                id: section.id,
                            });
                            nextPage.addButton(
                                section.text,
                                section.icon ? section.icon : null
                            );
                        }
                    }
                    nextPage.addButton("<-- Previous");
                    let callback3 = selectionRes2 => {
                        if (selectionRes2.selection >= panelSections.length) {
                            let prevPage = new ActionForm();
                            prevPage.actionForm = selectionData;
                            prevPage.show(player, callback);
                        }
                        let ticksTrash = 0;
                        let tickEventTrash = world.events.tick.subscribe(() => {
                            ticksTrash++;
                            if (ticksTrash % 8 == 0) {
                                world.events.tick.unsubscribe(tickEventTrash);
                                let section =
                                    panelSections[selectionRes2.selection];
                                player.addTag(
                                    `azalea_adminpanel:${section.id}`
                                );
                            }
                        });
                    };
                    nextPage.show(player, callback3);
                }
                if(selectionRes.selection == 9) {
                    let form = new ModalForm();
                    let text = plugins[0].get(`screb`, `misc`) ? plugins[0].get(`screb`, `misc`) : null;
                    form.textField("Text (Formatted)", "Please type scoreboard text here", text);
                    form.show(player,res=> {
                        let input = res.formValues[0];
                        if(!input) return;
                        plugins[0].set(`screb`, res.formValues[0], `misc`);
                        setScoreboardText(res.formValues[0]);
                    });
                }
                if (selectionRes.selection == 8) {
                    let warpActions = new ActionForm();
                    warpActions.setTitle("Warps");
                    warpActions.setBody("Click here to do something");
                    warpActions.addButton("Exit", "textures/ui/realms_red_x");
                    warpActions.addButton("Create Warp", "textures/ui/plus");
                    warpActions.addButton("Remove Warp", "textures/ui/minus");
                    warpActions.addButton(
                        "Teleport to Warp",
                        "textures/ui/arrow_active"
                    );
                    warpActions.show(player, res => {
                        if (res.selection == 1) {
                            let createWarpForm = new ModalForm();
                            createWarpForm.setTitle("Crate a Warp");
                            createWarpForm.textField(
                                "Name",
                                "Set a name for the warp"
                            );
                            createWarpForm.show(player, res2 => {
                                if (
                                    res2 &&
                                    res2.formValues &&
                                    res2.formValues.length &&
                                    res2.formValues[0]
                                ) {
                                    let input = res2.formValues[0];
                                    plugins[0].runCmd(
                                        `scoreboard objectives add "WARP${input}" dummy`
                                    );
                                    plugins[0].runCmd(
                                        `scoreboard players set x "WARP${input}" ${Math.trunc(
                                            player.location.x
                                        )}`
                                    );
                                    plugins[0].runCmd(
                                        `scoreboard players set y "WARP${input}" ${Math.trunc(
                                            player.location.y
                                        )}`
                                    );
                                    plugins[0].runCmd(
                                        `scoreboard players set z "WARP${input}" ${Math.trunc(
                                            player.location.z
                                        )}`
                                    );
                                    let dimensions = [
                                        world.getDimension("overworld").id,
                                        world.getDimension("nether").id,
                                        world.getDimension("the end").id,
                                    ];
                                    let playerDimensionID = player.dimension.id;
                                    let dimensionNumberID =
                                        dimensions.indexOf(playerDimensionID);
                                    plugins[0].runCmd(
                                        `scoreboard players set dimension "WARP${input}" ${
                                            dimensionNumberID > -1
                                                ? dimensionNumberID
                                                : 0
                                        }`
                                    );
                                }
                            });
                            return;
                        }
                        if (res.selection == 2) {
                            let removeWarpForm = new ActionForm();
                            removeWarpForm.setTitle("Remove a Warp");
                            removeWarpForm.setBody(
                                "Please click a button to remove a warp."
                            );
                            let warps = plugins[0]
                                .listObjectives()
                                .filter(objective =>
                                    objective.startsWith("WARP")
                                )
                                .map(objective =>
                                    objective.replace("WARP", "")
                                );
                            removeWarpForm.addButton(
                                "Exit",
                                "textures/ui/realms_red_x"
                            );
                            for (const warp of warps) {
                                removeWarpForm.addButton(
                                    warp,
                                    "textures/ui/ender_pearl"
                                );
                            }
                            removeWarpForm.show(player, res2 => {
                                if (res2 && res2.selection) {
                                    let warpIndex = res2.selection - 1;
                                    let warp = warps[warpIndex];
                                    plugins[0].runCmd(
                                        `scoreboard objectives remove "WARP${warp}"`
                                    );
                                }
                            });
                        }
                        if (res.selection == 3) {
                            let teleportWarpForm = new ActionForm();
                            teleportWarpForm.setTitle("Remove a Warp");
                            teleportWarpForm.setBody(
                                "Please click a button to remove a warp."
                            );
                            let warps = plugins[0]
                                .listObjectives()
                                .filter(objective =>
                                    objective.startsWith("WARP")
                                )
                                .map(objective =>
                                    objective.replace("WARP", "")
                                );
                            teleportWarpForm.addButton(
                                "Exit",
                                "textures/ui/realms_red_x"
                            );
                            for (const warp of warps) {
                                teleportWarpForm.addButton(
                                    warp,
                                    "textures/ui/ender_pearl"
                                );
                            }
                            teleportWarpForm.show(player, res2 => {
                                let warpIndex = res2.selection - 1;
                                let warp = warps[warpIndex];
                                let objective = `WARP${warp}`;
                                let dimension = plugins[0].getScore(
                                        objective,
                                        "dimension"
                                    ),
                                    x = plugins[0].getScore(objective, "x"),
                                    y = plugins[0].getScore(objective, "y"),
                                    z = plugins[0].getScore(objective, "z");
                                let dimensions = [
                                    world.getDimension("overworld"),
                                    world.getDimension("nether"),
                                    world.getDimension("the end"),
                                ];
                                let ticks2 = 0;
                                let delay2 = world.events.tick.subscribe(() => {
                                    ticks2++;
                                    if (ticks2 % 8 == 0) {
                                        world.events.tick.unsubscribe(delay2);
                                        player.teleport(
                                            new Location(x, y, z),
                                            dimensions[
                                                dimension ? dimension : 0
                                            ],
                                            0,
                                            0
                                        );
                                    }
                                });
                            });
                        }
                    });
                }
                if (selectionRes.selection == 7) {
                    let form = new ActionForm();
                    form.setBody("Select an option.");
                    form.setTitle("You, YES YOU!");
                    form.addButton("Exit", "textures/ui/realms_red_x");
                    form.addButton(
                        `${
                            player.hasTag("staffchat")
                                ? `Exit staff chat`
                                : `Enter staff chat`
                        }`,
                        `${
                            player.hasTag("staffchat")
                                ? `textures/ui/realms_red_x`
                                : `textures/ui/realms_slot_check`
                        }`
                    );
                    form.show(player, res => {
                        if (res.selection == 1) {
                            if (player.hasTag("staffchat"))
                                player.removeTag("staffchat");
                            else player.addTag("staffchat");
                        }
                    });
                }
                if (selectionRes.selection == 6) {
                    let memberForm = new ActionForm();
                    memberForm.setTitle("Members §b(New)");
                    memberForm.setBody(
                        "New members menu! Use this to manage members."
                    );
                    memberForm.addButton("Exit", "textures/ui/realms_red_x");
                    let players = [];
                    let playerNames = [];
                    for (const player2 of world.getPlayers()) {
                        players.push(player2);
                        playerNames.push(player2.nameTag);
                        memberForm.addButton(
                            `${player2.hasTag("admin") ? `§c[ADMIN] §r` : ``}${
                                player2.name
                            }`,
                            `textures/ui/${
                                player2.hasTag("admin") ? `op` : `deop`
                            }`
                        );
                    }
                    let offlinePlayers = JSON.parse(
                        plugins[0].get("offlinePlayers", "offline")
                            ? plugins[0].get("offlinePlayers", "offline")
                            : "[]"
                    );
                    for (const offlinePlayer of offlinePlayers) {
                        if (!playerNames.includes(offlinePlayer))
                            memberForm.addButton(
                                `${offlinePlayer}`,
                                `textures/ui/offline.png`
                            );
                    }
                    memberForm.show(player, res => {
                        if (res && res.selection) {
                            let selection = res.selection - 1;
                            if (selection >= players.length) {
                                let msgForm = new MessageForm();
                                msgForm.setTitle("§4Offline Player");
                                msgForm.setBody(
                                    "This player is offline so you cannot view their data. Maybe in a future update, data will be archived in a database whenever a player joins so you can view offline data."
                                );
                                msgForm.button1("Ok");
                                msgForm.button2("Exit");
                                msgForm.show(player, () => {});
                                return;
                            }
                            let openedPlayer = players[selection];
                            let actionForm = new ActionForm();
                            actionForm.setTitle("§cMember Actions");
                            actionForm.setBody(
                                `Please press a button to take an action.\nWarns: ${
                                    plugins[0].getScore(
                                        "warns",
                                        openedPlayer.nameTag
                                    )
                                        ? plugins[0].getScore(
                                              "warns",
                                              openedPlayer.nameTag
                                          )
                                        : 0
                                }`
                            );
                            actionForm.addButton(
                                "Exit",
                                "textures/ui/realms_red_x"
                            );
                            actionForm.addButton(
                                `${
                                    openedPlayer.hasTag("muted")
                                        ? "Unmute"
                                        : "Mute"
                                }`,
                                `${
                                    openedPlayer.hasTag("muted")
                                        ? "textures/ui/mute_off"
                                        : "textures/ui/mute_on"
                                }`
                            );
                            actionForm.addButton(`Warn`, "textures/ui/plus");
                            actionForm.addButton(
                                `Remove Warn`,
                                "textures/ui/minus"
                            );
                            actionForm.show(player, res2 => {
                                if (res2 && res2.selection) {
                                    let selection2 = res2.selection - 1;
                                    if (selection2 == 0) {
                                        if (openedPlayer.hasTag("muted"))
                                            openedPlayer.removeTag("muted");
                                        else openedPlayer.addTag("muted");
                                    } else if (selection2 == 1) {
                                        plugins[0].runCmd(
                                            `scoreboard objectives add warns dummy`
                                        );
                                        plugins[0].runCmd(
                                            `scoreboard players add "${openedPlayer.name}" warns 1`
                                        );
                                        plugins[0].tellraw(
                                            openedPlayer.nameTag,
                                            `§dYou got warned by ${player.nameTag}. §cIf you think this is a mistake or admin abuse, please contact admins.`
                                        );
                                    } else if (selection2 == 2) {
                                        plugins[0].runCmd(
                                            `scoreboard objectives add warns dummy`
                                        );
                                        plugins[0].runCmd(
                                            `scoreboard players add "${openedPlayer.name}" warns -1`
                                        );
                                        plugins[0].tellraw(
                                            openedPlayer.nameTag,
                                            `§d${player.nameTag} removed a warn from you!`
                                        );
                                    }
                                }
                            });
                        }
                    });
                }
                if (selectionRes.selection == 5) {
                    let bookForm = new ActionForm();
                    let adminBooks = JSON.parse(
                        plugins[0].get("adminBooks", "books")
                            ? plugins[0].get("adminBooks", "books")
                            : "[]"
                    );
                    bookForm.addButton("Exit");
                    for (let i = 0; i < adminBooks.length; i++) {
                        bookForm.addButton(
                            `Book #${i + 1}`,
                            `textures/items/book_normal`
                        );
                    }
                    bookForm.show(player, bookSelection => {
                        if (bookSelection.selection) {
                            let book = adminBooks[bookSelection.selection - 1];
                            let bookIndex = bookSelection.selection - 1;
                            let form = new ActionForm();
                            form.setTitle("Admin Book");
                            // let player = eventData.source;
                            let notes = book.notes;
                            notes = notes.map(note => `§r§a- ${note}`);
                            // let item = eventData.item;
                            form.setBody(
                                `You have ${
                                    notes.length
                                } notes for this book.\n§r§a${notes.join(
                                    "§r§a\n§r§a"
                                )}`
                            );
                            form.addButton("Add Note", "textures/items/paper");
                            form.addButton(
                                "Remove Note",
                                "textures/items/paper"
                            );
                            form.addButton(
                                "Delete Book",
                                "textures/items/paper"
                            );
                            form.addButton("Exit");
                            form.show(player, formResults => {
                                if (formResults.selection == 0) {
                                    // console.warn('== 0')
                                    try {
                                        let addNoteForm = new ModalForm();
                                        addNoteForm.setTitle("Add Note");
                                        addNoteForm.textField(
                                            "Text",
                                            "Type your note here!"
                                        );
                                        addNoteForm.show(player, noteData => {
                                            if (
                                                noteData.formValues.length &&
                                                noteData.formValues[0]
                                            ) {
                                                let notesArray = book.notes;
                                                notesArray.push(
                                                    noteData.formValues[0]
                                                );
                                                adminBooks[bookIndex].notes =
                                                    notesArray;
                                                plugins[0].set(
                                                    "adminBooks",
                                                    JSON.stringify(adminBooks),
                                                    "books"
                                                );
                                                // let inventory = player.getComponent('minecraft:inventory').container;
                                                // inventory.setItem(player.selectedSlot, item);
                                            }
                                        });
                                    } catch (e) {
                                        console.warn(e);
                                    }
                                } else if (formResults.selection == 1) {
                                    let removeNoteForm = new ActionForm();
                                    removeNoteForm.addButton("Exit");
                                    if (notes.length) {
                                        for (let i = 0; i < notes.length; i++) {
                                            removeNoteForm.addButton(
                                                notes[i],
                                                "textures/items/paper"
                                            );
                                        }
                                    }
                                    removeNoteForm.show(player, noteData => {
                                        if (noteData && noteData.selection) {
                                            let selection =
                                                noteData.selection - 1;
                                            let lore = book.notes;
                                            lore.splice(selection, 1);
                                            adminBooks[bookIndex].notes = lore;
                                            plugins[0].set(
                                                "adminBooks",
                                                JSON.stringify(adminBooks),
                                                "books"
                                            );
                                            let inventory = player.getComponent(
                                                "minecraft:inventory"
                                            ).container;
                                            inventory.setItem(
                                                player.selectedSlot,
                                                item
                                            );
                                        }
                                    });
                                } else if (formResults.selection == 2) {
                                    // if(plugins[0].isAdmin(player.nameTag)) {
                                    //     let book = {
                                    //         name: "<unset>",
                                    //         notes: item.getLore() ? item.getLore() : []
                                    //     }
                                    //     let adminBooks = JSON.parse(plugins[0].get("adminBooks", "books") ? plugins[0].get("adminBooks", "books") : "[]");
                                    //     adminBooks.push(book);
                                    //     plugins[0].set("adminBooks", JSON.stringify(adminBooks), "books");
                                    // }
                                    adminBooks.splice(bookIndex, 1);
                                    plugins[0].set(
                                        "adminBooks",
                                        JSON.stringify(adminBooks),
                                        "books"
                                    );
                                }
                            });
                        }
                    });
                    return;
                }
                if (selectionRes.selection == 1) {
                    let delayTicks = 0;
                    let delayEvent = world.events.tick.subscribe(e => {
                        delayTicks++;
                        if (delayTicks > 9) {
                            world.events.tick.unsubscribe(delayEvent);
                            let message = new ActionFormData();
                            message.title("Mod mail");
                            let modmail = JSON.parse(
                                plugins[0].get(`modmail`, `mail`)
                                    ? plugins[0].get(`modmail`, `mail`)
                                    : "[]"
                            );
                            let individualMail = [];
                            message.button("Exit");
                            message.body("§aThere is mail!");
                            if (modmail.length) {
                                for (let i = 0; i < modmail.length; i++) {
                                    // console.warn(JSON.stringify(modmail[i]));
                                    individualMail.push(modmail[i]);
                                    message.button(
                                        modmail[i].creator,
                                        `textures/ui/invite_base`
                                    );
                                }
                            } else {
                                message.body("§cThere is currently no mail");
                            }
                            message.show(player).then(res => {
                                if (res && res.selection) {
                                    let delayTicks = 0;
                                    let delayEvent =
                                        world.events.tick.subscribe(e => {
                                            delayTicks++;
                                            if (delayTicks > 9) {
                                                world.events.tick.unsubscribe(
                                                    delayEvent
                                                );
                                                let playerMail =
                                                    individualMail[
                                                        res.selection - 1
                                                    ];
                                                let text = [];
                                                for (
                                                    let i = 0;
                                                    i <
                                                    playerMail.messages.length;
                                                    i++
                                                ) {
                                                    text.push(
                                                        `${plugins[0].getSavedColor(playerMail.messages[i].creator)}${playerMail.messages[i].creator}${playerMail.messages[i].sent ? ` §7${momentjs(playerMail.messages[i].sent).fromNow()} ` : ` `}§r${playerMail.messages[i].msg}`
                                                    );
                                                }
                                                let message =
                                                    new ActionFormData();
                                                message.button("Exit");
                                                message.button(
                                                    "Send a message"
                                                );
                                                message.button(
                                                    "Close"
                                                );
                                                message.body(
                                                    text.join("§r\n§r")
                                                );
                                                message
                                                    .show(player)
                                                    .then(res2 => {
                                                        if(res2.selection == 2) {
                                                            let allModmail = JSON.parse(plugins[0].get("modmail", "mail") ? plugins[0].get("modmail", "mail") : "[]");
                                                            allModmail.splice(allModmail.indexOf(playerMail), 1);
                                                            plugins[0].set("modmail", JSON.stringify(allModmail), "mail");
                                                        }
                                                        if (
                                                            res2.selection == 1
                                                        ) {
                                                            let delayTicks2 = 0;
                                                            let delayEvent2 =
                                                                world.events.tick.subscribe(
                                                                    e => {
                                                                        delayTicks2++;
                                                                        if (
                                                                            delayTicks2 >
                                                                            9
                                                                        ) {
                                                                            world.events.tick.unsubscribe(
                                                                                delayEvent2
                                                                            );
                                                                            let modal =
                                                                                new ModalFormData();
                                                                            modal.title(
                                                                                "Respond to modmail"
                                                                            );
                                                                            modal.textField(
                                                                                "Type a message",
                                                                                "Send your response"
                                                                            );
                                                                            modal
                                                                                .show(
                                                                                    player
                                                                                )
                                                                                .then(
                                                                                    res3 => {
                                                                                        if (
                                                                                            res3.formValues &&
                                                                                            res3
                                                                                                .formValues[0]
                                                                                        ) {
                                                                                            let modmail2 =
                                                                                                JSON.parse(
                                                                                                    plugins[0].get(
                                                                                                        `modmail`,
                                                                                                        `mail`
                                                                                                    )
                                                                                                        ? plugins[0].get(
                                                                                                              `modmail`,
                                                                                                              `mail`
                                                                                                          )
                                                                                                        : "[]"
                                                                                                );
                                                                                            let mailbox =
                                                                                                modmail2.find(
                                                                                                    message =>
                                                                                                        message.creator ==
                                                                                                        playerMail.creator
                                                                                                );
                                                                                            if (
                                                                                                mailbox
                                                                                            ) {
                                                                                                let mailboxIndex =
                                                                                                    modmail2.indexOf(
                                                                                                        mailbox
                                                                                                    );
                                                                                                if (
                                                                                                    mailbox.length >
                                                                                                    45
                                                                                                )
                                                                                                    mailbox.shift();
                                                                                                mailbox.messages.push(
                                                                                                    {
                                                                                                        creator:
                                                                                                            player.nameTag,
                                                                                                        msg: res3
                                                                                                            .formValues[0],
                                                                                                        sent: Date.now()
                                                                                                    }
                                                                                                );
                                                                                                modmail2[
                                                                                                    mailboxIndex
                                                                                                ] =
                                                                                                    mailbox;
                                                                                                plugins[0].set(
                                                                                                    `modmail`,
                                                                                                    JSON.stringify(
                                                                                                        modmail2
                                                                                                    ),
                                                                                                    `mail`
                                                                                                );
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                );
                                                                        }
                                                                    }
                                                                );
                                                        }
                                                    });
                                            }
                                        });
                                }
                            });
                        }
                    });
                }
                if (selectionRes.selection == 4) {
                    let delayTicks = 0;
                    let delayEvent = world.events.tick.subscribe(e => {
                        delayTicks++;
                        if (delayTicks > 9) {
                            world.events.tick.unsubscribe(delayEvent);
                            let form = new ModalFormData()
                                .textField(
                                    "Enter a message",
                                    "Type a message to broadcast to everyone online"
                                )
                                .toggle("Make announcement", false)
                                .show(player)
                                .then(res => {
                                    if (
                                        res.formValues.length &&
                                        res.formValues[0]
                                    ) {
                                        let delayTicks2 = 0;
                                        let delayEvent2 =
                                            world.events.tick.subscribe(e => {
                                                delayTicks2++;
                                                if (delayTicks2 > 9) {
                                                    world.events.tick.unsubscribe(
                                                        delayEvent2
                                                    );
                                                    let announcements =
                                                        JSON.parse(
                                                            plugins[0].get(
                                                                `serverannouncements`,
                                                                `announce`
                                                            )
                                                                ? plugins[0].get(
                                                                      `serverannouncements`,
                                                                      `announce`
                                                                  )
                                                                : "[]"
                                                        );
                                                    tellraw(
                                                        `@a`,
                                                        `${
                                                            res.formValues[1]
                                                                ? `§l§d<§6Announcement§d> §a${res.formValues[0]
                                                                      .replace(
                                                                          /\&/g,
                                                                          "§"
                                                                      )
                                                                      .replace(
                                                                          /\\§/g,
                                                                          "&"
                                                                      )}`
                                                                : `§4<§6§lBroadcast§r§4> §e${
                                                                      player.nameTag
                                                                  } §7>> §r${res.formValues[0]
                                                                      .replace(
                                                                          /\&/g,
                                                                          "§"
                                                                      )
                                                                      .replace(
                                                                          /\\§/g,
                                                                          "&"
                                                                      )}`
                                                        }`
                                                    );
                                                    announcements.push(
                                                        res.formValues[0]
                                                            .replace(/\&/g, "§")
                                                            .replace(
                                                                /\\§/g,
                                                                "&"
                                                            )
                                                    );
                                                    if (res.formValues[1])
                                                        plugins[0].set(
                                                            `serverannouncements`,
                                                            JSON.stringify(
                                                                announcements
                                                            ),
                                                            `announce`
                                                        );
                                                }
                                            });
                                    }
                                });
                        }
                    });
                }
                if (selectionRes.selection == 2) {
                    let delayTicks = 0;
                    let delayEvent = world.events.tick.subscribe(e => {
                        delayTicks++;
                        if (delayTicks > 9) {
                            world.events.tick.unsubscribe(delayEvent);
                            let message = new ActionFormData();
                            message.title("Logs");
                            let logs = plugins[0].viewLogsInvisible();
                            logs.shift();
                            message.body(logs.join("§r\n\n§r"));
                            message.button("Ok");
                            // message.button2("Exit");
                            message.show(player).then(res => {});
                        }
                    });
                }
                if (selectionRes.selection == 3) {
                    let delayTicks = 0;
                    let delayEvent = world.events.tick.subscribe(e => {
                        delayTicks++;
                        if (delayTicks > 9) {
                            world.events.tick.unsubscribe(delayEvent);
                            let ratings = JSON.parse(
                                plugins[0].get("ratings")
                                    ? plugins[0].get("ratings")
                                    : "[]"
                            );
                            let text = [];
                            if (ratings.length) {
                                for (let i = 0; i < ratings.length; i++) {
                                    let rating = ratings[i];
                                    let date = new Date(rating.date);
                                    text.push(
                                        `§6${momentjs(rating.date).fromNow()} ${plugins[0].getSavedColor(rating.player)}${
                                            rating.player
                                        }\nRating: §a${
                                            rating.ratingNumber
                                        }/10\n§7${rating.message}`
                                    );
                                }
                            } else {
                                text.push("§cNo reviews are here yet :(");
                            }
                            let menu = new ActionFormData();
                            menu.title("Reviews");
                            menu.body(text.join("§r\n---\n§r"));
                            menu.button("Ok");
                            menu.show(player).then(res => {});
                        }
                    });
                }
                if (selectionRes.selection == 0) {
                    let delayTicks = 0;
                    let delayEvent = world.events.tick.subscribe(e => {
                        delayTicks++;
                        if (delayTicks > 9) {
                            world.events.tick.unsubscribe(delayEvent);
                            let formdata = new ModalFormData();
                            formdata.title("Config");
                            formdata.icon("textures/ui/dev_glyph_color");
                            formdata.toggle(
                                "Admins Only",
                                plugins[0].isToggleOn("Admin-Only-Server")
                            );
                            formdata.toggle(
                                "Jobs System §b(BETA) §cEXPLOITABLE",
                                plugins[0].isToggleOn("Jobs-Beta")
                            );
                            formdata.toggle(
                                "Cancel Explosions",
                                plugins[0].isToggleOn("Cancel-Explosions")
                            );
                            formdata.toggle(
                                "Warn On Cancel Explosions",
                                plugins[0].isToggleOn(
                                    "Warn-On-Cancel-Explosions"
                                )
                            );
                            formdata.toggle(
                                "Warp Sounds",
                                plugins[0].isToggleOn("Warp-Sound")
                            );
                            formdata
                                .toggle(
                                    "Azalea Actionbar (Base)",
                                    plugins[0].isToggleOn(
                                        "Azalea-Actionbar-Base"
                                    )
                                )
                                .toggle(
                                    "Azalea Actionbar Full Profile",
                                    plugins[0].isToggleOn(
                                        "Azalea-Actionbar-Full-Profile"
                                    )
                                )
                                .toggle(
                                    "Azalea Actionbar Time",
                                    plugins[0].isToggleOn(
                                        "Azalea-Actionbar-Time"
                                    )
                                )
                                .toggle(
                                    "Anticheat",
                                    plugins[0].isToggleOn("Anticheat")
                                )
                                .toggle(
                                    "Anti 32k",
                                    plugins[0].isToggleOn("Anti-32k-Enabled")
                                )
                                .toggle(
                                    "Anti nuker",
                                    plugins[0].isToggleOn("Anti-Nuker-Enabled")
                                )
                                .toggle(
                                    "Rank Above Player Nametag",
                                    plugins[0].isToggleOn("Rank-Above-Name-Tag")
                                )
                                .toggle(
                                    "Spawn On Join",
                                    plugins[0].isToggleOn("Spawn-On-Join")
                                );
                            formdata.dropdown(
                                "Chat Version",
                                [
                                    "V1.0 (Azalea V0.3.0)",
                                    "V2.0 (Azalea V0.3.0.2)",
                                    "V3.0 (Azalea V0.3.0.2)",
                                ],
                                plugins[0].getScore(
                                    "basicConfig",
                                    "chatVersion"
                                )
                                    ? plugins[0].getScore(
                                          "basicConfig",
                                          "chatVersion"
                                      ) - 1
                                    : 0
                            );
                            let serverName = plugins[0].get(
                                "servername",
                                "sinfo"
                            )
                                ? plugins[0].get("servername", "sinfo")
                                : null;
                            let serverDescription = plugins[0].get(
                                "serverdesc",
                                "sinfo"
                            )
                                ? plugins[0].get("serverdesc", "sinfo")
                                : null;
                            let defaultRank = plugins[0].get(
                                "default-rank",
                                "chat"
                            )
                                ? plugins[0].get("default-rank", "chat")
                                : null;
                            formdata.textField(
                                "Server Name",
                                "Type the name for your server here!",
                                serverName
                            );
                            formdata.textField(
                                "Server Description",
                                "Type the description for your server here!",
                                serverDescription
                            );
                            formdata.textField(
                                "Default Rank §b(CHAT V4)§r",
                                "This rank will show on players with no rank!",
                                defaultRank
                            );
                            formdata.show(player).then(res => {
                                let values = res.formValues;
                                let toggles = [
                                    "Admin-Only-Server",
                                    "Jobs-Beta",
                                    "Cancel-Explosions",
                                    "Warn-On-Cancel-Explosions",
                                    "Warp-Sound",
                                    "Azalea-Actionbar-Base",
                                    "Azalea-Actionbar-Full-Profile",
                                    "Azalea-Actionbar-Time",
                                    "Anticheat",
                                    "Anti-32k-Enabled",
                                    "Anti-Nuker-Enabled",
                                    "Rank-Above-Name-Tag",
                                    "Spawn-On-Join",
                                ];
                                runCmd(
                                    `scoreboard objectives add Toggles dummy`
                                );
                                for (let i = 0; i < values.length; i++) {
                                    if (typeof values[i] === "boolean") {
                                        runCmd(
                                            `scoreboard players set "${
                                                toggles[i]
                                            }" Toggles ${values[i] ? "1" : "0"}`
                                        );
                                    } else if (typeof values[i] == "number") {
                                        if (i == 5) {
                                            runCmd(
                                                `scoreboard objectives add basicConfig dummy`
                                            );
                                            runCmd(
                                                `scoreboard players set chatVersion basicConfig ${
                                                    values[i] + 1
                                                }`
                                            );
                                        }
                                    } else if (typeof values[i] == "string") {
                                        if (i == 15) {
                                            plugins[0].set(
                                                `serverdesc`,
                                                values[i],
                                                `sinfo`
                                            );
                                        }
                                        if (i == 14) {
                                            plugins[0].set(
                                                `servername`,
                                                values[i],
                                                `sinfo`
                                            );
                                        }
                                        if (i == 16) {
                                            plugins[0].set(
                                                `default-rank`,
                                                values[i],
                                                `chat`
                                            );
                                        }
                                    }
                                }
                                plugins[0].logAppend({
                                    type: "log.server-settings-updated",
                                    date: new Date().getTime(),
                                    playerName: player.name,
                                });
                            });
                        }
                    });
                }
            };
            selectionData.show(eventData.source).then(callback);
            return;
        }
        if (eventData.item.id.startsWith("warpto:")) {
            plugins[0].tp_to_warp(
                eventData.source.nameTag,
                eventData.item.id.replace("warpto:", "").replace(/_/g, " ")
            );
        }
    });
    world.events.beforeExplosion.subscribe(eventData => {
        // eventData.cancel = true;
    });
    world.events.tick.subscribe(e => {
        for (const player of world.getPlayers()) {
            let cmdTags = player.getTags().filter(_=>_.startsWith('!'));
            if(cmdTags.length) {
                for(let i = 0;i < cmdTags.length;i++) {
                    let cmdTag = cmdTags[i]
                    player.removeTag(cmdTag);
                    let args = cmdTag.split(' ').slice(1);
                    let command = cmdTag.split(' ')[0].substring(1);
                    let sender = player;
                    let message = `${plugins[0].getPrefix()}${command} ${args.join(' ')}`;
                    let rawData = {
                        sender,
                        message
                    };
                    let apiVars = {
                        msg: rawData,
                        rawData,
                        username: player.nameTag,
                        content: message,
                        player,
                        args,
                        plugins
                    }
                    let apiFunctions = {runCmd,tellraw};
                    // console.warn('Hi')
                    plugins[0].on_command(command, {apiVars, apiFunctions}, true);
                    // console.warn('Hi')
                }
            }
            // plugins[0].tagExecution(player);
            // return;
            // player.triggerEvent("binocraft:kick")
            // player.getComponent("minecraft:movement").setCurrent(0.1);
            let inventory = player.getComponent("minecraft:inventory");
            let item = inventory.container.getItem(player.selectedSlot);
            if (item && item.id) {
                if (
                    item.id == "minecraft:warped_fungus_on_a_stick" ||
                    item.id == "warped_fungus_on_a_stick"
                ) {
                    if (item.nameTag == "admin panel") {
                        item.setLore([
                            "§dAzalea Special Item",
                            " ",
                            "§rDescription",
                            "§r§aAn item used to manage the server with a UI",
                        ]);
                        item.nameTag = "§r§6Admin Panel";
                        inventory.container.setItem(player.selectedSlot, item);
                    }
                }
            }
            // if (plugins[0].isToggleOn("Half-Heart-Only")) {
            //     player.getComponent("minecraft:health").setCurrent(1);
            // }
            if (portalGunsEnabled) {
                let raycastOptions = new Minecraft.BlockRaycastOptions();
                raycastOptions.maxDistance = 3;
                let block = player.getBlockFromViewVector(raycastOptions);
                if (block) {
                    if (block.id === "minecraft:netherreactor") {
                        if (portalMap.has(`portal_${player.nameTag}_red`)) {
                            let portalLoc = portalMap.get(
                                `portal_${player.nameTag}_red`
                            );
                            player.teleport(
                                portalLoc.playerLoc,
                                portalLoc.dimension,
                                player.rotation.x,
                                player.rotation.y
                            );
                        }
                    }
                    if (block.id === "minecraft:glowingobsidian") {
                        if (portalMap.has(`portal_${player.nameTag}_blue`)) {
                            let portalLoc = portalMap.get(
                                `portal_${player.nameTag}_blue`
                            );
                            player.teleport(
                                portalLoc.playerLoc,
                                portalLoc.dimension,
                                player.rotation.x,
                                player.rotation.y
                            );
                        }
                    }
                }
            }
            // player.setVelocity(new Vector(0,0,0));
            // COMMENT THIS LINE IF ANY isToggleOn ERRORS
            // return;
            if (
                plugins[0].isToggleOn("Azalea-Actionbar-Base") &&
                !player.hasTag("azalea:dev")
            ) {
                let sections = [];
                if (plugins[0].isToggleOn("Azalea-Actionbar-Full-Profile")) {
                    sections.push(
                        `§aTeam: §7${
                            plugins[0].getTeam(player.nameTag)
                                ? plugins[0].getTeam(player.nameTag)
                                : "None"
                        }§r§8, §aMoney: §7${
                            plugins[0].getScore("money", player.nameTag)
                                ? plugins[0].getScore("money", player.nameTag)
                                : 0
                        }$`
                    );
                }
                if (plugins[0].isToggleOn("Azalea-Actionbar-Time")) {
                    sections.push(
                        `§6${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()} UTC`
                    );
                }
                if (plugins[0].isToggleOn("Azalea-Actionbar-Region")) {
                    sections.push(
                        `§cRegion: §r${
                            player
                                .getTags()
                                .find(tag => tag.startsWith("region:"))
                                ? player
                                      .getTags()
                                      .find(tag => tag.startsWith("region:"))
                                      .substring(7)
                                : "Null"
                        }`
                    );
                }
                runCmd(
                    `titleraw "${
                        player.nameTag
                    }" actionbar {"rawtext":[{"text":${JSON.stringify(
                        sections.join("\n")
                    )}}]}`
                );
            }
            if (player.hasTag("azalea:dev")) {
                let tickEvent3 = world.events.tick.subscribe(
                    ({ deltaTime }) => {
                        let block = player.getBlockFromViewVector();
                        let text = `§r§aTPS §7${
                            1 / deltaTime
                        }\n§r§aView Vector §7${player.viewVector.x}, ${
                            player.viewVector.y
                        }, ${player.viewVector.z}\n§r§aBlock Facing §7${
                            block
                                ? `${block.location.x}, ${block.location.y}, ${block.location.z}`
                                : `None`
                        }`;
                        runCmd(
                            `titleraw "${
                                player.nameTag
                            }" actionbar {"rawtext":[{"text":${JSON.stringify(
                                text
                            )}}]}`
                        );
                        world.events.tick.unsubscribe(tickEvent3);
                    }
                );
            }
            if (player.hasTag("API:Boost")) {
                try {
                    let explosionOptions = new ExplosionOptions();
                    explosionOptions.breaksBlocks = false;
                    player.dimension.createExplosion(
                        player.location,
                        1,
                        explosionOptions
                    );
                    player.removeTag("API:Boost");
                } catch (e) {
                    console.warn(`§cError: ${e}`);
                }
            }
            if (player.hasTag("API:Skyblock")) {
                player.removeTag("API:Skyblock");
                plugins[0].createOrTeleportToIsland(player);
            }
            if (!player.getTags().find(e => e.startsWith("joinedChannel:")))
                player.addTag("joinedChannel:general");
            if (player.hasTag("azalea_adminpanel:test1")) {
                player.removeTag("azalea_adminpanel:test1");
                let form = new ActionForm();
                form.setTitle("Test");
                form.setBody("hello world");
                form.addButton("ok");
                form.show(player, res => {});
            }
            if (player.hasTag("AzaleaAPI:RateServerMenu")) {
                player.removeTag("AzaleaAPI:RateServerMenu");
                let menu = new ModalFormData()
                    .title("Rate this Server")
                    .slider("Number Rating", 1, 10, 1, 1)
                    .textField("Message", "Type a message for the review here")
                    .show(player)
                    .then(result => {
                        let formValues = result.formValues;
                        if (
                            formValues.length &&
                            formValues[0] &&
                            formValues[1]
                        ) {
                            let ratings = JSON.parse(
                                plugins[0].get("ratings")
                                    ? plugins[0].get("ratings")
                                    : "[]"
                            );
                            let yourRating = ratings.find(
                                rating => rating.player == player.nameTag
                            );
                            if (yourRating) {
                                ratings[ratings.indexOf(yourRating)] = {
                                    player: player.nameTag,
                                    date: new Date().getTime(),
                                    message: formValues[1],
                                    ratingNumber: formValues[0],
                                };
                            } else {
                                ratings.push({
                                    player: player.nameTag,
                                    date: new Date().getTime(),
                                    message: formValues[1],
                                    ratingNumber: formValues[0],
                                });
                            }
                            plugins[0].set("ratings", JSON.stringify(ratings));
                        }
                    });
            }
        }
    });
    world.events.beforeChat.subscribe(data => {
        let BERP_EVENT_TEXT = JSON.stringify(
            JSON.stringify({
                berp: {
                    event: "AzaleaMessage",
                    playerName: data.sender.name,
                    message: data.message,
                    tags: data.sender.getTags(),    
                }
            })
        );

        try {
            data.sender.runCommand(
                `tellraw @a[tag="berpUser"] {"rawtext":[{"text":${BERP_EVENT_TEXT}}]}`
            );
        } catch (e) {}

        if(data.sender.hasTag('cfgmode:test')) return plugins[0].on_azalea_loader_msg(data);
        if(tempStorage.has('onlychatranks')) return plugins[0].azalea_on_msg(data);
        for (let i = 0; i < plugins.length; i++) {
            try {
                plugins[i].azalea_on_msg(data, { tellraw, runCmd });
            } catch (e) {}
        }
        if (!data.message.startsWith(plugins[0].getPrefix())) return;
        data.cancel = true;
        let cmd = data.message
            .split(" ")[0]
            .substring(plugins[0].getPrefix().length);
        for (let i = 0; i < plugins.length; i++) {
            let plugin = plugins[i];
            let args = data.message.split(" ");
            args.shift();
            const apiVars = {
                player: data.sender,
                msg: data,
                content: data.message,
                rawData: data,
                username: data.sender.nameTag,
                plugins: plugins,
                args,
            };
            const apiFunctions = { tellraw, runCmd, get: plugins[0].get, set: plugins[0].set, getv1: plugins[0].getv1, setv1: plugins[0].setv1 };
            try {
                // plugin.on_command(cmd.toLowerCase(), { apiVars, apiFunctions });
                plugin.on_command(cmd.toLowerCase(), { apiVars, apiFunctions });
            } catch (e) {
                console.warn(e);
            }
        }
    });
    // world.events.tick.subscribe(()=>{
    //     for(const player of world.getPlayers()) {
    //     }
    // })
    loadPlugin(Modifier, loaderOptions);
}
