const { Client, GatewayIntentBits } = require("discord.js");
const fs = require("fs");
const axios = require("axios");
require("dotenv").config();

const API_KEY = process.env.WEATHER_API_KEY;

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

client.on("messageCreate", async (message) => {

    if(message.content === "!info") {
        return message.reply(
                `!ping : verifica que el bot este activo papi.\n` +
                `!llimi : no necesita descripción.\n` +
                `!elo / !elo @ : mirar el op.gg de los 3 desgraciados \n` +
                `!jorge : datos curiosos del siempre curioso jorge \n ` +
                `!clima : ver el clima actual de barcelona`
            );
    }

    // !ping
    if (message.content === "!ping") {
        return message.reply("pong");
    }

    // !llimi
    if (message.content === "!llimi") {
        return message.reply("la chupa :smiling_imp: ");
    }

    // !elo general o con mención
    if (message.content.startsWith("!elo")) {
        const mencionado = message.mentions.users.first();

        // !elo general
        if (!mencionado) {
            const links = [
                "https://op.gg/lol/summoners/euw/TINYX1-EUW",
                "https://op.gg/lol/summoners/euw/iK3y-EUW",
                "https://op.gg/lol/summoners/euw/Euphoria1404-EUW"
            ];
    
            return message.reply("Aquí están los 3 perfiles mi rey:\n" + links.join("\n"));
        }
    
        // !elo @usuario
        const riotID = perfiles[mencionado.id];
    
        if (!riotID) {
            return message.reply(`${mencionado.username} no tiene Riot ID registrado.`);
        }
    
        const link = `https://op.gg/lol/summoners/euw/${encodeURIComponent(riotID)}`;
        return message.reply(`Mi Rey aquí tienes el elo de este aweonao llamado: "${mencionado.username}":\n${link}`);
    }

    // !jorge
    if (message.content === "!jorge") {
        const datos = fs.readFileSync("./datos.txt", "utf8").split("\n").filter(Boolean);
        const random = datos[Math.floor(Math.random() * datos.length)];
        return message.channel.send(`Jorge: "${random}"`);
    }


    if (message.content === "!clima") {
        try {
            const ciudad = "Barcelona";
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(ciudad)}&appid=${API_KEY}&units=metric&lang=es`;
            const { data } = await axios.get(url);

            const temp = data.main.temp;
            const humedad = data.main.humidity;
            const desc = data.weather[0].description;
            
            return message.channel.send(
                `☀️ Clima en **Barcelona**:\n` +
                `🌡️ Temperatura: ${temp}°C\n` +
                `💧 Humedad: ${humedad}%\n` +
                `🌤️ Condición: ${desc}`
            );

        } catch (err) {
            console.error(err);
            return message.reply("No se puede obtener el clima, ve a tocar pasto y compruebalo tu mismo");

        }

    }



});

// Login
client.login(process.env.TOKEN);
