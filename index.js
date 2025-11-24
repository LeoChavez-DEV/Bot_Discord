const { Client, GatewayIntentBits } = require("discord.js");
const fs = require("fs");
require("dotenv").config();

//  profiles.json
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

// Escucha todos los mensajes
client.on("messageCreate", (message) => {

    if (message.content === "!ping") {
        message.reply("pong");
    }
    if (message.content === "!llimi") {
        message.reply("la chupa :smiling_imp: ")
    }

    // Comando !elo
    if (message.content.startsWith("!elo")) {
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
    
        // !elo @usuario
        const riotID = perfiles[mencionado.id];
    
        if (!riotID) {
            message.reply(`${mencionado.username} no tiene Riot ID registrado.`);
            return;
        }
    
        const link = `https://op.gg/lol/summoners/euw/${encodeURIComponent(riotID)}`;
        message.reply(`Mi Rey aquí tienes el elo de este aweonao llamado: " ${mencionado.username} ":\n${link}`);
    }

    // Comando !jorge
    if (message.content === "!jorge") {
        const datos = fs.readFileSync("./datos.txt", "utf8").split("\n").filter(Boolean);
        const random = datos[Math.floor(Math.random() * datos.length)];
        message.channel.send(`Jorge: "${random}"`);
    }

});

// Login
client.login(process.env.TOKEN);
