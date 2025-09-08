const fs = require("fs");
global.prefix = ["."]; 
global.public = true
global.owner = ["24165183695"] 
global.namabot = 'ASK BASE BOT'
global.chanel = 'https://whatsapp.com/channel/0029Vb62KL4KmCPWvI5EHD2S'
global.group = 'https://chat.whatsapp.com/GVKSMHB1zW6EdVdQ90wXV6'
global.antidelete = true
global.welcome = true
global.adminevent = true 
global.botname = 'ASK XMD'
global.adminsgcevent = true
global.ownername = 'DEV ASK'
global.packname = 'ASK XMD'
global.author = '𝙳𝙴𝚅𝙴𝙻𝙾𝙿𝙿𝙴 𝙼𝙰𝙽𝙶𝙴 𝙱𝙰𝙸𝚂𝙴 𝙳𝙾𝚁𝙼𝙸𝚁 🎀'

global.mess = {
    owner: `╭━〔 🚫 𝖠𝖢𝖢𝖤𝖲 𝖢𝖫𝖮𝖲𝖤 🚫 〕━⬣
> ⚠️ 𝖲𝖮𝖱𝖱𝖸 𝖢𝖫𝖮𝖲𝖤,
> Cette fonctionnalité est exclusivement réservée aux propriétaires de bots !
╰━━━━━━━━━━━━━━━━━⬣`,

    admin: `╭━〔 🚫 𝖠𝖢𝖢𝖤𝖲 𝖢𝖫𝖮𝖲𝖤 🚫 〕━⬣
> ⚠️ 𝖲𝖮𝖱𝖱𝖸 𝖢𝖫𝖮𝖲𝖤,
> Cette fonctionnalité est réservée aux administrateurs de groupe !
╰━━━━━━━━━━━━━━━━━⬣`,

    botAdmin: `╭━〔 🚫 𝖠𝖢𝖢𝖤𝖲 𝖢𝖫𝖮𝖲𝖤 🚫 〕━
> ⚠️ 𝖲𝖮𝖱𝖱𝖸 𝖢𝖫𝖮𝖲𝖤,
> Le bot doit être administrateur !
╰━━━━━━━━━━━━━━━━━`, 

    group: `╭━〔 🚫 𝖠𝖢𝖢𝖤𝖲 𝖢𝖫𝖮𝖲𝖤 🚫 〕━⬣
> ⚠️ 𝖲𝖮𝖱𝖱𝖸 𝖢𝖫𝖮𝖲𝖤,
>  Fonctionnalités réservées aux groupes ! 
╰━━━━━━━━━━━━━━━━━⬣`,

    private: `╭━〔 🚫 𝖠𝖢𝖢𝖤𝖲 𝖢𝖫𝖮𝖲𝖤🚫 〕━⬣
┃ ⚠️ 𝖲𝖮𝖱𝖱𝖸 𝖢𝖫𝖮𝖲𝖤,
┃ Fonctionnalités réservées au chat privé !
╰━━━━━━━━━━━━━━━━━⬣`,

    prem: `╭━〔 🚫 𝖠𝖢𝖢𝖤𝖲 𝖢𝖫𝖮𝖲𝖤 🚫 〕━⬣
┃ ⚠️ 𝖲𝖮𝖱𝖱𝖸 𝖢𝖫𝖮𝖲𝖤
┃ Fonctionnalités spéciales pour les utilisateurs Premium !
╰━━━━━━━━━━━━━━━━━⬣`,

    wait: `╭━〔 𝖫𝖠𝖮𝖣𝖨𝖭𝖦....〕━⬣
┃ 📝 𝖶𝖠𝖨𝖳 𝖯𝖱𝖮𝖢𝖤𝖲𝖲𝖨𝖭𝖦...
┃  Veuillez patienter un instant 
╰━━━━━━━━━━━━━━━━━⬣`,

    error: `╭━〔 𝖤𝖱𝖱𝖮𝖱..😞 ━⬣ 
┃ ❌ 𝖤𝖱𝖱𝖮𝖱 𝖲𝖸𝖲𝖳𝖤𝖬 
┃  Veuillez réessayer plus tard 
╰━━━━━━━━━━━━━━━━━⬣`,

    done: `╭━〔 𝖲𝖴𝖢𝖢𝖤𝖲𝖲 〕━⬣
┃ ✅Réussi !
╰━━━━━━━━━━━━━━━━━⬣`
};