const { EmbedBuilder, PermissionsBitField, PermissionFlagsBits, SlashCommandBuilder } = require('discord.js')


module.exports = {
    data: new SlashCommandBuilder()
        .setName('resume')
        .setDescription('resumes the current song'),
        run: async ({ client, interaction }) => {
            const queue = client.player.getQueue(interaction.guildId)

            if (!queue) return await interaction.editReply('❌ There are no songs in the queue')

            const embed = new EmbedBuilder()
                .setTitle('✅ Started the queue')
                .setDescription("The queue has been resumed!")
                .setColor('Green')

            queue.setPaused(false)
            await interaction.editReply({ embeds: [embed] })
        },
}