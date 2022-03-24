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

exports.upgradeService = async (req, res, next) => {
    console.log('asd')
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