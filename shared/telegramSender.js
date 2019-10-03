import axios from 'axios';

export default ({ ids, message }) => Promise.all(
  ids.map(
    chatId => axios.post(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      chat_id: chatId,
      text: message,
      parse_mode: 'Markdown',
    })
  ),
);
