require("dotenv").config();

const {
  Client, GatewayIntentBits, ActivityType, ChannelType, PermissionFlagsBits,
  SlashCommandBuilder, EmbedBuilder, REST, Routes, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle
} = require("discord.js");
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus, entersState } = require("@discordjs/voice");
const play = require("play-dl");

const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.DISCORD_CLIENT_ID || "1556044045195935775";
const GUILD_ID = process.env.DISCORD_GUILD_ID || "1546265801500266611";
const WEBSITE_URL = process.env.TRUCKWORKS_WEBSITE_URL || "https://bctruckworks.vercel.app";
const OWNER_ID = process.env.OWNER_DISCORD_ID || "";
const UPDATE_ROLE_NAME = process.env.UPDATE_ROLE_NAME || "Updates";
const GITHUB_REPO = "dospatch/bc-truck-works";

if (!TOKEN) { console.error("DISCORD_TOKEN is missing."); process.exit(1); }

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const layout = [
  ["01 — START HERE", ["👋│welcome","📜│rules","📢│announcements","🎭│get-roles","📌│server-guide","📊│bot-status"]],
  ["02 — COMMUNITY", ["💬│general-chat","📸│screenshots","🎥│clips-and-videos","😂│truckers-memes","🤝│looking-for-convoy"]],
  ["03 — ATS & ETS2", ["🚛│american-truck-simulator","🚚│euro-truck-simulator-2","🗺️│routes-and-trucks","🎮│mods-and-settings","🏁│convoy-events"]],
  ["04 — DRIVER HUB", ["📡│telemetry-help","📊│driver-statistics","🛣️│trip-reports","🌐│website-support","🎫│support"]],
  ["05 — EVENTS", ["📅│event-announcements","📝│event-signups","📷│event-photos","🔊 Convoy Voice","🔊 General Voice"]],
  ["06 — STAFF HQ", ["🔒│staff-chat","📋│staff-announcements","🛡️│mod-logs","🎫│ticket-management","📝│staff-reports","🛠️│development"]]
];

const messages = {
  "📢│announcements": "# 🚛 BC TRUCK WORKS\n\nWelcome to BC TRUCK WORKS!\n\nBuilt for ATS, ETS2, convoys, VTC operations, driver progression and telemetry.",
  "📌│server-info": "# 📌 SERVER INFO\n\nWebsite: " + WEBSITE_URL + "\n\n🇺🇸 ATS • 🇪🇺 ETS2\n🚛 Driving • 📡 Telemetry • ◎ Convoys • 🏢 VTC • 🏆 Leaderboards",
  "📡│telemetry": "# 📡 TELEMETRY\n\nTelemetry is collected on the driver's gaming PC through a telemetry provider and the BC TRUCK WORKS Driver Agent.\n\nThe Discord bot cannot directly read ATS / ETS2 telemetry.",
  "📡│telemetry-help": "# 📡 TELEMETRY HELP\n\n1. Run ATS/ETS2.\n2. Run your telemetry provider.\n3. Run the Driver Agent.\n4. Check the local telemetry endpoint.\n5. Restart telemetry if needed.\n\nNeed help? Use #🎫│support."
};

function statusEmbed() {
  return new EmbedBuilder().setTitle("🚛 BC TRUCK WORKS • BOT STATUS")
    .setDescription("BC TRUCK WORKS Discord infrastructure is online.")
    .addFields(
      {name:"🤖 Bot",value:"🟢 Online",inline:true},
      {name:"📡 Discord",value:"🟢 Connected",inline:true},
      {name:"🌐 Website",value:WEBSITE_URL,inline:true},
      {name:"🛣️ Games",value:"ATS / ETS2",inline:true},
      {name:"⚙️ Version",value:"2.3.0",inline:true}
    ).setTimestamp().setFooter({text:"BC TRUCK WORKS"});
}

const ticketCategories = {
  support: { label:"General Support", emoji:"🆘", description:"Driver Hub, account, community, or general help." },
  bug: { label:"Bug Report", emoji:"🐛", description:"Report a problem or unexpected behavior." },
  telemetry: { label:"Telemetry Help", emoji:"📡", description:"ATS/ETS2 telemetry, connector, mileage, or data issues." },
  technical: { label:"Technical Help", emoji:"💻", description:"Website, bot, installer, or technical setup help." }
};

function ticketPanelComponents(){
  return [new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId("bc_ticket_category")
      .setPlaceholder("Choose a support category...")
      .addOptions(Object.entries(ticketCategories).map(([value,c])=>({label:c.label,value,description:c.description,emoji:c.emoji})))
  )];
}

async function postSupportPanel(guild){
  const channel=guild.channels.cache.find(c=>c.name==="🎫│support"&&c.type===ChannelType.GuildText);
  if(!channel)return;
  const recent=await channel.messages.fetch({limit:50}).catch(()=>null);
  if(recent && recent.some(m=>m.author.id===client.user.id && m.components?.some(row=>row.components?.some(c=>c.customId==="bc_ticket_category")))) return;
  const embed=new EmbedBuilder()
    .setColor(0x2f7fbf)
    .setTitle("🎫 BC TRUCK WORKS SUPPORT")
    .setDescription("Need help? Choose the category that best matches your issue and a private support ticket will be created for you.")
    .addFields({name:"🌐 Support Center",value:WEBSITE_URL+"/support"},{name:"📋 Ticket Categories",value:"🆘 General Support\n🐛 Bug Report\n📡 Telemetry Help\n💻 Technical Help"})
    .setFooter({text:"BC TRUCK WORKS • Support Team"});
  await channel.send({embeds:[embed],components:ticketPanelComponents()}).catch(e=>console.error("Support panel:",e.message));
}

async function createTicket(interaction, key){
  const cfg=ticketCategories[key];
  if(!cfg) return;
  const guild=interaction.guild;
  if(!guild) return interaction.editReply("❌ Please open a ticket from inside the BC TRUCK WORKS server.");
  const botMember=guild.members.me;
  if(!botMember || !botMember.permissions.has(PermissionFlagsBits.ManageChannels) || !botMember.permissions.has(PermissionFlagsBits.ViewChannel)){
    return interaction.editReply("❌ I need **Manage Channels** and **View Channels** permissions to create support tickets. Ask a server administrator to fix my role permissions.");
  }
  const existing=guild.channels.cache.find(c=>c.type===ChannelType.GuildText && c.topic===("BC-TICKET:"+interaction.user.id));
  if(existing) return interaction.editReply("❌ You already have an open support ticket: <#"+existing.id+">");
  const supportCategory=guild.channels.cache.find(c=>(c.name==="04 — DRIVER HUB"||c.name==="🆘 SUPPORT")&&c.type===ChannelType.GuildCategory);
  const safeName=interaction.user.username.toLowerCase().replace(/[^a-z0-9-]/g,"").slice(0,18)||"driver";
  const supportRoleNames=["Support Team","Moderator","Senior Moderator","TruckWorks Manager","TruckWorks Director","Co-Owner","Owner"];
  const staffRoles=guild.roles.cache.filter(r=>supportRoleNames.includes(r.name));
  const permissionOverwrites=[
    {id:guild.roles.everyone.id,deny:[PermissionFlagsBits.ViewChannel]},
    {id:interaction.user.id,allow:[PermissionFlagsBits.ViewChannel,PermissionFlagsBits.SendMessages,PermissionFlagsBits.ReadMessageHistory,PermissionFlagsBits.AttachFiles]},
    {id:botMember.id,allow:[PermissionFlagsBits.ViewChannel,PermissionFlagsBits.SendMessages,PermissionFlagsBits.ReadMessageHistory,PermissionFlagsBits.ManageChannels,PermissionFlagsBits.ManageMessages,PermissionFlagsBits.EmbedLinks]}
  ];
  for(const role of staffRoles.values()) permissionOverwrites.push({id:role.id,allow:[PermissionFlagsBits.ViewChannel,PermissionFlagsBits.SendMessages,PermissionFlagsBits.ReadMessageHistory,PermissionFlagsBits.AttachFiles]});
  let channel;
  try{
    channel=await guild.channels.create({
      name:"ticket-"+safeName,
      type:ChannelType.GuildText,
      parent:supportCategory?.id,
      topic:"BC-TICKET:"+interaction.user.id,
      permissionOverwrites,
      reason:"BC TRUCK WORKS support ticket opened by "+interaction.user.tag
    });
    const supportRole=guild.roles.cache.find(r=>r.name==="Support Team");
    const roleMention=supportRole?"<@&"+supportRole.id+"> ":"";
    const embed=new EmbedBuilder()
      .setColor(0x2f7fbf)
      .setTitle("🎫 BC TRUCK WORKS SUPPORT TICKET")
      .setDescription("Welcome! A member of the Support Team will help you here.")
      .addFields(
        {name:"📂 Ticket Category",value:cfg.emoji+" **"+cfg.label+"**",inline:true},
        {name:"👤 Driver",value:"<@"+interaction.user.id+">",inline:true},
        {name:"📝 What to include",value:"Please explain the issue, what you were doing, and any error messages you received."},
        {name:"🌐 Support Center",value:WEBSITE_URL+"/support"}
      ).setTimestamp();
    const closeRow=new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId("bc_ticket_close").setLabel("Close Ticket").setEmoji("🔒").setStyle(ButtonStyle.Danger));
    await channel.send({content:roleMention+"<@"+interaction.user.id+">",embeds:[embed],components:[closeRow],allowedMentions:{users:[interaction.user.id],roles:supportRole?[supportRole.id]:[]}});
    return interaction.editReply("✅ Your **"+cfg.label+"** ticket has been created: <#"+channel.id+">");
  }catch(e){
    console.error("Ticket creation failed:",e);
    if(channel) await channel.delete("Clean up incomplete BC TRUCK WORKS ticket").catch(()=>{});
    throw e;
  }
}

async function updateStatus() {
  try {
    const guild = await client.guilds.fetch(GUILD_ID);
    const channel = guild.channels.cache.find(c => c.name === "📊│bot-status" && c.type === ChannelType.GuildText);
    if (!channel) return;
    const old = await channel.messages.fetch({limit:20});
    for (const m of old.values()) if (m.author.id === client.user.id) await m.delete().catch(()=>{});
    await channel.send({embeds:[statusEmbed()]});
  } catch(e) { console.error("Status update:",e.message); }
}

async function ensureRoles(guild){
  const roles=[
    ["Owner",0xE74C3C],["Co-Owner",0xFF6B35],["TruckWorks Director",0x9B59B6],["TruckWorks Manager",0x3498DB],
    ["Lead Developer",0x1ABC9C],["Developer",0x2ECC71],["Web Developer",0x00A8FF],["Bot Developer",0x5865F2],
    ["Senior Moderator",0xF1C40F],["Moderator",0xE67E22],["Support Team",0x2ECC71],
    ["TruckWorks Creator",0xE91E63],["Verified Creator",0xC27CFF],["Creator Partner",0x9B59B6],
    [UPDATE_ROLE_NAME,0x57F287],["Driver",0x95A5A6],["VTC Owner",0xF39C12]
  ];
  const result=[];
  for(const [name,color] of roles){
    let role=guild.roles.cache.find(r=>r.name===name);
    if(!role) role=await guild.roles.create({name,color,mentionable:name===UPDATE_ROLE_NAME,reason:"BC TRUCK WORKS role setup"});
    else if(name===UPDATE_ROLE_NAME && !role.mentionable) await role.setMentionable(true,"BC TRUCK WORKS update announcements").catch(()=>{});
    result.push(role);
  }
  return result;
}
async function setup(interaction) {
  if (!interaction.guild) return interaction.reply({content:"❌ Use this command inside the server.",ephemeral:true});
  if (!interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) {
    return interaction.reply({content:"❌ Administrator permission is required to run setup.",ephemeral:true});
  }

  await interaction.deferReply({ephemeral:true});
  const guild = interaction.guild;
  const me = guild.members.me;

  if (!me || !me.permissions.has(PermissionFlagsBits.ManageChannels) || !me.permissions.has(PermissionFlagsBits.ViewChannel)) {
    return interaction.editReply("❌ I need **Manage Channels** and **View Channels** permissions. Please update my bot role and try again.");
  }
  if (!me.permissions.has(PermissionFlagsBits.ManageRoles)) {
    return interaction.editReply("❌ I also need **Manage Roles** to ensure the BC TRUCK WORKS staff and driver roles exist. Keep the bot role below your own role, but above the roles it needs to manage.");
  }

  try {
    await interaction.editReply("🛠️ Building the BC TRUCK WORKS channel layout and applying permissions. Existing channels will not be deleted or moved.");

    // Ensure expected roles exist. This does not assign roles to members or grant Administrator.
    await ensureRoles(guild);
    await guild.roles.fetch().catch(() => {});
    await guild.channels.fetch().catch(() => {});

    const roleNames = [
      "Owner","Co-Owner","TruckWorks Director","TruckWorks Manager",
      "Lead Developer","Developer","Web Developer","Bot Developer",
      "Senior Moderator","Moderator","Support Team"
    ];
    const devRoleNames = [
      "Owner","Co-Owner","TruckWorks Director","TruckWorks Manager",
      "Lead Developer","Developer","Web Developer","Bot Developer"
    ];
    const staffRoles = guild.roles.cache.filter(r => roleNames.includes(r.name));
    const devRoles = guild.roles.cache.filter(r => devRoleNames.includes(r.name));
    const everyone = guild.roles.everyone;
    const botMember = guild.members.me;

    const publicOverwrites = [
      { id: everyone.id, allow: [
        PermissionFlagsBits.ViewChannel,
        PermissionFlagsBits.ReadMessageHistory,
        PermissionFlagsBits.SendMessages,
        PermissionFlagsBits.AddReactions,
        PermissionFlagsBits.EmbedLinks,
        PermissionFlagsBits.AttachFiles,
        PermissionFlagsBits.Connect,
        PermissionFlagsBits.Speak
      ]},
      { id: botMember.id, allow: [
        PermissionFlagsBits.ViewChannel,
        PermissionFlagsBits.ReadMessageHistory,
        PermissionFlagsBits.SendMessages,
        PermissionFlagsBits.EmbedLinks,
        PermissionFlagsBits.AttachFiles,
        PermissionFlagsBits.ManageChannels,
        PermissionFlagsBits.ManageMessages,
        PermissionFlagsBits.Connect,
        PermissionFlagsBits.Speak
      ]}
    ];
    for (const role of staffRoles.values()) {
      publicOverwrites.push({ id: role.id, allow: [
        PermissionFlagsBits.ViewChannel,
        PermissionFlagsBits.ReadMessageHistory,
        PermissionFlagsBits.SendMessages,
        PermissionFlagsBits.EmbedLinks,
        PermissionFlagsBits.AttachFiles,
        PermissionFlagsBits.ManageMessages
      ]});
    }

    const privateOverwrites = [
      { id: everyone.id, deny: [PermissionFlagsBits.ViewChannel] },
      { id: botMember.id, allow: [
        PermissionFlagsBits.ViewChannel,
        PermissionFlagsBits.ReadMessageHistory,
        PermissionFlagsBits.SendMessages,
        PermissionFlagsBits.EmbedLinks,
        PermissionFlagsBits.AttachFiles,
        PermissionFlagsBits.ManageChannels,
        PermissionFlagsBits.ManageMessages
      ]}
    ];
    for (const role of staffRoles.values()) {
      privateOverwrites.push({ id: role.id, allow: [
        PermissionFlagsBits.ViewChannel,
        PermissionFlagsBits.ReadMessageHistory,
        PermissionFlagsBits.SendMessages,
        PermissionFlagsBits.EmbedLinks,
        PermissionFlagsBits.AttachFiles
      ]});
    }

    const devOverwrites = [
      { id: everyone.id, deny: [PermissionFlagsBits.ViewChannel] },
      { id: botMember.id, allow: [
        PermissionFlagsBits.ViewChannel,
        PermissionFlagsBits.ReadMessageHistory,
        PermissionFlagsBits.SendMessages,
        PermissionFlagsBits.EmbedLinks,
        PermissionFlagsBits.AttachFiles,
        PermissionFlagsBits.ManageChannels,
        PermissionFlagsBits.ManageMessages
      ]}
    ];
    for (const role of devRoles.values()) {
      devOverwrites.push({ id: role.id, allow: [
        PermissionFlagsBits.ViewChannel,
        PermissionFlagsBits.ReadMessageHistory,
        PermissionFlagsBits.SendMessages,
        PermissionFlagsBits.EmbedLinks,
        PermissionFlagsBits.AttachFiles
      ]});
    }

    let categoriesAdded = 0;
    let channelsAdded = 0;
    let permissionErrors = 0;
    const privateCategoryNames = new Set(["06 — STAFF HQ"]);
    const announcementChannels = new Set(["📢│announcements","📅│event-announcements"]);

    for (const [categoryName, channelNames] of layout) {
      let category = guild.channels.cache.find(c => c.type === ChannelType.GuildCategory && c.name === categoryName);
      if (!category) {
        category = await guild.channels.create({
          name: categoryName,
          type: ChannelType.GuildCategory,
          reason: "BC TRUCK WORKS additive server setup"
        });
        categoriesAdded++;
      }

      const isPrivate = privateCategoryNames.has(categoryName);
      const isDevCategory = false;
      const overwrites = isPrivate ? privateOverwrites : (isDevCategory ? devOverwrites : publicOverwrites);
      try {
        await category.permissionOverwrites.set(overwrites, "Configure BC TRUCK WORKS category permissions");
      } catch (e) {
        permissionErrors++;
        console.error("Category permissions:", categoryName, e.message);
      }

      for (const name of channelNames) {
        // Match inside this category first. If a same-named channel already exists elsewhere,
        // leave it where it is and create the requested channel here rather than moving it.
        let channel = guild.channels.cache.find(c => c.name === name && c.parentId === category.id);
        if (!channel) {
          const voice = ["🔊 Convoy Voice","🔊 General Voice"].includes(name);
          channel = await guild.channels.create({
            name,
            type: voice ? ChannelType.GuildVoice : ChannelType.GuildText,
            parent: category.id,
            reason: "BC TRUCK WORKS additive server setup"
          });
          channelsAdded++;
          if (channel.type === ChannelType.GuildText && messages[name]) {
            await channel.send(messages[name]).catch(() => {});
          }
        }

        // Keep staff channels private even if a channel already existed with custom overwrites.
        if (name === "🛠️│development") {
          // Development is more restricted than the general staff area.
          try { await channel.permissionOverwrites.set(devOverwrites, "Restrict BC TRUCK WORKS development channel to senior/development staff"); }
          catch (e) { permissionErrors++; console.error("Development permissions:", e.message); }
        } else if (isPrivate) {
          try { await channel.permissionOverwrites.set(privateOverwrites, "Secure BC TRUCK WORKS staff channel"); }
          catch (e) { permissionErrors++; console.error("Private channel permissions:", name, e.message); }
        } else if (announcementChannels.has(name)) {
          // Publicly readable announcement channels; only staff roles and the bot can post.
          const readOnlyOverwrites = [
            { id: everyone.id, allow: [PermissionFlagsBits.ViewChannel,PermissionFlagsBits.ReadMessageHistory], deny: [PermissionFlagsBits.SendMessages] },
            { id: botMember.id, allow: [PermissionFlagsBits.ViewChannel,PermissionFlagsBits.ReadMessageHistory,PermissionFlagsBits.SendMessages,PermissionFlagsBits.EmbedLinks,PermissionFlagsBits.ManageMessages] }
          ];
          for (const role of staffRoles.values()) {
            readOnlyOverwrites.push({ id: role.id, allow: [PermissionFlagsBits.ViewChannel,PermissionFlagsBits.ReadMessageHistory,PermissionFlagsBits.SendMessages,PermissionFlagsBits.EmbedLinks,PermissionFlagsBits.AttachFiles] });
          }
          try { await channel.permissionOverwrites.set(readOnlyOverwrites, "Make BC TRUCK WORKS announcements staff-posted"); }
          catch (e) { permissionErrors++; console.error("Announcement permissions:", name, e.message); }
        }
      }
    }

    // Ticket channels are placed in Driver Hub, without moving any existing channels.
    await postSupportPanel(guild);

    const summary = "✅ **BC TRUCK WORKS setup complete.**\n" +
      "• Added " + categoriesAdded + " missing categories\n" +
      "• Added " + channelsAdded + " missing channels\n" +
      "• Staff HQ is private to authorized staff roles\n" +
      "• Announcement channels are read-only for regular members\n" +
      "• Existing channels were not deleted or moved\n" +
      (permissionErrors ? "⚠️ " + permissionErrors + " permission update(s) failed. Check the NexusHost console for details." : "🔐 Category permissions applied successfully.");
    await interaction.editReply(summary);
  } catch (e) {
    console.error("SETUP ERROR:", e);
    await interaction.editReply("❌ Setup failed: " + String(e.message || e).slice(0, 700)).catch(() => {});
  }
}

// MUSIC — per-server queue, preserving /play /skip /stop /pause /resume /queue
const music = new Map();
function getMusic(guildId) {
  if (!music.has(guildId)) {
    const player = createAudioPlayer();
    const state = { queue: [], player, connection: null, textChannel: null, current: null, advancing: false };
    player.on(AudioPlayerStatus.Idle, () => playNext(guildId).catch(console.error));
    player.on("error", e => {
      console.error("Music player:", e.message);
      playNext(guildId).catch(console.error);
    });
    music.set(guildId, state);
  }
  return music.get(guildId);
}
async function playNext(guildId) {
  const state = music.get(guildId);
  if (!state || state.advancing) return;
  const next = state.queue.shift();
  if (!next) { state.current = null; return; }
  state.advancing = true;
  state.current = next;
  try {
    const stream = await play.stream(next.url, { quality: 2 });
    const resource = createAudioResource(stream.stream, { inputType: stream.type });
    state.player.play(resource);
    if (state.textChannel) await state.textChannel.send("▶️ Now playing: **" + next.title + "**").catch(() => {});
  } catch (e) {
    console.error("Music stream:", e.message);
    state.current = null;
    if (state.textChannel) await state.textChannel.send("❌ I couldn't play **" + next.title + "**. Try another song or YouTube URL.").catch(() => {});
    state.advancing = false;
    return playNext(guildId);
  } finally {
    state.advancing = false;
  }
}
async function musicPlay(interaction) {
  const voice = interaction.member?.voice?.channel;
  if (!voice) return interaction.reply({ content: "❌ Join a voice channel first.", ephemeral: true });
  const botMember = interaction.guild?.members?.me;
  const perms = voice.permissionsFor(botMember);
  if (!perms?.has(PermissionFlagsBits.Connect) || !perms?.has(PermissionFlagsBits.Speak)) {
    return interaction.reply({ content: "❌ I need **Connect** and **Speak** permissions in your voice channel.", ephemeral: true });
  }
  await interaction.deferReply({ ephemeral: true });
  const query = interaction.options.getString("query", true);
  const state = getMusic(interaction.guildId);
  state.textChannel = interaction.channel;
  try {
    let result;
    if (/^https?:\/\//i.test(query)) result = [{ url: query, title: query }];
    else result = await play.search(query, { limit: 1 });
    if (!result?.length) return interaction.editReply("❌ I couldn't find that song.");
    const song = result[0];
    if (!song.url) return interaction.editReply("❌ That result cannot be played.");
    if (!state.connection || state.connection.joinConfig.channelId !== voice.id) {
      if (state.connection) state.connection.destroy();
      state.connection = joinVoiceChannel({
        channelId: voice.id, guildId: interaction.guildId,
        adapterCreator: interaction.guild.voiceAdapterCreator, selfDeaf: true
      });
      await entersState(state.connection, VoiceConnectionStatus.Ready, 15000);
      state.connection.subscribe(state.player);
    }
    state.queue.push({ url: song.url, title: song.title || "Unknown track" });
    if (state.player.state.status !== AudioPlayerStatus.Playing && !state.current && !state.advancing) await playNext(interaction.guildId);
    return interaction.editReply("🎵 Added to queue: **" + (song.title || "Track") + "**");
  } catch (e) {
    console.error("Music error:", e);
    return interaction.editReply("❌ Music couldn't start. Check Connect/Speak permissions and the NexusHost console.");
  }
}
async function musicStop(interaction) {
  const state = music.get(interaction.guildId);
  if (!state) return interaction.reply({ content: "❌ No music is playing.", ephemeral: true });
  state.queue = [];
  state.current = null;
  state.player.stop(true);
  if (state.connection) state.connection.destroy();
  music.delete(interaction.guildId);
  return interaction.reply("⏹️ Music stopped and the queue was cleared.");
}
async function musicSkip(interaction) {
  const state = music.get(interaction.guildId);
  if (!state || !state.current) return interaction.reply({ content: "❌ Nothing is currently playing.", ephemeral: true });
  state.player.stop(true);
  return interaction.reply("⏭️ Skipped.");
}
async function musicPause(interaction) {
  const state = music.get(interaction.guildId);
  if (!state || !state.current) return interaction.reply({ content: "❌ Nothing is currently playing.", ephemeral: true });
  state.player.pause();
  return interaction.reply("⏸️ Paused.");
}
async function musicResume(interaction) {
  const state = music.get(interaction.guildId);
  if (!state || !state.current) return interaction.reply({ content: "❌ Nothing is currently playing.", ephemeral: true });
  state.player.unpause();
  return interaction.reply("▶️ Resumed.");
}
async function musicQueue(interaction) {
  const state = music.get(interaction.guildId);
  if (!state || (!state.current && !state.queue.length)) return interaction.reply({ content: "📭 The music queue is empty.", ephemeral: true });
  const current = state.current ? "▶️ **Now:** " + state.current.title : "▶️ **Now:** Nothing";
  const upcoming = state.queue.length ? state.queue.map((s, i) => (i + 1) + ". " + s.title).join("\n") : "No upcoming tracks.";
  return interaction.reply({ content: (current + "\n\n**Queue:**\n" + upcoming).slice(0, 2000), ephemeral: true });
}

async function queueGameCommand(interaction, command, payload = {}) {
  const key = process.env.DISCORD_COMMAND_API_KEY;
  if (!key) return interaction.reply({content:"❌ Game command bridge is not configured yet.",ephemeral:true});
  try {
    const response = await fetch(WEBSITE_URL + "/api/game-commands", {
      method:"POST",
      headers:{"content-type":"application/json","x-discord-command-key":key},
      body:JSON.stringify({discordId:interaction.user.id,command,payload})
    });
    const data = await response.json().catch(()=>({}));
    if (!response.ok) return interaction.reply({content:"❌ " + (data.error || "Your driver profile is not connected."),ephemeral:true});
    return interaction.reply({content:"🎮 **"+command+"** queued for your BC TRUCK WORKS game.",ephemeral:true});
  } catch (error) {
    console.error("Game command:",error.message);
    return interaction.reply({content:"❌ Game command service is unavailable.",ephemeral:true});
  }
}

// OWNER-ONLY UPDATE ASSISTANT
function announcementPackage(title,details,commit){
  const cleanTitle=title.trim()||"BC TRUCK WORKS Update";
  const cleanDetails=details.trim()||"The latest BC TRUCK WORKS update is now available.";
  const commitLine=commit?"\n\nUpdate reference: "+commit.slice(0,7):"";
  return "🚛 **BC TRUCK WORKS UPDATE**\n\n**"+cleanTitle+"**\n\n"+cleanDetails+"\n\nThank you for being part of BC TRUCK WORKS. More improvements are on the way."+commitLine;
}
async function publishDevelopmentUpdate(title,details,commit){
  try{
    const guild=await client.guilds.fetch(GUILD_ID);
    const channel=guild.channels.cache.find(c=>c.name==="🛠️│development"&&c.type===ChannelType.GuildText);
    if(!channel)return;
    const embed=new EmbedBuilder()
      .setColor(0x9B59B6)
      .setTitle("🛠️ BC TRUCK WORKS • DEVELOPMENT UPDATE")
      .setDescription(details)
      .addFields(
        {name:"📌 Update",value:title||"Development update"},
        {name:"🔗 GitHub",value:"https://github.com/"+GITHUB_REPO+"/commit/"+commit,inline:true},
        {name:"📦 Commit",value:commit.slice(0,7),inline:true}
      )
      .setTimestamp()
      .setFooter({text:"Private development channel • BC TRUCK WORKS"});
    await channel.send({embeds:[embed]});
  }catch(e){console.error("Development update:",e.message);}
}

let lastCommitSha=null;
function updateCategoryData(message,files){
  const text=String(message||"").toLowerCase();
  const names=(files||[]).map(f=>String(f.filename||"").toLowerCase()).join(" ");
  const added=[],improved=[],changed=[],fixed=[];
  if(/add|new|create|introduc|feature|implement|launch/.test(text))added.push("New functionality or a new feature was added.");
  if(/improv|enhanc|upgrade|better|optimiz|style|responsive/.test(text))improved.push("Existing functionality, performance, or presentation was improved.");
  if(/fix|bug|error|repair|patch|correct/.test(text))fixed.push("Issues and reliability improvements were addressed.");
  if(/change|update|refactor|modify|adjust|config|deploy/.test(text)||(!added.length&&!improved.length&&!fixed.length))changed.push("BC TRUCK WORKS platform code was updated.");
  if(/dashboard|web\/app|web\/lib|platform/.test(names))changed.push("Driver Hub / website components were touched.");
  if(/index\.js|discord|bot/.test(names))changed.push("Discord bot systems were touched.");
  if(/telemetry|connector/.test(names))changed.push("ATS / ETS2 telemetry systems were touched.");
  if(/package|workflow|github/.test(names))changed.push("Project/build infrastructure was touched.");
  return {added:[...new Set(added)],improved:[...new Set(improved)],changed:[...new Set(changed)],fixed:[...new Set(fixed)]};
}
function updateEmbed(commit){
  const message=(commit.commit?.message||"BC TRUCK WORKS Development Update").split("\n")[0];
  const groups=updateCategoryData(message,commit.files||[]);
  const embed=new EmbedBuilder()
    .setColor(0x2f7fbf)
    .setTitle("🚛 BC TRUCK WORKS • UPDATE")
    .setDescription("A new BC TRUCK WORKS platform update has been added to the project.")
    .addFields({name:"🆕 What's New",value:"**"+message+"**"})
    .setTimestamp(new Date(commit.commit?.author?.date||Date.now()))
    .setFooter({text:"BC TRUCK WORKS • Built for the road. Built for the community."});
  if(groups.added.length)embed.addFields({name:"🆕 Added",value:groups.added.map(x=>"• "+x).join("\n")});
  if(groups.improved.length)embed.addFields({name:"✨ Improved",value:groups.improved.map(x=>"• "+x).join("\n")});
  if(groups.changed.length)embed.addFields({name:"🔄 Changed",value:groups.changed.map(x=>"• "+x).join("\n")});
  if(groups.fixed.length)embed.addFields({name:"🛠️ Fixed",value:groups.fixed.map(x=>"• "+x).join("\n")});
  embed.addFields(
    {name:"🌐 Website",value:WEBSITE_URL,inline:true},
    {name:"🔗 GitHub",value:"https://github.com/"+GITHUB_REPO+"/commit/"+commit.sha,inline:true},
    {name:"📦 Commit",value:commit.sha.slice(0,7),inline:true}
  );
  return embed;
}
async function publishGitHubUpdate(commit){
  try{
    const guild=await client.guilds.fetch(GUILD_ID);
    const channel=guild.channels.cache.find(c=>c.name==="🛠️│development"&&c.type===ChannelType.GuildText);
    if(!channel)return;
    await channel.send({embeds:[updateEmbed(commit)]});
  }catch(e){console.error("GitHub development announcement:",e.message);}
}

async function checkGitHubUpdates(){
  try{
    const r=await fetch("https://api.github.com/repos/"+GITHUB_REPO+"/commits/main",{headers:{"Accept":"application/vnd.github+json","User-Agent":"BC-TRUCK-WORKS-Bot"}});
    if(!r.ok)return;
    const commit=await r.json();
    if(!lastCommitSha){lastCommitSha=commit.sha;return;}
    if(commit.sha===lastCommitSha)return;
    lastCommitSha=commit.sha;
    const detailResponse=await fetch("https://api.github.com/repos/"+GITHUB_REPO+"/commits/"+commit.sha,{headers:{"Accept":"application/vnd.github+json","User-Agent":"BC-TRUCK-WORKS-Bot"}});
    const detail=detailResponse.ok?await detailResponse.json():commit;
    const message=(detail.commit?.message||"BC TRUCK WORKS code update").split("\n")[0];
    await publishDevelopmentUpdate(message,"A new GitHub update was detected on the main branch. Development work and deployment details are posted here instead of being sent by DM.",detail.sha);
    await publishGitHubUpdate(detail);
  }catch(e){console.error("GitHub update check:",e.message);}
}

const commands=[
  new SlashCommandBuilder().setName("setup").setDescription("Add any missing BC TRUCK WORKS Discord channels and categories without deleting existing channels.").setDefaultMemberPermissions(PermissionFlagsBits.Administrator.toString()),
  new SlashCommandBuilder().setName("status").setDescription("Show bot and server status."),
  new SlashCommandBuilder().setName("truckworks").setDescription("Show BC TRUCK WORKS information."),
  new SlashCommandBuilder().setName("telemetry").setDescription("Show ATS / ETS2 telemetry information."),
  new SlashCommandBuilder().setName("play").setDescription("Play music in your voice channel.").addStringOption(o=>o.setName("query").setDescription("Song name or YouTube URL").setRequired(true)),
  new SlashCommandBuilder().setName("skip").setDescription("Skip the current song."),
  new SlashCommandBuilder().setName("stop").setDescription("Stop music and clear the queue."),
  new SlashCommandBuilder().setName("pause").setDescription("Pause the current song."),
  new SlashCommandBuilder().setName("resume").setDescription("Resume the current song."),
  new SlashCommandBuilder().setName("queue").setDescription("Show the music queue."),
  new SlashCommandBuilder().setName("truck").setDescription("Send an approved command to your connected ATS / ETS2 game.")
    .addSubcommand(s=>s.setName("status").setDescription("Show your game connection status."))
    .addSubcommand(s=>s.setName("pause").setDescription("Pause the game through the developer console."))
    .addSubcommand(s=>s.setName("save").setDescription("Save the current game."))
    .addSubcommand(s=>s.setName("screenshot").setDescription("Take an in-game screenshot."))
    .addSubcommand(s=>s.setName("echo").setDescription("Show a message in the game console.").addStringOption(o=>o.setName("message").setDescription("Message").setRequired(true)))
    .addSubcommand(s=>s.setName("route").setDescription("Run the developer console route command.").addStringOption(o=>o.setName("start").setDescription("Start city/company").setRequired(true)).addStringOption(o=>o.setName("end").setDescription("End city/company").setRequired(true)))
    .addSubcommand(s=>s.setName("time").setDescription("Set game time.").addIntegerOption(o=>o.setName("hour").setDescription("Hour 0-23").setMinValue(0).setMaxValue(23).setRequired(true)).addIntegerOption(o=>o.setName("minute").setDescription("Minute 0-59").setMinValue(0).setMaxValue(59).setRequired(false))),
  new SlashCommandBuilder().setName("update").setDescription("Owner-only: create a ready-to-post update announcement.").addStringOption(o=>o.setName("title").setDescription("Update title").setRequired(true)).addStringOption(o=>o.setName("details").setDescription("What changed").setRequired(true))
].map(c=>c.toJSON());

async function registerCommands(){
  const rest=new REST({version:"10"}).setToken(TOKEN);
  await rest.put(Routes.applicationGuildCommands(CLIENT_ID,GUILD_ID),{body:commands});
  console.log("Registered BC TRUCK WORKS Discord commands.");
}

client.once("ready",async()=>{
  console.log("========================================");
  console.log("BC TRUCK WORKS DISCORD BOT");
  console.log("Logged in as:",client.user.tag);
  console.log("========================================");
  client.user.setPresence({activities:[{name:"BC TRUCK WORKS • ATS / ETS2",type:ActivityType.Watching}],status:"online"});
  try{const guild=await client.guilds.fetch(GUILD_ID);await registerCommands();await ensureRoles(guild);await updateStatus();await postSupportPanel(guild);await checkGitHubUpdates();}catch(e){console.error("Startup:",e);}
  setInterval(updateStatus,300000);
  setInterval(checkGitHubUpdates,120000);
  console.log("BC TRUCK WORKS BOT IS ONLINE");
});

client.on("interactionCreate",async interaction=>{
  if(interaction.isStringSelectMenu() && interaction.customId==="bc_ticket_category"){
    try{
      await interaction.deferReply({ephemeral:true});
      return await createTicket(interaction,interaction.values[0]);
    }catch(e){
      console.error("Ticket create:",e);
      const message="❌ I couldn't create your ticket. "+(e?.code===50013?"The bot is missing a Discord permission. Ask an administrator to grant Manage Channels and View Channels.":e?.message?("Error: "+String(e.message).slice(0,180)):"Please ask a server administrator to check the bot permissions.");
      if(interaction.deferred||interaction.replied) return interaction.editReply(message).catch(()=>{});
      return interaction.reply({content:message,ephemeral:true}).catch(()=>{});
    }
  }
  if(interaction.isButton() && interaction.customId==="bc_ticket_close"){
    try {
      const channel=interaction.channel;
      const ticketOwnerId=channel?.topic?.startsWith("BC-TICKET:")?channel.topic.slice("BC-TICKET:".length):null;
      const staffNames=["Owner","Co-Owner","TruckWorks Director","TruckWorks Manager","Lead Developer","Developer","Web Developer","Bot Developer","Senior Moderator","Moderator","Support Team"];
      const isStaff=interaction.memberPermissions?.has(PermissionFlagsBits.Administrator) || interaction.member?.roles?.cache?.some(r=>staffNames.includes(r.name));
      if(!ticketOwnerId || (interaction.user.id!==ticketOwnerId && !isStaff)){
        return interaction.reply({content:"❌ Only the person who opened this ticket or an authorized staff member can close it.",ephemeral:true});
      }
      await interaction.reply({content:"🔒 Closing this ticket...",ephemeral:true});
      setTimeout(()=>channel.delete("BC TRUCK WORKS support ticket closed by "+interaction.user.tag).catch(()=>{}),1000);
    } catch(e) { console.error("Ticket close:",e); }
    return;
  }
  if(!interaction.isChatInputCommand())return;
  try{
    if(interaction.commandName==="setup")return setup(interaction);
    if(interaction.commandName==="truck"){
      const sub=interaction.options.getSubcommand();
      if(sub==="status") return interaction.reply({content:"📡 Game control is available when your BC TRUCK WORKS connector is online.",ephemeral:true});
      if(sub==="pause") return queueGameCommand(interaction,"pause");
      if(sub==="save") return queueGameCommand(interaction,"save");
      if(sub==="screenshot") return queueGameCommand(interaction,"screenshot");
      if(sub==="echo") return queueGameCommand(interaction,"echo",{message:interaction.options.getString("message",true)});
      if(sub==="route") return queueGameCommand(interaction,"route",{start:interaction.options.getString("start",true),end:interaction.options.getString("end",true)});
      if(sub==="time") return queueGameCommand(interaction,"time",{hour:interaction.options.getInteger("hour",true),minute:interaction.options.getInteger("minute")||0});
    }

    if(interaction.commandName==="status")return interaction.reply({embeds:[statusEmbed()]});
    if(interaction.commandName==="truckworks")return interaction.reply({embeds:[new EmbedBuilder().setTitle("🚛 BC TRUCK WORKS").setDescription("Trucking community and driver platform for ATS and ETS2.").addFields({name:"🌐 Website",value:WEBSITE_URL},{name:"🛣️ Games",value:"American Truck Simulator and Euro Truck Simulator 2"}).setTimestamp()]});
    if(interaction.commandName==="telemetry")return interaction.reply({embeds:[new EmbedBuilder().setTitle("📡 TELEMETRY").setDescription("Driver-side telemetry connects ATS / ETS2 data to BC TRUCK WORKS.").addFields({name:"Help",value:"Use #📡│telemetry-help or #🎫│support."}).setTimestamp()]});
    if(interaction.commandName==="play")return musicPlay(interaction);
    if(interaction.commandName==="skip")return musicSkip(interaction);
    if(interaction.commandName==="stop")return musicStop(interaction);
    if(interaction.commandName==="pause")return musicPause(interaction);
    if(interaction.commandName==="resume")return musicResume(interaction);
    if(interaction.commandName==="queue")return musicQueue(interaction);
    if(interaction.commandName==="update"){
      const guildOwnerId=OWNER_ID || interaction.guild?.ownerId;
      if(!guildOwnerId||interaction.user.id!==guildOwnerId)return interaction.reply({content:"❌ This command is owner-only.",ephemeral:true});
      const title=interaction.options.getString("title",true);
      const details=interaction.options.getString("details",true);
      return interaction.reply({content:announcementPackage(title,details),ephemeral:true});
    }
  }catch(e){
    console.error("Interaction:",e);
    const r={content:"❌ Something went wrong.",ephemeral:true};
    if(interaction.replied||interaction.deferred)await interaction.followUp(r).catch(()=>{});else await interaction.reply(r).catch(()=>{});
  }
});

client.on("error",e=>console.error("Discord error:",e));
client.on("warn",e=>console.warn("Discord warning:",e));
client.login(TOKEN).catch(e=>{console.error("Discord login failed:",e);process.exit(1);});
