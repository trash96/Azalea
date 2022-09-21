import {Items, ItemStack, MinecraftEnchantmentTypes} from 'mojang-minecraft';
export class Item {
    constructor(id, item = null) {
        if(item) this.item = item;
        else this.item = new ItemStack(Items.get(id), 1, 0);
    }
    set data(data) {
        this.item.data = data;
    }
    get data() {
        return this.item.data;
    }
    set name(name) {
        this.item.nameTag = `§r${name}`;
    }
    get name() {
        return this.item.nameTag;
    }
    set lore(lore) {
        if (lore instanceof Array) {
            this.item.setLore(lore);
        }
        else {
            this.item.setLore(lore.split(/\\n/g));
        }
    }
    get lore() {
        return this.item.getLore();
    }
    set amount(amount) {
        this.item.amount = amount;
    }
    get amount() {
        return this.item.amount;
    }
    addEnchant(enchant) {
        const enchs = this.item.getComponent('enchantments'), enchComp = enchs.enchantments;
        // @ts-ignore
        enchComp.addEnchantment(new Enchantment(MinecraftEnchantmentTypes[enchant.enchant], enchant.level));
        enchs.enchantments = enchComp;
    }
}
export class ConvItem {
    constructor(item) {
        this.item = item;
        this.enchantments = this.parseEnchants(this.item) ? this.parseEnchants(this.item) : [];
        this.item_ = new Item(null, this.item);
        this.id = item.id ? item.id : "";
        this.amount = this.item_.amount ? this.item_.amount : 1;
        this.lore = this.item_.lore ? this.item_.lore : [];
        this.nameTag = this.item_.name;
        this.data = this.item_.data ? this.item_.data : 0;
    }
    parseEnchants(item) {
        let itemEnchantments = item.getComponent("enchantments").enchantments;
        // let allEnchantments2 = Array.from(allEnchantments);
        let allEnchantments = Object.values(MinecraftEnchantmentTypes);
        let enchants = [];
        for (let ench of allEnchantments) {
            // let enchantment = allEnchantments.getEnchantment(ench);
            // let enchantment = ench;
            if (itemEnchantments.hasEnchantment(ench)) {
                let enchantment = itemEnchantments.getEnchantment(ench);
                // console.warn(`${enchantment.level}, ${enchantment.type.id}`);
                enchants.push({
                    level: enchantment.level,
                    enchant: enchantment.type.id,
                });
            }
        }
        return enchants.length ? enchants : null;
    }
}