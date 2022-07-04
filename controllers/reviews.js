const Dish = require('../models/dishes');
const Review = require('../models/review');

module.exports.createReview = async(req, res)=>{
    const dish = await Dish.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    dish.reviews.push(review);
    await review.save();
    await dish.save();
    req.flash('success', 'You have successfully created a new review!')
    res.redirect(`/mainpage/${dish._id}`);
}


module.exports.deleteReview = async(req, res)=>{
    const {id, reviewId} = req.params;
    await Dish.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(req.params.reviewId);
    req.flash('success', 'You have successfully deleted the review!')
    res.redirect(`/mainpage/${id}`);
}