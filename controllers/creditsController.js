const initModels = require("../models/init-models");
const sequelize = require('../utils/db')
const models = initModels(sequelize);

exports.increaseCredits = async (req, res, next) => {
    if (req.session.user) {
        try {
            const credits = await models.users.increment({ userCredits: 1 }, {
                where: {
                    idUser: req.session.user.idUser
                },
                returning: true
            })
            if (credits)
                return res.json({ status: true, data: { credits: credits[0][0][0].user_credits, message: "Credits added succesfully!" } })
        }
        catch (error) {
            return res.json({ status: false, data: { error, message: "There was an error" } })
        }
    }
}

exports.updateCredits = async (req, res, next) => {
    if (req.session.user) {
        try {
            const credits = await models.users.findOne({
                where: {
                    idUser: req.session.user.idUser
                },
                returning: true
            })
            if (credits) {
                req.session.user.userCredits = credits.userCredits
                res.locals.user.userCredits = credits.userCredits
                return next()
            }
        }
        catch (error) {
            return res.json({ status: false, data: { error, message: "There was an error" } })
        }
    }
}