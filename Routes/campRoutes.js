let express = require('express');
let router = express.Router({mergeParams: true});
let Campground = require('../models/campground');


// Error Handling
let AsyncError = require('../utils/AsyncError');
let ExpressError = require('../utils/ExpressError');
let {campgroundSchema} = require('../validations');
let validateCamp = (req, res, next) => {
    let {error} = campgroundSchema.validate(req.body);
    if(error){
        let msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    }
    else next();
}


// Login Requirements
let {isLoggedIn} = require('../middleware');


router.get('/' , AsyncError(async(req, res) => {
    let camps = await Campground.find({});
    res.render('camps', {camps});
}))
router.get('/new', isLoggedIn, (req, res) => {
    res.render('create');
})
router.get('/:id', AsyncError(async(req, res) => {
    let {id} = req.params;
    let camp = await Campground.findById(id).populate({path:'reviews', populate: {path: 'author'}}).populate('author');
    console.log(camp);
    res.render('show', {camp});
}))
router.get('/:id/edit', isLoggedIn, AsyncError(async(req, res) => {
    let {id} = req.params;
    let camp = await Campground.findById(id);
    res.render(`edit`, {camp});
}))


// Post, Put, Delete Routers
router.post('/', validateCamp, isLoggedIn, AsyncError(async(req, res) => {
    let campground = req.body;
    let camp = new Campground(campground);
    camp.author = req.user._id;
    await camp.save();
    res.redirect(`/camps/${camp._id}`);
}))
router.put('/:id', validateCamp, isLoggedIn, AsyncError(async(req, res) => {
    let {id} = req.params;
    let camp_body = req.body;
    let camp = await Campground.findByIdAndUpdate(id, camp_body, {new: true});
    res.redirect(`/camps/${camp._id}`);
}))
router.delete('/:id', isLoggedIn, AsyncError(async(req, res) => {
    let {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/camps');
}))

module.exports = router;