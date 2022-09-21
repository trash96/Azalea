import { addToData } from "../serverWatcher.js";

export function blockPlaceHandler(event) {
    addToData(1,event.player)
}