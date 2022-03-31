const initModels = require("../models/init-models");
const users = require("../models/users");
const sequelize = require('../utils/db')
const models = initModels(sequelize);
const roomPrivilegeUtils = require('../utils/roomPrivilegeUtils')

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

exports.currentPrivilege = async (req, res) => {
    const privilege = await models.roomparticipants.findOne({
        where:{
            idUser: req.session.user.idUser,
            idRoom: req.params.idRoom
        } 
    })
    res.locals.privilege = privilege
}

// TODO: Finish remove/promote logic
// TODO: Add memeber logic
exports.removeUser = async (req, res, next) => {
    const otherUser = await models.roomparticipants.findOne({
        where:{
            idUser: req.params.idUser,
            idRoom: res.locals.privilege.idRoom
        }
    })
}

exports.addRoomUtils = async (req, res, next) => {
    for (let x of Object.keys(roomPrivilegeUtils))
        res.locals[x] = roomPrivilegeUtils[x]
    next()
}