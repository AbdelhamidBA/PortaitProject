const express = require('express');
const router = express.Router();
const FilmController = require('../controllers/FilmController');
router.get('/', FilmController.getFilms);

module.exports = router;