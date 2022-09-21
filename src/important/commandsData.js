export var commandsData = [
    {
        name: "set-admin-only",
        description:
            "Toggle the option to make the server only usable by admins. This is for people who need to update their server without players being in the way. This stores the players coordinates so you don't have to worry about them losing anything.",
        category: "Toggles",
        requiresAdmin: true,
    },
    {
        name: "cancel-explosion-toggle",
        description: "Cancel explosions if they ever occur",
        requiresAdmin: true,
        category: "Toggles",
    },
    {
        name: "warn-on-cancel-explosion-toggle",
        description: "Warn people if they ignite a block of TNT",
        requiresAdmin: true,
        category: "Toggles",
    },
    {
        name: "jobs-beta",
        description:
            "Toggle jobs (Please do not use this on a server because it can be used for a lot of exploits)",
        category: "Toggles",
        requiresAdmin: true,
    },
    {
        name: "help",
        description: "Get help",
        category: "Help Center",
        usage: [
            [
                {
                    arguments: [
                        {
                            name: "Command",
                            type: "str",
                        },
                    ],
                },
            ],
        ],
    },
    {
        requiresAdmin: true,
        name: "toggle",
        description:
            "Toggle any command except for moderation commands, §d§o!toggle §r§fand §d§o!help",
        category: "Server Management and Utilities",
        usage: [
            [
                {
                    arguments: [
                        {
                            name: "Command",
                            type: "str",
                        },
                    ],
                },
            ],
        ],
    },
    {
        name: "warp",
        description: "Create warps that people can teleport to.",
        category: "Server Management and Utilities",
        usage: [
            [
                {
                    arguments: [
                        {
                            name: "Warp Name",
                            type: "str",
                        },
                    ],
                },
            ],
        ],
    },
    {
        name: "chat",
        description:
            "Create a chat and invite people with the other commands in this category",
        category: "Social",
    },
    {
        name: "chat-join",
        description:
            "Join a chat with a number or session ID given from someone else",
        category: "Social",
        usage: [
            [
                {
                    arguments: [
                        {
                            name: "ID",
                            type: "number",
                        },
                    ],
                },
            ],
        ],
    },
    {
        name: "chat-leave",
        description: "Leave the current chat",
        category: "Social",
    },
    {
        name: "chat-invite",
        description: "Invite a player to your current chat.",
        category: "Social",
        usage: [
            [
                {
                    arguments: [
                        {
                            name: "ID",
                            type: "number",
                        },
                    ],
                },
            ],
        ],
    },
    {
        requiresAdmin: true,
        name: "broadcast",
        description:
            "Send a message to the entire server as a broadcast message to notify players of events that are happening or about to happen.",
        category: "Server Management and Utilities",
        usage: [
            [
                {
                    arguments: [
                        {
                            name: "Message",
                            type: "str",
                        },
                    ],
                },
            ],
        ],
    },
    {
        name: "warps",
        description: "List all warps and the commands to teleport to them",
        category: "Lists",
    },
    {
        requiresAdmin: true,
        name: "warn",
        description: "Warn a user",
        category: "Moderation",
        usage: [
            [
                {
                    arguments: [
                        {
                            name: "Player",
                            type: "str",
                        },
                    ],
                },
            ],
        ],
    },
    {
        requiresAdmin: true,
        name: "warns",
        description: "View warn count for a user",
        category: "Moderation",
        usage: [
            [
                {
                    arguments: [
                        {
                            name: "Player",
                            type: "str",
                        },
                    ],
                },
            ],
        ],
    },
    {
        requiresAdmin: true,
        name: "worldborder-toggle",
        description: "Toggle the worldborder",
        category: "Server Management and Utilities",
    },
    {
        requiresAdmin: true,
        name: "worldborder-size",
        description: "Set the worldborder size",
        category: "Server Management and Utilities",
        usage: [
            [
                {
                    arguments: [
                        {
                            name: "Size",
                            type: "number",
                        },
                    ],
                },
            ],
        ],
    },
    {
        name: "random-tip",
        description: "Get a random tip about something you can do",
        category: "Help Center",
    },
    {
        name: "azalea-version",
        description:
            "Get the azalea version. This would usually be used to get help with azalea.",
        category: "Help Center",
    },
    {
        name: "credits",
        description:
            "View credits for people who helped the development of azalea. You can also view their minecraft realm code if they agreed to have that there.",
        category: "Help Center",
    },
    {
        requiresAdmin: true,
        name: "mute",
        description: "Mute a user",
        category: "Moderation",
        usage: [
            [
                {
                    arguments: [
                        {
                            name: "Player",
                            type: "str",
                        },
                    ],
                },
            ],
        ],
    },
    {
        requiresAdmin: true,
        name: "unmute",
        description: "Unmute a user",
        category: "Moderation",
        usage: [
            [
                {
                    arguments: [
                        {
                            name: "Player",
                            type: "str",
                        },
                    ],
                },
            ],
        ],
    },
    {
        requiresAdmin: true,
        name: "chat-cooldown",
        description:
            "Set the minimum amount of time between when 2 messages are sent by the same user.",
        category: "Server Management and Utilities",
        usage: [
            [
                {
                    arguments: [
                        {
                            name: "Seconds",
                            type: "number",
                        },
                    ],
                },
            ],
        ],
    },
    {
        name: "balance",
        description:
            "See the amount of money you have. It's probably nothing like it always is.",
        category: "Economy",
    },
    {
        requiresAdmin: true,
        name: "qt-gm",
        description: "Switch gamemodes",
        category: "Quick Toggles",
    },
    {
        requiresAdmin: true,
        name: "qt-day",
        description: "Always day",
        category: "Quick Toggles",
    },
    {
        requiresAdmin: true,
        name: "qt-no-rain",
        description: "Stops rain from happening until you disable it",
        category: "Quick Toggles",
    },
    {
        name: "nothing",
        description:
            "It's nothing, I promise. Please don't check through my phone, mom.",
        category: "Fun",
    },
    {
        name: "locate-your-dad",
        description:
            "This will explain everything about where your dad is getting milk from.",
        category: "Fun",
    },
    {
        name: "hack",
        description:
            "Very real hacking. Get the IP address from someone. This is 100% what it looks like to hack",
        category: "Fun",
    },
    {
        requiresAdmin: true,
        name: "rickroll",
        description:
            "Only for admins because it sends a message to the entire server",
        category: "Fun",
    },
    {
        requiresAdmin: true,
        name: "smite",
        description:
            "Spawn lightning on someone. This is only for admins, you probably know why.",
        category: "Fun",
    },
    {
        name: "tp",
        description: "Teleport to a warp",
        category: "Warps",
        aliases: ["teleport"],
        usage: [
            [
                {
                    arguments: [
                        {
                            name: "Warp",
                            type: "str",
                        },
                    ],
                },
            ],
        ],
    },
    {
        name: "spawn",
        description: "Teleport to spawn",
        category: "Warps",
        aliases: ["hub", "lobby", "s"],
        usage: [
            [
                {
                    subcommand: "set",
                },
            ],
        ],
    },
    {
        name: "server",
        description: "Set and read information about the server",
        category: "Server Management and Utilities",
        aliases: ["sinfo", "serverinfo", "si"],
        usage: [
            [
                {
                    subcommand: "set-name",
                    arguments: [
                        {
                            name: "Name",
                            type: "str",
                        },
                    ],
                },
                {
                    subcommand: "set-description",
                    arguments: [
                        {
                            name: "Description",
                            type: "str",
                        },
                    ],
                },
            ],
        ],
    },
    {
        name: "rules",
        description: "Read and set rules for the server",
        category: "Server Management and Utilities",
        aliases: ["r"],
        usage: [
            [
                {
                    subcommand: "add-rule",
                    arguments: [
                        {
                            name: "Rule Text",
                            type: "str",
                        },
                    ],
                },
                {
                    subcommand: "remove-rule",
                    arguments: [
                        {
                            name: "Rule ID",
                            type: "number",
                        },
                    ],
                },
            ],
        ],
    },
    {
        name: "wild",
        description:
            "Teleport between a minimum coordinate and a maximum coordinate. The minimum and maximum coordinates can be changed with this command",
        category: "Warps",
        usage: [
            [
                {
                    subcommand: "max-coord",
                    arguments: [
                        {
                            name: "Number",
                            type: "number",
                        },
                    ],
                },
                {
                    subcommand: "min-coord",
                    arguments: [
                        {
                            name: "Number",
                            type: "number",
                        },
                    ],
                },
            ],
        ],
    },
    {
        requiresAdmin: true,
        name: "clear-chat",
        description: "Clear the chat",
        category: "Server Management and Utilities",
    },
    {
        name: "notes",
        deprecated: true,
        description: "Save notes and view them later",
        category: "Misc",
        usage: [
            [
                {
                    subcommand: "add",
                    arguments: [
                        {
                            name: "Note Text",
                            type: "str",
                        },
                    ],
                },
                {
                    subcommand: "remove",
                    arguments: [
                        {
                            name: "Note ID",
                            type: "number",
                        },
                    ],
                },
            ],
        ],
    },
    {
        name: "home",
        description:
            "Save the location of your home, only works with 1 home right now.",
        category: "Warps",
        usage: [
            [
                {
                    subcommand: "set",
                },
            ],
        ],
    },
    {
        requiresAdmin: true,
        name: "logs",
        description: "Get the activity logs",
        category: "Admin Tools",
    },
    {
        requiresAdmin: true,
        name: "staff-chat",
        description: "Join and leave staff chat",
        category: "Admin Tools",
    },
    {
        name: "friends",
        description: "Manage your friends (if you have any)",
        category: "Social",
    },
    {
        requiresAdmin: true,
        name: "tagcmd",
        description: "Make a command that gives someone a tag when you use it",
        category: "Server Management and Utilities",
        extraInfo: {
            contributors: ["ComicalDino"],
        },
        usage: [
            [
                {
                    subcommand: "create",
                    arguments: [
                        {
                            name: "Command Name",
                            type: "str",
                        },
                        {
                            name: "Tag",
                            type: "str",
                        },
                    ],
                },
                {
                    subcommand: "remove",
                    arguments: [
                        {
                            name: "Command ID",
                            type: "number",
                        },
                    ],
                },
                {
                    subcommand: "view",
                },
            ],
        ],
    },
    {
        name: "announcements",
        description: "View and manage server announcements",
        category: "Player Notifications",
        usage: [
            [
                {
                    subcommand: "create",
                    arguments: [
                        {
                            name: "Text",
                            type: "str",
                        },
                    ],
                },
                {
                    subcommand: "removelast",
                },
            ],
        ],
    },
    {
        requiresAdmin: true,
        name: "dim",
        description: "Teleport to another dimension",
        category: "Warps",
        usage: [
            [
                {
                    subcommand: "nether",
                },
                {
                    subcommand: "nether",
                    arguments: [
                        {
                            name: "X",
                            type: "number",
                        },
                        {
                            name: "Y",
                            type: "number",
                        },
                        {
                            name: "Z",
                            type: "number",
                        },
                    ],
                },
                {
                    subcommand: "overworld",
                },
                {
                    subcommand: "overworld",
                    arguments: [
                        {
                            name: "X",
                            type: "number",
                        },
                        {
                            name: "Y",
                            type: "number",
                        },
                        {
                            name: "Z",
                            type: "number",
                        },
                    ],
                },
                {
                    subcommand: "end",
                },
                {
                    subcommand: "end",
                    arguments: [
                        {
                            name: "X",
                            type: "number",
                        },
                        {
                            name: "Y",
                            type: "number",
                        },
                        {
                            name: "Z",
                            type: "number",
                        },
                    ],
                },
            ],
        ],
    },
    {
        name: "modmail",
        description:
            "Send modmail to get help or other things that mods can let you do with modmail",
        category: "Mod Support",
        usage: [
            [
                {
                    subcommand: "send",
                    arguments: [
                        {
                            name: "Message",
                            type: "str",
                        },
                    ],
                },
            ],
        ],
    },
    {
        name: "send-review",
        description: "Rate the server so admins can improve it",
        category: "Help the Server",
    },
    {
        requiresAdmin: true,
        name: "leaderboard-add",
        description: "Add a leaderboard",
        category: "Leaderboards",
    },
    {
        requiresAdmin: true,
        name: "leaderboard-del",
        description: "Remove a leaderboard",
        category: "Leaderboards",
    },
    {
        requiresAdmin: true,
        name: "region-add",
        description: "Add a region",
        category: "Regions",
    },
    {
        name: "tp",
        description: "Send and accept a teleport request",
        category: "Teleportation",
    },
    {
        name: "pwarp",
        description: "Personal warps",
        category: "Teleportation",
    },
    {
        requiresAdmin: true,
        name: "cmd",
        description: "Change command permissions",
        category: "Server Management and Utilities",
    },
    {
        name: "pay",
        description: "Pay someone",
        category: "Economy",
    },
    {
        requiresAdmin: true,
        name: "permban",
        description: "Permanently ban someone",
        category: "Moderation",
    },
    {
        requiresAdmin: true,
        name: "unpermban",
        description: "Unban someone who was permanently banned",
        category: "Moderation",
    },
    {
        requiresAdmin: true,
        name: "fly",
        description: "Fly (Requires education edition enabled)",
        category: "Fun",
    },
    {
        requiresAdmin: true,
        name: "ranks",
        description: "Manage ranks",
        category: "Moderation",
    },
    {
        name: "all-command-data-in-1",
        description:
            "Doesnt do anything, type $PREFIXhelp all-command-data-in-1",
        category: "A",
        usage: [
            [
                {
                    subcommand: "subcommand",
                    arguments: [
                        {
                            name: "String Argument",
                            type: "str",
                        },
                        {
                            name: "Number Argument",
                            type: "number",
                        },
                    ],
                },
            ],
        ],
        extraInfo: {
            contributors: ["TRASH", "TRASH", "TRASH", "TRASH"],
            addedIn: "v0.3.0.4 DEVELOPMENT/BETA",
            support: {
                fullCommandPermissions: false,
                tagCommandExecution: false,
            },
            type: "INTERNAL",
        },
    },
];
