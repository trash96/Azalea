class Events {
    constructor() {
        this._events = [];
    }
    on(name, fn) {
        this._events.push({
            name,
            listenerFunction: fn,
        });
    }
    emit(name, ...data) {
        this._events.forEach(event => {
            if (event.name !== name) return;
            return event.listenerFunction(...data);
        });
    }
}
export let events = new Events();
