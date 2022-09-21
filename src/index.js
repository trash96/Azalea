// Config
// NOTE: Most of these settings are a concept and have not been implemented yet, if you change something and it does nothing then don't ask me whats wrong with it, I just store ideas for settings here.
import { load } from "./important/parserScript.js";
import * as en_us from "./languages/en_us/dialog.js";
import * as utils from "./trashlibazalea/utils.js";
import "./Anticheat/antinuker.js";
import "./Anticheat/anti32k.js";
import "./Anticheat/speedprotection.js";
import "./Anticheat/functionEvent.js";
import "./Modules/fakeNametag.js";
import * as minecraft from "mojang-minecraft";
import * as gametest from "mojang-gametest";
import * as mcUI from "mojang-minecraft-ui";
minecraft.world.events.worldInitialize.subscribe(e=>{
    try {
        const { propertyRegistry } = e;
        let propertyDefinition = new minecraft.DynamicPropertiesDefinition()
        let tables = 13;
        let main = 9900
        // propertyDefinition.defineString("rules", Math.floor(main/tables))
        // propertyDefinition.defineString("sinfo", Math.floor(main/tables))
        // propertyDefinition.defineString("misc", Math.floor(main/tables))
        // propertyDefinition.defineString("default", Math.floor(main/tables))
        // propertyDefinition.defineString("logs", Math.floor(main/tables))
        // propertyDefinition.defineString("chat", Math.floor(main/tables))
        // propertyDefinition.defineString("shop", Math.floor(main/tables))
        // propertyDefinition.defineString("cmdtags", Math.floor(main/tables))
        // propertyDefinition.defineString("config", Math.floor(main/tables))
        // propertyDefinition.defineString("config2", Math.floor(main/tables))
        // propertyDefinition.defineString("friends", Math.floor(main/tables))
        // propertyDefinition.defineString("announce", Math.floor(main/tables))
        // propertyDefinition.defineString("notes", Math.floor(main/tables))
        propertyDefinition.defineString("db", 9996)

        propertyRegistry.registerWorldDynamicProperties(propertyDefinition);

    } catch(e) {
        console.warn(e);
    }
})
// import './Anticheat/namespoof.js';
let config = {
    ingameconfig: {
        helpcmdlines: 15,
    },
    lib: {},
    mods: [],
};
config.language = en_us;
config.lib.utils = utils;
load(config);
export const loaderOptions = config;
