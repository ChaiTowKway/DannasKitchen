const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Dish = require('../models/dishes');
const {isLoggedIn, validateDish, isAuthor, validateReview} = require('../middleware');
const dishes = require('../controllers/dishes')
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });


router.route('/')
    .get(catchAsync(dishes.index))
    .post(isLoggedIn, validateDish, catchAsync(dishes.createDish))

router.get('/new', isLoggedIn, dishes.renderNewForm);

router.route('/:id')
    .get(catchAsync(dishes.showDish))
    .put(isLoggedIn, isAuthor, validateDish, catchAsync(dishes.updateDish))
    .delete(isLoggedIn, isAuthor, catchAsync(dishes.deleteDish))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(dishes.renderEditForm));

router.post('/:id/order', isLoggedIn, catchAsync(dishes.addOrder))

module.exports = router;