import * as mc from 'mojang-minecraft';
import { AAPI } from '../important/api.js';

export function getAnalytics() {
    let api = new AAPI();
    let objectives = mc.world.scoreboard.getObjectives().filter(_=>_.displayName.startsWith('DAT')).map(_=>_.displayName);
    if(typeof objectives === "string") objectives = [objectives];
    console.warn(objectives);
    let analyticsData = new Map();
    for(let i = 0;i < objectives.length;i++) {
        let objective = objectives[i];
        let date = objective.split('.')[1].replace(/\//g,"_");
        let dataTypeID = objective.split('.')[0].substring('DAT'.length);
        if(!analyticsData.has(date)) analyticsData.set(date, [])
        let analyticsArray = analyticsData.get(date);
        analyticsArray.push({
            id: dataTypeID,
            date,
            value: api.getScoreQ(objective, "TOTAL") ?? 0
        });
        analyticsData.set(date, analyticsArray);
    }
    return analyticsData;
}