const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Dish = require('../models/dishes');
const Review = require('../models/review');
const {reviewSchema} = require('../schemas.js');
const {isLoggedIn, validateReview, isReviewAuthor} = require('../middleware');
const reviews = require('../controllers/reviews');


router.post('/', isLoggedIn, catchAsync(reviews.createReview))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor,catchAsync(reviews.deleteReview))

module.exports = router;