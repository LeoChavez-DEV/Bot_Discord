const fs = require("fs");

const LOCK_FILE = "/tmp/bot.lock";

try {
    if (fs.existsSync(LOCK_FILE)) {
        console.log("Otra instancia detectada, cerrando esta...");
        process.exit(0);
    }

    fs.writeFileSync(LOCK_FILE, process.pid.toString());

    const cleanup = () => {
        try {
            if (fs.existsSync(LOCK_FILE)) {
                fs.unlinkSync(LOCK_FILE);
            }
        } catch (e) {
            console.error("Error limpiando lock:", e);
        }
        process.exit(0);
    };

    process.on("SIGINT", cleanup);
    process.on("SIGTERM", cleanup);
    process.on("exit", cleanup);

} catch (err) {
    console.error("Error gestionando el lock:", err);
}

const { Client, GatewayIntentBits } = require("discord.js");
const axios = require("axios");
require("dotenv").config();

if (!process.env.TOKEN) {
    console.error("TOKEN no definido. Abortando.");
    process.exit(1);
}

if (!process.env.WEATHER_API_KEY) {
    console.warn("WEATHER_API_KEY no definido. El comando !clima fallará.");
}

const API_KEY = process.env.WEATHER_API_KEY;

let perfiles = {};
try {
    perfiles = JSON.parse(fs.readFileSync("profiles.json", "utf8"));
} catch (err) {
    console.error("No se pudo cargar profiles.json:", err);
}

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
    if (message.author.bot) return;

    if (message.content === "!info") {
        return message.reply(
            `!ping : verifica que el bot este activo papi\n` +
            `!llimi : no necesita descripción\n` +
            `!elo / !elo @ : mirar el op.gg de los 3 desgraciados\n` +
            `!jorge : datos curiosos del siempre curioso jorge\n` +
            `!clima : ver el clima actual de barcelona`
        );
    }

    if (message.content === "!ping") {
        return message.reply("pong");
    }

    if (message.content === "!llimi") {
        return message.reply("la chupa :smiling_imp:");
    }

    if (message.content.startsWith("!elo")) {
        const mencionado = message.mentions.users.first();

        if (!mencionado) {
            const links = [
                "https://op.gg/lol/summoners/euw/TINYX1-EUW",
                "https://op.gg/lol/summoners/euw/iK3y-EUW",
                "https://op.gg/lol/summoners/euw/Euphoria1404-EUW"
            ];

            return message.reply("Aquí están los 3 perfiles mi rey:\n" + links.join("\n"));
        }

        const riotID = perfiles[mencionado.id];

        if (!riotID) {
            return message.reply(`${mencionado.username} no tiene Riot ID registrado.`);
        }

        const link = `https://op.gg/lol/summoners/euw/${encodeURIComponent(riotID)}`;
        return message.reply(
            `Mi Rey aquí tienes el elo de este aweonao llamado: "${mencionado.username}":\n${link}`
        );
    }

    if (message.content === "!jorge") {
        try {
            const datos = fs.readFileSync("./datos.txt", "utf8")
                .split("\n")
                .filter(Boolean);

            const random = datos[Math.floor(Math.random() * datos.length)];
            return message.channel.send(`Jorge: "${random}"`);
        } catch (err) {
            console.error("Error leyendo datos.txt:", err);
            return message.reply("Jorge se perdió, vuelve luego.");
        }
    }

    if (message.content === "!clima") {
        try {
            if (!API_KEY) {
                return message.reply("El clima no está configurado, reclámale al admin.");
            }

            const ciudad = "Barcelona";
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
                ciudad
            )}&appid=${API_KEY}&units=metric&lang=es`;

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
            console.error("Error clima:", err.response?.data || err.message);
            return message.reply("No se puede obtener el clima, ve a tocar pasto y compruébalo tú mismo.");
        }
    }
});

process.on("unhandledRejection", (err) => {
    console.error("Unhandled rejection:", err);
});

process.on("uncaughtException", (err) => {
    console.error("Uncaught exception:", err);
});


client.login(process.env.TOKEN).catch(err => {
    console.error("Error al loguear el bot:", err);
    process.exit(1);
});
