import { AAPI } from "../important/api.js";

let api = new AAPI

export function warpPermissionHandler( {handler = null, name = null} = {}, player ) {
    if(handler && name && player && player.hasTag(`wperm.${name}`)) return true;
    return false;
}

export function warpCreationHandler( { name, x, y, z, dimension }) {
    let dimensions = ['overworld','end','nether'];
    if(name && x && y && z && dimension && dimensions.includes(dimension)) {
        let scname = `WARP${name}`;
        api.runCmd(`scoreboard objectives add ${scname} dummy`);
        api.runCmd(`scoreboard players set x ${scname} ${Math.trunc(x)}`);
        api.runCmd(`scoreboard players set y ${scname} ${Math.trunc(y)}`);
        api.runCmd(`scoreboard players set z ${scname} ${Math.trunc(z)}`);
        api.runCmd(`scoreboard players set dimension ${scname} ${dimensions.indexOf(dimension)}`);
    }
}