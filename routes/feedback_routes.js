const express = require('express');
const router = express.Router();
const FeedbackContoller = require('../controllers/FeedbackController');
const FilmReviewController = require('../controllers/FilmReviewController');



router.post('/',FeedbackContoller.post_feedback);
router.get('/',FeedbackContoller.get_all_feedback);





router.get('/FilmReview',FilmReviewController.get_all_review);
router.post('/FilmReview',FilmReviewController.post_film_review);

router.patch('/FilmReview/:idfeedbackreview',FilmReviewController.patch_feedback_review);
router.delete('/FilmReview/:idfeedbackreview',FilmReviewController.delete_film_review);





router.get('/:idfeedback',FeedbackContoller.get_feedback_byId);

   


    module.exports = router;