const express = require('express');
const roomsController = require('../controllers/roomsController')
const authController = require('../controllers/authController');

const router = express.Router();

router.delete('/:idRoom/:idUser/', authController.protect, roomsController.currentPrivilege, roomsController.removeUser)
router.patch('/:idRoom/:idUser/', authController.protect, roomsController.currentPrivilege, roomsController.increasePrivilege)
router.post('/:idRoom/:idUser/', authController.protect, roomsController.currentPrivilege, roomsController.transferOwner)
router.patch('/:idRoom/', authController.protect, express.json(), roomsController.currentPrivilege, roomsController.renameRoom)
router.delete('/:idRoom/', authController.protect, express.json(), roomsController.currentPrivilege, roomsController.deleteRoom)
router.post('/:idRoom/', authController.protect, express.json(), roomsController.currentPrivilege, roomsController.addUser)
router.post('/', authController.protect, express.json(), roomsController.createRoom)
module.exports = router;