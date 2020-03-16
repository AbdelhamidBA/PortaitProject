const express = require('express');
const router = express.Router();
const FilmController = require('../controllers/FilmController');
router.get('/', FilmController.getFilms);
router.get('/Count', FilmController.countFilms);

module.exports = router;