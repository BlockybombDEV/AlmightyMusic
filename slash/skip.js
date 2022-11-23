const { EmbedBuilder, PermissionsBitField, PermissionFlagsBits, SlashCommandBuilder } = require('discord.js')


module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('skips the current song')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .setDMPermission(false),
        run: async ({ client, interaction }) => {
            const queue = client.player.getQueue(interaction.guildId)

            if (!queue) return await interaction.editReply('❌ There are no songs in the queue')

            const currentSong = queue.current

            const embed = new EmbedBuilder()
                .setDescription(`✅ ${currentSong.title} has been skipped!`).setThumbnail(currentSong.Thumbnail).setColor('Green')

            queue.skip()
            await interaction.editReply({ embeds: [embed] })
        },
}