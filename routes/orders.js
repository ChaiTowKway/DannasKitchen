const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Dish = require('../models/dishes');
const Order = require('../models/order');
const User = require('../models/user');
const {OrderSchemas} = require('../schemas.js');
const {isLoggedIn, validateReview, isReviewAuthor} = require('../middleware');
const order = require('../controllers/orders');


router.get('/', isLoggedIn, catchAsync(order.addItem))
router.delete('/:id', isLoggedIn, catchAsync(order.deleteItem))

module.exports = router;