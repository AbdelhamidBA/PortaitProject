const Users = require('../models/UserSchema');

const Films = require('../models/FilmSchema');

const FilmReviewSchema = require('../models/FilmReviewSchema');

exports.post_film_review = (req, res, next) => {
    


    Users.findById(req.body.id_user)
        .then(rslt => {
            if (!rslt) {
                return res.status(404).json({
                    message: "There is no user"
                });
            }
            else {
                Films.findById(req.body.id_film).exec().then(r => {
                    if (r) {
                        const filmreview = new FilmReviewSchema({
                            id_user: req.body.id_user,
                            id_film: req.body.id_film,
                            review: req.body.review,
                            feedback: req.body.feedback
                        });
                        res.status(200).json({ message: "succed" });
                        return filmreview
                            .save()
                    }
                    else {
                        res.status(200).json({ message: "the is no film " });

                    }


                })
            }
        })


        .catch(err => {
            console.log(err);
            res.status(500).json({ err: err });

        }

        )
}



exports.get_all_review = (req, res, next) => {
    FilmReviewSchema.find()
        .populate('id_user')
        .populate('id_film')

        .exec()
        .then(docs => {
            if (docs == 0) {
                return res.status(404).json({
                    message: "No Feedback here"
                });
            }
            const response = {
                countFeedback: docs.length,

                Feedbacks: docs.map(doc => {
                    return {
                        id_FeedbackReview: doc._id,
                        id_user: doc.id_user,
                        id_film: doc.id_film,
                        review: doc.review,
                        feedback: doc.feedback
                    }
                })
            }
            res.status(200).json(response);



        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ err: err });
        })

}


exports.patch_feedback_review = (req, res, next) => {
    const id = req.params.idfeedbackreview;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    FilmReviewSchema.updateOne({ _id: id }, { $set: updateOps })
        .exec()
        .then(reslt => {
            console.log(reslt);
            res.status(200).json(reslt);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ err: err })

        });
};



exports.delete_film_review = (req, res, next) => {
    const id = req.params.idfeedbackreview;

    FilmReviewSchema.remove({ _id: id })
        .exec()
        .then(doc => {
            rslt = {
                ALL_Film_Review: "http://localhost:3000/api/feedback/FilmReview",
                message: "feedback was Deleted"
            }
            res.status(200).json(rslt);
        }).catch(err => {
            Console.log(err);
            res.status(200).json({ err: err });
        })

};








