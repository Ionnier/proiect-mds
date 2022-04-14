const initModels = require("../models/init-models");
const randomguessgames = require("../models/randomguessgames");
const sequelize = require('../utils/db')
const models = initModels(sequelize);


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
        console.log(req.body)
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