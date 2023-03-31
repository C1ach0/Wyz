const Discord = require("discord.js");
const fs = require('fs');
const wait = require("node:timers/promises").setTimeout;

class Client {
    /**
     * Init bot connection to discord.js
     * @param {{token: string, prefix: string, owners: ?[], guild: ?string, log: ?boolean, foldersName: ?{commands: string, slash: string, events: string, interactions: string}}} opt Options for start bot.
     * @return {Discord.Client} Client
    */
    constructor(opt) {
        this.client = new Discord.Client({
            intents: 3276799,
            partials: [
                Discord.Partials.Channel,
                Discord.Partials.GuildMember,
                Discord.Partials.GuildScheduledEvent,
                Discord.Partials.Message,
                Discord.Partials.Reaction,
                Discord.Partials.ThreadMember,
                Discord.Partials.User
            ],
        });
        this.client.commands = new Discord.Collection();
        this.client.slash = new Discord.Collection();
        this.client.interactions = new Discord.Collection();
        this.client.events = new Discord.Collection();
        this.client.snipe = new Discord.Collection();
        this.client.invites = new Discord.Collection();
        this.client.others = new Discord.Collection();
        this.client.prefix = opt.prefix;
        this.client.owners = opt?.owners || [];
        this.client.testingServerID = opt?.guild;
        this.client.log = opt?.log || false;
        this.client.slashFolder = opt?.foldersName?.slash;
        if (opt.log) this.client.on('ready', () => {
            console.log(`
[2;33m[1;33m-------------------------------------------
[0m[2;33m[0m[2;36m[${new Date().toLocaleString()}][0m
-> Logged in as ${this.client.user.tag}!
[0;2m[0m[2;33m-------------------------------------------[0m`);
        });
        this.client.login(opt.token);
        //this.client.on('message', this.handleCommand.bind(this));
        if (opt.foldersName) {
            if (opt.foldersName.commands) {
                if (fs.existsSync(!`${process.cwd()}/${opt.foldersName.commands}`)) throw new Error(`The path to the folder with commands is not correct!\nPath : ${process.cwd()}/${opt.foldersName.commands}`)
                fs.readdirSync(`${process.cwd()}/${opt.foldersName.commands}`).forEach(f => {
                    this.createCommand(require(`${process.cwd()}/${opt.foldersName.commands}/${f}`)).then(opt.log ? console.log : "")
                })
            }
            if (opt.foldersName.slash) {
                if (fs.existsSync(!`${process.cwd()}/${opt.foldersName.slash}`)) throw new Error(`The path to the folder with slash commands is not correct!\nPath : ${process.cwd()}/${opt.foldersName.slash}`)
                fs.readdirSync(`${process.cwd()}/${opt.foldersName.slash}`).forEach(f => {
                    this.createSlash(require(`${process.cwd()}/${opt.foldersName.slash}/${f}`)).then(opt.log ? console.log : "")
                })
            }
            if (opt.foldersName.events) {
                if (fs.existsSync(!`${process.cwd()}/${opt.foldersName.events}`)) throw new Error(`The path to the folder with events is not correct!\nPath : ${process.cwd()}/${opt.foldersName.events}`)
                fs.readdirSync(`${process.cwd()}/${opt.foldersName.events}`).forEach(f => {
                    this.createEvent(require(`${process.cwd()}/${opt.foldersName.events}/${f}`)).then(opt.log ? console.log : "")
                })
            }
            if (opt.foldersName.interactions) {
                if (fs.existsSync(!`${process.cwd()}/${opt.foldersName.interactions}`)) throw new Error(`The path to the folder with interactions is not correct!\nPath : ${process.cwd()}/${opt.foldersName.interactions}`)
                fs.readdirSync(`${process.cwd()}/${opt.foldersName.interactions}`).forEach(f => {
                    this.createInteraction(require(`${process.cwd()}/${opt.foldersName.interactions}/${f}`)).then(opt.log ? console.log : "")
                })
            }
        }
    }

    /**
     * Create commands using prefix
     * @param {{name: string, description: ?string, usage: ?string, aliases: ?string[], category: string, inDev: boolean, enabled: boolean, run: Function}} opt Options for creating command.
    */
    createCommand(opt) {
        this.client.commands.set(opt.name, {
            name: opt.name,
            description: opt.description || "No description provided.",
            usage: opt.usage || "No usage provided.",
            aliases: opt.aliases || [],
            category: opt.category || "General",
            dev: opt.inDev || false,
            enabled: opt.enabled || true,
            run: opt.run
        });
        return new Promise((resolve, reject) => {
            resolve(`Command [2;31m${opt.name}[0m created success !`);
        });
    }

    /**
     * Create slash commands
     * @param {{name: string, description: ?string, type: string | number, options: ?[], enabled: boolean, run: Function}} opt Options for creating slash command.
    */
    createSlash(opt) {
        this.client.slash.set(opt.name, {
            name: opt.name,
            description: opt.description || "No description provided.",
            type: opt.type || 1,
            options: opt.options || [],
            enabled: opt.enabled || true,
            run: opt.run
        });
        return new Promise((resolve, reject) => {
            resolve(`Slash Command [2;31m${opt.name}[0m created success !`);
        });
    }

    /**
    * Create events 
    * @param {{name: string, event: string, enabled: boolean, run: Function}} opt Options for creating event.
   */
    createEvent(opt) {
        if (!opt.event) throw new Error("Please provide an discord event.")
        this.client.events.set(opt.name, {
            event: opt.event,
            enabled: opt.enabled || true,
            run: opt.run
        });
        return new Promise((resolve, reject) => {
            resolve(`Event [2;31m${opt.name}[0m created success !`);
        });
    }

    /**
    * Create interactions using prefix
    * @param {{name: string, type: string, enabled: boolean, run: Function}} opt Options for creating interaction.
   */
    createInteraction(opt) {
        if (!opt.type) throw new Error("Please provide an interaction type.")
        this.client.interactions.set(opt.name, {
            category: opt.type,
            enabled: opt.enabled || true,
            run: opt.run
        });
        return new Promise((resolve, reject) => {
            resolve(`Interaction [2;31m${opt.name}[0m created success !`);
        });
    }

    /**
     * @param {Wyz.Client} app
     * @param {Discord.Message} message 
     */
    handleCommand(app, message) {
        let client = app.client
        let prefix = client.prefix;
        if (!message.content.startsWith(prefix) || message.author.bot) return;

        const args = message.content.slice(prefix.length).split(/ +/);
        const commandName = args.shift().toLowerCase();

        const command = client.commands?.get(commandName)
            || client.commands?.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) return;
        console.log(command)
        if (!command.enabled) {
            message.channel.send('Cette commande est désactivée.').then(m => { wait(5000); if (m.deletable) m.delete() });
            return;
        }
        let db = this.db;
        if (command.dev) {
            if (client.owners.includes(message.author.id)) {
                try {
                    command.run(app, message, args, db);
                } catch (error) {
                    console.error(error);
                    message.channel.send('Il y a eu une erreur en exécutant cette commande.').then(m => { wait(5000); if (m.deletable) m.delete() });
                }
            } else return message.reply("Commande en cours de développement.").then(m => { wait(5000); if (m.deletable) m.delete() })
        } else {
            try {
                command.run(app, message, args, db);
            } catch (error) {
                console.error(error);
                message.channel.send('Il y a eu une erreur en exécutant cette commande.').then(m => { wait(5000); if (m.deletable) m.delete() });
            }
        }
    }

    /**
     * @param {Discord.Client} client 
     * @param {Discord.Message} message 
     */
    async handleSlash(app, interaction) {
        let client = app.client
        const command = client.slash?.get(interaction.name);

        if (!command) return;

        if (!command.enabled) {
            interaction.reply({ content: 'Cette commande est désactivée.', ephemeral: true })
            return;
        }
        let db = this.db;
        try {
            command.run(app, interaction, db);
        } catch (error) {
            console.error(error);
            interaction.reply('Il y a eu une erreur en exécutant cette commande.', true)
        }
    }

    async initSlash(app) {
        setTimeout(async () => {
            let client = app.client;
            let arrayOfSlashCommands = [];
            client.slash?.forEach(f => {
                arrayOfSlashCommands.push(f);
            })
            if(client.testingServerID) {
                await client.guilds.cache
                .get(client.testingServerID)
                .commands.set(arrayOfSlashCommands);
            } else {
               await client.application.commands.set(arrayOfSlashCommands);
            }
        }, 3000);
    }

    /**
     * @param {Discord.Client} client 
     */
    handleEvent(app) {
        let client = app.client
        client.events?.forEach(f => {
            if (f.enabled) {
                client.on(f.event, async (...args) => {
                    f.run(app, ...args)
                })
            } else return;
        })
    }

    /**
     * @param {Discord.Client} client 
     * @param {Discord.Message} message 
     */
    handleInteraction(app, message) {
        let client = app.client;
        client.interactions?.forEach(f => {
            if(f.enabled) {
                client.on("interactionCreate", async (interaction) => {
                    if(interaction.isCommand) return;
                    f.run(app, interaction, this.db)
                })
            } else return;
        })
    }

    /**
     * Create database using quickDB module.
     * @param {{driver: ?string, filePath: ?string, table: ?string}} opt QuickBD option for create database.
     */
    dbInit(opt) {
        const { QuickDB } = require('quick.db');
        this.db = new QuickDB(opt)
        return new Promise((resolve, reject) => {
            resolve(`Database has been initialized !`);
        });
    }

    /**
     * All init in one function.
     * @param {Wyz.Client} app
     * @param {?{driver: ?string, filePath: ?string, table: ?string}} db QuickBD option for create database.
     */
    init(app, db) {
        app.client.on('messageCreate', async message => { this.handleCommand(app, message) });
        this.handleEvent(app);
        this.initSlash(app);
        app.client.on("interactionCreate", async interactions => {
            if (interactions.isCommand()) { this.handleSlash(app, interactions) } else { this.createInteraction(app, interactions) }
        })
        if(!db) return;
        else this.dbInit(db).then(app.client.log ? log : '');
        require('./rest')(app);
    }

}

/**
 * Sleep time
 * @param {number} ms Number of sleep
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

/**
* Show log in console with others informations of variable.
* @param {string} args - Variable to show.
* @param {?string} title - Add title for your log.
*/
async function log(args, title) {
    console.log(`
[2;33m[1;33m-------------------------------------------
[0m[2;33m[0m[2;36m[${new Date().toLocaleString()}][0m ${title != null ? `: [2;33m${title}[0m` : ''}
-> ${typeof args === 'object' ? JSON.stringify(args) : args}
[0;2m[0m[2;33m-------------------------------------------[0m`);
}

/**
* Show log in console with others informations of variable.
* @param {{a: {name, []}, b?: {name, []}, c?: {name, []}}} table - Create table.
*/
async function table(table) {
    console.log(`
[2;33m+-----------------+

    `);
}
//[2;33m
//[0m

module.exports = {
    Client,
    sleep,
    log,
}