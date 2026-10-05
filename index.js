const {
  Client, GatewayIntentBits, ActivityType, ChannelType, PermissionFlagsBits,
  SlashCommandBuilder, EmbedBuilder, REST, Routes
} = require("discord.js");
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus, entersState } = require("@discordjs/voice");
const play = require("play-dl");

const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.DISCORD_CLIENT_ID || "1556044045195935775";
const GUILD_ID = process.env.DISCORD_GUILD_ID || "1546265801500266611";
const WEBSITE_URL = process.env.TRUCKWORKS_WEBSITE_URL || "https://bctruckworks.vercel.app";
const OWNER_ID = process.env.OWNER_DISCORD_ID || "";
const GITHUB_REPO = "dospatch/bc-truck-works";

if (!TOKEN) { console.error("DISCORD_TOKEN is missing."); process.exit(1); }

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });

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
      {name:"🎵 Music",value:"🟢 Enabled",inline:true},
      {name:"⚙️ Version",value:"2.1.0",inline:true}
    ).setTimestamp().setFooter({text:"BC TRUCK WORKS"});
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

async function setup(interaction) {
  if (!interaction.guild) return interaction.reply({content:"❌ Use this command inside the server.",ephemeral:true});
  if (!interaction.memberPermissions.has(PermissionFlagsBits.Administrator)) return interaction.reply({content:"❌ Administrator permission is required.",ephemeral:true});
  await interaction.deferReply({ephemeral:true});
  const me=interaction.guild.members.me;
  if(!me || !me.permissions.has(PermissionFlagsBits.ManageChannels)) return interaction.editReply("❌ I need Manage Channels permission.");
  try {
    await interaction.editReply("🛠️ Rebuilding BC TRUCK WORKS...");
    for(const c of [...interaction.guild.channels.cache.values()]) if(c.deletable && c.type!==ChannelType.GuildCategory) await c.delete("BC TRUCK WORKS rebuild");
    for(const c of [...interaction.guild.channels.cache.values()]) if(c.deletable && c.type===ChannelType.GuildCategory) await c.delete("BC TRUCK WORKS rebuild");
    let categories=0,channels=0;
    for(const [categoryName,channelNames] of layout){
      const category=await interaction.guild.channels.create({name:categoryName,type:ChannelType.GuildCategory}); categories++;
      for(const name of channelNames){
        const voice=["🚛│Truckers","◎│Convoy 1","◎│Convoy 2","🎙️│Driver Lounge","🔊│Dispatch"].includes(name);
        const type=voice?ChannelType.GuildVoice:ChannelType.GuildText;
        const channel=await interaction.guild.channels.create({name,type,parent:category.id}); channels++;
        if(type===ChannelType.GuildText && messages[name]) await channel.send(messages[name]);
      }
    }
    await interaction.editReply("✅ BC TRUCK WORKS setup complete! Categories: "+categories+" | Channels: "+channels);
    setTimeout(updateStatus,3000);
  } catch(e){ console.error("SETUP ERROR:",e); await interaction.editReply("❌ Setup failed: "+e.message); }
}

// MUSIC
const music=new Map();
function getMusic(guildId){
  if(!music.has(guildId)){
    const player=createAudioPlayer();
    const state={queue:[],player,connection:null,textChannel:null,current:null};
    player.on(AudioPlayerStatus.Idle,()=>playNext(guildId).catch(console.error));
    player.on("error",e=>{console.error("Music player:",e.message);playNext(guildId).catch(console.error);});
    music.set(guildId,state);
  }
  return music.get(guildId);
}
async function playNext(guildId){
  const state=music.get(guildId); if(!state)return;
  const next=state.queue.shift(); if(!next){state.current=null;return;}
  state.current=next;
  try{
    const stream=await play.stream(next.url,{quality:2});
    const resource=createAudioResource(stream.stream,{inputType:stream.type});
    state.player.play(resource);
    if(state.textChannel) await state.textChannel.send("▶️ Now playing: **"+next.title+"**").catch(()=>{});
  }catch(e){
    if(state.textChannel) await state.textChannel.send("❌ I couldn't play that track. Try another YouTube URL or search.").catch(()=>{});
    await playNext(guildId);
  }
}
async function musicPlay(interaction){
  const voice=interaction.member?.voice?.channel;
  if(!voice)return interaction.reply({content:"❌ Join a voice channel first.",ephemeral:true});
  await interaction.deferReply();
  const query=interaction.options.getString("query",true);
  const state=getMusic(interaction.guildId); state.textChannel=interaction.channel;
  try{
    let result;
    if(/^https?:\/\//i.test(query)) result=[{url:query,title:query}];
    else result=await play.search(query,{limit:1});
    if(!result?.length)return interaction.editReply("❌ I couldn't find that song.");
    const song=result[0];
    if(!song.url)return interaction.editReply("❌ That result cannot be played.");
    if(!state.connection || state.connection.joinConfig.channelId!==voice.id){
      state.connection=joinVoiceChannel({channelId:voice.id,guildId:interaction.guildId,adapterCreator:interaction.guild.voiceAdapterCreator,selfDeaf:true});
      await entersState(state.connection,VoiceConnectionStatus.Ready,15000);
      state.connection.subscribe(state.player);
    }
    state.queue.push({url:song.url,title:song.title||"Unknown track"});
    if(state.player.state.status!==AudioPlayerStatus.Playing && !state.current) await playNext(interaction.guildId);
    await interaction.editReply("🎵 Added to queue: **"+(song.title||"Track")+"**");
  }catch(e){console.error("Music error:",e);await interaction.editReply("❌ Music couldn't start. Check that I can Connect and Speak in your voice channel.");}
}
async function musicStop(interaction){
  const state=music.get(interaction.guildId); if(!state)return interaction.reply("❌ No music is playing.");
  state.queue=[];state.current=null;state.player.stop(true);if(state.connection)state.connection.destroy();music.delete(interaction.guildId);
  return interaction.reply("⏹️ Music stopped and the queue was cleared.");
}
async function musicSkip(interaction){
  const state=music.get(interaction.guildId);if(!state||!state.current)return interaction.reply("❌ Nothing is currently playing.");
  state.player.stop(true);return interaction.reply("⏭️ Skipped.");
}
async function musicPause(interaction){
  const state=music.get(interaction.guildId);if(!state||!state.current)return interaction.reply("❌ Nothing is currently playing.");
  state.player.pause();return interaction.reply("⏸️ Paused.");
}
async function musicResume(interaction){
  const state=music.get(interaction.guildId);if(!state||!state.current)return interaction.reply("❌ Nothing is currently playing.");
  state.player.unpause();return interaction.reply("▶️ Resumed.");
}
async function musicQueue(interaction){
  const state=music.get(interaction.guildId);
  if(!state||(!state.current&&!state.queue.length))return interaction.reply("📭 The music queue is empty.");
  const current=state.current?"▶️ **Now:** "+state.current.title:"▶️ **Now:** Nothing";
  const upcoming=state.queue.length?state.queue.map((s,i)=>(i+1)+". "+s.title).join("\n"):"No upcoming tracks.";
  return interaction.reply((current+"\n\n**Queue:**\n"+upcoming).slice(0,2000));
}

// OWNER-ONLY UPDATE ASSISTANT
function announcementPackage(title,details,commit){
  const cleanTitle=title.trim()||"BC TRUCK WORKS Update";
  const cleanDetails=details.trim()||"The latest BC TRUCK WORKS update is now available.";
  const commitLine=commit?"\n\nUpdate reference: "+commit.slice(0,7):"";
  const announcement="🚛 **BC TRUCK WORKS UPDATE**\n\n**"+cleanTitle+"**\n\n"+cleanDetails+"\n\nThank you for being part of BC TRUCK WORKS. More improvements are on the way."+commitLine;
  return "🔒 **YOUR BC TRUCK WORKS UPDATE TO-DO**\n\n1. Wait for the website/deployment to show **READY**.\n2. Confirm the Discord bot is **ONLINE**.\n3. Test the feature that was changed.\n4. Check the website and Discord channels affected by the update.\n5. Copy the announcement below exactly and post it in **#📢│announcements**.\n6. Do not announce an update that has not passed the checks above.\n\n📢 **COPY/PASTE ANNOUNCEMENT**\n\n"+announcement;
}
async function sendOwnerUpdate(title,details,commit){
  if(!OWNER_ID)return;
  try{
    const owner=await client.users.fetch(OWNER_ID);
    await owner.send(announcementPackage(title,details,commit));
  }catch(e){console.error("Owner update DM:",e.message);}
}
let lastCommitSha=null;
async function checkGitHubUpdates(){
  try{
    const r=await fetch("https://api.github.com/repos/"+GITHUB_REPO+"/commits/main",{headers:{"Accept":"application/vnd.github+json","User-Agent":"BC-TRUCK-WORKS-Bot"}});
    if(!r.ok)return;
    const commit=await r.json();
    if(!lastCommitSha){lastCommitSha=commit.sha;return;}
    if(commit.sha===lastCommitSha)return;
    lastCommitSha=commit.sha;
    const message=(commit.commit?.message||"BC TRUCK WORKS code update").split("\n")[0];
    await sendOwnerUpdate(message,"A new GitHub update was pushed. Complete the checks below before announcing it to the community.",commit.sha);
  }catch(e){console.error("GitHub update check:",e.message);}
}

const commands=[
  new SlashCommandBuilder().setName("setup").setDescription("Build or rebuild the BC TRUCK WORKS Discord server.").setDefaultMemberPermissions(PermissionFlagsBits.Administrator.toString()),
  new SlashCommandBuilder().setName("status").setDescription("Show bot and server status."),
  new SlashCommandBuilder().setName("truckworks").setDescription("Show BC TRUCK WORKS information."),
  new SlashCommandBuilder().setName("telemetry").setDescription("Show ATS / ETS2 telemetry information."),
  new SlashCommandBuilder().setName("play").setDescription("Play music in your voice channel.").addStringOption(o=>o.setName("query").setDescription("Song name or YouTube URL").setRequired(true)),
  new SlashCommandBuilder().setName("skip").setDescription("Skip the current song."),
  new SlashCommandBuilder().setName("stop").setDescription("Stop music and clear the queue."),
  new SlashCommandBuilder().setName("pause").setDescription("Pause the current song."),
  new SlashCommandBuilder().setName("resume").setDescription("Resume the current song."),
  new SlashCommandBuilder().setName("queue").setDescription("Show the music queue."),
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
  try{await registerCommands();await updateStatus();await checkGitHubUpdates();}catch(e){console.error("Startup:",e);}
  setInterval(updateStatus,300000);
  setInterval(checkGitHubUpdates,120000);
  console.log("BC TRUCK WORKS BOT IS ONLINE");
});

client.on("interactionCreate",async interaction=>{
  if(!interaction.isChatInputCommand())return;
  try{
    if(interaction.commandName==="setup")return setup(interaction);
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
      if(!OWNER_ID||interaction.user.id!==OWNER_ID)return interaction.reply({content:"❌ This command is owner-only.",ephemeral:true});
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
