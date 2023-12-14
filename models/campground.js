let mongoose = require('mongoose');
let campgroundSchema = new mongoose.Schema({
    title: String,
    price: Number,
    image: String,
    description: String,
    location: String,
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'review'
        }
    ]
});

module.exports = mongoose.model('campgrounds', campgroundSchema);