import { ActionForm, ModalForm } from "../API/Forms.js";
import { azalea } from "../azalea.js";
import { AAPI } from "../important/api.js";
import { itemToJson, jsonToItem } from "../important/itemConverters.js";
import * as mc from 'mojang-minecraft';
azalea.registerCommand({
    name: "test1"
},class extends AAPI {
    constructor() {
        super();
    }
    call(vars,fns) {
        let loc = vars.player.location;
        let tickEvent1 = mc.world.events.tick.subscribe(()=> {
            if(loc.x != vars.player.location.x || loc.y != vars.player.location.y || loc.z != vars.player.location.z) {
                mc.world.events.tick.unsubscribe(tickEvent1);
    let form = new ActionForm();
    form.setTitle('Guilds §5§l[BETA]')
    form.setBody('Time to ditch \\chat!');
    form.addButton('Create a Guild');
    form.addButton('Join a Guild');
    form.addButton('Enter a Guild');
    form.addButton('All Guilds');
    form.show(vars.player,(res)=>{

    })
}
        })
    }
})
azalea.registerCommand({
    name: "shop",
    category: "Economy"
}, class extends AAPI {
    constructor() {
        super();
    }
    call(vars,fns,{subcommand}) {
        let inventory = vars.player.getComponent('minecraft:inventory').container;
        let holding = inventory.getItem(vars.player.selectedSlot);
        let shop = JSON.parse(this.get(`shopitems`, `shop`) ? this.get(`shopitems`, `shop`) : `[]`);
        let setFn = this.set,
            getFn = this.get;
        if(subcommand && subcommand === "edit") {
            let editForm = new ActionForm();
            for(let i = 0;i < shop.length;i++) {
                editForm.addButton(`${shop[i].name ? shop[i].name : shop[i].id} *${shop[i].amount ? shop[i].amount : 1}\n§a$${shop[i].price}`);
            }
            editForm.addButton(`Add Item`);
            let loc = vars.player.location;
            let tickEvent1 = mc.world.events.tick.subscribe(()=> {
                if(loc.x != vars.player.location.x || loc.y != vars.player.location.y || loc.z != vars.player.location.z) {
                    mc.world.events.tick.unsubscribe(tickEvent1);
                    editForm.show(vars.player, (data)=> {
                        if(data.selection == shop.length) {
                            let addForm = new ModalForm();
                            addForm.textField(`Price`, `Enter an amount here!`);
                            addForm.show(vars.player, res=> {
                                if(res.formValues[0] && /^[0-9]+$/.test(res.formValues[0])) {
                                    let itemJson = itemToJson(holding);
                                    if(!Object.keys(itemJson).length) return;
                                    itemJson.price = parseInt(res.formValues[0]);
                                    shop.push(itemJson);
                                    console.warn('hi')
                                    let api = new AAPI();
                                    api.set(`shopitems`, JSON.stringify(shop), `shop`);
                                    return;
                                }
                                console.warn('hi2')

                            })
                        } else {
                            let itemForm = new ActionForm();
                            itemForm.addButton('Delete');
                            itemForm.show(vars.player, res=>{
                                let api = new AAPI();
                                shop.splice(data.selection, 1);
                                api.set(`shopitems`, JSON.stringify(shop), `shop`);
                            })
                        }
                    })
                }
            })
        } else {
            let shopForm = new ActionForm();
            for(let i = 0;i < shop.length;i++) {
                shopForm.addButton(`${shop[i].name ? shop[i].name : shop[i].id} *${shop[i].amount ? shop[i].amount : 1}\n§a$${shop[i].price}`);
            }
            let loc = vars.player.location;
            let tickEvent1 = mc.world.events.tick.subscribe(()=> {
                if(loc.x != vars.player.location.x || loc.y != vars.player.location.y || loc.z != vars.player.location.z) {
                    mc.world.events.tick.unsubscribe(tickEvent1);
                    shopForm.show(vars.player, (data)=> {
                        if(data.isCanceled) return;

                        let api = new AAPI();
                        let money = api.getScoreQ(`money`, vars.player.nameTag) ? api.getScoreQ(`money`, vars.player.nameTag) : 0;
                        if(money >= shop[data.selection].price) {
                            money -= shop[data.selection].price;
                            api.runCmd(`scoreboard players set "${vars.player.nameTag}" money ${money}`);
                            let item = jsonToItem(shop[data.selection]);
                            inventory.addItem(item);
                        } else {
                            let error = new ActionForm();
                            error.setBody(`§cYou do not have enough money!`);
                            error.addButton(`k`);
                            error.show(vars.player,(d)=>{

                            })
                        }
                    });
                }
            });

        }
    }
})
