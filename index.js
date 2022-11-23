const Discord = require('discord.js')
const { Routes, ActivityType, REST } = require('discord.js')
require('dotenv').config()
const fs = require('fs')
const { Player } = require('discord-player')

const LOAD_SLASH = process.argv[2] == "load"

const CLIENT_ID = "1006210854070538331"
const GUILD_ID = "904782121409855509"

const client = new Discord.Client({
    intents: [
        "Guilds",
        "GuildVoiceStates"
    ]
})

client.slashcommands = new Discord.Collection()
client.player = new Player(client, {
    ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25
    }
})

let commands = []

const slashFiles = fs.readdirSync('./slash').filter(file => file.endsWith(".js"))
for (const file of slashFiles){
    const slashcmd = require(`./slash/${file}`)
    client.slashcommands.set(slashcmd.data.name, slashcmd)
    if (LOAD_SLASH) commands.push(slashcmd.data.toJSON())
}

if (LOAD_SLASH) {
    const rest = new REST({ version: "9" }).setToken(process.env.TOKEN)
    console.log('Deploying slash commands')
    rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {body: commands})
    .then(() => {
        console.log("Successfully loaded")
        process.exit(0)
    })
    .catch((err) => {
        if (err){
            console.log(err)
            process.exit(1)
        }
    })
}
else {
    client.on('ready', () => {
        client.user.setActivity(`Josh his obby`, { type: ActivityType.Playing});
        console.log(`logged in as ${client.user.tag}`)
    })
    client.on('interactionCreate', (interaction) => {
        async function handleCommand() {
            if (!interaction.isCommand()) return

            const slashcmd = client.slashcommands.get(interaction.commandName)
            if (!slashcmd) interaction.reply('Not a valid slash command')
            
            await interaction.deferReply()
            await slashcmd.run({ client, interaction })
        }
        handleCommand()
    })
    client.login(process.env.TOKEN)
}