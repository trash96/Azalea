class AzaleaConfig {
    constructor() {
        this.configMap = new Map();
    }
    set(key, val) {
        this.configMap.set(key, val);
    }
    keys() {
        return this.configMap.keys();
    }
    delete(key) {
        this.configMap.delete(key);
    }
    get(key) {
        return this.configMap.has(key) ? this.configMap.get(key) : null;
    }
    has(key) {
        return this.configMap.has(key);
    }
}
