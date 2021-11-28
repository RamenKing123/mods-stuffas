require("http").createServer((req, res) => res.end("SadSenpai")).listen(process.env.PORT || 8080)
require("dotenv").config();
const { Client, Collection } = require("discord.js");
const UrlsConfig = require("./database/models/UrlsConfig");
const fetchProjects = require("./fetchProjects");
const { timeout, disable_fetching } = require("./config.json");
const { MessageMenuOption, MessageMenu } = require("discord-buttons")
const { GiveawaysManager } = require('discord-giveaways');
const readlineSync = require('readline-sync');
const { MessageEmbed } = require('discord.js')
const Discord = require('discord.js'); //Requiring Discord.js module.
const DiscordButtons = require('discord-buttons'); //Requiring Discord-BUttons module.



const button = require('discord-buttons');
const disbut = require("discord-buttons")
const { hangman } = require('reconlx')

const prefix = "l.";
const Nuggies = require('nuggies');
Nuggies.connect(process.env.MONGO_URI);
const client = new Client({
  disableEveryone: true,
});
disbut(client);

(async () => {
  await require("./database/connect")();

  let pros = await UrlsConfig.find();

  client.commands = new Collection();
  client.aliases = new Collection();
  client.projectsSize = 0;
  client.projects = pros.map((p) => p.projectURL);
  UrlsConfig.countDocuments({}, async (err, total) => {
    client.projectsSize = total;

    ["command", "events"].forEach((handler) => {
      require(`./handlers/${handler}`)(client);
    });

    await client.login(process.env.TOKEN);

    if (!disable_fetching) fetchProjects(client.projects, client);
  });
})();
client.giveawaysManager = new GiveawaysManager(client, {
  storage: "./giveaways.json",
  updateCountdownEvery: 5000,
  default: {
    botsCanWin: false,
    embedColor: "#b9f2",
    reaction: "🎉"
  }
});

//create buttons

// pinging
setInterval(async () => {
  UrlsConfig.countDocuments({}, (err, total) => {
    client.projectsSize = total;
    client.user.setActivity(`+help`, {
      type: "STREAMING",
    });
  });



  if (!disable_fetching) fetchProjects(client.projects, client);
}, timeout);

client.snipes = new Map();
client.on('messageDelete', function(message, channel){
client.snipes.set(message.channel.id,{
 content:message.content,
 author:message.author.tag,
 image:message.attachments.first() ? message.attachments.first().proxyURL : null
})
})



client.on('guildCreate', guild => {
    const channel = guild.channels.cache.find(channel => channel.type === 'text' && channel.permissionsFor(guild.me).has('SEND_MESSAGES'))
 let embed = new MessageEmbed()
 .setColor('RED')
 .setTitle('Connected To New Server')
 .setURL('')
 .setDescription(' <a:loading:881979583577092197> Thank You For Inviting Me. My prefix is `+`. Run +help for more info about me!')
 .setThumbnail('https://images-ext-2.discordapp.net/external/ez9kX9WbGXaPxgmP0OcOtBmWhyUnBix5-HCc4WkyjxA/%3Fsize%3D512/https/cdn.discordapp.com/icons/911477934332715100/c577dfdcaf1520388798f6503895c1ed.webp?width=335&height=335')

 .setImage('https://i.imgur.com/kvV3fT3.gif')
 .setTimestamp()
 .setFooter('SkyAnime');
channel.send(embed);
}) 

client.on('guildCreate', async guild => {
  let owner = await client.users.fetch('801334443281219584')
  owner.send(new Discord.MessageEmbed()
  .setTitle("New Guild!")
  .setDescription(`<a:867324408308695070:892077506860040233> I have been added to **${guild.name}** with **${guild.memberCount}** members`)
  .setColor("BLACK"))
} )                

