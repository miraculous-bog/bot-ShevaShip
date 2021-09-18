const TelegramBot = require("node-telegram-bot-api");
const helper = require("./helper");
const users = require("../users").default;
const fs = require("fs");
require("dotenv").config();

helper.logStart();
const bot = new TelegramBot(process.env.BOT_TOKEN, {
  polling: true,
});
console.log(users);

const getLengthOfUsers = function () {
  return users.filter((el) => el.status === true).length;
};
// users.filter((el) => el.status === true).length
// let countOfGuests = users.filter((el) => el.status === true).length;
const texts = {
  textForTickets: `Усього квитків залишилося: *${
    100 - getLengthOfUsers()
  }* / 100\n\nЩе залишилося по 250грн: *${
    30 - getLengthOfUsers() > 0 ? 30 - getLengthOfUsers() : 0
  }* із 30\n\nЗалишилося по 350грн.: *${
    getLengthOfUsers() < 41 ? 60 : 100 - getLengthOfUsers()
  } / 100*`,
  textForEmptyTickets: `На жаль, всі квитки продано. Підписуйся на наш канал аби першим бути вкурсі про нові івенти\nwww.google.com`,
  where:
    "*Де:?* Причал.Вихід із _Контрактової або Поштової Площі_\n*Коли:?* 24.05  О 18 00 по 23 00",
  firstRegist: `Вітання. Для того аби пройти реєстрацію необхідно ввести деякі свої дані.\nВАЖЛИВО!!\nВведіть коректні дані, аби ви змогли потрапити на подію. У вас буде _лише одна спроба_\nПочнемо.\n\nВаше ім'я та прізвище.`,
  secondRegist: `Введіть, будь ласка, номер вашого телефону, в форматі 0930000000`,
  thirdRegist: `Момент істини настав. Зробіть, будь ласка, оплату за вказаною картою.\nНаступним повідомленням скиньте скрін зробленої вами оплати.`,
  info: `**Ми знаємо, що тобі необхідно. Знаємо краще, ніж ти сам. Ти точно потребуєш останньої запальної вечірки сезону — Sheva Ship!**

  ⛵️Вже цієї п'ятниці, **24 вересня** найгучніше паті відправляється у перше плавання, яке закарбується в пам'яті кожного назавжди. З нас — музика, атмосфера та бар, а вашим завданням буде відірватися на повну! 
  
  *Ще не придбав квиток? Купуй білети за допомогою бота ...*
  *Кількість квитків обмежена, тож не зволікай!*
  
  ⚪️**Перші 40 квитків – 250 UAH**
  ⚫️**Решта 50 квитків – 350 UAH**
  
  🗓*Відшвартовуємось о 18:00 24.09 з пристані Контрактової площі".*
  
  **Важливо зайти на палубу корабля вчасно, адже вже о 18:00 будемо відчалювати. Тож без запізненнь**😉
  
  *Ну що, курс на відрив!*🥂\n`,
  info2: `Для замовлення квитка:\n1. Дізнайся інформацію про квитки /tickets\n2. Виконай команду /payment та слідуй інструкціям`,
};
const getUser = function (msg) {
  return users.find((el) => el.id === msg.from.id);
};
const getIndex = function (msg) {
  for (let i = 0; i <= users.length; i++) {
    if (users[i].id === msg.from.id) {
      return i;
    }
  }
};
const getIndexAccept = function (id) {
  for (let i = 0; i <= users.length; i++) {
    if (users[i].id === id) {
      return i;
    }
  }
};
const checkNumber = function (AStr) {
  AStr = AStr.replace(/[\s\-\(\)]/g, "");
  return AStr.match(/^((\+?3)?8)?0\d{9}$/) != null;
};

bot.on("message", (msg) => {
  //   console.log("Working", msg);
  const user = getUser(msg);
  if (user === undefined) return;
  //   const chatId = helper.getChatId(msg);
  console.log(msg);
  if (user.state[0] === 1 && user.state[0] === 1) {
    bot.sendMessage(helper.getChatId(msg), `Записав вас як ${msg.text}`);
    bot.sendMessage(helper.getChatId(msg), texts.secondRegist);
    users[getIndex(msg)].name = msg.text;
    users[getIndex(msg)].state[0] = 2;
    console.log("234234", users); //-------------------------------------------------- 2
  } else if (user.state[0] === 2 && user.state[1] === 1) {
    console.log("ver", checkNumber(msg.text));
    if (checkNumber(msg.text)) {
      bot.sendMessage(helper.getChatId(msg), texts.thirdRegist, {
        parse_mode: "Markdown",
      });
      bot.sendMessage(helper.getChatId(msg), "5375414121815335", {
        parse_mode: "Markdown",
      });
      users[getIndex(msg)].number = msg.text;
      users[getIndex(msg)].state[0] = 3;
      console.log(users);
    } else {
      bot.sendMessage(
        helper.getChatId(msg),
        `Не коректне значення! Спробуйте ще раз!Памятайте, повідомлення має бути в наступному форматі 0930000000`
      );
    }
  } else if (user.state[0] === 3 && user.state[1] === 1) {
    bot.sendPhoto(357629644, msg.photo[0].file_id);
    bot.sendMessage(357629644, `id покупця${users[getIndex(msg)].id}`);
    bot.sendMessage(357629644, `Імя покупця ${users[getIndex(msg)].name}`);
    bot.sendMessage(357629644, `Номер покупця ${users[getIndex(msg)].number}`);
    bot.sendMessage(
      357629644,
      `Нікнейм покупця ${users[getIndex(msg)].nickName}`
    );
    bot.sendPhoto(390776447, msg.photo[0].file_id);
    bot.sendMessage(390776447, `id покупця${users[getIndex(msg)].id}`);
    bot.sendMessage(390776447, `Імя покупця ${users[getIndex(msg)].name}`);
    bot.sendMessage(390776447, `Номер покупця ${users[getIndex(msg)].number}`);
    bot.sendMessage(
      390776447,
      `Нікнейм покупця ${users[getIndex(msg)].nickName}`
    );

    bot.sendMessage(helper.getChatId(msg), `Очікуйте підтвердження оплати`);
    users[getIndex(msg)].state[0] = 4;
  } else if (
    user.state[0] === 4 &&
    user.state[1] === 1 &&
    user.state[1] === 0
  ) {
    bot.sendMessage(helper.getChatId(msg), `Очікуйте підтвердження оплати`);
  } else if (
    user.state[0] === 4 &&
    user.status === true &&
    user.state[1] === 1
  ) {
    bot.sendMessage(
      helper.getChatId(msg),
      `Чекаємо вас 24 09 на нашому Кораблику)`
    );
  } else if (user.state[0] === 91) {
    if (msg.from.id === 357629644 || msg.from.id === 390776447) {
      console.log("video");
      const currentVideo = msg.video.file_id;
      const guests = users.filter((el) => el.status === true);
      guests.map((el) => {
        bot.sendVideo(el.id, currentVideo);
      });
      users[getIndex(msg)].state[0] = 4;
    }
  } else if (user.state[0] === 92) {
    if (msg.from.id === 357629644 || msg.from.id === 390776447) {
      console.log("img");
      const currentImg = msg.photo[0].file_id;
      const guests = users.filter((el) => el.status === true);
      guests.map((el) => {
        bot.sendPhoto(el.id, currentImg);
      });
      users[getIndex(msg)].state[0] = 4;
    }
  }
});
bot.onText(/\/start/, (msg) => {
  const text = `Вітаємо, для інформаціх про івент\nКористуйтеся наступними командами для користування ботом\n/info - Інформація про івент\n/where - час та місце\n/payment - купити квиток\n/tickets - Взнати про квиток\n/contacts - контакти`;
  bot.sendMessage(helper.getChatId(msg), text);
});
bot.onText(/\/where/, (msg) => {
  bot.sendMessage(helper.getChatId(msg), texts.where, {
    parse_mode: "Markdown",
  });
  bot.sendLocation(helper.getChatId(msg), 50.471732, 30.523614);
});
bot.onText(/\/contacts/, (msg) => {
  bot.sendMessage(
    helper.getChatId(msg),
    "За питаннями пишіть @miraculous_bog @mschk"
  );
});
bot.onText(/\/info/, (msg) => {
  bot.sendMessage(helper.getChatId(msg), texts.info, {
    parse_mode: "Markdown",
  });
  bot.sendMessage(helper.getChatId(msg), texts.info2, {
    parse_mode: "Markdown",
  });
  bot.sendMessage(
    helper.getChatId(msg),
    "За питаннями пишіть @miraculous_bog @mschk"
  );
  // bot.sendMessage(
  //   helper.getChatId(msg),
  //   `За питаннями пишіть в тг miraculous_bog та mschk`,
  //   {
  //     parse_mode: "Markdown",
  //   }
  // );
});
bot.onText(/\/payment/, (msg) => {
  const finds = getUser(msg);
  console.log(getUser(msg));
  if (finds === undefined) {
    const obj = {
      id: msg.from.id,
      name: "",
      nickName: msg.from.username,
      status: false,
      number: "",
      state: [1, 1],
    };
    users.push(obj);
    console.log(users);
    bot.sendMessage(helper.getChatId(msg), texts.firstRegist, {
      parse_mode: "Markdown",
    });
  } else {
    users[getIndex(msg)].state[1] = 1;
  }
});
bot.onText(/\/tickets/, (msg) => {
  // console.log(users);
  // console.log(countOfGuests);
  console.log(getLengthOfUsers());
  bot.sendMessage(
    helper.getChatId(msg),
    getLengthOfUsers() > 0 ? texts.textForTickets : texts.textForEmptyTickets,
    {
      parse_mode: "Markdown",
    }
  );
});

//admin commands

bot.onText(/\/acceptshow/, (msg) => {
  if (msg.from.id === 357629644 || msg.from.id === 390776447) {
    users[getIndex(msg)].state[1] = 0;
    console.log(msg);
    const whaitingUser = users
      .filter((el) => el.state[0] === 4 && el.status === false)
      .map((el) => el.id)
      .join("\n");
    console.log(whaitingUser);
    bot.sendMessage(helper.getChatId(msg), whaitingUser);
  }
});

bot.onText(/\/showguest/, (msg) => {
  if (msg.from.id === 357629644 || msg.from.id === 390776447) {
    users[getIndex(msg)].state[1] = 0;
    // console.log(msg);
    const guests = users
      .filter((el) => el.status === true)
      .map((el) => {
        return `ай ді ${el.id} \nІмя ${el.name}\nНомер ${el.number}\nНікнейм ${el.nickName}\n---------------------`;
      })
      .join("\n");
    console.log(guests);
    bot.sendMessage(helper.getChatId(msg), guests);
  }
});
bot.onText(/\/accept (.+)/, (msg, source, match) => {
  if (msg.from.id === 357629644 || msg.from.id === 390776447) {
    const { id } = msg.chat;
    const currentId = +source[1];
    const user = users.find((el) => el.id === currentId);
    console.log(user);
    users[getIndexAccept(currentId)].status = true;
    bot.sendMessage(currentId, "Вітаю, ти на кораблику!!");
  }
});
bot.onText(/\/sendAll (.+)/, (msg, source, match) => {
  if (msg.from.id === 357629644 || msg.from.id === 390776447) {
    const { id } = msg.chat;
    const currentText = source[1];
    const guests = users.filter((el) => el.status === true);
    guests.map((el) => {
      bot.sendMessage(el.id, currentText);
    });
  }
});
bot.onText(/\/sendVideo/, (msg) => {
  if (msg.from.id === 357629644 || msg.from.id === 390776447) {
    users[getIndex(msg)].state[0] = 91;
  }
});

bot.onText(/\/sendImg/, (msg) => {
  if (msg.from.id === 357629644 || msg.from.id === 390776447) {
    users[getIndex(msg)].state[0] = 92;
  }
});
