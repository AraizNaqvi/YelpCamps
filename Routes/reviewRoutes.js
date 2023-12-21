let express = require('express');
let router = express.Router({mergeParams: true});
let Campground = require('../models/campground');
let Review = require('../models/reviews');

// Error Handling
let AsyncError = require('../utils/AsyncError');
let ExpressError = require('../utils/ExpressError');
const { isLoggedIn } = require('../middleware');


router.post('/', isLoggedIn, AsyncError(async(req, res) => {
    let {id} = req.params;
    let camp = await Campground.findById(id);
    let review = new Review(req.body);
    review.author = req.user._id;
    camp.reviews.push(review);
    await review.save();
    await camp.save();
    res.redirect(`/camps/${id}`);
}))
router.delete('/:reviewId', isLoggedIn, AsyncError(async(req, res) => {
    let {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/camps/${id}`);
}))

module.exports = router;