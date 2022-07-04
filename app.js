if (process.env.NODE_ENV != "production") {
    require('dotenv').config();
}

const express = require("express");
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');


const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const Joi = require('joi');
const {dishSchema, reviewSchema} = require('./schemas.js');
const methodOverride = require('method-override');
const Dish = require('./models/dishes');
const Order = require('./models/order');

const dishRoutes = require('./routes/dishes');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');
const orderRoutes = require('./routes/orders');
const {isLoggedIn, validateDish, isAuthor, validateReview} = require('./middleware');

//const MongoDBStore = require('connect-mongo')(session);
const MongoStore = require('connect-mongo');
const user = require('./models/user');
const { appendFile } = require('fs');

//const dbUrl = 'mongodb://localhost:27017/danna-kitchen';
//const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/danna-kitchen';
const dbUrl = process.env.DB_URL; 
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});
// mongoose.connect(dbUrl);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))

const SECRET = process.env.SECRET || 'This should be a better secret';
// const store = new MongoDBStore({
//     url: dbUrl,
//     secret: SECRET,
//     touchAfter: 24 * 3600
// });

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: SECRET,
    }
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
})
const sessionConfig = {
    store: store,
    name: 'session',
    secret: SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.get('/fakeUser', async(req, res) => {
    const user = new User({email: 'testing@gmail.com', username: 'xdd'});
    const newUser = await User.register(user, 'xdd');
    res.send(newUser);
})



app.use('/', userRoutes);
app.use('/mainpage', dishRoutes);
app.use('/mainpage/:id/reviews', reviewRoutes);
app.use('/cart', orderRoutes);

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/makedish', catchAsync(async (req, res) => {
    const dish = new Dish({title: 'My Dish'});
    await dish.save();
    res.send(dish)
}));

app.get('/checkout', (req, res) => {
    res.render('dishes/checkout')
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const {statusCode = 500} = err;
    if (!err.message) err.message = 'Something went wrong!';
    res.status(statusCode).render('error', { err });
})
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serving on port ${port}`)
})