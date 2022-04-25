const webpush = require('web-push');

const vapidKeys = {
  publicKey:
    'BCBtF_EPS7NHdxeWQxPgCVXEUYLHaLINdp6_LhlSYvsxQeZyiLoWRaPqYwuA1oQ9sRkLRH86XYJhbsmlC7aRGNE',
  privateKey: 'IX5s5aXQP6dzc_GLBDSPizne9DHbL4_7fgTuVBL2wqw'
};

webpush.setVapidDetails(
  'mailto:example@yourdomain.org',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

const pushSubscription = {"endpoint":"https://wns2-par02p.notify.windows.com/w/?token=BQYAAAD7kNzFGEkuK1EGH5SJc916iRpTgBRKju2Ncdy%2fIw85OiklCnj%2fUFsRxlOqYHaX6Z9V2w%2boAJY0rLrb0kZ7pDPlkxlP%2fT4DTf9s6FvyDy7c8I3w5sn0Us4AtxvU1xfkxisTs1jgNkwQCEIhYx6Qon5%2bailRNZ%2fkEPFIqeK9atIL4n63aYsOIO53mWN9WIc1DWz090KxX%2brl7Z2Uk8Nj2Cg8WoZ48cf6J%2bO%2fX3%2b0GMmwJqjfA0bqTFaiJ07%2fstoeOc9UK2U8zrmwMAM8P30%2bDa3gRG67vaXVNELvO1Tp1JU5%2b00NFrw0kKTXB1kgNYqfJK4WrGhPh1plyckjUYFM%2bOZi","expirationTime":null,"keys":{"p256dh":"BOT0fqtMNI8CjujhqJGDL9uW7t9kh7D0mhA5duSmYbt9bSpxxKGXKEl0kRXWugbxvizw4Jqf-gGlEOgqV9C8s9w","auth":"fo15nWcw3pWqjGE-qiV53A"}}

webpush.sendNotification(pushSubscription, JSON.stringify({title: 'Hello whatvere!', body: 'XD'}));
