import { ActionForm, ModalForm, MessageForm } from "../API/Forms.js";
import { azalea } from "../azalea.js";
import { AAPI } from "../important/api.js";
import { itemToJson, jsonToItem } from "../important/itemConverters.js";
import * as mc from "mojang-minecraft";
import { tempStorage } from "../memoryMap.js";
let storagePrefix = `yesno-`
mc.world.events.tick.subscribe(()=>{
    let keys = tempStorage.keys();
    for(const player of mc.world.getPlayers()) {
        for(let i = 0;i < keys.length;i++) {
            let key = keys[i];
            let yesnoDialog = tempStorage.get(key);
            let {title, description} = yesnoDialog;
            if(player.hasTag(`ui-yesno:${key.substring(storagePrefix.length)}`)) {
                player.removeTag(`ui-yesno:${key.substring(storagePrefix.length)}`);
                let messageForm = new MessageForm();
                messageForm.button1("Yes")
                messageForm.button2("No");
                messageForm.setBody(description);
                messageForm.setTitle(title);
                messageForm.show(player, res=>{
                    if(!res.isCanceled) {
                        if(res.selectionData) player.addTag(`yesno:${key.substring(storagePrefix.length)}-no`);
                        else player.addTag(`yesno:${key.substring(storagePrefix.length)}-yes`);
                    }
                })
            }
        }    
    }
})
azalea.registerCommand(
  {
    name: "yesno",
    category: "UI",
  },
  class extends AAPI {
    constructor() {
      super();
    }
    call(vars, fns, { subcommand }) {
        let args = vars.args
        .join(" ")
        .trim()
        .match(/"[^"]+"|[^\s]+/g)
        .map(e => e.replace(/"(.+)"/, "$1"));

    if(args[0]) {
        let id = args[1];
        let title = args[2];
        let description = args[3];
        tempStorage.set(`${storagePrefix}${id}`, {title,description})
        }
    }
  }
);
