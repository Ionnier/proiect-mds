const express = require('express');
const servicesController = require('../controllers/servicesController')
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/increase/:idService/', authController.protect, servicesController.upgradeService)
router.get('/:idService/', authController.protect, servicesController.getService)

module.exports = router;