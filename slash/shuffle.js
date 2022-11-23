const { EmbedBuilder, PermissionsBitField, PermissionFlagsBits, SlashCommandBuilder } = require('discord.js')


module.exports = {
    data: new SlashCommandBuilder()
        .setName('shuffle')
        .setDescription('shuffles the current queue'),
        run: async ({ client, interaction }) => {
            const queue = client.player.getQueue(interaction.guildId)

            if (!queue) return await interaction.editReply('❌ There are no songs in the queue')

            const embed = new EmbedBuilder()
                .setTitle('✅ Queue Shuffled!')
                .setDescription(`${queue.tracks.length} songs have been shuffled!`)
                .setColor('Gold')

            queue.shuffle()
            await interaction.editReply({ embeds: [embed] })
        },
}