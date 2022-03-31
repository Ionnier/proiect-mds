const express = require('express');
const roomsController = require('../controllers/roomsController')
const authController = require('../controllers/authController');

const router = express.Router();

router.delete('/:idRoom/:idUser/', authController.protect, roomsController.currentPrivilege, roomsController.removeUser)

module.exports = router;