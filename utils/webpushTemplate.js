const webpush = require('web-push');

const vapidKeys = {
  publicKey:
    '$$$$PUBLIC$$$$VAPID$$$$KEY',
  privateKey: '$$$$PRIVATE$$$$VAPID$$$$KEY'
};

webpush.setVapidDetails(
  '$$$$HOST$$$$NAME$$$$',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

const pushSubscription = {}

webpush.sendNotification(pushSubscription, JSON.stringify({title: 'Hello whatvere!', body: 'XD'}));
