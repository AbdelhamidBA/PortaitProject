const Feedbacks = require('../models/FeedbackSchema');
const users = require('../models/UserSchema');
const mongoose = require('mongoose');



exports.post_feedback = (req, res, next) => {

    users.findById(req.body.id_user)

        .then(user => {
            if (!user) {
                return res.status(404).json({
                    message: "user not found"
                });
            }
            const feedback = new Feedbacks({

                id_user: req.body.id_user,
                subject: req.body.subject,
                feedback: req.body.feedback

            });
            return feedback
                .save()

        }).then(result => {
            console.log(result);
            res.status(200).json({
                message: "feedback posted",
                createFeedback: {
                    id_user: result.id_user,
                    subject: result.subject,
                    feedback: result.feedback

                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ err: err });

        }
        
        )

}

exports.get_all_feedback = (req, res, next) => {
    Feedbacks.find()
    .populate('id_user')
        .exec()
        .then(docs => {
            if (docs==0) {
                return res.status(404).json({
                    message: "No Feedback here"
                });
            }
            const response = {
                countFeedback: docs.length,

                Feedbacks: docs.map(doc => {
                    return {
                        id_feedback:doc._id,
                        id_userCorresp: doc.id_user,
                        subject: doc.subject,
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

exports.get_feedback_byId=(req,res,next)=>{
    Feedbacks.findById(req.params.idfeedback)
    .then(rslt=>{
        const feed={
            id_feedback:rslt._id,
            id_userCorresp:rslt.id_user,
            subject:rslt.subject,
            feedback:rslt.feedback

        }
        res.status(200).json({feed});
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ err: err });
    })}
