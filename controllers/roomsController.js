const initModels = require("../models/init-models");
const users = require("../models/users");
const sequelize = require('../utils/db')
const models = initModels(sequelize);

exports.getRooms = async (idUser) => {
    if (idUser) {
        return await models.rooms.findAll({
            include: [{
                model: models.roomparticipants, as: 'roomparticipants', required: true, where: {
                    idUser
                }
            }]
        })
    }
}

exports.getRoom = async (idRoom) => {
    if (idRoom) {
        return await models.rooms.findOne({
            where: {
                idRoom
            },
            include: [{
                model: models.users, as: 'idUserUsersRoomparticipants', required: false
            }]
        })
    }
}