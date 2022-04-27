const initModels = require("../models/init-models");
const randomguessgames = require("../models/randomguessgames");
const notificationController = require('./notificationsController')
const sequelize = require('../utils/db')
const models = initModels(sequelize);
const { Op } = require("sequelize");


exports.createGame = async (req, res, next) => {
    try {
        const game = await models.randomguessgames.create({
            idRoom: res.locals.privilege.idRoom
        })
        const users = await models.users.findAll({
            include: [{
                model: models.rooms, as: 'idRoomRooms', required: true, where: {
                    idRoom: res.locals.privilege.idRoom
                }
            }]
        })
        notificationController.notificationGameCreated(users.filter(e => e.idUser != req.session.user.idUser).map(e => e.idUser), res.locals.privilege.idRoomRoom)
        return res.json({ success: true, message: "Game created succesfully!" })
    }
    catch (error) {
        console.log(error)
        return res.json({ success: false, message: "There was an error!", error })
    }
}

exports.addOption = async (req, res, next) => {
    try {
        const transaction = await sequelize.transaction()
        const game = await models.randomguessoptions.create({
            idRandomGuessGame: sequelize.literal(`(select id_random_guess_game from RandomGuessGames where random_guess_game_finish_date is null and id_room = ${res.locals.privilege.idRoom})`),
            optionName: req.body.optionName,
            points: req.body.points,
            idUser: req.session.user.idUser
        }, {
            transaction
        })
        const user = await models.users.decrement({userCredits: req.body.points},{ 
            where: {idUser: req.session.user.idUser},
            transaction})
        await transaction.commit()
        return res.json({ success: true, message: "Option added succesfully!", data: {game}})
    }
    catch (error) {
        console.log(error)
        return res.json({ success: false, message: "There was an error!", error })
    }
}

exports.deleteOption = async (req, res, next) => {
    try {
        const transaction = await sequelize.transaction()
        const wtf = await models.randomguessgames.findOne({
            where: {
                randomGuessGameFinishDate: null,
                idRoom: res.locals.privilege.idRoom
            }, transaction
        })
        const game = await models.randomguessoptions.findOne({
            where:{
                idRandomGuessGame: wtf.idRandomGuessGame,
                optionName: req.body.optionName,
                idUser: req.session.user.idUser
            },
            transaction
        })
        if (game == undefined){
            return next(new Error('Not Found'))
        }
        const user = await models.users.increment({userCredits: game.points},{ 
            where: {idUser: req.session.user.idUser},
            transaction})
        await game.destroy({
            transaction
        })
        await transaction.commit()
        return res.json({ success: true, message: "Option deleted succesfully!"})
    }
    catch (error) {
        console.log(error)
        return res.json({ success: false, message: "There was an error!", error })
    }
}

exports.solveGame = async(req, res, next) => {
    try {
        // because subquerries don't work
        const currentGame = await models.randomguessgames.findOne({
            where: {
                randomGuessGameFinishDate: {
                    [Op.is]: null
                },
                idRoom: res.locals.privilege.idRoom
            }
        })
        const options = await models.randomguessoptions.findAll({
            where: {
                idRandomGuessGame: currentGame.idRandomGuessGame
            }
        })
        if (options.length <= 0){
            return next(new Error('There were no participants in the game'))
        }
        for (let user of options.map(e => e.idUser)){
            const total = options.filter(e => e.idUser = user).reduce((acc, val) => {
                acc += val.points
                return acc
            }, 0)
            console.log(total)
            if (total <= 0){
                return next(new Error('Unfair game'))
            }
        }
        console.log(options)
        for (let option of options){
            if(option.points<0){
                const remainingOptions = options.filter(e => e.idUser != option.idUser && e.points > 0).length
                option.points = (-1) * option.points
                const perElement = Math.floor(options.points / remainingOptions)
                for (let option2 of options.filter(e => e.idUser != option.idUser && e.points > 0).sort((a, b) => {return a.points - b.points})){
                    if (option.points<=0){
                        break
                    }
                    option2.points += perElement
                } 
                option.points = 0
            }
        }
        console.log(options)
        const newOptions = options.filter(e => e.points > 0)
        const sumAllPoints = newOptions.reduce((total, currentValue) => {return total + currentValue.points}, 0)
        let chosenOne = Math.floor(Math.random() * (sumAllPoints+1))
        for (let elem of newOptions.sort((a, b)=>{return Math.random() - 0.5})) {
            chosenOne -= elem.points
            if (chosenOne > 0)
                continue
            const transaction = await sequelize.transaction()
            elem.winner = true
            await elem.save({
                transaction
            })
            await models.randomguessgames.update({
                randomGuessGameFinishDate: sequelize.literal('CURRENT_TIMESTAMP')
            }, {
                where: {
                    idRandomGuessGame: elem.idRandomGuessGame
                },
                transaction
            })
            await transaction.commit()
            await notificationController.notificationGameFinished(options.filter(e => e.idUser != req.session.user.idUser).map(e => e.idUser), res.locals.privilege.idRoomRoom)
            return res.status(200).json({success: true, message: 'Game finished', data: {
                winner: elem
            }})
        }
    }
    catch (error) {
        console.log(error)
        return res.json({ success: false, message: "There was an error!", error })
    }
}