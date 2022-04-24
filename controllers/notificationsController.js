const initModels = require("../models/init-models");
const sequelize = require('../utils/db')
const models = initModels(sequelize);
const webpush = require('web-push')

exports.setUpNotificationServer = () => {
    webpush.setVapidDetails(`${process.env.PROTOCOL}://${process.env.HOSTNAME}`, process.env.VAPID_PUBLIC, process.env.VAPID_PRIVATE);
};