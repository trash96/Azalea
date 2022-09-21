import * as mc from "mojang-minecraft";
class Timing {
    constructor() {
        this.tickIntervalMap = new Map();
        this.tickTimeoutMap = new Map();
    }
    tickInterval(callback, interval) {
        let ticks = 0;
        mc.world.events.tick.subscribe(() => {
            ticks++;
            if (ticks > interval - 1) {
                callback();
                ticks = 0;
            }
        });
    }
    tickTimeout(callback, interval) {
        let ticks = 0;
        let timeoutEvent = mc.world.events.tick.subscribe(() => {
            ticks++;
            if (ticks > interval - 1) {
                callback();
                mc.world.events.tick.unsubscribe(timeoutEvent);
            }
        });
    }
}
export const timing = new Timing();
