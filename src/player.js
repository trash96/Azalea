export class Player {
    constructor(player) {
        this.player = player;
    }
    getInventory() {
        return this.player.getComponent("minecraft:inventory").container;
    }
    getItems() {
        let inventory = this.getInventory();
        let items = [];
        for (let i = 0; i < inventory.size; i++) {
            let item = inventory.getItem(i);
            if (item && item.id) items.push(item);
            else items.push(null);
        }
        return items;
    }
}
