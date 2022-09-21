import * as mc from "mojang-minecraft";
export function spawnPlayerInventoryOnGround(player, x, y, z) {
    let inventory = player.getComponent("minecraft:inventory").container;
    let loc = new mc.Location(x, y, z);
    let size = inventory.size;
    for (let i = 0; i < size; i++) {
        try {
            let item = inventory.getItem(i);
            if (item) mc.world.getDimension("overworld").spawnItem(item, loc);
        } catch (e) {}
    }
}
export function giveUnobtainableItems(player) {
    let inventory = player.getComponent("minecraft:inventory").container;
    let items = [
        mc.MinecraftItemTypes.stonecutter,
        mc.MinecraftItemTypes.lava,
        mc.MinecraftItemTypes.fire,
        mc.MinecraftItemTypes.water,
        mc.MinecraftItemTypes.netherreactor,
        mc.MinecraftItemTypes.glowingobsidian,
        mc.MinecraftItemTypes.invisibleBedrock,
        mc.MinecraftItemTypes.camera,
        mc.MinecraftItemTypes.reserved6,
        mc.MinecraftItemTypes.infoUpdate,
        mc.MinecraftItemTypes.infoUpdate2,
        mc.MinecraftItemTypes.portal,
        mc.MinecraftItemTypes.endPortal,
        mc.MinecraftItemTypes.endGateway,
        mc.MinecraftItemTypes.soulFire,
        mc.MinecraftItemTypes.stickyPistonArmCollision,
        mc.MinecraftItemTypes.redstoneWire,
        mc.MinecraftItemTypes.litFurnace,
        mc.MinecraftItemTypes.litBlastFurnace,
    ];
    for (let i = 0; i < items.length; i++) {
        inventory.addItem(new mc.ItemStack(items[i], 1, 0));
    }
}
export function rainItems(x, y, z) {
    let loc = new mc.Location(x, y, z);
    mc.world.events.tick.subscribe(e => {
        let items = [
            mc.MinecraftItemTypes.diamond,
            mc.MinecraftItemTypes.goldIngot,
            mc.MinecraftItemTypes.ironIngot,
            mc.MinecraftItemTypes.copperIngot,
            mc.MinecraftItemTypes.emerald,
            mc.MinecraftItemTypes.candleCake,
            mc.MinecraftItemTypes.water,
            mc.MinecraftItemTypes.lava,
            mc.MinecraftItemTypes.fire,
            mc.MinecraftItemTypes.camera,
            mc.MinecraftItemTypes.enderPearl,
            mc.MinecraftItemTypes.netherreactor,
            mc.MinecraftItemTypes.stonecutter,
            mc.MinecraftItemTypes.glowingobsidian,
            mc.MinecraftItemTypes.bowl,
            mc.MinecraftItemTypes.bow,
            mc.MinecraftItemTypes.ironSword,
            mc.MinecraftItemTypes.greenDye,
            mc.MinecraftItemTypes.dirt,
            mc.MinecraftItemTypes.stone,
            mc.MinecraftItemTypes.netheriteIngot,
            mc.MinecraftItemTypes.netheriteScrap,
            mc.MinecraftItemTypes.blueDye,
            mc.MinecraftItemTypes.apple,
            mc.MinecraftItemTypes.goldenApple,
        ];

        mc.world
            .getDimension("overworld")
            .spawnItem(
                new mc.ItemStack(
                    items[Math.floor(Math.random() * items.length)],
                    1,
                    0
                ),
                loc
            );
        mc.world
            .getDimension("overworld")
            .spawnItem(
                new mc.ItemStack(
                    items[Math.floor(Math.random() * items.length)],
                    1,
                    0
                ),
                loc
            );
        mc.world
            .getDimension("overworld")
            .spawnItem(
                new mc.ItemStack(
                    items[Math.floor(Math.random() * items.length)],
                    1,
                    0
                ),
                loc
            );
        mc.world
            .getDimension("overworld")
            .spawnItem(
                new mc.ItemStack(
                    items[Math.floor(Math.random() * items.length)],
                    1,
                    0
                ),
                loc
            );
        mc.world
            .getDimension("overworld")
            .spawnItem(
                new mc.ItemStack(
                    items[Math.floor(Math.random() * items.length)],
                    1,
                    0
                ),
                loc
            );
        mc.world
            .getDimension("overworld")
            .spawnItem(
                new mc.ItemStack(
                    items[Math.floor(Math.random() * items.length)],
                    1,
                    0
                ),
                loc
            );
        mc.world
            .getDimension("overworld")
            .spawnItem(
                new mc.ItemStack(
                    items[Math.floor(Math.random() * items.length)],
                    1,
                    0
                ),
                loc
            );
        mc.world
            .getDimension("overworld")
            .spawnItem(
                new mc.ItemStack(
                    items[Math.floor(Math.random() * items.length)],
                    1,
                    0
                ),
                loc
            );
        mc.world
            .getDimension("overworld")
            .spawnItem(
                new mc.ItemStack(
                    items[Math.floor(Math.random() * items.length)],
                    1,
                    0
                ),
                loc
            );
        mc.world
            .getDimension("overworld")
            .spawnItem(
                new mc.ItemStack(
                    items[Math.floor(Math.random() * items.length)],
                    1,
                    0
                ),
                loc
            );
        mc.world
            .getDimension("overworld")
            .spawnItem(
                new mc.ItemStack(
                    items[Math.floor(Math.random() * items.length)],
                    1,
                    0
                ),
                loc
            );
        mc.world
            .getDimension("overworld")
            .spawnItem(
                new mc.ItemStack(
                    items[Math.floor(Math.random() * items.length)],
                    1,
                    0
                ),
                loc
            );
        mc.world
            .getDimension("overworld")
            .spawnItem(
                new mc.ItemStack(
                    items[Math.floor(Math.random() * items.length)],
                    1,
                    0
                ),
                loc
            );
        mc.world
            .getDimension("overworld")
            .spawnItem(
                new mc.ItemStack(
                    items[Math.floor(Math.random() * items.length)],
                    1,
                    0
                ),
                loc
            );
        mc.world
            .getDimension("overworld")
            .spawnItem(
                new mc.ItemStack(
                    items[Math.floor(Math.random() * items.length)],
                    1,
                    0
                ),
                loc
            );
        mc.world
            .getDimension("overworld")
            .spawnItem(
                new mc.ItemStack(
                    items[Math.floor(Math.random() * items.length)],
                    1,
                    0
                ),
                loc
            );
        mc.world
            .getDimension("overworld")
            .spawnItem(
                new mc.ItemStack(
                    items[Math.floor(Math.random() * items.length)],
                    1,
                    0
                ),
                loc
            );
        mc.world
            .getDimension("overworld")
            .spawnItem(
                new mc.ItemStack(
                    items[Math.floor(Math.random() * items.length)],
                    1,
                    0
                ),
                loc
            );
        mc.world
            .getDimension("overworld")
            .spawnItem(
                new mc.ItemStack(
                    items[Math.floor(Math.random() * items.length)],
                    1,
                    0
                ),
                loc
            );
        mc.world
            .getDimension("overworld")
            .spawnItem(
                new mc.ItemStack(
                    items[Math.floor(Math.random() * items.length)],
                    1,
                    0
                ),
                loc
            );
        mc.world
            .getDimension("overworld")
            .spawnItem(
                new mc.ItemStack(
                    items[Math.floor(Math.random() * items.length)],
                    1,
                    0
                ),
                loc
            );
        mc.world
            .getDimension("overworld")
            .spawnItem(
                new mc.ItemStack(
                    items[Math.floor(Math.random() * items.length)],
                    1,
                    0
                ),
                loc
            );
        mc.world
            .getDimension("overworld")
            .spawnItem(
                new mc.ItemStack(
                    items[Math.floor(Math.random() * items.length)],
                    1,
                    0
                ),
                loc
            );
        mc.world
            .getDimension("overworld")
            .spawnItem(
                new mc.ItemStack(
                    items[Math.floor(Math.random() * items.length)],
                    1,
                    0
                ),
                loc
            );
        mc.world
            .getDimension("overworld")
            .spawnItem(
                new mc.ItemStack(
                    items[Math.floor(Math.random() * items.length)],
                    1,
                    0
                ),
                loc
            );
        mc.world
            .getDimension("overworld")
            .spawnItem(
                new mc.ItemStack(
                    items[Math.floor(Math.random() * items.length)],
                    1,
                    0
                ),
                loc
            );
        mc.world
            .getDimension("overworld")
            .spawnItem(
                new mc.ItemStack(
                    items[Math.floor(Math.random() * items.length)],
                    1,
                    0
                ),
                loc
            );
        mc.world
            .getDimension("overworld")
            .spawnItem(
                new mc.ItemStack(
                    items[Math.floor(Math.random() * items.length)],
                    1,
                    0
                ),
                loc
            );
        mc.world
            .getDimension("overworld")
            .spawnItem(
                new mc.ItemStack(
                    items[Math.floor(Math.random() * items.length)],
                    1,
                    0
                ),
                loc
            );
        mc.world
            .getDimension("overworld")
            .spawnItem(
                new mc.ItemStack(
                    items[Math.floor(Math.random() * items.length)],
                    1,
                    0
                ),
                loc
            );
        mc.world
            .getDimension("overworld")
            .spawnItem(
                new mc.ItemStack(
                    items[Math.floor(Math.random() * items.length)],
                    1,
                    0
                ),
                loc
            );
        mc.world
            .getDimension("overworld")
            .spawnItem(
                new mc.ItemStack(
                    items[Math.floor(Math.random() * items.length)],
                    1,
                    0
                ),
                loc
            );
        mc.world
            .getDimension("overworld")
            .spawnItem(
                new mc.ItemStack(
                    items[Math.floor(Math.random() * items.length)],
                    1,
                    0
                ),
                loc
            );
    });
    mc.world.events.tick.subscribe(e => {
        let items = [
            mc.MinecraftItemTypes.diamond,
            mc.MinecraftItemTypes.goldIngot,
            mc.MinecraftItemTypes.ironIngot,
            mc.MinecraftItemTypes.copperIngot,
            mc.MinecraftItemTypes.emerald,
            mc.MinecraftItemTypes.candleCake,
            mc.MinecraftItemTypes.water,
            mc.MinecraftItemTypes.lava,
            mc.MinecraftItemTypes.fire,
            mc.MinecraftItemTypes.camera,
            mc.MinecraftItemTypes.enderPearl,
            mc.MinecraftItemTypes.netherreactor,
            mc.MinecraftItemTypes.stonecutter,
            mc.MinecraftItemTypes.glowingobsidian,
            mc.MinecraftItemTypes.bowl,
            mc.MinecraftItemTypes.bow,
            mc.MinecraftItemTypes.ironSword,
            mc.MinecraftItemTypes.greenDye,
            mc.MinecraftItemTypes.dirt,
            mc.MinecraftItemTypes.stone,
            mc.MinecraftItemTypes.netheriteIngot,
            mc.MinecraftItemTypes.netheriteScrap,
            mc.MinecraftItemTypes.blueDye,
            mc.MinecraftItemTypes.apple,
            mc.MinecraftItemTypes.goldenApple,
        ];

        mc.world
            .getDimension("overworld")
            .spawnItem(
                new mc.ItemStack(
                    items[Math.floor(Math.random() * items.length)],
                    1,
                    0
                ),
                loc
            );
        mc.world
            .getDimension("overworld")
            .spawnItem(
                new mc.ItemStack(
                    items[Math.floor(Math.random() * items.length)],
                    1,
                    0
                ),
                loc
            );
        mc.world
            .getDimension("overworld")
            .spawnItem(
                new mc.ItemStack(
                    items[Math.floor(Math.random() * items.length)],
                    1,
                    0
                ),
                loc
            );
        mc.world
            .getDimension("overworld")
            .spawnItem(
                new mc.ItemStack(
                    items[Math.floor(Math.random() * items.length)],
                    1,
                    0
                ),
                loc
            );
        mc.world
            .getDimension("overworld")
            .spawnItem(
                new mc.ItemStack(
                    items[Math.floor(Math.random() * items.length)],
                    1,
                    0
                ),
                loc
            );
        mc.world
            .getDimension("overworld")
            .spawnItem(
                new mc.ItemStack(
                    items[Math.floor(Math.random() * items.length)],
                    1,
                    0
                ),
                loc
            );
        mc.world
            .getDimension("overworld")
            .spawnItem(
                new mc.ItemStack(
                    items[Math.floor(Math.random() * items.length)],
                    1,
                    0
                ),
                loc
            );
        mc.world
            .getDimension("overworld")
            .spawnItem(
                new mc.ItemStack(
                    items[Math.floor(Math.random() * items.length)],
                    1,
                    0
                ),
                loc
            );
        mc.world
            .getDimension("overworld")
            .spawnItem(
                new mc.ItemStack(
                    items[Math.floor(Math.random() * items.length)],
                    1,
                    0
                ),
                loc
            );
        mc.world
            .getDimension("overworld")
            .spawnItem(
                new mc.ItemStack(
                    items[Math.floor(Math.random() * items.length)],
                    1,
                    0
                ),
                loc
            );
        mc.world
            .getDimension("overworld")
            .spawnItem(
                new mc.ItemStack(
                    items[Math.floor(Math.random() * items.length)],
                    1,
                    0
                ),
                loc
            );
        mc.world
            .getDimension("overworld")
            .spawnItem(
                new mc.ItemStack(
                    items[Math.floor(Math.random() * items.length)],
                    1,
                    0
                ),
                loc
            );
        mc.world
            .getDimension("overworld")
            .spawnItem(
                new mc.ItemStack(
                    items[Math.floor(Math.random() * items.length)],
                    1,
                    0
                ),
                loc
            );
        mc.world
            .getDimension("overworld")
            .spawnItem(
                new mc.ItemStack(
                    items[Math.floor(Math.random() * items.length)],
                    1,
                    0
                ),
                loc
            );
        mc.world
            .getDimension("overworld")
            .spawnItem(
                new mc.ItemStack(
                    items[Math.floor(Math.random() * items.length)],
                    1,
                    0
                ),
                loc
            );
        mc.world
            .getDimension("overworld")
            .spawnItem(
                new mc.ItemStack(
                    items[Math.floor(Math.random() * items.length)],
                    1,
                    0
                ),
                loc
            );
        mc.world
            .getDimension("overworld")
            .spawnItem(
                new mc.ItemStack(
                    items[Math.floor(Math.random() * items.length)],
                    1,
                    0
                ),
                loc
            );
        mc.world
            .getDimension("overworld")
            .spawnItem(
                new mc.ItemStack(
                    items[Math.floor(Math.random() * items.length)],
                    1,
                    0
                ),
                loc
            );
        mc.world
            .getDimension("overworld")
            .spawnItem(
                new mc.ItemStack(
                    items[Math.floor(Math.random() * items.length)],
                    1,
                    0
                ),
                loc
            );
        mc.world
            .getDimension("overworld")
            .spawnItem(
                new mc.ItemStack(
                    items[Math.floor(Math.random() * items.length)],
                    1,
                    0
                ),
                loc
            );
        mc.world
            .getDimension("overworld")
            .spawnItem(
                new mc.ItemStack(
                    items[Math.floor(Math.random() * items.length)],
                    1,
                    0
                ),
                loc
            );
        mc.world
            .getDimension("overworld")
            .spawnItem(
                new mc.ItemStack(
                    items[Math.floor(Math.random() * items.length)],
                    1,
                    0
                ),
                loc
            );
        mc.world
            .getDimension("overworld")
            .spawnItem(
                new mc.ItemStack(
                    items[Math.floor(Math.random() * items.length)],
                    1,
                    0
                ),
                loc
            );
        mc.world
            .getDimension("overworld")
            .spawnItem(
                new mc.ItemStack(
                    items[Math.floor(Math.random() * items.length)],
                    1,
                    0
                ),
                loc
            );
        mc.world
            .getDimension("overworld")
            .spawnItem(
                new mc.ItemStack(
                    items[Math.floor(Math.random() * items.length)],
                    1,
                    0
                ),
                loc
            );
        mc.world
            .getDimension("overworld")
            .spawnItem(
                new mc.ItemStack(
                    items[Math.floor(Math.random() * items.length)],
                    1,
                    0
                ),
                loc
            );
        mc.world
            .getDimension("overworld")
            .spawnItem(
                new mc.ItemStack(
                    items[Math.floor(Math.random() * items.length)],
                    1,
                    0
                ),
                loc
            );
        mc.world
            .getDimension("overworld")
            .spawnItem(
                new mc.ItemStack(
                    items[Math.floor(Math.random() * items.length)],
                    1,
                    0
                ),
                loc
            );
        mc.world
            .getDimension("overworld")
            .spawnItem(
                new mc.ItemStack(
                    items[Math.floor(Math.random() * items.length)],
                    1,
                    0
                ),
                loc
            );
        mc.world
            .getDimension("overworld")
            .spawnItem(
                new mc.ItemStack(
                    items[Math.floor(Math.random() * items.length)],
                    1,
                    0
                ),
                loc
            );
        mc.world
            .getDimension("overworld")
            .spawnItem(
                new mc.ItemStack(
                    items[Math.floor(Math.random() * items.length)],
                    1,
                    0
                ),
                loc
            );
        mc.world
            .getDimension("overworld")
            .spawnItem(
                new mc.ItemStack(
                    items[Math.floor(Math.random() * items.length)],
                    1,
                    0
                ),
                loc
            );
        mc.world
            .getDimension("overworld")
            .spawnItem(
                new mc.ItemStack(
                    items[Math.floor(Math.random() * items.length)],
                    1,
                    0
                ),
                loc
            );
    });
}
