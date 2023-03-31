const { PermissionsBitField, Client } = require('discord.js');
const { Routes } = require('discord-api-types/v9');
const { REST } = require('@discordjs/rest')

module.exports = (app) => {
    const rest = new REST({ version: '9' }).setToken(app.client.token);

    fs.readdirSync(`${process.cwd()}/${opt.foldersName.commands}`)

}