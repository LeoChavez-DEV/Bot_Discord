const { Client, GatewayIntentBits } = require("discord.js");
const fs = require("fs");
require("dotenv").config();

// Cargamos el archivo profiles.json
let perfiles = JSON.parse(fs.readFileSync("profiles.json", "utf8"));

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once("ready", () => {
    console.log(`Bot conectado como ${client.user.tag}`);
});

// Comando !ping
client.on("messageCreate", (message) => {
    if (message.content === "!ping") {
        message.reply("pong");
    }
});

// Comando !elo
client.on("messageCreate", (message) => {
    if (!message.content.startsWith("!elo")) return;

    const mencionado = message.mentions.users.first();

    // !elo general
    if (!mencionado) {
        const links = [
            "https://op.gg/lol/summoners/euw/TINYX1-EUW",
            "https://op.gg/lol/summoners/euw/iK3y-EUW",
            "https://op.gg/lol/summoners/euw/Euphoria1404-EUW"
        ];

        message.reply("Aquí están los 3 perfiles mi rey:\n" + links.join("\n"));
        return;
    }

    // Caso !elo @usuario
    const riotID = perfiles[mencionado.id];

    if (!riotID) {
        message.reply(`${mencionado.username} no tiene Riot ID registrado.`);
        return;
    }

    const link = `https://op.gg/lol/summoners/euw/${encodeURIComponent(riotID)}`;
    message.reply(`Mi Rey aquí tienes el elo de este aweonao llamado: " ${mencionado.username} ":\n${link}`);
});

// Login
client.login(process.env.TOKEN);
