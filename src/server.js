import * as mc from "mojang-minecraft";
import { events } from "./events.js";
class Server {
    constructor() {
        this.version = 1.0;
        mc.world.events.beforeChat.subscribe(e => events.emit("beforeChat", e));
        mc.world.events.chat.subscribe(e => events.emit("chat", e));
        mc.world.events.playerJoin.subscribe(e => {
            if (
                e.player.hasTag("admin") ||
                e.player.hasTag("v") ||
                e.player.hasTag("staff")
            )
                events.emit("adminJoined", e);
            else events.emit("memberJoined", e);
            events.emit("playerJoined", e);
        });
    }
}
