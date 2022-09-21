// import {claims} from '@mcbeutils/claimapi';
// import { client, azalea } from '../azalea.js';
// import {AAPI} from '../important/api.js';
// azalea.registerCommand({
//     name: 'createclaim',
//     description: 'Create a claim'
// }, class extends AAPI {
//     constructor() {
//         super();
//     }
//     call(vars, fns) {
//         const claim = claims.createClaim(vars.username);
//         this.tellraw(vars.username, `Successfully created your claim at x: ${claim.x} z: ${claim.z}`);
//     }
// })
// claims.on('ClaimCreated', data=> {

// })
// claims.on('EnteredClaim', (data)=>{
//     data.player.sendActionbar(`You have entered ${data.claim.owner}'s claim.`)
// })
// claims.on('LeftClaim', (data)=> {
//     data.player.sendActionbar(`You have left ${data.claim.owner}'s claim`)
// })
// claims.on('InteractionBlocked', (data)=> {
//     data.player.sendActionbar('You do not have permission to do that action.');
// })
// claims.on('BlockDestoryedBlocked',(data)=>{
//     data.player.sendActionbar('You do not have permission to do that action.')
// })