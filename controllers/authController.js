const bcrypt = require('bcrypt');
const saltRounds = parseInt(process.env.SALT_ROUNDS) || 10
const initModels = require("../models/init-models");
const sequelize = require('../utils/db')
const models = initModels(sequelize);

async function generatePassword(plainPassword) {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(saltRounds, (err, salt) => {
            if (err)
                reject(err)
            bcrypt.hash(plainPassword, salt, (err, hash) => {
                if (err)
                    reject(err)
                resolve(hash)
            });
        });
    })

}

async function comparePassword(plainPassword, hashedPassword) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(plainPassword, hashedPassword, (err, result) => {
            if (err)
                reject(err)
            resolve(result)
        });
    })
}

exports.login = async (userName, userPassword) => {
    if (!userName || !userPassword)
        return
    const user = await models.users.findOne({
        where: {
            userName
        }
    })
    if (!user) {
        return
    }
    const userData = user.dataValues
    if (await comparePassword(userPassword, user.userPassword) == true) {
        user.userPassword = null
        return userData
    }
    return null
}

exports.signup = async (userName, userFirstName, userLastName, userPassword, userEmail) => {
    try {
        userPassword = await generatePassword(userPassword)
        const newUser = await models.users.create({ userName, userFirstName, userLastName, userPassword, userEmail });
        if (!newUser)
            return
        else
            return newUser.dataValues
    } catch (e) {
        return
    }
};

exports.setSession = (user, req) => {
    if (req.session) {
        req.session.user = user
        return true
    }
}

exports.destroySession = (req) => {
    try {
        req.session.destroy()
        req.locals.user = null
    }
    catch (e) {
        null
    }
}

exports.protect = async (req, res, next) => {
    if (req.session && req.session.user) {
        const user = await models.users.findOne({
            where: {
                idUser: req.session.user.idUser
            }
        })
        if (!user) {
            return next(new Error('User doesn\'t exis.'));
        }
        const userData = user.dataValues
        userData.userPassword = undefined
        req.session.user = userData
        res.locals.user = userData
        return next();
    }
    return next(new Error('Not Logged In'));
}