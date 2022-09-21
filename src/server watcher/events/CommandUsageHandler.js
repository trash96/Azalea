import { addToData, getData } from "../serverWatcher.js";

export function commandUsageHandler(event) {
    addToData(4,event.player)
}