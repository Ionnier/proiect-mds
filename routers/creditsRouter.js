const express = require('express');
const creditsController = require('../controllers/creditsController')
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/increase', authController.protect, creditsController.increaseCredits)
router.get('/', authController.protect, creditsController.getCredits)

module.exports = router;