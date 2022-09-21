import { AAPI } from "../../important/api";

let api = new AAPI();

export function commandType(commandArray, commandName) {
    let cmdTags = JSON.parse(this.get(`cmdtags`, `cmdtags`) ? this.get(`cmdtags`, `cmdtags`) : "[]");
    if(cmdTags.find(_=>_.cmd == commandName)) return "command tag"
    else if(!commandArray.find(_=>_.name==commandName)) return "unknown"
    else if(commandArray.find(_=>_.name==commandName).callback) return "modern"
    else return "legacy";
}