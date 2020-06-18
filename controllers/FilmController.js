const mongoose = require("mongoose");
const Film = require("../models/FilmSchema");
const SoldTicket = require('../models/SoldTicketSchema');
const FilmTicket = require('../models/TicketSchema');
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const moment = require("moment");
const SoldTicketSchema = require("../models/SoldTicketSchema");

const url = "http://localhost:3000/public/";

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
            if (Filter.film_name != undefined && Filter.film_name != "") {
                searchFilter.film_name = new RegExp(Filter.film_name, "i");
            }
            if (
                Filter.film_show_date != undefined &&
                Filter.film_show_date != "" &&
                moment(Filter.film_show_date, "YYYY-MM-DD HH:mm", true).isValid()
            ) {
                searchFilter.film_show_date = Filter.film_show_date;
            }
            if (Filter.film_gender != undefined && Filter.film_gender != "") {
                searchFilter.film_gender = Filter.film_gender;
            }
        }
        let listofFilms = await Film.find(searchFilter).sort({ _id: -1 });
        if (Object.keys(listofFilms).length !== 0) {
            res.json(listofFilms);
        } else {
            res.json(listofFilms);
            console.log(searchFilter);
        }
    } catch (err) {
        console.log("Error Message :" + err);
    }
};

exports.getFilmByID = async(req, res) => {
    try {
        let idFilm = req.params.idFilm;
        let FilmInfo = await Film.findById(idFilm);
        if (Object.keys(FilmInfo).length !== 0) {
            res.json(FilmInfo);
            console.log(FilmInfo);
        } else {
            //res.status(404);
            //res.render('404');
            console.log("No Movies Found");
        }
    } catch (err) {
        console.log("Error Message :" + err);
    }
};

exports.getFilmsByName = async(req, res) => {
    try {
        let searchOption = {};
        let name = req.query.name;
        if (name != null && name != "") {
            searchOption.film_name = new RegExp(name, "i");
        }
        let listofFilms = await Film.find(searchOption);
        if (Object.keys(listofFilms).length !== 0) {
            res.json(listofFilms);
            console.log(listofFilms);
        } else {
            res.json(listofFilms);
        }
    } catch (err) {
        console.log("Error Message :" + err);
    }
};

exports.getFilmsByShowDate = async(req, res) => {
    try {
        let showDate = req.query.show_date;
        let listofFilms = await Film.find()
            .where("film_show_date")
            .gte(showDate);
        if (Object.keys(listofFilms).length !== 0) {
            res.json(listofFilms);
            console.log(listofFilms);
        } else {
            res.json(listofFilms);
        }
    } catch (err) {
        console.log("Error Message :" + err);
    }
};

/*
 **
 **
 ** Add Film Data
 **
 **
 */


exports.addFilm = async(req, res) => {

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
        let addError = film.validSchemaForm(filmToAdd);
        if (addError.error == null) {
            let added = await film.save();
            res.json({
                film: added,
                message: `${added.film_name} Sucessfully Added`,
                error: false
            });

        } else {
            res.json({
                film: null,
                message: `${addError.error}`,
                error: true
            });

        }

    } catch (err) {
        res.json({
            film: null,
            message: err,
            error: true
        });

    }
};



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
            film_cover: req.body.film_cover,
            film_description: req.body.film_description,
            film_gender: req.body.film_gender,
            film_show_date: req.body.film_show_date,
            film_duration: req.body.film_duration
        };

        film.film_name = dataUpdated.film_name;
        film.film_cover = dataUpdated.film_cover;
        film.film_description = dataUpdated.film_description;
        film.film_gender = dataUpdated.film_gender;
        film.film_show_date = dataUpdated.film_show_date;
        film.film_duration = dataUpdated.film_duration;
        let filmUpdated = await film.save();

        if (Object.keys(filmUpdated).length !== 0) {
            res.json({
                film: filmUpdated,
                message: `Film Sucessfully Updated`,
                error: false
            });
        } else {

            res.json({
                film: null,
                message: `Error Updating Film`,
                error: true
            });
        }

    } catch (err) {
        if (Object.keys(film).length === 0) {
            res.sendStatus(404);
        } else {
            res.json({
                film: null,
                message: `${err}`,
                error: true
            });
        }
    }
};


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
    let filmname;
    try {
        film = await Film.findById(filmID);
        //Check if the film to delete has sold tickets or no
        //if it has sold tickets can't remove the film
        //else we delete the film and all its associated tickets
        filmname = film.film_name;
        let del = await film.remove();
        res.json({
            film: del,
            message: `${filmname} Sucessfully Deleted`,
            error: false
        });
    } catch (err) {
        if (Object.keys(film).length == 0) {
            res.sendStatus(404);
        } else {
            res.json({
                film: null,
                message: `${err}`,
                error: true
            });
        }
    }
};


/*
 **
 **
 **  Recommender system
 **
 **
 */

exports.Recommender_SimilarFilm = async(req, res) => {
    let idFilm = req.params.idFilm;
    let filmgender;
    let listofFilms;
    try {
        let film = await Film.findById(idFilm);
        if (Object.keys(film).length !== 0) {
            filmgender = film.film_gender;
            listofFilms = await getFilmByGender(filmgender);
            console.log(listofFilms);
            res.json(listofFilms);
        }
    } catch (err) {
        console.log("Error Recommender SimilarFilm :" + err);
    }
};


exports.FilmJustForYou = async(req, res) => {
    let userID = req.params.idFilm;
    let gender = [];
    let bought = [];
    let final = [];
    let found = false;
    let mostGender = "";
    let mostValue;
    try {
        let soldFilm = await SoldTicket.find({ id_user: userID });
        if (Object.keys(soldFilm).length !== 0) {
            for (let sf of soldFilm) {
                console.log(sf._id);
                let ticket = await FilmTicket.findById(sf.id_ticket);
                bought.push(ticket);
                let film = await Film.findById(ticket.id_Film);
                if (gender.length != 0) {
                    gender.forEach(element => {
                        if (element.gender == film.film_gender) {
                            element.value += 1;
                            found = true;
                        }
                    });
                    if (found == false) {
                        gender.push({
                            gender: film.film_gender,
                            value: 1
                        });
                    } else {
                        found = false;
                    }
                } else {
                    gender.push({
                        gender: film.film_gender,
                        value: 1
                    });
                }
            }
            mostGender = gender[0].gender;
            mostValue = gender[0].value;

            gender.forEach(element => {
                console.log(element);
                if (mostValue < element.value) {
                    mostValue = element.value;
                    mostGender = element.gender;
                }
            });
            console.log("Most:" + mostGender);
            let filmsGen = await getFilmByGender(mostGender);
            for (let f of filmsGen) {
                bought.forEach(element => {
                    if (f._id.toString() == element.id_Film.toString()) {
                        console.log("here");
                        found = true;
                    }
                });
                if (found == false) {
                    final.push(f);
                } else {
                    found = false;
                }

            }
            return res.json(final);



        } else {
            console.log("Empty");
            return null;
        }

    } catch (err) {
        console.log("Error FilmJustForYou :" + err);
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
        console.log("-1");
        return -1;
    }
};


exports.addTrib = async(req, res) => {
    try {
        let data = {
            id_ticket: '5eeb814fe620dd2cd49ad9ec',
            id_user: '5eda2baf501ada3150c893e6',
            date_sold: moment().format('YYYY-MM-DD HH:mm')
        }
        let obj = new SoldTicketSchema(data);
        let add = await obj.save();
        console.log('Done');
    } catch (err) {
        console.log("ADDTRIB:" + err);
    }
}

/*
 **
 **
 ** Extra Needed Functions
 **
 **
 */

// function saveFilmCover(film, coverEncoded) {
//     if (coverEncoded !== null) {
//         const cover = JSON.parse(coverEncoded);
//         if (cover != null && imageMimeTypes.includes(cover.type)) {
//             film.film_cover = new Buffer.from(cover.data, 'base64');
//             film.film_cover_type = cover.type;
//         }
//     }
// }

async function getFilmByGender(gender) {
    try {
        let listofFilms = await Film.find()
            .where("film_gender")
            .equals(gender);
        if (Object.keys(listofFilms).length !== 0) {
            return listofFilms;
        } else {
            return null;
        }
    } catch {
        console.log("Error Gender Function");
    }
}