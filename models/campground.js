let mongoose = require('mongoose');
let campgroundSchema = new mongoose.Schema({
    title: String,
    price: Number,
    image: String,
    description: String,
    location: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'review'
        }
    ]
});

module.exports = mongoose.model('campgrounds', campgroundSchema);