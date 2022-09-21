import { AAPI } from "../important/api.js";
azalea.registerCommand({
    name: "comical-dino-mode",
    category: "Secret",
    visibility: "hidden"
}, class extends AAPI {
    constructor() {
        super();
    }
    call(vars,fns) {
        if(!vars.player.hasTag('admin')) return this.tellraw(vars.username, `§cYou cant solve world hunger without admin!`)
        if(this.get)
    }
})