export function sendChatMessage({
    ranks = [],
    channel = null,
    nameTag = "AutomatedMessage",
    message = "404NoMessage"
} = {}) {
    let rankText = `${ranks.length ?
        `§8§l[§r${ranks.join('§r§7, §r')}§8§l]§r` : ``}`;
    let nametagColor = `§7`;
    if(ranks.length) {
        for(let i = 0;i < ranks.length;i++) {
            if(nametagColor != "§7") break;
            if(ranks[i].startsWith('§')) nametagColor = `§${ranks[i][1]}`;
        }
    }
    let nametagText = `${nametagColor}${nameTag} >`;
    let messageText = `§r${message}`;
    return `${rankText ? `${rankText} ` : ``}${nametagText ? `${nametagText} ` : ``}${messageText}`;
}