const { EmbedBuilder, PermissionsBitField, PermissionFlagsBits, SlashCommandBuilder } = require('discord.js')


module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pauses the current song'),
        run: async ({ client, interaction }) => {
            const queue = client.player.getQueue(interaction.guildId)

            if (!queue) return await interaction.editReply('❌ There are no songs in the queue')

            const embed = new EmbedBuilder()
                .setTitle('✅ Paused the queue')
                .setDescription("The queue has been paused! Use `/resume` to resume the queue")
                .setColor('Red')

            queue.setPaused(true)
            await interaction.editReply({ embeds: [embed] })
        },
}