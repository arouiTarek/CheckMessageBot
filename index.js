const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const bodyParser = require('body-parser');

const token = '7601448687:AAF2TnvkF--YyjO-3BJdK5vLLbMdEb-dwy0'; // استخدام متغير بيئة
const url = `https://checkmessagebot.onrender.com/api/webhook`; // استخدام Vercel URL

const bot = new TelegramBot(token);
const app = express();

app.use(bodyParser.json());

// Webhook endpoint
app.post('/api/webhook', (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
});

// Register webhook
bot.setWebHook(`${url}`)
    .then(() => console.log('Webhook has been set up successfully'))
    .catch((err) => console.error('Webhook error', err));
const EXCLUDED_USERNAMES = ['GroupAnonymousBot']; 
// Message handler
bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const username = msg.from.username;
    try {
        const chatMember = await bot.getChatMember(chatId, userId);

        if (EXCLUDED_USERNAMES.includes(username)) {
            console.log(`Message from ${username} was excluded from deletion.`);
            return; // لا تحذف الرسالة
        }

       if (chatMember.status !== 'administrator' && chatMember.status !== 'creator') {
            if (
                (msg.text && /https?:\/\/\S+/i.test(msg.text)) || 
                msg.photo || 
                msg.video || 
                msg.document
            ) {
                await bot.deleteMessage(chatId, msg.message_id);
                console.log(`Message deleted from ${msg.from.username || msg.from.first_name}`);
            }
        }
    } catch (error) {
        console.error('Error:', error);
    }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
// Export the app for Vercel
//module.exports = app;