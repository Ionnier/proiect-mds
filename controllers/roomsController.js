const initModels = require("../models/init-models");
const rooms = require("../models/rooms");
const users = require("../models/users");
const sequelize = require('../utils/db')
const models = initModels(sequelize);
const roomPrivilegeUtils = require('../utils/roomPrivilegeUtils')
const Op = require('Sequelize').Op;

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

exports.getRoom = async (idRoom, idUser) => {
    if (idRoom) {
        return await models.rooms.findOne({
            where: {
                idRoom
            },
            include: [{
                model: models.users, as: 'idUserUsersRoomparticipants', required: false
            }, {
                model: models.randomguessgames, as: 'randomguessgames', required: false, include: [{
                    model: models.randomguessoptions, as: 'randomguessoptions', required: false, where: {
                        [Op.or]: [{ idUser }, { winner: true }]
                    }, include: [{
                        model: models.users, as: 'idUserUser', required: false
                    }]
                }]
            }]
        })
    }
}

exports.currentPrivilege = async (req, res, next) => {
    const privilege = await models.roomparticipants.findOne({
        where: {
            idUser: req.session.user.idUser,
            idRoom: req.params.idRoom || req.body.idRoom
        }
    })
    if (!privilege){
        return next(new Error('You aren\'t in this Room'))
    }
    res.locals.privilege = privilege
    next()
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
            return res.status(200).json({ success: true })
        }
        return res.status(500).json({ success: false, message: 'There was an error.'  })
    }
    return res.status(404).json({ success: false, message: 'User not found.'  })
}

exports.transferOwner = async (req, res, next) => {
    // TODO: Maybe drop this query and use one update instead?
    if (res.locals.privilege.roomRole != 'Owner')
        return next(new Error(`You aren't the current owner.`))
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
    await transaction.commit()
    res.status(200).json({success: true})
}

exports.increasePrivilege = async (req, res, next) =>{
    if (res.locals.privilege.roomRole == 'Participant')
        return next(new Error(`You don't have enough privileges.`))
    const result = await models.roomparticipants.update({
        roomRole: 'Admin'
    }, {
        where: {
            idUser: req.params.idUser,
            idRoom: res.locals.privilege.idRoom
        }
    })
    res.status(200).json({success: true})
}

exports.addUser = async (req, res, next) => {
    if (res.locals.privilege.roomRole == 'Participant')
        return next(new Error(`You don't have enough privileges.`))
    if (!req.body.userName || !req.params.idRoom || req.body.userName.length==0)
        return next(new Error('Not enough data.'))
    const otherUser = await models.users.findOne({
        where: {
            userName: req.body.userName
        }, include: [{
            model: models.roomparticipants, as: 'roomparticipants', required: false, where: {
                idRoom: req.params.idRoom
            }
        }]
    })
    if (!otherUser)
        return next(new Error('An user with such an username doesn\'t exist.'))
    if (otherUser.roomparticipants.length!=0)
        return next(new Error(`${otherUser.firstName} ${otherUser.lastName} is already in this room.`))
    await models.roomparticipants.create({
        idRoom: req.params.idRoom,
        idUser: otherUser.idUser
    })
    res.status(200).json({success: true, message: 'User added succesfully.'})
}

exports.renameRoom = async(req, res, next) =>{
    if (roomPrivilegeUtils.getValueOfPrivilege(res.locals.privilege.roomRole) < 1)
        return next(new Error('Not enough privileges'))
    try{
        await models.rooms.update({
            roomName: req.body.roomName
        }, {
            where: {
                idRoom: req.params.idRoom
            }
        })
        res.status(200).json({success: true, message: 'Room renamed succesfully.'})
    } catch (e) {
        return next(e)
    }
}

exports.createRoom = async(req,res,next)=>{
    try{
        const transaction = await sequelize.transaction()
        const room = await models.rooms.create({roomName: req.body.roomName}, {transaction, returning: true})
        await models.roomparticipants.create({idUser: req.session.user.idUser, idRoom: room.idRoom, roomRole: 'Owner'}, {transaction})
        await transaction.commit()
        res.status(200).json({success: true, message: 'Room created succesfully.'})
    } catch(e){
        return next(e)
    }
}

exports.deleteRoom = async(req, res, next) =>{
    if (roomPrivilegeUtils.getValueOfPrivilege(res.locals.privilege.roomRole) != roomPrivilegeUtils.ownerLevel)
        return next(new Error('Not enough privileges'))
    try{
        await models.rooms.destroy({
            where: {
                idRoom: req.params.idRoom
            }
        })
        res.status(200).json({success: true, message: 'Room deleted succesfully.'})
        res.locals.room = undefined
    } catch (e) {
        return next(e)
    }
}

exports.addRoomUtils = async (req, res, next) => {
    for (let x of Object.keys(roomPrivilegeUtils))
        res.locals[x] = roomPrivilegeUtils[x]
    next()
}