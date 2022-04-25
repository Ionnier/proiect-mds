const express = require('express');
const randomGuessController = require('../controllers/randomGuessController')
const authController = require('../controllers/authController');
const roomsController = require('../controllers/roomsController');
const servicesController = require('../controllers/servicesController')

const router = express.Router();

router.post('/:idRoom/', authController.protect, roomsController.currentPrivilege, randomGuessController.createGame)
router.post('/option/:idRoom/', authController.protect, express.json(), roomsController.currentPrivilege, servicesController.updateServices, randomGuessController.addOption)
router.get('/finish/:idRoom/', authController.protect, roomsController.currentPrivilege, randomGuessController.solveGame)

module.exports = router;