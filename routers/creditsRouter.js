const express = require('express');
const creditsController = require('../controllers/creditsController')
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/', authController.protect, creditsController.increaseCredits)

module.exports = router;