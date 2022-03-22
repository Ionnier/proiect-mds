const express = require('express');
const viewController = require('../controllers/viewController')
const authController = require('../controllers/authController');

const router = express.Router();

router.get(['/', '/index'], viewController.getHomePage)

router.get('/login', viewController.getLoginPage)
router.post('/login', viewController.postLoginPage)

router.get('/signup', viewController.getSignUpPage)
router.post('/signup', viewController.postSignUpPage)

router.get('/logout', authController.protect, viewController.getLogOutPage)
router.get("/play", authController.protect, viewController.getPlayPage)


router.get("/*", viewController.getGeneralPage)

module.exports = router;