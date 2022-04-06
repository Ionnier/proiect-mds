const express = require('express');
const roomsController = require('../controllers/roomsController')
const authController = require('../controllers/authController');

const router = express.Router();

router.delete('/:idRoom/:idUser/', authController.protect, roomsController.currentPrivilege, roomsController.removeUser)
router.patch('/:idRoom/:idUser/', authController.protect, roomsController.currentPrivilege, roomsController.increasePrivilege)
router.post('/:idRoom/:idUser/', authController.protect, roomsController.currentPrivilege, roomsController.transferOwner)
router.post('/:idRoom/', authController.protect, express.json(), roomsController.currentPrivilege, roomsController.renameRoom)
router.post('/', authController.protect, express.json(), roomsController.currentPrivilege, roomsController.addUser)
module.exports = router;