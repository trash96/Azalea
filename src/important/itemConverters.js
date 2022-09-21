import {MinecraftEnchantmentTypes, ItemStack, Items} from 'mojang-minecraft';
/**
 * 
 * @param {{name?: string, lore?: string[], id?: string, amount?: number, data?: number, enchants?: {id: string, level: number}[]}} json ...something
 * @returns {ItemStack} item 
 */
export function jsonToItem(json) {
    const item = new ItemStack(Items.get(json.id ?? 'minecraft:air'), json.amount ?? 1, json.data ?? 0)
    if (!"id" in json) return item
    if ("name" in json) item.nameTag = json.name
    if ("lore" in json) item.setLore(json.lore)
    if (json.enchants) {
        const enchComp = item.getComponent('enchantments')
        const enchList = enchComp.enchantments
        for (const ench of json.enchants) {
            enchList.addEnchantment(new Enchantment(MinecraftEnchantmentTypes[ench.id], ench.level))
        }
        enchComp.enchantments = enchList
    }
    return item
}
/**
 * 
 * @param {ItemStack} item 
 * @returns {{name?: string, lore?: string[], id?: string, amount?: number, data?: number, enchants?: {id: string, level: number}[]}} ...something
 */
export function itemToJson(item) {
    /**
     * @type {{name?: string, lore?: string[], id?: string, amount?: number, data?: number, enchants?: {id: string, level: number}[]}}
     */
    const returnObject = {}
    if (item?.nameTag) returnObject["name"] = item.nameTag
    if (item?.id) returnObject['id'] = item.id
    if (item?.getLore()) returnObject['lore'] = item.getLore()
    if (item?.amount) returnObject['amount'] = item.amount
    if (item?.data) returnObject['data'] = item.data
    if (item?.hasComponent('enchantments')) for (const _ench in MinecraftEnchantmentTypes) {
        const ench = item?.getComponent('enchantments').enchantments.getEnchantment(MinecraftEnchantmentTypes[_ench])
        if (!ench) continue
        const e = returnObject['enchants'] ?? []
        e.push({ id: ench.type.id, level: ench.level })
        returnObject['enchants'] = e
    }
    return returnObject
}
