// index.js

const {
    Client,
    GatewayIntentBits,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    Events,
    PermissionsBitField,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    InteractionType
} = require('discord.js');

const TOKEN = 'MTUwMzk5MDQxNTM0OTY0NTM3Mg.GUOTH5.xmmO-bP6NWjNKGBglPckSQvp0mIX38wyiCx9Os';

// ====== SETTING ======
const ROLE_ID = '1503997352782856222';
const CHANNEL_ID = '1503998679424569495';
const OWNER_ID = '1503998081182601216';
// =====================

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages
    ]
});

client.once('ready', async () => {
    console.log(`${client.user.tag} online`);

    const channel = await client.channels.fetch(CHANNEL_ID);

    const embed = new EmbedBuilder()
        .setColor('#2b2d31')
        .setTitle('🌌 PANEL MEMBER')
        .setDescription(`
Klik tombol di bawah untuk:

✅ Mengambil role  
✏️ Rename nickname  
📩 Bertanya ke owner
        `)
        .setFooter({ text: 'Discord Auto System' });

    const buttons = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('ambil_role')
            .setLabel('Ambil Role')
            .setStyle(ButtonStyle.Success),

        new ButtonBuilder()
            .setCustomId('rename')
            .setLabel('Rename')
            .setStyle(ButtonStyle.Primary),

        new ButtonBuilder()
            .setCustomId('tanya_owner')
            .setLabel('Tanya Owner')
            .setStyle(ButtonStyle.Secondary)
    );

    await channel.send({
        embeds: [embed],
        components: [buttons]
    });
});

client.on(Events.InteractionCreate, async interaction => {

    // ===== AMBIL ROLE =====
    if (interaction.isButton() && interaction.customId === 'ambil_role') {

        const member = interaction.member;

        if (member.roles.cache.has(ROLE_ID)) {
            return interaction.reply({
                content: '❌ Kamu sudah memiliki role ini.',
                ephemeral: true
            });
        }

        await member.roles.add(ROLE_ID);

        interaction.reply({
            content: '✅ Role berhasil diberikan.',
            ephemeral: true
        });
    }

    // ===== RENAME =====
    if (interaction.isButton() && interaction.customId === 'rename') {

        const modal = new ModalBuilder()
            .setCustomId('rename_modal')
            .setTitle('Rename Nickname');

        const namaInput = new TextInputBuilder()
            .setCustomId('nama_baru')
            .setLabel('Masukkan nickname baru')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const row = new ActionRowBuilder().addComponents(namaInput);

        modal.addComponents(row);

        await interaction.showModal(modal);
    }

    // ===== TANYA OWNER =====
    if (interaction.isButton() && interaction.customId === 'tanya_owner') {

        const modal = new ModalBuilder()
            .setCustomId('owner_modal')
            .setTitle('Pertanyaan Untuk Owner');

        const pertanyaan = new TextInputBuilder()
            .setCustomId('isi_pertanyaan')
            .setLabel('Masukkan pertanyaan')
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true);

        const row = new ActionRowBuilder().addComponents(pertanyaan);

        modal.addComponents(row);

        await interaction.showModal(modal);
    }

    // ===== SUBMIT RENAME =====
    if (
        interaction.type === InteractionType.ModalSubmit &&
        interaction.customId === 'rename_modal'
    ) {

        const namaBaru = interaction.fields.getTextInputValue('nama_baru');

        try {
            await interaction.member.setNickname(namaBaru);

            interaction.reply({
                content: `✅ Nickname berhasil diubah menjadi **${namaBaru}**`,
                ephemeral: true
            });

        } catch (err) {

            interaction.reply({
                content: '❌ Bot tidak memiliki permission rename.',
                ephemeral: true
            });
        }
    }

    // ===== SUBMIT PERTANYAAN =====
    if (
        interaction.type === InteractionType.ModalSubmit &&
        interaction.customId === 'owner_modal'
    ) {

        const isi = interaction.fields.getTextInputValue('isi_pertanyaan');

        try {

            const owner = await client.users.fetch("1503998081182601216");

            await owner.send(`
📩 Pertanyaan Baru

👤 Dari: ${interaction.user.tag}

💬 Pesan:
${isi}
            `);

            interaction.reply({
                content: '✅ Pertanyaan berhasil dikirim ke owner.',
                ephemeral: true
            });

        } catch (err) {

            interaction.reply({
                content: '❌ Gagal mengirim pesan ke owner.',
                ephemeral: true
            });
        }
    }

});

client.login("MTUwMzk5MDQxNTM0OTY0NTM3Mg.GUOTH5.xmmO-bP6NWjNKGBglPckSQvp0mIX38wyiCx9Os");