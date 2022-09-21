import { azalea } from "../azalea.js";
import { AAPI } from "../important/api.js";
import {sendChatMessage} from '../utils/functions/chat.js';
import MS from '../important/ms.js';

azalea.registerCommand({
    name: "fake-chat-msg"
}, class extends AAPI {
    constructor() {
        super();
    }
    isNum(val){
        return !isNaN(val)
    }
    call(vars, fns) {
        let msg = sendChatMessage({
            ranks: ["§aAzalea"],
            nameTag: "HelperBot",
            message: "Hey, I just wanted to mention that the prefix for azalea is actually §6! §rhere"
        });
        this.tellraw(vars.username, msg);
    }
});