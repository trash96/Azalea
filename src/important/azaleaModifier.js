import { Features } from "./features.js";

export class Modifier extends Features {
    constructor(loaderOptions) {
        super(loaderOptions);
    }
    azaleaVersion(apiVars, apiFns) {
        const { username } = apiVars;
        let major = this.getScore("AzlVersion", "major")
                ? this.getScore("AzlVersion", "major")
                : 0,
            minor = this.getScore("AzlVersion", "minor")
                ? this.getScore("AzlVersion", "minor")
                : 0,
            micro = this.getScore("AzlVersion", "minor")
                ? this.getScore("AzlVersion", "micro")
                : 0,
            nano = this.getScore("AzlVersion", "minor")
                ? this.getScore("AzlVersion", "nano")
                : 0,
            beta = this.getScore("AzlVersion", "minor")
                ? this.getScore("AzlVersion", "beta")
                : 0;
        let version = `${major}.${minor}.${micro}.${nano}${
            beta ? `b${beta}` : ``
        }`;
        this.tellraw(
            username,
            `§4<-=-=- §3§lAzalea Version Info §r§4-=-=->\n§6Version: §r§f${version} (Beta)\n§r§6API Version: §r§f1.0.1\n§r§6Plugin Support: §r§aYes\n\n§dUsing official azalea modifier script`
        );
    }
}
