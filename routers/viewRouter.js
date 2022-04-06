const express = require('express');
const viewController = require('../controllers/viewController')
const authController = require('../controllers/authController');
const creditsController = require('../controllers/creditsController');
const servicesController = require('../controllers/servicesController');
const roomsController = require('../controllers/roomsController');

const router = express.Router();

router.get(['/', '/index'], viewController.getHomePage)

router.get('/login', viewController.getLoginPage)
router.post('/login', viewController.postLoginPage)

router.get('/signup', viewController.getSignUpPage)
router.post('/signup', viewController.postSignUpPage)

router.get('/logout', authController.protect, viewController.getLogOutPage)
router.get("/play", authController.protect, servicesController.updateServices, creditsController.updateCredits, viewController.getPlayPage)

router.get("/rooms", authController.protect, viewController.getRoomsPage)
router.get("/room/:idRoom/", authController.protect, roomsController.addRoomUtils, roomsController.currentPrivilege, viewController.getRoomPage)

router.get("/*", viewController.getGeneralPage)

module.exports = router;