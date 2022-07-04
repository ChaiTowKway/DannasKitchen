const Dish = require('../models/dishes');
const User = require('../models/user');
const Order = require('../models/order');
const mongoose = require('mongoose');

module.exports.addItem = async(req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.user._id)) {
        req.flash('error', 'Cannot find the cart!');
        res.redirect('/mainpage');
    }
    const user = await User.findById(req.user._id).populate({
        path: 'order',
        populate: {
            path: 'dishes',
        }
    });
    const order = await Order.findById(user.order).populate({
        path: 'dishes',
        populate: {
            path: 'dish',
        }
    });
    if (!user) {
        req.flash('error', 'Cannot find the user!');
        res.redirect('/mainpage');
    }
    const dishes = order.dishes;
    var totalPrice = 0.00 ;
    for (let dish of dishes) {
        totalPrice = totalPrice + dish.price;
    }
    let prices = totalPrice.toFixed(2);
    res.render('dishes/order', {dishes, prices});
}

module.exports.deleteItem = async(req, res)=>{
    if (!mongoose.Types.ObjectId.isValid(req.user._id)) {
        req.flash('error', 'Cannot find the cart!');
        res.redirect('/mainpage');
    }
    const dishId = req.params.id;
    const user = await User.findById(req.user._id);
    const order = await Order.findById(user.order).populate({
        path: 'dishes',
        populate: {
            path: 'dish',
        }
    });
    await Order.findByIdAndUpdate(order, {$pull: {dishes: dishId}});
    req.flash('success', 'You have successfully removed the item!')
    res.redirect(`/cart`);
}