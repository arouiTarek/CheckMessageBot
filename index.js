const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const bodyParser = require('body-parser');

//const token = '7336825353:AAGPTpNkQBbcwiNDJ1OZnhzeUvD5vmJ97fM'; 
const token = '7601448687:AAF2TnvkF--YyjO-3BJdK5vLLbMdEb-dwy0';
const port = 3000; 
const url = 'https://ae40-41-104-95-220.ngrok-free.app'; 
//const url = 'https://ae40-41-104-95-220.ngrok-free.app'; 

const bot = new TelegramBot(token);
const app = express();

app.use(bodyParser.json());

app.post(`/bot${token}`, (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
});

//register webhook
bot.setWebHook(`${url}/bot${token}`)
    .then(() => console.log('Webhook has been set up successfully'))
    .catch((err) => console.error('Webhook error', err));

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    //console.log(`The message received from ${msg.from.username || msg.from.first_name}`);
    //await bot.deleteMessage(chatId, msg.message_id);
    const chatMember = await bot.getChatMember(chatId, userId);
    if (chatMember.status !== 'administrator' && chatMember.status !== 'creator') {
        try {
            // Check if the message is a link, photo, video, or document
            if (
                msg.text && /https?:\/\/\S+/i.test(msg.text) || 
                msg.photo || 
                msg.video || 
                msg.document 
            ) {
                // delete message
                await bot.deleteMessage(chatId, msg.message_id);
                console.log(`The message deleted ${msg.from.username || msg.from.first_name}`);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
});

app.listen(port, () => {
    console.log(`Server bot running ${port}`);
});
