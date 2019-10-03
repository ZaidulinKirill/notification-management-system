import axios from 'axios';

export default async (message, phones = []) => {
  if (!phones.length) {
    return;
  }

  const phonesStr = phones.join(',');
  const login = process.env.SMSC_LOGIN;
  const password = process.env.SMSC_PASSWORD;

  const url = `http://smsc.ru/sys/send.php?login=${login}&psw=${encodeURI(password)}&phones=${phonesStr}&mes=${encodeURI(message)}&charset=utf-8`;
  await axios.get(url);
};
