const { EmbedBuilder, PermissionsBitField, PermissionFlagsBits, SlashCommandBuilder } = require('discord.js')


module.exports = {
    data: new SlashCommandBuilder()
        .setName('leave')
        .setDescription('Leaves the current VC'),
        run: async ({ client, interaction }) => {
            if (!interaction.member.voice.channel) return interaction.editReply('❌ You need to be in a voice channel to stop music.')
            const queue = client.player.getQueue(interaction.guildId)

            if (!queue) return await interaction.editReply('❌ There are no songs in the queue')

            const embed = new EmbedBuilder()
                .setTitle('✅ Leaving the voice channel')
                .setDescription('Queue is now empty!')
                .setColor('Red')

            queue.destroy()
            await interaction.editReply({ embeds: [embed] })
        },
}