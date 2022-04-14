const express = require('express');
const randomGuessController = require('../controllers/randomGuessController')
const authController = require('../controllers/authController');
const roomsController = require('../controllers/roomsController');

const router = express.Router();

router.post('/:idRoom/', authController.protect, roomsController.currentPrivilege, randomGuessController.createGame)
router.post('/option/:idRoom/', authController.protect, express.json(), roomsController.currentPrivilege, randomGuessController.addOption)


// router.delete('/:idRoom/:idUser/', authController.protect, roomsController.currentPrivilege, roomsController.removeUser)
// router.patch('/:idRoom/:idUser/', authController.protect, roomsController.currentPrivilege, roomsController.increasePrivilege)
// router.post('/:idRoom/:idUser/', authController.protect, roomsController.currentPrivilege, roomsController.transferOwner)
// router.patch('/:idRoom/', authController.protect, express.json(), roomsController.currentPrivilege, roomsController.renameRoom)
// router.delete('/:idRoom/', authController.protect, express.json(), roomsController.currentPrivilege, roomsController.deleteRoom)
// router.post('/:idRoom/', authController.protect, express.json(), roomsController.currentPrivilege, roomsController.addUser)
// router.post('/', authController.protect, express.json(), roomsController.createRoom)
module.exports = router;