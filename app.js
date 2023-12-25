if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}

// Basic Requirements
let express = require('express');
let app = express();
let path = require('path');
let Campground = require('./models/campground');
let method_override = require('method-override');


// Database Requirements
let mongoose = require('mongoose');
const campground = require('./models/campground');
let Review = require('./models/reviews');
mongoose.connect('mongodb://127.0.0.1:27017/yelp')
    .then(() => {
        console.log("Mongoose Hit!");
    })
    .catch((e) => {
        console.log(`Error: ${e}`);
    })


// Basic Middlewares
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended:true}));
app.use(method_override('_method'));


// User Requirements
let User = require('./models/user');
let passport = require('passport');
let localStratergy = require('passport-local');
let session = require('express-session');
let user = require('./Routes/userRoutes');
const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStratergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// Route Management
let camps = require('./Routes/campRoutes');
let reviews = require('./Routes/reviewRoutes');

app.use((req, res, next) => {
    console.log(req.session);
    res.locals.currentUser = req.user;
    next();
})

app.use('/', user);
app.use('/camps/:id/reviews', reviews);
app.use('/camps', camps);
app.get('/home', (req, res) => {
    res.render('home');
})
app.get('/contact', (req, res) => {
    res.render('contact');
})
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})


// Mother Error Router
app.use((err, req, res, next) => {
    let {message = "Something went wrong!", statusCode = 400} = err;
    res.status(statusCode).render('error', {err});
})

app.listen(3000, () => {
    console.log("Server is Hit!");
})