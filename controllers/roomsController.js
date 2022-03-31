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
        where: {
            idUser: req.session.user.idUser,
            idRoom: req.params.idRoom
        }
    })
    res.locals.privilege = privilege
}

// TODO: Finish remove/promote logic
// TODO: Add memeber logic
exports.removeUser = async (req, res) => {
    const otherUser = await models.roomparticipants.findOne({
        where: {
            idUser: req.params.idUser,
            idRoom: res.locals.privilege.idRoom
        }
    })
    if (otherUser) {
        if (roomPrivilegeUtils.testPrivilege(res.locals.privilege.roomRole, otherUser.roomRole)) {
            await otherUser.destroy()
            return res.status(204).json({ status: true })
        }
        return res.status(500).json({ status: false, data: { message: 'There was an error.' } })
    }
    return res.status(404).json({ status: false, data: { message: 'User not found.' } })
}

exports.transferOwner = async (req, res, next) => {
    // TODO: Maybe drop this query and use one update instead?
    const otherUser = await models.roomparticipants.findOne({
        where: {
            idUser: req.params.idUser,
            idRoom: res.locals.privilege.idRoom
        }
    })
    if (!otherUser)
        return next(new Error('User not found.'))
    const transaction = await sequelize.transaction()
    await models.roomparticipants.update({
        roomRole: 'Participant'
    }, {
        where: {
            idUser: req.session.user.idUser,
            idRoom: res.locals.privilege.idRoom
        }, transaction
    })
    otherUser.roomRole = 'Owner'
    await otherUser.save(transaction)
    res.status(200).json({status: true})
}

exports.addRoomUtils = async (req, res, next) => {
    for (let x of Object.keys(roomPrivilegeUtils))
        res.locals[x] = roomPrivilegeUtils[x]
    next()
}