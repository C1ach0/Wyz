/**
 * @author C1ach0 | Kuracho
 * @copyright 2023
 *
 * All file system operations have synchronous, callback, and promise-based
 * forms, and are accessible using both CommonJS syntax and ES6 Modules (ESM).
 * @see [source](https://github.com/c1ach0/Wyz)
 */

import Discord from 'discord.js';
import { QuickDB } from 'quick.db';

declare module Wyz {
    let version: string;
    function log (args: string, title: string | null): void;
    class Client {
        constructor (options: {token: string, prefix: string, owners: string[] | null, guild: string | null, log: boolean | null, foldersName: {commands: string, slash: string, events: string, interactions: string} | null})
        /**
         * Create commands using prefix
        */
        createCommand(options: {name: string, description: string | null, usage: string | null, aliases: string[] | null, category: string, enabled: boolean, run: Function}): void;
        /**
         * Create slash commands
        */
        createSlash(options: {name: string, description: string | null, type: string | number, options: {} | null, enabled: boolean, run: Function}): void;
        /**
         * Create events 
        */
        createEvent(options: {name: string, event: string, enabled: boolean, run: Function}): void;
        /**
         * Create interactions using prefix
        */
        createInteraction(options: {name: string, type: string, enabled: boolean, run: Function}): void;
        /**
         * Execute commands
        */
        handleCommand(app: Wyz.Client, message: Discord.Message): void;
        /**
         * Execute slash commands
        */
        handleSlash(app: Wyz.Client, interaction: Discord.Interaction): void;
        /**
         * Execute events
        */
        handleEvent(app: Wyz.Client): void;
        /**
         * Execute interactions
        */
        handleInteraction(app: Wyz.Client, interaction: Discord.Interaction): void;
        /**
         * Initialize an database for your application.
         */
        dbInit(options: {driver: string | null, filePath: string | null, table: string | null}): QuickDB;
        /**
         * Init all handle and database in just one function.
         */
        init(app: Wyz.Client, db: {driver: string | null, filePath: string | null, table: string | null}): void;
        /**
         * Use a database for your application.
         */
        db: QuickDB;
        /**Collection of all commands*/
        commands: Discord.Collection<string, any>;
        /**Collection of all slash commands*/
        slash: Discord.Collection<string, any>;
        /**Last message deleted backup*/
        snipe: Discord.Collection<string, any>;
        /**Collection of all invites for tracking*/
        invites: Discord.Collection<string, any>;
        /**If need free Collection*/
        others: Discord.Collection<string, any>;
        /**Bot prefix*/
        prefix: string;
        /**All owners of bot*/
        owners: [];
        /**Support guild*/
        testingServerID: string;
        /**Client Discord instance*/
        client: Discord.Client;
    }
}

export = Wyz;