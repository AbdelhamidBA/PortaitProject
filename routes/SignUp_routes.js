const express = require('express');
const router = express.Router();
const signupcontroller = require('../controllers/SingUpController');

router.post('/sign', signupcontroller.AddUser);

module.exports = router;