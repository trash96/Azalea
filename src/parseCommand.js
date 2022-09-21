export function parseCommand(msg, plugins, prefix) {
    let sections = msg.message.split(" --> ");
    for (let i = 0; i < sections.length; i++) {
        let args = sections[i].split(" ");
        args.shift();
        let player = msg.sender;
        let cmd = sections[i].split(" ")[0].substring(prefix.length);
        plugins.forEach(plugin => {
            try {
                output = plugin.commands[cmd];
            } catch (e) {
                output = null;
            }
        });
        return {
            extendedApiVars: {
                player,
                args,
            },
        };
    }
}
