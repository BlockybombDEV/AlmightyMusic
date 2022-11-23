const { EmbedBuilder, PermissionsBitField, PermissionFlagsBits, SlashCommandBuilder } = require('discord.js')
const { QueryType } = require('discord-player')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('plays a song')
        .addSubcommand((subcommand)=>
            subcommand
                .setName('song')
                .setDescription('Choose a song from url')
                .addStringOption((option) => 
                option
                    .setName('url')
                    .setDescription('the song')
                    .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
        subcommand
            .setName('playlist')
            .setDescription('loads a playlist from a url')
            .addStringOption((option) => option
                .setName('url')
                .setDescription("the playlist's url").setRequired(true)
            )
        )
        .addSubcommand((subcommand) => subcommand
            .setName('search')
            .setDescription('searches a song')
            .addStringOption((option) => option
                .setName('name')
                .setDescription('The song name')
                .setRequired(true)
            )
            
        )
        .addSubcommand((subcommand) => subcommand
            .setName('spotify')
            .setDescription('Searches songs on spotify')
            .addStringOption((option) => option
                .setName('url')
                .setDescription('link to the song')
                .setRequired(true)
            )
        )
        .addSubcommand((subcommand) => subcommand
            .setName('splaylist')
            .setDescription('Plays a playlist from spotify')
            .addStringOption((option) => option
                .setName('url')
                .setDescription('link to the playlist')
                .setRequired(true)
            )
        ),
    run: async ({ client, interaction }) => {
        if (!interaction.member.voice.channel) return interaction.editReply('❌ You need to be in a voice channel to play music.')

        const queue = await client.player.createQueue(interaction.guild)
        if (!queue.connection) await queue.connect(interaction.member.voice.channel)

        let embed = new EmbedBuilder().setColor('Green')

        if (interaction.options.getSubcommand() === 'song') {
            let url = interaction.options.getString('url')
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_VIDEO
            })
            if (result.tracks.length === 0)
                return interaction.editReply('❌ No results')
            const song = result.tracks[0]
            await queue.addTrack(song)
            embed
                .setDescription(`✅ **[${song.title}](${song.url})** has been added to the Queue`)
                .setThumbnail(song.thumbnail)
                .setFooter({ text: `Duration: ${song.duration}`})

        } else if (interaction.options.getSubcommand() === 'playlist') {
            let url = interaction.options.getString('url')
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_PLAYLIST
            })
            if (result.tracks.length === 0) 
                return interaction.editReply('❌ No results')

                const playlist = result.playlist[0]
                await queue.addTracks(result.tracks)
                embed
                    .setDescription(`✅ **Songs from [${playlist.title}] (${playlist.url})** have been added to the Queue`)
                    .setThumbnail(song.thumbnail)

        } else if (interaction.options.getSubcommand() === 'search') {
            let url = interaction.options.getString('name')
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_SEARCH
            })

            if (result.tracks.length === 0)
                return interaction.editReply('❌ No results')

            const song = result.tracks[0]
            await queue.addTrack(song)
            embed
                .setDescription(`✅ **[${song.title}](${song.url})** has been added to the Queue`)
                .setThumbnail(song.thumbnail)
                .setFooter({ text: `Duration: ${song.duration}`})

        } else if (interaction.options.getSubcommand() === 'spotify') {
            let url = interaction.options.getString('url')
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.SPOTIFY_SONG
            })

            if (result.tracks.length === 0)
                return interaction.editReply({content: '❌ No results', ephemeral: true})

            const song = result.tracks[0]
            await queue.addTrack(song)
            embed
                .setDescription(`✅ **[${song.title}](${song.url})** has been added to the Queue`)
                .setThumbnail(song.thumbnail)
                .setFooter({ text: `Duration: ${song.duration}`})

            } else if (interaction.options.getSubcommand() === 'splaylist') {
                let url = interaction.options.getString('url')
                const result = await client.player.search(url, {
                    requestedBy: interaction.user,
                    searchEngine: QueryType.SPOTIFY_PLAYLIST
                })
                if (result.tracks.length === 0) 
                    return interaction.editReply('❌ No results')
    
                    const playlist = result.playlist[0]
                    await queue.addTracks(result.tracks)
                    embed
                        .setDescription(`✅ Songs from the playlist have been added to the Queue`)
            }
        if (!queue.playing) await queue.play()
        await interaction.editReply({
            embeds: [embed]
        })
    },
}