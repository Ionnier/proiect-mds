const express = require('express');
const notificationsController = require('../controllers/notificationsController')
const authController = require('../controllers/authController')
const webpush = require('web-push')

const router = express.Router();

router.get('/settings/:type/', authController.protect, notificationsController.toggleSettings)
router.post('/endpoint', authController.protect, express.json(), notificationsController.addEndpoints)
router.delete('/endpoint', authController.protect, notificationsController.deleteEndpoints)


exports.notificationsRouter = router;

exports.setUpNotificationServer = notificationsController.setUpNotificationServer;