// import { azalea } from "../azalea.js";
// import { AAPI } from "../important/api.js";

// azalea.registerCommand({
//     name: "dbget",
//     category: "Utilities"
// }, class extends AAPI {
//     constructor() {
//         super();
//     }
//     call(vars,fns) {
//         if(!vars.player.hasTag('admin')) return this.tellraw(vars.username, `§cYou cant solve world hunger without admin!`)
//         this.runCmd(`effect "${vars.username}" saturation 1 255 true`);
//     }
// })