const initModels = require("../models/init-models");
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