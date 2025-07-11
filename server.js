require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

app.use(bodyParser.json());
app.use(cors());

app.post('/send-to-telegram', async (req, res) => {
  const { name, lastName, phone, email, info, answers } = req.body;
  if (!name || !lastName || !phone || !email) {
    return res.json({ success: false, error: { description: 'Не все поля заполнены' } });
  }

  const message = `
<b>Новая заявка с сайта</b>
Имя: ${name}
Отчество: ${lastName}
Телефон: ${phone}
Email: ${email}
Доп. информация: ${info || '-'}
Ответы:
${answers}
  `;

  try {
    const tgResp = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML'
      })
    });
    const tgData = await tgResp.json();
    if (tgData.ok) {
      res.json({ success: true });
    } else {
      res.json({ success: false, error: { description: tgData.description } });
    }
  } catch (e) {
    res.json({ success: false, error: { description: 'Ошибка отправки в Telegram' } });
  }
});

app.get('/', (req, res) => {
  res.send('Сервер работает и на этом с кайфом, тот кто залез в код, вот вам пасхалко, писал код Johny, Вайб Кодер, не бейте пожалуйста, я пытаюсь развиваться');
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
}); 