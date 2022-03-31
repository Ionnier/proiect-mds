const initModels = require("../models/init-models");
const sequelize = require('../utils/db')
const models = initModels(sequelize);

exports.getServices = async (idUser) => {
    const data = await models.services.findAll({
        include: [{
            model: models.boughtservices,
            as: 'boughtservices',
            required: false,
            where: sequelize.where(sequelize.col('id_user'), '=', idUser)
        }]
    })
    return data
}

exports.getService = async (req, res, next) => {
    const data = await models.services.findAll({
        include: [{
            model: models.boughtservices,
            as: 'boughtservices',
            required: false,
            where: sequelize.where(sequelize.col('id_user'), '=', req.session.user.idUser)
        }],
        where: {
            idService: req.params.idService
        }
    })
    res.status(200).json({ success: true, data: { data } })
}

exports.upgradeService = async (req, res, next) => {
    const serviceData = await models.services.findOne({
        where: {
            idService: req.params.idService
        }
    })
    if (!serviceData)
        return next(new Error('Service doesn\'t exist.'))
    const userData = await models.users.findOne({
        where: {
            idUser: req.session.user.idUser
        }
    })
    if (!userData)
        return next(new Error('User doesn\'t exist'))
    const relationship = await models.boughtservices.findOne({
        where: {
            idUser: req.session.user.idUser,
            idService: req.params.idService
        }
    })
    if (userData.userCredits < serviceData.serviceBasePrice)
        return next(new Error('Insufficient credits'))
    if (!relationship) {
        const transaction = await sequelize.transaction();
        try {
            await models.users.decrement({
                userCredits: serviceData.serviceBasePrice
            }, {
                where: {
                    idUser: userData.idUser
                },
                transaction
            })
            const bought_service = await models.boughtservices.create({
                idService: req.params.idService,
                idUser: userData.idUser,
                serviceLevel: 1
            }, {
                transaction
            })
            transaction.commit()
            res.status(200).json({ success: true })
        } catch (e) {
            transaction.rollback()
            return next(new Error(e))
        }
    } else {
        if (relationship.serviceLevel >= serviceData.serviceMaxLevel)
            return next(new Error('Service is already maxed out'))
        const transaction = await sequelize.transaction();
        try {
            await models.users.decrement({
                userCredits: serviceData.serviceBasePrice
            }, {
                where: {
                    idUser: userData.idUser
                },
                transaction
            })
            await models.boughtservices.increment({
                serviceLevel: 1
            }, {
                where: {
                    idService: req.params.idService,
                    idUser: userData.idUser
                },
                transaction
            })
            transaction.commit()
            res.status(200).json({ success: true })
        } catch (e) {
            transaction.rollback()
            return next(new Error(e))
        }
    }
}
function calculateCredits(service) {
    return service.service_base_value * Math.pow(service.service_value_modifier, service.service_level)
}

exports.updateServices = async (req, res, next) => {
    const data = await sequelize.query(`SELECT * from UpdateServices;`, {
        where: {
            idUser: req.session.user.idUser
        }
    })
    const transaction = await sequelize.transaction();
    try {
        for (let elem of data[0]) {
            await models.boughtservices.update({
                serviceLastCheck: sequelize.literal('CURRENT_TIMESTAMP')
            }, {
                where: {
                    idService: elem.id_service,
                    idUser: elem.id_user
                },
                transaction
            })
            await models.users.increment({ userCredits: parseInt(elem.times) * calculateCredits(elem) }, {
                where: {
                    idUser: elem.id_user
                },
                transaction
            })
        }
        await transaction.commit()
        next()
    }
    catch (e) {
        console.log(e)
        await transaction.rollback()
        next()
    }
}