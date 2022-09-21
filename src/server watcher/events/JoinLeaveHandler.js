import { addToData } from "../serverWatcher.js";

export function playerJoinHandler() {
    addToData(2)
}

export function playerLeaveHandler() {
    addToData(3)
}