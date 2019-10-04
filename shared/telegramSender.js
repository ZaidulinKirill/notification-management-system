import axios from 'axios';

export default ({ ids, message, photo, document }) => Promise.all(
  ids.map(
    chatId => {
      if (photo) {
        return axios.post(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendPhoto`, {
          chat_id: chatId,
          photo: photo,
          caption: message,
          parse_mode: 'Markdown',
        })

      } else if (document) {
        return axios.post(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendDocument`, {
          chat_id: chatId,
          document: document,
          caption: message,
          parse_mode: 'Markdown',
        })
      } else {
        return axios.post(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
          chat_id: chatId,
          text: message,
          parse_mode: 'Markdown',
        })
      }
    }
  ),
);
