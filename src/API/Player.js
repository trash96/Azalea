import * as mc from "mojang-minecraft";
class Player {
    constructor(player) {
        this.player = player;
    }
    getInventoryContainer() {
        return this.player.getComponent("minecraft:inventory").container;
    }
    getDimension() {
        let dimensions = [
            mc.world.getDimension("overworld"),
            mc.world.getDimension("nether"),
            mc.world.getDimension("the end"),
        ];
        return dimensions.indexOf(this.player.dimension);
    }
    getHoldingItem() {
        let inventory = this.getInventoryContainer();
        return inventory.getItem(this.player.selectedSlot);
    }
    isAdmin() {
        return (
            this.player.hasTag("v") ||
            this.player.hasTag("admin") ||
            this.player.hasTag("staff") ||
            this.player.hasTag("mod") ||
            this.player.hasTag("moderator") ||
            this.player.hasTag("owner") ||
            this.player.hasTag("manager")
        );
    }
}
