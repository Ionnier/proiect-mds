const initModels = require("../models/init-models");
const sequelize = require('../utils/db')
const models = initModels(sequelize);
const webpush = require('web-push')

exports.setUpNotificationServer = () => {
    webpush.setVapidDetails(`${process.env.PROTOCOL}://${process.env.HOSTNAME}`, process.env.VAPID_PUBLIC, process.env.VAPID_PRIVATE);
};

exports.toggleSettings = async (req, res, next) => {
    let toggle_element
    switch(req.params.type) {
        case 'finishedGame': toggle_element = {notificationGameFinished: sequelize.literal(`NOT COALESCE( "notification_game_finished", 'f' )`)}; break;
        case 'createdGame': toggle_element = {notificationGameCreated: sequelize.literal(`NOT COALESCE( "notification_game_created", 'f' )`)}; break;
        case 'pointsReminder': toggle_element = {notificationPointsRefresh: sequelize.literal(`NOT COALESCE( "notification_points_refresh", 'f' )`)}; break;
    }
    if (toggle_element == undefined){
        return next(new Error('Inccorect type.'))
    }
    const response = await models.users.update(toggle_element, {
        where: {
            idUser: req.session.user.idUser
        }
    })
    return res.json({success: true, message: 'Updated.'})
}

exports.addEndpoints = async (req, res, next) =>{
    try{
        await models.notificationendpoints.create({
            idUser: req.session.user.idUser,
            endpoint: req.body.endpoint
        })
        return res.json({success:true, message: "Created."})
    } catch (e) {
        return next(e)
    }
}

exports.deleteEndpoints = async(req, res, next) =>{
    try{
        await models.notificationendpoints.destroy({
            where:{
                idUser: req.session.user.idUser
            }
        })
        return res.json({success:true, message: "Deleted."})
    } catch (e) {
        return next(e)
    }
}

notifyUserGameFinished = async(user, room) => {
    const endpoints = await models.notificationendpoints.findAll({
        where: {idUser: user}, include: [{ model: models.users, as: 'idUserUser', required: true}]
    })
    if (endpoints.length == 0 ){
        return
    }
    if(endpoints[0].idUserUser.notificationGameFinished == false){
        return
    }
    for (let endpoint of endpoints){
        webpush.sendNotification(JSON.parse(endpoint.endpoint), JSON.stringify({title: `Game finished!`, body: `A game has finished in ${room}!`}));
    }
}

exports.notificationGameFinished = async(users, room) => {
    console.log(users, room)
    for (user of users){
        notifyUserGameFinished(user, room.roomName)
    }
}

async function notifyGameCreated(user, room) {
    const endpoints = await models.notificationendpoints.findAll({
        where: {idUser: user}, include: [{ model: models.users, as: 'idUserUser', required: true}]
    })
    if (endpoints.length == 0 ){
        return
    }
    if(endpoints[0].idUserUser.notificationPointsRefresh == false){
        return
    }
    for (let endpoint of endpoints){
        webpush.sendNotification(JSON.parse(endpoint.endpoint), JSON.stringify({title: `Game created!`, body: `A game has been created in ${room}!`}));
    }
}

exports.notificationGameCreated = async(users, room) => {
    for (user of users){
        notifyGameCreated(user, room.roomName)
    }
}

const last_time = {}
async function notifyCheck(idUser) {
    if (last_time[idUser] && (new Date() - last_time[idUser] < 1000 * 60 * 60)) {
        return
    }
    const endpoints = await models.notificationendpoints.findAll({
        where: {idUser}, include: [{ model: models.users, as: 'idUserUser', required: true}]
    })
    if (endpoints.length == 0 ){
        return
    }
    if(endpoints[0].idUserUser.notificationGameCreated == false){
        return
    }
    console.log(`Notified ${idUser}`)
    last_time[idUser] = new Date()
    for (let endpoint of endpoints){
        webpush.sendNotification(JSON.parse(endpoint.endpoint), JSON.stringify({title: `Check your points!`, body: `A lot of points accumulated, check them out!`}));
    }
}

setInterval(async () => {
    const [data, _] = await sequelize.query(`SELECT * from UpdateServices`)
    if (data.length == 0 ){
        return
    }
    const userDataUpdate = data.reduce((acc, value) => {
        if (!acc[value.id_user]) {
            acc[value.id_user] = [];
        }
        acc[value.id_user].push(value.id_service);
        return acc
    }, {})
    const data2 = await models.boughtservices.findAll({
        where: {
            idUser: { [sequelize.Sequelize.Op.in]: Object.keys(userDataUpdate)}
        }
    })
    const userDataBougth = data2.reduce((acc, value) => {
        if (!acc[value.idUser]) {
            acc[value.idUser] = [];
        }
        acc[value.idUser].push(value.idService);
        return acc
    }, {})
    for (let user of Object.keys(userDataUpdate)){
        if (userDataUpdate[user].length >= userDataBougth[user].length / 2){
            notifyCheck(user)
        }
    }
    console.log(userDataUpdate, userDataBougth)
}, 1000 * 60)