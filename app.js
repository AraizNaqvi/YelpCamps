// Basic Requirements
let express = require('express');
let app = express();
let path = require('path');
let Campground = require('./models/campground');
let method_override = require('method-override');


// Error Handling
let AsyncError = require('./utils/AsyncError');
let ExpressError = require('./utils/ExpressError');
let {campgroundSchema} = require('./validations');

let validateCamp = (req, res, next) => {
    let {error} = campgroundSchema.validate(req.body);
    if(error){
        let msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    }
    else next();
}


// Database Requirements
let mongoose = require('mongoose');
const campground = require('./models/campground');
mongoose.connect('mongodb://127.0.0.1:27017/yelp')
    .then(() => {
        console.log("Mongoose Hit!");
    })
    .catch((e) => {
        console.log(`Error: ${e}`);
    })


let Review = require('./models/reviews');


// Basic Middlewares
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended:true}))
app.use(method_override('_method'));


// Routers
app.get('/home', (req, res) => {
    res.render('home');
})
app.get('/camps', AsyncError(async(req, res) => {
    let camps = await campground.find({});
    res.render('camps', {camps});
}))
app.get('/camps/new', (req, res) => {
    res.render('create');
})
app.get('/camps/:id', AsyncError(async(req, res) => {
    let {id} = req.params;
    let camp = await Campground.findById(id).populate('reviews');
    console.log(camp);
    res.render('show', {camp});
}))
app.get('/camps/:id/edit', AsyncError(async(req, res) => {
    let {id} = req.params;
    let camp = await Campground.findById(id);
    res.render(`edit`, {camp});
}))


// Post, Put, Delete Routers
app.post('/camps', validateCamp, AsyncError(async(req, res, next) => {
    let {campground} = req.body;
    let camp = new Campground(campground);
    await camp.save();
    res.redirect(`/camps/${camp._id}`);
}))
app.put('/camps/:id', validateCamp, AsyncError(async(req, res) => {
    let {id} = req.params;
    let {title, location} = req.body;
    let camp = await Campground.findByIdAndUpdate(id, {title, location});
    res.redirect(`/camps/${camp._id}`);
}))
app.delete('/camps/:id', AsyncError(async(req, res) => {
    let {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/camps');
}))
app.post('/camps/:id/reviews', AsyncError(async(req, res) => {
    let {id} = req.params;
    let camp = await Campground.findById(id);
    let review = new Review(req.body);
    camp.reviews.push(review);
    await review.save();
    await camp.save();
    res.redirect(`/camps/${id}`);
}))
app.delete('/camps/:id/reviews/:reviewId', AsyncError(async(req, res) => {
    let {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/camps/${id}`);
}))
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