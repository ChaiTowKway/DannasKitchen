const Dish = require('../models/dishes');
const User = require('../models/user');
const Order = require('../models/order');
const mongoose = require('mongoose');

module.exports.index = async(req, res) => {
    const dishes = await Dish.find({});
    res.render('dishes/index', {dishes})
}

module.exports.renderNewForm = (req, res) => {
    res.render('dishes/new');
}

module.exports.createDish = async(req, res, next) => {
    const dish = new Dish(req.body.dish);
    dish.author = req.user._id;
    await dish.save();
    req.flash('success', 'You have successfully made a new dish!')
    res.redirect(`/mainpage/${dish._id}`)
}

module.exports.showDish = async(req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        req.flash('error', 'Cannot find the dish!');
        res.redirect('/mainpage');
    }
    const dish = await Dish.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author',
        }
    }).populate('author');
    if (!dish) {
        req.flash('error', 'Cannot find the dish!');
        res.redirect('/mainpage');
    }
    res.render('dishes/show', {dish});
}

module.exports.renderEditForm = async(req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        req.flash('error', 'Cannot find the dish!');
        res.redirect('/mainpage');
    }
    const { id } = req.params;
    const dish = await Dish.findById(id);
    if (!dish) {
        req.flash('error', 'Cannot find the dish!');
        res.redirect('/mainpage');
    }
    res.render('dishes/edit', {dish})
}

module.exports.updateDish = async(req, res) => {
    const { id } = req.params;
    const dish = await Dish.findByIdAndUpdate(id, {...req.body.dish}, );
    req.flash('success', 'You have successfully updated the dish!')
    res.redirect(`/mainpage/${dish._id}`)
}

module.exports.deleteDish = async(req, res) => {
    const {id} = req.params;
    await Dish.findByIdAndDelete(id);
    req.flash('success', 'You have successfully deleted the dish!')
    res.redirect('/mainpage');
}


module.exports.addOrder = async (req, res) => {
    const dish = await Dish.findById(req.params.id);
    const user = await User.findById(req.user._id);
    if (!user.order) {
        const order = new Order();
        await order.save();
        user.order = order;
        await user.save();
    }
    const order = await Order.findById(user.order);
    if (order.dishes.indexOf(req.params.id) == -1 ) {
        order.dishes.push(dish);
    }
    await order.save();
    await user.save();
    req.flash('success', 'You have successfully added the item into cart!')
    res.redirect(`/mainpage/${dish._id}`);
}