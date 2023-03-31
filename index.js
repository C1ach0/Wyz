/**
 * @name Wyz
 * @author clach
 */

const {
    log,
    Client
} = require('./src')

var Wyz = {
    /**       
     * @name Wyz.version       
     * @type {string}       
     * @default '0.0.1'       
     */version: '0.0.1',

    /**
     * @name Wyz.log
     * @param {string} args - Variable to show.
     * @param {?string} title - Add title for your log.
     */
    log: function (args, title) {
        log(args, title)
    },

    /**
     * Init bot connection to discord.js
     * @name Wyz.Client
     * @type {class}
     * @param {{token: string, prefix: string, owners: ?[], guild: ?string, log: ?boolean, foldersName: ?{commands: string, slash: string, events: string, interactions: string}}} opt Options for start bot.
     * @return {Client} Client
     */
    Client,

};

module.exports = Wyz;