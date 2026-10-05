const { Client, GatewayIntentBits, ActivityType, ChannelType, PermissionFlagsBits, SlashCommandBuilder, EmbedBuilder, REST, Routes } = require("discord.js");

const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.DISCORD_CLIENT_ID || "1556044045195935775";
const GUILD_ID = process.env.DISCORD_GUILD_ID || "1546265801500266611";
const WEBSITE_URL = process.env.TRUCKWORKS_WEBSITE_URL || "https://truck-works.vercel.app";

if (!TOKEN) {
  console.error("DISCORD_TOKEN is missing.");
  process.exit(1);
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const layout = [
  ["🚛 BC TRUCK WORKS • START HERE", ["📢│announcements","📌│server-info","📊│bot-status","💡│suggestions"]],
  ["💬 COMMUNITY", ["💬│general","🚛│truck-talk","📸│screenshots","🎥│streamers"]],
  ["🛣️ DRIVING • ATS / ETS2", ["🇺🇸│ats","🇪🇺│ets2","📡│telemetry","📏│miles-and-trips","⛽│fuel-and-rest","🧭│navigation"]],
  ["◎ CONVOYS", ["📅│convoy-events","🚦│convoy-lobby","📡│convoy-live","🗺️│convoy-routes","🏆│leaderboard"]],
  ["🏢 VTC • COMPANY", ["🏢│vtc","📋│dispatch","💰│earnings","📈│career","🧾│trip-reports"]],
  ["🆘 SUPPORT", ["🎫│support","🐛│bug-reports","📡│telemetry-help","💻│technical-help"]],
  ["🎙️ VOICE • DRIVERS", ["🚛│Truckers","◎│Convoy 1","◎│Convoy 2","🎙️│Driver Lounge","🔊│Dispatch"]],
  ["🔒 STAFF • TRUCK WORKS", ["🔒│staff-chat","📋│staff-logs","🚨│alerts","🛠️│development","🗃️│admin"]]
];

const messages = {
  "📢│announcements": "# 🚛 BC TRUCK WORKS\n\nWelcome to BC TRUCK WORKS!\n\nBuilt for ATS, ETS2, convoys, VTC operations, driver progression and telemetry.",
  "📌│server-info": "# 📌 SERVER INFO\n\nWebsite: " + WEBSITE_URL + "\n\n🇺🇸 ATS • 🇪🇺 ETS2\n🚛 Driving • 📡 Telemetry • ◎ Convoys • 🏢 VTC • 🏆 Leaderboards",
  "📡│telemetry": "# 📡 TELEMETRY\n\nTelemetry is collected on the driver's gaming PC through a telemetry provider and the BC TRUCK WORKS Driver Agent.\n\nExpected endpoint: http://127.0.0.1:25555/api/ets2/telemetry\n\nThe Discord bot cannot directly read ATS / ETS2 telemetry.",
  "📡│telemetry-help": "# 📡 TELEMETRY HELP\n\n1. Run ATS/ETS2.\n2. Run your telemetry provider.\n3. Run the Driver Agent.\n4. Check the local telemetry endpoint.\n5. Restart telemetry if needed.\n\nNeed help? Use #🎫│support."
};

function statusEmbed() {
  return new EmbedBuilder()
    .setTitle("🚛 BC TRUCK WORKS • BOT STATUS")
    .setDescription("BC TRUCK WORKS Discord infrastructure is online.")
    .addFields(
      { name: "🤖 Bot", value: "🟢 Online", inline: true },
      { name: "📡 Discord", value: "🟢 Connected", inline: true },
      { name: "🌐 Website", value: WEBSITE_URL, inline: true },
      { name: "🛣️ Games", value: "ATS / ETS2", inline: true },
      { name: "📡 Telemetry", value: "Driver Agent architecture", inline: true },
      { name: "⚙️ Version", value: "2.0.0", inline: true }
    )
    .setTimestamp()
    .setFooter({ text: "BC TRUCK WORKS" });
}

async function updateStatus() {
  try {
    const guild = await client.guilds.fetch(GUILD_ID);
    const channel = guild.channels.cache.find(c => c.name === "📊│bot-status" && c.type === ChannelType.GuildText);
    if (!channel) return;
    const old = await channel.messages.fetch({ limit: 20 });
    for (const m of old.values()) if (m.author.id === client.user.id) await m.delete().catch(() => {});
    await channel.send({ embeds: [statusEmbed()] });
  } catch (e) {
    console.error("Status update:", e.message);
  }
}

async function setup(interaction) {
  if (!interaction.guild) return interaction.reply({ content: "❌ Use this command inside the server.", ephemeral: true });
  if (!interaction.memberPermissions.has(PermissionFlagsBits.Administrator)) return interaction.reply({ content: "❌ Administrator permission is required.", ephemeral: true });
  await interaction.deferReply({ ephemeral: true });

  const me = interaction.guild.members.me;
  if (!me || !me.permissions.has(PermissionFlagsBits.ManageChannels)) return interaction.editReply("❌ I need Manage Channels permission.");

  try {
    await interaction.editReply("🛠️ Rebuilding BC TRUCK WORKS...");
    for (const c of [...interaction.guild.channels.cache.values()]) {
      if (c.deletable && c.type !== ChannelType.GuildCategory) await c.delete("BC TRUCK WORKS rebuild");
    }
    for (const c of [...interaction.guild.channels.cache.values()]) {
      if (c.deletable && c.type === ChannelType.GuildCategory) await c.delete("BC TRUCK WORKS rebuild");
    }

    let categories = 0;
    let channels = 0;
    for (const [categoryName, channelNames] of layout) {
      const category = await interaction.guild.channels.create({ name: categoryName, type: ChannelType.GuildCategory });
      categories++;
      for (const name of channelNames) {
        const voice = ["🚛│Truckers","◎│Convoy 1","◎│Convoy 2","🎙️│Driver Lounge","🔊│Dispatch"].includes(name);
        const type = voice ? ChannelType.GuildVoice : ChannelType.GuildText;
        const channel = await interaction.guild.channels.create({ name, type, parent: category.id });
        channels++;
        if (type === ChannelType.GuildText && messages[name]) await channel.send(messages[name]);
      }
    }
    await interaction.editReply("✅ BC TRUCK WORKS setup complete! Categories: " + categories + " | Channels: " + channels);
    setTimeout(updateStatus, 3000);
  } catch (e) {
    console.error("SETUP ERROR:", e);
    await interaction.editReply("❌ Setup failed: " + e.message);
  }
}

const commands = [
  new SlashCommandBuilder().setName("setup").setDescription("Build or rebuild the BC TRUCK WORKS Discord server.").setDefaultMemberPermissions(PermissionFlagsBits.Administrator.toString()),
  new SlashCommandBuilder().setName("status").setDescription("Show bot and server status."),
  new SlashCommandBuilder().setName("truckworks").setDescription("Show BC TRUCK WORKS information."),
  new SlashCommandBuilder().setName("telemetry").setDescription("Show ATS / ETS2 telemetry information.")
].map(c => c.toJSON());

async function registerCommands() {
  const rest = new REST({ version: "10" }).setToken(TOKEN);
  await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands });
  console.log("Registered 4 Discord slash commands.");
}

client.once("ready", async () => {
  console.log("========================================");
  console.log("BC TRUCK WORKS DISCORD BOT");
  console.log("Logged in as:", client.user.tag);
  console.log("Bot ID:", client.user.id);
  console.log("Server count:", client.guilds.cache.size);
  console.log("========================================");
  client.user.setPresence({ activities: [{ name: "BC TRUCK WORKS • ATS / ETS2", type: ActivityType.Watching }], status: "online" });
  try { await registerCommands(); await updateStatus(); } catch (e) { console.error("Startup:", e); }
  setInterval(updateStatus, 300000);
  console.log("BC TRUCK WORKS BOT IS ONLINE");
});

client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;
  try {
    if (interaction.commandName === "setup") return setup(interaction);
    if (interaction.commandName === "status") return interaction.reply({ embeds: [statusEmbed()] });
    if (interaction.commandName === "truckworks") return interaction.reply({ embeds: [new EmbedBuilder().setTitle("🚛 BC TRUCK WORKS").setDescription("Trucking community and driver platform for ATS and ETS2.").addFields({ name: "🌐 Website", value: WEBSITE_URL }, { name: "🛣️ Games", value: "American Truck Simulator and Euro Truck Simulator 2" }).setTimestamp()] });
    if (interaction.commandName === "telemetry") return interaction.reply({ embeds: [new EmbedBuilder().setTitle("📡 TELEMETRY").setDescription("Driver-side telemetry connects ATS / ETS2 data to BC TRUCK WORKS.").addFields({ name: "Endpoint", value: "http://127.0.0.1:25555/api/ets2/telemetry" }, { name: "Help", value: "Use #📡│telemetry-help or #🎫│support." }).setTimestamp()] });
  } catch (e) {
    console.error("Interaction:", e);
    const r = { content: "❌ Something went wrong.", ephemeral: true };
    if (interaction.replied || interaction.deferred) await interaction.followUp(r).catch(() => {});
    else await interaction.reply(r).catch(() => {});
  }
});

client.on("error", e => console.error("Discord error:", e));
client.on("warn", e => console.warn("Discord warning:", e));
client.login(TOKEN).catch(e => { console.error("Discord login failed:", e); process.exit(1); });
