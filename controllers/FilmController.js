const mongoose = require('mongoose');
const Film = require('../models/TicketSchema');
const moment = require('moment');
const imageMimeTypes = ['image/jpeg', 'image/png'];


/*
 **
 **
 ** Retrieve Data About Film (Usually For The Filter Section)
 **
 **
 */


exports.getFilms = async(req, res) => {
    try {
        let searchFilter = {};
        let Filter = req.query;
        if (Object.keys(req.query).length !== 0) {
            if ((Filter.film_name != undefined) && (Filter.film_name != '')) {
                searchFilter.film_name = new RegExp(Filter.film_name, 'i');
            }
            if ((Filter.film_show_date != undefined) && (Filter.film_show_date != '') &&
                (moment(Filter.film_show_date, 'YYYY-MM-DD HH:mm', true).isValid())) {
                searchFilter.film_show_date = Filter.film_show_date;
            }
            if ((Filter.film_gender != undefined) && (Filter.film_gender != '')) {
                searchFilter.film_gender = Filter.film_gender;
            }

        }
        let listofFilms = await Film.find(searchFilter);
        if (Object.keys(listofFilms).length !== 0) {
            res.json(listofFilms);
        } else {
            res.send('No Movies Found');
            console.log(searchFilter);
        }
    } catch (err) {
        console.log('Error Message :' + err);
    }

}

exports.getFilmsByID = async(req, res) => {
    try {

        let idFilm = req.params.idFilm;
        let FilmInfo = await Film.findById(idFilm);
        if (Object.keys(FilmInfo).length !== 0) {
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

exports.getFilmByName = async(req, res) => {
    try {
        let searchOption = {};
        let name = req.query.name;
        if (name != null && name != '') {
            searchOption.film_name = new RegExp(name, 'i');
        }
        let listofFilms = await Film.find(searchOption);
        if (Object.keys(listofFilms).length !== 0) {
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

exports.getFilmByGender = async(req, res) => {
    try {
        let gender = req.query.gender;
        let listofFilms = await Film.find()
            .where('film_gender').equals(gender);
        if (Object.keys(listofFilms).length !== 0) {
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

exports.getFilmByShowDate = async(req, res) => {
    try {
        let showDate = req.query.show_date;
        let listofFilms = await Film.find()
            .where('film_show_date').gte(showDate);
        if (Object.keys(listofFilms).length !== 0) {
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
        film_description: req.body.film_description,
        film_gender: req.body.film_gender,
        film_show_date: req.body.film_show_date,
        film_duration: req.body.film_duration
    }

    let film = new Film(filmToAdd);
    saveFilmCover(film, req.body.film_cover);
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
    let film;
    let idFilm = req.params.idFilm;
    try {
        film = await Film.findById(idFilm);
        let dataUpdated = {
            film_name: req.body.film_name,
            film_description: req.body.film_description,
            film_gender: req.body.film_gender,
            film_show_date: req.body.film_show_date,
            film_duration: req.body.film_duration
        };

        film.film_name = dataUpdated.film_name;
        film.film_description = dataUpdated.film_description;
        film.film_gender = dataUpdated.film_gender;
        film.film_show_date = dataUpdated.film_show_date;
        film.film_duration = dataUpdated.film_duration;

        if (req.body.film_cover != null && req.body.film_cover != '') {
            saveFilmCover(film, req.body.film_cover);
        }
        await film.save();
        // Here Integration
        console.log("updated");

    } catch {
        if (Object.keys(film).length !== 0) {
            res.status(404);
        } else {
            //res.render();
            console.log('Error Updating Film');
        }
    }
}

/*
 **
 **
 ** Delete Film Data
 **
 **
 */

exports.deleteFilmById = async(req, res) => {
    let filmID = req.params.idFilm;
    let film;
    try {
        film = await Film.findById(filmID);
        //Check if the film to delete has sold tickets or no
        //if it has sold tickets can't remove the film
        //else we delete the film and all its associated tickets
        await film.remove();
        console.log('removed');
    } catch {
        if (Object.keys(film).length == 0) {
            res.status(404);
        } else {

        }
    }
}


/*
 **
 **
 **  Some Aggregation Functions
 **
 **
 */

exports.countFilms = async(req, res) => {
    try {
        let count = await Film.countDocuments();
        console.log(count);
        return count;

    } catch {
        console.log('-1');
        return -1;
    }
};

/*
 **
 **
 ** Extra Needed Functions
 **
 **
 */


function saveFilmCover(film, coverEncoded) {
    if (coverEncoded !== null) {
        const cover = JSON.parse(coverEncoded);
        if (cover != null && imageMimeTypes.includes(cover.type)) {
            film.film_cover = new Buffer.from(cover.data, 'base64');
            film.film_cover_type = cover.type;
        }
    }
}