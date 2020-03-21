const express = require('express');
const router = express.Router();
const FilmController = require('../controllers/FilmController');

router.get('/', FilmController.getFilms);
router.get('/:idFilm', FilmController.getFilmByID);
router.get('/update/:idFilm', FilmController.getFilmByID);
router.put('/update/:idFilm', FilmController.upload.single('film_cover'), FilmController.updateFilmById);
router.delete('/delete/:idFilm', FilmController.deleteFilmById);
router.post('/addfilm', FilmController.upload.single('film_cover'), FilmController.addFilm);


module.exports = router;