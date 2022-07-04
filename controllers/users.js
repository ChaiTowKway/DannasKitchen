const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    res.render('../views/users/register');
}

module.exports.register = async(req, res, next) => {
    try {
        const {email, username, password} = req.body;
        const user = new User({email, username});
        
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Danna"s Kitchen!');
            res.redirect('/mainpage');
        })
        
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}

module.exports.renderLogin =(req, res) => {
    res.render('../views/users/login');
}

module.exports.login = (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = req.session.returnTo || '/mainpage';
    delete req.session.returnTo;
    res.redirect('/mainpage');
}

module.exports.logout = (req, res, next) => {
    //console.log("error logout");
    // req.logout((error) => {
    //     if (error) {
    //         console.log(error);
    //         return next(error);
    //     }
    //     // console.log("success logout");
    //     req.flash('success', "Goodbye!");
    //     res.redirect('/mainpage');
    // });
    req.logout();
    req.flash('success', "Goodbye!");
    res.redirect('/mainpage');
}