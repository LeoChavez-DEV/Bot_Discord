# Discord Elo Bot

Bot de Discord desarrollado en Node.js que permite obtener enlaces de perfiles de League of Legends desde OP.GG y consultar el perfil específico de un usuario mencionado.

## Características

- Comando `!elo`:  
  Muestra 3 enlaces predefinidos de perfiles de OP.GG.

- Comando `!elo @usuario`:  
  Busca el Riot ID asociado al usuario mencionado y devuelve su enlace individual.

- Sistema de perfiles con `profiles.json`:  
  Guarda la relación entre IDs de usuarios de Discord y sus Riot IDs.

- Soporte para ejecución local o hosting 24/7 (Railway, Render, etc.).

---

## Requisitos

- Node.js (v16+ recomendado)
- Discord Bot Token
- Archivo `profiles.json` en la raíz del proyecto
- Variables de entorno configuradas (archivo `.env`)

---

## Instalación

1. Clona el repositorio:

```bash
https://github.com/LeoChavez-DEV/Bot_Discord.git
cd BOT_DISCORD
```
## Instalar Dependencias
```
npm install
```
## Crear un archivo .env en la raiz de tu proyecto
```
TOKEN=tu_token_aqui
```
## Tener un archivo profiles.json como por ejemplo
```
{
  "351738005293236234": "TINYX1-EUW",
  "447862976792363009": "iK3y-EUW",
  "297079628315623424": "Euphoria1404-EUW"
}
```
## Teniendo todo esto se puede ejecutar el programa en local
```
node index.js
```
## Si todo va bien se deberia de ver
```
Bot conectado como NombreDelBot#0000
```

