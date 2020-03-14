const mongoose = require('mongoose');
const Film = require('../models/TicketSchema');

/*
 **
 **
 ** Retrieve Data About Film (Usually For The Filter Section)
 **
 **
 */

exports.getFilms = async(req, res) => {
    try {
        let listofFilms = await Film.find();
        if (listofFilms != null) {
            res.json(listofFilms);
            console.log(listofFilms);
        } else {
            res.send('No Movies Found');
            console.log('No Movies Found');
        }
    } catch (err) {
        console.log('Error Message :' + err);
    }

}

exports.getFilmsByID = (req, res) => {
    try {
        let idFilm = req.params.idFilm;
        let FilmInfo = await Film.findById(idFilm);
        if (FilmInfo != null) {
            res.json(FilmInfo);
            console.log(FilmInfo);
        } else {
            //res.status(404);
            //res.render('404');
            console.log('No Movies Found');
        }
    } catch (err) {
        console.log('Error Message :' + err);
    }
}

exports.getFilmByName = (req, res) => {
    try {
        let searchOption = {};
        let name = req.query.name;
        if (name != null && name != '') {
            searchOption.film_name = new RegExp(name, 'i');
        }
        let listofFilms = await Film.find(searchOption);
        if (listofFilms != null) {
            res.json(listofFilms);
            console.log(listofFilms);
        } else {
            //res.render();
            console.log('No Movies Found');
        }
    } catch (err) {
        console.log('Error Message :' + err);
    }
}

exports.getFilmByGender = (req, res) => {
    try {
        let gender = req.query.gender;
        let listofFilms = await Film.find()
            .where('film_gender').equals(gender);
        if (listofFilms != null) {
            res.json(listofFilms);
            console.log(listofFilms);
        } else {
            //res.render();
            console.log('No Movies Found');
        }
    } catch (err) {
        console.log('Error Message :' + err);
    }
}

exports.getFilmByShowDate = (req, res) => {
    try {
        let showDate = req.query.show_date;
        let listofFilms = await Film.find()
            .where('film_show_date').gte(showDate);
        if (listofFilms != null) {
            res.json(listofFilms);
            console.log(listofFilms);
        } else {
            //res.render();
            console.log('No Movies Found');
        }
    } catch (err) {
        console.log('Error Message :' + err);
    }
}


/*
 **
 **
 ** Add Film Data
 **
 **
 */


exports.addFilm = async(req, res) => {

    //Still Missing FileUpload

    let filmToAdd = {
        film_name: req.body.film_name,
        film_cover: req.body.film_cover,
        film_description: req.body.film_description,
        film_gender: req.body.film_gender,
        film_show_date: req.body.film_show_date,
        film_duration: req.body.film_duration
    }

    let film = new Film(filmToAdd);

    try {
        let addError = Film.validSchemaForm(filmToAdd);
        if (addError.error == null) {
            let added = await film.save();
        } else {
            //res.render();
            console.log(addError);
        }

    } catch (err) {
        console.log(err);
    }
}


/*
 **
 **
 ** Update Film Data
 **
 */

exports.updateFilmById = async(req, res) => {
    let idFilm = req.params.idFilm;
    try {

        let film = await Film.findById(idFilm);
        if (film != null) {

        } else {

        }

    } catch (err) {
        console.log(err);
    }
}

/*
 **
 **
 ** Delete Film Data
 **
 **
 */

exports.deleteFilmById = (req, res) => {

}