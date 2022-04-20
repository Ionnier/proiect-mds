const initModels = require("../models/init-models");
const randomguessgames = require("../models/randomguessgames");
const sequelize = require('../utils/db')
const models = initModels(sequelize);
const { Op } = require("sequelize");


exports.createGame = async (req, res, next) => {
    try {
        const game = await models.randomguessgames.create({
            idRoom: res.locals.privilege.idRoom
        })
        return res.json({ success: true, message: "Game created succesfully!" })
    }
    catch (error) {
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
        const sumAllPoints = options.reduce((total, currentValue) => {return total + currentValue.points}, 0)
        let chosenOne = Math.floor(Math.random() * (sumAllPoints+1))
        for (let elem of options.sort((a, b)=>{return Math.random() - 0.5})) {
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