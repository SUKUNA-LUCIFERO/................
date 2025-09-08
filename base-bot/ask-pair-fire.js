require('./system/config')
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, makeInMemoryStore, jidDecode, downloadContentFromMessage } = require('@whiskeysockets/baileys');
const { Buffer } = require('buffer');
const pino = require('pino');
const FileType = require('file-type');
const fetch = require('node-fetch');
const moment = require('moment-timezone');
const chalk = require('chalk');
const readline = require('readline');
const os = require('os');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
globalThis.crypto = crypto.webcrypto;
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require('./system/myLib/ASK-BASE-TO-WEB');
const { smsg, fetchJson, await: awaitfunc, sleep } = require('./system/myLib/FuncIndex');

const store = makeInMemoryStore({ logger: pino().child({ level: "silent" }) });

let pairingCodeErrorShown = false;
const reconnectAttempts = {};
const pairingRequested = {}; 

function deleteFolderRecursive(folderPath) {
    if (fs.existsSync(folderPath)) {
        fs.readdirSync(folderPath).forEach(file => {
            const curPath = path.join(folderPath, file);
            fs.lstatSync(curPath).isDirectory() ? deleteFolderRecursive(curPath) : fs.unlinkSync(curPath);
        });
        fs.rmdirSync(folderPath);
    }
}

// ==============================================
// SYSTÈME ANTI-SPAM INTÉGRÉ (CORRIGÉ)
// ==============================================
class AntiSpamSystem {
    constructor(ask) {
        this.ask = ask;
        this.userMessageCount = new Map();
        this.blockedUsers = new Set();
        this.linkRegex = /(https?:\/\/[^\s]+|wa\.me|whatsapp\.com)/gi;
    }

    async handleMessage(m) {
        try {
            const sender = m.key.remoteJid;
            if (!sender || m.key.fromMe || this.blockedUsers.has(sender)) return true;

            const text = m.message?.conversation || m.message?.extendedTextMessage?.text || "";
            
            // Détection flood
            const count = (this.userMessageCount.get(sender) || 0) + 1;
            this.userMessageCount.set(sender, count);
            if (count >= 10) {
                await this.punishUser(m, "FLOOD");
                return true;
            }

            // Détection liens spam
            if ((text.match(this.linkRegex) || []).length >= 2) {
                await this.punishUser(m, "LIENS SPAM");
                return true;
            }

            return false;
        } catch (error) {
            console.error('AntiSpam Error:', error);
            return false;
        }
    }

    async punishUser(m, reason) {
        const sender = m.key.remoteJid;
        try {
            await this.ask.sendMessage(m.key.remoteJid, { delete: m.key });
            await this.ask.updateBlockStatus(sender, "block");
            this.blockedUsers.add(sender);
            
            await this.ask.sendMessage(sender, { 
                text: `🚨 *BLOQUÉ POUR SPAM* 🚨\nRaison: ${reason}`
            });
           
            console.log(chalk.red(`[ANTI-SPAM] ${sender} bloqué pour ${reason}`));
        } catch (error) {
            console.error('Erreur punishUser:', error);
        }
    }
}

// ==============================================
// FONCTIONS UTILITAIRES
// ==============================================
async function getBuffer(url) {
    try {
        const response = await fetch(url);
        return await response.buffer();
    } catch (e) {
        console.error("Erreur getBuffer:", e);
        return null;
    }
}

async function getProfilePicture(jid, type = 'image') {
    try {
        const url = await ask.profilePictureUrl(jid, type);
        return url || (type === 'user' 
            ? 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
            : 'https://i.ibb.co/RBx5SQC/avatar-group-large-v2.png');
    } catch (e) {
        console.error('Erreur getProfilePicture:', e);
        return type === 'user' 
            ? 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
            : 'https://i.ibb.co/RBx5SQC/avatar-group-large-v2.png';
    }
}

function loadGroupSettings() {
    try {
        return JSON.parse(fs.readFileSync('./system/database/groupSettings.json'));
    } catch (e) {
        console.error('Erreur groupSettings:', e);
        return {};
    }
}

// ==============================================
// FONCTION PRINCIPALE START PAIRING CONNECT
// ==============================================
async function startpairing(askNumber) {
    try {
        const sessionPath = `./sessions/${askNumber}`;

        if (!fs.existsSync(`${sessionPath}/creds.json`)) {
            console.warn(chalk.yellow(`[${askNumber}] No session found, starting fresh.`));
        }

        const { state, saveCreds } = await useMultiFileAuthState(sessionPath);

        if (!state?.creds) {
            console.warn(chalk.red(`[${askNumber}] Invalid session state. Resetting.`));
            deleteFolderRecursive(sessionPath);
            return setTimeout(() => startpairing(askNumber), 5000);
        }

        const ask = makeWASocket({
            logger: pino({ level: "silent" }),
            printQRInTerminal: false,
            auth: state,
            version: [2, 3000, 1017531287],
            browser: Browsers.ubuntu("Edge"),
            getMessage: async key => {
                const jid = jidNormalizedUser(key.remoteJid);
                const msg = await store.loadMessage(jid, key.id);
                return msg?.message || '';
            },
            shouldSyncHistoryMessage: msg => {
                console.log(`\x1b[32mLoading Chat [${msg.progress}%]\x1b[39m`);
                return !!msg.syncType;
            }
        });

        store.bind(ask.ev);

        const keepAliveInterval = setInterval(() => {
            if (ask?.user) {
                ask.sendPresenceUpdate('available').catch(err => {
                    console.error("Keep-alive failed:", err.message);
                });
            }
        }, 1000 * 60 * 30);

        if (!state.creds.registered && askNumber && !pairingRequested[askNumber]) {
            pairingRequested[askNumber] = true;
            const phoneNumber = askNumber.replace(/[^0-9]/g, '');

            setTimeout(async () => {
                try {
                    let code = await ask.requestPairingCode(phoneNumber);
                    code = code?.match(/.{1,4}/g)?.join("-") || code;
                    fs.writeFileSync(`./system/database/pairing.json`, JSON.stringify({ code }, null, 2));
                } catch (err) {
                    if (!pairingCodeErrorShown) {
                        console.error("Error requesting pairing code:", err.stack || err.message);
                        pairingCodeErrorShown = true;
                    }
                }
            }, 1703);
        }

        const badSessionRetries = {};

        ask.ev.on("connection.update", async update => {
            const { connection, lastDisconnect } = update;
            const statusCode = new Boom(lastDisconnect?.error)?.output?.statusCode;

            try {
                if (connection === "close") {
                    clearInterval(keepAliveInterval);

                    switch (statusCode) {
                        case DisconnectReason.badSession:
                            badSessionRetries[askNumber] = (badSessionRetries[askNumber] || 0) + 1;

                            if (badSessionRetries[askNumber] <= 6) {
                                console.log(chalk.yellow(`[${askNumber}] Bad session detected. Retrying (${badSessionRetries[askNumber]}/6) without deleting session...`));
                                pairingRequested[askNumber] = false;
                                return setTimeout(() => startpairing(askNumber), 3000);
                            } else {
                                console.log(chalk.red(`[${askNumber}] Bad session retry limit reached. Deleting session and starting fresh.`));
                                deleteFolderRecursive(sessionPath);
                                badSessionRetries[askNumber] = 0;
                                pairingRequested[askNumber] = false;
                                return setTimeout(() => startpairing(askNumber), 5000);
                            }

                        case DisconnectReason.connectionClosed:
                        case DisconnectReason.connectionLost:
                        case DisconnectReason.restartRequired:
                        case DisconnectReason.timedOut:
                        case 405:
                            reconnectAttempts[askNumber] = (reconnectAttempts[askNumber] || 0) + 1;
                            if (reconnectAttempts[askNumber] <= 5) {
                                console.log(`[${askNumber}] attempting reconnect (${reconnectAttempts[askNumber]}/5)...`);
                                return setTimeout(() => startpairing(askNumber), 2000);
                            } else {
                                console.log(`[${askNumber}] max reconnect attempts reached.`);
                            }
                            break;

                        case DisconnectReason.loggedOut:
                            deleteFolderRecursive(sessionPath);
                            pairingRequested[askNumber] = false;
                            console.log(chalk.bgRed(`${askNumber} disconnected (logged out).`));
                            break;

                        default:
                            console.log("Unknown disconnect reason:", statusCode);
                            console.error("Disconnect error:", lastDisconnect?.error?.stack || lastDisconnect?.error?.message);
                    }
                } else if (connection === "open") {
                    console.log(chalk.bgGreen(`Rent bot is active on ${askNumber}`));
                    reconnectAttempts[askNumber] = 0;
                    badSessionRetries[askNumber] = 0;

                    try {
                        await ask.sendMessage(ask.user.id, {
                            image: { url: "https://files.catbox.moe/rcid1h.jpeg" },
                            caption: `
╭──✧* 𝖠𝖲𝖪 - 𝖷𝖬𝖣 *✧───╮
├ ❏ 𝙽𝚄𝙼𝙱𝙴𝚁 𝙳𝙴𝚅: +24165183695
├ ❏ 𝙽𝙾𝙼 𝙳𝚄 𝙱𝙾𝚃 : *𝖠𝖲𝖪-𝖷𝖬𝖣 𝖵𝟷*
├ ❏ 𝙽𝙾𝙼𝙱𝚁𝙴𝚂 𝙲𝙾𝙼𝙼𝙰𝙽𝙳𝙴 : 50
├ ❏ 𝙿𝚁𝙴𝙵𝙸𝚇 : *${global.prefix}*
├ ❏ 𝙳𝙴𝚅 : 𝖠𝖲𝖪 𝖣𝙴𝖶 𝖳𝙴𝙲𝙷
├ ❏ 𝚅𝙴𝚁𝚂𝙸𝙾𝙽 : *𝟷.𝟹.𝟻*
╰──────────────╯
╭──✧*WA GROUPE*✧───╮
├ ❏ *${global.group}*
╰──────────────╯
╭──✧*WA CHANNEL*✧───╮
├ ❏ *${global.chanel}*
╰──────────────╯
> 𝖳𝖧𝖤 𝖡𝖮𝖳 𝖠𝖲𝖪 𝖷𝖬𝖣 𝖨𝖲 𝖢𝖮𝖭𝖭𝖤𝖢𝖳 ✅..!!
> 𝖯𝖮𝖶𝖤𝖱 𝖡𝖸 �𝖠𝖲𝖪 𝖳𝖤𝖢𝖧 𝖣𝖤𝖶`
                        });
                        console.log(`Notified master of connection: ${askNumber}`);
                    } catch (err) {
                        console.error("Failed to notify master number:", err.stack || err.message);
                    }
                }
            } catch (err) {
                console.error("Connection update error:", err.stack || err.message);
                setTimeout(() => startpairing(askNumber), 5000);
            }
        });

        ask.ev.on("creds.update", async creds => {
            try {
                await saveCreds();
            } catch (err) {
                console.error("Failed to save credentials:", err.stack || err.message);
            }
        });

        ask.ev.on('messages.upsert', async ({ messages, type }) => {
            try {
                const msg = messages[0] || messages[messages.length - 1];
                if (type !== "notify") return;
                if (!msg?.message) return;

                // Gestion des statuts
                if (msg.key && msg.key.remoteJid === "status@broadcast") {
                    await ask.readMessages([msg.key]);
                    await ask.sendMessage(msg.key.remoteJid, { react: { text: "❤️", key: msg.key }});
                    return;
                }
                
                // Vérification anti-spam
                if (await antiSpam.handleMessage(msg)) return;

                const m = smsg(ask, msg, store);
                require(`./handler`)(ask, m, msg, store);

                // Réinitialisation du compteur si réponse du bot
                if (msg.key.fromMe) antiSpam.resetCounter(msg.key.remoteJid);

            } catch (err) {
                console.error('Erreur dans messages.upsert:', err);
            }
        });

        ask.sendImageAsSticker = async (jid, path, quoted, options = {}) => {
            let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0);
            let buffer = options && (options.packname || options.author) ? await writeExifImg(buff, options) : await imageToWebp(buff);
            await ask.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted });
            return buffer;
        };

        ask.sendVideoAsSticker = async (jid, path, quoted, options = {}) => {
            let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0);
            let buffer = options && (options.packname || options.author) ? await writeExifVid(buff, options) : await videoToWebp(buff);
            await ask.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted });
            return buffer;
        };

        ask.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
            let quoted = message.msg ? message.msg : message;
            let mime = (message.msg || message).mimetype || '';
            let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0];
            const stream = await downloadContentFromMessage(quoted, messageType);
            let buffer = Buffer.from([]);
            for await (const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk]);
            }
            let type = await FileType.fromBuffer(buffer);
            let trueFileName = attachExtension ? (filename + '.' + type.ext) : filename;
            await fs.writeFileSync(trueFileName, buffer);
            return trueFileName;
        };

        ask.sendTextWithMentions = async (jid, text, quoted, options = {}) => ask.sendMessage(jid, { text: text, mentions: [...text.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net'), ...options }, { quoted });

        ask.downloadMediaMessage = async (message) => {
            let mime = (message.msg || message).mimetype || '';
            let messageType = message.mtype 
                ? message.mtype.replace(/Message/gi, '') 
                : mime.split('/')[0];

            const stream = await downloadContentFromMessage(message, messageType);
            let buffer = Buffer.from([]);

            for await (const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk]);
            }

            return buffer;
        };

        // Gestion des participants
        ask.ev.on('group-participants.update', async ({ id, participants, action }) => {
            const groupSettings = loadGroupSettings();
            
            // Protection contre les rétrogradations
            if (action === 'demote' && groupSettings[id]?.antidemote) {
                try {
                    // Annule la rétrogradation
                    await ask.groupParticipantsUpdate(id, participants, 'promote');
                    
                    // Trouve l'admin qui a fait l'action
                    const metadata = await ask.groupMetadata(id);
                    const adminWhoTried = participants.find(p => 
                        metadata.participants.find(p2 => p2.id === p)?.admin === 'admin'
                    );
                    
                    if (adminWhoTried) {
                        // Bannir définitivement l'admin
                        await ask.groupParticipantsUpdate(id, [adminWhoTried], 'remove');
                        
                        await ask.sendMessage(id, {
                            text: `🚨 @${adminWhoTried.split('@')[0]} a été BANNI pour tentative de rétrogradation !\n` +
                                  `Raison: Violation des règles de protection du groupe`,
                            mentions: [adminWhoTried]
                        });
                    }
                    
                } catch (error) {
                    console.error('Erreur antidemote:', error);
                }
            }
            
            // Protection contre les promotions
            if (action === 'promote' && groupSettings[id]?.antipromote) {
                try {
                    // Annule la promotion
                    await ask.groupParticipantsUpdate(id, participants, 'demote');
                    
                    // Bannir définitivement l'admin qui a tenté de promouvoir
                    const adminWhoTried = participants[0];
                    await ask.groupParticipantsUpdate(id, [adminWhoTried], 'remove');
                    
                    await ask.sendMessage(id, {
                        text: `🚨 @${adminWhoTried.split('@')[0]} a été BANNI pour tentative de promotion !\n` +
                              `Raison: Violation des règles de protection du groupe`,
                        mentions: [adminWhoTried]
                    });
                    
                } catch (e) {
                    console.error('Erreur antipromote:', e);
                }
            }
        });

        ask.ev.on('group-participants.update', async ({ id, participants, action }) => {
            const groupSettings = loadGroupSettings();
                
            if (action === 'remove' && groupSettings[id]?.antipurge) {
                try {
                    const [remover, removedUser] = participants;
                    const metadata = await ask.groupMetadata(id);
                    
                    // Debug logs
                    console.log('REMOVER:', remover);
                    console.log('REMOVED USER:', removedUser);
                    console.log('METADATA:', metadata.participants.length, 'members');

                    await ask.groupParticipantsUpdate(id, [removedUser], 'add');
                    
                    // 2. Sanction après délai
                    setTimeout(async () => {
                        console.log('PUNISHING ADMIN...');
                        await ask.groupParticipantsUpdate(id, [remover], 'remove');
                        
                        setTimeout(() => {
                            console.log('REINTEGRATING ADMIN...');
                            ask.groupParticipantsUpdate(id, [remover], 'add');
                        }, 5000);
                    }, 2000);
                    
                } catch (error) {
                    console.error('ANTIPURGE ERROR:', error);
                }
            }
        });

        // Gestion bienvenue/aurevoir
        if (global.welcome) {
            ask.ev.on('group-participants.update', async ({ id, participants, action }) => {
                try {
                    const metadata = await ask.groupMetadata(id);
                    const time = moment().tz('Africa/Libreville').format('HH:mm:ss');
                    const date = moment().tz('Africa/Libreville').format('DD/MM/YYYY');
                    
                    for (const num of participants) {
                        const [ppuser, ppgroup] = await Promise.all([
                  