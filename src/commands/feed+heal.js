import { azalea } from "../azalea.js";
import { AAPI } from "../important/api.js";

azalea.registerCommand({
    name: "feed",
    category: "Utilities"
}, class extends AAPI {
    constructor() {
        super();
    }
    call(vars,fns) {
        if(!vars.player.hasTag('admin')) return this.tellraw(vars.username, `§cYou cant solve world hunger without admin!`)
        this.runCmd(`effect "${vars.username}" saturation 1 255 true`);
    }
})

azalea.registerCommand({
    name: "heal",
    category: "Utilities"
}, class extends AAPI {
    constructor() {
        super();
    }
    call(vars,fns) {
        if(!vars.player.hasTag('admin')) return this.tellraw(vars.username, `§cYou cant afford the hospital bill without admin!`);
        this.runCmd(`effect "${vars.username}" regeneration 2 255 true`);
    }
})